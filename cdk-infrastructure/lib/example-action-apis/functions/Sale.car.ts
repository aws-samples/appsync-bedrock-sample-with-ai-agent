import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  return {
    operation: 'GetItem',
    key: util.dynamodb.toMapValues({ 
      id: ctx.source.car, 
      recordType: 'car' 
    })
  };
}

export function response(ctx: Context) {
  return ctx.result
}