import {GameState} from '../../game/GameState'
import {SceneIds} from '../../game/scenes/Scenes'
import {SectionComplete} from '../Components/SectionComplete'
import {ScreenIds} from '../ScreenIds'
import {ScreenManager} from '../ScreenManager'
import {useGame} from './useGame'

ScreenManager.registerScreen(ScreenIds.Section1Complete, () => {
  const {enter} = useGame()
  return React.createElement(SectionComplete, {
    reset: () => {
      GameState.screenState.goToScene(SceneIds.Planters)
      ScreenManager.enterScreen(ScreenIds.Section1)
      enter()
    },

    next: () => {
      GameState.screenState.goToScene(SceneIds.WateringPlants)
      ScreenManager.enterScreen(ScreenIds.Section2)
      enter()
    },
  })
})
