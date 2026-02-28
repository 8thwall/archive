// Minimal shim interface for XMLHttpRequest to support the subset of
// functionality needed to run webgl conformance tests locally.
interface XMLHttpRequest extends EventTarget {
  readonly UNSENT: 0

  readonly OPENED: 1

  readonly HEADERS_RECEIVED: 2

  readonly LOADING: 3

  readonly DONE: 4

  onload: ((ev: Event) => any) | null

  onerror: ((ev: Event) => any) | null

  onreadystatechange: ((ev: Event) => any) | null

  overrideMimeType(mimeType: string): void

  readonly readyState: number

  readonly responseText: string

  readonly status: number

  open(method: string, href: string, async: boolean): void

  send(): void
}

declare const XMLHttpRequest: {  // eslint-disable-line no-redeclare
  prototype: XMLHttpRequest
  new(): XMLHttpRequest
  readonly UNSENT: 0
  readonly OPENED: 1
  readonly HEADERS_RECEIVED: 2
  readonly LOADING: 3
  readonly DONE: 4
}

export {XMLHttpRequest}
