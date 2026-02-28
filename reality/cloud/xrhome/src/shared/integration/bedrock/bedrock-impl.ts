import {
  BedrockRuntimeClient,
  BedrockRuntimeClientConfig,
} from '@aws-sdk/client-bedrock-runtime'

const createBedrockClient = (
  options?: BedrockRuntimeClientConfig
) => new BedrockRuntimeClient(options)

export {
  createBedrockClient,
}
