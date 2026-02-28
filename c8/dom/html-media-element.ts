// @sublibrary(:dom-core-lib)
import {HTMLElement} from './html-element'

// This class implements a polyfill for the browser HTMLMediaElement class.
class HTMLMediaElement extends HTMLElement {
  get autoplay(): boolean {
    return this.hasAttribute('autoplay')
  }

  set autoplay(value: boolean) {
    this.setAttribute('autoplay', value.toString())
  }

  get loop(): boolean {
    return this.hasAttribute('loop')
  }

  set loop(value: boolean) {
    if (value) {
      this.setAttribute('loop', '')
    } else {
      this.removeAttribute('loop')
    }
  }

  private _preload: string = 'auto';

  VALID_PRELOAD_VALUES = ['none', 'metadata', 'auto'];

  get preload(): string {
    return this._preload
  }

  set preload(value: string) {
    let newValue = value
    if (!value ||
      !this.VALID_PRELOAD_VALUES.includes(value) ||
      value === '') {
      newValue = 'auto'  // Default to 'auto'
    }
    this._preload = newValue
    this.setAttribute('preload', this._preload)
  }

  private _crossOrigin: string = 'anonymous';

  VALID_CROSSORIGIN_VALUES = ['anonymous', 'use-credentials'];

  get crossOrigin(): string {
    return this._crossOrigin
  }

  set crossOrigin(value: string) {
    let newValue = value
    if (!value ||
      !this.VALID_CROSSORIGIN_VALUES.includes(value) ||
      value === '') {
      newValue = 'anonymous'  // Default to 'anonymous'
    }
    this._crossOrigin = newValue
    this.setAttribute('crossOrigin', this._crossOrigin)
  }

  get src(): string {
    return this.getAttribute('src') || ''
  }

  set src(value: string) {
    this.setAttribute('src', value)
  }

  get volume(): number {
    return parseFloat(this.getAttribute('volume') || '1')
  }

  set volume(value: number) {
    this.setAttribute('volume', value.toString())
  }

  get muted(): boolean {
    return this.hasAttribute('muted')
  }

  set muted(value: boolean) {
    if (value) {
      this.setAttribute('muted', '')
    } else {
      this.removeAttribute('muted')
    }
  }

  get defaultPlaybackRate(): number {
    return parseFloat(this.getAttribute('defaultPlaybackRate') || '1')
  }

  set defaultPlaybackRate(value: number) {
    this.setAttribute('defaultPlaybackRate', value.toString())
  }

  /* eslint-disable class-methods-use-this */
  load() {
    // TODO(dat): Need actual implementation
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/load
  }

  play() {
    // TODO(dat): Need actual implementation
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
    return Promise.resolve()
  }

  pause() {
    // TODO(dat): Need actual implementation
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause
  }
  /* eslint-enable class-methods-use-this */
}

export {HTMLMediaElement}
