// @sublibrary(:dom-core-lib)
import {AllHtmlElements, mixinAllHtmlElements} from './html-elements'

import {AudioContext} from './audio/audio-context'
import {
  CanvasRenderingContext2D,
} from './canvas-rendering-context-2d'
import {CSSStyleDeclaration} from './css-style-declaration'
import {Document, HTMLDocument} from './document'
import {
  AnimationEvent,
  BeforeUnloadEvent,
  DragEvent,
  ErrorEvent,
  FocusEvent,
  HashChangeEvent,
  KeyboardEvent,
  MessageEvent,
  PageTransitionEvent,
  PopStateEvent,
  ProgressEvent,
  PromiseRejectionEvent,
  SecurityPolicyViolationEvent,
  StorageEvent,
  TransitionEvent,
  TouchEvent,
  UIEvent,
} from './dom-events'
import {MouseEvent, PointerEvent, WheelEvent} from './mouse-events'
import {DeviceMotionEvent, DeviceOrientationEvent} from './device-orientation-and-motion-events'
import {Touch} from './touch'
import {Node} from './node'
import {NodeList} from './node-list'
import {CharacterData} from './character-data'
import {Text} from './text'
import {Comment} from './comment'
import {DocumentType} from './document-type'
import {DOMImplementation} from './dom-implementation'
import {DOMStringMap} from './dom-string-map'
import {DOMTokenList} from './dom-token-list'
import {History} from './history'
import {HTMLCollection} from './html-collection'
import {HTMLElement} from './html-element'
import {ImageBitmap} from './image-bitmap'
import {ImageData} from './image-data'
import {NamedNodeMap} from './named-node-map'
import {Location} from './location'
import {OffscreenCanvas} from './offscreen-canvas'
import {Element} from './element'
import {WebGLRenderingContext} from './webgl-rendering-context'
import {WebGL2RenderingContext} from './webgl2-rendering-context'
import {Worker} from './worker'
import {WebAssembly} from './web-assembly'
import {ResizeObserver} from './resize-observer'

type ExposedOnWindow = AllHtmlElements & {
  readonly AudioContext: typeof AudioContext

  readonly CanvasRenderingContext2D: typeof CanvasRenderingContext2D

  readonly CSSStyleDeclaration: typeof CSSStyleDeclaration

  readonly Document: typeof Document

  readonly HTMLDocument: typeof HTMLDocument

  readonly ResizeObserver: typeof ResizeObserver

  readonly AnimationEvent: typeof AnimationEvent

  readonly BeforeUnloadEvent: typeof BeforeUnloadEvent

  readonly DragEvent: typeof DragEvent

  readonly ErrorEvent: typeof ErrorEvent

  readonly FocusEvent: typeof FocusEvent

  readonly HashChangeEvent: typeof HashChangeEvent

  readonly ImageBitmap: typeof ImageBitmap

  readonly KeyboardEvent: typeof KeyboardEvent

  readonly MessageEvent: typeof MessageEvent

  readonly MouseEvent: typeof MouseEvent

  readonly PageTransitionEvent: typeof PageTransitionEvent

  readonly PopStateEvent: typeof PopStateEvent

  readonly PointerEvent: typeof PointerEvent

  readonly ProgressEvent: typeof ProgressEvent

  readonly PromiseRejectionEvent: typeof PromiseRejectionEvent

  readonly StorageEvent: typeof StorageEvent

  readonly SecurityPolicyViolationEvent: typeof SecurityPolicyViolationEvent

  readonly TransitionEvent: typeof TransitionEvent

  readonly TouchEvent: typeof TouchEvent

  readonly Touch: typeof Touch

  readonly UIEvent: typeof UIEvent

  readonly WheelEvent: typeof WheelEvent

  readonly DeviceOrientationEvent: typeof DeviceOrientationEvent

  readonly DeviceMotionEvent: typeof DeviceMotionEvent

  readonly Node: typeof Node

  readonly NodeList: typeof NodeList

  readonly CharacterData: typeof CharacterData

  readonly Text: typeof Text

  readonly Comment: typeof Comment

  readonly DocumentType: typeof DocumentType

  readonly DOMImplementation: typeof DOMImplementation

  readonly DOMStringMap: typeof DOMStringMap

  readonly DOMTokenList: typeof DOMTokenList

  readonly Element: typeof Element

  readonly OffscreenCanvas: typeof OffscreenCanvas

  readonly history: typeof History

  readonly HTMLCollection: typeof HTMLCollection

  readonly HTMLElement: typeof HTMLElement

  readonly ImageData: typeof ImageData

  readonly Location: typeof Location

  readonly NamedNodeMap: typeof NamedNodeMap

  readonly WebAssembly: typeof WebAssembly

  readonly WebGLRenderingContext: typeof WebGLRenderingContext

  readonly WebGL2RenderingContext: typeof WebGL2RenderingContext

  readonly Worker: typeof Worker
}

const mixinExposedOnWindow = <T extends ExposedOnWindow>(proto: T) => {
  // Add all of the HTMLElement subclasses to the window.
  mixinAllHtmlElements(proto)

  // Add all of the other DOM classes to the window.
  Object.defineProperties(proto, {
    AudioContext: {
      value: AudioContext,
    },
    CanvasRenderingContext2D: {
      value: CanvasRenderingContext2D,
    },
    CSSStyleDeclaration: {
      value: CSSStyleDeclaration,
    },
    Document: {
      value: Document,
    },
    HTMLDocument: {
      value: HTMLDocument,
    },
    AnimationEvent: {
      value: AnimationEvent,
    },
    BeforeUnloadEvent: {
      value: BeforeUnloadEvent,
    },
    DragEvent: {
      value: DragEvent,
    },
    ErrorEvent: {
      value: ErrorEvent,
    },
    FocusEvent: {
      value: FocusEvent,
    },
    HashChangeEvent: {
      value: HashChangeEvent,
    },
    ImageBitmap: {
      value: ImageBitmap,
    },
    KeyboardEvent: {
      value: KeyboardEvent,
    },
    MessageEvent: {
      value: MessageEvent,
    },
    MouseEvent: {
      value: MouseEvent,
    },
    PageTransitionEvent: {
      value: PageTransitionEvent,
    },
    PopStateEvent: {
      value: PopStateEvent,
    },
    PointerEvent: {
      value: PointerEvent,
    },
    ProgressEvent: {
      value: ProgressEvent,
    },
    PromiseRejectionEvent: {
      value: PromiseRejectionEvent,
    },
    StorageEvent: {
      value: StorageEvent,
    },
    SecurityPolicyViolationEvent: {
      value: SecurityPolicyViolationEvent,
    },
    TransitionEvent: {
      value: TransitionEvent,
    },
    VideoFrame: {
      value: undefined,
    },
    TouchEvent: {
      value: TouchEvent,
    },
    Touch: {
      value: Touch,
    },
    UIEvent: {
      value: UIEvent,
    },
    WheelEvent: {
      value: WheelEvent,
    },
    DeviceOrientationEvent: {
      value: DeviceOrientationEvent,
    },
    DeviceMotionEvent: {
      value: DeviceMotionEvent,
    },
    Node: {
      value: Node,
    },
    NodeList: {
      value: NodeList,
    },
    CharacterData: {
      value: CharacterData,
    },
    Text: {
      value: Text,
    },
    Comment: {
      value: Comment,
    },
    DocumentType: {
      value: DocumentType,
    },
    DOMImplementation: {
      value: DOMImplementation,
    },
    DOMStringMap: {
      value: DOMStringMap,
    },
    DOMTokenList: {
      value: DOMTokenList,
    },
    Element: {
      value: Element,
    },
    OffscreenCanvas: {
      value: OffscreenCanvas,
    },
    history: {
      value: History,
    },
    HTMLCollection: {
      value: HTMLCollection,
    },
    HTMLElement: {
      value: HTMLElement,
    },
    ImageData: {
      value: ImageData,
    },
    Location: {
      value: Location,
    },
    NamedNodeMap: {
      value: NamedNodeMap,
    },
    WebGLRenderingContext: {
      value: WebGLRenderingContext,
    },
    WebGL2RenderingContext: {
      value: WebGL2RenderingContext,
    },
    Worker: {
      value: Worker,
    },
    ResizeObserver: {
      value: ResizeObserver,
    },
    // When running node in jitless mode (i.e. on iOS), WebAssembly is undefined, so define it.
    ...(typeof (globalThis as any).WebAssembly === 'undefined' ? {
      WebAssembly: {
        value: WebAssembly,
      },
    } : {}),
  })
}

export {ExposedOnWindow, mixinExposedOnWindow}
