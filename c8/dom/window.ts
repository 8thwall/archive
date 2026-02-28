// @sublibrary(:dom-core-lib)
/* eslint-disable max-classes-per-file */

import {
  GlobalEventHandlers,
  mixinGlobalEventHandlers,
} from './global-event-handlers'
import {
  WindowEventHandlers,
  mixinWindowEventHandlers,
} from './window-event-handlers'
import {AnimationFrameProvider, mixinAnimationFrameProvider} from './animation-frame-provider'
import {type NiaWindow, mixinNiaWindow} from './nia-window'
import type {Document} from './document'
import {ExposedOnWindow, mixinExposedOnWindow} from './exposed-on-window'
import {ExposedOnAll, mixinExposedOnAll} from './exposed-on-all'
import type {Element} from './element'
import type {HTMLElement} from './html-element'
import {type HTMLCollection, createHTMLCollection} from './html-collection'
import {Location as LocationType, createLocation} from './location'
import {throwIllegalConstructor} from './exception'
import {Image, createImageConstructor} from './image'
import {Audio, createAudioConstructor} from './audio'
import {Video, createVideoConstructor} from './video'
import type {ImportMap} from './import-map'
import {MessageEvent} from './dom-events'
import {Storage, createLocalStorage, createSessionStorage} from './storage'
import {FontFace} from './font-face'
import {
  WindowOrWorkerGlobalScope,
  mixinWindowOrWorkerGlobalScope,
  type Transferable,
} from './window-or-worker-global-scope'
import {
  importMapSym,
  importMapsAllowedSym,
  errorReportingModeSym,
} from './window-symbols'
import {
  type EventHandler,
  type EventListener,
  type EventListenerOptions,
  type AddEventListenerOptions,
  eventTargetSym,
} from './events-internal'
import {
  addEventListenerWrapped,
  removeEventListenerWrapped,
} from './events-methods'
import Navigator from './navigator'
import Screen from './screen'

let inFactory = false

class Window extends EventTarget implements
  ExposedOnAll, ExposedOnWindow, GlobalEventHandlers, WindowEventHandlers,
  WindowOrWorkerGlobalScope, AnimationFrameProvider, NiaWindow {
  [importMapSym]: ImportMap
  ;

  [importMapsAllowedSym]: boolean

  // A global object has an in error reporting mode boolean, which is initially
  // false.
  // See: https://html.spec.whatwg.org/multipage/webappapis.html#in-error-reporting-mode
  ;

  [errorReportingModeSym]: boolean = false

  constructor(
    doc: Document,
    options: WindowOptions,
    locationCallback: (href: string) => Promise<void>
  ) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super()

    // See https://html.spec.whatwg.org/multipage/webappapis.html#import-map-processing-model
    this[importMapsAllowedSym] = true
    this[importMapSym] = {
      imports: {},
      scopes: {},
      integrity: {},
    }

    this.devicePixelRatio = options.devicePixelRatio || 1

    this.innerWidth = Math.floor((options.width ?? 300) / this.devicePixelRatio)
    this.innerHeight = Math.floor((options.height ?? 150) / this.devicePixelRatio)

    const title = options.title || 'Untitled'

    // NOTE(lreyna): Not including border or margin with this calculation.
    this.outerWidth = this.innerWidth
    this.outerHeight = this.innerHeight

    this.location = createLocation(locationCallback, options.url || 'about:blank')

    this.document = doc
    this.document.title = title
    this.document.cookie = options.cookie || ''

    Object.defineProperty(this.document, 'location', {
      writable: false,
      value: this.location,
    })
    this.Image = createImageConstructor(this.document)
    this.Audio = createAudioConstructor(this.document)
    this.Video = createVideoConstructor(this.document)
    this.localStorage = createLocalStorage(this.location.origin, options.internalStoragePath)
    this.sessionStorage = createSessionStorage(this.location.origin)
    this.navigator = new Navigator()
    this.screen = new Screen()
    this.FontFace = FontFace
  }

  // Properties
  readonly closed: boolean

  // readonly crypto: Crypto
  // readonly customElements: CustomElementRegistry
  readonly devicePixelRatio: number

  readonly document: Document

  readonly frameElement: HTMLElement

  // readonly frames: Window
  // readonly history: History
  readonly innerHeight: number

  readonly innerWidth: number

  readonly length: number

  readonly localStorage: Storage

  // readonly location: Location
  readonly location: LocationType

  // readonly locationbar: BarProp
  // readonly menubar: BarProp
  readonly name: string

  readonly navigator: Navigator

  readonly outerHeight: number

  readonly outerWidth: number

  readonly pageXOffset: number

  readonly pageYOffset: number

  readonly parent: Window = this

  // readonly performance: Performance
  // readonly personalbar: BarProp
  // readonly screen: Screen
  readonly screenLeft: number

  readonly screenTop: number

  readonly screenX: number

  readonly screenY: number

  readonly scrollX: number

  readonly scrollY: number

  readonly screen: Screen

  // readonly scrollbars: BarProp
  readonly self: Window = this

  readonly sessionStorage: Storage

  readonly status: string

  // readonly statusbar: BarProp
  // readonly styleMedia: StyleMedia
  // readonly toolbar: BarProp
  readonly top: Window = this

  readonly window: Window = this

  readonly Image: Image

  readonly Audio: Audio

  readonly Video: Video

  readonly FontFace: FontFace

  // See: https://dom.spec.whatwg.org/#dom-eventtarget-addeventlistener
  addEventListener(
    type: string,
    callback?: EventHandler | EventListener,
    options?: AddEventListenerOptions | boolean
  ) {
    return addEventListenerWrapped(this, type, callback, options)
  }

  // See: https://dom.spec.whatwg.org/#dom-eventtarget-removeeventlistener
  removeEventListener(
    type: string,
    callback?: EventHandler | EventListener,
    options?: EventListenerOptions | boolean
  ) {
    return removeEventListenerWrapped(this, type, callback, options)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  alert(message?: any): void {}

  // eslint-disable-next-line class-methods-use-this
  blur(): void {}

  // cancelAnimationFrame(handle: number): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  cancelIdleCallback(handle: number): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  confirm(message?: string): boolean { return false }

  // eslint-disable-next-line class-methods-use-this
  focus(): void {}

  // getComputedStyle(elt: Element, pseudoElt?: string | null): CSSStyleDeclaration {}
  // getSelection(): Selection | null {}
  // matchMedia(query: string): MediaQueryList {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  moveBy(x: number, y: number): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  moveTo(x: number, y: number): void {}

  // open(
  //   url?: string, target?: string, features?: string, replace?: boolean): Window | null {}

  postMessage(
    message: any,
    targetOrigin?: string | {targetOrigin: string, transfer?: Transferable[]},
    transfer?: Transferable[]  // eslint-disable-line @typescript-eslint/no-unused-vars
  ): void {
    const tOrigin: string | undefined =
      (typeof targetOrigin === 'object') ? targetOrigin.targetOrigin : targetOrigin
    setTimeout(() => {
      this.dispatchEvent(new MessageEvent('message', {
        data: message,
        origin: tOrigin,
        source: this,
      } as any))
    })
  }

  // eslint-disable-next-line class-methods-use-this
  print(): void {}

  // prompt(message?: string, _default?: string): string | null {}
  // queueMicrotask(callback: VoidFunction): void {}
  // requestAnimationFrame(callback: FrameRequestCallback): number {}
  // requestIdleCallback(
  //   callback: IdleRequestCallback, options?: IdleRequestOptions): number {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  resizeBy(x: number, y: number): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  resizeTo(width: number, height: number): void {}

  // scroll(options?: ScrollToOptions): void {}
  // scroll(x: number, y: number): void {}
  // scrollBy(options?: ScrollToOptions): void {}
  // scrollBy(x: number, y: number): void {}
  // scrollTo(options?: ScrollToOptions): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  scrollTo(x: number, y: number): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  stop(): void {}
}

// Add mixin properties and methods via declaration merging.
/* eslint-disable no-redeclare */
interface Window {readonly Window: typeof Window}
interface Window extends ExposedOnAll {}
interface Window extends ExposedOnWindow {}
interface Window extends GlobalEventHandlers {}
interface Window extends WindowEventHandlers {}
interface Window extends WindowOrWorkerGlobalScope {}
interface Window extends AnimationFrameProvider {}
interface Window extends NiaWindow {}
/* eslint-enable no-redeclare */

// Add the mixin additions to Window's prototype.
Object.defineProperty(Window.prototype, 'Window', {value: Window})
mixinExposedOnAll(Window.prototype)
mixinExposedOnWindow(Window.prototype)
mixinGlobalEventHandlers(Window.prototype)
mixinWindowEventHandlers(Window.prototype)
mixinWindowOrWorkerGlobalScope(Window.prototype)
mixinAnimationFrameProvider(Window.prototype)
mixinNiaWindow(Window.prototype)

const createWindow = (
  ownerDocument: Document,
  options: WindowOptions,
  locationCallback: (href: string) => Promise<void>
): Window => {
  inFactory = true
  try {
    return new Window(ownerDocument, options, locationCallback)
  } finally {
    inFactory = false
  }
}
interface WindowOptions {
  url?: string
  width?: number
  height?: number
  title?: string
  context?: object
  cookie?: string
  internalStoragePath?: string
  devicePixelRatio?: number
}

const getNamedWindowProperty = (
  prop: string,
  doc: Document
): HTMLCollection | HTMLElement | undefined => {
  if (!doc.documentElement) {
    return undefined
  }
  const elementArray: HTMLElement[] = []
  const traverse = (element: Element): void => {
    // Check valid named window properties:
    //  * [NOT IMPLEMENTED] window's document-tree child navigable target name property set;
    //  * the value of the name content attribute for all embed, form, img, and object elements
    //  that have a non-empty name content attribute and are in a document tree with window's
    //  associated Document as their root; and
    //  * the value of the id content attribute for all HTML elements that have a non-empty id
    // content attribute and are in a document tree with window's associated Document as their
    // root.
    // eslint-disable-next-line max-len
    // See: https://html.spec.whatwg.org/multipage/nav-history-apis.html#named-access-on-the-window-object
    if (
      // Element is an HTML element, and;
      element.constructor.name.startsWith('HTML') &&
      (
        // Element is an embed, form, img, or object element with name === prop, or;
        (['embed', 'form', 'img', 'object'].includes(element.localName) &&
          element.getAttribute('name') === prop) ||
        // Element has id === prop.
        element.id === prop
      )
    ) {
      elementArray.push(element as HTMLElement)
    }
    for (const child of element.children) {
      traverse(child)
    }
  }
  traverse(doc.documentElement)
  if (elementArray.length === 0) {
    return undefined
  } else if (elementArray.length === 1) {
    return elementArray[0]
  } else {
    return createHTMLCollection(elementArray)
  }
}

const createWindowOnTarget = (
  ownerDocument: Document,
  options: WindowOptions,
  locationCallback: (href: string) => Promise<void>,
  target: object
): Window => {
  const win = createWindow(ownerDocument, options, locationCallback)
  Object.getOwnPropertyNames(win).forEach((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(win, name)!
    if (descriptor.value === win) {
      descriptor.value = target
    }
    Object.defineProperty(target, name, descriptor)
  })
  Object.getOwnPropertySymbols(win).forEach((symbol) => {
    const descriptor = Object.getOwnPropertyDescriptor(win, symbol)!
    if (descriptor.value === win) {
      descriptor.value = target
    }
    Object.defineProperty(target, symbol, descriptor)
  })

  // Support 'named properties' on window by putting a proxy around the window prototype.
  // The Window allows access of certain HTMLElements by name or id, but interestingly does not
  // allow them to be discovered via Object.getOwnPropertyNames, Array.from, or Object.keys. We
  // can't put a Proxy on the globalThis object without causing other issues, but given there is no
  // inspection of these properties on the instance, we can achieve what we need by putting a proxy
  // around the prototype of globalThis (which is Window.prototype).
  const windowPrototypeProxy = new Proxy(Window.prototype, {
    getPrototypeOf() { return Window.prototype },
    setPrototypeOf(targ) { return Window.prototype === targ },
    // Warning: Node/V8 has a bug where the Proxy 'has' trap in a vm incorrectly calls the 'get'
    // trap when both are defined. The consequence is that 'prop' in window will always return true.
    // See: https://github.com/nodejs/node/issues/30985
    has(targ, prop) {
      let targetHas = Reflect.has(targ, prop)
      if (!targetHas && typeof prop === 'string') {
        targetHas = !!getNamedWindowProperty(prop, ownerDocument)
      }
      return targetHas
    },
    get(targ, prop, receiver) {
      if (prop in targ) {
        return Reflect.get(targ, prop, receiver)
      } else {
        if (typeof prop !== 'string') {
          return undefined
        }
        return getNamedWindowProperty(prop, ownerDocument)
      }
    },
  })

  Object.setPrototypeOf(target, windowPrototypeProxy)

  // Node's globalThis object in a vm context is special, and has a hidden constructor in the
  // prototype chain. setPrototypeOf does not change it, and node only considers classes valid
  // event targets if their constructor has a [eventTargetSym] property.
  const specialConstructor = target.constructor
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const renamedConstructor = function Window(...args: any[]) {
    return specialConstructor.apply(this, args)
  }
  Object.defineProperty(renamedConstructor, 'name', {value: 'Window'})
  renamedConstructor[eventTargetSym] = true
  target.constructor = renamedConstructor

  return target as Window
}

export {
  Window,
  createWindow,
  createWindowOnTarget,
  WindowOptions,
}
