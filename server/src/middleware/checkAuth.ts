import { AuthenticationError } from 'apollo-server-express'

import { MiddlewareFn } from 'type-graphql'
import { Context } from '../types/Context'

export const checkAuth: MiddlewareFn<Context> = async (
  { context: { req } },
  next
) => {
  if (!req.session.userId) {
    throw new AuthenticationError(
      'Not authenticated to perform GraphQL operations'
    )
  }

  await next()
}
