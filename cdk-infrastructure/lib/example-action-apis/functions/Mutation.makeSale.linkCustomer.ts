import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  return {
    operation: 'UpdateItem',
    key: {
      id: ctx.arguments.customer,
      recordType: 'customer'
    },
    update: {
        expression: 'set #arr = list_append(#arr, :arr)',
        expressionNames: {
          '#arr': 'purchases',
        },
        expressionValues: util.dynamodb.toMapValues({
          ':arr': [ctx.stash.saleId],
        })
    }
  }
} 

export function response(ctx: Context) {
  return ctx.result
}