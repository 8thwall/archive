// @sublibrary(:dom-core-lib)
/* eslint-disable @typescript-eslint/no-unused-vars, class-methods-use-this, max-classes-per-file */

import colorParse from 'color-rgba'

// Disable unused vars check, as this file is a polyfill with many unimplemented methods.

import type {Element} from './element'
import type {HTMLElement} from './html-element'

import type {HTMLCanvasElement} from './html-canvas-element'
import type {ImageBitmap} from './image-bitmap'
import {ImageData, ImageDataOptions} from './image-data'
import {copyRawImage, createImage, RawImage} from './raw-image'
import {
  CanvasImageSource,
  CanvasImageSmoothing,
  mixinCanvasImageSmoothing,
} from './rendering-context-2d'
import {mixinCanvasDrawImage, CanvasDrawImage} from './canvas-draw-image'

const internalWarnOnceSet = new Set<string>()
const warnNotImplement = (methodName: string) => {
  if (!internalWarnOnceSet.has(methodName)) {
    // eslint-disable-next-line no-console
    console.warn(`${methodName}: Not implemented`)
    internalWarnOnceSet.add(methodName)
  }
}

class CanvasGradient {
  // eslint-disable-next-line class-methods-use-this
  addColorStop(offset: number, color: string): void {
    warnNotImplement('CanvasGradient.addColorStop')
  }
}

class CanvasPattern {
}

class TextMetrics {
  width: number = 0
}

class HitRegionOptions {
  id?: string

  control?: HTMLElement | null;
}

// Polyfill for browser CanvasRenderingContext2D returned from .getContext('2d')
class CanvasRenderingContext2D {
  readonly canvas: HTMLCanvasElement

  private _image: RawImage

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this._image = createImage(canvas.width, canvas.height)
  }

  save(): void {
    warnNotImplement('CanvasRenderingContext2D.save')
  }

  restore(): void {
    warnNotImplement('CanvasRenderingContext2D.restore')
  }

  scale(x: number, y: number): void {
    warnNotImplement('CanvasRenderingContext2D.scale')
  }

  rotate(angle: number): void {
    warnNotImplement('CanvasRenderingContext2D.rotate')
  }

  translate(x: number, y: number): void {
    warnNotImplement('CanvasRenderingContext2D.translate')
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    warnNotImplement('CanvasRenderingContext2D.transform')
  }

  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    warnNotImplement('CanvasRenderingContext2D.setTransform')
  }

  globalAlpha: number = 1.0

  globalCompositeOperation: string = 'source-over'

  strokeStyle: string | CanvasGradient | CanvasPattern;  // (default black)

  fillStyle: string | CanvasGradient | CanvasPattern;  // (default black)

  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    warnNotImplement('CanvasRenderingContext2D.createLinearGradient')
    return new CanvasGradient()
  }

  createRadialGradient(
    x0: number, y0: number, r0: number, x1: number, y1: number, r1: number
  ): CanvasGradient {
    warnNotImplement('CanvasRenderingContext2D.createRadialGradient')
    return new CanvasGradient()
  }

  createPattern(
    image: CanvasImageSource,
    repetition?: string
  ): CanvasPattern {
    warnNotImplement('CanvasRenderingContext2D.createPattern')
    return new CanvasPattern()
  }

  shadowOffsetX: number = 0

  shadowOffsetY: number = 0

  shadowBlur: number = 0

  shadowColor: string;  // (default transparent black)

  clearRect(x: number, y: number, w: number, h: number): void {
    const transparentBlack = [0, 0, 0, 0]
    for (let j = y; j < y + h; j++) {
      for (let i = x; i < x + w; i++) {
        const index = j * this.canvas.width + i
        this._image.setPixel(index, transparentBlack)
      }
    }
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    const color = this.fillStyle
    if (typeof color !== 'string') {
      warnNotImplement('CanvasRenderingContext2D.fillRect with CanvasGradient or CanvasPattern')
      return
    }
    const rgba = colorParse(color)
    const alpha = Math.round(rgba[3] * 255)
    const colorArray = [rgba[0], rgba[1], rgba[2], alpha]
    for (let j = y; j < y + h; j++) {
      for (let i = x; i < x + w; i++) {
        const index = j * this.canvas.width + i
        this._image.setPixel(index, colorArray)
      }
    }
  }

  strokeRect(x: number, y: number, w: number, h: number): void {
    warnNotImplement('CanvasRenderingContext2D.strokeRect')
  }

  beginPath(): void {
    warnNotImplement('CanvasRenderingContext2D.beginPath')
  }

  fill(): void {
    warnNotImplement('CanvasRenderingContext2D.fill')
  }

  stroke(): void {
    warnNotImplement('CanvasRenderingContext2D.stroke')
  }

  drawFocusIfNeeded(element: Element): void {
    warnNotImplement('CanvasRenderingContext2D.drawFocusIfNeeded')
  }

  clip(): void {
    warnNotImplement('CanvasRenderingContext2D.clip')
  }

  isPointInPath(x: number, y: number): boolean {
    warnNotImplement('CanvasRenderingContext2D.isPointInPath')
    return false
  }

  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    // TODO(mc): Implement fillText.
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    // TODO(mc): Implement strokeText.
  }

  measureText(text: string): TextMetrics {
    warnNotImplement('CanvasRenderingContext2D.measureText')
    return new TextMetrics()
  }

  addHitRegion(options: HitRegionOptions): void {
    warnNotImplement('CanvasRenderingContext2D.addHitRegion')
  }

  removeHitRegion(id: string): void {
    warnNotImplement('CanvasRenderingContext2D.removeHitRegion')
  }

  clearHitRegions(): void {
    warnNotImplement('CanvasRenderingContext2D.clearHitRegions')
  }

  createImageData(
    swOrImageData: number | ImageData,
    sh?: number,
    settings?: ImageDataOptions
  ): ImageData {
    if (typeof swOrImageData === 'number') {
      return new ImageData(swOrImageData, sh!, settings)
    } else {
      return new ImageData(swOrImageData.width, swOrImageData.height)
    }
  }

  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    if (sx === 0 && sy === 0 && sw === this._image.width && sh === this._image.height) {
      return new ImageData(
        new Uint8ClampedArray(this._image.getRGBAData()),
        this._image.width,
        this._image.height,
        {colorSpace: 'srgb'}
      )
    } else if (
      // If the source rectangle is entirely within the image data, return a new ImageData
      // object containing the image data in the given rectangle.
      sx >= 0 && sy >= 0 && sx + sw <= this._image.width && sy + sh <= this._image.height
    ) {
      const crop = this._image.crop({x: sx, y: sy, width: sw, height: sh})
      return new ImageData(
        new Uint8ClampedArray(crop.getRGBAData()),
        crop.width,
        crop.height,
        {colorSpace: 'srgb'}
      )
    } else {
      const tempImage = createImage(sw, sh)
      // Get a crop to the source rectangle that is within the image data.
      const crop = this._image.crop({
        x: Math.max(0, sx),
        y: Math.max(0, sy),
        width: Math.min(this._image.width - Math.max(0, sx), sw),
        height: Math.min(this._image.height - Math.max(0, sy), sh),
      })
      // Copy the crop to the destination rectangle.
      copyRawImage(
        crop, tempImage,
        0, 0, crop.width, crop.height,
        Math.max(0, -sx), Math.max(0, -sy), crop.width, crop.height, false
      )
      return new ImageData(
        new Uint8ClampedArray(tempImage.getRGBAData()),
        crop.width,
        crop.height,
        {colorSpace: 'srgb'}
      )
    }
  }

  putImageData(
    imagedata: ImageData,
    dx: number,
    dy: number,
    dirtyXIn?: number,
    dirtyYIn?: number,
    dirtyWidthIn?: number,
    dirtyHeightIn?: number
  ): void {
    // When the last four arguments to this method are omitted, they must be assumed to have the
    // values 0, 0, the width member of the imagedata structure,
    // and the height member of the imagedata structure, respectively.

    let dirtyX = dirtyXIn || 0
    let dirtyY = dirtyYIn || 0
    let dirtyWidth = dirtyWidthIn || imagedata.width
    let dirtyHeight = dirtyHeightIn || imagedata.height

    // 1. Let buffer be imagedata's data attribute value's [[ViewedArrayBuffer]] internal slot.
    const buffer = new Uint8ClampedArray(imagedata.data)

    // 2. If IsDetachedBuffer(buffer) is true, then throw an "InvalidStateError" DOMException.
    // [NOT IMPLEMENTED]

    // 3. If dirtyWidth is negative, then let dirtyX be dirtyX+dirtyWidth,
    // and let dirtyWidth be equal to the absolute magnitude of dirtyWidth.
    if (dirtyWidth < 0) {
      dirtyX += dirtyWidth
      dirtyWidth = -dirtyWidth
    }

    // If dirtyHeight is negative, then let dirtyY be dirtyY+dirtyHeight,
    // and let dirtyHeight be equal to the absolute magnitude of dirtyHeight.
    if (dirtyHeight < 0) {
      dirtyY += dirtyHeight
      dirtyHeight = -dirtyHeight
    }

    // 4. If dirtyX is negative, then let dirtyWidth be dirtyWidth+dirtyX, and let dirtyX be zero.
    if (dirtyX < 0) {
      dirtyWidth += dirtyX
      dirtyX = 0
    }

    // If dirtyY is negative, then let dirtyHeight be dirtyHeight+dirtyY, and let dirtyY be zero.
    if (dirtyY < 0) {
      dirtyHeight += dirtyY
      dirtyY = 0
    }

    // 5. If dirtyX+dirtyWidth is greater than the width attribute of the imagedata argument,
    // then let dirtyWidth be the value of that width attribute, minus the value of dirtyX.
    if (dirtyX + dirtyWidth > imagedata.width) {
      dirtyWidth = imagedata.width - dirtyX
    }

    // If dirtyY+dirtyHeight is greater than the height attribute of the imagedata argument,
    // then let dirtyHeight be the value of that height attribute, minus the value of dirtyY.
    if (dirtyY + dirtyHeight > imagedata.height) {
      dirtyHeight = imagedata.height - dirtyY
    }

    // 6. If, after those changes, either dirtyWidth or dirtyHeight are negative or zero,
    // then return without affecting any bitmaps.
    if (dirtyWidth <= 0 || dirtyHeight <= 0) {
      return
    }

    // 7. For all integer values of x and y where dirtyX ≤ x < dirtyX+dirtyWidth and
    // dirtyY ≤ y < dirtyY+dirtyHeight, copy the four channels of the pixel with coordinate (x, y)
    // in the imagedata data structure's Canvas Pixel ArrayBuffer to the pixel with coordinate
    // (dx+x, dy+y) in the rendering context's output bitmap.

    const numChannels = 4
    const pixel: number[] = [0, 0, 0, 0]
    for (let x = dirtyX; x < dirtyX + dirtyWidth; x++) {
      for (let y = dirtyY; y < dirtyY + dirtyHeight; y++) {
        const index = y * imagedata.width + x
        pixel[0] = buffer[index * numChannels]
        pixel[1] = buffer[index * numChannels + 1]
        pixel[2] = buffer[index * numChannels + 2]
        pixel[3] = buffer[index * numChannels + 3]
        this._image.setPixel((dy + y) * this._image.width + dx + x, pixel)
      }
    }
  }

  // Implement CanvasDrawingStyles
  lineWidth: number = 1;

  lineCap: string = 'butt';

  lineJoin: string = 'miter';

  miterLimit: number = 10;

  lineDashOffset: number = 0;

  font: string = '10px sans-serif';

  textAlign: string = 'start';

  textBaseline: string = 'alphabetic';

  setLineDash(segments: number[]): void {
    warnNotImplement('CanvasRenderingContext2D.setLineDash')
  }

  getLineDash(): number[] {
    warnNotImplement('CanvasRenderingContext2D.getLineDash')
    return []
  }

  // Implement CanvasPathMethods
  closePath(): void {
    warnNotImplement('CanvasRenderingContext2D.closePath')
  }

  moveTo(x: number, y: number): void {
    warnNotImplement('CanvasRenderingContext2D.moveTo')
  }

  lineTo(x: number, y: number): void {
    warnNotImplement('CanvasRenderingContext2D.lineTo')
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    warnNotImplement('CanvasRenderingContext2D.quadraticCurveTo')
  }

  bezierCurveTo(
    cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number
  ): void {
    warnNotImplement('CanvasRenderingContext2D.bezierCurveTo')
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    warnNotImplement('CanvasRenderingContext2D.arcTo')
  }

  rect(x: number, y: number, w: number, h: number): void {
    warnNotImplement('CanvasRenderingContext2D.rect')
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ): void {
    warnNotImplement('CanvasRenderingContext2D.arc')
  }
}

// Add mixin types via declaration merging.
interface CanvasRenderingContext2D extends CanvasDrawImage {}  // eslint-disable-line no-redeclare
// eslint-disable-next-line no-redeclare
interface CanvasRenderingContext2D extends CanvasImageSmoothing {}

// Add mixin properties and methods.
mixinCanvasDrawImage(CanvasRenderingContext2D.prototype)
mixinCanvasImageSmoothing(CanvasRenderingContext2D.prototype)

export {
  CanvasRenderingContext2D,
  ImageBitmap,
  CanvasGradient,
  CanvasPattern,
  TextMetrics,
  HitRegionOptions,
}
