// @sublibrary(:dom-core-lib)
import type {
  HTMLImageElement,
  // SVGImageElement,  // NOT IMPLEMENTED
  HTMLVideoElement,
  HTMLCanvasElement,
  // ImageBitmap,  // NOT IMPLEMENTED
  // VideoFrame,  // NOT IMPLEMENTED
} from './html-elements'

import type {OffscreenCanvas} from './offscreen-canvas'

import {
  ImageRequestState,
  currentImageRequest,
  isFullyDecodable,
} from './html-image-element'

import {DOMException} from './dom-exception'

const internalWarnOnceSet = new Set<string>()
const warnNotImplement = (methodName: string) => {
  if (!internalWarnOnceSet.has(methodName)) {
    // eslint-disable-next-line no-console
    console.warn(`${methodName}: Not implemented`)
    internalWarnOnceSet.add(methodName)
  }
}

// See: https://html.spec.whatwg.org/multipage/canvas.html#2dcontext
type HTMLOrSVGImageElement = HTMLImageElement /* | SVGImageElement */

type CanvasImageSource =
  HTMLOrSVGImageElement |
  HTMLVideoElement |
  HTMLCanvasElement |
  // ImageBitmap |
  OffscreenCanvas /* | VideoFrame */

enum ImageUsability {
  GOOD,
  BAD,
}

enum ImageSmoothingQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// See: https://html.spec.whatwg.org/multipage/canvas.html#canvasimagesmoothing
interface CanvasImageSmoothing {
  imageSmoothingEnabled: boolean  // default true
  imageSmoothingQuality: ImageSmoothingQuality  // default "low"
}

const mixinCanvasImageSmoothing = <T extends CanvasImageSmoothing>(proto: T) => {
  proto.imageSmoothingEnabled = true
  proto.imageSmoothingQuality = ImageSmoothingQuality.LOW
}

// To check the usability of the image argument, where image is a CanvasImageSource object, run
// these steps:
// See: https://html.spec.whatwg.org/multipage/canvas.html#check-the-usability-of-the-image-argument
const checkImageUsability = (image: CanvasImageSource): ImageUsability => {
  // Switch on image:
  switch (image.constructor.name) {
    // HTMLOrSVGImageElement
    case 'SVGImageElement':
    case 'HTMLImageElement': {
      const img = image as HTMLOrSVGImageElement
      // If image's current request's state is broken, then throw an "InvalidStateError"
      // DOMException.
      if (currentImageRequest(img).state === ImageRequestState.BROKEN) {
        throw new DOMException('InvalidStateError', 'Image\'s current request\'s state is broken')
      }

      // If image is not fully decodable, then return bad.
      if (!isFullyDecodable(img)) {
        return ImageUsability.BAD
      }

      // If image has a natural width or natural height (or both) equal to zero, then return bad.
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        return ImageUsability.BAD
      }

      break
    }
    // HTMLCanvasElement
    // OffscreenCanvas
    case 'HTMLCanvasElement':
    case 'OffscreenCanvas': {
      const img = image as HTMLCanvasElement
      // If image has either a horizontal dimension or a vertical dimension equal to zero, then
      // throw an "InvalidStateError" DOMException.
      if (img.width === 0 || img.height === 0) {
        throw new DOMException(
          'InvalidStateError',
          'Image has either a horizontal dimension or a vertical dimension equal to zero'
        )
      }
      break
    }
    default:
      warnNotImplement(`checkImageUsability for ${image.constructor.name}`)
      break
  }
  // Return good.
  return ImageUsability.GOOD
}

export {
  HTMLOrSVGImageElement,
  CanvasImageSource,
  ImageUsability,
  checkImageUsability,
  ImageSmoothingQuality,
  CanvasImageSmoothing,
  mixinCanvasImageSmoothing,
}
