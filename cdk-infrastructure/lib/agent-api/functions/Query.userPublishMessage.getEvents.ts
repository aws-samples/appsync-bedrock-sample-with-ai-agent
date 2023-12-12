import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  return {
    operation: 'Query', 
    query: JSON.parse(
        util.transform.toDynamoDBConditionExpression({ 
            ['conversationId']: { eq: ctx.arguments.conversationId }
        })
    ),
    limit: 2000
  }
}

export function response(ctx: Context) {
    let items = ctx.result && ctx.result.items ? ctx.result.items : []
    ctx.stash.conversationData.events =  items
    return ctx.result
}