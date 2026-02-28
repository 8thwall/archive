import {SQSClient, SQSClientConfig} from '@aws-sdk/client-sqs'

const createSQSClient = (options?: SQSClientConfig) => new SQSClient(options)

export {
  createSQSClient,
}
