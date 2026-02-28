import {Image as ImageJs} from 'image-js'

import type {fetch as fetchType} from 'undici-types'

import type {ImageDecodingAddon} from '@nia/c8/dom/image-decoding/image-decoding'

type RawImage = ImageJs & {_cached?: boolean}

type CreateImageOptions = {
  kind?: ImageKind | undefined,
}

enum ImageKind {
  BINARY = 'BINARY',
  GREY = 'GREY',
  GREYA = 'GREYA',
  RGB = 'RGB',
  RGBA = 'RGBA',
  CMYK = 'CMYK',
  CMYKA = 'CMYKA',
}

const addon: ImageDecodingAddon = (globalThis as any).__niaImageDecoding

const createImage = (width: number, height: number, options?: CreateImageOptions) => (
  new ImageJs(width, height, options)
)

const createImageFromData = (
  width: number, height: number, data: Uint8Array, options?: CreateImageOptions
) => (
  new ImageJs(width, height, data, options)
)

const defaultRawImage = (): RawImage => new ImageJs(1, 1, new Uint8ClampedArray(4), {
  kind: ImageKind.RGBA,
})

const loadRawImageFromUrl = async (dest: URL): Promise<RawImage> => {
  let res: RawImage
  if (dest.protocol === ('http:') || dest.protocol === 'https:' || dest.protocol === 'blob:') {
    const fetch = (globalThis as any).fetch as typeof fetchType
    // Fetch from HTTP/HTTPS.
    const response = await fetch(dest)
    if (!response.ok) {
      throw new Error(
        `${dest.protocol} Error Response: ${response.status} ${response.statusText}`
      )
    }
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('image/svg+xml')) {
      // eslint-disable-next-line no-console
      console.warn(`Detected SVG (${dest.href}), returning empty image.`)
      return defaultRawImage()
    }

    const buffer = await response.arrayBuffer()
    try {
      const bytes = new Uint8Array(buffer)
      const imageResponse = await addon.loadImage(bytes)
      const imageConstructorOptions: CreateImageOptions = {
        kind: imageResponse.hasAlpha ? ImageKind.RGBA : ImageKind.RGB,
      }

      res = new ImageJs(
        imageResponse.width,
        imageResponse.height,
        imageResponse.data,
        imageConstructorOptions
      )
    } catch (e) {
      // Fallback for unsupported native image
      // eslint-disable-next-line no-console
      console.warn(`Failed to decode ${dest.href} natively, using slower fallback\n ${e}`)
      res = await ImageJs.load(buffer)
    }
  } else if (dest.protocol === 'file:') {
    res = await ImageJs.load(dest.pathname)
  } else if (dest.protocol === 'data:') {
    res = await ImageJs.load(dest.href)
  } else {
    throw new Error(`Unsupported protocol: ${dest.protocol}`)
  }
  return res
}

const newBrokenImage = (): RawImage => {
  const imageConstructorOptions: CreateImageOptions = {
    kind: ImageKind.RGBA,
  }
  const brokenImage = new ImageJs(
    16,
    16,
    new Uint8ClampedArray(4 * 16 * 16),
    imageConstructorOptions
  )
  // Draw a red X on the image.
  const red = [255, 0, 0, 255]
  let rowStart = 0
  for (let i = 0; i < 16; i++) {
    brokenImage.setPixel(i + rowStart, red)
    brokenImage.setPixel(15 - i + rowStart, red)
    rowStart += brokenImage.width
  }
  return brokenImage
}

const copyRawImage = (
  src: RawImage,
  dst: RawImage,
  sx: number, sy: number, sw: number, sh: number,
  dx: number, dy: number, dw: number, dh: number,
  imageSmoothingEnabled: boolean
) => {
  // Create a non-copy sub-image.
  let srcImg = src.crop({
    x: sx,
    y: sy,
    width: sw,
    height: sh,
  })

  if (sw !== dw || sh !== dh) {
    // Resize the sub-image if necessary in a new temporary image.
    // Note: Our current ImageJs only supports 'nearestNeighbor', although the potentially newer
    // docs mention 'bilinear' as an option.
    const interpolation =
      imageSmoothingEnabled ? 'nearestNeighbor' /* 'bilinear' */ : 'nearestNeighbor'
    if (imageSmoothingEnabled) {
      srcImg = srcImg.resize({
        width: dw,
        height: dh,
        interpolation,
      })
    }
    srcImg = srcImg.resize({width: dw, height: dh})
  }

  const dstWidth = dst.width
  const srcWidth = srcImg.width
  const srcChannels = src.channels
  const dstChannels = dst.channels

  const left = Math.max(0, dx)
  const top = Math.max(0, dy)
  const right = Math.min(dst.width, dx + dw)
  const bottom = Math.min(dst.height, dy + dh)

  // Note: When the destination rectangle is outside the destination image (the output bitmap),
  // the pixels that land outside the output bitmap are discarded, as if the destination was an
  // infinite canvas whose rendering was clipped to the dimensions of the output bitmap.
  for (let i = left; i < right; i++) {
    for (let j = top; j < bottom; j++) {
      for (let k = 0; k < dstChannels; k++) {
        const source = ((j - dy) * srcWidth + (i - dx)) * srcChannels + k
        const target = (j * dstWidth + i) * dstChannels + k

        // Fill the missing src channels with 255.
        dst.data[target] = (k < srcChannels) ? srcImg.data[source] : 255
      }
    }
  }
}

export {
  loadRawImageFromUrl,
  createImage,
  createImageFromData,
  copyRawImage,
  ImageKind,
  RawImage,
  newBrokenImage,
}
