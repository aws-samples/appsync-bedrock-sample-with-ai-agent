import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
    return {
        operation: 'GetItem',
        key: util.dynamodb.toMapValues({ 
            id: ctx.arguments.conversationId
        })
    };
}

export function response(ctx: Context) {
    ctx.stash.conversationData = ctx.result
    return ctx.result
}