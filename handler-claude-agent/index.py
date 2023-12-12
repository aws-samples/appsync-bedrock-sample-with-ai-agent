from dotenv import load_dotenv
from src.agent import buildAgent
from src.claudeInvoker import claude_bedrock
import json
load_dotenv()
from src.chatResponder import ChatResponder

def handler(event, context):

    # Connect and record user message
    chatResponder = ChatResponder(event['conversationData']['id'])
    
    try:

        # This is built to work with appsync, so if there is no appsync connection, just do a plain chat
        if (len(event['agentData']['actions']) == 0):
            print('Note: this FM handler is intended to be used with an appsync tool, but you have not specified one. As such you are now just chatting with claude')
            chatResponder.publish_agent_message(claude_bedrock(event['chatString']))
            return

        agent = buildAgent(
            graphql_endpoint=event['agentData']['actions'][0]['resource'],
            system=event['agentData']['systemPrompt'],
            authHeader=event['headers']['authorization']
        )
        
        result = agent.run('''
            The schema above is live. Please continue this conversation using it as needed. 
            Please use the shema and any previous queries to move towards a solution to the questions the human asks.
        ''' + event['chatString'])
        chatResponder.publish_agent_message(result)

    except Exception as e:
        print(e)
        pass

    # Mark metadata as done responding
    chatResponder.publish_agent_stop_responding()
