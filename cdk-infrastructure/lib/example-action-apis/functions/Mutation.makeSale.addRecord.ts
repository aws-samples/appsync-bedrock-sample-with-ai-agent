import { Context } from '@aws-appsync/utils'
import { util } from '@aws-appsync/utils';

export function request(ctx: Context) {
  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
      id: util.autoId(),
    }),
    attributeValues: util.dynamodb.toMapValues({
      ...ctx.arguments,
      recordType: 'sale',
      timestamp: util.time.nowISO8601()
    }),
  };
}

export function response(ctx: Context) {
  ctx.stash.saleId = ctx.result.id
  return ctx.result
}