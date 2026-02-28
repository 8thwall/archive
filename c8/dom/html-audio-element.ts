// @sublibrary(:dom-core-lib)
import type {fetch as fetchType} from 'undici-types'

import {HTMLMediaElement} from './html-media-element'
import {throwIllegalConstructor} from './exception'
import type {Document} from './document'

import type {AudioBuffer} from './audio/audio-buffer'
import {pauseAudio, playAudio, stopAudio, resumeAudio} from './audio/miniaudio'
import {decodeAudioBuffer} from './decode-audio-buffer'
import type {MediaElementAudioSourceNode} from './audio/media-element-audio-source-node'

import {createAudioDecodeCache} from './audio-decode-cache/audio-decode-cache'

import {DOMException} from './dom-exception'

let inFactory = false

const internalStoragePath = (globalThis as any).niaWindowOptions?.internalStoragePath || '/tmp/'
const decodeCache = createAudioDecodeCache(internalStoragePath, decodeAudioBuffer)

class HTMLAudioElement extends HTMLMediaElement {
  _paused: boolean = false

  private _buffer: AudioBuffer | null = null

  public _audioSourceNode: MediaElementAudioSourceNode | null = null

  private _abortController: AbortController | null = null

  private _streamIDs: number[] = []

  constructor(ownerDocument: Document) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, 'audio')
  }

  set src(value: string) {
    super.src = value

    // Abort all previous load requests
    this._abortController?.abort()
    this._abortController = null

    this.loadAudioAsync(value)
  }

  get src() {
    return super.src
  }

  throwAbortError = (signal: AbortSignal) => {
    if (signal.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError')
    }
  }

  loadAudioAsync = async (url: string) => {
    try {
      this._abortController = new AbortController()
      const {signal} = this._abortController

      const fetch = (globalThis as any).fetch as typeof fetchType
      const dest = new URL(url)
      const response = await fetch(dest, {signal})

      if (!response.ok) {
        throw new Error(`${dest.protocol} Error: ${response.status} ${response.statusText}`)
      }

      // Validate MIME type to ensure it's an audio file
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.startsWith('audio/')) {
        return
      }
      // Decode the audio buffer
      const buffer = await response.arrayBuffer()
      this.throwAbortError(signal)
      this._buffer = await decodeCache.decode(url, buffer)
      if (this.autoplay) {
        this.play()
      }
      this.throwAbortError(signal)

      // Dispatch the canplaythrough event when done loading
      this.dispatchEvent(new Event('canplaythrough'))
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error
      }
    }
  }

  finishedCallback = () => {
    this._streamIDs.pop()

    // TODO(divya): Support looping on desktop and tests. For now it is only supported on devices
    // (android and quest). https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/browse/J8W-4195
    if (this.loop) {
      this.play()
    } else {
      this._paused = true
      this.dispatchEvent(new Event('ended'))
    }
  }

  play(): Promise<void> {
    if (this._buffer) {
      if (this._streamIDs.length > 0) {
        for (const streamID of this._streamIDs) {
          resumeAudio(streamID)
        }
      } else if (this._audioSourceNode) {
        // if this audio element is connected to a MediaElementAudioSourceNode, play it through the
        // audio context's graph
        const streamID = this._audioSourceNode.play(this._buffer, this.finishedCallback)
        this._streamIDs.push(streamID)
      // otherwise play as-is
      } else {
        const streamID = playAudio(this._buffer._channelData, 1.0, 0.0, 1.0, true,
          this.finishedCallback)
        this._streamIDs.push(streamID)
      }

      this._paused = false
      this.dispatchEvent(new Event('play'))
    }
    return Promise.resolve()
  }

  load() {
    this.stop()

    // Abort all previous load requests
    this._abortController?.abort()
    this._abortController = null

    const src = this.getAttribute('src')
    if (src) {
      this.loadAudioAsync(src)
    }
  }

  // This does NOT exist in the HTMLMediaElement spec,
  // but is useful for our testing.
  stop() {
    // stop the audio if it's playing
    for (const streamID of this._streamIDs) {
      stopAudio(streamID)
    }
    this._streamIDs = []
  }

  pause() {
    for (const streamID of this._streamIDs) {
      pauseAudio(streamID)
    }
    this._paused = true
  }
}

const createHTMLAudioElement = (ownerDocument: Document): HTMLAudioElement => {
  inFactory = true
  try {
    return new HTMLAudioElement(ownerDocument)
  } finally {
    inFactory = false
  }
}

export {HTMLAudioElement, createHTMLAudioElement}
