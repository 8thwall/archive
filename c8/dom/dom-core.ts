// @rule(js_binary)
// @attr(target = "node")
// @attr(esnext = 1)
// @attr(export_library = 1)
// @attr(mangle = 0)
// @package(npm-rendering)

// @attr(externals = "third_party/headless-gl/*, external/miniaudio-addon/*")
// @attr(externalsType = "module")
export {AudioContext} from './audio/audio-context'
export {Attr} from './attr'
export {CanvasRenderingContext2D} from './canvas-rendering-context-2d'
export {CharacterData} from './character-data'
export {Comment} from './comment'
export {CSSStyleDeclaration} from './css-style-declaration'
export {
  Document,
  HTMLDocument,
} from './document'
export {DocumentType} from './document-type'
export {
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
  StorageEvent,
  SecurityPolicyViolationEvent,
  TransitionEvent,
  TouchEvent,
  UIEvent,
} from './dom-events'
export {DOMException} from './dom-exception'
export {DOMImplementation} from './dom-implementation'
export {DOMStringMap} from './dom-string-map'
export {DOMTokenList} from './dom-token-list'
export {Element} from './element'
export {FocusOptions} from './focus-options'
export {History} from './history'
export {HTMLCollection} from './html-collection'
export {HTMLElement} from './html-element'
export {Location} from './location'
export {Image} from './image'
export {NamedNodeMap} from './named-node-map'
export {Node} from './node'
export {PointerEvent, WheelEvent} from './mouse-events'
export {NodeList} from './node-list'
export {OffscreenCanvas} from './offscreen-canvas'
export {OffscreenCanvasRenderingContext2D} from './offscreen-canvas-rendering-context-2d'
export {DOMString, USVString} from './strings'
export {Text} from './text'
export {WebGLRenderingContext} from './webgl-rendering-context'
export * from './webgl-rendering-context-base'
export * from './webgl-rendering-context-overloads'
export {WebGL2RenderingContext} from './webgl2-rendering-context'
export * from './webgl2-rendering-context-base'
export * from './webgl2-rendering-context-overloads'
export {Window, createWindowOnTarget} from './window'
export {Worker} from './worker'
export type {WorkerGlobalScope} from './worker-global-scope'
// @inliner-skip-next
export type {XMLHttpRequest} from './xml-http-request.d'
export type {ResizeObserver} from './resize-observer'
export {
  HTMLAnchorElement,
  HTMLAreaElement,
  HTMLAudioElement,
  HTMLBaseElement,
  HTMLQuoteElement,
  HTMLBRElement,
  HTMLBodyElement,
  HTMLButtonElement,
  HTMLCanvasElement,
  HTMLTableCaptionElement,
  HTMLTableColElement,
  HTMLDataElement,
  HTMLDataListElement,
  HTMLModElement,
  HTMLDetailsElement,
  HTMLDialogElement,
  HTMLDivElement,
  HTMLDListElement,
  HTMLEmbedElement,
  HTMLFieldSetElement,
  HTMLFormElement,
  HTMLHeadElement,
  HTMLHRElement,
  HTMLHtmlElement,
  HTMLIFrameElement,
  HTMLImageElement,
  HTMLLabelElement,
  HTMLLegendElement,
  HTMLLIElement,
  HTMLLinkElement,
  HTMLMapElement,
  HTMLMenuElement,
  HTMLMetaElement,
  HTMLMeterElement,
  HTMLObjectElement,
  HTMLOListElement,
  HTMLOptGroupElement,
  HTMLOptionElement,
  HTMLOutputElement,
  HTMLParagraphElement,
  HTMLPictureElement,
  HTMLPreElement,
  HTMLProgressElement,
  HTMLScriptElement,
  HTMLSelectElement,
  HTMLSlotElement,
  HTMLSourceElement,
  HTMLSpanElement,
  HTMLStyleElement,
  HTMLTableElement,
  HTMLTableSectionElement,
  HTMLTableCellElement,
  HTMLTemplateElement,
  HTMLTextAreaElement,
  HTMLTimeElement,
  HTMLTitleElement,
  HTMLTableRowElement,
  HTMLTrackElement,
  HTMLUListElement,
  HTMLVideoElement,
  HTMLDirectoryElement,
  HTMLFontElement,
  HTMLFrameElement,
  HTMLFrameSetElement,
  HTMLMarqueeElement,
  HTMLParamElement,
  HTMLUnknownElement,
} from './html-elements'
