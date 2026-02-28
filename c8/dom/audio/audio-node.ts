// @sublibrary(:audio-lib)
import type {AudioContext} from './audio-context'

type ChannelCountMode = 'max' | 'clamped-max' | 'explicit'
type ChannelInterpretation = 'speakers' | 'discrete'

class AudioNode {
  readonly _context: AudioContext

  protected _channelCount: number = 1

  protected _channelCountMode: ChannelCountMode = 'max'

  protected _channelInterpretation: ChannelInterpretation = 'speakers'

  readonly _sources: Set<AudioNode> = new Set([])

  readonly _destination: Set<AudioNode> = new Set([])

  get numberOfInputs() {
    return this._sources.size
  }

  get numberOfOutputs() {
    return this._destination.size
  }

  get context() {
    return this._context
  }

  get channelCount() {
    return this._channelCount
  }

  set channelCount(channelCount: number) {
    this._channelCount = channelCount
  }

  get channelCountMode() {
    return this._channelCountMode
  }

  set channelCountMode(channelCountMode: ChannelCountMode) {
    this._channelCountMode = channelCountMode
  }

  get channelInterpretation() {
    return this._channelInterpretation
  }

  set channelInterpretation(channelInterpretation: ChannelInterpretation) {
    this._channelInterpretation = channelInterpretation
  }

  constructor(context: AudioContext) {
    this._context = context
  }

  connect(destination: AudioNode) {
    this._destination.add(destination)
    destination._sources.add(this)
  }

  disconnect(destination?: AudioNode) {
    if (destination) {
      this._destination.delete(destination)
    } else {
      this._destination.clear()
    }
  }
}

class AudioDestinationNode extends AudioNode {
  public maxChannelCount: number = 2
}

export {AudioNode, AudioDestinationNode}
export type {ChannelCountMode, ChannelInterpretation}
