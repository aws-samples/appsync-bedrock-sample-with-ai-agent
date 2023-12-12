import boto3, os, json
from requests_aws4auth import AWS4Auth
from .claudeChat import ChatBedrockClaude
from langchain.agents import AgentType, initialize_agent
from .graphqlTool import BaseGraphQLTool
from .graphqlWrapper import GraphQLAPIWrapper

def get_graphql_tool(**kwargs):
    return BaseGraphQLTool(graphql_wrapper=GraphQLAPIWrapper(**kwargs))

def buildAgent (**kwargs):

    # Build llm handler    
    claude = ChatBedrockClaude(system_role=kwargs.get('system'))
    
    appsync_tool = BaseGraphQLTool(
        graphql_wrapper=GraphQLAPIWrapper(
            graphql_endpoint=kwargs.get('graphql_endpoint'),
            custom_headers={
                'Authorization': kwargs.get('authHeader')
            }
        )
    )
    
    agent = initialize_agent([appsync_tool], claude, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)
    return agent