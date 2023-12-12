import * as cdk from 'aws-cdk-lib';
import * as awsAppsync from 'aws-cdk-lib/aws-appsync'
import * as path from 'path'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';

import { Construct } from 'constructs';
import { addJsResolver } from '../agent-api/appsync-js-functions';

interface CarDealerApiProps {
    cognito: cognito.UserPool
}

export function buildCarDealerApi(scope: Construct, props: CarDealerApiProps) {

    const appsyncApi = new awsAppsync.GraphqlApi(scope, 'CarDealerApi', {
        name: 'AI-Agent-Playground-CarDealerApi',
        schema: awsAppsync.SchemaFile.fromAsset(
            path.join(__dirname, './schema.graphql')
        ),
        authorizationConfig: {
            defaultAuthorization: {
                authorizationType: awsAppsync.AuthorizationType.USER_POOL,
                userPoolConfig: {
                    userPool: props.cognito
                }
            },
            additionalAuthorizationModes: [
                {
                    authorizationType: awsAppsync.AuthorizationType.API_KEY,
                    apiKeyConfig: {
                        expires: cdk.Expiration.after(cdk.Duration.days(30))
                    }
                }
            ]
        },
        logConfig: {
            fieldLogLevel: awsAppsync.FieldLogLevel.ALL,
        },
    })

    // Build a data table for this api, everything is placed into a single table for simplicity
    let dataTable = new dynamodb.Table(scope, 'MyCarDealerDataTable', {
        partitionKey: {
            name: 'recordType',
            type: dynamodb.AttributeType.STRING
        },
        sortKey: {
            name: 'id',
            type: dynamodb.AttributeType.STRING
        }
    })

    // We add the data sources for tables to this api
    let dataTableDS = appsyncApi.addDynamoDbDataSource('carDealerDataTable', dataTable)

    // Then build resolvers with JS runtime for aws appsync
    addJsResolver(scope, appsyncApi, 'Query.listCars', {
        code: 'scanType',
        dataSource: dataTableDS,
        replacements: { type : 'car' },
        codePath: __dirname
    })

    addJsResolver(scope, appsyncApi, 'Query.listCustomers', {
        code: 'scanType',
        dataSource: dataTableDS,
        replacements: { type : 'customer' },
        codePath: __dirname
    })
    
    addJsResolver(scope, appsyncApi, 'Query.listSales', {
        code: 'scanType',
        dataSource: dataTableDS,
        replacements: { type : 'sale' },
        codePath: __dirname
    })

    addJsResolver(scope, appsyncApi, 'Query.listSalespeople', {
        code: 'scanType',
        dataSource: dataTableDS,
        replacements: { type : 'salesPerson' },
        codePath: __dirname
    })

    addJsResolver(scope, appsyncApi, 'Mutation.addCar', {
        code: 'createType',
        dataSource: dataTableDS,
        replacements: { type : 'car' },
        codePath: __dirname
    })

    addJsResolver(scope, appsyncApi, 'Mutation.addCustomer', {
        code: 'Mutation.addCustomer',
        dataSource: dataTableDS,
        codePath: __dirname
    })
    
    addJsResolver(scope, appsyncApi, 'Mutation.addSalesperson', {
        code: 'Mutation.addSalesPerson',
        dataSource: dataTableDS,
        codePath: __dirname
    })

    addJsResolver(scope, appsyncApi, 'Mutation.makeSale', [
        {
            code: 'Mutation.makeSale.addRecord',
            dataSource: dataTableDS,
            codePath: __dirname
        },
        {
            code: 'Mutation.makeSale.linkCustomer',
            dataSource: dataTableDS,
            codePath: __dirname
        },
        {
            code: 'Mutation.makeSale.linkSalesperson',
            dataSource: dataTableDS,
            codePath: __dirname
        }
    ])
    
    addJsResolver(scope, appsyncApi, 'Customer.purchases', {
        code: 'Customer.purchases',
        dataSource: dataTableDS,
        replacements: {table: dataTable.tableName},
        codePath: __dirname
    })

    addJsResolver(scope, appsyncApi, 'Salesperson.sales', {
        code: 'Salesperson.sales',
        dataSource: dataTableDS,
        replacements: {table: dataTable.tableName},
        codePath: __dirname
    })
    
    addJsResolver(scope, appsyncApi, 'Sale.salesperson', {
        code: 'Sale.salesperson',
        dataSource: dataTableDS,
        codePath: __dirname
    })

    addJsResolver(scope, appsyncApi, 'Sale.customer', {
        code: 'Sale.customer',
        dataSource: dataTableDS,
        codePath: __dirname
    })

    addJsResolver(scope, appsyncApi, 'Sale.car', {
        code: 'Sale.car',
        dataSource: dataTableDS,
        codePath: __dirname
    })

    addJsResolver(scope, appsyncApi, 'Mutation.sendEmail', {
        code: 'Mutation.sendEmail',
        dataSource: dataTableDS,
        codePath: __dirname
    })

    addJsResolver(scope, appsyncApi, 'Query.listEmails', {
        code: 'scanType',
        dataSource: dataTableDS,
        replacements: { type : 'email' },
        codePath: __dirname
    })

    // Export values
    new cdk.CfnOutput(scope, 'car-dealer-api', { exportName: 'car-dealer-api', value: appsyncApi.graphqlUrl })
    new cdk.CfnOutput(scope, 'dealership-table', { exportName: 'dealership-table', value: dataTable.tableName })

    return appsyncApi
}