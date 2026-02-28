import {S3} from 'aws-sdk'

const createS3Client = (options?: S3.ClientConfiguration) => new S3(options)

export {
  createS3Client,
}
