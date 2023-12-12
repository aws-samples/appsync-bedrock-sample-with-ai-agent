import boto3, json
from chatResponder import ChatResponder
from botocore.config import Config
import threading, time
from queue import Queue

bedrock = boto3.client('bedrock-runtime', config=Config(region_name='us-east-1'))

def anthropic_bedrock_stream (prompt, targetQueue):

    response = bedrock.invoke_model_with_response_stream(
        body=json.dumps({
            "prompt": prompt + "\nAssistant: ",
            "max_tokens_to_sample":500,
            "temperature":0,
            "top_k":250,
            "top_p":0.999,
            "stop_sequences":[],
            "anthropic_version":"bedrock-2023-05-31",
        }),
        modelId='anthropic.claude-v2'
    )

    stream = response.get('body')
    for event in stream:
        chunk = event.get('chunk')
        if chunk:
            chunk_obj = json.loads(chunk.get('bytes').decode())
            text = chunk_obj['completion']
            targetQueue.put(text)

    targetQueue.put(None)

def handler(event, context):

    # Setup ability to Respond to chat
    chatResponder = ChatResponder(event['conversationData']['id'])    

    # Stream
    stream_ended = False
    full_message = ""

    try:
        
        # Start realtime publishing token queue
        queue = Queue()
        streamingThread = threading.Thread(
            target=anthropic_bedrock_stream, 
            args=(event['chatString'], queue)
        )
        streamingThread.start()

        # Read from it in chunks at 300ms intervals
        while not stream_ended:
            
            chunk = ""
            while not queue.empty():
                nextResult = queue.get()
                if nextResult == None:
                    stream_ended = True
                else:
                    chunk += nextResult

            chatResponder.publish_agent_partial_message(chunk)
            full_message += chunk
            time.sleep(0.3)

    except Exception as e:
        print(e)

    # Mark metadata as done responding
    chatResponder.publish_agent_message(full_message)
    chatResponder.publish_agent_stop_responding()