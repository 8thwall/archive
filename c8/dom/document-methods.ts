// @sublibrary(:dom-core-lib)
import type {Document} from './document'
import type {Element} from './element'
import type {HTMLBaseElement} from './html-elements'

import {nodeDocument} from './node-internal'

import {
  renderBlockingElementsSym,
  environmentSettingsSym,
  aboutBaseUrlSym,
} from './document-symbols'

// Use a 30-second render-blocking timeout, aiming for a timeout that major browsers use.
const RENDER_BLOCKING_TIMEOUT = 30000

// A Document document allows adding render-blocking elements if document's content type is
// "text/html" and the body element of document is null.
// See https://html.spec.whatwg.org/multipage/dom.html#render-blocking-mechanism
const documentAllowsAddingRenderBlockingElements =
  (doc: Document): boolean => doc.contentType === 'text/html' && doc.body === null

// A Document document is render-blocked if both of the following are true:
//   - document's render-blocking element set is non-empty, or document allows adding
//   render-blocking elements.
//   - The current high resolution time given document's relevant global object has not exceeded an
//   implementation-defined timeout value.
const documentIsRenderBlocked = (
  doc: Document
): boolean => (doc[renderBlockingElementsSym].size > 0 ||
    documentAllowsAddingRenderBlockingElements(doc)) &&
    (performance.now() - doc[environmentSettingsSym].timeOrigin) < RENDER_BLOCKING_TIMEOUT

// To block rendering on an element el:
const blockRendering = (el: Element): void => {
  // 1. Let document be el's node document.
  const doc = nodeDocument(el)

  // 2. If document allows adding render-blocking elements, then append el to document's
  // render-blocking element set.
  if (documentAllowsAddingRenderBlockingElements(doc)) {
    doc[renderBlockingElementsSym].add(el)
  }
}

// To unblock rendering on an element el:
const unblockRendering = (el: Element): void => {
  // 1. Let document be el's node document.
  const doc = nodeDocument(el)

  // 2. Remove el from document's render-blocking element set.
  doc[renderBlockingElementsSym].delete(el)
}

// An element el is render-blocking if el's node document document is render-blocked, and el is in
// document's render-blocking element set.
const isRenderBlocking = (el: Element): boolean => {
  const doc = nodeDocument(el)
  return documentIsRenderBlocked(doc) && doc[renderBlockingElementsSym].has(el)
}

// See: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#fallback-base-url
const fallbackBaseUrl = (doc: Document): URL => {
  // 1. If document is an iframe srcdoc document, then:
  if (doc.URL === 'about:srcdoc') {
    // 1. Assert: document's about base URL is non-null.
    if (doc[aboutBaseUrlSym] === null) {
      throw new Error('about base URL must be non-null')
    }
    return doc[aboutBaseUrlSym]
  }

  // 2. If document's URL matches about:blank and document's about base URL is non-null, then return
  // document's about base URL.
  if (doc.URL === 'about:blank' && doc[aboutBaseUrlSym] !== null) {
    return doc[aboutBaseUrlSym]
  }

  // 3. Return document's URL.
  return new URL(doc.URL)
}

// See: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#document-base-url
const documentBaseUrl = (doc: Document): URL => {
  // 1. If there is no base element that has an href attribute in the Document, then return the
  // Document's fallback base URL.
  const base = doc.querySelector('base[href]') as HTMLBaseElement | null
  if (base === null) {
    return fallbackBaseUrl(doc)
  }

  // 2. Otherwise, return the frozen base URL of the first base element in the Document that has an
  // href attribute, in tree order.
  // [NOT IMPLEMENTED] Frozen href logic.
  // See: https://html.spec.whatwg.org/multipage/semantics.html#frozen-base-url
  return /* base.href */ new URL(base.getAttribute('href')!)
}

export {
  documentIsRenderBlocked,
  documentBaseUrl,
  blockRendering,
  unblockRendering,
  isRenderBlocking,
}
