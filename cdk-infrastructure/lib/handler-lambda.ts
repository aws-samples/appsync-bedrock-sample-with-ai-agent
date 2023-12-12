import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as awsAppsync from 'aws-cdk-lib/aws-appsync'
import * as path from 'path';

import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface FoundationModelHandlerProps {
    agentApi: {
        lambdaInvokerRole: iam.Role,
        appsyncApi: awsAppsync.GraphqlApi,
    }
    toolApi?: awsAppsync.GraphqlApi,
    lambdaPath: string,
}

export function buildFoundationModelHandler(scope: Construct, props: FoundationModelHandlerProps) {

    const role = new iam.Role(scope, 'AgentLambdaFunction-execution-role-' + props.lambdaPath, {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
        ], 
        inlinePolicies: {
            agentAPiInvoker: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        actions: ['appsync:GraphQL'],
                        resources: [
                            props.agentApi.appsyncApi.arn,
                            props.agentApi.appsyncApi.arn + '/*',
                            props.toolApi && props.toolApi.arn,
                            props.toolApi && props.toolApi.arn + '/*',
                        ].filter(_ => !!_) as string[]
                    })
                ]
            }),
            bedrockAccessPolicy: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        actions: [
                            'bedrock:InvokeModel',
                            'bedrock:InvokeModelWithResponseStream'
                        ],
                        resources: ['*']
                    })
                ]
            })
        }
    })

    // Build function with docker
    const lambdaFunction = new lambda.DockerImageFunction(scope, "AppsyncAgentFunction-" + props.lambdaPath, {
        functionName: "AppsyncAgentFunction-" + props.lambdaPath,
        code: lambda.DockerImageCode.fromImageAsset(
            path.join(__dirname, "../../" + props.lambdaPath)
        ),
        environment: {
            AGENT_API_URL: props.agentApi.appsyncApi.graphqlUrl,
        },
        timeout: Duration.minutes(5),
        memorySize: 1024,
        role
    });

    // And allow appsync to invoke this function and this function to invoke appsync
    lambdaFunction.grantInvoke(props.agentApi.lambdaInvokerRole)
    props.agentApi.appsyncApi.grantMutation(role)

    // Build exports
    new cdk.CfnOutput(scope, props.lambdaPath, { exportName: props.lambdaPath, value: lambdaFunction.functionName })

    return lambdaFunction
}
    