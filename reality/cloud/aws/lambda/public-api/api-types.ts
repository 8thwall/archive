// @ts-ignore
import type * as Lambda from '@types/aws-lambda'

type RequestContext = {
  authorizer: {
    principalId: string
    isPrivileged: boolean
    access: 'all' | 'user'
  }
  identity: {
    apiKey: string
  }
}

type Request = Partial<Pick<Lambda.APIGatewayProxyEvent,
  'path' | 'httpMethod' | 'pathParameters' | 'body' | 'headers' | 'isBase64Encoded' |
  'multiValueQueryStringParameters'>> & {
  requestContext: RequestContext
}

type Response = Lambda.APIGatewayProxyResult

type Headers = Lambda.APIGatewayProxyEvent['headers']

export type {
  Request,
  Headers,
  RequestContext,
  Response,
}
