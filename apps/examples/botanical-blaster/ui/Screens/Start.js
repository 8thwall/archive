import {GameState} from '../../game/GameState'
import {ImageButton} from '../Components/ImageButton'
import {ScreenOverlay} from '../Components/ScreenOverlay'
import {SVGButtons} from '../SVGButtons'
import {ScreenIds} from '../ScreenIds'
import {ScreenManager} from '../ScreenManager'
import {useGame} from './useGame'

ScreenManager.registerScreen(ScreenIds.Start, () => {
  const {enter} = useGame()
  return React.createElement(
    ScreenOverlay,
    {},

    React.createElement(
      ImageButton,
      {
        buttonNormalSrc: SVGButtons.Start,
        buttonClickSrc: SVGButtons.Start_click,
        onClick: () => {
          GameState.screenState.goToScene(GameState.SceneIds.Planters)
          ScreenManager.enterScreen(ScreenIds.Section1)
          enter()
        },
      },
      'Start'
    )
  )
})
