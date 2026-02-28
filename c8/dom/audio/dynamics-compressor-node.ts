// @sublibrary(:audio-lib)
import {AudioNode} from './audio-node'
import {AudioParam} from './audio-param'
import type {AudioContext} from './audio-context'

interface DynamicCompressorNodeOptions {
  threshold: number
  knee: number
  ratio: number
  reduction: number
  attack: number
  release: number
}

class DynamicsCompressorNode extends AudioNode {
  threshold: AudioParam

  knee: AudioParam

  ratio: AudioParam

  reduction: number

  attack: AudioParam

  release: AudioParam

  constructor(context: AudioContext, options?: Partial<DynamicCompressorNodeOptions>) {
    super(context)
    this.threshold = new AudioParam(options?.threshold ?? -24)
    this.knee = new AudioParam(options?.knee ?? 30)
    this.ratio = new AudioParam(options?.ratio ?? 12)
    this.reduction = options?.reduction ?? 0
    this.attack = new AudioParam(options?.attack ?? 0.003)
    this.release = new AudioParam(options?.release ?? 0.25)
  }
}

export {DynamicsCompressorNode}
