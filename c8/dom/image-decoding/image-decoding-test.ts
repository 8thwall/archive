// @attr[](data = "//c8/io:tiny-jpg")
// @attr[](data = "//c8/pixels/testdata:frame0")
// @attr[](data = "//c8/pixels/testdata:test-input-landscape")
// @attr[](data = "//c8/pixels/testdata:test-input-portrait")
// @attr[](data = "//c8/pixels/testdata:test-gif-input")
// @package(npm-rendering)

import path from 'path'

import fs from 'fs'

import {loadImage} from '@nia/c8/dom/image-decoding/image-decoding'
import {assert, describe, it, after} from '@nia/bzl/js/chai-js'

import {
  createFetchWithDefaultBase,
  createUrlClass,
} from '@nia/c8/dom/fetch-overload'

// Set to true to write the output to a file.
// Can open file with Fiji or other image viewers.
const WRITE_OUTPUT = false

const runfilesDir = process.env.RUNFILES_DIR || path.join(__dirname, '{label}.runfiles')
const URL = createUrlClass(`file://${runfilesDir}/_main/c8/pixels/testdata/`)
const {fetchWithDefaultBase, dispose} = createFetchWithDefaultBase(URL)

describe('Image Decoding Test', () => {
  after(() => {
    dispose()
  })

  it('test basic jpg', async () => {
    const baseFileName = 'frame_0_portrait'
    const jpgUrl = new URL(`${baseFileName}.jpg`)
    const response = await fetchWithDefaultBase(jpgUrl)
    const buffer = await response.arrayBuffer()

    const bytes = new Uint8Array(buffer)
    const imageResponse = await loadImage(bytes)

    if (WRITE_OUTPUT) {
      const expectedUrl = new URL(`${baseFileName}.bin`)

      // eslint-disable-next-line no-console
      console.log('Writing output to file:', expectedUrl.pathname)
      fs.writeFileSync(expectedUrl.pathname, imageResponse.data)
    }

    const expectedNativeImage = {
      width: 144,
      height: 256,
      components: 3,
      hasAlpha: false,
    }

    // TODO: Update to bitmap to get the correct width and height.
    assert.strictEqual(imageResponse.width, expectedNativeImage.width)
    assert.strictEqual(imageResponse.height, expectedNativeImage.height)
    assert.strictEqual(imageResponse.components, expectedNativeImage.components)
    assert.strictEqual(imageResponse.hasAlpha, expectedNativeImage.hasAlpha)
  })

  it('test row packing', async () => {
    const baseFileName = '../../io/tiny-image'
    const pngUrl = new URL(`${baseFileName}.jpg`)
    const response = await fetchWithDefaultBase(pngUrl)
    const buffer = await response.arrayBuffer()

    const bytes = new Uint8Array(buffer)
    const imageResponse = await loadImage(bytes)

    if (WRITE_OUTPUT) {
      const expectedUrl = new URL(`${baseFileName}.bin`)

      // eslint-disable-next-line no-console
      console.log('Writing output to file:', expectedUrl.pathname)
      fs.writeFileSync(expectedUrl.pathname, imageResponse.data)
    }

    const expectedNativeImage = {
      width: 5,
      height: 7,
      components: 3,
      hasAlpha: false,
    }

    // Sanity check the row packing should happen
    const expectedRowBytes = expectedNativeImage.width *
      (expectedNativeImage.components + (expectedNativeImage.hasAlpha ? 1 : 0))
    assert.isTrue(expectedRowBytes % 4 !== 0)  // 32-bit alignment
    assert.strictEqual(imageResponse.rowBytes, expectedRowBytes)

    assert.strictEqual(imageResponse.width, expectedNativeImage.width)
    assert.strictEqual(imageResponse.height, expectedNativeImage.height)
    assert.strictEqual(imageResponse.components, expectedNativeImage.components)
    assert.strictEqual(imageResponse.hasAlpha, expectedNativeImage.hasAlpha)
  })

  it('test basic png', async () => {
    const baseFileName = 'test-input-landscape'
    const pngUrl = new URL(`${baseFileName}.png`)
    const response = await fetchWithDefaultBase(pngUrl)
    const buffer = await response.arrayBuffer()

    const bytes = new Uint8Array(buffer)
    const imageResponse = await loadImage(bytes)

    if (WRITE_OUTPUT) {
      const expectedUrl = new URL(`${baseFileName}.bin`)

      // eslint-disable-next-line no-console
      console.log('Writing output to file:', expectedUrl.pathname)
      fs.writeFileSync(expectedUrl.pathname, imageResponse.data)
    }

    const expectedNativeImage = {
      width: 640,
      height: 480,
      components: 3,
      hasAlpha: true,
    }

    assert.strictEqual(imageResponse.width, expectedNativeImage.width)
    assert.strictEqual(imageResponse.height, expectedNativeImage.height)
    assert.strictEqual(imageResponse.components, expectedNativeImage.components)
    assert.strictEqual(imageResponse.hasAlpha, expectedNativeImage.hasAlpha)
  })

  it('test basic gif', async () => {
    const baseFileName = 'test-gif-input-landscape'
    const gifUrl = new URL(`${baseFileName}.gif`)
    const response = await fetchWithDefaultBase(gifUrl)
    const buffer = await response.arrayBuffer()

    const bytes = new Uint8Array(buffer)
    const imageResponse = await loadImage(bytes)

    if (WRITE_OUTPUT) {
      const expectedUrl = new URL(`${baseFileName}.bin`)

      // eslint-disable-next-line no-console
      console.log('Writing output to file:', expectedUrl.pathname)
      fs.writeFileSync(expectedUrl.pathname, imageResponse.data)
    }

    const expectedNativeImage = {
      width: 400,
      height: 289,
      components: 3,
      hasAlpha: true,
    }

    assert.strictEqual(imageResponse.width, expectedNativeImage.width)
    assert.strictEqual(imageResponse.height, expectedNativeImage.height)
    assert.strictEqual(imageResponse.components, expectedNativeImage.components)
    assert.strictEqual(imageResponse.hasAlpha, expectedNativeImage.hasAlpha)
  })

  it('test several jpg', async () => {
    const baseFileName = 'frame_0'
    const jpgUrl = new URL(`${baseFileName}.jpg`)

    const expectedNativeImage = {
      width: 256,
      height: 144,
      components: 3,
      hasAlpha: false,
    }

    const doFetch = async () => {
      const response = await fetchWithDefaultBase(jpgUrl)
      const buffer = await response.arrayBuffer()

      const bytes = new Uint8Array(buffer)
      const imageResponse = await loadImage(bytes)

      assert.strictEqual(imageResponse.width, expectedNativeImage.width)
      assert.strictEqual(imageResponse.height, expectedNativeImage.height)
      assert.strictEqual(imageResponse.components, expectedNativeImage.components)
      assert.strictEqual(imageResponse.hasAlpha, expectedNativeImage.hasAlpha)
    }

    for (let i = 0; i < 10; i++) {
      // eslint-disable-next-line no-await-in-loop
      await doFetch()
    }
  })

  it('test bad mime type', async () => {
    const bytes = new Uint8Array(100).fill(0)

    try {
      // Mime sniff should fail when trying to load an image with no header.
      await loadImage(bytes)
      assert.fail('Should have thrown an error')
    } catch (e) {
      assert.strictEqual(e.message, 'Failed to load image')
    }
  })
})
