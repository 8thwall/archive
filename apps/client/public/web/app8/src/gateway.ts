import type {ClientGatewayInfo, GatewayHandle, RequestInit} from './shared/gateway/gateway-types'

declare const XR8: any

const loadRuntimeInfo = (): ClientGatewayInfo | null => {
  const meta = document.querySelector('meta[name="8thwall:gateway"]')
  if (!meta) {
    return null
  }
  meta.parentNode.removeChild(meta)
  const base64Data = meta.getAttribute('content')
  const byteString = atob(base64Data)
  // NOTE(christoph): This is needed to handle non-ascii characters
  const byteArray = Uint8Array.from(byteString, e => e.charCodeAt(0))
  const jsonData = new TextDecoder().decode(byteArray)
  return JSON.parse(jsonData)
}

const waitForXr8 = () => new Promise<typeof XR8>((resolve) => {
  if (typeof XR8 !== 'undefined') {
    resolve(XR8)
  } else {
    window.addEventListener('xrloaded', () => resolve(XR8), {once: true})
  }
})

const createGatewayProvider = () => {
  const info = loadRuntimeInfo()
  const xr8Promise = waitForXr8()

  const wrappedGatewayFetch = async (
    routeId: string, firstArg: string | RequestInit, secondArg?: RequestInit
  ) => {
    if (!info) {
      throw new Error('[app8] Backend services cannot be invoked without gateway metadata.')
    }
    const pathSuffix = typeof firstArg === 'string' ? firstArg : ''
    const baseOptions = typeof firstArg === 'string' ? secondArg : firstArg

    const url = info.url + routeId + pathSuffix

    const xr8 = await xr8Promise

    const options: RequestInit = {
      ...baseOptions,
      'headers': {
        ...baseOptions?.headers,
        'authorization': await xr8.Platform.authorizationToken(),
        'x-8w-attachments': '_',  // NOTE(christoph): This is currently required by the authorizer.
      },
    }

    return fetch(url, options)
  }

  const gatewayForRoutes = (routes: Record<string, string> | null) => {
    if (!routes) {
      // NOTE(christoph): This is more likely to happen for modules, but if a gateway doesn't
      // exist, rather than erroring out immediately, just return an empty object so that any
      // uses of functions assumed to be present would fail.
      return {}
    }
    return Object.entries(routes).reduce<GatewayHandle>((acc, [name, routeId]) => {
      acc[name] = wrappedGatewayFetch.bind(null, routeId)
      return acc
    }, {})
  }

  const getGateway = (gatewayName: string) => (
    gatewayForRoutes(info?.gatewayMappings[gatewayName])
  )

  const getGatewayForModule = (moduleId: string, gatewayName: string) => {
    const routes = info?.moduleGatewayMappings?.[moduleId]?.[gatewayName]
    return gatewayForRoutes(routes)
  }

  return {
    getGateway,
    getGatewayForModule,
  }
}

export {
  createGatewayProvider,
}
