import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

import { Construct } from 'constructs';

/*
* ...
* */

export function buildTables (scope: Construct) {

	// Audio table - for the list of audio recordings
	const audioTable = new dynamodb.Table(scope, 'MyAudioRecordingsDDBTable', {
		partitionKey: {
			name: 'id',
			type: dynamodb.AttributeType.STRING
		},
	})

	// Agents table - for the list of agents 
	const agentTable = new dynamodb.Table(scope, 'MyAgentsDDBTable', {
		partitionKey: {
			name: 'id',
			type: dynamodb.AttributeType.STRING
		},
	})
	
	// Actions table - for the list of actions, each agent is mapped to some actions
	const actionTable = new dynamodb.Table(scope, 'MyActionsDDBTable', {
		partitionKey: {
			name: 'id',
			type: dynamodb.AttributeType.STRING
		},
	})

	// Conversations table - to store the collection of available conversations
	const conversationTable = new dynamodb.Table(scope, 'MyConversationsDDBTable', {
		partitionKey: {
			name: 'id',
			type: dynamodb.AttributeType.STRING
		},
	})

	// Events table - for the list of events, each conversation owning a collection of these
	const eventTable = new dynamodb.Table(scope, 'MyEventsDDBTable', {
		partitionKey: {
			name: 'conversationId',
			type: dynamodb.AttributeType.STRING
		},
		sortKey: {
			name: 'id',
			type: dynamodb.AttributeType.STRING
		}
	})

	// Export the values

    new cdk.CfnOutput(scope, 'agents-table', { exportName: 'agents-table', value: agentTable.tableName })
	new cdk.CfnOutput(scope, 'actions-table', { exportName: 'actions-table', value: actionTable.tableName })
	new cdk.CfnOutput(scope, 'conversations-table', { exportName: 'conversations-table', value: conversationTable.tableName })
	new cdk.CfnOutput(scope, 'events-table', { exportName: 'events-table', value: eventTable.tableName })

	// Expose tables to other constructs that need to be build
	return {
		audioTable,
		agentTable,
		actionTable,
		conversationTable,
		eventTable
	}
}