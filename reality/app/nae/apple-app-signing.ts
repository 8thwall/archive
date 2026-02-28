import {Ddb} from '@nia/reality/shared/dynamodb'
import {
  fromAttributes,
  AttributesForRaw,
} from '@nia/reality/shared/typed-attributes'

import type {
  AppleSigningType,
  SigningConfigData,
  CertificateFileData,
} from '@nia/reality/shared/nae/nae-types'

import {S3} from '@nia/reality/shared/s3'
import {createSecretScope} from '@nia/reality/cloud/aws/lambda/shared/secret-scopes'

type AppleSigningData = {
  appleP12File: string
  appleP12Password: string
  appleProvisioningProfile: string
  teamIdentifier: string
}

const secretNamespace = process.env.SECRET_NAMESPACE
if (!secretNamespace) {
  throw new Error('SECRET_NAMESPACE is not set in the environment')
}

const getAppleSigningData = async (
  appUuid: string,
  accountUuid: string,
  signingType: AppleSigningType
): Promise<AppleSigningData> => {
  // Get the environment variable for the table name - this should be set by the deployment
  const ddbAppleSigningFilesTableName = process.env.DDB_APPLE_SIGNING_FILES_TABLE_NAME
  if (!ddbAppleSigningFilesTableName) {
    throw new Error('DDB_APPLE_SIGNING_FILES_TABLE_NAME environment variable is not set')
  }

  if (process.env.PREFILL_SIGNING_FILES === 'true') {
    const naeSigningScope = createSecretScope<'naeiOSSecret' | 'naeiOSSecretDistribution'>({
      region: 'us-west-2',
      prefix: secretNamespace,
      name: 'shared/nae_signing',
      version: secretNamespace === 'Prod'
        ? '<REMOVED_BEFORE_OPEN_SOURCING>'
        : '<REMOVED_BEFORE_OPEN_SOURCING>',
    })

    // Note that this logic depends on signing files in 8th Wall's Apple Developer account
    // and will need to be updated if the dependent certificates/provisioning profiles change.
    // The certificates are:
    //   - Apple Development: Akash Mahesh (<REMOVED_BEFORE_OPEN_SOURCING>) (Valid until 09/24/2026)
    // eslint-disable-next-line max-len
    //   - iPhone Distribution: 8th Wall, Inc. (<REMOVED_BEFORE_OPEN_SOURCING>) (Valid until 09/24/2026)
    // The provisioning profiles are tied to the following bundle identifiers:
    //   - 8w-test-development (Valid until 09/24/2026)
    //   - 8w-test-distribution (Valid until 09/24/2026)
    // 8th Wall's Apple Developer Team ID:
    const DEFAULT_TEAM_IDENTIFIER = '<REMOVED_BEFORE_OPEN_SOURCING>'
    const isDevelopment = process.env.PREFILLED_SIGNING_TYPE === 'development'
    const loadedSecret = await naeSigningScope.load()
    const appleP12Password = isDevelopment
      ? loadedSecret.naeiOSSecret
      : loadedSecret.naeiOSSecretDistribution
    const secretBucket = 'nae-test-files'
    const certificateP12FileKey = isDevelopment
      ? 'misc/apple-development.p12'
      : 'misc/ios-distribution.p12'

    const {Body: p12FileBody} = await S3.use().getObject({
      Bucket: secretBucket,
      Key: certificateP12FileKey,
    })

    if (!p12FileBody) {
      throw new Error(`Failed to retrieve P12 file from S3: ${certificateP12FileKey}`)
    }

    const appleP12File = await p12FileBody.transformToString('base64')

    const provisioningProfileKey = isDevelopment
      ? 'misc/8wtestdevelopment.mobileprovision'
      : 'misc/8wtestdistribution.mobileprovision'
    const {Body: provisioningProfileBody} = await S3.use().getObject({
      Bucket: secretBucket,
      Key: provisioningProfileKey,
    })

    if (!provisioningProfileBody) {
      throw new Error(`Failed to retrieve provisioning profile from S3: ${provisioningProfileKey}`)
    }

    const appleProvisioningProfile = await provisioningProfileBody.transformToString('base64')

    return {
      appleP12File,
      appleP12Password,
      appleProvisioningProfile,
      teamIdentifier: process.env.PREFILLED_TEAM_IDENTIFIER ?? DEFAULT_TEAM_IDENTIFIER,
    }
  }

  // Get the signing data from DynamoDB
  const key = {pk: {S: appUuid}, sk: {S: signingType}}
  const projectionExpressionKeys: Array<keyof SigningConfigData> = [
    'certificateUuid',
    'provisioningProfileBase64',
    'teamIdentifier',
  ]

  const rawSigningItem = (await Ddb.use().getItem({
    TableName: ddbAppleSigningFilesTableName,
    Key: key,
    ProjectionExpression: projectionExpressionKeys.join(','),
  })).Item as AttributesForRaw<SigningConfigData> | undefined

  if (!rawSigningItem) {
    throw new Error(
      `Apple signing data not found for appUuid: ${appUuid}, signingType: ${signingType}`
    )
  }

  const signingData = fromAttributes(rawSigningItem)
  const {certificateUuid, provisioningProfileBase64, teamIdentifier} = signingData

  if (!certificateUuid || !provisioningProfileBase64 || !teamIdentifier) {
    throw new Error(
      `Incomplete signing data for appUuid: ${appUuid}, signingType: ${signingType}`
    )
  }

  const certificateFileData = (await Ddb.use().getItem({
    TableName: process.env.DDB_APPLE_CERTIFICATES_FILES_TABLE_NAME,
    Key: {pk: {S: accountUuid}, sk: {S: certificateUuid}},
    ProjectionExpression: 'p12CertificateBase64, p12CertificatePassword',
  })).Item as AttributesForRaw<CertificateFileData> | undefined

  if (!certificateFileData) {
    throw new Error(
      `Apple certificate file data not found for accountUuid: ${accountUuid}` +
      `, certificateUuid: ${certificateUuid}`
    )
  }
  const certData = fromAttributes(certificateFileData)
  const {p12CertificateBase64, p12CertificatePassword} = certData

  return {
    appleP12File: p12CertificateBase64,
    appleP12Password: p12CertificatePassword,
    appleProvisioningProfile: signingData.provisioningProfileBase64,
    teamIdentifier,
  }
}

export {
  getAppleSigningData,
}
