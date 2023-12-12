import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  return {}
}

export function response(ctx: Context) {
  return ctx.arguments.config;
}