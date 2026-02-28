import React from 'react'

import WebsocketPool, {SocketSpecifier} from '../websockets/websocket-pool'

// NOTE(pawel) Some projects take more than 10 seconds to build due to large library
// bundles included by the user.
const MULTI_BUILD_TIMEOUT = 60 * 1000

interface MultiBuildCoordinationResult {
  buildStart: () => void
  buildComplete: () => void
}

const useMultiBuildCoordination = (specifier: SocketSpecifier):
MultiBuildCoordinationResult => {
  const currentlyBuilding = React.useRef(0)
  const reloadTimer = React.useRef(null)

  const triggerReload = () => {
    WebsocketPool.broadcastMessage(specifier, {action: 'RELOAD'})
  }

  const debounceReload = () => {
    clearTimeout(reloadTimer.current)
    reloadTimer.current = setTimeout(() => {
      currentlyBuilding.current = 0
      triggerReload()
    }, MULTI_BUILD_TIMEOUT)
  }

  const buildStart = () => {
    currentlyBuilding.current += 1
    debounceReload()
  }

  const buildComplete = () => {
    currentlyBuilding.current -= 1
    debounceReload()
    if (currentlyBuilding.current === 0) {
      clearTimeout(reloadTimer.current)
      triggerReload()
    }
  }

  React.useEffect(() => () => clearTimeout(reloadTimer.current), [])

  return {buildStart, buildComplete}
}

export {
  useMultiBuildCoordination,
}
