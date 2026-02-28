import type {HtmlAppConfig} from '@nia/reality/shared/nae/nae-types'
import type {RawFontSetData} from '@nia/c8/ecs/src/shared/msdf-font-type'

// Should follow spec from msdf-bmfont: https://github.com/Experience-Monks/msdf-bmfont
const unpackFont8Urls = async (fontUrl: URL) => {
  try {
    const response = await fetch(fontUrl)
    const fontSetData = await response.json() as RawFontSetData

    return [
      fontUrl.href,  // font8
      ...(fontSetData.fontFile ? [new URL(fontSetData.fontFile, fontUrl.href).href] : []),  // ttf
      ...fontSetData.pages.map(page => new URL(page, fontUrl.href).href),  // pngs
    ]
  } catch {
    // eslint-disable-next-line no-console
    console.warn(`Failed to unpack .font8 URLs from: ${fontUrl.href}`)
    return [fontUrl.href]
  }
}

type GltfData = {
  buffers?: {uri?: string}[]
  images?: {uri?: string}[]
  extensionsUsed?: string[]
  extensions?: Record<string, any>
}

const unpackGltfResponse = async (gltfResponse: Response) => {
  try {
    const gltfData = await gltfResponse.json() as GltfData

    const urls = new Set<string>()

    const addUri = (uri: string | undefined) => {
      if (uri && !uri.startsWith('data:')) {
        urls.add(new URL(uri, gltfResponse.url).href)
      }
    }

    gltfData.buffers?.forEach(buffer => addUri(buffer.uri))
    gltfData.images?.forEach(image => addUri(image.uri))

    const extractUrisFromObject = (obj: any): void => {
      if (Array.isArray(obj)) {
        obj.forEach(extractUrisFromObject)
      } else if (obj && typeof obj === 'object') {
        if (typeof obj.uri === 'string') {
          addUri(obj.uri)
        }
        Object.values(obj).forEach(extractUrisFromObject)
      }
    }

    if (gltfData.extensions) {
      extractUrisFromObject(gltfData.extensions)
    }

    return Array.from(urls)
  } catch {
    // eslint-disable-next-line no-console
    console.warn(`Failed to unpack GLTF URLs from: ${gltfResponse.url}`)
    return []
  }
}

const sanitizePath = (path: string) => {
  const isValidUriEncoding = !/%(?![0-9A-Fa-f]{2})/.test(path)

  const decodedPath = isValidUriEncoding
    ? decodeURIComponent(path)
    : path

  return decodedPath.replace(/[^a-zA-Z0-9._\-/]/g, '_')
}

const isAssetUrl = (url: string) => {
  const urlObject = new URL(url)

  if (urlObject.pathname.startsWith('/assets/')) {
    return true
  }

  return false
}

const shouldUseXrEngine = (
  appConfig: HtmlAppConfig
): boolean => appConfig.appInfo?.permissions?.camera?.requestStatus === 'REQUESTED'

export {
  isAssetUrl,
  unpackFont8Urls,
  unpackGltfResponse,
  sanitizePath,
  shouldUseXrEngine,
}
