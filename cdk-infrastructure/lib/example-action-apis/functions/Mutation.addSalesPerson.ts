import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
        id: util.autoId(),
    }),
    attributeValues: util.dynamodb.toMapValues({
        ...ctx.arguments,
        recordType: 'salesPerson',
        sales: [],
        timestamp: util.time.nowISO8601()
    }),
  };
}

export function response(ctx: Context) {
  return ctx.result
}