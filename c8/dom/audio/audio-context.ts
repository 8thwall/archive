// @sublibrary(:audio-lib)
import {decodeAudioBuffer} from '../decode-audio-buffer'
import {DEFAULT_SAMPLE_RATE} from '../audio-constants'

import {GainNode} from './gain-node'
import {PannerNode} from './panner-node'
import {AudioListener} from './audio-listener'
import {AudioDestinationNode} from './audio-node'
import {AnalyserNode} from './analyser-node'
import {MediaElementAudioSourceNode} from './media-element-audio-source-node'
import type {HTMLMediaElement} from '../html-media-element'
import type {HTMLAudioElement} from '../html-audio-element'
import type {AudioBuffer} from './audio-buffer'
import {DynamicsCompressorNode} from './dynamics-compressor-node'

interface AudioContextOptions {
  latencyHint: 'balanced' | 'interactive' | 'playback'
  sampleRate: number
  sinkId?: string
}

// Each AudioContext holds a graph of audio nodes and a reference to the listener.
// Currently, the AudioContext only supports the following graph configurations:
// Non-positional
//   MediaElementAudioSourceNode -> GainNode -> GainNode -> AudioDestinationNode
// Positional
//   MediaElementAudioSourceNode -> PannerNode -> GainNode -> GainNode -> AudioDestinationNode
class AudioContext {
  _options: AudioContextOptions

  _listener: AudioListener = new AudioListener()

  _currentTime: number = 0

  _destination: AudioDestinationNode

  // sources to update when the listener moves. not part of dom spec
  _sources: Set<MediaElementAudioSourceNode> = new Set()

  constructor(options?: AudioContextOptions) {
    this._options = {
      latencyHint: 'balanced',
      sampleRate: DEFAULT_SAMPLE_RATE,
      ...options,
    }
    this._destination = new AudioDestinationNode(this)
    this._listener.setContext(this)
  }

  get destination() {
    return this._destination
  }

  createPanner(): PannerNode {
    return new PannerNode(this)
  }

  createGain(): GainNode {
    return new GainNode(this)
  }

  createAnalyzer(): AnalyserNode {
    return new AnalyserNode(this)
  }

  // eslint-disable-next-line class-methods-use-this
  async decodeAudioData(
    data: ArrayBuffer,
    successCallback: (audioBuffer: AudioBuffer) => void,
    errorCallback?: (error: Error) => void
  ): Promise<AudioBuffer> {
    // we inject callbacks into the promise
    const promise = decodeAudioBuffer(data)
    promise.then(
      buffer => successCallback?.(buffer)
    ).catch(
      e => errorCallback?.(e)
    )
    return promise
  }

  createMediaElementSource(mediaElement: HTMLMediaElement): MediaElementAudioSourceNode {
    const node = new MediaElementAudioSourceNode(this, mediaElement)

    // Store the node on the audio element so that we can play it through the audio context's graph
    if (mediaElement.constructor.name === 'HTMLAudioElement') {
      (mediaElement as HTMLAudioElement)._audioSourceNode = node
    }

    this._sources.add(node)
    return node
  }

  createDynamicsCompressor() {
    return new DynamicsCompressorNode(this)
  }

  get listener() {
    return this._listener
  }

  // TODO(divya): https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume
  // eslint-disable-next-line class-methods-use-this
  resume(): Promise<void> {
    return Promise.resolve()
  }
}

export {AudioContext}
