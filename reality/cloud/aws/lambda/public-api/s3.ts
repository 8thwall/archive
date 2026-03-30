import type * as S3 from '@aws-sdk/client-s3'

type S3Api = {
  putObject: (params: S3.PutObjectCommandInput) => Promise<void | S3.PutObjectCommandOutput>
  getObject: (params: S3.GetObjectCommandInput) => Promise<S3.GetObjectCommandOutput>
}

let registeredS3: S3Api | null = null

const register = (s3: S3Api) => {
  registeredS3 = s3
}

const use = () => {
  if (!registeredS3) {
    throw new Error('Unregistered S3')
  }
  return registeredS3
}

export {
  register,
  use,
}
