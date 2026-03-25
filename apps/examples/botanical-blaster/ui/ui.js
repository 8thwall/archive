import * as ecs from '@8thwall/ecs'
import {LoadReact} from './LoadReact'

export class UIManagerClass {
  constructor() {
    this.uiRoot = null
    this.entityId = null
    this.world = null

    this.clear = () => {}
  }

  setUIRoot(uiRoot) {
    this.uiRoot = uiRoot
  }

  setEntity(world, entityId) {
    this.world = world
    this.entityId = entityId
  }

  playClick() {
    this.clear()
    if (ecs.Audio.has(this.world, this.entityId)) {
      const audio = ecs.Audio.cursor(this.world, this.entityId)
      audio.paused = false
      const timeOut = setTimeout(() => {
        this.clear()
      }, 250)
      this.clear = () => {
        const audio = ecs.Audio.cursor(this.world, this.entityId)
        audio.paused = true
        clearTimeout(timeOut)
      }
    }
  }
}

export const UIManager = new UIManagerClass()

const UI = ecs.registerComponent({
  name: 'UI',
  schema: {},
  schemaDefaults: {},
  add: (world, component) => {
    UIManager.setEntity(world, component.eid)
    try {
      (async () => {
        await LoadReact()

        // @ts-ignore
        const {ReactDOM, React} = window

        const {createRoot} = ReactDOM

        const uiParent = document.createElement('div')
        uiParent.id = 'ui-root'
        uiParent.style.position = 'absolute'
        uiParent.style.zIndex = '100000'
        uiParent.style.left = '0'
        uiParent.style.top = '0'
        uiParent.style.display = 'flex'
        uiParent.style.justifyContent = 'center'
        uiParent.style.alignItems = 'center'
        uiParent.style.width = '100%'
        uiParent.style.height = '100%'
        uiParent.style.pointerEvents = 'none'
        document.body.append(uiParent)
        const root = createRoot(uiParent)

        if (!UIManager.uiRoot) throw new Error('UI root must be set to use the ui container')
        root.render(React.createElement(UIManager.uiRoot, {}))
      })()
    } catch (error) {
      console.warn('error in ui')
      console.error(error)
    }
  },
  remove: (world, component) => {},
})

export {UI}
