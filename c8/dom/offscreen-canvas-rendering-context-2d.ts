// @sublibrary(:dom-core-lib)
/* eslint-disable @typescript-eslint/no-unused-vars, class-methods-use-this, max-classes-per-file */

import colorParse from 'color-rgba'

// Disable unused vars check, as this file is a polyfill with many unimplemented methods.

import type {ImageData} from './image-data'
import type {OffscreenCanvas} from './offscreen-canvas'

import {
  type CanvasImageSource,
  CanvasImageSmoothing,
  mixinCanvasImageSmoothing,
} from './rendering-context-2d'
import {mixinCanvasDrawImage, CanvasDrawImage} from './canvas-draw-image'

import type {
  CanvasGradient,
  CanvasPattern,
  TextMetrics,
  HitRegionOptions,
} from './canvas-rendering-context-2d'
import {createImage, RawImage} from './raw-image'

const internalWarnOnceSet = new Set<string>()
const warnNotImplement = (methodName: string) => {
  if (!internalWarnOnceSet.has(methodName)) {
    // eslint-disable-next-line no-console
    console.warn(`${methodName}: Not implemented`)
    internalWarnOnceSet.add(methodName)
  }
}

class OffscreenCanvasRenderingContext2D {
  readonly canvas: OffscreenCanvas

  private _image: RawImage

  constructor(canvas: OffscreenCanvas) {
    this.canvas = canvas
    this._image = createImage(canvas.width, canvas.height)
  }

  save(): void {
    throw new Error('Not implemented')
  }

  restore(): void {
    throw new Error('Not implemented')
  }

  scale(x: number, y: number): void {
    throw new Error('Not implemented')
  }

  rotate(angle: number): void {
    throw new Error('Not implemented')
  }

  translate(x: number, y: number): void {
    throw new Error('Not implemented')
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    throw new Error('Not implemented')
  }

  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    throw new Error('Not implemented')
  }

  globalAlpha: number = 1.0

  globalCompositeOperation: string = 'source-over'

  strokeStyle: string | CanvasGradient | CanvasPattern;  // (default black)

  fillStyle: string | CanvasGradient | CanvasPattern;  // (default black)

  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    throw new Error('Not implemented')
  }

  createRadialGradient(
    x0: number, y0: number, r0: number, x1: number, y1: number, r1: number
  ): CanvasGradient {
    throw new Error('Not implemented')
  }

  createPattern(
    image: CanvasImageSource,
    repetition?: string
  ): CanvasPattern {
    throw new Error('Not implemented')
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
    throw new Error('Not implemented')
  }

  beginPath(): void {
    throw new Error('Not implemented')
  }

  fill(): void {
    throw new Error('Not implemented')
  }

  stroke(): void {
    throw new Error('Not implemented')
  }

  clip(): void {
    throw new Error('Not implemented')
  }

  isPointInPath(x: number, y: number): boolean {
    throw new Error('Not implemented')
  }

  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    throw new Error('Not implemented')
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    throw new Error('Not implemented')
  }

  measureText(text: string): TextMetrics {
    throw new Error('Not implemented')
  }

  addHitRegion(options: HitRegionOptions): void {
    throw new Error('Not implemented')
  }

  removeHitRegion(id: string): void {
    throw new Error('Not implemented')
  }

  clearHitRegions(): void {
    throw new Error('Not implemented')
  }

  createImageData(sw: number | ImageData, sh?: number): ImageData {
    if (typeof sw === 'number') {
      // Overload createImageData(sw: number, sh number).
      throw new Error('Not implemented')
    } else {
      // Overload createImageData(imagedata: ImageData).
      throw new Error('Not implemented')
    }
  }

  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    if (sx === 0 && sy === 0 && sw === this._image.width && sh === this._image.height) {
      return {
        width: sw,
        height: sh,
        data: new Uint8ClampedArray(this._image.getRGBAData()),
        colorSpace: 'srgb',
      }
    } else {
      const crop = this._image.crop({x: sx, y: sy, width: sw, height: sh})
      return {
        width: sw,
        height: sh,
        data: new Uint8ClampedArray(crop.getRGBAData()),
        colorSpace: 'srgb',
      }
    }
  }

  putImageData(
    imagedata: ImageData,
    dx: number,
    dy: number,
    dirtyX?: number,
    dirtyY?: number,
    dirtyWidth?: number,
    dirtyHeight?: number
  ): void {
    throw new Error('Not implemented')
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
    throw new Error('Not implemented')
  }

  getLineDash(): number[] {
    throw new Error('Not implemented')
  }

  // Implement CanvasPathMethods
  closePath(): void {
    throw new Error('Not implemented')
  }

  moveTo(x: number, y: number): void {
    throw new Error('Not implemented')
  }

  lineTo(x: number, y: number): void {
    throw new Error('Not implemented')
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    throw new Error('Not implemented')
  }

  bezierCurveTo(
    cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number
  ): void {
    throw new Error('Not implemented')
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    throw new Error('Not implemented')
  }

  rect(x: number, y: number, w: number, h: number): void {
    throw new Error('Not implemented')
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ): void {
    throw new Error('Not implemented')
  }
}

// Add mixin types via declaration merging.
// eslint-disable-next-line no-redeclare
interface OffscreenCanvasRenderingContext2D extends CanvasDrawImage {}
// eslint-disable-next-line no-redeclare
interface OffscreenCanvasRenderingContext2D extends CanvasImageSmoothing {}

// Add mixin properties and methods.
mixinCanvasDrawImage(OffscreenCanvasRenderingContext2D.prototype)
mixinCanvasImageSmoothing(OffscreenCanvasRenderingContext2D.prototype)

export {OffscreenCanvasRenderingContext2D}
