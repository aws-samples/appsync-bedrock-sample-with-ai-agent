#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppsyncAgentAPIStack } from '../lib/appsync-agent-api-stack';

// We create a new 'AppsyncAgentAPIStack' which holds all the infrastructure
// code needed to deploy the API
new AppsyncAgentAPIStack(new cdk.App(), 'AppsyncAgentAPIDemoRepo', {

	// Setting it to us-east-1 as bedrock is not available in all regions.
	env: {
		region: 'us-east-1'
	}
});