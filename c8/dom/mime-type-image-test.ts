// @attr[](data = "//c8/pixels/testdata:frame0")
// @attr[](data = "//c8/pixels/testdata:test-input-landscape")
// @attr[](data = "//c8/pixels/testdata:test-gif-input")
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import fs from 'fs'
import path from 'path'

import {
  describe, it, assert,
} from '@nia/bzl/js/chai-js'

import {mimeTypeImage} from './mime-type-image'

const runfilesDir = process.env.RUNFILES_DIR
const pixelsTestDataDir = `${runfilesDir}/_main/c8/pixels/testdata/`

describe('Mime Type Image Tests', () => {
  it('detects PNG', () => {
    const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x00])
    assert.strictEqual(mimeTypeImage(pngHeader), 'image/png')
  })

  it('detects PNG mimetype when loading file', () => {
    const pngFilePath = path.join(pixelsTestDataDir, 'test-input-landscape.png')
    const pngFile = fs.readFileSync(pngFilePath)
    const pngData = new Uint8Array(pngFile)

    assert.strictEqual(mimeTypeImage(pngData), 'image/png')
  })

  it('detects JPEG', () => {
    const jpegHeader = new Uint8Array([0xFF, 0xD8, 0xFF, 0x00])
    assert.strictEqual(mimeTypeImage(jpegHeader), 'image/jpeg')
  })

  it('detects JPEG when loading file', () => {
    const jpegFilePath = path.join(pixelsTestDataDir, 'frame_0_portrait.jpg')
    const jpegFile = fs.readFileSync(jpegFilePath)
    const jpeg = new Uint8Array(jpegFile)

    assert.strictEqual(mimeTypeImage(jpeg), 'image/jpeg')
  })

  it('detects KTX', () => {
    const ktxHeader = new Uint8Array(
      [0xAB, 0x4B, 0x54, 0x58, 0x20, 0x32, 0x30, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A, 0x00]
    )
    assert.strictEqual(mimeTypeImage(ktxHeader), 'image/ktx')
  })

  it('detects ICO (type 1)', () => {
    const ico1Header = new Uint8Array([0x00, 0x00, 0x01, 0x00, 0x00])
    assert.strictEqual(mimeTypeImage(ico1Header), 'image/x-icon')
  })

  it('detects ICO (type 2)', () => {
    const ico2Header = new Uint8Array([0x00, 0x00, 0x02, 0x00, 0x00])
    assert.strictEqual(mimeTypeImage(ico2Header), 'image/x-icon')
  })

  it('detects BMP', () => {
    const bmpHeader = new Uint8Array([0x42, 0x4d, 0x00])
    assert.strictEqual(mimeTypeImage(bmpHeader), 'image/bmp')
  })

  it('detects GIF87a', () => {
    const gif87aHeader = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x37, 0x61, 0x00])
    assert.strictEqual(mimeTypeImage(gif87aHeader), 'image/gif')
  })

  it('detects GIF89a', () => {
    const gif89aHeader = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x00])
    assert.strictEqual(mimeTypeImage(gif89aHeader), 'image/gif')
  })

  it('detects GIF from file', () => {
    const gifFilePath = path.join(pixelsTestDataDir, 'test-gif-input-landscape.gif')
    const gifFile = fs.readFileSync(gifFilePath)
    const gifData = new Uint8Array(gifFile)

    assert.strictEqual(mimeTypeImage(gifData), 'image/gif')
  })

  it('detects WEBP', () => {
    const webpHeader = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0x00])
    assert.strictEqual(mimeTypeImage(webpHeader), 'image/webp')
  })

  it('returns null for unknown pattern', () => {
    const unknown = new Uint8Array([0x00, 0x11, 0x22, 0x33])
    assert.strictEqual(mimeTypeImage(unknown), null)
  })

  it('returns null for empty input', () => {
    const empty = new Uint8Array([])
    assert.strictEqual(mimeTypeImage(empty), null)
  })

  it('returns null for too short input', () => {
    const short = new Uint8Array([0xFF])
    assert.strictEqual(mimeTypeImage(short), null)
  })
})
