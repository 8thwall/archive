// @sublibrary(:dom-core-lib)
/* eslint-disable max-classes-per-file */
import type {Storage} from './storage'
import type {Touch} from './touch'

// Matches the DOM EventInit interface.
interface EventInit {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

interface AnimationEventInit extends EventInit {
  animationName?: string
  elapsedTime?: number
  pseudoElement?: string
}
class AnimationEvent extends Event {
  constructor(type: string, eventInitDict?: AnimationEventInit) {
    super(type, eventInitDict)
    this.animationName = eventInitDict?.animationName || ''
    this.elapsedTime = eventInitDict?.elapsedTime || 0
    this.pseudoElement = eventInitDict?.pseudoElement || ''
  }

  readonly animationName: string

  readonly elapsedTime: number

  readonly pseudoElement: string
}

class BeforeUnloadEvent extends Event {}

interface DragEventInit extends EventInit {
  dataTransfer?: any  // DataTransfer
}
class DragEvent extends Event {
  constructor(type: string, eventInitDict?: DragEventInit) {
    super(type, eventInitDict)
    this.dataTransfer = eventInitDict?.dataTransfer || null
  }

  readonly dataTransfer: any
}

interface ErrorEventInit extends EventInit {
  message?: string
  filename?: string
  lineno?: number
  colno?: number
  error?: Error
}

class ErrorEvent extends Event {
  constructor(type: string, eventInitDict?: ErrorEventInit) {
    super(type, eventInitDict)
    this.message = eventInitDict?.message || ''
    this.filename = eventInitDict?.filename || ''
    this.lineno = eventInitDict?.lineno || 0
    this.colno = eventInitDict?.colno || 0
    this.error = eventInitDict?.error || new Error()
  }

  readonly message: string

  readonly filename: string

  readonly lineno: number

  readonly colno: number

  readonly error: Error
}

interface FocusEventInit extends EventInit {
  relatedTarget?: any
}
class FocusEvent extends Event {
  constructor(type: string, eventInitDict?: FocusEventInit) {
    super(type, eventInitDict)
    this.relatedTarget = eventInitDict?.relatedTarget || null
  }

  readonly relatedTarget: any
}

interface HashChangeEventInit extends EventInit {
  oldURL?: string
  newURL?: string
}
class HashChangeEvent extends Event {
  constructor(type: string, eventInitDict?: HashChangeEventInit) {
    super(type, eventInitDict)
    this.oldURL = eventInitDict?.oldURL || ''
    this.newURL = eventInitDict?.newURL || ''
  }

  readonly oldURL: string

  readonly newURL: string
}

interface KeyboardEventInit extends EventInit {
  key?: string
  code?: string
  location?: number
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  repeat?: boolean
  isComposing?: boolean
  charCode?: number
  keyCode?: number
  which?: number
}
class KeyboardEvent extends Event {
  constructor(type: string, eventInitDict?: KeyboardEventInit) {
    super(type, eventInitDict)
    this.key = eventInitDict?.key || ''
    this.code = eventInitDict?.code || ''
    this.location = eventInitDict?.location || 0
    this.ctrlKey = eventInitDict?.ctrlKey || false
    this.shiftKey = eventInitDict?.shiftKey || false
    this.altKey = eventInitDict?.altKey || false
    this.metaKey = eventInitDict?.metaKey || false
    this.repeat = eventInitDict?.repeat || false
    this.isComposing = eventInitDict?.isComposing || false
    this.charCode = eventInitDict?.charCode || 0
    this.keyCode = eventInitDict?.keyCode || 0
    this.which = eventInitDict?.which || 0
  }

  readonly key: string

  readonly code: string

  readonly location: number

  readonly ctrlKey: boolean

  readonly shiftKey: boolean

  readonly altKey: boolean

  readonly metaKey: boolean

  readonly repeat: boolean

  readonly isComposing: boolean

  readonly charCode: number

  readonly keyCode: number

  readonly which: number
}

interface MessageEventInit extends EventInit {
  data?: any
  origin?: string
  lastEventId?: string
  source?: any
  ports?: any[]
}

class MessageEvent extends Event {
  constructor(type: string, eventInitDict?: MessageEventInit) {
    super(type, eventInitDict)
    this.data = eventInitDict?.data || null
    this.origin = eventInitDict?.origin || ''
    this.lastEventId = eventInitDict?.lastEventId || ''
    this.source = eventInitDict?.source || null
    this.ports = eventInitDict?.ports || []
  }

  readonly data: any

  readonly origin: string

  readonly lastEventId: string

  readonly source: any

  readonly ports: any[]
}

interface PageTransitionEventInit extends EventInit {
  persisted?: boolean
}
class PageTransitionEvent extends Event {
  constructor(type: string, eventInitDict?: PageTransitionEventInit) {
    super(type, eventInitDict)
    this.persisted = eventInitDict?.persisted || false
  }

  readonly persisted: boolean
}

interface PopStateEventInit extends EventInit {
  state?: any
}
class PopStateEvent extends Event {
  constructor(type: string, eventInitDict?: PopStateEventInit) {
    super(type, eventInitDict)
    this.state = eventInitDict?.state || null
  }

  readonly state: any
}

interface ProgressEventInit extends EventInit {
  lengthComputable?: boolean
  loaded?: number
  total?: number
}
class ProgressEvent extends Event {
  constructor(type: string, eventInitDict?: ProgressEventInit) {
    super(type, eventInitDict)
    this.lengthComputable = eventInitDict?.lengthComputable || false
    this.loaded = eventInitDict?.loaded || 0
    this.total = eventInitDict?.total || 0
  }

  readonly lengthComputable: boolean

  readonly loaded: number

  readonly total: number
}

interface PromiseRejectionEventInit extends EventInit {
  promise?: any
  reason?: any
}
class PromiseRejectionEvent extends Event {
  constructor(type: string, eventInitDict?: PromiseRejectionEventInit) {
    super(type, eventInitDict)
    this.promise = eventInitDict?.promise || null
    this.reason = eventInitDict?.reason || null
  }

  readonly promise: any

  readonly reason: any
}

interface SecurityPolicyViolationEventInit extends EventInit {
  blockedURI?: string
  columnNumber?: number
  documentURI?: string
  effectiveDirective?: string
  lineNumber?: number
  originalPolicy?: string
  referrer?: string
  sourceFile?: string
  statusCode?: number
  violatedDirective?: string
}
class SecurityPolicyViolationEvent extends Event {
  constructor(type: string, eventInitDict?: SecurityPolicyViolationEventInit) {
    super(type, eventInitDict)
    this.blockedURI = eventInitDict?.blockedURI || ''
    this.columnNumber = eventInitDict?.columnNumber || 0
    this.documentURI = eventInitDict?.documentURI || ''
    this.effectiveDirective = eventInitDict?.effectiveDirective || ''
    this.lineNumber = eventInitDict?.lineNumber || 0
    this.originalPolicy = eventInitDict?.originalPolicy || ''
    this.referrer = eventInitDict?.referrer || ''
    this.sourceFile = eventInitDict?.sourceFile || ''
    this.statusCode = eventInitDict?.statusCode || 0
    this.violatedDirective = eventInitDict?.violatedDirective || ''
  }

  readonly blockedURI: string

  readonly columnNumber: number

  readonly documentURI: string

  readonly effectiveDirective: string

  readonly lineNumber: number

  readonly originalPolicy: string

  readonly referrer: string

  readonly sourceFile: string

  readonly statusCode: number

  readonly violatedDirective: string
}

interface StorageEventInit extends EventInit {
  key?: string
  oldValue?: string
  newValue?: string
  url?: string
  storageArea?: Storage
}
class StorageEvent extends Event {
  constructor(type: string, eventInitDict?: StorageEventInit) {
    super(type, eventInitDict)
    this.key = eventInitDict?.key || ''
    this.oldValue = eventInitDict?.oldValue || ''
    this.newValue = eventInitDict?.newValue || ''
    this.url = eventInitDict?.url || ''
    this.storageArea = eventInitDict?.storageArea || null
  }

  readonly key: string

  readonly oldValue: string

  readonly newValue: string

  readonly url: string

  readonly storageArea: any
}

interface TransitionEventInit extends EventInit {
  propertyName?: string
  elapsedTime?: number
  pseudoElement?: string
}
class TransitionEvent extends Event {
  constructor(type: string, eventInitDict?: TransitionEventInit) {
    super(type, eventInitDict)
    this.propertyName = eventInitDict?.propertyName || ''
    this.elapsedTime = eventInitDict?.elapsedTime || 0
    this.pseudoElement = eventInitDict?.pseudoElement || ''
  }

  readonly propertyName: string

  readonly elapsedTime: number

  readonly pseudoElement: string
}

interface TouchEventInit extends EventInit {
  touches?: Touch[]
  targetTouches?: Touch[]
  changedTouches?: Touch[]
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  view?: any
}

// TODO(akashmahesh): Legacy TouchList interface support along with Touch[].
// see (https://developer.mozilla.org/en-US/docs/Web/API/TouchList)
class TouchEvent extends Event {
  constructor(type: string, eventInitDict?: TouchEventInit) {
    super(type, eventInitDict)
    this.touches = eventInitDict?.touches || []
    this.targetTouches = eventInitDict?.targetTouches || []
    this.changedTouches = eventInitDict?.changedTouches || []
    this.ctrlKey = eventInitDict?.ctrlKey || false
    this.shiftKey = eventInitDict?.shiftKey || false
    this.altKey = eventInitDict?.altKey || false
    this.metaKey = eventInitDict?.metaKey || false
    this.view = eventInitDict?.view || null
  }

  readonly touches: Touch[]

  readonly targetTouches: Touch[]

  readonly changedTouches: Touch[]

  readonly ctrlKey: boolean

  readonly shiftKey: boolean

  readonly altKey: boolean

  readonly metaKey: boolean

  readonly view: any
}

interface UIEventInit extends EventInit {
  view?: any
  detail?: number
}
class UIEvent extends Event {
  constructor(type: string, eventInitDict: UIEventInit | undefined) {
    super(type, eventInitDict)
    this.view = eventInitDict?.view || null
    this.detail = eventInitDict?.detail || 0
  }

  readonly view: any

  readonly detail: number
}

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
}

export type {
  AnimationEventInit,
  DragEventInit,
  ErrorEventInit,
  EventInit,
  FocusEventInit,
  HashChangeEventInit,
  KeyboardEventInit,
  MessageEventInit,
  PageTransitionEventInit,
  PopStateEventInit,
  ProgressEventInit,
  PromiseRejectionEventInit,
  StorageEventInit,
  SecurityPolicyViolationEventInit,
  TransitionEventInit,
  TouchEventInit,
  UIEventInit,
}
