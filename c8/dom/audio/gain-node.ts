// @sublibrary(:audio-lib)
import {AudioNode} from './audio-node'
import {AudioParam} from './audio-param'
import type {ChannelCountMode, ChannelInterpretation} from './audio-node'
import type {AudioContext} from './audio-context'

interface GainNodeOptions {
  gain: number
  channelCount: number
  channelCountMode: ChannelCountMode
  channelInterpretation: ChannelInterpretation
}

class GainNode extends AudioNode {
  _gain: AudioParam

  constructor(context: AudioContext, options?: Partial<GainNodeOptions>) {
    super(context)
    this._gain = new AudioParam(options?.gain ?? 1)
    this._channelCount = options?.channelCount ?? 1
    this._channelCountMode = options?.channelCountMode ?? 'max'
    this._channelInterpretation = options?.channelInterpretation ?? 'speakers'
  }

  get gain() {
    return this._gain
  }
}

export {GainNode}
