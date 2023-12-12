import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  return {
    operation: 'Query', 
    query: JSON.parse(
        util.transform.toDynamoDBConditionExpression({ 
            ['conversationId']: { eq: ctx.source.id }
        })
    ),
    limit: 2000
  }
}

export function response(ctx: Context) {
  if (ctx.result && ctx.result.items)
      return ctx.result.items;
  
  return []
}