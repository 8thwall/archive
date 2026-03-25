import {ScreenState} from '../SceneState'
import {ScreenStateManager} from '../SceneStateManager'
import {SceneIds} from '../Scenes'

const StateData = {
  plantersHit: 0,
  maxPlanters: 4,
}

export const PlantersScreenState = new ScreenState(StateData)

ScreenStateManager.registerScreen(SceneIds.Planters, PlantersScreenState)
