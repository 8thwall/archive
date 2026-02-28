import websocketPool, {SocketSpecifier} from '../websockets/websocket-pool'
import {getUserSocketSpecifier} from '../user/get-user-socket-specifier'

const broadcastRepoBecameActive = (
  userUuid: string,
  editorChatChannelSpecifier: SocketSpecifier | null,
  myBrowserUuid: string,
  repoId: string
) => {
  const userSocketSpecifier = getUserSocketSpecifier(userUuid)
  websocketPool.broadcastMessage(userSocketSpecifier, {
    action: 'ACTIVE_BROWSER_SET',
    data: {
      activeBrowser: myBrowserUuid,
      repoId,
    },
  })

  // TODO(pawel) Remove after migration period. The editorChatChannelSpecifier is set by the
  // parent component for the particular project/module. This only works on the top level.
  if (editorChatChannelSpecifier) {
    websocketPool.broadcastMessage(editorChatChannelSpecifier, {
      action: 'SET_ACTIVE_BROWSER',
      data: {activeBrowser: myBrowserUuid},
    })
  }
}

export {
  broadcastRepoBecameActive,
}
