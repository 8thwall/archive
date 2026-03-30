import type S3ClientApi from '@aws-sdk/client-s3'
import {Upload} from '@aws-sdk/lib-storage'
import {getSignedUrl, type RequestPresigningArguments} from '@aws-sdk/s3-request-presigner'
import {
  S3Client, PutObjectCommand, GetObjectCommand, PutObjectCommandInput,
} from '@aws-sdk/client-s3'

import {entry} from '../../../../../../xrhome/src/shared/registry'

type PresignedCommandFunction<Command> = Command extends S3ClientApi.$Command<
infer I, any, any, any, any
> ? (input: I, opts?: RequestPresigningArguments) => Promise<string> : never

type CommandFunction<Command> = Command extends S3ClientApi.$Command<
infer I, infer O, any, any, any
> ? (input: I) => Promise<O> : never

type S3Api = {
  createPresignedPutUrl: PresignedCommandFunction<S3ClientApi.PutObjectCommand>
  createPresignedGetUrl: PresignedCommandFunction<S3ClientApi.GetObjectCommand>
  upload: (params: PutObjectCommandInput) => Upload
  putObject: CommandFunction<S3ClientApi.PutObjectCommand>
  getObject: CommandFunction<S3ClientApi.GetObjectCommand>
}

const S3 = entry<S3Api>('S3')

const createS3Api = (client: S3Client): S3Api => ({
  createPresignedPutUrl: (input, opts) => getSignedUrl(client, new PutObjectCommand(input), opts),
  createPresignedGetUrl: (input, opts) => getSignedUrl(client, new GetObjectCommand(input), opts),
  upload: params => new Upload({client, params}),
  putObject: input => client.send(new PutObjectCommand(input)),
  getObject: input => client.send(new GetObjectCommand(input)),
})

export {
  S3,
  createS3Api,
  type S3Api,
}
