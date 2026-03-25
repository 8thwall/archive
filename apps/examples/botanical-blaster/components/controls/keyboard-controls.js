import * as ecs from '@8thwall/ecs'

export const KeyBoardEvents = {
  KeyUp: 'key-up',
  KeyDown: 'key-down',
}

/**
 * A record of pressed and released keys.
 * @type {Object.<string, boolean>}
 */
const keyState = {}
export const mapKey = key => `${key.length == 1 ? `Key${key.toUpperCase()}` : key}`
let cleanUp = () => {}
// Register the component with the ECS system
const KeyBoardControls = ecs.registerComponent({
  name: 'KeyBoardControls',
  schema: {
    keys: ecs.string,
  },
  schemaDefaults: {
    keys: 'w,a,s,d,Space',
  },
  add: (world, component) => {
    const keyString = component.schema.keys
    /**
     * @type {string[]}
     */
    const keys = keyString.split(',')

    for (const key of keys) {
      keyState[mapKey(key)] = false
    }
    component.keyState = keyState

    /**
     * @param {KeyboardEvent} event
     */
    const keyDownListener = ({code}) => {
      if (keyState[code] !== undefined) {
        keyState[code] = true
        world.events.dispatch(world.events.globalId, KeyBoardEvents.KeyDown, {
          key: code,
          keyState,
        })
      }
    }

    /**
     * @param {KeyboardEvent} event
     */
    const keyUpListener = ({code}) => {
      if (keyState[code] !== undefined) {
        keyState[code] = false
        world.events.dispatch(world.events.globalId, KeyBoardEvents.KeyUp, {
          key: code,
          keyState,
        })
      }
    }

    window.addEventListener('keydown', keyDownListener)
    window.addEventListener('keyup', keyUpListener)

    cleanUp = () => {
      window.removeEventListener('keydown', keyDownListener)
      window.removeEventListener('keyup', keyUpListener)
    }
  },
  remove: (world, component) => {
    cleanUp()
  },
})
export {KeyBoardControls}
