import {useEffect, useRef} from 'react'

import websocketPool, {
  SocketRestartListener, SocketSpecifier, socketSpecifiersEqual,
} from '../websockets/websocket-pool'

export const useWebsocketRestart = (
  onRestart: SocketRestartListener,
  specifier: SocketSpecifier
) => {
  const functionRef = useRef<SocketRestartListener>()
  functionRef.current = onRestart

  const previousSpecToUse = useRef<SocketSpecifier>()
  const specToUse = socketSpecifiersEqual(previousSpecToUse.current, specifier)
    ? previousSpecToUse.current
    : specifier
  previousSpecToUse.current = specToUse

  useEffect(() => {
    if (!specToUse) {
      return undefined
    }

    const handler = () => functionRef.current()

    websocketPool.addRestartListener(specToUse, handler)

    return () => {
      websocketPool.removeRestartListener(specToUse, handler)
    }
  }, [specToUse])
}
