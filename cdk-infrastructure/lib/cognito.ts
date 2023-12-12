import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export function buildCognitoAuth (scope: Construct) {
    
    const userPool = new cognito.UserPool(scope, 'auth-user-pool', {
            userPoolName: 'appsync-playground-demo-user-pool',
            signInAliases: { email: true,},
            selfSignUpEnabled: true,
            autoVerify: { email: true },
            userVerification: {
                emailSubject: 'You need to verify your email for the playground',
                emailBody: 'Thanks for signing up Your verification code is {####}',
                emailStyle: cognito.VerificationEmailStyle.CODE,
            },
            passwordPolicy: {
                minLength: 8
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
    
    const userClient = userPool.addClient('auth-app-client', {
        userPoolClientName: 'appsync-playground-demo-client',
        authFlows: {
            userPassword: true,
            userSrp: true,
        },
    });

    new cdk.CfnOutput(scope, 'cognito-pool', {
        exportName: 'cognito-pool',
        value: userPool.userPoolId
    })
    
    new cdk.CfnOutput(scope, 'cognito-client', {
        exportName: 'cognito-client',
        value: userClient.userPoolClientId
    })

    return userPool
}