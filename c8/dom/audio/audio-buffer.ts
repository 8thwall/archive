// @sublibrary(:audio-lib)
import {DEFAULT_SAMPLE_RATE, NUM_CHANNELS_STEREO} from '../audio-constants'
import type {ChannelCountMode, ChannelInterpretation} from './audio-node'

interface AudioBufferOptions {
  length?: number
  numberOfChannels: number
  sampleRate: number
}

class AudioBuffer {
  _length: number

  _numberOfChannels: number

  _sampleRate: number

  _channelData: Float32Array[] = []

  readonly duration: number  // seconds

  constructor(options?: Partial<AudioBufferOptions>) {
    // TODO(dat): Needs to figure out this number
    this._length = options?.length ?? 22050
    this._numberOfChannels = options?.numberOfChannels ?? NUM_CHANNELS_STEREO
    this._sampleRate = options?.sampleRate ?? DEFAULT_SAMPLE_RATE
    this.duration = this._length / this._sampleRate

    for (let i = 0; i < this._numberOfChannels; i++) {
      this._channelData.push(new Float32Array())
    }
  }

  getChannelData(channel: number): Float32Array {
    return this._channelData[channel]
  }

  setChannelData(channel: number, buffer: Buffer): void {
    const sizeInBytes = buffer.length / 4
    this._channelData[channel] = new Float32Array(buffer.buffer, buffer.byteOffset, sizeInBytes)
  }

  get length() {
    return this._length
  }

  get numberOfChannels() {
    return this._numberOfChannels
  }
}

export {AudioBuffer}
