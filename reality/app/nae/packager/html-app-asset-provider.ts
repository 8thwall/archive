import type {
  HeadersInit,
} from 'undici-types'

import {S3Client} from '@aws-sdk/client-s3'
import {DynamoDBClient} from '@aws-sdk/client-dynamodb'

import {cookieToString} from '@nia/reality/app/nae/packager/cookie-utils'
import {collectXrwebAssets, XR_WEB_URL} from '@nia/reality/app/nae/packager/html-app-xrweb'
import {
  shouldUseXrEngine,
  unpackFont8Urls,
  unpackGltfResponse,
} from '@nia/reality/app/nae/packager/html-app-asset-utils'
import {
  fetchStudioGlobalEntry,
  type StudioGlobalEntry,
} from '@nia/reality/shared/studio/fetch-studio-global-entry'
import {makeRunQueue} from '@nia/reality/shared/run-queue'
import {parseScriptSrcs} from '@nia/reality/shared/studio/parse-script-srcs'
import type {HtmlAppConfig} from '@nia/reality/shared/nae/nae-types'
import {fetchAssetManifest} from '@nia/reality/shared/studio/fetch-asset-manifest'

import {Ddb} from '@nia/reality/shared/dynamodb'
import {createDdbApi} from '@nia/reality/shared/dynamodb-impl'
import {S3} from '@nia/reality/shared/s3'
import {createS3Api} from '@nia/reality/shared/s3-impl'

import {FONTS} from '@nia/c8/ecs/src/shared/fonts'
import {DRACO_DECODER_PATH} from '@nia/c8/ecs/src/shared/draco-constants'
import {ENV_MAP_PRESETS} from '@nia/c8/ecs/src/shared/environment-maps'
import {
  STANDALONE_URL as MAP_STANDALONE_URL,
  WORKER_URL as MAP_WORKER_URL,
} from '@nia/c8/ecs/src/shared/map-constants'
import {
  MODEL_URL as SPLAT_MODEL_MANAGER_URL,
  WORKER_URL as SPLAT_MODEL_WORKER_URL,
} from '@nia/c8/ecs/src/shared/splat-constants'
import {SPRITE_URL_CONSTANTS} from '@nia/c8/ecs/src/shared/sprite-constants'
import {fetchToken} from '@nia/c8/dom/dev-access'
import {getStagingCookie} from '@nia/c8/dom/staging-access'
import {verifyCookieDomain} from '@nia/c8/html-shell/verify-cookie-domain'

import {
  APP8_SPLASH_SCREEN_LOGO,
  APP8_FONT_FAMILY_WOFF,
  APP8_FONT_FAMILY_TTF,
  NAE_SPLASH_SCREEN_LOGO,
} from '@nia/apps/client/public/web/app8/src/shared/resource-constants'

import type {StoredAssetManifest} from '@nia/c8/ecs/src/shared/asset-manifest'

type AssetDownloadedCallbackArgs = {
  response: Response
  requestUrl: string
  assetManifest?: StoredAssetManifest
}

const MAX_PARALLEL_ASSET_FETCHES = 5
const MAX_ASSET_FETCH_RETRIES = 3

const ASSET_PATH_EXCLUDES = ['fallbacks']

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

const registerAwsApis = async () => {
  const ddbClient = new DynamoDBClient(AWS_CONFIG)
  const s3Client = new S3Client(AWS_CONFIG)

  try {
    await ddbClient.config.credentials()
  } catch (e) {
    // eslint-disable-next-line no-console
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

const MANDATORY_OFFLINE_ASSETS = [
  // Splash screen logo used with the webgl rendered splash screen
  // keeping this for backwards compatibility with NAE apps created before Tauri.
  NAE_SPLASH_SCREEN_LOGO,
  // App8 resources
  APP8_SPLASH_SCREEN_LOGO,
  APP8_FONT_FAMILY_WOFF,
  APP8_FONT_FAMILY_TTF,
  // ThreeJs Draco decoder expects a path that fetches two files:
  // https://threejs.org/docs/#examples/en/loaders/DRACOLoader
  new URL('draco_wasm_wrapper.js', DRACO_DECODER_PATH).href,
  new URL('draco_decoder.wasm', DRACO_DECODER_PATH).href,
  // Map resources.
  MAP_STANDALONE_URL,
  MAP_WORKER_URL,
  // Splat resources.
  SPLAT_MODEL_MANAGER_URL,
  SPLAT_MODEL_WORKER_URL,
  ...SPRITE_URL_CONSTANTS,
  ...Object.keys(ENV_MAP_PRESETS),
]
// Add the default fonts to the asset bundle, even if they are not used in the app.
// TODO(lreyna): Figure out how to get specific fonts to be bundled with the app.
for (const font of FONTS.values()) {
  MANDATORY_OFFLINE_ASSETS.push(font.json, font.png, font.ttf)
}

const fetchAssets = async (
  assetUrls: string[],
  assetDownloadedCallback: (args: AssetDownloadedCallbackArgs) => Promise<void>
) => {
  const runQueue = makeRunQueue(MAX_PARALLEL_ASSET_FETCHES)
  await Promise.all(
    assetUrls.map(assetUrl => runQueue.next(async () => {
      /* eslint-disable no-await-in-loop */
      for (let retries = 0; retries < MAX_ASSET_FETCH_RETRIES; retries++) {
        if (retries > 0) {
          // eslint-disable-next-line no-console
          console.error(`Failed to fetch asset: ${assetUrl}. Retrying (${retries})...`)
        }
        const response = await fetch(assetUrl)
        await assetDownloadedCallback({response, requestUrl: assetUrl})
        return
      }

      throw new Error(`Failed to fetch asset: ${assetUrl}.`)
    }))
  )
}

const fetchAssetsFromAppConfig = async (
  appConfig: HtmlAppConfig,
  assetDownloadedCallback: (args: AssetDownloadedCallbackArgs) => Promise<void>,
  studioGlobalEntry?: StudioGlobalEntry
) => {
  const {appInfo} = appConfig
  if (!appInfo) {
    throw new Error('Missing appConfig.appInfo')
  }

  const {workspace, appName, refHead} = appInfo

  let resolvedStudioGlobalEntry = studioGlobalEntry
  if (!resolvedStudioGlobalEntry) {
    await registerAwsApis()
    resolvedStudioGlobalEntry = await fetchStudioGlobalEntry(workspace, appName, refHead)
  }

  const assetManifest = await fetchAssetManifest(
    workspace, appName, refHead, resolvedStudioGlobalEntry
  )

  const assetUrls = (await Promise.all(Object.entries(assetManifest.assets)
    .filter(([key]) => !key.split('/').some(part => ASSET_PATH_EXCLUDES.includes(part)))
    .map(async ([, assetPath]) => {
      const url = new URL(assetPath, appConfig.projectUrl)
      if (url.pathname.endsWith('.font8')) {
        return unpackFont8Urls(url)
      } else if (url.pathname.endsWith('.gltf')) {
        const response = await fetch(url.href)
        if (!response.ok) {
          throw new Error(`Failed to fetch GLTF for URL extraction: ${url.href}`)
        }
        return [url.href, ...await unpackGltfResponse(response)]
      }
      return [url.href]
    }))
  ).flat()

  // NOTE: We want to push these assets for all build modes, as running either
  // without internet shouldn't break non-studio project code (e.g. app8 splash image).
  assetUrls.push(...MANDATORY_OFFLINE_ASSETS)

  if (appConfig.additionalItems) {
    assetUrls.push(...appConfig.additionalItems)
  }

  const getCookie = async (): Promise<string | undefined> => {
    if (appConfig.appInfo?.refHead === 'production') {
      return undefined
    }

    const url = new URL(appConfig.projectUrl)
    if (!(url.protocol.startsWith('https:') &&
        (url.origin.endsWith('.dev.8thwall.app') || url.origin.endsWith('.staging.8thwall.app')))) {
      throw new Error('Invalid project URL: Must be a valid staging or dev URL and 8thwall origin')
    }

    if (appConfig.devCookie) {
      verifyCookieDomain(appConfig.devCookie.options.domain, url.hostname)
      return cookieToString(appConfig.devCookie)
    }

    if (!appConfig.niaEnvAccessCode) {
      throw new Error('Missing niaEnvAccessCode for accessing staging or dev URLs')
    }

    if (appConfig.appInfo?.refHead === 'staging') {
      return getStagingCookie(appConfig.niaEnvAccessCode, appConfig.projectUrl)
    }

    return fetchToken(appConfig.niaEnvAccessCode)
  }

  const projectPageCookie = await getCookie()
  const headers: HeadersInit = projectPageCookie
    ? {cookie: projectPageCookie}
    : {}

  const projectPageResponse = await fetch(appConfig.projectUrl, {headers})
  if (!projectPageResponse.ok) {
    throw new Error(`Failed to fetch project page: ${appConfig.projectUrl}`)
  }

  // Clone the response so we can read the body multiple times
  const responseForCallback = projectPageResponse.clone()
  const responseForParsing = projectPageResponse.clone()

  await assetDownloadedCallback({response: responseForCallback, requestUrl: appConfig.projectUrl})

  // Parse the HTML page to extract script srcs, map any relative URLs to absolute URLs
  const htmlScriptSrcs = parseScriptSrcs(await responseForParsing.text())
    .map(url => new URL(url, appConfig.projectUrl).href)

  const xrwebUrl = htmlScriptSrcs.find(url => url.includes(XR_WEB_URL))
  if (xrwebUrl && shouldUseXrEngine(appConfig)) {
    // Remove xrwebUrl from the list of resources to fetch; we'll provide the response directly
    const index = htmlScriptSrcs.indexOf(xrwebUrl)
    if (index !== -1) {
      htmlScriptSrcs.splice(index, 1)
    }

    const xrWebData = await collectXrwebAssets(xrwebUrl, appConfig.projectUrl)

    await assetDownloadedCallback({response: xrWebData.xrWebResponse, requestUrl: xrwebUrl})

    for (const xrWebScript of xrWebData.xrWebScriptData) {
      await assetDownloadedCallback({response: xrWebScript.response, requestUrl: xrWebScript.url})
    }

    assetUrls.push(...xrWebData.xrWebResourceUrls)
  }

  // Handle the user bundle which needs a reference to the asset manifest
  // See reality/cloud/aws/lambda/studio-deploy/webpack-ecs.config.ts for the bundle naming scheme
  const bundleScriptName = [
    'dist_',
    resolvedStudioGlobalEntry.commitId,
    '-',
    resolvedStudioGlobalEntry.userSettingsHash,
    '_bundle.js',
  ].join('')

  const bundleScriptUrl = htmlScriptSrcs.find(url => url.includes(bundleScriptName))
  if (bundleScriptUrl) {
    const index = htmlScriptSrcs.indexOf(bundleScriptUrl)
    if (index !== -1) {
      htmlScriptSrcs.splice(index, 1)
    }

    const response = await fetch(bundleScriptUrl)
    await assetDownloadedCallback({response, requestUrl: bundleScriptUrl, assetManifest})
  }

  // Gather the module scripts, which are named module.js and may have query params
  // TODO(lreyna): We could parse the pathname and verify it fits the ModuleTarget format
  const moduleScripts = htmlScriptSrcs.filter(src => new URL(src).pathname.endsWith('/module.js'))
  for (const moduleScriptUrl of moduleScripts) {
    const index = htmlScriptSrcs.indexOf(moduleScriptUrl)
    if (index !== -1) {
      htmlScriptSrcs.splice(index, 1)
    }

    const response = await fetch(moduleScriptUrl)
    const responseClone = response.clone()
    const responseText = await responseClone.text()

    const staticAssetUrls = new Set<string>()
    const matches = responseText.matchAll(/https:\/\/static\.8thwall\.app\/[^\s"']+/g)
    for (const match of matches) {
      if (match[0]) {
        staticAssetUrls.add(match[0])
      }
    }

    assetUrls.push(...staticAssetUrls)
    await assetDownloadedCallback({response, requestUrl: moduleScriptUrl})
  }

  assetUrls.push(...htmlScriptSrcs)

  // NOTE(lreyna): For now we always include the default favicon.ico to prevent unnecessary 404s
  // In the future, we could add a flow for custom favicons.
  const faviconUrl = `${new URL(appConfig.projectUrl).origin}/favicon.ico`
  assetUrls.push(faviconUrl)

  await fetchAssets(assetUrls, assetDownloadedCallback)
}

export {
  type AssetDownloadedCallbackArgs,
  fetchAssetsFromAppConfig,
}
