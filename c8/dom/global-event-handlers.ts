// @sublibrary(:dom-core-lib)
import type {
  AnimationEvent,
  DragEvent,
  ErrorEvent,
  FocusEvent,
  KeyboardEvent,
  ProgressEvent,
  SecurityPolicyViolationEvent,
  TouchEvent,
  TransitionEvent,
  UIEvent,
} from './dom-events'

import type {MouseEvent, PointerEvent, WheelEvent} from './mouse-events'

import {createEventHandlerIdlAttribute} from './events-internal'

type MakeNullable<T> = {
  [K in keyof T]: T[K] | null
}

const globalEventHandlerNames = [
  'onabort',
  'onanimationcancel',
  'onanimationend',
  'onanimationiteration',
  'onanimationstart',
  'onauxclick',
  'onblur',
  'oncancel',
  'oncanplay',
  'oncanplaythrough',
  'onchange',
  'onclick',
  'onclose',
  'oncontextmenu',
  'oncuechange',
  'ondblclick',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragexit',
  'ondragleave',
  'ondragover',
  'ondragstart',
  'ondrop',
  'ondurationchange',
  'onemptied',
  'onended',
  'onerror',
  'onfocus',
  'onfullscreenchange',
  'onfullscreenerror',
  'ongotpointercapture',
  'oninput',
  'oninvalid',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onload',
  'onloadeddata',
  'onloadedmetadata',
  'onloadstart',
  'onlostpointercapture',
  'onmousedown',
  'onmouseenter',
  'onmouseleave',
  'onmousemove',
  'onmouseout',
  'onmouseover',
  'onmouseup',
  'onpause',
  'onplay',
  'onplaying',
  'onpointercancel',
  'onpointerdown',
  'onpointerenter',
  'onpointerleave',
  'onpointermove',
  'onpointerout',
  'onpointerover',
  'onpointerup',
  'onprogress',
  'onratechange',
  'onreset',
  'onresize',
  'onscroll',
  'onsecuritypolicyviolation',
  'onseeked',
  'onseeking',
  'onselect',
  'onselectionchange',
  'onselectstart',
  'onstalled',
  'onsubmit',
  'onsuspend',
  'ontimeupdate',
  'ontoggle',
  'ontouchcancel',
  'ontouchend',
  'ontouchmove',
  'ontouchstart',
  'ontransitioncancel',
  'ontransitionend',
  'ontransitionrun',
  'ontransitionstart',
  'onvolumechange',
  'onwaiting',
  'onwheel',
] as const

type GlobalEventHandlers = MakeNullable<{
  onabort: (ev: UIEvent) => any;
  onanimationcancel: (ev: AnimationEvent) => any;
  onanimationend: (ev: AnimationEvent) => any;
  onanimationiteration: (ev: AnimationEvent) => any;
  onanimationstart: (ev: AnimationEvent) => any;
  onauxclick: (ev: MouseEvent) => any;
  onblur: (ev: FocusEvent) => any;
  oncancel: (ev: Event) => any;
  oncanplay: (ev: Event) => any;
  oncanplaythrough: (ev: Event) => any;
  onchange: (ev: Event) => any;
  onclick: (ev: MouseEvent) => any;
  onclose: (ev: Event) => any;
  oncontextmenu: (ev: MouseEvent) => any;
  oncuechange: (ev: Event) => any;
  ondblclick: (ev: MouseEvent) => any;
  ondrag: (ev: DragEvent) => any;
  ondragend: (ev: DragEvent) => any;
  ondragenter: (ev: DragEvent) => any;
  ondragexit: (ev: Event) => any;
  ondragleave: (ev: DragEvent) => any;
  ondragover: (ev: DragEvent) => any;
  ondragstart: (ev: DragEvent) => any;
  ondrop: (ev: DragEvent) => any;
  ondurationchange: (ev: Event) => any;
  onemptied: (ev: Event) => any;
  onended: (ev: Event) => any;
  onerror: (ev: ErrorEvent) => any;
  onfocus: (ev: FocusEvent) => any;
  onfullscreenchange: (ev: Event) => any;
  onfullscreenerror: (ev: Event) => any;
  ongotpointercapture: (ev: PointerEvent) => any;
  oninput: (ev: Event) => any;
  oninvalid: (ev: Event) => any;
  onkeydown: (ev: KeyboardEvent) => any;
  onkeypress: (ev: KeyboardEvent) => any;
  onkeyup: (ev: KeyboardEvent) => any;
  onload: (ev: Event) => any;
  onloadeddata: (ev: Event) => any;
  onloadedmetadata: (ev: Event) => any;
  onloadstart: (ev: Event) => any;
  onlostpointercapture: (ev: PointerEvent) => any;
  onmousedown: (ev: MouseEvent) => any;
  onmouseenter: (ev: MouseEvent) => any;
  onmouseleave: (ev: MouseEvent) => any;
  onmousemove: (ev: MouseEvent) => any;
  onmouseout: (ev: MouseEvent) => any;
  onmouseover: (ev: MouseEvent) => any;
  onmouseup: (ev: MouseEvent) => any;
  onpause: (ev: Event) => any;
  onplay: (ev: Event) => any;
  onplaying: (ev: Event) => any;
  onpointercancel: (ev: PointerEvent) => any;
  onpointerdown: (ev: PointerEvent) => any;
  onpointerenter: (ev: PointerEvent) => any;
  onpointerleave: (ev: PointerEvent) => any;
  onpointermove: (ev: PointerEvent) => any;
  onpointerout: (ev: PointerEvent) => any;
  onpointerover: (ev: PointerEvent) => any;
  onpointerup: (ev: PointerEvent) => any;
  onprogress: (ev: ProgressEvent) => any;
  onratechange: (ev: Event) => any;
  onreset: (ev: Event) => any;
  onresize: (ev: UIEvent) => any;
  onscroll: (ev: Event) => any;
  onsecuritypolicyviolation: (ev: SecurityPolicyViolationEvent) => any;
  onseeked: (ev: Event) => any;
  onseeking: (ev: Event) => any;
  onselect: (ev: Event) => any;
  onselectionchange: (ev: Event) => any;
  onselectstart: (ev: Event) => any;
  onstalled: (ev: Event) => any;
  onsubmit: (ev: Event) => any;
  onsuspend: (ev: Event) => any;
  ontimeupdate: (ev: Event) => any;
  ontoggle: (ev: Event) => any;
  ontouchcancel: (ev: TouchEvent) => any;
  ontouchend: (ev: TouchEvent) => any;
  ontouchmove: (ev: TouchEvent) => any;
  ontouchstart: (ev: TouchEvent) => any;
  ontransitioncancel: (ev: TransitionEvent) => any;
  ontransitionend: (ev: TransitionEvent) => any;
  ontransitionrun: (ev: TransitionEvent) => any;
  ontransitionstart: (ev: TransitionEvent) => any;
  onvolumechange: (ev: Event) => any;
  onwaiting: (ev: Event) => any;
  onwheel: (ev: WheelEvent) => any;
}>

const mixinGlobalEventHandlers = <T extends GlobalEventHandlers>(proto: T) => {
  globalEventHandlerNames.forEach((name) => {
    Object.defineProperty(proto, name, createEventHandlerIdlAttribute(name))
  })
}

export {GlobalEventHandlers, mixinGlobalEventHandlers, globalEventHandlerNames}
