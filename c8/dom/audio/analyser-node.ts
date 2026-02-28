// @sublibrary(:audio-lib)
import {AudioNode} from './audio-node'
import type {AudioContext} from './audio-context'
import type {ChannelCountMode, ChannelInterpretation} from './audio-node'

interface AnalyserNodeOptions {
  fftSize: number
  minDecibels: number
  maxDecibels: number
  smoothingTimeConstant: number
  channelCount: number
  channelCountMode: ChannelCountMode
  channelInterpretation: ChannelInterpretation
}

class AnalyserNode extends AudioNode {
  private _fftSize: number

  private _minDecibels: number

  private _maxDecibels: number

  private _smoothingTimeConstant: number

  private _frequencyBinCount: number

  constructor(context: AudioContext, options?: Partial<AnalyserNodeOptions>) {
    super(context)
    this._fftSize = options?.fftSize ?? 2048
    this._minDecibels = options?.minDecibels ?? -100
    this._maxDecibels = options?.maxDecibels ?? -30
    this._smoothingTimeConstant = options?.smoothingTimeConstant ?? 0.8
  }

  get fftSize() {
    return this._fftSize
  }

  get minDecibels() {
    return this._minDecibels
  }

  get maxDecibels() {
    return this._maxDecibels
  }

  get smoothingTimeConstant() {
    return this._smoothingTimeConstant
  }

  get frequencyBinCount() {
    return this._frequencyBinCount
  }

  getByteFrequencyData(array: Uint8Array) {
    // copy current frequency data into array
  }
}

export {AnalyserNode}
