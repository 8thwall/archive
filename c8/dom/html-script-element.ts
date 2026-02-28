// @sublibrary(:dom-core-lib)
import type {CorsSettingAttributeKeyword} from './cors'
import type {DOMString, USVString} from './strings'
import {implicitlyPotentiallyRenderBlockingSym} from './element-symbols'
import type {Element} from './element'
import {HTMLElement} from './html-element'
import {throwIllegalConstructor} from './exception'
import type {ReferrerPolicy} from './referrer-policy'
import type {ImportMapParseResult} from './import-map'
import type {Document} from './document'
import {Node} from './node'
import type {Script} from './script'
import {
  parserDocumentSym,
  preparationDocumentSym,
  forceAsyncSym,
  fromExternalFileSym,
  readyToBeParserExecutedSym,
  alreadyStartedSym,
  delayingTheLoadEventSym,
  typeSym,
  resultSym,
  stepsToRunWhenReadySym,
} from './html-script-element-symbols'
import {addAttributeChangeSteps} from './attribute-change-steps'
import {postConnectionStepsMap} from './node-internal'

let inFactory = false

// This class implements a polyfill for the browser HTMLScriptElement class.
class HTMLScriptElement extends HTMLElement {
  // See: https://html.spec.whatwg.org/multipage/scripting.html#script-processing-model

  // A script element has a parser document, which is either null or a Document,
  // initially null. It is set by the HTML parser and the XML parser on script
  // elements they insert, and affects the processing of those elements. script
  // elements with non-null parser documents are known as parser-inserted.
  [parserDocumentSym]: Document | null = null

  // A script element has a preparation-time document, which is either null or a
  // Document, initially null. It is used to prevent scripts that move between
  // documents during preparation from executing.
  ;

  [preparationDocumentSym]: Document | null = null

  // A script element has a force async boolean, initially true. It is set to
  // false by the HTML parser and the XML parser on script elements they insert,
  // and when the element gets an async content attribute added.
  ;

  [forceAsyncSym]: boolean = true

  // A script element has a from an external file boolean, initially false. It
  // is determined when the script is prepared, based on the src attribute of
  // the element at that time.
  ;

  [fromExternalFileSym]: boolean = false

  // A script element has a ready to be parser-executed boolean, initially
  // false. This is used only used for elements that are also parser-inserted,
  // to let the parser know when to execute the script.
  ;

  [readyToBeParserExecutedSym]: boolean = false

  // A script element has an already started boolean, initially false.
  ;

  [alreadyStartedSym]: boolean = false

  // A script element has a delaying the load event boolean, initially false.
  ;

  [delayingTheLoadEventSym]: boolean = false

  // A script element has a type, which is either null, "classic", "module", or
  // "importmap", initially null. It is determined when the element is prepared,
  // based on the type attribute of the element at that time.
  ;

  [typeSym]: 'classic' | 'module' | 'importmap' | null = null

  // A script element has a result, which is either "uninitialized", null
  // (representing an error), a script, or an import map parse result. It is
  // initially "uninitialized".
  ;

  [resultSym]: 'uninitialized' | null | Script | ImportMapParseResult = 'uninitialized'

  // A script element has steps to run when the result is ready, which are a
  // series of steps or null, initially null.
  ;

  [stepsToRunWhenReadySym]: (() => void)[] | null = null

  constructor(ownerDocument: Document) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, 'script')

    // The following attribute change steps, given element, localName, oldValue, value, and
    // namespace, are used for all script elements:
    addAttributeChangeSteps(this, (
      element: Element,
      localName: string,
      _oldValue: string | null,
      _value: string | null,
      namespace: string | null
    ): void => {
      // If namespace is not null, then return.
      if (namespace !== null) {
        return
      }

      // If localName is src, then run the script HTML element post-connection steps, given element.
      if (localName === 'src') {
        postConnectionStepsMap.get('script')?.(element)
      }
    })
  }

  // Override for HTMLScriptElement's implicit potentially render-blocking rules.
  [implicitlyPotentiallyRenderBlockingSym](): boolean {
    // A script element el is implicitly potentially render-blocking if el's type is
    // "classic", el is parser-inserted, and el does not have an async or defer
    // attribute.
    // See: https://html.spec.whatwg.org/multipage/scripting.html#script-processing-model
    return this[typeSym] === 'classic' && !!this[parserDocumentSym] &&
      this.getAttribute('async') === null && this.getAttribute('defer') === null
  }

  setAttribute(name: string, value: string): void {
    // When an async attribute is added to a script element el, the user agent
    // must set el's force async to false.
    // See: https://html.spec.whatwg.org/multipage/scripting.html#script-processing-model
    // [IMPLEMENTATION NOTE] Strictly speaking, this is an incorrect
    // implementation, since it wouldn't catch the case where
    // el.attributes.add() is used to add the async attribute.
    if (name === 'async') {
      this[forceAsyncSym] = false
    }
    super.setAttribute(name, value)
  }

  // The cloning steps for a script element el being cloned to a copy copy are to set copy's already
  // started to el's already started.
  cloneNode(deep?: boolean): HTMLScriptElement {
    const clone = super.cloneNode(deep) as HTMLScriptElement
    clone[alreadyStartedSym] = this[alreadyStartedSym]
    return clone
  }

  get referrerPolicy(): ReferrerPolicy | '' {
    const value = this.getAttribute('referrerpolicy') || ''
    if ([
      'no-referrer',
      'no-referrer-when-downgrade',
      'origin',
      'origin-when-cross-origin',
      'same-origin',
      'strict-origin',
      'strict-origin-when-cross-origin',
      'unsafe-url'].includes(value)) {
      return value as ReferrerPolicy
    } else {
      return ''
    }
  }

  set referrerPolicy(value: ReferrerPolicy | '') {
    this.setAttribute('referrerpolicy', value)
  }

  // The async getter steps are:
  get async(): boolean {
    // 1. If this's force async is true, then return true.
    if (this[forceAsyncSym]) {
      return true
    }

    // 2. If this's async content attribute is present, then return true.
    if (this.getAttribute('async') !== null) {
      return true
    }

    // 3. Return false.
    return false
  }

  // The async setter steps are:
  set async(value: boolean) {
    // 1. Set this's force async to false.
    this[forceAsyncSym] = false
    // 2. If the given value is true, then set this's async content attribute to
    // the empty string.
    if (value) {
      this.setAttribute('async', '')
    } else {
      // 3. Otherwise, remove this's async content attribute.
      this.removeAttribute('async')
    }
  }

  get defer(): boolean {
    return this.getAttribute('defer') !== null
  }

  set defer(value: boolean) {
    if (value) {
      this.setAttribute('defer', '')
    } else {
      this.removeAttribute('defer')
    }
  }

  get attributionSrc(): DOMString {
    return this.getAttribute('attributionsrc') || ''
  }

  set attributionSrc(value: DOMString) {
    this.setAttribute('attributionsrc', value)
  }

  get crossOrigin(): CorsSettingAttributeKeyword {
    const value = this.getAttribute('crossorigin')
    if (value === 'use-credentials' || value === null) {
      return value as 'use-credentials' | null
    }
    return 'anonymous'
  }

  set crossOrigin(value: CorsSettingAttributeKeyword) {
    if (value === null) {
      this.removeAttribute('crossorigin')
    } else if (value === 'use-credentials') {
      this.setAttribute('crossorigin', 'use-credentials')
    } else {
      this.setAttribute('crossorigin', 'anonymous')
    }
  }

  get fetchPriority(): 'auto' | 'high' | 'low' {
    const value = this.getAttribute('fetchpriority')
    if (value === 'high' || value === 'low') {
      return value
    } else {
      return 'auto'
    }
  }

  set fetchPriority(value: 'auto' | 'high' | 'low') {
    this.setAttribute('fetchpriority', value)
  }

  get integrity(): DOMString {
    return this.getAttribute('integrity') || ''
  }

  set integrity(value: DOMString) {
    this.setAttribute('integrity', value)
  }

  get noModule(): boolean {
    return this.getAttribute('nomodule') !== null
  }

  set noModule(value: boolean) {
    if (value) {
      this.setAttribute('nomodule', '')
    } else {
      this.removeAttribute('nomodule')
    }
  }

  get src(): USVString {
    return this.getAttribute('src') || ''
  }

  set src(value: USVString) {
    this.setAttribute('src', value)
  }

  get text(): DOMString {
    const allText = []
    for (let i = 0; i < this.childNodes.length; i++) {
      const child = this.childNodes[i]
      if (child.nodeType === Node.TEXT_NODE) {
        allText.push(child.nodeValue)
      }
    }
    return allText.join('')
  }

  set text(value: DOMString) {
    this.textContent = value
  }

  get type(): DOMString {
    return this.getAttribute('type') || ''
  }

  set type(value: DOMString) {
    this.setAttribute('type', value)
  }
}

const createHTMLScriptElement =
  (ownerDocument: Document): HTMLScriptElement => {
    inFactory = true
    try {
      return new HTMLScriptElement(ownerDocument)
    } finally {
      inFactory = false
    }
  }

export {
  HTMLScriptElement,
  createHTMLScriptElement,
}
