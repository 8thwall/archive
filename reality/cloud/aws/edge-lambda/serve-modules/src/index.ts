// @rule(js_binary)
// @attr(npm_rule = "@npm-lambda//:npm-lambda")
// @attr(export_library = 1)
// @attr(externals = "@aws-sdk/*")
// @attr(target = "node")
// @attr(commonjs = 1)
import {
  DynamoDBClient, GetItemCommand, GetItemCommandInput, GetItemCommandOutput,
} from '@aws-sdk/client-dynamodb'

import {ModuleFileRequest, parseRequestUri} from '@nia/reality/shared/module/module-file-request'
import {getStaticPath, getUriForFile} from '@nia/reality/shared/module/module-static-paths'
import {getCacheDurationInSeconds} from '@nia/reality/shared/module/module-target-caching'

import type {
  CloudFrontHandler, CloudFrontResponse, CloudFrontRequest,
} from '../../shared/edge-lambda-types'
import {validateRequest} from './validate'
import {register as registerDdb} from './dynamodb'
import getNearestDdbRegion from '../../shared/get-nearest-ddb-region'
import {resolveModuleRequest} from './resolve-module-request'

const NOT_FOUND_RESPONSE: CloudFrontResponse = {
  status: '404',
  statusDescription: 'Not Found',
  headers: {},
}

const REJECTED_RESPONSE: CloudFrontResponse = {
  status: '400',
  statusDescription: 'Bad Request',
  headers: {},
}

const dynamoDbClient = new DynamoDBClient({
  region: getNearestDdbRegion(process.env.AWS_REGION),
})

registerDdb({
  getItem: async (options) => {
    const command = new GetItemCommand(options)
    return dynamoDbClient.send<GetItemCommandInput, GetItemCommandOutput>(command)
  },
})

const applyCrossOriginHeaders = (headers: CloudFrontResponse['headers']) => {
  headers['access-control-allow-origin'] = [{value: '*'}]
  headers['access-control-allow-methods'] = [{value: 'GET, HEAD'}]
  headers['access-control-max-age'] = [{value: '86400'}]
  return headers
}

process.env.NODE_OPTIONS = '--enable-source-maps'

const resolveStaticBuild = (request: CloudFrontRequest): CloudFrontRequest => {
  const staticPath = getStaticPath(request.uri)
  if (!staticPath) {
    return null
  }
  const staticRequest = {...request, uri: staticPath}
  delete staticRequest.querystring
  return staticRequest
}

const resolveBuild = async (loadRequest: ModuleFileRequest): Promise<CloudFrontResponse | null> => {
  const location = await resolveModuleRequest(loadRequest)
  if (!location) {
    return null
  }

  const redirectPath = getUriForFile(location, loadRequest.file)
  if (!redirectPath) {
    // If we resolve the target to a build location that static paths can't route to, that's
    // a critical issue, so lets surface it as an error.
    throw new Error(`Resolved to invalid build location: ${location}`)
  }

  return {
    status: '302',
    statusDescription: 'Found',
    headers: applyCrossOriginHeaders({
      'cache-control': [{value: `max-age=${getCacheDurationInSeconds(loadRequest.target)}`}],
      'location': [{value: redirectPath}],
    }),
  }
}

const handler: CloudFrontHandler = async (event) => {
  const {config, request, response} = event.Records[0].cf
  if (config.eventType === 'origin-request') {
    // NOTE(christoph): Static paths contain an opaque hash, so they don't need an access token
    // like target paths do.
    const staticBuild = resolveStaticBuild(request)
    if (staticBuild) {
      return staticBuild
    }

    const fileRequest = parseRequestUri(request.uri, request.querystring)
    if (!fileRequest) {
      return REJECTED_RESPONSE
    }

    if (!await validateRequest(fileRequest)) {
      return REJECTED_RESPONSE
    }

    return (await resolveBuild(fileRequest)) ||
           NOT_FOUND_RESPONSE
  } else if (config.eventType === 'origin-response') {
    const cacheSeconds = ['2', '3'].includes(response.status[0]) ? 31536000 : 5
    response.headers['cache-control'] = [{value: `max-age=${cacheSeconds}`}]
    applyCrossOriginHeaders(response.headers)
    return response
  } else {
    console.error('Unknown event type:', event)
    throw new Error('Unknown event type')
  }
}

export {
  handler,
}
