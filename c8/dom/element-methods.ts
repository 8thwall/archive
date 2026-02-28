// @sublibrary(:dom-core-lib)
import type {Element} from './element'
import {implicitlyPotentiallyRenderBlockingSym} from './element-symbols'

// The blocking tokens set for an element el are the result of the following steps:
// See: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#blocking-attributes
const elementBlockingTokens = (el: Element): Set<string> => {
  // 1. Let value be the value of el's blocking attribute, or the empty string
  // if no such attribute exists.
  let value = el.getAttribute('blocking') || ''

  // 2. Set value to value, converted to ASCII lowercase.
  value = value.toLowerCase()

  // 3. Let rawTokens be the result of splitting value on ASCII whitespace.
  const rawTokens = value.split(/\s+/)

  // 4. Return a set containing the elements of rawTokens that are possible
  // blocking tokens. Note: In the future, there might be more possible blocking
  // tokens.
  return new Set(rawTokens.filter(token => ['render'].includes(token)))
}

// An element is potentially render-blocking if its blocking tokens set contains
// "render", or if it is implicitly potentially render-blocking.
// See: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#blocking-attributes
const elementPotentiallyRenderBlocking = (
  el: Element
): boolean => elementBlockingTokens(el).has('render') ||
  el[implicitlyPotentiallyRenderBlockingSym]()

export {elementPotentiallyRenderBlocking, elementBlockingTokens}
