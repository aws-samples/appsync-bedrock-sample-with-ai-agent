import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { buildFoundationModelHandler, buildCognitoAuth, buildAgentApi, buildCarDealerApi, buildTables } from '.';

export class AppsyncAgentAPIStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // First we need to build the dynamodb tables we will need storing and managing configs
        // These tables are consumed by the apis to store metadata and conversation data
        const tables = buildTables(this)

        // We also need to build a user pool for the auth flow
        const cognito = buildCognitoAuth(this)

        // Next we will build a "agent api", this api manages the actual communication with the agents
        // and the invocation of agent handlers that is where custom LLM business logic lives
        // Inside we define resolvers to handle this interaction
        const agentApi = buildAgentApi(this, { cognito, tables, enableConstructingAgents: false })
        
        // We also build some example graphql apis that help facilitate the playground experience
        const carDealerExample = buildCarDealerApi(this, { cognito })

        // And we also build out a collection of foundation model handlers for the sample
        // these are where customer business logic could live that determines how each agent acts 
        // you can choose the llm, and whatever else you need to pull in.
        // We hook them directly into the agent api

        const synchronousChat = buildFoundationModelHandler(this, { 
            agentApi, 
            lambdaPath: 'handler-claude-simple' 
        })

        const websocketChat = buildFoundationModelHandler(this, {
            agentApi, 
            lambdaPath: 'handler-claude-websocket' 
        })
        
        const agentChat = buildFoundationModelHandler(this, { 
            agentApi,
            toolApi: carDealerExample,
            lambdaPath: 'handler-claude-agent' 
        })

        // For later use in website, we also record the deployed region
        new cdk.CfnOutput(this, 'Region', { value: this.region })

    }
}
