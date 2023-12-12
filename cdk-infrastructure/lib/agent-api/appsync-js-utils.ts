import { util } from '@aws-appsync/utils';

export function DynamodbBatchGetIdsWithType (ids: string[], keyJoin: any, table: string){

    const keys = []

    if (!ids || ids.length == 0) {
        return {
            operation: 'GetItem',
            key:  util.dynamodb.toMapValues({ id: "" })
        };
    }
    
    for (let id of ids){
        keys.push(
            util.dynamodb.toMapValues({ id, ...keyJoin })
        )
    }

    return { 
        operation: 'BatchGetItem', 
        tables: { [table]: { keys } }
    }
}

export function DynamodbBatchGet (ids: string[], table: string){

    const keys = []

    if (!ids || ids.length == 0) {
        return {
            operation: 'GetItem',
            key:  util.dynamodb.toMapValues({ id: "" })
        };
    }
    
    for (let id of ids){
        keys.push(
            util.dynamodb.toMapValues({ id })
        )
    }

    return { 
        operation: 'BatchGetItem', 
        tables: { [table]: { keys } }
    }
}
