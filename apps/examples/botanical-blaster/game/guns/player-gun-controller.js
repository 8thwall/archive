import * as ecs from '@8thwall/ecs'
import {
  MouseButtons,
  MouseEventWrap,
  MouseEvents,
} from '../../components/controls/mouse-controls'
import {CameraManager} from '../../components/controls/camera-controls'
import {SceneManager} from '../../components/scene/scene-manager'
import {ActiveSceneOnly} from '../../components/scene/active-scene-only'
import {
  GunControllerEvents,
  GunBaseController,
  FireGunEvent,
} from './gun-base-controller'
import {ViritualGamepadManager} from '../../components/controls/virtual-gamepad-controls'

export const PlayerGonControlerrEvetns = {
  GunFireStop: 'gun-fire-stop',
  Reload: 'reload',
  SetActiveGun: 'set-active-gun',
}

class PlayerGunState {
  constructor() {
    this.isFireing = false
    this.lastFire = 0
    this.fireDelay = 100
    this.activeGun = null
  }

  setActiveGun(activeGun) {
    this.activeGun = activeGun
  }

  fire(isFireing, lastFire) {
    this.isFireing = isFireing
    if (lastFire !== undefined) this.lastFire = lastFire
  }
}

/**
 * @type {PlayerGunState}
 */
let currentPlayerState = null

let cleanUp = () => {}
const PlayerGunController = ecs.registerComponent({
  name: 'PlayerGunController',
  schema: {
    playerGuns: ecs.eid,
  },
  schemaDefaults: {},
  add: (world, component) => {
    currentPlayerState = new PlayerGunState()

    const {playerGuns} = component.schema

    let activeGun = null

    SceneManager.addEventListener(
      SceneManager.events.EnterScene,
      /**
       * @param {CustomEvent} param
       */
      ({detail}) => {
        const activeSceneId = detail.id

        for (const gunContainer of world.getChildren(playerGuns)) {
          if (ActiveSceneOnly.has(world, gunContainer)) {
            const {sceneId} = ActiveSceneOnly.get(world, gunContainer)

            for (const gun of world.getChildren(gunContainer)) {
              if (GunBaseController.has(world, gun)) {
                if (sceneId == activeSceneId) {
                  activeGun = gun
                }
              }
            }
          }
        }
        currentPlayerState.setActiveGun(activeGun)
      }
    )

    const fire = () => {
      const now = world.time.absolute
      if (now - currentPlayerState.lastFire >= currentPlayerState.fireDelay) {
        currentPlayerState.fire(true, now)
        const forward = CameraManager.getForwardDirection()
        world.events.dispatch(
          activeGun,
          GunControllerEvents.Fire,
          new FireGunEvent([forward.x, forward.y, forward.z])
        )
      } else {
        currentPlayerState.fire(true)
      }
    }

    /**
     * @param {MessageEvent<MouseEventWrap>} event
     */
    const buttonDown = ({data}) => {
      if (!activeGun) return
      if (data.button === MouseButtons.Primary) {
        fire()
      }
    }
    /**
     */
    const gamepadButtonDown = () => {
      if (!activeGun) return
      fire()
    }
    world.events.addListener(
      world.events.globalId,
      MouseEvents.ButtonDown,
      buttonDown
    )

    ViritualGamepadManager.addEventListener(
      ViritualGamepadManager.events.ButtonDown,
      gamepadButtonDown
    )

    /**
     * @param {MessageEvent<MouseEventWrap>} event
     */
    const buttonUp = ({data}) => {
      if (!activeGun) return
      if (data.button === MouseButtons.Primary) {
        currentPlayerState.fire(false)
        world.events.dispatch(
          world.events.globalId,
          PlayerGonControlerrEvetns.GunFireStop,
          {}
        )
      }
    }

    world.events.addListener(
      world.events.globalId,
      MouseEvents.ButtonUp,
      buttonUp
    )

    cleanUp = () => {
      world.events.removeListener(
        world.events.globalId,
        MouseEvents.ButtonDown,
        buttonDown
      )
      world.events.removeListener(
        world.events.globalId,
        MouseEvents.ButtonUp,
        buttonUp
      )

      ViritualGamepadManager.removeEventListener(
        ViritualGamepadManager.events.ButtonDown,
        gamepadButtonDown
      )
    }
  },
  remove: (world, component) => {
    cleanUp()
  },
  tick: (world) => {
    // if (!currentPlayerState) return;
    // if (currentPlayerState.isFireing && currentPlayerState.activeGun) {
    // let delta = world.time.absolute - currentPlayerState.lastFire;
    // if (delta >= currentPlayerState.fireDelay) {
    //     currentPlayerState.lastFire = world.time.absolute;
    //     const forward = CameraManager.getForwardDirection();
    //     world.events.dispatch(
    //       currentPlayerState.activeGun,
    //       GunControllerEvents.GunFire,
    //       new FireGunEvent([forward.x, forward.y, forward.z], data)
    //     );
    // }
    // }
  },
})

export {PlayerGunController}
