import boto3, json
from chatResponder import ChatResponder
from botocore.config import Config

bedrock = boto3.client('bedrock-runtime', config=Config(region_name='us-east-1'))

def anthropic_bedrock (prompt):

    response = bedrock.invoke_model(
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

    raw_body = response['body'].read().decode("utf-8")
    response_json = json.loads(raw_body)
    
    return (([*response_json.values()][0]))

def handler(event, context):

    # Setup ability to Respond to chat
    chatResponder = ChatResponder(event['conversationData']['id'])    

    try:
        # Forward to anthropic
        response = anthropic_bedrock(event['chatString'])
        chatResponder.publish_agent_message(response)

    except:
        pass

    # Mark metadata as done responding
    chatResponder.publish_agent_stop_responding()