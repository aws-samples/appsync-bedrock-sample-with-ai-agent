from gql import Client, gql
from gql.transport.requests import RequestsHTTPTransport
from requests_aws4auth import AWS4Auth
import os, boto3

class ChatResponder:

    def __init__(self, conversationId):

        credentials = boto3.Session().get_credentials()
        aws_auth = AWS4Auth(
            credentials.access_key,
            credentials.secret_key,
            os.environ['AWS_REGION'],
            "appsync",
            session_token=credentials.token,
        )
        self.transport = RequestsHTTPTransport(
            auth=aws_auth,
            url=os.environ['AGENT_API_URL']
        )
        self.client = Client(transport=self.transport, fetch_schema_from_transport=True)
        self.conversationId = conversationId

        ChatResponder.instance = self
        self.publish_agent_start_responding()

    def _send_notification(self, sender, data):
        
        defaultQuery = gql('''
            mutation SendConversationUpdate($config: NewAgentAction!) {
                agentPublishEvent(config: $config) {
                    id
                    conversationId
                    sender
                    timestamp
                    event {
                        actionRequested
                        actionResult
                        innerDialog
                        message
                    }
                }
            }
        ''')

        variables = {
            "config": {
                "conversationId": self.conversationId,
                "event": data,
                "sender": sender
            }
        }

        self.client.execute(defaultQuery, variable_values=variables)

    def _send_metadata(self, data):
        
        defaultQuery = gql('''
            mutation SendConversationUpdate($config: NewAgentMetadata!) {
                agentPublishMetadata(config: $config) {
                    conversationId
                    agentStartResponding
                    agentStopResponding
                    agentPartialMessage
                }
            }
        ''')

        variables = {
            "config": {
                "conversationId": self.conversationId,
                **data
            }
        }

        self.client.execute(defaultQuery, variable_values=variables)

    def publish_agent_message(self, data):
        self._send_notification('agent', {
            'message': data,
        })

    def publish_agent_start_responding(self):
        self._send_metadata({
            'agentStartResponding': True,
        })

    def publish_agent_stop_responding(self):
        self._send_metadata({
            'agentStopResponding': True,
        })

    def publish_agent_partial_message(self, data):
        self._send_metadata({
            'agentPartialMessage': data,
        })