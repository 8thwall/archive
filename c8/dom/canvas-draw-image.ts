// @sublibrary(:dom-core-lib)
import {copyRawImage} from './raw-image'

import {
  ImageUsability,
  checkImageUsability,
} from './rendering-context-2d'

import type {
  CanvasImageSource,
} from './rendering-context-2d'

import {createImageFromData, ImageKind} from './raw-image'

const internalWarnOnceSet = new Set<string>()
const warnNotImplement = (methodName: string) => {
  if (!internalWarnOnceSet.has(methodName)) {
    // eslint-disable-next-line no-console
    console.warn(`${methodName}: Not implemented`)
    internalWarnOnceSet.add(methodName)
  }
}

interface CanvasDrawImage {
  drawImage(image: CanvasImageSource, dx: number, dy: number): void

  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void

  drawImage(
    image: CanvasImageSource,
    sx: number, sy: number, sw: number, sh: number,
    dx: number, dy: number, dw: number, dh: number
  ): void
}

// See: https://html.spec.whatwg.org/multipage/canvas.html#canvasdrawimage
const mixinCanvasDrawImage = <T extends CanvasDrawImage>(proto: T) => {
  // When the drawImage() method is invoked, the user agent must run these steps:
  // See: https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-drawimage
  proto.drawImage = function drawImage(image: CanvasImageSource, ...args: number[]): void {
    // 1. If any of the arguments are infinite or NaN, then return.
    if (args.some(arg => !Number.isFinite(arg))) {
      return
    }

    // 2. Let usability be the result of checking the usability of image.
    const usability = checkImageUsability(image)

    // 3. If usability is bad, then return (without drawing anything).
    if (usability === ImageUsability.BAD) {
      return
    }

    // Establish the source and destination rectangles as follows:

    // If not specified, the dw and dh arguments must default to the values of sw and sh,
    // interpreted such that one CSS pixel in the image is treated as one unit in the output
    // bitmap's coordinate space. If the sx, sy, sw, and sh arguments are omitted, then they must
    // default to 0, 0, the image's natural width in image pixels, and the image's natural height in
    // image pixels, respectively. If the image has no natural dimensions, then the concrete object
    // size must be used instead, as determined using the CSS "Concrete Object Size Resolution"
    // algorithm, with the specified size having neither a definite width nor height, nor any
    // additional constraints, the object's natural properties being those of the image argument,
    // and the default object size being the size of the output bitmap. [CSSIMAGES]
    let dx: number, dy: number, dw: number, dh: number
    let sx: number, sy: number, sw: number, sh: number
    const imageAny = image as any
    const imageWidth: number = imageAny?.naturalWidth ?? imageAny.width
    const imageHeight: number = imageAny?.naturalHeight ?? imageAny.height
    if (args.length > 4) {
      sx = args[0] || 0
      sy = args[1] || 0
      sw = args[2] || 0
      sh = args[3] || 0
    } else {
      sx = 0
      sy = 0
      sw = imageWidth
      sh = imageHeight
    }

    if (args.length > 4) {
      dx = args[4] || 0
      dy = args[5] || 0
      dw = args[6] || sw
      dh = args[7] || sh
    } else {
      dx = args[0]  // eslint-disable-line prefer-destructuring
      dy = args[1]  // eslint-disable-line prefer-destructuring
      dw = args[2] || sw
      dh = args[3] || sh
    }

    // Try to get the source image from the location of our HTMLImageElement or HTMLCanvasElement
    // with 2d context.
    let srcImage = imageAny._image ?? imageAny._context?._image

    // Try to get the source image by reading pixels out of a WebGL or WebGL2 context.
    if (!srcImage && imageAny._context &&
        (imageAny._contextType === 'webgl' || imageAny._contextType === 'webgl2')) {
      // Read the pixels from the WebGL context.
      const pixels = new Uint8Array(imageAny.width * imageAny.height * 4)
      imageAny._context.readPixels(
        0, 0, imageAny.width, imageAny.height, imageAny._context.RGBA,
        imageAny._context.UNSIGNED_BYTE, pixels
      )
      srcImage = createImageFromData(
        imageAny.width, imageAny.height, pixels, {kind: ImageKind.RGBA}
      )
    }

    if (!srcImage) {
      warnNotImplement(
        `CanvasRenderingContext2D.drawImage for ${image?.constructor?.name}`
      )
      return
    }

    // The source rectangle is the rectangle whose corners are the four points
    // (sx, sy), (sx+sw, sy), (sx+sw, sy+sh), (sx, sy+sh).
    //
    // The destination rectangle is the rectangle whose corners are the four points
    // (dx, dy), (dx+dw, dy), (dx+dw, dy+dh), (dx, dy+dh).
    //
    // When the source rectangle is outside the source image, the source rectangle must be clipped
    // to the source image and the destination rectangle must be clipped in the same proportion.
    sx = Math.max(0, Math.min(imageWidth, sx))
    sy = Math.max(0, Math.min(imageHeight, sy))

    const osw = sw
    const osh = sh

    sw = Math.max(0, Math.min(imageWidth - sx, sw))
    sh = Math.max(0, Math.min(imageHeight - sy, sh))

    dw = Math.floor((sw * dw) / osw)
    dh = Math.floor((sh * dh) / osh)

    // Note: When the destination rectangle is outside the destination image (the output bitmap),
    // the pixels that land outside the output bitmap are discarded, as if the destination was an
    // infinite canvas whose rendering was clipped to the dimensions of the output bitmap.

    // 5. If one of the sw or sh arguments is zero, then return. Nothing is painted.
    if (sw === 0 || sh === 0) {
      return
    }

    // 6. Paint the region of the image argument specified by the source rectangle on the region of
    // the rendering context's output bitmap specified by the destination rectangle, after applying
    // the current transformation matrix to the destination rectangle.
    copyRawImage(
      srcImage,
      this._image,
      sx, sy, sw, sh, dx, dy, dw, dh,
      this.imageSmoothingEnabled
    )
    // The image data must be processed in the original direction, even if the dimensions given
    // are negative.
    //
    // When scaling up, if the imageSmoothingEnabled attribute is set to true, the user agent should
    // attempt to apply a smoothing algorithm to the image data when it is scaled. User agents which
    // support multiple filtering algorithms may use the value of the imageSmoothingQuality
    // attribute to guide the choice of filtering algorithm when the imageSmoothingEnabled attribute
    // is set to true. Otherwise, the image must be rendered using nearest-neighbor interpolation.
    //
    // Note: This specification does not define the precise algorithm to use when scaling an image
    // down, or when scaling an image up when the imageSmoothingEnabled attribute is set to true.
    //
    // Note: When a canvas element is drawn onto itself, the drawing model requires the source to be
    // copied before the image is drawn, so it is possible to copy parts of a canvas element onto
    // overlapping parts of itself.
    //
    // If the original image data is a bitmap image, then the value painted at a point in the
    // destination rectangle is computed by filtering the original image data. The user agent may
    // use any filtering algorithm (for example bilinear interpolation or nearest-neighbor). When
    // the filtering algorithm requires a pixel value from outside the original image data, it must
    // instead use the value from the nearest edge pixel. (That is, the filter uses 'clamp-to-edge'
    // behavior.) When the filtering algorithm requires a pixel value from outside the source
    // rectangle but inside the original image data, then the value from the original image data
    // must be used.
    //
    // Note: Thus, scaling an image in parts or in whole will have the same effect. This does mean
    // that when sprites coming from a single sprite sheet are to be scaled, adjacent images in the
    // sprite sheet can interfere. This can be avoided by ensuring each sprite in the sheet is
    // surrounded by a border of transparent black, or by copying sprites to be scaled into
    // temporary canvas elements and drawing the scaled sprites from there.
    //
    // Images are painted without affecting the current path, and are subject to shadow effects,
    // global alpha, the clipping region, and the current compositing and blending operator.
    //
    // 7. If image is not origin-clean, then set the CanvasRenderingContext2D's origin-clean flag to
    // false.
    // [NOT IMPLEMENTED]
  }
}

export {mixinCanvasDrawImage, CanvasDrawImage}
