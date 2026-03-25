import {UIManager} from './ui'
import {ScreenIds} from './ScreenIds'
import {ScreenChangeEvent, ScreenManager} from './ScreenManager'
import AppFlow from './AppFlow'
import './Screens'
import {GamePad} from './Components/GamePad'
import {useAppState} from './useAppState'
export const App = () => {
  const {useState, useEffect} = React
  const [screen, setScreen] = useState(null)

  const [{gamepadShown}] = useAppState()

  useEffect(() => {
    AppFlow()
    ScreenManager.enterScreen(ScreenIds.Start)
  }, [])
  /**
   * @param {ScreenChangeEvent} param
   */
  const listener = ({data}) => {
    const screenComponent = ScreenManager.getScreen(data.id)
    ScreenManager.removeEventListener(
      ScreenManager.events.EnterScreen,
      listener
    )
    setScreen(screenComponent)
  }

  ScreenManager.addEventListener(ScreenManager.events.EnterScreen, listener)

  return React.createElement(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
      },
    },
    [
      screen && screen.render(),
      gamepadShown && React.createElement(GamePad, {}, null),
    ]
  )
}

UIManager.setUIRoot(App)
