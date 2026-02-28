// @attr(visibility = ["//visibility:public"])

import {HTML_SHELL_TYPES} from '@nia/reality/shared/nae/nae-constants'
import type {
  AndroidConfig,
  AppInfo,
  AppleConfig,
  HtmlAppConfig,
} from '@nia/reality/shared/nae/nae-types'

// NOTE: CommitId is fetched at build time, and it not expected to be set in the config file.
const APP_INFO_FIELDS: Set<keyof AppInfo> = new Set([
  'workspace', 'appName', 'refHead', 'naeBuildMode', 'appDisplayName', 'screenOrientation',
  'statusBarVisible', 'resourceDir', 'bundleIdentifier', 'versionCode', 'versionName',
  'permissions',
])

const APP_CONFIG_FIELDS: Set<keyof HtmlAppConfig> = new Set([
  'projectUrl', 'shell', 'android', 'apple', 'niaEnvAccessCode', 'devCookie',
  'appInfo', 'additionalItems',
])

const APPLE_CONFIG_FIELDS: Set<keyof AppleConfig> = new Set([
  'bundleIdentifier', 'teamIdentifier', 'versionCode', 'versionName', 'certificate',
  'provisioningProfile', 'signingType', 'minOsVersion', 'p12FilePath', 'p12Password',
])

const DEFAULT_VERSION_CODE = 1
const DEFAULT_VERSION_NAME = '1.0.0'

const DEFAULT_APP_INFO_FIELDS: Partial<AppInfo> = {
  versionCode: DEFAULT_VERSION_CODE,
  versionName: DEFAULT_VERSION_NAME,
}

const DEFAULT_APPLE_CONFIG_FIELDS: Partial<AppleConfig> = {
  versionCode: DEFAULT_VERSION_CODE,
  versionName: DEFAULT_VERSION_NAME,
  teamIdentifier: '',
  certificate: '',
  provisioningProfile: '',
  signingType: 'development',
  minOsVersion: '14.0',
  p12FilePath: '',
  p12Password: '',
}
const ANDROID_CONFIG_FIELDS: Set<keyof AndroidConfig> = new Set([
  'packageName', 'versionCode', 'versionName', 'minSdkVersion', 'targetSdkVersion',
  'oculusSplashScreen', 'ksPath', 'ksAlias', 'ksPass', 'manifest',
])
const DEFAULT_ANDROID_CONFIG_FIELDS: Partial<AndroidConfig> = {
  versionCode: DEFAULT_VERSION_CODE,
  versionName: DEFAULT_VERSION_NAME,
  minSdkVersion: 26,
  targetSdkVersion: 35,
  ksPath: `${process.env.RUNFILES_DIR}` +
    '/_main/reality/app/nae/packager/android/android-html-packager-tools/bazel_debug.keystore',
  ksAlias: 'androiddebugkey',
  ksPass: 'pass:android',
  oculusSplashScreen: '',
  manifest: '',
}

type AndroidConfigOverrides = 'ksPath' | 'ksAlias' | 'ksPass' | 'versionCode'
  | 'versionName'
type AppleConfigOverrides = 'versionCode' | 'versionName' | 'certificate'
  | 'provisioningProfile' | 'p12FilePath' | 'p12Password'
type AppInfoOverrides = 'versionCode' | 'versionName'
interface OverrideConfig {
  android?: Partial<Pick<AndroidConfig, AndroidConfigOverrides>>
  apple?: Partial<Pick<AppleConfig, AppleConfigOverrides>>
  appInfo?: Partial<Pick<AppInfo, AppInfoOverrides>>
}

const mergeDefaultsAndOverrides = (
  config: any,
  overrides: OverrideConfig
): any => {
  const androidOverrides = overrides.android || {}
  const defaultAndroidConfig = config.android
    ? {android: {...DEFAULT_ANDROID_CONFIG_FIELDS, ...config.android, ...androidOverrides}}
    : {}
  const appleOverrides = overrides.apple || {}
  const defaultAppleConfig = config.apple
    ? {apple: {...DEFAULT_APPLE_CONFIG_FIELDS, ...config.apple, ...appleOverrides}}
    : {}
  const appInfoOverrides = overrides.appInfo || {}
  const defaultAppInfo = config.appInfo
    ? {appInfo: {...DEFAULT_APP_INFO_FIELDS, ...config.appInfo, ...appInfoOverrides}}
    : {}

  return {
    ...config,
    ...defaultAndroidConfig,
    ...defaultAppleConfig,
    ...defaultAppInfo,
  }
}

const validateAppInfo = (appInfo: any) => {
  const infoKeys: any[] = Object.keys(appInfo)
  const unexpectedFields = infoKeys.filter(key => !APP_INFO_FIELDS.has(key))
  if (unexpectedFields.length) {
    // eslint-disable-next-line no-console
    console.warn('Unexpected fields in appInfo:', unexpectedFields)
  }

  const requiredStringFields = ['workspace', 'appName']
  for (const field of requiredStringFields) {
    if (typeof appInfo[field] !== 'string' || !appInfo[field]) {
      throw new Error(`Error: Asset Config ${field} must be a non-empty string`)
    }
  }
}

const validateAndroidConfig = (config: any) => {
  const configKeys: any[] = Object.keys(config)
  const unexpectedFields = configKeys.filter(key => !ANDROID_CONFIG_FIELDS.has(key))
  if (unexpectedFields.length) {
    // eslint-disable-next-line no-console
    console.warn('Unexpected fields in Android config:', unexpectedFields)
  }

  // TODO(lucas): packageName was moved to AppInfo, remove from here once xrhome is updated.
  const requiredStringFields = ['packageName', 'versionName']
  for (const field of requiredStringFields) {
    if (typeof config[field] !== 'string' || !config[field]) {
      throw new Error(`Error: Android ${field} must be a non-empty string`)
    }
  }

  if (typeof config.versionCode !== 'number' || config.versionCode < 1) {
    throw new Error('Error: Android versionCode must be a positive integer')
  }
}

const validateAppleConfig = (config: any) => {
  const configKeys: any[] = Object.keys(config)
  const unexpectedFields = configKeys.filter(key => !APPLE_CONFIG_FIELDS.has(key))
  if (unexpectedFields.length) {
    // eslint-disable-next-line no-console
    console.warn('Unexpected fields in Apple config:', unexpectedFields)
  }

  if (typeof config.versionCode !== 'number' || config.versionCode < 1) {
    throw new Error('Error: Apple versionCode must be a positive integer')
  }
}

const validateConfigObject = (config: any): HtmlAppConfig => {
  // Ensure there aren't any unexpected or missing fields.
  const configKeys: any[] = Object.keys(config)
  const unexpectedFields = configKeys.filter(key => !APP_CONFIG_FIELDS.has(key))
  if (unexpectedFields.length) {
    // eslint-disable-next-line no-console
    console.warn('Unexpected fields in config:', unexpectedFields)
  }

  if (!config.projectUrl || typeof config.projectUrl !== 'string') {
    throw new Error('Error: projectUrl must be a non-empty string')
  }

  if (!config.shell || !HTML_SHELL_TYPES.includes(config.shell)) {
    throw new Error(`Error: shell must be one of: ${HTML_SHELL_TYPES.join(', ')}`)
  }

  if (config.niaEnvAccessCode && config.devCookie) {
    throw new Error('Error: Either `niaEnvAccessCode` or `devCookie` can be set, not both')
  }

  if (['android', 'quest'].includes(config.shell) && !config.android) {
    throw new Error(`Error: Android config is required for shell type "${config.shell}"`)
  }

  if (['ios', 'osx'].includes(config.shell) && !config.apple) {
    throw new Error(`Error: Apple config is required for shell type "${config.shell}"`)
  }

  if (config.appInfo) {
    validateAppInfo(config.appInfo)
  }

  if (config.android) {
    validateAndroidConfig(config.android)
  }

  if (config.apple) {
    validateAppleConfig(config.apple)
  }

  return config as HtmlAppConfig
}

const validateAppConfig = (
  config: any,
  overrides: OverrideConfig = {}
): HtmlAppConfig => {
  if (typeof config !== 'object' || !config) {
    throw new Error(`Error: Config must be a non-null object  ${config}`)
  }

  const mergedConfig = mergeDefaultsAndOverrides(config, overrides)
  return validateConfigObject(mergedConfig)
}

export type {
  OverrideConfig,
}

export {
  validateAppConfig,
  DEFAULT_VERSION_CODE,
  DEFAULT_VERSION_NAME,
  DEFAULT_APPLE_CONFIG_FIELDS,
  DEFAULT_ANDROID_CONFIG_FIELDS,
}
