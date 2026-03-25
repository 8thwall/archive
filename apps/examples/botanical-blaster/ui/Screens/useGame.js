import useIsMobile from '../useIsMobile'
import {useAppState} from '../useAppState'
import {PointerLockHelper} from '../../components'
export const useGame = () => {
  const [state, setState] = useAppState()
  const isMobile = useIsMobile()

  return {
    enter: () => {
      if (isMobile) {
        setState({
          gamepadShown: true,
        })
      } else {
        PointerLockHelper.enterLock()
      }
    },

    exit: () => {
      if (isMobile) {
        setState({
          gamepadShown: false,
        })
      } else {
        PointerLockHelper.exitLock()
      }
    },
  }
}
