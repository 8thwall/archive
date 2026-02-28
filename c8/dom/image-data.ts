// @sublibrary(:dom-core-lib)
import type {PredefinedColorSpace} from './image-defines'

interface ImageDataOptions {
  colorSpace: PredefinedColorSpace
}

class ImageData {
  readonly width: number

  readonly height: number

  readonly data: Uint8ClampedArray

  readonly colorSpace: PredefinedColorSpace

  constructor(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    imageDataOptions?: ImageDataOptions
  )

  constructor(width: number, height: number, imageDataOptions?: ImageDataOptions)

  // Single constructor implementation
  constructor(
    dataOrWidth: Uint8ClampedArray | number,
    widthOrHeight?: number,
    heightOrOptions?: number | ImageDataOptions,
    imageDataOptions?: ImageDataOptions
  ) {
    if (typeof dataOrWidth === 'number') {
      // Handle case where only width and height are provided
      this.width = dataOrWidth
      this.height = widthOrHeight!
      this.data = new Uint8ClampedArray(this.width * this.height * 4)
      this.colorSpace = (heightOrOptions as ImageDataOptions)?.colorSpace ??
        'srgb'
    } else {
      // Handle case where data, width, and height are provided
      this.data = dataOrWidth
      this.width = widthOrHeight!
      this.height = (heightOrOptions as number)!
      this.colorSpace = imageDataOptions?.colorSpace ?? 'srgb'
    }
  }
}

export {ImageData, ImageDataOptions}
