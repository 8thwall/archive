// @attr(npm_rule = "@npm-public-api//:npm-public-api")
// @attr(externalize_npm = True)

import {describe, it, assert} from '@nia/bzl/js/chai-js'

import sharp from 'sharp'

import {unconify, computePixelPointsFromRadius} from './unconify'
import {ImageData} from './image-data'
import {Images} from '../test/images'

const RED = new Uint8ClampedArray([255, 0, 0, 255])
const GREEN = new Uint8ClampedArray([0, 255, 0, 255])
const BLUE = new Uint8ClampedArray([0, 0, 255, 255])

describe('unconify', () => {
  it('should unconify the image', async () => {
    // This cone image has 3 colored dots on it that should map to the edges once unconfifed.
    const rawConeData = await sharp(Images.pixelCone)
      .raw().toBuffer({resolveWithObject: true})

    const coneData = new ImageData(rawConeData.data, rawConeData.info.width)

    const pixelPoints = computePixelPointsFromRadius(100, 62.5, coneData.width)

    const flattened = unconify(coneData, pixelPoints, coneData.width)

    const getPixel = (x, y) => {
      const start = (x + y * flattened.width) * 4
      return flattened.data.slice(start, start + 4)
    }

    // Sample the pixels that correspond to the expected locations of the colored dots,
    // inset slightly because the edges aren't pixel perfect.
    const topRight = getPixel(1, 1)
    const bottomMiddle = getPixel(Math.floor(flattened.width / 2), flattened.height - 2)
    const bottomRight = getPixel(flattened.width - 2, flattened.height - 2)

    assert.deepEqual(topRight, RED)
    assert.deepEqual(bottomMiddle, GREEN)
    assert.deepEqual(bottomRight, BLUE)
  })
})
