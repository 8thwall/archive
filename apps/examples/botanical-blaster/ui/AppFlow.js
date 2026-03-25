import {SceneManager} from '../components/scene/scene-manager'
import {GameState} from '../game/GameState'
import {ScreenIds} from './ScreenIds'
import {ScreenManager} from './ScreenManager'
import {SceneIds} from '../game/scenes/Scenes'

export default function () {
  GameState.plantersScreen.addEventListener(
    GameState.plantersScreen.events.StateUpdated,
    () => {
      if (
        GameState.plantersScreen.state.plantersHit ==
        GameState.plantersScreen.state.maxPlanters
      ) {
        ScreenManager.enterScreen(ScreenIds.Section1Complete)
      }
    }
  )
  GameState.wateringPlantsScreen.addEventListener(
    GameState.wateringPlantsScreen.events.StateUpdated,
    () => {
      if (
        GameState.wateringPlantsScreen.state.plantsWatered ==
        GameState.wateringPlantsScreen.state.maxPlants
      ) {
        ScreenManager.enterScreen(ScreenIds.Section2Complete)
      }
    }
  )

  let timeOut = null

  window.addEventListener('exit-gravity-scene', () => {
    if (timeOut !== null) clearTimeout(timeOut)
    ScreenManager.enterScreen(ScreenIds.Section3Complete)
  })

  SceneManager.addEventListener(
    SceneManager.events.EnterScene,
    /**
     * @param {CustomEvent} param
     */
    ({detail}) => {
      const {id} = detail
      if (id == SceneIds.GravityGun) {
        timeOut = setTimeout(() => {
          timeOut = null
          ScreenManager.enterScreen(ScreenIds.Section3Complete)
        }, 90_000)
      }
    }
  )
}
