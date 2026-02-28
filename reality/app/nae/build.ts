/* eslint-disable no-console */

// @rule(js_binary)
// @attr(esnext = 1)
// @attr(target = "node")
// @package(npm-ecr)

import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
import {exec as execCb} from 'child_process'

import {DynamoDBClient} from '@aws-sdk/client-dynamodb'
import {S3Client} from '@aws-sdk/client-s3'
import {PublishCommand, SNSClient} from '@aws-sdk/client-sns'

import {streamExec} from '@nia/c8/cli/proc'
import {mimeTypeImage} from '@nia/c8/dom/mime-type-image'

import {
  validateAppConfig,
  DEFAULT_VERSION_CODE,
  DEFAULT_VERSION_NAME,
} from '@nia/reality/app/nae/packager/html-app-config'

import {Ddb} from '@nia/reality/shared/dynamodb'
import {createDdbApi} from '@nia/reality/shared/dynamodb-impl'
import {S3} from '@nia/reality/shared/s3'
import {createS3Api} from '@nia/reality/shared/s3-impl'

import {
  fetchStudioGlobalEntry,
} from '@nia/reality/shared/studio/fetch-studio-global-entry'

import {messaging} from '@nia/reality/cloud/aws/lambda/studio-deploy/messaging'

import {
  NAE_ANDROID_ICON_SIZES,
  NAE_ANDROID_ICON_TYPES,
  NAE_IOS_ICON_SIZES,
  NAE_IOS_ICON_TYPES,
} from '@nia/reality/shared/nae/nae-constants'

import type {
  NaeBuilderRequest,
  HtmlAppConfig,
  AndroidConfig,
  AppleConfig,
  BuildNotificationData,
  CreateAssetCarRequest,
  CreateAssetCarResponse,
} from '@nia/reality/shared/nae/nae-types'

import {
  validateAppName,
  validateAppDisplayName,
  naeS3Key,
  makeNaeCreditTopicAttributes,
  getIconUrl,
  getDownloadedFileName,
  validateBundleIdUtil,
  validateBuildMode,
  validateExportType,
  validateVersionNameUtil,
  getBundleIdAndDisplayNameWithSuffix,
  createAssetCarContentsJson,
} from '@nia/reality/shared/nae/nae-utils'
import {
  defaultHistoricalBuildData,
  putBuildDataToDb,
} from '@nia/reality/shared/nae/historical-builds'

import {
  DEFAULT_APPLE_CONFIG_FIELDS,
  DEFAULT_ANDROID_CONFIG_FIELDS,
} from '@nia/reality/app/nae/packager/html-app-config'

import {checkArgs} from '@nia/c8/cli/args'

import {getAndroidKeystoreData} from './app-signing'
import {getAppleSigningData} from './apple-app-signing'
import {createStagingCookie, createDevCookie} from './dev-cookie'

const exec = promisify(execCb)

// Expected to be set in the cloudformation template
const runfilesDir = process.env.RUNFILES_DIR
const naeBuildOutputBucket = process.env.NAE_BUILD_OUTPUT_BUCKET
const ddbHistoricalBuildsTableName = process.env.DDB_HISTORICAL_BUILDS_TABLE_NAME

const NAE_PACKAGER_PATH = `${runfilesDir}/_main/reality/app/nae/packager/packager.js`

const ANDROID_DEFAULT_RESOURCES = path.join(runfilesDir, '..', 'android-default-resources')
const IOS_DEFAULT_RESOURCES = path.join(runfilesDir, '..', 'ios-default-resources')

// Google Play requires a targetSdkVersion of at least 35 to publish a new app
const ANDROID_TARGET_SDK_VERSION = 36

// Meta Quest requires a targetSdkVersion of 32 to publish a new app
const QUEST_TARGET_SDK_VERSION = 32

// Set up the AWS API clients
const ddbClient = new DynamoDBClient()
const s3Client = new S3Client()
const snsClient = new SNSClient()

await ddbClient.config.credentials()

Ddb.register(createDdbApi(ddbClient))
S3.register(createS3Api(s3Client))

// Note: This requires process.env.BUILD_NOTIFICATION_TOPIC to be set
const {sendBuildNotification} = messaging(snsClient)

const extractAppConfigFromPayload = (payload: NaeBuilderRequest) => {
  let appleConfig: AppleConfig | undefined
  if (payload.shell === 'ios') {
    appleConfig = {
      bundleIdentifier: payload.appInfo.bundleIdentifier,
      teamIdentifier: DEFAULT_APPLE_CONFIG_FIELDS.teamIdentifier,
      versionCode: payload.appInfo.versionCode || DEFAULT_APPLE_CONFIG_FIELDS.versionCode,
      versionName: payload.appInfo.versionName || DEFAULT_APPLE_CONFIG_FIELDS.versionName,
      signingType: payload.apple.signingType || DEFAULT_APPLE_CONFIG_FIELDS.signingType,
      // TODO(lreyna): Update these values
      certificate: DEFAULT_APPLE_CONFIG_FIELDS.certificate,
      provisioningProfile: DEFAULT_APPLE_CONFIG_FIELDS.provisioningProfile,
      minOsVersion: DEFAULT_APPLE_CONFIG_FIELDS.minOsVersion,
      p12FilePath: DEFAULT_APPLE_CONFIG_FIELDS.p12FilePath,
      p12Password: DEFAULT_APPLE_CONFIG_FIELDS.p12Password,
    }
  }

  let androidConfig: AndroidConfig | undefined
  if (payload.shell === 'android' || payload.shell === 'quest') {
    androidConfig = {
      packageName: payload.appInfo.bundleIdentifier,
      versionCode: payload.appInfo.versionCode || DEFAULT_ANDROID_CONFIG_FIELDS.versionCode,
      versionName: payload.appInfo.versionName || DEFAULT_ANDROID_CONFIG_FIELDS.versionName,
      minSdkVersion: DEFAULT_ANDROID_CONFIG_FIELDS.minSdkVersion,
      targetSdkVersion: payload.shell === 'quest'
        ? QUEST_TARGET_SDK_VERSION
        : ANDROID_TARGET_SDK_VERSION,
      // TODO(lreyna): Update these values
      oculusSplashScreen: DEFAULT_ANDROID_CONFIG_FIELDS.oculusSplashScreen,
      manifest: DEFAULT_ANDROID_CONFIG_FIELDS.manifest,
      ksPath: DEFAULT_ANDROID_CONFIG_FIELDS.ksPath,
      ksAlias: DEFAULT_ANDROID_CONFIG_FIELDS.ksAlias,
      ksPass: DEFAULT_ANDROID_CONFIG_FIELDS.ksPass,
    }
  }

  const unvalidatedAppConfig: HtmlAppConfig = {
    projectUrl: payload.projectUrl,
    shell: payload.shell,
    android: androidConfig,
    apple: appleConfig,
    appInfo: payload.appInfo,
    // TODO(lreyna): May need to add a way to pass this from the client or fetch it from the server
    additionalItems: [],
  }

  // NOTE: The resourceDir is going to be filled with user resources fetched before building
  unvalidatedAppConfig.appInfo.resourceDir = 'res/'

  if (unvalidatedAppConfig.appInfo.screenOrientation === undefined) {
    unvalidatedAppConfig.appInfo.screenOrientation = 'portrait'
  }
  if (unvalidatedAppConfig.appInfo.statusBarVisible === undefined) {
    unvalidatedAppConfig.appInfo.statusBarVisible = false
  }
  if (unvalidatedAppConfig.appInfo.versionCode === undefined) {
    unvalidatedAppConfig.appInfo.versionCode = DEFAULT_VERSION_CODE
  }
  if (unvalidatedAppConfig.appInfo.versionName === undefined) {
    unvalidatedAppConfig.appInfo.versionName = DEFAULT_VERSION_NAME
  }

  const {bundleId, displayName} = getBundleIdAndDisplayNameWithSuffix(
    unvalidatedAppConfig.appInfo.bundleIdentifier,
    unvalidatedAppConfig.appInfo.appDisplayName,
    payload.shell,
    unvalidatedAppConfig.appInfo.refHead
  )
  unvalidatedAppConfig.appInfo.bundleIdentifier = bundleId
  unvalidatedAppConfig.appInfo.appDisplayName = displayName

  return validateAppConfig(unvalidatedAppConfig)
}

const downloadImage = async (
  randomId: string,
  url: string,
  imageName: string,
  imageDir: string,
  supportedMimeTypes?: string[]
): Promise<boolean> => {
  try {
    const imageResponse = await fetch(url)
    if (!imageResponse.ok) {
      console.error(`[nae-builder][${randomId}] Warning: Failed to fetch image` +
            `${url}: ${imageResponse.statusText}`)
      return false
    }

    const buffer = await imageResponse.arrayBuffer()

    const mimeType = mimeTypeImage(new Uint8Array(buffer))
    if (supportedMimeTypes && !supportedMimeTypes.includes(mimeType)) {
      console.error(`[nae-builder][${randomId}] Error: Unsupported image mime type: ` +
        `${mimeType}`)
      return false
    }

    let imagePath: string
    switch (mimeType) {
      case 'image/png':
        imagePath = path.join(imageDir, `${imageName}.png`)
        break
      case 'image/jpeg':
        imagePath = path.join(imageDir, `${imageName}.jpg`)
        break
      default:
        console.error(`[nae-builder][${randomId}] Error: Unsupported image mime type: ` +
          `${mimeType}`)
        return false
    }

    fs.mkdirSync(imageDir, {recursive: true})
    fs.writeFileSync(imagePath, Buffer.from(buffer))
    return true
  } catch (error) {
    console.error(`[nae-builder][${randomId}] Error: Failed to fetch and store image ` +
          `${url}: ${error}`)
    return false
  }
}

const handleDownloadResources = async (
  appConfig: HtmlAppConfig,
  randomId: string,
  payload: NaeBuilderRequest,
  buildDirectory: string,
  iconTypes: string[],
  iconSizes: [number, number][],
  defaultResourcesDir: string
) => {
  const resourceDir = path.join(buildDirectory, appConfig.appInfo.resourceDir)

  // App icon download.
  let useDefaultResources = true
  if (payload.iconId) {
    const results = await Promise.all(
      iconTypes.map(async (iconType, i) => {
        const iconSize = iconSizes[i][0]
        const url = getIconUrl(payload.iconId, iconSize)
        const iconDir = (appConfig.shell === 'android' || appConfig.shell === 'quest')
          ? path.join(resourceDir, `mipmap-${iconType}`)
          : resourceDir
        const iconName = (appConfig.shell === 'android' || appConfig.shell === 'quest')
          ? 'ic_launcher'
          : `${iconType}`
        const supportedMimeTypes = appConfig.shell === 'ios' ? ['image/png'] : undefined
        return downloadImage(randomId, url, iconName, iconDir, supportedMimeTypes)
      })
    )

    // NOTE: Automatically fallback to other icon sizes if some are missing
    if (iconTypes.length === 0 || results.includes(true)) {
      useDefaultResources = false
    }
  }
  if (useDefaultResources) {
    console.log(`[nae-builder][${randomId}] Using default resources`)
    fs.cpSync(
      defaultResourcesDir,
      resourceDir,
      {recursive: true}
    )
  }

  // Launch screen icon download.
  // TODO(paris): Add support for Android.
  if (payload.launchScreenIconId && appConfig.shell === 'ios') {
    const iconSize = 512
    const url = getIconUrl(payload.launchScreenIconId, iconSize)
    const iconName = 'icon-launch-screen'
    await downloadImage(randomId, url, iconName, resourceDir, ['image/png'])
  }

  console.log(`[nae-builder][${randomId}] Resources copied to directory: ${resourceDir}`)
}

const handleAndroidKeystore = async (
  appConfig: HtmlAppConfig, randomId: string, payload: NaeBuilderRequest, buildDirectory: string
) => {
  if (!appConfig.android) {
    throw new Error(`[nae-builder][${randomId}] Android config is required for keystore`)
  }

  const keystoreInfo = {
    name: appConfig.appInfo.appName,
    organization: appConfig.appInfo.workspace,
  }

  const keystoreData = await getAndroidKeystoreData(
    payload.appUuid,
    appConfig.appInfo.refHead,
    keystoreInfo
  )

  // Write the keystore base64 data to a file
  const keystoreFilePath = path.join(buildDirectory, 'keystore.jks')
  fs.writeFileSync(keystoreFilePath, keystoreData.androidKeystoreFile, 'base64')

  appConfig.android.ksPath = keystoreFilePath
  appConfig.android.ksAlias = keystoreData.androidKeyAlias
  appConfig.android.ksPass = `pass:${keystoreData.androidKeyAndKeystorePassword}`

  console.log(`[nae-builder][${randomId}] Android signing key attributes set`)
}

const handleAppleSigning = async (
  appConfig: HtmlAppConfig, randomId: string, payload: NaeBuilderRequest, buildDirectory: string
) => {
  if (!appConfig.apple) {
    throw new Error(`[nae-builder][${randomId}] Apple config is required to set signing data`)
  }

  const localP12Path = process.env.NAE_LOCAL_APPLE_P12_PATH
  const localP12Password = process.env.NAE_LOCAL_APPLE_P12_PASSWORD
  const localProvisioningProfilePath = process.env.NAE_LOCAL_APPLE_PROVISIONING_PROFILE_PATH
  const localTeamIdentifier = process.env.PREFILLED_TEAM_IDENTIFIER

  if (localP12Path && localP12Password && localProvisioningProfilePath && localTeamIdentifier) {
    console.log(`[nae-builder][${randomId}] Using local Apple signing files for development`)

    if (!fs.existsSync(localP12Path)) {
      throw new Error(`[nae-builder][${randomId}] Local P12 file not found: ${localP12Path}`)
    }
    if (!fs.existsSync(localProvisioningProfilePath)) {
      throw new Error(
        `[nae-builder][${randomId}] Local provisioning profile not found: ` +
        `${localProvisioningProfilePath}`
      )
    }

    const p12FileBase64 = fs.readFileSync(localP12Path).toString('base64')
    const provisioningProfileBase64 = fs.readFileSync(localProvisioningProfilePath)
      .toString('base64')

    const p12FilePath = path.join(buildDirectory, 'signing-certificate.p12')
    const provisioningProfilePath = path.join(
      buildDirectory,
      'provisioning-profile.mobileprovision'
    )

    fs.writeFileSync(p12FilePath, p12FileBase64, 'base64')
    fs.writeFileSync(provisioningProfilePath, provisioningProfileBase64, 'base64')

    appConfig.apple.p12FilePath = p12FilePath
    appConfig.apple.p12Password = localP12Password
    appConfig.apple.provisioningProfile = provisioningProfilePath
    appConfig.apple.teamIdentifier = localTeamIdentifier

    console.log(`[nae-builder][${randomId}] Local Apple signing files configured`)
    return
  }

  if (!payload.appUuid) {
    throw new Error(`[nae-builder][${randomId}] appUuid is required for Apple signing`)
  }

  // Retrieve Apple signing data from DynamoDB based on appUuid and signing type
  const signingData = await getAppleSigningData(
    payload.appUuid, payload.accountUuid, appConfig.apple.signingType
  )

  // Write the keystore base64 data to a file
  const p12FilePath = path.join(buildDirectory, 'signing-certificate.p12')
  fs.writeFileSync(p12FilePath, signingData.appleP12File, 'base64')

  const provisioningProfilePath = path.join(buildDirectory, 'provisioning-profile.mobileprovision')
  fs.writeFileSync(provisioningProfilePath, signingData.appleProvisioningProfile, 'base64')

  appConfig.apple.p12FilePath = p12FilePath
  appConfig.apple.p12Password = signingData.appleP12Password
  appConfig.apple.provisioningProfile = provisioningProfilePath
  appConfig.apple.teamIdentifier = signingData.teamIdentifier

  console.log(`[nae-builder][${randomId}] Apple signing attributes set`)
}

const healthCheck = async (randomId: string, host: string): Promise<boolean> => {
  try {
    const response = await fetch(`http://${host}:3000/v1/health`)
    return response.ok
  } catch (error) {
    console.error(`[nae-builder][${randomId}] Failed to health check ${host}: ${error}`)
    return false
  }
}

const handleDownloadAssetCarAndIosResources = async (
  appConfig: HtmlAppConfig, randomId: string, payload: NaeBuilderRequest, buildDirectory: string
) => {
  // Call an API running on a Mac machine to use actool and create the Assets.car file.
  // TODO(paris): When we refactor to do the full build on EC2, we won't need to call the
  // API and can unify local testing vs xrhome builds.
  const body: CreateAssetCarRequest = {
    appIconName: 'AppIcon',
    platform: 'iphoneos',
    contentsJson: JSON.stringify(createAssetCarContentsJson()),
    iconId: payload.iconId,
    iconSizes: [
      {fileName: '1024.png', size: 1024},
    ],
    minimumDeploymentTarget: appConfig.apple?.minOsVersion,
  }
  const response = await fetch(
    `http://${process.env.NAE_ASSETS_CAR_API_HOST}:3000/v1/create-asset-car`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    }
  )
  if (!response.ok) {
    throw new Error(
      `[nae-builder][${randomId}] Failed to create Assets.car: ${
        response.status} ${response.statusText}`
    )
  }
  const data = await response.json() as CreateAssetCarResponse

  const assetCarPath = path.join(
    buildDirectory, appConfig.appInfo.resourceDir, 'Assets.car'
  )
  fs.mkdirSync(path.dirname(assetCarPath), {recursive: true})
  fs.writeFileSync(assetCarPath, data.assetCarFileBase64, 'base64')
  console.log(`[nae-builder][${randomId}] Assets.car created at: ${assetCarPath}`)

  // To pass app store validation, we also need two other app icon files:
  // - AppIcon60x60@2x.png
  // - AppIcon76x76@2x~ipad.png
  // Else you get:
  //   Validation failed (409) Invalid large app icon. The large app icon in the asset catalog in
  //   "catch-the-stack.app" can't be transparent or contain an alpha channel. For details, visit:
  //   https://developer.apple.com/design/human-interface-guidelines/app-icons.
  const resourceDir = path.join(buildDirectory, appConfig.appInfo.resourceDir)
  await downloadImage(
    randomId,
    getIconUrl(payload.iconId, 120),
    'AppIcon60x60@2x.png',
    resourceDir,
    ['image/png']
  )
  await downloadImage(
    randomId,
    getIconUrl(payload.iconId, 152),
    'AppIcon76x76@2x~ipad.png',
    resourceDir,
    ['image/png']
  )

  await handleDownloadResources(
    appConfig,
    randomId,
    payload,
    buildDirectory,
    // Do not download any of the iOS icons, just do the other resource processing.
    [],
    [],
    IOS_DEFAULT_RESOURCES
  )
}

const processMessage = async (
  payload: NaeBuilderRequest
) => {
  const buildData = defaultHistoricalBuildData()
  const randomId = payload.requestUuid
  let errorMessage = 'SUCCESS'
  try {
    const {workspace, appName} = payload.appInfo
    buildData.shellVersion = payload.shellVersion || 'unknown'
    buildData.requestUuid = payload.requestUuid
    buildData.exportType = payload.exportType
    buildData.buildRequestTimestampMs = payload.buildRequestTimestampMs
    buildData.buildStartTimestampMs = Date.now()

    console.log(
      `[nae-builder][${randomId}] Processing message payload:`, JSON.stringify(payload, null, 2)
    )

    const buildDirectory = (await exec('mktemp -d')).stdout.trim()
    console.log(`[nae-builder][${randomId}] Created directory: ${buildDirectory}`)

    const appConfig = extractAppConfigFromPayload(payload)
    buildData.publisher = appConfig.appInfo.workspace
    buildData.displayName = appConfig.appInfo?.appDisplayName || 'EMPTY'
    buildData.bundleId = appConfig.appInfo?.bundleIdentifier || 'EMPTY'
    buildData.versionName = appConfig.appInfo?.versionName || 'EMPTY'
    buildData.versionCode = appConfig.appInfo?.versionCode || 0
    buildData.platform = appConfig.shell
    buildData.buildMode = appConfig.appInfo.naeBuildMode
    buildData.refHead = appConfig.appInfo.refHead
    buildData.iconId = payload.iconId || 'EMPTY'
    buildData.screenOrientation = appConfig.appInfo.screenOrientation
    buildData.statusBarVisible = appConfig.appInfo.statusBarVisible
    buildData.buildId =
      `${buildData.platform}_${buildData.exportType}_${buildData.refHead}_${randomId}`

    if (!validateAppName(appName)) {
      throw new Error(`[nae-builder][${randomId}] Invalid app name: ${appName}`)
    }

    const isWebExportBundle = appConfig.shell === 'html'

    const appDisplayNameValidation = validateAppDisplayName(appConfig.appInfo.appDisplayName)
    if (!isWebExportBundle && appDisplayNameValidation !== 'success') {
      throw new Error(
        `[nae-builder][${randomId}] Invalid app display name: ` +
        `${appConfig.appInfo.appDisplayName} due to ${appDisplayNameValidation}`
      )
    }

    if (!isWebExportBundle && !validateBuildMode(appConfig.appInfo.naeBuildMode)) {
      throw new Error(`[nae-builder][${randomId}] Invalid build mode: ` +
        `${appConfig.appInfo.naeBuildMode}`)
    }

    if (!validateExportType(buildData.exportType)) {
      throw new Error(`[nae-builder][${randomId}] Invalid export type: ` +
        `${buildData.exportType}`)
    }

    if (!isWebExportBundle &&
      validateBundleIdUtil(payload.shell, appConfig.appInfo.bundleIdentifier) !== 'success') {
      throw new Error(`[nae-builder][${randomId}] Invalid bundle identifier: ` +
        `${appConfig.appInfo.bundleIdentifier}`)
    }

    if (!validateVersionNameUtil(appConfig.appInfo.versionName)) {
      throw new Error(`[nae-builder][${randomId}] Invalid version name: ` +
        `${appConfig.appInfo.versionName}`)
    }

    if (!buildData.requestUuid) {
      throw new Error(`[nae-builder][${randomId}] requestUuid is required`)
    }

    const studioGlobalEntry = await fetchStudioGlobalEntry(
      workspace,
      appName,
      appConfig.appInfo.refHead?.toLowerCase()
    )
    buildData.commitId = studioGlobalEntry.commitId

    // Add a cookie before writing the config file
    if (appConfig.appInfo.refHead === 'staging') {
      const devCookie = await createStagingCookie({workspace, appName})
      appConfig.devCookie = devCookie
    } else if (appConfig.appInfo.refHead !== 'production') {
      const devCookie = await createDevCookie(workspace)
      appConfig.devCookie = devCookie
    }

    switch (appConfig.shell) {
      case 'android':
      case 'quest':
        console.log(`[nae-builder][${randomId}] Building android app`)
        if (buildData.exportType !== 'apk' && buildData.exportType !== 'aab') {
          throw new Error(`[nae-builder][${randomId}] Android export must be either apk or aab`)
        }

        await handleDownloadResources(
          appConfig,
          randomId,
          payload,
          buildDirectory,
          NAE_ANDROID_ICON_TYPES,
          NAE_ANDROID_ICON_SIZES,
          ANDROID_DEFAULT_RESOURCES
        )
        await handleAndroidKeystore(appConfig, randomId, payload, buildDirectory)
        break
      case 'ios':
        console.log(`[nae-builder][${randomId}] Building ios app`)
        if (buildData.exportType !== 'ipa') {
          throw new Error(`[nae-builder][${randomId}] iOS export must be ipa`)
        }

        console.log(`[nae-builder][${randomId
        }] Creating asset car file, process.env.NAE_ASSETS_CAR_API_HOST: ${
          process.env.NAE_ASSETS_CAR_API_HOST}`)
        if (process.env.NAE_ASSETS_CAR_API_HOST &&
          await healthCheck(randomId, process.env.NAE_ASSETS_CAR_API_HOST)) {
          await handleDownloadAssetCarAndIosResources(
            appConfig,
            randomId,
            payload,
            buildDirectory
          )
        } else {
          console.log(`[nae-builder][${randomId}] Skipping Assets.car creation`)
          await handleDownloadResources(
            appConfig,
            randomId,
            payload,
            buildDirectory,
            NAE_IOS_ICON_TYPES,
            NAE_IOS_ICON_SIZES,
            IOS_DEFAULT_RESOURCES
          )
        }
        await handleAppleSigning(appConfig, randomId, payload, buildDirectory)
        break
      case 'osx':
        console.log(`[nae-builder][${randomId}] Building osx app`)
        break
      case 'html':
        console.log(`[nae-builder][${randomId}] Building html bundle`)
        break
      default:
        console.error(`[nae-builder][${randomId}] Unsupported shell: ${appConfig.shell}`)
        return
    }

    const configPath = path.join(buildDirectory, `config-${randomId}.json`)
    fs.writeFileSync(
      configPath,
      JSON.stringify(appConfig, null, 2)
    )

    const outPath = path.join(
      buildDirectory,
      getDownloadedFileName(appName, buildData.exportType)
    )

    try {
      // NOTE: For now, we manually exec the ts script, in the future we could import the method
      await streamExec(
        `node ${NAE_PACKAGER_PATH} --config=${configPath} --out=${outPath}`,
        `[nae-builder][${randomId}]`
      )
    } catch {
      throw Error(`[nae-builder][${randomId}] Error building NAE application`)
    }

    buildData.buildEndTimestampMs = Date.now()

    const buildDuration = buildData.buildEndTimestampMs - payload.buildRequestTimestampMs
    console.log(
      `[nae-builder][${randomId}] Request Time: ${payload.buildRequestTimestampMs}, ` +
      `Build Start Time: ${buildData.buildStartTimestampMs}, ` +
      `Build End Time: ${buildData.buildEndTimestampMs}, ` +
      `Build Duration: ${buildDuration}ms`
    )

    // Now that building is done, we can upload the file to S3 and notify the user
    // https://docs.google.com/document/d/<REMOVED_BEFORE_OPEN_SOURCING>
    const s3Key = naeS3Key(payload.appUuid, buildData.buildId, buildData.exportType)

    buildData.sizeBytes = fs.statSync(outPath).size

    const outputFileStream = fs.createReadStream(outPath)
    await S3.use().putObject({
      Bucket: naeBuildOutputBucket,
      Key: s3Key,
      Body: outputFileStream,
      ContentLength: buildData.sizeBytes,
      ContentType: 'application/octet-stream',
    })

    console.log(`[nae-builder][${randomId}] Build uploaded to S3: ${s3Key}`)

    buildData.status = 'SUCCESS'

    await snsClient.send(new PublishCommand({
      Message: 'Successfully built native export',
      MessageAttributes: makeNaeCreditTopicAttributes(payload.requestUuid, true),
      TopicArn: process.env.CREDIT_NOTIFICATION_TOPIC,
    }))
  } catch (error) {
    console.error('[nae-builder] Error processing message:', error)
    errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    await snsClient.send(new PublishCommand({
      Message: 'Failed to build native export',
      MessageAttributes: makeNaeCreditTopicAttributes(payload.requestUuid, false),
      TopicArn: process.env.CREDIT_NOTIFICATION_TOPIC,
    }))
  } finally {
    const buildNotificationData: BuildNotificationData = {
      repoId: payload.repoId,
      repositoryName: `${payload.appInfo.workspace}.${payload.appInfo.appName}`,
      branch: payload.requestRef.toLowerCase(),
      errorMessage,
      ...buildData,
    }
    console.log(`[nae-builder][${randomId}] buildNotificationData:`,
      JSON.stringify(buildNotificationData, null, 2))
    await sendBuildNotification('NAE_NEW_BUILD', buildNotificationData)
    console.log(`[nae-builder][${randomId}] NAE build notification sent to user`)

    await putBuildDataToDb(
      ddbHistoricalBuildsTableName,
      payload.appUuid,
      buildData
    )
    console.log(`[nae-builder][${randomId}] NAE build data updated in DB`)
  }

  // NOTE(lreyna): We only exit with an error code when running locally for testing
  // to make sure the lambda doesn't catch an error and send extra notifications to the user
  if (process.env.NAE_RUN_LOCALLY && buildData.status !== 'SUCCESS') {
    process.exit(1)
  }
}

const main = async () => {
  const {naeBuilderRequest} = checkArgs({
    requiredFlags: ['naeBuilderRequest'],
  })

  const request: NaeBuilderRequest = JSON.parse(naeBuilderRequest as string)
  await processMessage(request)
}

main()
