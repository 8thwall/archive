type CustomerAccountResource = {
  stackStatus: string
  email: string
  name: string
  accountNumber?: string
  lastSuccessfulStackUpdate?: number
  tableId?: string
}

type AppGatewayResource = {
  region: string
  accountNumber: string
  gatewayId: string
}

type AppGatewayDeployment = {
  specHash: string
  lastDeploy: number
  routeIds: string[]
}

type LambdaDeployment = {
  contentHash: string
  configHash: string
  functionArn: string
}

type LambdaBuild = {
  contentHash: string
  zipLocation: string
}

type SecretValueResource = {
  secretId: string
  secretValue: string
}

type SecretMetadataResource = {
  appUuid: string
  accountUuid: string
  secretId: string
}

type RouteId = string
type SecretId = string
type Attachments = Record<RouteId, SecretId[]>

type AttachmentsResource = {
  attachments: Attachments
  appUuid: string
}

type ResourcesForDestruction = {
  appGatewayResource: AppGatewayResource & {accountUuid: string, appUuid: string}
  lambdaDeployments: LambdaDeployment[]
}

const partitionKeyForAttachments = (gatewayId: string) => `gateway:${gatewayId}`
const partitionKeyForSecretMetadata = (accountUuid: string) => `workspace:${accountUuid}`
const partitionKeyForSecretValue = (secretId: string) => `secret:${secretId}`

const keyForCustomerAccount = (accountUuid: string) => ({
  pk: {S: `aws-resource:workspace:${accountUuid}`},
  sk: {S: 'aws-account'},
})

const keyForAppGateway = (appUuid: string) => ({
  pk: {S: `aws-resource:app:${appUuid}`},
  sk: {S: 'api-gateway'},
})

const keyForAppGatewayDeployment = (appUuid: string, stage: string) => ({
  pk: {S: `aws-resource:app:${appUuid}`},
  sk: {S: `api-gateway-deployment:${stage}`},
})

const keyForLambdaDeployment = (appUuid: string, functionName: string) => ({
  pk: {S: `aws-resource:app:${appUuid}`},
  sk: {S: `lambda-deployment:${functionName}`},
})

const keyForLambdaBuild = (moduleId: string, backendName: string, target: string) => ({
  pk: {S: `lambda-build:module:${moduleId}:backendName:${backendName}`},
  sk: {S: target},
})

const keyForSecretValue = (secretId: string) => ({
  pk: {S: partitionKeyForSecretValue(secretId)},
  sk: {S: 'value'},
})

const keyForSecretMetadata = (accountUuid: string, secretId: string) => ({
  pk: {S: partitionKeyForSecretMetadata(accountUuid)},
  sk: {S: `secret:${secretId}`},
})

const keyForAttachments = (gatewayId: string, stage: string) => ({
  pk: {S: partitionKeyForAttachments(gatewayId)},
  sk: {S: `attachments:${stage}`},
})

const keyForLatestAttachments = (gatewayId: string, stage: string) => ({
  pk: {S: partitionKeyForAttachments(gatewayId)},
  sk: {S: `latest-attachments:${stage}`},
})

export {
  keyForCustomerAccount,
  keyForAppGateway,
  keyForAppGatewayDeployment,
  keyForLambdaDeployment,
  keyForSecretValue,
  keyForSecretMetadata,
  keyForAttachments,
  keyForLatestAttachments,
  keyForLambdaBuild,
  partitionKeyForAttachments,
  partitionKeyForSecretMetadata,
  partitionKeyForSecretValue,
}

export type {
  CustomerAccountResource,
  AttachmentsResource,
  AppGatewayResource,
  AppGatewayDeployment,
  LambdaDeployment,
  LambdaBuild,
  SecretValueResource,
  SecretMetadataResource,
  Attachments,
  ResourcesForDestruction,
}
