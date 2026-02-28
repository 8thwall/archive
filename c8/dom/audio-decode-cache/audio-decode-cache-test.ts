// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)
// @package(npm-rendering)
// @dep(//c8/dom:dom-core-lib)
import {promises as fs} from 'fs'

import {describe, it, beforeEach, assert, afterEach} from '@nia/bzl/js/chai-js'
import {AudioBuffer} from '../audio/audio-buffer'
import {sinon} from '@nia/bzl/js/chai-js'

import {
  createDom,
  type Dom,
  type Window,
} from '@nia/c8/dom/dom'

import {createAudioDecodeCache} from './audio-decode-cache'

const simulateDecode = async (data: ArrayBuffer): Promise<AudioBuffer> => {
  const inputFloatArray = new Float32Array(data)

  // Create a mock AudioBuffer with dummy values
  const mockAudioBuffer = new AudioBuffer({
    numberOfChannels: 2,
    length: inputFloatArray.length,
    sampleRate: 44100,
  })

  mockAudioBuffer.setChannelData(0, Buffer.from(inputFloatArray.buffer))
  mockAudioBuffer.setChannelData(1, Buffer.from(inputFloatArray.buffer))

  // Simulate decoding the audio data with a delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Return the mock AudioBuffer
  return mockAudioBuffer
}

// Setup for tests
const mockDecodeAudioData = sinon.stub().callsFake(simulateDecode)
const makeTmpDecodeCachePath = () => `/tmp/decodeCache_${Math.floor(Math.random() * 1000)}`
const sampleBuffer = new Float32Array([0, 1, 2, 4, 5, 6, 7, 8, 9])
const sampleKey = 'sample-key'
let cacheDir: string
let decodeCache: ReturnType<typeof createAudioDecodeCache>

describe('Decode Cache Tests', () => {
  let dom: Dom
  let window: Window
  beforeEach(async () => {
    dom = await createDom({width: 640, height: 480})
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
    globalThis.Worker = window.Worker
    cacheDir = makeTmpDecodeCachePath()
    decodeCache = createAudioDecodeCache(cacheDir, mockDecodeAudioData)
  })

  afterEach(async () => {
    mockDecodeAudioData.resetHistory()
    await decodeCache.clearCache()
    // clear cache directory
    await fs.rm(cacheDir, {recursive: true})
    await dom.dispose()
  })

  it('re-use ongoing decode promise to avoid redundant decodes', async () => {
    const [decodedBuffer1, decodedBuffer2] = await Promise.all([
      decodeCache.decode(sampleKey, sampleBuffer),
      decodeCache.decode(sampleKey, sampleBuffer)])

    assert.isOk(decodedBuffer1)
    assert.isOk(decodedBuffer2)
    assert.equal(decodedBuffer1, decodedBuffer2)

    assert.isTrue(mockDecodeAudioData.calledOnce)
  }).timeout(10000)  // generous 10s to allow for slower reads/writes

  it('re-use existing finished decode promise', async () => {
    const decodedBuffer1 = await decodeCache.decode(sampleKey, sampleBuffer)
    assert.isOk(decodedBuffer1)

    // Subsequent decode request should use existing cached promise
    const decodedBuffer2 = await decodeCache.decode(sampleKey, sampleBuffer)
    assert.isOk(decodedBuffer2)

    assert.deepStrictEqual(decodedBuffer1, decodedBuffer2)

    assert.isTrue(mockDecodeAudioData.calledOnce)
  }).timeout(10000)  // generous 10s to allow for slower reads/writes

  it('cache hit on disk', async () => {
    const decodeCache2 = createAudioDecodeCache(cacheDir, mockDecodeAudioData)

    const decodedBuffer1 = await decodeCache.decode(sampleKey, sampleBuffer)
    assert.isOk(decodedBuffer1)

    // wait for 2 seconds to make sure first decode is done and written to disk
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Subsequent decode request should use file on disk
    const decodedBuffer2 = await decodeCache2.decode(sampleKey, sampleBuffer)
    assert.isOk(decodedBuffer2)

    assert.deepStrictEqual(decodedBuffer1, decodedBuffer2)

    assert.isTrue(mockDecodeAudioData.calledOnce)

    await decodeCache2.clearCache()
  }).timeout(10000)  // generous 10s to allow for slower reads/writes
})
