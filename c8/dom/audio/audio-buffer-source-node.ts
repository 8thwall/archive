// @sublibrary(:audio-lib)
import {AudioScheduledSourceNode} from './audio-scheduled-source-node'
import {AudioParam} from './audio-param'
import {AudioBuffer} from './audio-buffer'
import type {AudioContext} from './audio-context'
import {playAudio, stopAudio} from './miniaudio'

interface AudioBufferSourceNodeOptions {
  buffer: AudioBuffer
  detune: number
  loop: boolean
  loopEnd: number
  loopStart: number
  playbackRate: number
}

class AudioBufferSourceNode extends AudioScheduledSourceNode {
  public buffer: AudioBuffer

  _detune: AudioParam

  _loop: boolean

  _loopEnd: number

  _loopStart: number

  _playbackRate: AudioParam

  _streamIDs: number[] = []

  constructor(context: AudioContext, options?: Partial<AudioBufferSourceNodeOptions>) {
    super(context)
    this.buffer = options?.buffer ?? new AudioBuffer()
    this._detune = new AudioParam(options?.detune ?? 0)
    this._loop = options?.loop ?? false
    this._loopEnd = options?.loopEnd ?? 0
    this._loopStart = options?.loopStart ?? 0
    this._playbackRate = new AudioParam(options?.playbackRate ?? 1)
  }

  start(when: number, offset = 0, duration = 0) {
    if (this.buffer) {
      // TODO(divya): take into account playbackRate?
      const streamID = playAudio(this.buffer._channelData)
      this._streamIDs.push(streamID)
    }
  }

  stop() {
    for (const streamID of this._streamIDs) {
      stopAudio(streamID)
    }
    this._streamIDs = []
  }

  get playbackRate() { return this._playbackRate }
}

export {AudioBufferSourceNode}
