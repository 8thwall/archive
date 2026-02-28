// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @dep(//c8/dom:dom-core-lib)
// @attr[](data = ":audio-test-files")
import * as fs from 'fs'

import {describe, it, beforeEach, assert, afterEach} from '@nia/bzl/js/chai-js'

import {AudioContext} from './audio-context'
import {AudioBuffer} from './audio-buffer'
import {AudioNode} from './audio-node'
import type {PannerGain} from './panner-node'
import {
  createDom,
  Dom,
  type Window,
  type Document,
} from '@nia/c8/dom/dom'

describe('Audio tests', () => {
  let dom: Dom
  let window: Window
  let document: Document
  beforeEach(async () => {
    dom = await createDom({width: 640, height: 480})
    window = dom.getCurrentWindow()
    document = window.document
    dom.onWindowChange((newWindow) => {
      window = newWindow
      document = window.document
    })
    globalThis.Worker = window.Worker
  })

  afterEach(async () => {
    await dom.dispose()
  })

  it('has AudioContext', () => {
    const audioContext = new AudioContext()
    assert.isOk(audioContext)
  })

  it('can handle a simple AudioBuffer', () => {
    const buffer = new AudioBuffer({
      numberOfChannels: 2,
      length: 22050,
      sampleRate: 44100,
    })
    assert.isOk(buffer)
  })

  it('has spatial audio with Panner', () => {
    // From https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createPanner#examples
    const context = new AudioContext()
    const panner = context.createPanner()
    panner.panningModel = 'HRTF'
    panner.distanceModel = 'inverse'
    panner.refDistance = 1
    panner.maxDistance = 10000
    panner.rolloffFactor = 1
    panner.coneInnerAngle = 360
    panner.coneOuterAngle = 0
    panner.coneOuterGain = 0
    panner.setOrientation(1, 0, 0)
    panner.setPosition(0, 0, 0)

    assert.isOk(panner)

    const {listener} = context
    listener.setOrientation(0, 0, -1, 0, 1, 0)
    listener.setPosition(0, 0, 300)

    assert.isOk(listener)
  })

  it('gain node can connect and disconnect', () => {
    const context = new AudioContext()
    const gain = context.createGain()
    gain.connect(context.destination)
    gain.disconnect(context.destination)
    assert.isAbove(gain.gain.value, 0, 'gain value is above 0 by default')

    // Put a filter after gain and destination
    const filter = new AudioNode(context)
    gain.connect(filter)
    filter.connect(context.destination)
    gain.disconnect(filter)
    filter.disconnect()
  })

  it('can decode wav', (done) => {
    const context = new AudioContext()

    const url = `${process.env.TEST_SRCDIR}/_main/c8/dom/audio/test_files/BAK.wav`

    const fileBuffer = fs.readFileSync(url)

    context.decodeAudioData(fileBuffer.buffer, (audioBuffer: AudioBuffer) => {
      assert.isOk(audioBuffer)
      assert.equal(audioBuffer.length, 367538)
      assert.equal(audioBuffer.numberOfChannels, 2)
      done()
    }, () => { done(new Error('decode fails')) })
  })

  it('can decode mp3', (done) => {
    const context = new AudioContext()

    // read local file attention.mp3 into arraybuffer
    const url = `${process.env.TEST_SRCDIR}/_main/c8/dom/audio/test_files/attention.mp3`

    // Read the file as a Buffer (binary data)
    const fileBuffer = fs.readFileSync(url)

    context.decodeAudioData(fileBuffer.buffer, (audioBuffer: AudioBuffer) => {
      assert.isOk(audioBuffer)
      // TODO(divya): why does this not exactly match sample rate * duration?
      assert.approximately(audioBuffer.length, 44100 * 6.2, 400)
      assert.equal(audioBuffer.numberOfChannels, 2)
      done()
    }, () => { done(new Error('decode fails')) })
  })

  it('handle error catch', (done) => {
    const context = new AudioContext()

    // create a random set of arrayBuffer of bytes of 100 size
    const arrayBuffer = new Uint8Array(100)
    for (let i = 0; i < 100; i++) {
      arrayBuffer[i] = Math.floor(Math.random() * 256)
    }
    context.decodeAudioData(arrayBuffer, () => {
      done(new Error('decode should fail on random data'))
    }).catch(() => {
      done()
    })
  })

  it('should call errorCallback', (done) => {
    const context = new AudioContext()

    // create a random set of arrayBuffer of bytes of 100 size
    const arrayBuffer = new Uint8Array(100)
    for (let i = 0; i < 100; i++) {
      arrayBuffer[i] = Math.floor(Math.random() * 256)
    }
    context.decodeAudioData(arrayBuffer, () => {
      done(new Error('decode should fail on random data'))
    }, () => {
      done()
    // uncaught errors not thrown on window will cause tests to fail
    }).catch(() => {})
  })

  it('decode two mp3s at once', (done) => {
    const context = new AudioContext()

    const url = `${process.env.TEST_SRCDIR}/_main/c8/dom/audio/test_files/wingFlap.mp3`

    const fileBuffer = fs.readFileSync(url)

    const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength)

    const url2 = `${process.env.TEST_SRCDIR}/_main/c8/dom/audio/test_files/attention.mp3`

    const fileBuffer2 = fs.readFileSync(url2)

    const arrayBuffer2 = fileBuffer2.buffer.slice(fileBuffer2.byteOffset,
      fileBuffer2.byteOffset + fileBuffer2.byteLength)

    Promise.all([
      context.decodeAudioData(arrayBuffer, () => {}),
      context.decodeAudioData(arrayBuffer2, () => {}),
    ]).then(() => {
      done()
    }).catch((error) => {
      done(error)
    })
  })

  it('computeGains for multiple sources, each with gain nodes in graph', () => {
    const context = new AudioContext()

    const audioElement = document.createElement('audio')
    const audioElementSource = context.createMediaElementSource(audioElement)

    // Create two GainNodes
    const gainNode1 = context.createGain()
    const gainNode2 = context.createGain()

    // Set gain values
    gainNode1.gain.value = 0.5
    gainNode2.gain.value = 0.2

    // Connect the nodes: audioElementSource -> gainNode1 -> gainNode2 -> destination
    audioElementSource.connect(gainNode1)
    gainNode1.connect(gainNode2)
    gainNode2.connect(context.destination)

    // Compute the final gain
    audioElementSource.pathToDestination()
    audioElementSource.computeGains()
    const totalGain = audioElementSource._totalGain

    const audioElement2 = document.createElement('audio')
    const audioElementSource2 = context.createMediaElementSource(audioElement2)

    // Create two GainNodes
    const gainNode3 = context.createGain()
    const gainNode4 = context.createGain()

    // Set gain values
    gainNode3.gain.value = 0.3
    gainNode4.gain.value = 0.4

    // Connect the nodes: audioElementSource2 -> gainNode3 -> gainNode4 -> destination
    audioElementSource2.connect(gainNode3)
    gainNode3.connect(gainNode4)
    gainNode4.connect(context.destination)

    // Compute the final gain
    audioElementSource2.pathToDestination()
    audioElementSource2.computeGains()
    const totalGain2 = audioElementSource2._totalGain

    // Expected total gain
    const expectedTotalGain = gainNode1.gain.value * gainNode2.gain.value
    const expectedTotalGain2 = gainNode3.gain.value * gainNode4.gain.value

    // Verify the final gain for both channels
    assert.equal(totalGain, expectedTotalGain, `Total gain src 1 should be ${expectedTotalGain}`)
    assert.equal(totalGain2, expectedTotalGain2, `Total gain src 2 should be ${expectedTotalGain2}`)
  })

  it('panner node computeAzimuth() and computeStereoPanningGain()', () => {
    const assertPannerGain = (panner: PannerGain, expected: PannerGain) => {
      assert.closeTo(panner.left, expected.left, 0.01)
      assert.closeTo(panner.right, expected.right, 0.01)
      assert.equal(panner.azimuthLeft, expected.azimuthLeft)
    }
    let expected: PannerGain

    const context = new AudioContext()
    const panner = context.createPanner()
    const {listener} = context

    // Listener is positioned at (0, 0) - only considering x and y
    listener.setPosition(0, 0, 0)

    // Set listener orientation (facing down the positive y-axis)
    // Forward direction (0, 1, 0), Up direction (0, 0, 1)
    listener.setOrientation(0, 1, 0, 0, 0, 1)

    // Case 1: Panner directly in front of listener (azimuth = 0°)
    panner.setPosition(0, 1, 0)  // Directly in front
    assert.equal(panner.computeAzimuth(), 0)
    expected = {left: 0, right: 1, azimuthLeft: true}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Case 2: Panner right of listener
    panner.setPosition(1, 0, 0)
    assert.equal(panner.computeAzimuth(), 90)
    expected = {left: 0, right: 1, azimuthLeft: false}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Case 3: Panner left of listener
    panner.setPosition(-1, 0, 0)
    assert.equal(panner.computeAzimuth(), -90)
    expected = {left: 1, right: 0, azimuthLeft: true}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Case 4: Panner Diagonal right of listener
    panner.setPosition(1, 1, 0)
    assert.equal(panner.computeAzimuth(), 45)
    expected = {left: 0.707, right: 0.707, azimuthLeft: false}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Case 5: Panner to the diagonal left of the listener
    panner.setPosition(-1, 1, 0)
    assert.equal(panner.computeAzimuth(), -45)
    expected = {left: 0.707, right: 0.707, azimuthLeft: true}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Case 6: Panner at 30 degrees to the right of listener
    panner.setPosition(0.5, 0.866, 0)
    assert.closeTo(panner.computeAzimuth(), 30, 0.01)
    expected = {left: 0.866, right: 0.5, azimuthLeft: false}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Case 7: Panner at 30 degrees to the left of listener
    panner.setPosition(-0.5, 0.866, 0)
    assert.closeTo((panner.computeAzimuth()), -30, 0.01)
    expected = {left: 0.5, right: 0.866, azimuthLeft: true}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Case 8: Panner at 60 degrees to the right of listener
    panner.setPosition(0.866, 0.5, 0)
    assert.closeTo((panner.computeAzimuth()), 60, 0.01)
    expected = {left: 0.5, right: 0.866, azimuthLeft: false}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Case 9: Panner at 30 degrees to the left of listener
    panner.setPosition(-0.866, 0.5, 0)
    assert.closeTo((panner.computeAzimuth()), -60, 0.01)
    expected = {left: 0.866, right: 0.5, azimuthLeft: true}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Case 10: Try one case where panner is behind listener at an angle
    panner.setPosition(-1, -1, 0)
    assert.equal(panner.computeAzimuth(), -135)
    expected = {left: 0.707, right: 0.707, azimuthLeft: true}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Case 11: Panner directly behind listener (azimuth = 180° or -180°)
    panner.setPosition(0, -1, 0)  // Directly behind along the negative y-axis
    const azimuth = panner.computeAzimuth()
    assert.ok(azimuth === 180 || azimuth === -180)  // Either 180 or -180 is valid.
    expected = {left: 0, right: 1, azimuthLeft: true}
    assertPannerGain(panner.computeStereoPanningGain(), expected)

    // Additional orientation test: Change listener orientation to face left
    // Now facing left (forward), up remains (0, 0, 1)
    listener.setOrientation(-1, 0, 0, 0, 0, 1)
    panner.setPosition(-1, 0, 0)
    assert.equal(panner.computeAzimuth(), 0)
    expected = {left: 0, right: 1, azimuthLeft: true}
    assertPannerGain(panner.computeStereoPanningGain(), expected)
  })

  it('panner node computeDistanceGain()', () => {
    const context = new AudioContext()
    const panner = context.createPanner()

    // TODO(divya): add tests for other distance models. inverse is default model.
    panner.distanceModel = 'inverse'
    panner.refDistance = 1  // Reference distance
    panner.rolloffFactor = 1  // Rolloff factor

    // Case 1: Distance is 1 (at refDistance)
    panner.setPosition(1, 0, 0)
    assert.equal(panner.computeDistanceGain(), 1)  // Gain should be 1

    // Case 2: Distance is 2
    panner.setPosition(2, 0, 0)
    const gain2 = 1 / (1 + 1 * (2 - 1))  // 1 / (1 + 1) = 0.5
    assert.equal(panner.computeDistanceGain(), gain2)

    // Case 3: Distance is 0.5 (closer than refDistance)
    panner.setPosition(0.5, 0, 0)
    const gain3 = 1 / (1 + 1 * (1 - 1))  // 1 / 1 = 1
    assert.equal(panner.computeDistanceGain(), gain3)

    // Case 4: Distance is 0 (same as listener position)
    panner.setPosition(0, 0, 0)
    const gain4 = 1 / (1 + 1 * (1 - 1))  // 1 / 1 = 1
    assert.equal(panner.computeDistanceGain(), gain4)

    // Case 5: refDistance = 0 (special case)
    // Gain should always be 0 when refDistance is 0
    panner.refDistance = 0
    assert.equal(panner.computeDistanceGain(), 0)

    // Case 6: Rolloff factor = 2, Distance = 2
    panner.refDistance = 1
    panner.rolloffFactor = 2
    panner.setPosition(2, 0, 0)
    const gain6 = 1 / (1 + 2 * (2 - 1))  // 1 / (1 + 2) = 1 / 3 ≈ 0.333
    assert.equal(panner.computeDistanceGain(), gain6)
  })

  it('panner node computeConeGain()', () => {
    const context = new AudioContext()
    const panner = context.createPanner()

    // Set listener orientation: Facing along +Y axis, Up along +Z axis
    const {listener} = context
    listener.setOrientation(0, 1, 0, 0, 0, 1)  // Forward (0, 1, 0), Up (0, 0, 1)

    // Default: No cone applied, gain is 1
    assert.equal(panner.computeConeGain(), 1)

    // Configure cone properties
    panner.coneInnerAngle = 60
    panner.coneOuterAngle = 120
    panner.coneOuterGain = 0

    // Case 1: Inside inner cone (gain = 1)
    panner.setPosition(0, 2, 0)  // Directly in front of the listener
    panner.setOrientation(0, -1, 0)  // Facing along -Y axis towards listener
    assert.equal(panner.computeConeGain(), 1)

    // Case 2: Outside outer cone (gain = 0)
    panner.setPosition(2, 0, 0)  // Perpendicular to the listener's forward direction
    assert.equal(panner.computeConeGain(), 0)

    // Case 3: Panner t 45° between inner and outer cones (expected gain ≈ 0.75)
    panner.setPosition(0.707, 0.707, 0)  // 45° diagonal
    const x3 = (45 - 30) / (60 - 30)
    const gain3 = (1 - x3) + 0 * x3  // 0.5
    assert.equal(panner.computeConeGain(), gain3)

    // Case 4: Panner just outside the outer cone edge
    panner.setPosition(Math.sin(Math.PI / 3) + 0.001, Math.cos(Math.PI / 3), 0)
    assert.equal(panner.computeConeGain(), 0)  // Past outer cone edge, gain is coneOuterGain (0)

    // Case 5: Panner just inside the inner cone edge
    panner.setPosition(Math.cos(Math.PI / 3), Math.sin(Math.PI / 3) + 0.001, 0)
    assert.equal(panner.computeConeGain(), 1)  // Inside inner cone, gain is 1

    // Case 6: Panner at 45° between inner and outer cones, but panner not facing the listener
    panner.setPosition(0.707, 0.707, 0)  // 45° diagonal
    panner.setOrientation(1, 0, 0)  // Facing along X-axis
    const x6 = (45 - 30) / (60 - 30)
    const gain6 = (1 - x6) + 0 * x6  // 0.5
    assert.closeTo(panner.computeConeGain(), gain6, 0.001)

    // Case 6: Panner directly in front of listener but facing perpendicular
    panner.setPosition(0, 1, 0)
    panner.setOrientation(1, 0, 0)  // Facing along X-axis
    assert.equal(panner.computeConeGain(), 0)  // Past outer cone edge, gain is coneOuterGain (0)
  })
})
