import {toAttributes} from '@nia/reality/shared/typed-attributes'

import {S3} from '../../shared/integrations/s3'
import {Ddb} from '../../shared/integrations/dynamodb'
import {getDdbKey, type ConversionRequest} from '../../shared/types'
import type {CodedError} from '../../shared/error'

const changeDdbRecord = async (key: string, updates: Partial<ConversionRequest>) => {
  const ddbKey = getDdbKey(key)
  return Ddb.use().updateItem({
    TableName: process.env.TABLE_NAME,
    Key: ddbKey,
    UpdateExpression: `SET ${Object.keys(updates).map(k => `${k} = :${k}`).join(',')}`,
    ExpressionAttributeValues: toAttributes(Object
      .entries(updates)
      .reduce<Record<string, any>>((acc, [k, v]) => ({...acc, [`:${k}`]: v}), {})),
    ConditionExpression: 'attribute_exists(pk)',
    ReturnValues: 'ALL_NEW',
  })
}

const writeErrorToS3 = async (key: string, error: CodedError) => {
  const Body = JSON.stringify({
    error: error.message,
    code: error.code,
  })
  S3.use().putObject({
    Bucket: process.env.BUCKET_NAME,
    Metadata: {
      'error': 'true',
    },
    Key: key,
    Body,
    ContentType: 'application/json',
    ContentLength: Buffer.byteLength(Body),
  })
}

export {changeDdbRecord, writeErrorToS3}
