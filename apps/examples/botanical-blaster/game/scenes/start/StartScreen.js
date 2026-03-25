import {ScreenState} from '../SceneState'
import {ScreenStateManager} from '../SceneStateManager'
import {SceneIds} from '../Scenes'

const StateData = {}

export const StartScreen = new ScreenState(StateData)

StartScreen.addEventListener(ScreenState.Events.StateUpdated, () => {})

ScreenStateManager.registerScreen(SceneIds.Start, StartScreen)
