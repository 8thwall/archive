import path from 'path'

import {S3} from '../../shared/integrations/s3'
import type {ConversionRequest} from '../../shared/types'
import {createZipStream} from '../../shared/zipfile'
import {makeCodedError} from '../../shared/error'

const handleUppercaseConversion = async (key: string, request: ConversionRequest) => {
  const {downloadFileKey} = request
  // get object from s3 and convert text to uppercase
  const {ContentType, Body} = await S3.use().getObject({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  })
  if (ContentType !== 'text/plain') {
    throw makeCodedError('Invalid content type', 400)
  }
  const text = (await Body?.transformToString() ?? '').toUpperCase()

  // create a zip archive with the converted text
  const {name} = path.parse(key)
  const zipStream = createZipStream(
    [[text, {name: `${name}-uppercase.txt`}]]
  )

  // write the zip file back to s3
  const upload = S3.use().upload({
    Bucket: process.env.BUCKET_NAME,
    Key: downloadFileKey,
    ContentType: 'application/zip',
    Body: zipStream,
  })
  upload.on('httpUploadProgress', p => console.log(p))
  await upload.done()
}

export {handleUppercaseConversion}
