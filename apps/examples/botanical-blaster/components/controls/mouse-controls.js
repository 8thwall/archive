import * as ecs from '@8thwall/ecs'

export const MouseEvents = {
  ButtonDown: 'button-down',
  ButtonUp: 'button-up',
}

export const MouseButtons = {
  Primary: 'primary',
  Secondary: 'secondary',
  Middle: 'middle',
}
/**
 * Maps a given key code to the corresponding MouseButtons value.
 *
 * @param {number} keyCode - The key code (32 for spacebar).
 * @returns {string} - The corresponding value from the MouseButtons object.
 */
const mapKeyToButton = (keyCode) => {
  switch (keyCode) {
    case 32:
      return MouseButtons.Primary
    default:
      throw new Error('Unsupported key')
  }
}

export class MouseEventWrap {
  /**
   * @param {string} button
   * @param {Event} nativeEvent
   */
  constructor(button, nativeEvent) {
    /**
     * @type {string} button
     */
    this.button = button
    /**
     * @type {Event} nativeEvent
     */
    this.nativeEvent = nativeEvent
  }
}

let cleanUp = () => {}
const MouseControls = ecs.registerComponent({
  name: 'MouseControls',
  schema: {},
  schemaDefaults: {},
  add: (world, component) => {
    /**
     * @param {KeyboardEvent} event
     */
    const keyDown = (event) => {
      if (event.code === 'Space') {
        world.events.dispatch(
          world.events.globalId,
          MouseEvents.ButtonDown,
          new MouseEventWrap(mapKeyToButton(event.keyCode), event)
        )
      }
    }
    window.addEventListener('keydown', keyDown)
    /**
     * @param {KeyboardEvent} event
     */
    const keyUp = (event) => {
      if (event.code === 'Space') {
        world.events.dispatch(
          world.events.globalId,
          MouseEvents.ButtonUp,
          new MouseEventWrap(mapKeyToButton(event.keyCode), event)
        )
      }
    }
    window.addEventListener('keyup', keyUp)
    cleanUp = () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
    }
  },
  remove: (world, component) => {
    cleanUp()
  },
})

export {MouseControls}
