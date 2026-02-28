import {useEffect} from 'react'

import type {SocketCallback, SocketSpecifier} from '../websockets/websocket-pool'
import websocketPool from '../websockets/websocket-pool'

const useSpecifiersWebsocketHandler = (
  onMsg: SocketCallback, specifiers: SocketSpecifier[]
) => {
  useEffect(() => {
    if (!specifiers) {
      return undefined
    }

    specifiers.forEach((specifier) => {
      websocketPool.addHandler(specifier, onMsg)
    })

    return () => {
      specifiers.forEach((spec) => {
        websocketPool.removeHandler(spec, onMsg)
      })
    }
  }, [specifiers, onMsg])
}

export {
  useSpecifiersWebsocketHandler,
}
