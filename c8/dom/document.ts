// @sublibrary(:dom-core-lib)
/* eslint-disable max-classes-per-file */

import {Attr, createAttr} from './attr'
import {Element} from './element'
import {DocumentFragment} from './document-fragment'
import {FontFaceSet} from './font-face-set'
import {
  DOMImplementation,
  createDOMImplementation,
} from './dom-implementation'
import {
  nodeDocumentMap,
} from './node-internal'
import {
  CreateHTMLElementDocument,
  CreateHTMLElementDocumentNS,
  createHTMLElement,
} from './html-elements'

import {
  GlobalEventHandlers,
  mixinGlobalEventHandlers,
} from './global-event-handlers'

import type {EnvironmentSettings} from './environment'

import type {HTMLElement} from './html-element'
import {Node} from './node'
import {HTMLCollection, createHTMLCollection} from './html-collection'
import {createText, type Text} from './text'
import {mixinParentNode, ParentNode} from './parent-node'
import {Comment, createComment} from './comment'
import type {Location} from './location'
import type {Window} from './window'

import type {USVString, DOMString} from './strings'
import type {
  HTMLBodyElement,
  HTMLHeadElement,
  HTMLScriptElement,
} from './html-elements'

import {
  renderBlockingElementsSym,
  environmentSettingsSym,
  ignoreDestructiveWritesCounterSym,
  aboutBaseUrlSym,
  pendingParsingBlockingScriptSym,
  scriptsToExecuteAsapSym,
  scriptsToExecuteInOrderAsapSym,
  scriptsToExecuteAfterParsingSym,
} from './document-symbols'

enum DocumentReadyState {
  LOADING = 'loading',
  INTERACTIVE = 'interactive',
  COMPLETE = 'complete',
}

enum DocumentVisibilityState {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
}

interface ElementCreationOptions {
  is?: string;
}

class Document extends Node implements ParentNode, GlobalEventHandlers {
  readonly location: Location | null = null

  documentElement: HTMLElement | null = null

  currentScript: HTMLScriptElement | null = null

  domain: USVString = ''

  readonly referrer: USVString = ''

  cookie: USVString = ''

  readonly lastModified: DOMString = ''

  readonly readyState: DocumentReadyState = DocumentReadyState.LOADING

  title: DOMString = ''

  dir: DOMString = ''

  body: HTMLBodyElement | null = null

  readonly head: HTMLHeadElement | null = null

  readonly hidden: boolean = false

  readonly fonts: FontFaceSet = new FontFaceSet()

  readonly visibilityState: DocumentVisibilityState = DocumentVisibilityState.VISIBLE

  readonly contentType: string

  readonly implementation: DOMImplementation = createDOMImplementation(
    this,
    (title?: string): Document => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const doc = new HTMLDocument()
      doc.title = title || ''
      return doc
    }
  )

  readonly defaultView: Window | null = null

  // Prop textContent has type null in a Document object.
  declare textContent: null

  ;

  [renderBlockingElementsSym]: Set<Element> = new Set()

  ;

  [environmentSettingsSym]: EnvironmentSettings

  ;

  [aboutBaseUrlSym]: URL | null

  ;

  [ignoreDestructiveWritesCounterSym]: number = 0

  // Each Document has a pending parsing-blocking script, which is a script
  // element or null, initially null.
  // See: https://html.spec.whatwg.org/multipage/scripting.html#pending-parsing-blocking-script
  ;

  [pendingParsingBlockingScriptSym]: HTMLScriptElement | null = null

  // Each Document has a set of scripts that will execute as soon as possible,
  // which is a set of script elements, initially empty.
  ;

  [scriptsToExecuteAsapSym]: Set<HTMLScriptElement> = new Set()

  // Each Document has a list of scripts that will execute in order as soon as
  // possible, which is a list of script elements, initially empty.
  ;

  [scriptsToExecuteInOrderAsapSym]: HTMLScriptElement[] = []

  // Each Document has a list of scripts that will execute when the document has
  // finished parsing
  ;

  [scriptsToExecuteAfterParsingSym]: HTMLScriptElement[] = []

  constructor() {
    super(null as unknown as Document, '#document', Node.DOCUMENT_NODE)
    nodeDocumentMap.set(this, this)
    this.contentType = 'application/xml'
    this[environmentSettingsSym] = {
      id: (globalThis as any).crypto?.randomUUID() || '',
      creationUrl: new URL('about:blank'),
      topLevelCreationUrl: new URL('about:blank'),
      topLevelOrigin: null,
      targetBrowseContext: null,
      activeServiceWorker: null,
      executionReady: false,
      realmExecutionContext: null as unknown as Window,  // Set by parent context.
      globalObject: globalThis as unknown as Window,
      moduleMap: new Map(),
      apiBaseUrl: new URL('about:blank'),
      origin: {},
      corsIsolatedCapability: false,
      timeOrigin: performance.now(),
    }
    this[aboutBaseUrlSym] = null
  }

  get URL(): USVString {
    return this.defaultView?.location.href || 'about:blank'
  }

  // Document returns null for ownerDocument.
  get ownerDocument(): null {  // eslint-disable-line class-methods-use-this
    return null
  }

  appendChild(child: Node): Node {
    if (this.documentElement === null) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        this.documentElement = child as HTMLElement
      }
    }
    return super.appendChild(child)
  }

  getElementById(id: string): HTMLElement | null {
    if (this.documentElement === null) {
      return null
    }
    const traverse = (element: HTMLElement): HTMLElement | null => {
      if (element.id === id) {
        return element
      }
      for (const child of element.children) {
        const found = traverse(child as HTMLElement)
        if (found) {
          return found
        }
      }
      return null
    }
    return traverse(this.documentElement)
  }

  createElementNS: CreateHTMLElementDocumentNS = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    namespaceURI: 'http://www.w3.org/1999/xhtml',
    qualifiedName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: ElementCreationOptions
  ) => this.createElement(qualifiedName)

  createElement: CreateHTMLElementDocument = (
    tagName: DOMString,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: ElementCreationOptions
  ) => createHTMLElement(this, tagName)

  createTextNode(data: string): Text {
    return createText(this, data)
  }

  createComment(data: string): Comment {
    return createComment(this, data)
  }

  createAttribute(name: DOMString): Attr {
    return createAttr(this, null, name, '')
  }

  createDocumentFragment(): DocumentFragment {
    const fragment = new DocumentFragment()
    nodeDocumentMap.set(fragment, this)
    return fragment
  }

  getElementsByTagName(tagName: string): HTMLCollection<HTMLElement> {
    if (this.documentElement === null) {
      return createHTMLCollection([]) as HTMLCollection<HTMLElement>
    }
    return Element.prototype.getElementsByTagName.call(
      this as unknown as HTMLElement, tagName
    )
  }

  getElementsByTagNameNS(
    namespaceURI: DOMString | null,
    localName: DOMString
  ): HTMLCollection<HTMLElement> {
    if (this.documentElement === null) {
      return createHTMLCollection([]) as HTMLCollection<HTMLElement>
    }
    return Element.prototype.getElementsByTagNameNS.call(
      this as unknown as HTMLElement, namespaceURI, localName
    )
  }

  getElementsByClassName(className: string): HTMLCollection<HTMLElement> {
    if (this.documentElement === null) {
      return createHTMLCollection([]) as HTMLCollection<HTMLElement>
    }
    return Element.prototype.getElementsByClassName.call(
      this as unknown as HTMLElement, className
    )
  }

  dispatchEvent(event: Event): boolean {
    const defaultPermitted = super.dispatchEvent(event)
    if (!event.bubbles) {
      return defaultPermitted
    }
    const {globalObject} = this[environmentSettingsSym]
    const defaultPermittedByParent = globalObject.dispatchEvent(event)
    return defaultPermitted && defaultPermittedByParent
  }
}

// Add mixin types via declaration merging.
interface Document extends ParentNode {}  // eslint-disable-line no-redeclare
interface Document extends GlobalEventHandlers {}  // eslint-disable-line no-redeclare

// Add mixin properties and methods.
mixinParentNode(Document.prototype)
mixinGlobalEventHandlers(Document.prototype)

class HTMLDocument extends Document {
  constructor() {
    super()

    Object.defineProperty(this, 'contentType', {value: 'text/html'})

    const doctype = this.implementation.createDocumentType('html', '', '')
    const html = this.createElement('html')
    const head = this.createElement('head')
    const body = this.createElement('body')

    html.append(head, body)

    Object.defineProperty(this, 'body', {value: body})
    Object.defineProperty(this, 'head', {value: head})

    this.appendChild(doctype)
    this.appendChild(html)
  }
}

export {
  Document,
  HTMLDocument,
}
