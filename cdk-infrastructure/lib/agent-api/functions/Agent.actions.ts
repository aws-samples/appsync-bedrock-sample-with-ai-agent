import { Context } from '@aws-appsync/utils'
import { DynamodbBatchGet } from '../appsync-js-utils';

export function request(ctx: Context) {
  return DynamodbBatchGet(ctx.source.actions, '$table')
}

export function response(ctx: Context) {
  if (ctx.result && ctx.result.data && ctx.result.data['$table']) {
    return ctx.result.data['$table']
  }
  return []
}
