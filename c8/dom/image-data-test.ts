// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, assert, beforeEach, afterEach} from '@nia/bzl/js/chai-js'

import {
  createDom,
  type CanvasRenderingContext2D,
  type HTMLCanvasElement,
  type Dom,
  type Window,
} from '@nia/c8/dom/dom'

type ArrayType = Uint8Array | Uint8ClampedArray | number[]
const assertArrayEqual = (actual: ArrayType, expected: ArrayType) => {
  assert.strictEqual(actual.length, expected.length)
  for (let i = 0; i < actual.length; i++) {
    assert.strictEqual(actual[i], expected[i])
  }
}

describe('Image Data tests', () => {
  let dom: Dom
  let window: Window
  let ctx: CanvasRenderingContext2D
  let canvas: HTMLCanvasElement
  beforeEach(async () => {
    dom = await createDom({width: 640, height: 480})
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })

    // Create a canvas and 2D rendering context
    canvas = window.document.createElement('canvas')
    ctx = canvas.getContext('2d')!
    canvas.width = 100
    canvas.height = 100
    window.document.body!.appendChild(canvas)
  })

  afterEach(async () => {
    await dom.dispose()
  })

  it('should draw the entire image when dirty arguments are not provided', () => {
    const imageData = ctx.createImageData(10, 10)

    // Fill imageData with red
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255  // Red
      imageData.data[i + 1] = 0  // Green
      imageData.data[i + 2] = 0  // Blue
      imageData.data[i + 3] = 255  // Alpha
    }

    ctx.putImageData(imageData, 0, 0)

    const pixelData = ctx.getImageData(5, 5, 1, 1).data
    assertArrayEqual(pixelData, [255, 0, 0, 255])
  })

  it('should draw only the specified dirty region', () => {
    const imageData = ctx.createImageData(10, 10)

    // Fill imageData with blue
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 0  // Red
      imageData.data[i + 1] = 0  // Green
      imageData.data[i + 2] = 255  // Blue
      imageData.data[i + 3] = 255  // Alpha
    }

    // Put only a 5x5 portion of the image data (dirty region)
    ctx.putImageData(imageData, 0, 0, 2, 2, 5, 5)

    // Check a pixel inside the dirty region
    const pixelDataInside = ctx.getImageData(4, 4, 1, 1).data
    assertArrayEqual(pixelDataInside, [0, 0, 255, 255])

    // Check a pixel outside the dirty region
    const pixelDataOutside = ctx.getImageData(7, 7, 1, 1).data
    assertArrayEqual(pixelDataOutside, [0, 0, 0, 255])  // Should be empty
  })

  it('should handle out-of-bounds dirty region gracefully', () => {
    const imageData = ctx.createImageData(10, 10)

    // Fill imageData with green
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 0        // Red
      imageData.data[i + 1] = 255  // Green
      imageData.data[i + 2] = 0    // Blue
      imageData.data[i + 3] = 255  // Alpha
    }

    // Dirty region is out of bounds of the image data
    ctx.putImageData(imageData, 0, 0, -5, -5, 20, 20)

    // Check a pixel within the bounds of the image
    const pixelData = ctx.getImageData(0, 0, 1, 1).data
    assertArrayEqual(pixelData, [0, 255, 0, 255])

    // Ensure no errors occurred due to out-of-bounds coordinates
    const pixelOutOfBounds = ctx.getImageData(15, 15, 1, 1).data
    assertArrayEqual(pixelOutOfBounds, [0, 0, 0, 255])  // Should be empty
  })

  it('should not draw outside the image data when dirty region exceeds the image size', () => {
    const imageData = ctx.createImageData(5, 5)

    // Fill imageData with yellow
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255      // Red
      imageData.data[i + 1] = 255  // Green
      imageData.data[i + 2] = 0    // Blue
      imageData.data[i + 3] = 255  // Alpha
    }

    // Put a dirty region that exceeds the image size
    ctx.putImageData(imageData, 0, 0, 0, 0, 10, 10)

    // Check a pixel inside the image bounds
    const pixelDataInside = ctx.getImageData(3, 3, 1, 1).data
    assertArrayEqual(pixelDataInside, [255, 255, 0, 255])  // Yellow

    // Check a pixel outside the image bounds
    const pixelDataOutside = ctx.getImageData(8, 8, 1, 1).data
    assertArrayEqual(pixelDataOutside, [0, 0, 0, 255])  // Should be empty
  })

  it('should handle negative dirty coordinates correctly', () => {
    const imageData = ctx.createImageData(10, 10)

    // Fill imageData with purple
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 128      // Red
      imageData.data[i + 1] = 0    // Green
      imageData.data[i + 2] = 128  // Blue
      imageData.data[i + 3] = 255  // Alpha
    }

    // Use a dirty region with negative coordinates
    ctx.putImageData(imageData, 0, 0, -3, -3, 10, 10)

    // Check a pixel within the bounds
    const pixelData = ctx.getImageData(3, 3, 1, 1).data
    assertArrayEqual(pixelData, [128, 0, 128, 255])  // Purple

    // Ensure that out-of-bounds coordinates were ignored
    const pixelOutOfBounds = ctx.getImageData(0, 0, 1, 1).data
    assertArrayEqual(pixelOutOfBounds, [128, 0, 128, 255])
  })

  it('should draw the entire image when no dirty arguments are provided', () => {
    const imageData = ctx.createImageData(10, 10)

    // Fill imageData with red
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255      // Red
      imageData.data[i + 1] = 0    // Green
      imageData.data[i + 2] = 0    // Blue
      imageData.data[i + 3] = 255  // Alpha
    }

    ctx.putImageData(imageData, 0, 0)

    const pixelData = ctx.getImageData(5, 5, 1, 1).data
    assertArrayEqual(pixelData, [255, 0, 0, 255])  // Red
  })

  it('should correctly draw transparent pixels', () => {
    const imageData = ctx.createImageData(10, 10)

    // Fill imageData with transparent blue
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 0        // Red
      imageData.data[i + 1] = 0    // Green
      imageData.data[i + 2] = 255  // Blue
      imageData.data[i + 3] = 0    // Alpha (transparent)
    }

    ctx.putImageData(imageData, 0, 0)

    const pixelData = ctx.getImageData(5, 5, 1, 1).data
    assertArrayEqual(pixelData, [0, 0, 255, 0])  // Transparent blue
  })

  it('should handle negative x and y coordinates correctly', () => {
    const imageData = ctx.createImageData(10, 10)

    // Fill imageData with green
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 0        // Red
      imageData.data[i + 1] = 255  // Green
      imageData.data[i + 2] = 0    // Blue
      imageData.data[i + 3] = 255  // Alpha
    }

    ctx.putImageData(imageData, -5, -5)  // Place the top-left corner off-canvas

    const pixelData = ctx.getImageData(0, 0, 1, 1).data
    assertArrayEqual(pixelData, [0, 255, 0, 255])
  })

  it('should handle putting image data outside the canvas boundaries', () => {
    const imageData = ctx.createImageData(10, 10)

    // Fill imageData with red
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255      // Red
      imageData.data[i + 1] = 0    // Green
      imageData.data[i + 2] = 0    // Blue
      imageData.data[i + 3] = 255  // Alpha
    }

    ctx.putImageData(imageData, 95, 95)  // Image data overflows canvas

    // Check the bottom-right corner of the canvas (should be red)
    const pixelData = ctx.getImageData(99, 99, 1, 1).data
    assertArrayEqual(pixelData, [255, 0, 0, 255])
  })

  it('should overwrite existing canvas content', () => {
    // Draw something on the canvas (a blue rectangle)
    ctx.fillStyle = 'blue'
    ctx.fillRect(0, 0, 50, 50)

    const imageData = ctx.createImageData(10, 10)

    // Fill imageData with red
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255      // Red
      imageData.data[i + 1] = 0    // Green
      imageData.data[i + 2] = 0    // Blue
      imageData.data[i + 3] = 255  // Alpha
    }

    ctx.putImageData(imageData, 0, 0)

    // Check a pixel in the image data (should be red now)
    const pixelDataRed = ctx.getImageData(5, 5, 1, 1).data
    assertArrayEqual(pixelDataRed, [255, 0, 0, 255])

    // Check a pixel outside the image data (should still be blue)
    const pixelDataBlue = ctx.getImageData(30, 30, 1, 1).data
    assertArrayEqual(pixelDataBlue, [0, 0, 255, 255])
  })

  it('check canvas cleared after resize', () => {
    // Draw something on the canvas (a red rectangle)
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 50, 50)

    // Check a pixel in the canvas (should be red)
    const pixelDataRed = ctx.getImageData(5, 5, 1, 1).data
    assertArrayEqual(pixelDataRed, [255, 0, 0, 255])

    canvas.width = 200
    canvas.height = 200

    // Check a pixel in the canvas (should be black after resize)
    const pixelDataTransparent = ctx.getImageData(5, 5, 1, 1).data
    assertArrayEqual(pixelDataTransparent, [0, 0, 0, 255])
  })

  it('should handle image data larger than the canvas size', () => {
    const largeImageData = ctx.createImageData(200, 200)

    // Fill the large imageData with yellow
    for (let i = 0; i < largeImageData.data.length; i += 4) {
      largeImageData.data[i] = 255      // Red
      largeImageData.data[i + 1] = 255  // Green
      largeImageData.data[i + 2] = 0    // Blue
      largeImageData.data[i + 3] = 255  // Alpha
    }

    ctx.putImageData(largeImageData, 0, 0)

    // Check a pixel inside the canvas bounds (should be yellow)
    const pixelDataInside = ctx.getImageData(50, 50, 1, 1).data
    assertArrayEqual(pixelDataInside, [255, 255, 0, 255])
  })
})