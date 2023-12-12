import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
        id: util.time.nowISO8601() + '-' + util.autoId(),
    }),
    attributeValues: util.dynamodb.toMapValues({
        conversationId: ctx.arguments.conversationId,
        sender: 'user',
        event: ctx.arguments.event,
        timestamp: util.time.nowISO8601()
    }),
  };
}

export function response(ctx: Context) {
    ctx.stash.userInput = ctx.arguments.event
    return ctx.result
}