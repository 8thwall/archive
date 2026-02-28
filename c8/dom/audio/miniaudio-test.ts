// @rule(js_cli)
// @package(npm-rendering)
// @attr(esnext = 1)

// @dep(//c8/dom)
// @dep(//c8/dom:dom-core-lib)
import {playAudio, stopAudio, updateGain} from './miniaudio'

import {generateSampleAudioData} from './test-utils'

const sampleRate = 44100
const durationInSeconds = 2
const frequency = 440  // A4 note, 440Hz (middle A)
const amplitude = 0.5  // 50% volume
const note =
    generateSampleAudioData(sampleRate, durationInSeconds, frequency, amplitude)

const id = playAudio(note, 1.0, 0.0, 1.0, false)  // right side

await new Promise(resolve => setTimeout(resolve, 1000))

updateGain(id, 1.0, 1.0, 0.0, true)  // left side

await new Promise(resolve => setTimeout(resolve, 1000))

stopAudio(id)
