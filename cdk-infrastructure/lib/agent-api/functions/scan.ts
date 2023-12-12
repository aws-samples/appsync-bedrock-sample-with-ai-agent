import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  return { operation: 'Scan', limit: 100 }
}

export function response(ctx: Context) {
  if (ctx.result && ctx.result.items)
      return ctx.result.items;
 
  return []
}