import vm from 'vm'

const XR_WEB_URL = 'https://apps.8thwall.com/xrweb'

const PROD_APPS_SERVER = 'https://apps.8thwall.com'

type SessionTokenResponseData = {
  xrSessionToken: string
}

type XR8 = {
  channel: string
  version: string
  devMode: boolean
  sampleRatio: number
  shortLink: string
  coverImageUrl: string
  smallCoverImageUrl: string
  mediumCoverImageUrl: string
  largeCoverImageUrl: string
  chunkMap: {
    [key: string]: string
  }
}

const fetchSessionToken = async (
  appKey: string, appOrigin: string
): Promise<string> => {
  // TODO(lreyna): Investigate if NAE will need to use the QA Realm for builds
  const sessionTokenEndpoint = new URL('session-token', PROD_APPS_SERVER)
  sessionTokenEndpoint.searchParams.set('appKey', appKey)

  const sessionTokenResponse = await fetch(sessionTokenEndpoint, {
    headers: {
      'Origin': appOrigin,
    },
  })
  const sessionToken = await sessionTokenResponse.json() as SessionTokenResponseData

  if (!sessionToken.xrSessionToken) {
    throw new Error(`Failed to retrieve session token for appKey: ${appKey}`)
  }

  return sessionToken.xrSessionToken
}

// This method retrieves xr resources (i.e. models and meshes) outlined in the xr scripts
// The script response objects are returned in conjunction, so they do not need to be re-fetched
const findResourcesFromChunks = async (chunks: string[]) => {
  // Match both https://cdn.8thwall.com and //cdn.8thwall.com URLs
  const urlRegex = /(https?:)?\/\/cdn\.8thwall\.com[^"'\s)]+/g

  const xrWebScriptData: {url: string, response: Response}[] = []
  const xrWebResourceUrls = new Set<string>()

  await Promise.all(
    chunks.map(async (chunkUrl) => {
      try {
        const res = await fetch(chunkUrl)
        if (!res.ok) {
          return
        }

        xrWebScriptData.push({url: chunkUrl, response: res.clone()})
        const text = await res.text()
        const matches = text.match(urlRegex)
        if (!matches) {
          return
        }

        matches.forEach((url) => {
          xrWebResourceUrls.add(url.startsWith('//') ? `https:${url}` : url)
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`[html-app-xrweb] Failed to fetch chunk URL: ${chunkUrl}`, e)
      }
    })
  )

  return {
    xrWebScriptData,
    xrWebResourceUrls: Array.from(xrWebResourceUrls),
  }
}

const collectXrwebAssets = async (xrWebUrl: string, appUrl: string) => {
  if (!xrWebUrl.includes(XR_WEB_URL)) {
    throw new Error(`collectXrwebAssets called with invalid XR Web URL: ${xrWebUrl}`)
  }

  const appKey = new URL(xrWebUrl).searchParams.get('appKey')
  if (!appKey) {
    throw new Error(`collectXrwebAssets called without appKey: ${xrWebUrl}`)
  }

  const appOrigin = new URL(appUrl).origin
  const sessionToken = await fetchSessionToken(appKey, appOrigin)

  const xrWebResponse = await fetch(xrWebUrl, {
    headers: {
      'Origin': appOrigin,
      'Cookie': `dev=${sessionToken}`,
    },
  })

  // Need to clone the response for further processing outside of this method
  const xrWebResponseClone = xrWebResponse.clone()
  const xrWebScript = await xrWebResponse.text()

  // Set up a minimal polyfill for the xrweb script to be run. It provides the needed implementation
  // to set up the window._XR8 object that contain xrweb scripts.
  const context: any = {
    window: {},
    document: {
      createElement: () => ({
        setAttribute: () => {},
        set src(_value: string) {
          // NOTE(lreyna): Make sure to capture any script set as a src
          context.window._XR8.chunkMap[_value] = _value
        },
      }),
      head: {
        appendChild: () => {},
      },
      scripts: [{
        src: xrWebUrl,
        getAttribute: (name: string) => (name === 'appKey' ? appKey : null),
      }],
      currentScript: {
        src: xrWebUrl,
        getAttribute: (name: string) => (name === 'appKey' ? appKey : null),
      },
    },
    navigator: {},
  }

  context.self = context.window
  context.globalThis = context.window

  const vmContext = vm.createContext(context)
  vm.runInContext(xrWebScript, vmContext)

  const xr8: XR8 = context.window._XR8

  const chunkMaps = Object.values(xr8.chunkMap)
  const {xrWebScriptData, xrWebResourceUrls} = await findResourcesFromChunks(chunkMaps)

  return {
    xrWebResponse: xrWebResponseClone,
    xrWebScriptData,
    xrWebResourceUrls,
  }
}

export {
  XR_WEB_URL,
  collectXrwebAssets,
}
