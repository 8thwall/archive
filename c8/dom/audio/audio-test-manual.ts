// @rule(js_test)
// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)
// @attr(tags = ["manual"])

// @dep(//c8/dom:dom-core-lib)

// @attr[](data = ":audio-test-files")
// @attr[](data = ":test-utils.js")
import * as fs from 'fs'

import {playAudio, stopAudio, updateGain} from './miniaudio'

import {describe, it, beforeEach, assert, afterEach} from '@nia/bzl/js/chai-js'

import {AudioContext} from './audio-context'
import {
  createDom,
  type Dom,
  type Window,
} from '@nia/c8/dom/dom'

import {generateSampleAudioData} from './test-utils'

describe('Audio tests', () => {
  let dom: Dom
  let window: Window
  beforeEach(async () => {
    dom = await createDom({width: 640, height: 480})
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
    globalThis.Worker = window.Worker
  })

  afterEach(async () => {
    await dom.dispose()
  })

  // eslint-disable-next-line func-names
  it('can play a decoded audio buffer', async () => {
    const context = new AudioContext()

    // read local file BAK.wav into arraybuffer
    const url = `${process.env.TEST_SRCDIR}/_main/c8/dom/audio/test_files/BAK.wav`

    const fileBuffer = fs.readFileSync(url)

    const audioBuffer = await context.decodeAudioData(fileBuffer.buffer, () => {}, () => {})
    assert.isOk(audioBuffer)

    const channelData = [audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)]

    const id = playAudio(channelData)

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        stopAudio(id)
        resolve()
      }, 5000)  // play for 5 seconds
    })
  }).timeout(6000)  // increase timeout to 6s for this test

  it('test left and right gain', async () => {
    const sampleRate = 44100
    const durationInSeconds = 1
    const frequency = 440  // A4 note, 440Hz (middle A)
    const amplitude = 0.5  // 50% volume
    const note = generateSampleAudioData(sampleRate, durationInSeconds, frequency, amplitude)

    const idRight = playAudio(note, 1.0, 0.0, 1.0, false)  // right side

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        stopAudio(idRight)
        resolve()
      }, 1000)  // play for 1 second
    })

    const idLeft = playAudio(note, 1.0, 1.0, 0.0, true)  // left side

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        stopAudio(idLeft)
        resolve()
      }, 1000)  // play for 1 second
    })
  }).timeout(4000)  // increase timeout to 4s for this test

  it('test update gain: smooth left to right pan', async () => {
    const sampleRate = 44100
    const durationInSeconds = 4
    const frequency = 440  // A4 note, 440Hz (middle A)
    const amplitude = 0.5  // 50% volume
    const note = generateSampleAudioData(sampleRate, durationInSeconds, frequency, amplitude)

    const id = playAudio(note, 1.0, 1.0, 0.0, true)  // left side

    // simulate smooth left to right pan
    const n = 400  // Number of steps
    const startAngle = -90  // Starting angle in degrees
    const endAngle = 90  // Ending angle in degrees
    const stepDuration = 10  // 10ms per step
    for (let i = 0; i <= n; i++) {
      // Calculate the current angle in radians
      const currentAngle = startAngle + (endAngle - startAngle) * (i / n)

      // calculate normalized input x (assume input is stereo)
      let x = 0
      if (currentAngle <= 0) {  // -90 -> 0
        x = (currentAngle + 90) / 90
      } else {  // 0 -> 90
        x = currentAngle / 90
      }

      // For stereo input, the output is calculated as:
      const gainL = Math.cos((x * Math.PI) / 2)
      const gainR = Math.sin((x * Math.PI) / 2)
      const azimuthLeft = (currentAngle <= 0)

      updateGain(id, 1.0, gainL, gainR, azimuthLeft)

      // eslint-disable-next-line no-await-in-loop
      await new Promise<void>(resolve => setTimeout(resolve, stepDuration))
    }
    stopAudio(id)
  }).timeout(5500)
})
