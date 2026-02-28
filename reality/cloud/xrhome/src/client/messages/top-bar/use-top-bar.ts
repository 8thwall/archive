import React from 'react'

import type {TopBarState} from './top-bar-reducer'
import topBarActions from './top-bar-actions'
import useActions from '../../common/use-actions'

/* Activate a top bar with the message your messageFunc supply
 * Auto-hide the top bar when your component unmount
 * params deps dependencies for when to re-run your top bar message function
*/
const useTopBar = (messageFunc: () => TopBarState, deps: React.DependencyList): void => {
  const {setShowTopBar, setTopBarMessage} = useActions(topBarActions)
  React.useEffect(() => {
    setTopBarMessage(messageFunc())
    return () => {
      setShowTopBar(false)
    }
  }, deps)
}

export default useTopBar
