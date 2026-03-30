// @attr(testonly = True)

import type {RequestContext} from '../api-types'

const makeRequestContext = (isPrivileged = true, {
  apiKey = 'invalid-api-key',
  ...additionalContext
} = {}): {requestContext: RequestContext} => ({
  requestContext: {
    authorizer: {
      principalId: 'test',
      isPrivileged,
      access: isPrivileged ? 'all' : 'user',
      ...additionalContext,
    },
    identity: {
      apiKey,
    },
  },
})

const makeQueryParameters = <T>(multiValueQueryStringParameters: T) => ({
  multiValueQueryStringParameters,
})

export {
  makeRequestContext,
  makeQueryParameters,
}
