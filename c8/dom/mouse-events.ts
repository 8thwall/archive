// @sublibrary(:dom-core-lib)
/* eslint-disable max-classes-per-file */
import {UIEvent, UIEventInit} from './dom-events'

interface MouseEventInit extends UIEventInit {
  screenX?: number
  screenY?: number
  clientX?: number
  clientY?: number
  button?: number
  buttons?: number
  relatedTarget?: EventTarget | null
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
}

class MouseEvent extends UIEvent {
  constructor(type: string, options?: MouseEventInit) {
    super(type, options)
    this.screenX = options?.screenX || 0
    this.screenY = options?.screenY || 0
    this.clientX = options?.clientX || 0
    this.clientY = options?.clientY || 0
    this.offsetX = this.clientX
    this.offsetY = this.clientY
    this.button = options?.button || 0
    this.buttons = options?.buttons || 0
    this.relatedTarget = options?.relatedTarget || null
    this.ctrlKey = options?.ctrlKey || false
    this.shiftKey = options?.shiftKey || false
    this.altKey = options?.altKey || false
    this.metaKey = options?.metaKey || false

    // Alias for clientX and clientY.
    this.x = options?.clientX || 0
    this.y = options?.clientY || 0

    // These are assigned based on CSS properties. Which are not fully implemented.
    this.pageX = options?.clientX || 0
    this.pageY = options?.clientY || 0
  }

  readonly screenX: number

  readonly screenY: number

  readonly clientX: number

  readonly clientY: number

  readonly button: number

  readonly buttons: number

  readonly relatedTarget: EventTarget | null

  readonly pageX: number

  readonly pageY: number

  readonly movementX: number

  readonly movementY: number

  readonly offsetX: number

  readonly offsetY: number

  readonly ctrlKey: boolean

  readonly shiftKey: boolean

  readonly altKey: boolean

  readonly metaKey: boolean

  readonly x: number

  readonly y: number
}

interface PointerEventInit extends MouseEventInit {
  pointerId?: number
  pointerType?: string
}

class PointerEvent extends MouseEvent {
  constructor(type: string, options?: PointerEventInit) {
    super(type, options)
    this.pointerId = options?.pointerId || 0
    this.pointerType = options?.pointerType || ''
  }

  readonly pointerId: number

  readonly pointerType: string
}

interface WheelEventInit extends MouseEventInit {
  deltaX?: number
  deltaY?: number
  deltaZ?: number
  deltaMode?: number
}

class WheelEvent extends MouseEvent {
  constructor(type: string, options?: WheelEventInit) {
    super(type, options)

    this.deltaX = options?.deltaX || 0
    this.deltaY = options?.deltaY || 0
    this.deltaZ = options?.deltaZ || 0
    this.deltaMode = options?.deltaMode || 0
  }

  readonly deltaX: number

  readonly deltaY: number

  readonly deltaZ: number

  readonly deltaMode: number
}

export {MouseEvent, PointerEvent, WheelEvent}
export type {MouseEventInit, WheelEventInit}
