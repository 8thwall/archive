import path from 'path'
import type {S3Handler} from 'aws-lambda'
import {S3Client} from '@aws-sdk/client-s3'
import {DynamoDBClient} from '@aws-sdk/client-dynamodb'
import {fromAttributes, type AttributesForRaw} from '@nia/reality/shared/typed-attributes'

import {S3, createS3Api} from '../../shared/integrations/s3'
import {Ddb, createDynamoDbApi} from '../../shared/integrations/dynamodb'
import {isCodedError, makeCodedError} from '../../shared/error'
import {type ConversionRequest, getDdbKey} from '../../shared/types'
import {handleUppercaseConversion} from './handle-uppercase-conversion'
import {changeDdbRecord, writeErrorToS3} from './handle-errors'
import {handleGlbConversion} from './handle-glb-conversion'
import {handleFontConversion} from './handle-font-conversion'

let alreadyInitialized = false
const registerDependencies = () => {
  if (alreadyInitialized) {
    return
  }
  S3.register(createS3Api(new S3Client({region: process.env.AWS_REGION})))
  Ddb.register(createDynamoDbApi(new DynamoDBClient({region: process.env.AWS_REGION})))
  alreadyInitialized = true
}

const getDownloadFileKeyFromUploadKey = (key: string) => {
  const keyPath = path.parse(key)
  const {dir, name} = keyPath
  const outputDir = dir.replace('/input/', '/output/')
  return `${outputDir}/${name}.zip`
}

const handler: S3Handler = async (event) => {
  console.log('Event', JSON.stringify(event, null, 2))
  registerDependencies()

  await Promise.all(event.Records.map(async (record) => {
    const {key} = record.s3.object
    const keyPath = path.parse(key)
    const ioType = keyPath.dir.split('/').slice(-1)[0]
    if (ioType !== 'input') {
      console.log('Skipping non-input file', key, keyPath.dir.split('/'), ioType)
      return
    }
    try {
      const ddbKey = getDdbKey(key)
      const rawRequestItem = (await Ddb.use().getItem({
        TableName: process.env.TABLE_NAME,
        Key: ddbKey,
      })).Item as AttributesForRaw<ConversionRequest>
      if (!rawRequestItem) {
        throw makeCodedError('No conversion request found for key', 404)
      }
      const request = fromAttributes(rawRequestItem)
      const {conversionType} = request
      switch (conversionType) {
        case 'uppercase':
          await handleUppercaseConversion(key, request)
          break
        case 'fbxToGlb':
          await handleGlbConversion(key, request)
          break
        case 'fontToMtsdf':
          await handleFontConversion(key, request)
          break
        default:
          throw makeCodedError('Unknown conversion type', 400)
      }
    } catch (error) {
      console.log('[Error] handling record', error)
      if (isCodedError(error)) {
        Promise.all([
          writeErrorToS3(getDownloadFileKeyFromUploadKey(key), error),
          changeDdbRecord(key, {status: 'failed', error: error.message}),
        ])
      } else {
        throw error
      }
    }
  }))
}

export {
  handler,
}
