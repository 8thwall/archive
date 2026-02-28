// @sublibrary(:dom-core-lib)
import type {Document} from './document'
import {HTMLElement} from './html-element'
import {throwIllegalConstructor} from './exception'

let inFactory = false

// This class implements a polyfill for the browser HTMLMetaElement class.
class HTMLMetaElement extends HTMLElement {
  constructor(ownerDocument: Document) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, 'meta')
  }

  get name(): string {
    return this.getAttribute('name') || ''
  }

  set name(value: string) {
    this.setAttribute('name', value)
  }

  get httpEquiv(): string {
    return this.getAttribute('http-equiv') || ''
  }

  set httpEquiv(value: string) {
    this.setAttribute('http-equiv', value)
  }

  get content(): string {
    return this.getAttribute('content') || ''
  }

  set content(value: string) {
    this.setAttribute('content', value)
  }

  get media(): string {
    return this.getAttribute('media') || ''
  }

  set media(value: string) {
    this.setAttribute('media', value)
  }
}

const createHTMLMetaElement = (ownerDocument: Document): HTMLMetaElement => {
  inFactory = true
  try {
    return new HTMLMetaElement(ownerDocument)
  } finally {
    inFactory = false
  }
}

export {HTMLMetaElement, createHTMLMetaElement}
