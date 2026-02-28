// @sublibrary(:dom-core-lib)
import type {Document} from './document'
import {HTMLImageElement, createHTMLImageElement} from './html-image-element'

interface Image {
  prototype: typeof HTMLImageElement
  new(width?: number, height?: number): HTMLImageElement
}

const createImageConstructor = (doc: Document): Image => {
  const ImageConstructor: Image = function Image(
    this: HTMLImageElement, width?: number, height?: number
  ) {
    const img = createHTMLImageElement(doc)
    if (width) {
      img.width = width
    }
    if (height) {
      img.height = height
    }
    return img
  } as any
  ;(ImageConstructor.prototype as any) = HTMLImageElement.prototype
  return ImageConstructor
}

export {createImageConstructor, Image}
