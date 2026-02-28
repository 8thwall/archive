// @sublibrary(:dom-core-lib)
import {CSSStyleDeclaration} from './css-style-declaration'
import {
  GlobalEventHandlers,
  mixinGlobalEventHandlers,
  globalEventHandlerNames,
} from './global-event-handlers'
import {ElementContentEditable, mixinElementContentEditable} from './element-content-editable'
import {HTMLOrSVGElement, mixinHTMLOrSVGElement} from './html-or-svg-element'
import type {HTMLCollection} from './html-collection'
import type {Document} from './document'
import {Element} from './element'
import type {NodeList} from './node-list'
import type {GetHTMLElementsByTagName, GetHTMLElementsByTagNameNS} from './html-elements'
import {throwIllegalConstructor} from './exception'
import type {DOMString} from './strings'
import {DOMRect} from './dom-rect'
import {
  addEventHandlerContentAttributeChangeSteps,
} from './events-internal'
import {PointerEvent} from './mouse-events'

let inFactory = false

class HTMLElement extends Element implements GlobalEventHandlers,
  ElementContentEditable, HTMLOrSVGElement {
  title: DOMString

  lang: DOMString

  translate: boolean

  dir: DOMString

  readonly style: CSSStyleDeclaration

  hidden: boolean | DOMString | null

  inert: boolean

  private clickInProgressFlag = false

  click(): void {
    // 1. If this element is a form control that is disabled, then return.
    // [NOT IMPLEMENTED]

    // 2. If this element's click in progress flag is set, then return.
    if (this.clickInProgressFlag) {
      return
    }

    // 3. Set this element's click in progress flag.
    this.clickInProgressFlag = true

    // 4. Fire a synthetic pointer event named click at this element, with the not trusted flag set.
    // https://html.spec.whatwg.org/multipage/webappapis.html#fire-a-synthetic-pointer-event
    const pointerEvent = new PointerEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: this.ownerDocument.defaultView,
    })
    Object.assign(pointerEvent, 'isTrusted', false)
    this.dispatchEvent(pointerEvent)

    // 5. Unset this element's click in progress flag.
    this.clickInProgressFlag = false
  }

  // eslint-disable-next-line class-methods-use-this
  attachInternals(): any {}

  readonly accessKey: DOMString

  readonly accessKeyLabel: DOMString

  draggable: boolean

  spellcheck: boolean

  autocapitalize: DOMString

  innerText: DOMString

  outerText: DOMString

  constructor(ownerDocument: Document, tagName: DOMString) {
    if (new.target === HTMLElement && !inFactory) {
      throwIllegalConstructor()
    }
    super(
      ownerDocument,
      tagName.toLowerCase(),
      tagName.toUpperCase(),
      'http://www.w3.org/1999/xhtml',
      null
    )

    addEventHandlerContentAttributeChangeSteps(this, globalEventHandlerNames)

    this.title = ''
    this.lang = ''
    this.translate = false
    this.dir = ''
    this.style = new CSSStyleDeclaration()
    this.hidden = false
    this.inert = false
    this.accessKey = ''
    this.accessKeyLabel = ''
    this.draggable = false
    this.spellcheck = true
    this.autocapitalize = ''
    this.innerText = ''
    this.outerText = ''
  }

  // eslint-disable-next-line class-methods-use-this
  get namespaceURI(): 'http://www.w3.org/1999/xhtml' {
    return 'http://www.w3.org/1999/xhtml'
  }

  getElementsByTagName: GetHTMLElementsByTagName = (
    qualifiedName: DOMString
  ) => super.getElementsByTagName(qualifiedName) as ReturnType<GetHTMLElementsByTagName>

  getElementsByTagNameNS: GetHTMLElementsByTagNameNS = (
    namespace: DOMString | null, localName: DOMString
  ) => super.getElementsByTagNameNS(namespace, localName) as ReturnType<GetHTMLElementsByTagNameNS>

  getElementsByClassName(names: DOMString): HTMLCollection<HTMLElement> {
    return super.getElementsByClassName(names) as HTMLCollection<HTMLElement>
  }

  querySelector(selectors: string): HTMLElement | null {
    return super.querySelector(selectors) as HTMLElement | null
  }

  querySelectorAll(selectors: string): NodeList<HTMLElement> {
    return super.querySelectorAll(selectors) as NodeList<HTMLElement>
  }

  // eslint-disable-next-line class-methods-use-this
  getBoundingClientRect(): DOMRect {
    return new DOMRect(0, 0, 0, 0)
  }
}

// Add mixin properties and methods via declaration merging.
// eslint-disable-next-line no-redeclare
interface HTMLElement extends GlobalEventHandlers, ElementContentEditable, HTMLOrSVGElement {}

// Add the mixin additions to Element's prototype.
mixinGlobalEventHandlers(HTMLElement.prototype)
mixinElementContentEditable(HTMLElement.prototype)
mixinHTMLOrSVGElement(HTMLElement.prototype)

const createHTMLElement = (ownerDocument: Document, tagName: DOMString): HTMLElement => {
  inFactory = true
  try {
    return new HTMLElement(ownerDocument, tagName)
  } finally {
    inFactory = false
  }
}

export {HTMLElement, createHTMLElement}
