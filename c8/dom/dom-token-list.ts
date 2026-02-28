// @sublibrary(:dom-core-lib)
import type {DOMString} from './strings'
import {DOMException} from './dom-exception'
import type {Element} from './element'
import {ASCII_WHITESPACE} from './ordered-set'

import {throwIllegalConstructor} from './exception'
import {
  addDomTokenListAttributeChangeSteps,
  domTokenListStateMap,
  domTokenListInit,
  getDomTokenListState,
  domTokenListUpdateSteps,
  domTokenListValidationSteps,
  domTokenListSerializeSteps,
} from './dom-token-list-internal'
import {
  appendToOrderedSet,
  replaceWithinOrderedSet,
} from './ordered-set'
import {setAttributeValue} from './element-internal'

let inFactory = false

// The object’s supported property indices are the numbers in the range zero to object’s token set’s
// size minus one, unless token set is empty, in which case there are no supported property indices.
const getSupportedPropertyIndices = (
  length: number
): string[] => Array.from(Array(length).keys(), i => i.toString())

const propIsSupportedIndex = (
  prop: string | symbol,
  length: number
): prop is string => getSupportedPropertyIndices(length).some(index => index === prop)

class DOMTokenList {
  /* eslint-disable no-undef */
  [index: number]: string
  /* eslint-enable no-undef */

  constructor(el: Element, localName: DOMString, supportedTokens?: Set<DOMString>) {
    if (!inFactory) {
      throwIllegalConstructor()
    }

    const state = {
      tokens: new Set<DOMString>(),
      element: el,
      localName,
      supportedTokens: supportedTokens ?? null,
    }

    // Initialize the DOMTokenList state.
    domTokenListStateMap.set(this, state)

    // Add the attribute change steps for the associated element.
    addDomTokenListAttributeChangeSteps(this)

    // Initialize the DOMTokenList object, which runs the attribute change steps.
    domTokenListInit(this)

    const proxy = new Proxy(this, {
      ownKeys: (target) => {
        const {length} = target
        return [
          ...getSupportedPropertyIndices(length),
          ...Object.getOwnPropertyNames(target),
          ...Object.getOwnPropertySymbols(target),
        ]
      },
      getOwnPropertyDescriptor: (target, prop) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, prop)
        if (descriptor !== undefined) {
          return descriptor
        }
        if (propIsSupportedIndex(prop, target.length)) {
          return {
            value: target.item(Number(prop)),
            writable: false,
            enumerable: true,
            configurable: true,
          }
        }
        return undefined
      },
      has: (target, prop) => {
        const result = Reflect.has(target, prop)
        return result || propIsSupportedIndex(prop, target.length)
      },
      get: (target, prop, receiver) => {
        const result = Reflect.get(target, prop, receiver)
        if (result !== undefined) {
          return result
        }
        if (propIsSupportedIndex(prop, target.length)) {
          return target.item.call(receiver, Number(prop))
        }
        return undefined
      },
      set: (target, prop, value, receiver) => {
        if (propIsSupportedIndex(prop, target.length)) {
          return true
        }
        return Reflect.set(target, prop, value, receiver)
      },
    })
    // Also add a weak reference to the state map from the proxy.
    domTokenListStateMap.set(proxy, state)
    return proxy
  }

  // The length attribute' getter must return this’s token set’s size.
  // See: https://dom.spec.whatwg.org/#dom-domtokenlist-length
  get length(): number {
    return getDomTokenListState(this).tokens.size
  }

  // The item(index) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-domtokenlist-item
  item(index: number): DOMString | null {
    // If index is equal to or greater than this’s token set’s size, then return null.
    if (index >= this.length) {
      return null
    }

    // Return this’s token set[index].
    return Array.from(getDomTokenListState(this).tokens)[index] ?? null
  }

  // The contains(token) method steps are to return true if this’s token set[token] exists;
  // otherwise false.
  // See: https://dom.spec.whatwg.org/#dom-domtokenlist-contains
  contains(token: DOMString): boolean {
    return getDomTokenListState(this).tokens.has(token)
  }

  // The add(tokens…) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-domtokenlist-add
  add(...tokens: DOMString[]): void {
    // 1. For each token in tokens:
    tokens.forEach((token) => {
      // 1. If token is the empty string, then throw a "SyntaxError" DOMException.
      if (token === '') {
        throw new DOMException('The token provided must not be empty.', 'SyntaxError')
      }

      // 2. If token contains any ASCII whitespace, then throw an "InvalidCharacterError"
      // DOMException.
      if (ASCII_WHITESPACE.test(token)) {
        throw new DOMException(
          'The token provided must not contain ASCII whitespace.',
          'InvalidCharacterError'
        )
      }
    })

    // 2. For each token in tokens, append token to this’s token set.
    const tokenSet = getDomTokenListState(this).tokens
    tokens.forEach(token => appendToOrderedSet(tokenSet, token))

    // 3. Run the update steps.
    domTokenListUpdateSteps(this)
  }

  // The remove(tokens…) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-domtokenlist-remove
  remove(...tokens: DOMString[]): void {
    // 1. For each token in tokens:
    tokens.forEach((token) => {
      // 1. If token is the empty string, then throw a "SyntaxError" DOMException.
      if (token === '') {
        throw new DOMException('The token provided must not be empty.', 'SyntaxError')
      }

      // 2. If token contains any ASCII whitespace, then throw an "InvalidCharacterError"
      // DOMException.
      if (ASCII_WHITESPACE.test(token)) {
        throw new DOMException(
          'The token provided must not contain ASCII whitespace.',
          'InvalidCharacterError'
        )
      }
    })

    // 2. For each token in tokens, remove token from this’s token set.
    const tokenSet = getDomTokenListState(this).tokens
    tokens.forEach(token => tokenSet.delete(token))

    // 3. Run the update steps.
    domTokenListUpdateSteps(this)
  }

  // The toggle(token, force) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-domtokenlist-toggle
  toggle(token: DOMString, force?: boolean): boolean {
    // 1. If token is the empty string, then throw a "SyntaxError" DOMException.
    if (token === '') {
      throw new DOMException('The token provided must not be empty.', 'SyntaxError')
    }

    // 2. If token contains any ASCII whitespace, then throw an "InvalidCharacterError"
    // DOMException.
    if (ASCII_WHITESPACE.test(token)) {
      throw new DOMException(
        'The token provided must not contain ASCII whitespace.',
        'InvalidCharacterError'
      )
    }

    // 3. If this’s token set[token] exists, then:
    const tokenSet = getDomTokenListState(this).tokens
    if (tokenSet.has(token)) {
      // 1. If force is either not given or is false, then remove token from this’s token set, run
      // the update steps and return false.
      if (force === undefined || force === false) {
        tokenSet.delete(token)
        domTokenListUpdateSteps(this)
        return false
      }

      // 2. Return true.
      return true
    }

    // 4. Otherwise, if force not given or is true, append token to this’s token set, run the update
    // steps, and return true.
    if (force === undefined || force === true) {
      appendToOrderedSet(tokenSet, token)
      domTokenListUpdateSteps(this)
      return true
    }

    // 5. Return false.
    return false
  }

  // The replace(token, newToken) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-domtokenlist-replace
  replace(token: DOMString, newToken: DOMString): boolean {
    // 1. If either token or newToken is the empty string, then throw a "SyntaxError" DOMException.
    if (token === '' || newToken === '') {
      throw new DOMException('The token provided must not be empty.', 'SyntaxError')
    }

    // 2. If either token or newToken contains any ASCII whitespace, then throw an
    // "InvalidCharacterError" DOMException.
    if (ASCII_WHITESPACE.test(token) || ASCII_WHITESPACE.test(newToken)) {
      throw new DOMException(
        'The token provided must not contain ASCII whitespace.',
        'InvalidCharacterError'
      )
    }

    // 3. If this’s token set does not contain token, then return false.
    const tokenSet = getDomTokenListState(this).tokens
    if (!tokenSet.has(token)) {
      return false
    }

    // 4. Replace token in this’s token set with newToken.
    replaceWithinOrderedSet(tokenSet, token, newToken)

    // 5. Run the update steps.
    domTokenListUpdateSteps(this)

    // 6. Return true.
    return true
  }

  // The supports(token) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-domtokenlist-supports
  supports(token: DOMString): boolean {
    // 1. Let result be the return value of validation steps called with token.
    const result = domTokenListValidationSteps(this, token)

    // 2. Return result.
    return result
  }

  // The value attribute must return the result of running this’s serialize steps.
  // See: https://dom.spec.whatwg.org/#dom-domtokenlist-value
  get value(): DOMString {
    return domTokenListSerializeSteps(this)
  }

  // Setting the value attribute must set an attribute value for the associated element using
  // associated attribute’s local name and the given value.
  set value(value: DOMString) {
    const state = getDomTokenListState(this)
    setAttributeValue(state.element, state.localName, value)
  }

  keys(): IterableIterator<number> {
    const tokenSetLength = getDomTokenListState(this).tokens.size
    return Array(tokenSetLength).keys()
  }

  values(): IterableIterator<DOMString> {
    return getDomTokenListState(this).tokens.values()
  }

  * entries(): IterableIterator<[number, DOMString]> {
    const tokenSet = getDomTokenListState(this).tokens
    let idx = 0
    for (const token of tokenSet.values()) {
      yield [idx++, token]
    }
  }

  forEach(
    callback: (
      currentValue: DOMString,
      currentIndex: number,
      listObj: any[]) => void,
    thisArg?: any
  ): void {
    Array.from(getDomTokenListState(this).tokens).forEach(callback, thisArg)
  }

  [Symbol.iterator](): IterableIterator<DOMString> {
    return getDomTokenListState(this).tokens[Symbol.iterator]()
  }
}

const createDOMTokenList = (
  el: Element,
  localName: DOMString,
  supportedTokens?: Set<DOMString>
): DOMTokenList => {
  inFactory = true
  try {
    return new DOMTokenList(el, localName, supportedTokens)
  } finally {
    inFactory = false
  }
}

export {DOMTokenList, createDOMTokenList}
