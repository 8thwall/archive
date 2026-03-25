import * as ecs from '@8thwall/ecs'
import {Scene} from './scene'

const SceneManagerEvents = Object.freeze({
  BeforeEnterScene: 'before-enter-scene',
  EnterScene: 'enter-scene',
  ResetScene: 'reset-scene',
  ExitScene: 'exit-scene',
})

class SceneManagerClass extends EventTarget {
  constructor() {
    super()
    /**
     * @type {SceneManagerEvents} events
     */
    this.events = SceneManagerEvents
    /**
     * @type {Map<string,Scene>} _scenes
     */
    this._scenes = new Map()
    /**
     * @type {boolean} ready
     */
    this.ready = false
    /**
     * @type {boolean} removed
     */
    this.removed = false
  }

  /**
   * @param {string} id
   * @returns {* | undefined}
   */
  removeScene(id) {
    const sceneObject = this._scenes.get(id)
    this._scenes.delete(id)
    return sceneObject
  }

  /**
   * @param {string} id
   * @param {Scene} object
   */
  addScene(id, object) {
    this._scenes.set(id, object)
    object.hide()
  }

  /**
   * @param {string} id
   */
  getScene(id) {
    const scene = this._scenes.get(id)
    if (!scene) throw new Error(`Scene with id ${id} does not exist`)
    return scene
  }

  /**
   * @param {string} id
   */
  enterScene(id) {
    const scene = this.getScene(id)
    this.dispatchEvent(
      new CustomEvent(SceneManagerEvents.BeforeEnterScene, {detail: {id}})
    )
    scene.show()
    this.dispatchEvent(
      new CustomEvent(SceneManagerEvents.EnterScene, {detail: {id}})
    )
    return scene
  }

  /**
   * @param {string} id
   */
  resetScene(id) {
    const scene = this.getScene(id)
    scene.show()
    this.dispatchEvent(
      new CustomEvent(SceneManagerEvents.ResetScene, {detail: {id}})
    )
  }

  /**
   * @param {string} id
   */
  exitScene(id) {
    const scene = this.getScene(id)
    scene.hide()
    this.dispatchEvent(
      new CustomEvent(SceneManagerEvents.ExitScene, {detail: {id}})
    )
  }
}

export const SceneManager = new SceneManagerClass()

const SceneManagerComponent = ecs.registerComponent({
  name: 'SceneManager',
  schema: {
    startingScene: ecs.string,
  },
  add: (world, component) => {
    SceneManager.ready = true

    const {startingScene} = component.schema
    const inte = setInterval(() => {
      if (SceneManager._scenes.has(startingScene)) {
        SceneManager.enterScene(startingScene)
        clearInterval(inte)
      }
    }, 10)
  },
  remove: (world, component) => {
    SceneManager.removed = true
  },
})

export {SceneManagerComponent}
