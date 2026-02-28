// @rule(js_cli)
// @name(packager)
// @attr[](data = ":android-shell-runfiles")
// @attr[](data = ":quest-shell-runfiles")
// @attr[](data = ":ios-shell-runfiles")
// @attr[](data = ":osx-shell-runfiles")
// @attr[](data = "//reality/app/nae/packager/android:android-html-packager-tools")
// @attr[](data = "//reality/app/nae/packager/android:build-android-html-app")
// @attr[](data = "//reality/app/nae/packager/apple:apple-html-packager-tools")
// @attr[](data = "//reality/app/nae/packager/apple:build-apple-html-app")
// @attr[](data = "@bazel_tools//tools/jdk:current_java_runtime")
// @attr(esnext = 1)
// @attr(npm_rule = "@npm-html-app-packager//:npm-html-app-packager")
// @attr(target = "node")
// @attr(visibility = ["//visibility:public"])

// eslint-disable-next-line max-len
// @attr(target_compatible_with = JAVA_TOOLCHAIN_COMPATIBLE)

/* eslint-disable no-console */
import {exec as execCb, spawn} from 'child_process'
import {promises as fs} from 'fs'
import {promisify} from 'util'
import path from 'path'

import type {
  Headers,
  Response,
} from 'undici-types'

import {S3Client} from '@aws-sdk/client-s3'
import {DynamoDBClient} from '@aws-sdk/client-dynamodb'

import {checkArgs} from '@nia/c8/cli/args'
import {createHttpCache} from '@nia/c8/dom/http-cache/http-cache'
// @inliner-skip-next
import {HTTP_CACHE_DIRECTORY} from '@nia/c8/dom/http-cache/http-cache-storage'
import {encrypt} from '@nia/c8/dom/dev-access'
import {Ddb} from '@nia/reality/shared/dynamodb'
import {createDdbApi} from '@nia/reality/shared/dynamodb-impl'
import {S3} from '@nia/reality/shared/s3'
import {createS3Api} from '@nia/reality/shared/s3-impl'
import {cookieToString} from '@nia/reality/app/nae/packager/cookie-utils'
import {
  createOnAssetDownloadedLocalCallback,
} from '@nia/reality/app/nae/packager/html-app-asset-handler'
import {
  type AssetDownloadedCallbackArgs,
  fetchAssetsFromAppConfig,
} from '@nia/reality/app/nae/packager/html-app-asset-provider'
import {
  packageWebBundle,
} from '@nia/reality/app/nae/packager/html-app-packager-web-export'
import {
  fetchStudioGlobalEntry,
  type StudioGlobalEntry,
} from '@nia/reality/shared/studio/fetch-studio-global-entry'
import type {
  AppInfo,
  AndroidScreenOrientation,
  HtmlAppConfig,
  HtmlShell,
  IosScreenOrientation,
} from '@nia/reality/shared/nae/nae-types'
import {OverrideConfig, validateAppConfig} from './html-app-config'

const global = globalThis as any
const builtIn = {
  Headers: global.Headers as typeof Headers,
  Request: global.Request as typeof Request,
  Response: global.Response as typeof Response,
}

/**
 * Credentials should be set through either:
 *  1. SOLSTICE_AWS_ACCESS_KEY_ID & SOLSTICE_AWS_ACCESS_KEY_SECRET environment vars (GitLab CI)
 *  2. ~/.aws/credentials file stored locally
 *  3. AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment vars
 */
const AWS_CONFIG = {
  region: 'us-west-2',
  ...(
    process.env.SOLSTICE_AWS_ACCESS_KEY_ID && process.env.SOLSTICE_AWS_ACCESS_KEY_SECRET
      ? {
        credentials: {
          accessKeyId: process.env.SOLSTICE_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.SOLSTICE_AWS_ACCESS_KEY_SECRET,
        },
      }
      : {}
  ),
}

const exec = promisify(execCb)
const stdout = async (cmd: string) => (await exec(cmd)).stdout.trim()
const spawnExec = (cmd: string, args: ReadonlyArray<string>) => new Promise<void>(
  (resolve, reject) => {
    const proc = spawn(cmd, args)
    proc.stdout.on('data', data => console.log(data.toString().trim()))
    proc.stderr.on('data', data => console.error(data.toString().trim()))
    proc.on('exit', code => (code ? reject() : resolve()))
  }
)
const runfilePath = (filePath: string) => `${process.env.RUNFILES_DIR}/${filePath}`

type PackagerConfig = {
  configPath: string
  appConfig: HtmlAppConfig
  outputPath: string
}

type AndroidToolsPaths = {
  javaExecutable: string
  jarSignerExecutable: string
  platformJar: string
  aapt2: string
  manifestMergerJar: string
  bundletoolJar: string
  manifestTemplate: string
  shellLib: string
  d8Executable: string
}

type AppleToolsPaths = {
  entitlementsTemplate: string
  infoPlistTemplate: string
  rustCodesign: string
  shellLib: string
}

const ANDROID_CLI_ARGS = [
  'android.ksPath',
  'android.ksAlias',
  'android.ksPass',
  // TODO(lucas): This was moved to AppInfo, remove from here once xrhome is updated.
  'android.versionCode',
  'android.versionName',
] as const

const APPLE_CLI_ARGS = [
  // TODO(lucas): This was moved to AppInfo, remove from here once xrhome is updated.
  'apple.versionCode',
  'apple.versionName',
  'apple.certificate',
  'apple.provisioningProfile',
  'apple.p12FilePath',
  'apple.p12Password',
] as const

const APP_INFO_CLI_ARGS = [
  'appInfo.versionCode',
  'appInfo.versionName',
]

const parseArgsForConfig = async (): Promise<PackagerConfig> => {
  const {config: configPath, out, ...args} = checkArgs({
    requiredFlags: ['config', 'out'],
    optionalFlags: [...ANDROID_CLI_ARGS, ...APPLE_CLI_ARGS, ...APP_INFO_CLI_ARGS],
  })

  const appConfigString = await fs.readFile(configPath as string, 'utf8')

  const overrideConfig: any = {}
  Object.entries(args).forEach(([key, value]) => {
    if (ANDROID_CLI_ARGS.includes(key as typeof ANDROID_CLI_ARGS[number])) {
      const androidKey = key.replace('android.', '')

      overrideConfig.android = {
        ...(overrideConfig.android || {}),
        [androidKey]: value,
      }
    }
    if (APPLE_CLI_ARGS.includes(key as typeof APPLE_CLI_ARGS[number])) {
      const appleKey = key.replace('apple.', '')

      overrideConfig.apple = {
        ...(overrideConfig.apple || {}),
        [appleKey]: value,
      }
    }
  })

  if (overrideConfig.android?.versionCode) {
    overrideConfig.android.versionCode = parseInt(overrideConfig.android.versionCode, 10)
  }
  if (overrideConfig.apple?.versionCode) {
    overrideConfig.apple.versionCode = parseInt(overrideConfig.apple.versionCode, 10)
  }

  const appConfig = validateAppConfig(JSON.parse(appConfigString), overrideConfig as OverrideConfig)

  const outputPath = out as string
  const ext = path.extname(outputPath)
  if (appConfig.android) {
    if (ext !== '.aab' && ext !== '.apk') {
      throw new Error(
        `Error: Output path extension (${ext}) is not supported. Expected .aab or .apk`
      )
    }
  }

  if (appConfig.apple) {
    if ((appConfig.shell === 'osx' && ext !== '.app') ||
        (appConfig.shell === 'ios' && ext !== '.app' && ext !== '.ipa')) {
      throw new Error(
        `Error: Output path extension (${ext}) is not supported. ` +
        'Expected .app for OSX / iOS or .ipa for iOS'
      )
    }
  }

  return {
    configPath: configPath as string,
    appConfig,
    outputPath,
  }
}

/**
 * The Java path may vary depending on the host machine. For example, on macOS, the rules_java
 * directory looks like: "rules_java~~toolchains~remotejdk11_macos_aarch64/".
 */
const getJavaToolPath = async (toolname: string) => {
  const runtimeDirFiles = await fs.readdir(runfilePath(''))
  const rulesJavaPath = runtimeDirFiles.find(file => file.startsWith('rules_java'))
  return runfilePath(`${rulesJavaPath}/bin/${toolname}`)
}

const getAndroidToolsPaths = async (config: PackagerConfig): Promise<AndroidToolsPaths> => {
  const javaExecutable = await getJavaToolPath('java')
  const jarSignerExecutable = await getJavaToolPath('jarsigner')
  const toolsDir = runfilePath('_main/reality/app/nae/packager/android/android-html-packager-tools')
  const shellLib = runfilePath(
    `_main/c8/html-shell/android/${config.appConfig.shell}/html-shell-${config.appConfig.shell}.aar`
  )

  return {
    javaExecutable,
    jarSignerExecutable,
    platformJar: `${toolsDir}/android.jar`,
    aapt2: `${toolsDir}/aapt2`,
    manifestMergerJar: `${toolsDir}/android-manifest-merger.jar`,
    bundletoolJar: `${toolsDir}/android-bundle-tool.jar`,
    manifestTemplate: `${toolsDir}/manifest.xml.tpl`,
    shellLib,
    d8Executable: `${toolsDir}/d8`,
  }
}

const getAppleToolsPaths = async (config: PackagerConfig): Promise<AppleToolsPaths> => {
  const toolsDir = runfilePath('_main/reality/app/nae/packager/apple/apple-html-packager-tools')

  const shellLib = runfilePath(`_main/c8/html-shell-tauri/html-shell-${config.appConfig.shell}.zip`)

  return {
    entitlementsTemplate: `${toolsDir}/Entitlements.plist.${config.appConfig.shell}.tpl`,
    infoPlistTemplate: `${toolsDir}/Info.plist.${config.appConfig.shell}.tpl`,
    rustCodesign: `${toolsDir}/rcodesign`,
    shellLib,
  }
}

const listResourceFiles = async (resourceDir: string): Promise<string[]> => {
  const files = await fs.readdir(resourceDir)

  const results = await Promise.all(files.map(async (file) => {
    const filePath = path.join(resourceDir, file)
    const stat = await fs.stat(filePath)

    if (stat.isDirectory()) {
      return listResourceFiles(filePath)
    } else {
      return filePath
    }
  }))

  return results.flat()
}

// Only override the display name if it's explicitly set in the config or if it's not set at all.
// Returns true if the display name was set, false otherwise.

// Expecting the resourceDir to be a path relative to the config file.

// TODO(lreyna): Consider handling App Display Name for different locales.
const applyAndroidDisplayName = async (
  resourceDir: string, resourceList: string[], appInfo: AppInfo
) => {
  const appNameXmlKey = 'app_name'
  const stringXmlPath = path.join(resourceDir, 'values', 'strings.xml')

  if (!resourceList.includes(stringXmlPath)) {
    const displayName = appInfo.appDisplayName || appInfo.appName
    await fs.mkdir(path.dirname(stringXmlPath), {recursive: true})
    await fs.writeFile(
      stringXmlPath,
      `
<resources>
    <string name="${appNameXmlKey}">${displayName}</string>
</resources>
      `
    )
    console.log('No strings.xml file found. Creating a new one.', stringXmlPath)

    resourceList.push(stringXmlPath)

    return true
  }

  if (!appInfo.appDisplayName) {
    return false
  }

  // If more complicated replaces are needed in the future, we should consider using a library like
  // xml2js or fast-xml-parser to parse the XML and modify it.
  const displayNameContent = await fs.readFile(stringXmlPath, 'utf8')

  const displayNameRegex = new RegExp(`<string name="${appNameXmlKey}">.*?<\\/string>`)
  const newDisplayNameContent = displayNameContent.replace(
    displayNameRegex,
    `<string name="${appNameXmlKey}">${appInfo.appDisplayName}</string>`
  )

  // When running locally on OSX or on Lambda, we get:
  // - `EACCES: permission denied, open '/.../res/values/strings.xml'`
  // So here we update the file permissions to ensure it's writable before writing.
  await fs.chmod(stringXmlPath, 0o644)
  await fs.writeFile(stringXmlPath, newDisplayNameContent)

  return true
}

// NOTE(lreyna): We're forcing legacy Android icons to fit the adaptive icon structure.
// This is because the adaptive icon structure is required to fill the entire app icon area on
// certain Android platforms.
// See: https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
const tryApplyAndroidAdaptiveIcon = async (
  resourceDir: string, resourceList: string[]
) => {
  // NOTE: `ic_launcher.xml` is for adaptive icons, which is prioritized over legacy icons.
  // 'reality/app/nae/packager/android/manifest.xml.tpl' requires the name to be `ic_launcher`.
  const adaptiveIconPath = path.join(resourceDir, 'mipmap-anydpi-v26', 'ic_launcher.xml')
  const xxxhdpiLegacyIconPath = path.join(resourceDir, 'mipmap-xxxhdpi', 'ic_launcher.png')
  const foregroundMipmapPath = path.join(resourceDir, 'mipmap', 'ic_launcher_foreground.png')
  const foregroundDrawablePath = path.join(resourceDir, 'drawable', 'ic_launcher_foreground.xml')
  const backgroundDrawablePath = path.join(resourceDir, 'drawable', 'ic_launcher_background.xml')

  if (resourceList.includes(adaptiveIconPath)) {
    // If the adaptive icon is explicitly set, we don't need to create one.
    // NOTE: The android build tools will fail if the structure is not correct.
    return
  }

  if (!resourceList.includes(xxxhdpiLegacyIconPath)) {
    // Since there's no png file for the adaptive icon, skip trying to create one.
    return
  }

  // NOTE: The adaptive icon structure requires a foreground and background drawable.
  // The foreground mipmap is the png file from the legacy icon, and the background drawable
  // is a solid color drawable that will only be seen if the foreground has transparency.
  // TODO(lreyna): Consider allowing the user to specify a custom drawables.
  // NOTE(lreyna): An inset of 12dp is used to display as much of the legacy icon as possible.
  // See: https://medium.com/google-design/designing-adaptive-icons-515af294c783
  const defaultForegroundDrawable =
`<inset xmlns:android="http://schemas.android.com/apk/res/android"
    android:inset="12dp"
    android:gravity="center"
    android:drawable="@mipmap/ic_launcher_foreground" />
`

  await fs.mkdir(path.dirname(foregroundDrawablePath), {recursive: true})
  await fs.writeFile(foregroundDrawablePath, defaultForegroundDrawable)
  console.log('No foreground drawable found. Creating a new one.', foregroundDrawablePath)
  resourceList.push(foregroundDrawablePath)

  const defaultBackgroundDrawable =
`<shape xmlns:android="http://schemas.android.com/apk/res/android"
      android:shape="rectangle">
    <solid android:color="#000000"/>
</shape>
`

  await fs.mkdir(path.dirname(backgroundDrawablePath), {recursive: true})
  await fs.writeFile(backgroundDrawablePath, defaultBackgroundDrawable)
  console.log('No background drawable found. Creating a new one.', backgroundDrawablePath)
  resourceList.push(backgroundDrawablePath)

  await fs.mkdir(path.dirname(foregroundMipmapPath), {recursive: true})
  await fs.copyFile(xxxhdpiLegacyIconPath, foregroundMipmapPath)
  console.log('No foreground mipmap found. Copying xxxhdpi adaptive icon.', foregroundMipmapPath)
  resourceList.push(foregroundMipmapPath)

  // TODO(lreyna): Consider updating to add support for monochrome icons.
  // https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive#monochrome
  const defaultAdaptiveIcLauncherXml =
`<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
`

  await fs.mkdir(path.dirname(adaptiveIconPath), {recursive: true})
  await fs.writeFile(adaptiveIconPath, defaultAdaptiveIcLauncherXml)
  console.log(
    'No ic_launcher.xml found for Android adaptive icons. Creating a new one.',
    adaptiveIconPath
  )
  resourceList.push(adaptiveIconPath)
}

const verifyAndroidStyles = async (
  resourceDir: string, resourceList: string[]
) => {
  const stylesXmlPath = path.join(resourceDir, 'values', 'styles.xml')

  if (!resourceList.includes(stylesXmlPath)) {
    await fs.mkdir(path.dirname(stylesXmlPath), {recursive: true})
    await fs.writeFile(
      stylesXmlPath,
      `<resources>

    <!-- Base application theme. -->
    <style name="AppTheme">
    </style>

</resources>
      `
    )
    console.log('No styles.xml file found. Creating a new one.', stylesXmlPath)

    resourceList.push(stylesXmlPath)
  }

  // TODO(lreyna): Validate the styles.xml file to ensure it has the correct structure.
}

const getAndroidScreenOrientation = (
  requestedScreenOrientation: string,
  currentShell: HtmlShell
): AndroidScreenOrientation => {
  let androidScreenOrientation: AndroidScreenOrientation

  switch (requestedScreenOrientation) {
    case 'portrait':
      androidScreenOrientation = 'portrait'
      break
    case 'portrait-down':
      androidScreenOrientation = 'reversePortrait'
      break
    case 'landscape-left':
      androidScreenOrientation = 'landscape'
      break
    case 'landscape-right':
      androidScreenOrientation = 'reverseLandscape'
      break
    case 'auto':
      androidScreenOrientation = 'sensor'
      break
    case 'auto-landscape':
      androidScreenOrientation = 'sensorLandscape'
      break
    default:
      androidScreenOrientation = 'portrait'
      console.warn(
        `Unsupported screen orientation "${requestedScreenOrientation}". Defaulting to "portrait".`
      )
      break
  }

  // Some shells only support landscape orientation, so we override the screen orientation to
  // landscape for those shells.
  const landscapeOnlyShells: HtmlShell[] = ['quest']
  if (requestedScreenOrientation !== 'landscape-left' &&
      landscapeOnlyShells.includes(currentShell)) {
    androidScreenOrientation = 'landscape'
    console.warn(
      `Shell "${currentShell}" only supports landscape orientation. Overriding to "landscape".`
    )
  }

  return androidScreenOrientation
}

const packageAndroidApp = async (
  config: PackagerConfig, commitId: string, assetCachePath: string
) => {
  console.log('Packaging Android app...')

  const {configPath, appConfig} = config
  if (!appConfig.android) {
    throw new Error('Error: Android config is required for Android builds')
  }

  // Verify the expected output directory exists.
  const outputDir = path.dirname(config.outputPath)
  await fs.mkdir(outputDir, {recursive: true})

  const androidPackager = runfilePath(
    '_main/reality/app/nae/packager/android/build-android-html-app.sh'
  )
  const androidToolsPaths = await getAndroidToolsPaths(config)

  // TODO(alvinp): This is only needed to be backwards compatible with the old Bazel rules.
  // Otherwise, we should just use the `--dir` flag for the AAPT2 compile step.

  const absoluteResourceDir = path.join(
    `${path.dirname(configPath)}`, `${appConfig.appInfo?.resourceDir}`
  )
  const resFiles = await listResourceFiles(absoluteResourceDir)

  if (await applyAndroidDisplayName(absoluteResourceDir, resFiles, appConfig.appInfo!)) {
    const displayName = appConfig.appInfo?.appDisplayName || appConfig.appInfo?.appName
    console.log('Android App Display name set to:', displayName)
  }

  await tryApplyAndroidAdaptiveIcon(absoluteResourceDir, resFiles)
  await verifyAndroidStyles(absoluteResourceDir, resFiles)

  const oculusSplashScreenPath = appConfig.android.oculusSplashScreen
    ? `${path.dirname(configPath)}/${appConfig.android.oculusSplashScreen}`
    : ''

  const manifestFilePath = appConfig.android.manifest
    ? `${path.dirname(configPath)}/${appConfig.android.manifest}`
    : ''

  const androidScreenOrientation = getAndroidScreenOrientation(
    appConfig.appInfo?.screenOrientation || 'portrait',
    appConfig.shell
  )

  const packagerArgs: string[] = [
    config.outputPath,
    androidToolsPaths.javaExecutable,
    androidToolsPaths.platformJar,
    androidToolsPaths.aapt2,
    androidToolsPaths.manifestMergerJar,
    androidToolsPaths.bundletoolJar,
    androidToolsPaths.shellLib,
    androidToolsPaths.manifestTemplate,
    appConfig.projectUrl,
    appConfig.appInfo?.bundleIdentifier || '',
    String(appConfig.android?.minSdkVersion),
    String(appConfig.android?.targetSdkVersion),
    resFiles.join(','),
    appConfig.android.ksPath,
    String(appConfig.niaEnvAccessCode),
    appConfig.devCookie ? encrypt(cookieToString(appConfig.devCookie)) : '',
    oculusSplashScreenPath,
    appConfig.android.ksAlias,
    appConfig.android.ksPass,
    String(appConfig.appInfo?.versionCode),
    appConfig.appInfo?.versionName || '',
    // TODO(paris): Remove this so that we instead use the same tempDir as the packager.
    appConfig.appInfo ? `${assetCachePath}/${HTTP_CACHE_DIRECTORY}` : '',
    manifestFilePath,
    commitId,
    appConfig.appInfo?.naeBuildMode ?? 'static',
    androidToolsPaths.jarSignerExecutable,
    // If we are building on Lambda, we should use a temporary directory specified by the Lambda
    // (because it will have us use one on EFS). If not set, the packager will create one itself.
    process.env.HTML_APP_PACKAGER_TEMP_DIR || '',
    androidScreenOrientation,
    String(appConfig.appInfo?.statusBarVisible ?? 'true'),
    androidToolsPaths.d8Executable,
  ]

  await spawnExec(androidPackager, packagerArgs)

  console.log('Success!')
}

// Get the xml strings for the static orientation values that iOS expects in the Info.plist file.
const getIosScreenOrientation = (
  requestedScreenOrientation: string
): string => {
  const iosScreenOrientations: IosScreenOrientation[] = []

  switch (requestedScreenOrientation) {
    case 'portrait':
      iosScreenOrientations.push('UIInterfaceOrientationPortrait')
      break
    case 'portrait-down':
      iosScreenOrientations.push('UIInterfaceOrientationPortraitUpsideDown')
      break
    case 'landscape-left':
      iosScreenOrientations.push('UIInterfaceOrientationLandscapeLeft')
      break
    case 'landscape-right':
      iosScreenOrientations.push('UIInterfaceOrientationLandscapeRight')
      break
    case 'auto':
      iosScreenOrientations.push('UIInterfaceOrientationPortrait')
      iosScreenOrientations.push('UIInterfaceOrientationLandscapeLeft')
      iosScreenOrientations.push('UIInterfaceOrientationLandscapeRight')
      break
    case 'auto-landscape':
      iosScreenOrientations.push('UIInterfaceOrientationLandscapeLeft')
      iosScreenOrientations.push('UIInterfaceOrientationLandscapeRight')
      break
    default:
      iosScreenOrientations.push('UIInterfaceOrientationPortrait')
      console.warn(
        `Unsupported screen orientation "${requestedScreenOrientation}". Defaulting to "portrait".`
      )
      break
  }

  return iosScreenOrientations
    .map(o => `<string>${o}</string>`)
    .join('\\n')
}

// TODO(xiaokai): Add: support for commitId later
const packageAppleApp = async (
  config: PackagerConfig, commitId: string, assetCachePath: string
) => {
  console.log('Packaging Apple app...')

  // Package the app.
  const {configPath, appConfig} = config
  if (!appConfig.apple) {
    throw new Error('Error: Apple config is required for Apple builds')
  }
  if (!appConfig.appInfo?.appName) {
    throw new Error('Error: Missing appConfig.appInfo.appName')
  }

  // Verify the expected output directory exists.
  const outputDir = path.dirname(config.outputPath)
  await fs.mkdir(outputDir, {recursive: true})

  const applePackager = runfilePath('_main/reality/app/nae/packager/apple/build-apple-html-app.sh')
  const appleToolsPaths = await getAppleToolsPaths(config)

  let resFiles: string[] = []
  if (appConfig.appInfo?.resourceDir) {
    const absoluteResourceDir = path.join(
      `${path.dirname(configPath)}`, `${appConfig.appInfo?.resourceDir}`
    )
    resFiles = await listResourceFiles(absoluteResourceDir)
  } else {
    console.warn('Warning: Missing appConfig.appInfo.resourceDir, so skipping resource files.')
  }

  let shouldSign = true
  if (!(appConfig.apple.certificate ||
       (appConfig.apple.p12FilePath && appConfig.apple.p12Password))) {
    console.warn('Missing certificate or .p12 data. The app will not be signed.')
    shouldSign = false
  }

  // We need to check what minimum iOS version the shell library supports.
  // This is important because a mismatch between the compiled app and the info.plist will cause
  // apps to be rejected by the App Store validation.
  const appleMinVersionPath = runfilePath(
    `_main/reality/app/nae/packager/${appConfig.shell}-min.version`
  )
  if (!(await fs.stat(appleMinVersionPath)).isFile()) {
    throw new Error(`Error: Could not find minimum version file at ${appleMinVersionPath}`)
  }

  const minOsVersion = (await fs.readFile(appleMinVersionPath, 'utf8')).trim()

  // TODO(lreyna): Add better validation for the minimum version.
  if (!minOsVersion) {
    throw new Error(`Error: Minimum os version file at ${appleMinVersionPath} is empty`)
  }

  const xcodeMajorVersionPath = runfilePath(
    '_main/reality/app/nae/packager/xcode-major.version'
  )
  if (!(await fs.stat(xcodeMajorVersionPath)).isFile()) {
    throw new Error(`Error: Could not find Xcode version file at ${xcodeMajorVersionPath}`)
  }

  const xcodeMajorVersion = (await fs.readFile(xcodeMajorVersionPath, 'utf8')).trim()
  if (!xcodeMajorVersion) {
    throw new Error(`Error: Xcode version file at ${xcodeMajorVersionPath} is empty`)
  }

  let interfaceOrientationArray = ''
  if (appConfig.shell === 'ios') {
    interfaceOrientationArray = getIosScreenOrientation(
      appConfig.appInfo?.screenOrientation || 'portrait'
    )
  }

  const enabledPermissions: string[] = []
  const usageDescriptions: string[] = []

  Object.entries(appConfig.appInfo?.permissions || {}).forEach(([key, value]) => {
    if (value.requestStatus === 'REQUESTED') {
      enabledPermissions.push(key)
      usageDescriptions.push(Buffer.from(value.usageDescription || '').toString('base64'))
    }
  })

  const packagerArgs: string[] = [
    config.outputPath,
    appleToolsPaths.shellLib,
    appConfig.projectUrl,
    // TODO(lreyna): Remove appConfig.apple.bundleIdentifier when nae-types is updated
    appConfig.appInfo.bundleIdentifier || appConfig.apple.bundleIdentifier,
    appConfig.apple.teamIdentifier,
    appConfig.appInfo.appName,
    String(appConfig.appInfo.versionCode),
    appConfig.appInfo.versionName,
    shouldSign ? 'true' : 'false',
    appleToolsPaths.entitlementsTemplate,
    appleToolsPaths.infoPlistTemplate,
    appConfig.apple.provisioningProfile,
    appConfig.apple.certificate,
    appConfig.shell,
    minOsVersion,
    resFiles.join(','),
    // TODO(paris): Remove this so that we instead use the same tempDir as the packager.
    appConfig.appInfo ? `${assetCachePath}/${HTTP_CACHE_DIRECTORY}` : '',
    commitId,
    appConfig.appInfo?.naeBuildMode ?? 'static',
    appConfig.devCookie ? encrypt(cookieToString(appConfig.devCookie)) : '',
    appConfig.appInfo.appDisplayName || appConfig.appInfo.appName,
    xcodeMajorVersion,
    interfaceOrientationArray,
    appleToolsPaths.rustCodesign,
    appConfig.apple.p12FilePath,
    appConfig.apple.p12Password,
    String(appConfig.niaEnvAccessCode),
    enabledPermissions.join(','),
    usageDescriptions.join(','),
    String(appConfig.appInfo?.statusBarVisible ?? 'true'),
  ]

  await spawnExec(applePackager, packagerArgs)

  console.log('Success!')
}

const maybeBuildAssetCache = async (
  appConfig: HtmlAppConfig,
  studioGlobalEntry: StudioGlobalEntry,
  assetCachePath: string
) => {
  const cache = createHttpCache(assetCachePath)

  const onAssetDownloaded = async (args: AssetDownloadedCallbackArgs) => {
    const {requestUrl, response} = args

    // TODO(lreyna): Re-enable this check once we get around the app key, which is
    // set to no-cache. https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/browse/J8W-4954
    // if (!cache.isCacheableResponse(url, undefined, response)) {
    //   throw new Error(`Response is not cacheable: ${url}. Status: ${response.status}`)
    // }

    // Add a max-stale directive to the cache-control header to allow stale responses.
    // This is necessary for the app to work offline, but be able to update assets when online.
    const headers = new builtIn.Headers(response.headers)
    if (!headers.get('cache-control')?.includes('max-stale')) {
      headers.set('cache-control', `${headers.get('cache-control') || ''},max-stale=31536000`)
    }

    // Create a new Response object with the updated headers
    const updatedResponse = new builtIn.Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })

    // Fetch succeeded. Let's cache the response and return.
    console.log(`Caching response for ${requestUrl}`)
    await cache.writeResponse(requestUrl, updatedResponse)
  }

  let onAssetDownloadedCallback: (args: AssetDownloadedCallbackArgs) => Promise<void>
  switch (appConfig.shell) {
    case 'android':
    case 'quest':
      onAssetDownloadedCallback = onAssetDownloaded
      break
    case 'ios':
    case 'osx':
      onAssetDownloadedCallback = createOnAssetDownloadedLocalCallback(
        appConfig,
        path.join(assetCachePath, HTTP_CACHE_DIRECTORY),
        // NOTE(lreyna): There are places where the URL ctor is used, so we can't use relative urls
        `the8thwall://${new URL(appConfig.projectUrl).hostname}/`
      )
      break
    case 'html':
      onAssetDownloadedCallback = createOnAssetDownloadedLocalCallback(
        appConfig,
        assetCachePath,
        './'
      )
      break
    default:
      throw new Error('Unsupported platform detected.')
  }

  await fetchAssetsFromAppConfig(
    appConfig,
    onAssetDownloadedCallback,
    studioGlobalEntry
  )
}

const registerAwsApis = async () => {
  const ddbClient = new DynamoDBClient(AWS_CONFIG)
  const s3Client = new S3Client(AWS_CONFIG)

  try {
    await ddbClient.config.credentials()
  } catch (e) {
    console.error(e)
    const errorMsg = `Missing AWS Configuration. Credentials should be set through either:
       1. SOLSTICE_AWS_ACCESS_KEY_ID & SOLSTICE_AWS_ACCESS_KEY_SECRET environment vars (GitLab CI)
       2. ~/.aws/credentials file stored locally
       3. AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment vars
    `
    throw new Error(errorMsg)
  }

  Ddb.register(createDdbApi(ddbClient))
  S3.register(createS3Api(s3Client))
}

const main = async () => {
  const config = await parseArgsForConfig()
  const {appInfo} = config.appConfig
  if (!appInfo) {
    throw new Error('Missing appConfig.appInfo')
  }
  await registerAwsApis()
  const {workspace, appName, refHead} = appInfo
  const studioGlobalEntry = await fetchStudioGlobalEntry(workspace, appName, refHead)
  const {commitId} = studioGlobalEntry

  // If we are building on Lambda, we should use the temporary directory specified by the Lambda
  // (because it will give us one on EFS rather than on Lambda).
  let assetCachePath = ''
  if (process.env.HTML_APP_PACKAGER_TEMP_DIR) {
    assetCachePath = path.join(process.env.HTML_APP_PACKAGER_TEMP_DIR, 'asset-cache')
  } else {
    assetCachePath = await stdout('mktemp -d')
  }
  await maybeBuildAssetCache(config.appConfig, studioGlobalEntry, assetCachePath)

  switch (config.appConfig.shell) {
    case 'android':
    case 'quest':
      await packageAndroidApp(config, commitId, assetCachePath)
      break
    case 'ios':
    case 'osx':
      await packageAppleApp(config, commitId, assetCachePath)
      break
    case 'html':
      await packageWebBundle(config.outputPath, assetCachePath)
      break
    default:
      throw new Error('Unsupported platform detected.')
  }

  await fs.rm(assetCachePath, {recursive: true, force: true})
}

main()
