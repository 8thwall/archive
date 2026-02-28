// @sublibrary(:dom-core-lib)
import {AudioBuffer} from './audio/audio-buffer'
import {decodeAudio} from './audio/miniaudio'

import {DEFAULT_SAMPLE_RATE, NUM_CHANNELS_STEREO} from './audio-constants'

const decodeAudioBuffer = (
  data: ArrayBuffer
): Promise<AudioBuffer> => new Promise((resolve, reject) => {
  decodeAudio(data, DEFAULT_SAMPLE_RATE, (audioBuffer) => {
    if (audioBuffer.error || !audioBuffer.length || !audioBuffer.left || !audioBuffer.right ||
         audioBuffer.numberOfChannels !== NUM_CHANNELS_STEREO) {
      const error = new Error('Failed to decode audio buffer')
      reject(error)
      return
    }

    const audioBufferCopy = new AudioBuffer({
      numberOfChannels: audioBuffer.numberOfChannels,
      length: audioBuffer.length,
      sampleRate: audioBuffer.sampleRate,
    })

    audioBufferCopy.setChannelData(0, audioBuffer.left)
    audioBufferCopy.setChannelData(1, audioBuffer.right)
    resolve(audioBufferCopy)
  })
})

export {
  decodeAudioBuffer,
}
