import {PlayerController} from '../../components/controls/player-controller'
import {SceneManager} from '../../components/scene/scene-manager'
import {ScreenState} from './SceneState'
import {SceneIds} from './Scenes'

class ScreenStateRegister {
  constructor() {
    /**
     * @type {Map<string,ScreenState>} screens
     */
    this.screens = new Map()
    /**
     * @param {string} currentScreenId
     */
    this.currentScreenId = SceneIds.Start
  }

  /**
   * @param {string} id
   * @param {ScreenState} state
   */
  registerScreen(id, state) {
    this.screens.set(id, state)
  }

  /**
   * @param {*} id
   */
  removeScreen(id) {
    this.screens.delete(id)
  }

  /**
   * @param {*} id
   */
  goToScene(id) {
    SceneManager.exitScene(this.currentScreenId)
    const scene = SceneManager.enterScene(id)
    if (scene.target && scene.position) {
      PlayerController.instance.teleportTo(
        scene.position.x,
        scene.position.y,
        scene.position.z
      )
      PlayerController.instance.lookAt(
        scene.position.x,
        scene.position.y,
        scene.position.z,
        scene.target.x,
        scene.target.y,
        scene.target.z
      )
    }

    this.currentScreenId = id
  }
}

export const ScreenStateManager = new ScreenStateRegister()
