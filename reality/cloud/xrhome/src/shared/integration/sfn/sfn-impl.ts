import {SFNClient, SFNClientConfig} from '@aws-sdk/client-sfn'

const createSfnClient = (options?: SFNClientConfig) => new SFNClient(options)

export {
  createSfnClient,
}
