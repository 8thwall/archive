// @sublibrary(:dom-core-lib)
import type {DOMTokenList} from './dom-token-list'
import type {DOMString} from './strings'
import type {Element} from './element'
import {
  getAttributeValue,
  setAttributeValue,
} from './element-internal'
import {
  runAttributeChangeSteps,
  addAttributeChangeSteps,
} from './attribute-change-steps'
import {orderedSetSerializer, orderedSetParser} from './ordered-set'

interface DOMTokenListState {
  // A DOMTokenList object has an associated token set (a set), which is initially empty.
  // See: https://dom.spec.whatwg.org/#concept-dtl-tokens
  tokens: Set<DOMString>,
  // A DOMTokenList object also has an associated element and an attribute’s local name.
  element: Element,
  localName: DOMString,
  // Specifications may define supported tokens for a DOMTokenList's associated attribute’s local
  // name.
  // See: https://dom.spec.whatwg.org/#concept-dtl-supported-tokens
  supportedTokens: Set<DOMString> | null,
}

const domTokenListStateMap = new WeakMap<DOMTokenList, DOMTokenListState>()
const getDomTokenListState = (
  domTokenList: DOMTokenList
): DOMTokenListState => domTokenListStateMap.get(domTokenList)!

// A DOMTokenList object’s validation steps for a given token are:
// See: https://dom.spec.whatwg.org/#concept-domtokenlist-validation
const domTokenListValidationSteps = (dtl: DOMTokenList, token: DOMString): boolean => {
  const state = getDomTokenListState(dtl)
  // 1. If the associated attribute’s local name does not define supported tokens, throw a
  // TypeError.
  if (state.supportedTokens === null) {
    throw new TypeError('DOMTokenList has no supported tokens')
  }

  // 2. Let lowercase token be a copy of token, in ASCII lowercase.
  const lowercase = token.toLowerCase()

  // 3. If lowercase token is present in supported tokens, return true.
  if (state.supportedTokens.has(lowercase)) {
    return true
  }

  // 4. Return false.
  return false
}

// A DOMTokenList object’s update steps are:
// See: https://dom.spec.whatwg.org/#concept-dtl-update
const domTokenListUpdateSteps = (dtl: DOMTokenList): void => {
  const state = getDomTokenListState(dtl)
  // 1. If the associated element does not have an associated attribute and token set is empty, then
  // return.
  if (!state.element.hasAttribute(state.localName) && state.tokens.size === 0) {
    return
  }

  // 2. Set an attribute value for the associated element using associated attribute’s local name
  // and the result of running the ordered set serializer for token set.
  setAttributeValue(state.element, state.localName, orderedSetSerializer(state.tokens))
}

// A DOMTokenList object’s serialize steps are to return the result of running get an attribute
// value given the associated element and the associated attribute’s local name.
const domTokenListSerializeSteps = (dtl: DOMTokenList): DOMString => {
  const state = getDomTokenListState(dtl)
  return getAttributeValue(state.element, state.localName)
}

// A DOMTokenList object has these attribute change steps for its associated element:
const addDomTokenListAttributeChangeSteps = (dtl: DOMTokenList): void => {
  const dtlState = getDomTokenListState(dtl)
  addAttributeChangeSteps(dtlState.element, (
    _element: Element,
    localName: string,
    _oldValue: string | null,
    value: string | null,
    namespace: string | null
  ): void => {
    // 1. If localName is associated attribute’s local name, namespace is null, and value is null,
    // then empty token set.
    // 2. Otherwise, if localName is associated attribute’s local name, namespace is null, then set
    // token set to value, parsed.
    if (localName === dtlState.localName && namespace === null) {
      if (value === null) {
        dtlState.tokens.clear()
      } else {
        dtlState.tokens = orderedSetParser(value)
      }
    }
  })
}

// When a DOMTokenList object is created, then:
const domTokenListInit = (dtl: DOMTokenList) => {
  const state = getDomTokenListState(dtl)
  // 1. Let element be associated element.
  const {element} = state

  // 2. Let localName be associated attribute’s local name.
  const {localName} = state

  // 3. Let value be the result of getting an attribute value given element and localName.
  const value = getAttributeValue(element, localName)

  // 4. Run the attribute change steps for element, localName, value, value, and null.
  runAttributeChangeSteps(element, localName, value, value, null)
}

export {
  DOMTokenListState,
  domTokenListStateMap,
  getDomTokenListState,
  domTokenListUpdateSteps,
  domTokenListSerializeSteps,
  addDomTokenListAttributeChangeSteps,
  domTokenListValidationSteps,
  domTokenListInit,
}
