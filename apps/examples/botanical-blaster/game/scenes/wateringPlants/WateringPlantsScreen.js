import {ScreenState} from '../SceneState'
import {ScreenStateManager} from '../SceneStateManager'
import {SceneIds} from '../Scenes'

const StateData = {
  plantsWatered: 0,
  maxPlants: 8,
}

export const WateringPlantsScreen = new ScreenState(StateData)

ScreenStateManager.registerScreen(
  SceneIds.WateringPlants,
  WateringPlantsScreen
)
