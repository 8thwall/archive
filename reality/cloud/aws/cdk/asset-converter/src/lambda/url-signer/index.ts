import path from 'path'
import {randomUUID} from 'crypto'
import {S3Client} from '@aws-sdk/client-s3'
import {DynamoDBClient} from '@aws-sdk/client-dynamodb'
import {toAttributes} from '@nia/reality/shared/typed-attributes'
import {SECONDS_PER_DAY} from '@nia/reality/cloud/xrhome/src/shared/time-utils'

import {branch, methods} from '../../../../../shared/api-router'
import {makeInvalidRequestResponse, NOT_FOUND_RESPONSE} from '../../shared/responses'
import type {APIEvent, ConversionRequest, PostUploadUrlQueryParams} from '../../shared/types'
import {S3, createS3Api} from '../../shared/integrations/s3'
import {Ddb, createDynamoDbApi} from '../../shared/integrations/dynamodb'
import {getDdbKey} from '../../shared/types'
import {requestTimeEpochToUnixTime} from '../../shared/time'

const REQUEST_TTL = 2 * SECONDS_PER_DAY
const FILE_TTL = SECONDS_PER_DAY

let alreadyInitialized = false
const registerDependencies = () => {
  if (alreadyInitialized) {
    return
  }
  S3.register(createS3Api(new S3Client({
    region: process.env.AWS_REGION,
  })))
  Ddb.register(createDynamoDbApi(new DynamoDBClient({region: process.env.AWS_REGION})))
  alreadyInitialized = true
}

const uploadKey = (uuid: string, filename: string) => {
  const date = new Date()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()
  return `${process.env.PATH_PREFIX}/${year}-${month}-${day}/${uuid}/input/${filename}`
}

const downloadKey = (uuid: string, filename: string) => {
  const date = new Date()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()
  return `${process.env.PATH_PREFIX}/${year}-${month}-${day}/${uuid}/output/${filename}`
}

const postUploadUrl = async (event: APIEvent) => {
  if (event.headers['content-type'] !== 'application/json' ||
    event.isBase64Encoded || !event.body) {
    return makeInvalidRequestResponse('content-type must be application/json')
  }
  const uuid = randomUUID()
  const body = JSON.parse(JSON.parse(event.body)) as PostUploadUrlQueryParams
  if (!body.filename || !body.conversionType || !body.conversionParams) {
    return makeInvalidRequestResponse('filename is required')
  }
  const uploadFileKey = uploadKey(uuid, body.filename)

  const unixTime = requestTimeEpochToUnixTime(event.requestContext.timeEpoch)

  // Insert Request
  const key = getDdbKey(uploadFileKey)
  const data: ConversionRequest = {
    conversionType: body.conversionType,
    conversionParams: body.conversionParams,
    status: 'pending',
    createdAt: unixTime,
    expireAt: unixTime + REQUEST_TTL,
    uploadFileKey,
    downloadFileKey: '',
  }

  const uploadUrl = await S3.use().createPresignedPutUrl({
    Bucket: process.env.BUCKET_NAME,
    Key: uploadFileKey,
  }, {
    expiresIn: FILE_TTL,
  })

  const filename = path.parse(body.filename).name
  const downloadFileKey = downloadKey(uuid, `${filename}.zip`)
  const downloadUrl = await S3.use().createPresignedGetUrl({
    Bucket: process.env.BUCKET_NAME,
    Key: downloadFileKey,
  }, {
    expiresIn: FILE_TTL,
  })

  data.downloadFileKey = downloadFileKey

  await Ddb.use().putItem({
    TableName: process.env.TABLE_NAME,
    Item: {...key, ...toAttributes(data)},
  })

  return ({
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl,
      downloadUrl,
      requestId: uploadFileKey,
    }),
  })
}

const resolver = branch({
  'uploadUrl': methods({
    POST: postUploadUrl,
  }),
})

const handler = async (event: APIEvent) => {
  console.log('Event', JSON.stringify(event, null, 2))
  registerDependencies()
  const eventHandler = resolver(
    event.rawPath, event.requestContext.http.method, event.pathParameters
  )
  if (!eventHandler) {
    return NOT_FOUND_RESPONSE
  }
  return eventHandler(event)
}

export {
  handler,
}
