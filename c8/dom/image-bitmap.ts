// @sublibrary(:dom-core-lib)

import {Blob} from 'node:buffer'

import {Image as ImageJs} from 'image-js'

import type {ImageData} from './image-data'

import {DOMException} from './dom-exception'
import {HTMLCanvasElement} from './html-canvas-element'

// TODO(lreyna): Uncomment when audio is not a dependency on HTMLVideoElement (build error)
// import {HTMLVideoElement} from './html-elements'
import {HTMLImageElement} from './html-image-element'
import {mimeTypeImage} from './mime-type-image'
import {OffscreenCanvas} from './offscreen-canvas'

// NOTE: This class should be retooled to implement the ImageBitmap closer to the hardware

type CanvasImageSource = any

type ImageBitmapSource = CanvasImageSource | Blob | ImageData

interface ImageBitmapOptions {
  imageOrientation?: 'from-image' | 'flipY'
  premultiplyAlpha?: 'none' | 'premultiply' | 'default'
  colorSpaceConversion?: 'none' | 'default'
  resizeWidth?: number
  resizeHeight?: number
  resizeQuality?: 'pixelated' | 'low' | 'medium' | 'high'
}

// Declare the WeakMap to hold the private data
const bitmapDataMap = new WeakMap<ImageBitmap, ImageJs>()

// See: https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#imagebitmap
class ImageBitmap {
  private _originClean: boolean = true

  get width(): number {
    if (!this.getBitmapData()) {
      return 0
    }
    return this.getBitmapData().width
  }

  get height(): number {
    if (!this.getBitmapData()) {
      return 0
    }
    return this.getBitmapData().height
  }

  // Accessible through `imageBitmap['getBitmapData']()`
  private getBitmapData(): ImageJs {
    return bitmapDataMap.get(this) as ImageJs
  }

  // Disposes of all graphical resources associated with an ImageBitmap.
  close(): void {
    bitmapDataMap.delete(this)
  }
}

const checkUsabilityOfImage = (image: ImageBitmapSource): boolean => {
  // 1. Switch on image:
  if (image instanceof HTMLImageElement) {  // TODO(lreyna): HTMLOrSVGImageElement
    const img = image as HTMLImageElement
    // If image's current request's state is broken, then throw an "InvalidStateError" DOMException.
    // [NOT IMPLEMENTED]

    // If image is not fully decodable, then return bad.
    // [NOT IMPLEMENTED]

    // If image has a natural width or natural height (or both) equal to zero, then return bad.
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      return false
    }
  // } else if (image instanceof HTMLVideoElement) {
    // If image's readyState attribute is either HAVE_NOTHING or HAVE_METADATA, then return bad.
    // [NOT IMPLEMENTED]
  } else if (image instanceof HTMLCanvasElement || image instanceof OffscreenCanvas) {
    // If image has either a horizontal dimension or a vertical dimension equal to zero,
    // then throw an "InvalidStateError" DOMException.
    if (image.width === 0 || image.height === 0) {
      throw new DOMException('InvalidStateError')
    }
  } else if (image instanceof ImageBitmap) {  // TODO(lreyna): || image instanceof VideoFrame
    // If image's [[Detached]] internal slot value is true, then return bad.
    // [NOT IMPLEMENTED]
  }

  return true
}

type Rect = {x: number, y: number, width: number, height: number}

// Takes image, which can be an img element, an SVG image element, a video element,
// a canvas element, a Blob object, an ImageData object, or another ImageBitmap object,
// and returns a promise that is resolved when a new ImageBitmap is created.
const createImageBitmap: {
  (image: ImageBitmapSource, sx: number, sy: number,
    sw: number, sh: number, options?: ImageBitmapOptions): Promise<ImageBitmap>
  (image: ImageBitmapSource, options?: ImageBitmapOptions): Promise<ImageBitmap>
} = async (image: ImageBitmapSource, sxOrOptions?: number | ImageBitmapOptions, sy?: number,
  sw?: number, sh?: number, options?: ImageBitmapOptions): Promise<ImageBitmap> => {
  let sx: number | undefined
  let rect: Rect | undefined
  if (typeof sxOrOptions !== 'number') {
    // eslint-disable-next-line no-param-reassign
    options = sxOrOptions
  } else {
    sx = sxOrOptions

    // TODO(lreyna): use rect when implementing the image crop
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rect = {x: sx, y: sy!, width: sw!, height: sh!}
  }

  // 1. If either sw or sh is given and is 0, then return a promise rejected with a RangeError.
  if ((sw !== undefined && sw === 0) || (sh !== undefined && sh === 0)) {
    return Promise.reject(new RangeError('Invalid arguments'))
  }

  // 2. If either options's resizeWidth or options's resizeHeight is present and is 0,
  // then return a promise rejected with an "InvalidStateError" DOMException.
  if ((options?.resizeWidth !== undefined && options.resizeWidth === 0) ||
    (options?.resizeHeight !== undefined && options.resizeHeight === 0)) {
    return Promise.reject(new DOMException('InvalidStateError'))
  }

  // 3. Check the usability of the image argument. If this throws an exception or returns bad,
  // then return a promise rejected with an "InvalidStateError" DOMException.
  if (!checkUsabilityOfImage(image)) {
    return Promise.reject(new DOMException('InvalidStateError'))
  }

  // 4. Let imageBitmap be a new ImageBitmap object.
  const imageBitmap = new ImageBitmap()

  // 5. Switch on image:
  if (image instanceof HTMLImageElement) {
    // If image is an img element, an SVG image element, or a video element:
    // TODO(lreyna): Follow the spec better for the image element

    if (!image._image) {
      return Promise.reject(new DOMException('InvalidStateError'))
    }
    bitmapDataMap.set(imageBitmap, image._image as ImageJs)

    return Promise.resolve(imageBitmap)

  // } else if (image instanceof HTMLVideoElement) {
    // If image is a video element:
    // [NOT IMPLEMENTED]
    // return Promise.reject(new DOMException('Not implemented'))
  } else if (image instanceof HTMLCanvasElement || image instanceof OffscreenCanvas) {
    // If image is a canvas element or an OffscreenCanvas object:
    // [NOT IMPLEMENTED]
    return Promise.reject(new DOMException('Not implemented'))
  } else if (image instanceof Blob) {
    const imageBlob = image as Blob

    // 1. Let imageData be the result of reading image's data.
    // If an error occurs during reading of the object, then reject p with an
    // "InvalidStateError" DOMException and abort these steps.
    let imageData: Uint8Array
    try {
      imageData = new Uint8Array(await imageBlob.arrayBuffer())
    } catch (e) {
      return Promise.reject(new DOMException('InvalidStateError'))
    }

    // 2. Apply the image sniffing rules to determine the file format of imageData,
    // with MIME type of image (as given by image's type attribute) giving the official type.
    const imageMimeType = mimeTypeImage(imageData)

    // 3. If imageData is not in a supported image file format (e.g., it's not an image at all),
    // or if imageData is corrupted in some fatal way such that the image dimensions cannot
    // be obtained (e.g., a vector graphic with no natural size),
    // then reject p with an "InvalidStateError" DOMException and abort these steps.
    if (!imageMimeType) {
      return Promise.reject(new DOMException('InvalidStateError'))
    }

    // 4. Set imageBitmap's bitmap data to imageData, cropped to the source rectangle with
    // formatting. If this is an animated image, imageBitmap's bitmap data must only be taken
    // from the default image of the animation (the one that the format defines is to be used when
    // animation is not supported or is disabled), or, if there is no such image,
    // the first frame of the animation.
    // [NOT FULLY IMPLEMENTED]
    bitmapDataMap.set(imageBitmap, await ImageJs.load(imageData))

    // 5. Resolve p with imageBitmap.
    return Promise.resolve(imageBitmap)
  } else if (image instanceof ImageBitmap) {
    // If image is an ImageBitmap object:
    // [NOT IMPLEMENTED]
    return Promise.reject(new DOMException('Not implemented'))
  }  // TODO(lreyna): else if image instanceof VideoFrame / instanceof ImageData

  return Promise.reject(new DOMException('Invalid Image Bitmap Source'))
}

export type {ImageBitmapOptions, ImageBitmapSource}
export {ImageBitmap, createImageBitmap}
