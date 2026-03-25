import {ScreenState} from '../SceneState'
import {ScreenStateManager} from '../SceneStateManager'
import {SceneIds} from '../Scenes'

const StateData = {
  itemHit: false,
}

export const GravityGunScreen = new ScreenState(StateData)

GravityGunScreen.addEventListener(ScreenState.Events.StateUpdated, () => {})

ScreenStateManager.registerScreen(SceneIds.GravityGun, GravityGunScreen)
