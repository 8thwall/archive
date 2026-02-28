// @sublibrary(:dom-core-lib)
/* eslint-disable import/no-unresolved */
// @ts-ignore
import URLParse from 'url-parse'
/* eslint-enable import/no-unresolved */

import {throwIllegalConstructor} from './exception'
import type {USVString} from './strings'

let inFactory = false

type LocationCallback = (href: USVString) => Promise<void>

class Location {
  readonly _url: URLParse

  readonly _urlUpdatedCallback: LocationCallback

  constructor(callback: LocationCallback, initialUrl: string) {
    if (!inFactory) {
      throwIllegalConstructor()
    }

    Object.defineProperty(this, '_url', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: new URLParse(initialUrl),
    })

    Object.defineProperty(this, '_urlUpdatedCallback', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: callback,
    })
  }

  get href(): USVString {
    return this._url.href
  }

  set href(value: USVString) {
    this._url.href = value
    this._urlUpdatedCallback(this._url.href)
  }

  get protocol(): USVString {
    return this._url.protocol
  }

  set protocol(value: USVString) {
    this._url.set('protocol', value)
    this._urlUpdatedCallback(this._url.href)
  }

  get host(): USVString {
    return this._url.host
  }

  set host(value: USVString) {
    this._url.set('host', value)
    this._urlUpdatedCallback(this._url.href)
  }

  get hostname(): USVString {
    return this._url.hostname
  }

  set hostname(value: USVString) {
    this._url.set('hostname', value)
    this._urlUpdatedCallback(this._url.href)
  }

  get port(): USVString {
    return this._url.port
  }

  set port(value: USVString) {
    this._url.set('port', value)
    this._urlUpdatedCallback(this._url.href)
  }

  get pathname(): USVString {
    return this._url.pathname
  }

  set pathname(value: USVString) {
    this._url.set('pathname', value)
    this._urlUpdatedCallback(this._url.href)
  }

  get search(): USVString {
    return this._url.query
  }

  set search(value: USVString) {
    this._url.set('query', value)
    this._urlUpdatedCallback(this._url.href)
  }

  get hash(): USVString {
    return this._url.hash
  }

  set hash(value: USVString) {
    this._url.set('hash', value)
  }

  get origin(): USVString {
    return this._url.origin
  }

  assign(url: USVString): void {
    this._url.set('pathname', url)
    this._urlUpdatedCallback(this._url.href)
  }

  reload(): void {
    this._urlUpdatedCallback(this._url.href)
  }

  replace(url: USVString): void {
    this._url.set('pathname', url)
    this._urlUpdatedCallback(this._url.href)
  }

  toString(): USVString {
    return this._url.toString()
  }
}

const createLocation = (callback: LocationCallback, url: string = 'about:blank') => {
  inFactory = true
  try {
    return new Location(callback, url)
  } finally {
    inFactory = false
  }
}

export {Location, createLocation}
