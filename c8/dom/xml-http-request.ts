// @attr(esnext = 1)
// @attr(target = "node")
// @package(npm-rendering)
import type fsType from 'fs'

import type {fetch as fetchType} from 'undici-types'

// @dep(:dom-core-types)

// @inliner-skip-next
import type {XMLHttpRequest as XMLHttpRequestType} from '@nia/c8/dom/dom-core'

 type URLType = typeof URL

// Returns a minimal shim for XMLHttpRequest to support the subset of
// functionality needed to run webgl conformance tests locally.
const createXmlHttpRequestClass = (
  URL: URLType, fetch: typeof fetchType, fs: typeof fsType
) => class XMLHttpRequest extends EventTarget implements XMLHttpRequestType {
  static readonly UNSENT = 0

  static readonly OPENED = 1

  static readonly HEADERS_RECEIVED = 2

  static readonly LOADING = 3

  static readonly DONE = 4

  readonly UNSENT = 0

  readonly OPENED = 1

  readonly HEADERS_RECEIVED = 2

  readonly LOADING = 3

  readonly DONE = 4

  _onload: ((ev: Event) => any) | null

  _onerror: ((ev: Event) => any) | null

  _onreadystatechange: ((ev: Event) => any) | null

  private _async: boolean

  private _url: URL

  private _readyState: number

  private _responseText: string

  private _status: number

  constructor() {
    super()
    this._responseText = ''
    this._async = true
    this._readyState = XMLHttpRequest.UNSENT
    this._status = 0
    this.onreadystatechange = null
    this.onload = null
    this.onerror = null
  }

  get onload(): ((ev: Event) => any) | null {
    return this._onload
  }

  set onload(value: ((ev: Event) => any) | null) {
    if (this._onload) {
      this.removeEventListener('load', this._onload)
    }
    if (value) {
      this.addEventListener('load', value)
    }
    this._onload = value
  }

  get onerror(): ((ev: Event) => any) | null {
    return this._onerror
  }

  set onerror(value: ((ev: Event) => any) | null) {
    if (this._onerror) {
      this.removeEventListener('error', this._onerror)
    }
    if (value) {
      this.addEventListener('error', value)
    }
    this._onerror = value
  }

  get onreadystatechange(): ((ev: Event) => any) | null {
    return this._onreadystatechange
  }

  set onreadystatechange(value: ((ev: Event) => any) | null) {
    if (this._onreadystatechange) {
      this.removeEventListener('readystatechange', this._onreadystatechange)
    }
    if (value) {
      this.addEventListener('readystatechange', value)
    }
    this._onreadystatechange = value
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  overrideMimeType(mimeType: string): void {}

  get readyState(): number {
    return this._readyState
  }

  get responseText(): string {
    return this._responseText
  }

  get status(): number {
    return this._status
  }

  open(method: string, href: string, async: boolean): void {
    if (method !== 'GET') {
      throw new Error('Only GET method is supported')
    }
    if (this._readyState !== XMLHttpRequest.UNSENT &&
            this._readyState !== XMLHttpRequest.DONE) {
      throw new Error('Request is already in progress')
    }
    const url = new URL(href)
    if (!async && url.protocol !== 'file:') {
      throw new Error('Only file requests are supported in synchronous mode')
    }
    this._async = async
    this._url = url
    this._status = 0
    this._responseText = ''
    this._readyState = XMLHttpRequest.OPENED
    this.dispatchEvent(new Event('readystatechange'))
  }

  send(): void {
    if (this._readyState !== XMLHttpRequest.OPENED) {
      throw new Error('Request has not been opened')
    }
    if (!this._async) {
      try {
        this._responseText = fs.readFileSync(this._url.pathname, 'utf8')
      } catch (e) {
        this._readyState = XMLHttpRequest.DONE
        throw e
      }
      this._readyState = XMLHttpRequest.DONE
      this.dispatchEvent(new Event('readystatechange'))
      this.dispatchEvent(new Event('load'))
    } else {
      let fetchPromise
      if (this._url.protocol === 'file:') {
        fetchPromise = fs.promises.readFile(this._url.pathname, 'utf8')
      } else {
        fetchPromise = fetch(this._url).then((response) => {
          this._status = response.status
          return response.text()
        })
      }
      fetchPromise.then((text) => {
        this._responseText = text
        this._readyState = XMLHttpRequest.DONE
        this.dispatchEvent(new Event('readystatechange'))
        this.dispatchEvent(new Event('load'))
      }).catch(() => {
        this._readyState = XMLHttpRequest.DONE
        this.dispatchEvent(new Event('readystatechange'))
        // eslint-disable-next-line no-console
        console.error(
          `Failed to execute 'send' on 'XMLHttpRequest': Failed to load '${this._url.href}'`
        )
        this.dispatchEvent(new Event('error'))
      })
    }
  }
}

export {createXmlHttpRequestClass}
