import { Context } from '@aws-appsync/utils'
import { DynamodbBatchGetIdsWithType } from '../../agent-api/appsync-js-utils'

export function request(ctx: Context) {
    return DynamodbBatchGetIdsWithType(
        ctx.source.sales, 
        { recordType: 'sale' },
        '$table'
    )
}

export function response(ctx: Context) {
  if (ctx.result && ctx.result.data && ctx.result.data['$table']) {
    return ctx.result.data['$table']
  }
  return []
}