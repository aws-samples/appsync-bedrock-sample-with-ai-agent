import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  return {
    operation: 'UpdateItem',
    key: {
      id: ctx.arguments.customer,
      recordType: 'salesPerson'
    },
    update: {
        expression: 'set #arr = list_append(#arr, :arr)',
        expressionNames: {
            '#arr': 'sales',
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