// @attr(visibility = ["//visibility:public"])

import {
  S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand,
  DeleteObjectsCommand, CopyObjectCommand, ListObjectsV2Command,
} from '@aws-sdk/client-s3'

import {S3Api} from './s3'

const createS3Api = (s3Client: S3Client): S3Api => ({
  putObject: input => s3Client.send(new PutObjectCommand(input)),
  getObject: input => s3Client.send(new GetObjectCommand(input)),
  deleteObject: input => s3Client.send(new DeleteObjectCommand(input)),
  deleteObjects: input => s3Client.send(new DeleteObjectsCommand(input)),
  copyObject: input => s3Client.send(new CopyObjectCommand(input)),
  listObjectsV2: input => s3Client.send(new ListObjectsV2Command(input)),
})

export {
  createS3Api,
  type S3Api,
}
