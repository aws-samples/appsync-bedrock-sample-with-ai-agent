import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  return {
    operation: 'DeleteItem',
    key: util.dynamodb.toMapValues({
        id: ctx.arguments.id
    })
  };
}

export function response(ctx: Context) {
  return ctx.result
}