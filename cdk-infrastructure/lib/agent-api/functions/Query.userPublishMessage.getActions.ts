import { Context } from '@aws-appsync/utils'
import { DynamodbBatchGet } from '../appsync-js-utils';

export function request(ctx: Context) {
    return DynamodbBatchGet(ctx.stash.agentData.actions, '$table')
}

export function response(ctx: Context) {
    if (ctx.result && ctx.result.data && ctx.result.data['$table']) {
        ctx.stash.agentData.actions =  ctx.result.data['$table']
    }
    else {
        ctx.stash.agentData.actions = []
    }
    return {}
}