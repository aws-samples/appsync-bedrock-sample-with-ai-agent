import { Context } from '@aws-appsync/utils'

export function request(ctx: Context) {
  // Add the auth information for lambda to use to invoke down the line
  ctx.stash.headers = {
    authorization: ctx.request.headers.authorization
  }

  // Invoke lambda
  return {
    method: 'POST',
    resourcePath: `/2015-03-31/functions/${ctx.stash.agentData.handlerLambda}/invocations`,
    params: {
        headers: {
            'X-Amz-Invocation-Type': 'Event',
            'Content-Type' : "application/json"
        },
        body: ctx.stash
    }
  }
}

export function response(ctx: Context) {
  return ctx.prev.result
}