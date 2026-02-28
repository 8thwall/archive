import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

import {execSync} from 'child_process'

import {
  type GenerateKeystoreOptions,
  createKeyAndKeyStoreIfDoesNotExist,
} from '@nia/c8/android/keytool'

import {Ddb} from '@nia/reality/shared/dynamodb'

import {
  type AttributesForRaw,
  fromAttributes, toAttributes,
} from '@nia/reality/shared/typed-attributes'

import type {RefHead} from '@nia/reality/shared/nae/nae-types'

const {DDB_APP_SIGNING_TABLE_NAME} = process.env

type AndroidKeystoreData = {
  androidKeystoreFile: string
  androidKeyAndKeystorePassword: string
  androidKeyAlias: string
}

type KeystoreInfo = {
  name: string
  organization: string
}

const getFixedRefHead = (refHead: RefHead): string => {
  // Fix the refHead to 'dev' for non-specific refHeads.
  if (refHead !== 'production' &&
      refHead !== 'staging' &&
      refHead !== 'master') {
    return 'dev'
  }

  return refHead
}

const createAndroidKeystoreAndKey = async (info: KeystoreInfo): Promise<AndroidKeystoreData> => {
  const keystoreFileDir = execSync('mktemp -d').toString().trim()
  const keystoreFilePath = path.join(keystoreFileDir, 'keystore.jks')

  const keystorePassword = crypto.randomBytes(16).toString('hex')
  const keyAlias = crypto.randomBytes(8).toString('hex')

  const validityInDays = 10000
  const {name, organization} = info

  const keytoolData: GenerateKeystoreOptions = {
    keystorePath: keystoreFilePath,
    keyAndKeystorePassword: keystorePassword,
    keyAlias,
    validityInDays,
    name,
    organization,
    organizationUnit: organization,
  }

  await createKeyAndKeyStoreIfDoesNotExist(keytoolData)

  const keystoreBuffer = fs.readFileSync(keystoreFilePath, 'base64')
  if (!keystoreBuffer || keystoreBuffer.length === 0) {
    throw new Error('Failed to read keystore file')
  }

  return {
    androidKeystoreFile: keystoreBuffer,
    androidKeyAndKeystorePassword: keystorePassword,
    androidKeyAlias: keyAlias,
  }
}

const tryFetchAndroidKeystoreFromDb = async (
  appUuid: string,
  refHead: RefHead
): Promise<AndroidKeystoreData | null> => {
  const projectionExpressionKeys: Array<keyof AndroidKeystoreData> = [
    'androidKeystoreFile', 'androidKeyAndKeystorePassword', 'androidKeyAlias',
  ]

  const fixedRefHead = getFixedRefHead(refHead)

  const rawRequestItem = (await Ddb.use().getItem({
    Key: {
      pk: {S: appUuid},
      sk: {S: fixedRefHead},
    },
    ProjectionExpression: projectionExpressionKeys.join(','),
    TableName: DDB_APP_SIGNING_TABLE_NAME,
  })).Item as AttributesForRaw<AndroidKeystoreData>
  if (!rawRequestItem) {
    return null
  }

  return fromAttributes(rawRequestItem)
}

const putAndroidKeystoreToDb = async (
  appUuid: string,
  refHead: RefHead,
  keystoreData: AndroidKeystoreData
) => {
  const fixedRefHead = getFixedRefHead(refHead)

  await Ddb.use().putItem({
    TableName: DDB_APP_SIGNING_TABLE_NAME,
    Item: {
      pk: {S: appUuid},
      sk: {S: fixedRefHead},
      ...toAttributes(keystoreData),
    },
  })
}

const getAndroidKeystoreData = async (
  appUuid: string, refHead: RefHead, keystoreInfo: KeystoreInfo
): Promise<AndroidKeystoreData> => {
  if (!DDB_APP_SIGNING_TABLE_NAME) {
    throw new Error('DDB_APP_SIGNING_TABLE_NAME is not set in the environment')
  }

  const keystoreDbData = await tryFetchAndroidKeystoreFromDb(appUuid, refHead)
  if (keystoreDbData) {
    return keystoreDbData
  }

  const newKeystoreData = await createAndroidKeystoreAndKey(keystoreInfo)
  await putAndroidKeystoreToDb(appUuid, refHead, newKeystoreData)

  return newKeystoreData
}

export {
  getAndroidKeystoreData,
}

export type {
  AndroidKeystoreData,
  KeystoreInfo,
}
