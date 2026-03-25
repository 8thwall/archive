import * as ecs from '@8thwall/ecs'
export const MouseState = {
  movementX: 0,
  movementY: 0,
}

export const PointerLockEvents = Object.freeze({
  EnterLock: 'enter-lock',
  ExitLock: 'exit-lock',
  MouseMove: 'mouse-move',
})

class PointerLockHelperClass extends EventTarget {
  constructor() {
    super()
    /**
     * @type {HTMLElement} element
     */
    this.element = null
    /**
     * @type {PointerLockEvents} element
     */
    this.events = PointerLockEvents
    this.world = null

    this.tracking = false

    /**
     * @type {()=>void} clear
     */
    this.clear = () => {}

    /**
     * @type {()=>void} clear
     */
    this.dispose = () => {}
  }

  /**
   * @param {HTMLElement} element
   */
  setElement(element) {
    this.element = element
    const onPointerLockChange = () => {
      if (document.pointerLockElement === null) {
        this.world.events.dispatch(
          this.world.events.globalId,
          PointerLockEvents.ExitLock,
          {}
        )
        this.clear()
        this.dispatchEvent(new CustomEvent(PointerLockEvents.ExitLock))
        this.tracking = false
      } else {
        this.world.events.dispatch(
          this.world.events.globalId,
          PointerLockEvents.EnterLock,
          {}
        )
        this.tracking = true
        this.dispatchEvent(new CustomEvent(PointerLockEvents.EnterLock))
      }
    }
    document.addEventListener('pointerlockchange', onPointerLockChange, false)

    const elementClickListener = () => {
      this.enterLock()
    }

    this.element.addEventListener('click', elementClickListener)

    /**
     * @type {()=>void} clear
     */
    this.dispose = () => {
      this.clear()
      element.removeEventListener('click', elementClickListener)
      document.removeEventListener(
        'pointerlockchange',
        onPointerLockChange,
        false
      )
    }
  }

  setWorld(world) {
    this.world = world
  }

  enterLock() {
    this.clear()
    this.element.requestPointerLock()

    const mouseMove = (event) => {
      if (!this.tracking) return
      MouseState.movementX = event.movementX
      MouseState.movementY = event.movementY
      this.world.events.dispatch(
        this.world.events.globalId,
        PointerLockEvents.MouseMove,
        MouseState
      )
    }
    window.addEventListener('mousemove', mouseMove)
    this.clear = () => {
      window.removeEventListener('mousemove', mouseMove)
    }
  }

  exitLock() {
    this.clear()
    document.exitPointerLock()
  }
}

export const PointerLockHelper = new PointerLockHelperClass()

/**
 * Pointer Lock Component
 * ---
 * Useful for creating first person controls where the pointer is locked to the canvas.
 */
const PointerLock = ecs.registerComponent({
  name: 'PointerLock',
  schema: {},
  add: (world, component) => {
    PointerLockHelper.setWorld(world)
    PointerLockHelper.setElement(world.three.renderer.domElement)
  },
  remove: (world, component) => {
    PointerLockHelper.dispose()
  },
})
export {PointerLock}
