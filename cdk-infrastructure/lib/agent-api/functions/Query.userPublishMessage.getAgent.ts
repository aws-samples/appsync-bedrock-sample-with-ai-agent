import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
    return {
        operation: 'GetItem',
        key: util.dynamodb.toMapValues({ 
            id: ctx.stash.conversationData.agent
        })
    }
}

export function response(ctx: Context) {
    ctx.stash.agentData = ctx.result
    return ctx.result
}