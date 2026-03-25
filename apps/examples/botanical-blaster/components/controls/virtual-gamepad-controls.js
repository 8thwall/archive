const ViritualGamepadEvents = Object.freeze({
  AnaglogMove: 'angalog-move',
  ButtonDown: 'button-down',
  ButtonUp: 'button-up',
})

export class AngalogMovedEvent extends Event {
  constructor(type, movementX, movementY) {
    super(type)
    this.movementX = movementX
    this.movementY = movementY
  }
}

class ViritualGamepadManagerClass extends EventTarget {
  constructor() {
    super()

    /**
     * @type {ViritualGamepadEvents}
     */
    this.events = ViritualGamepadEvents
  }

  triggerAnaglogMove(x, y) {
    this.dispatchEvent(
      new AngalogMovedEvent(ViritualGamepadEvents.AnaglogMove, x, y)
    )
  }

  triggerButtonDown() {
    this.dispatchEvent(new CustomEvent(ViritualGamepadEvents.ButtonDown))
  }

  triggerButtonUp() {
    this.dispatchEvent(new CustomEvent(ViritualGamepadEvents.ButtonUp))
  }
}

export const ViritualGamepadManager = new ViritualGamepadManagerClass()
