import {SOCKET_URL} from '../common/websocket-constants'

const getUserSocketSpecifier = (userUuid: string) => {
  if (!userUuid) {
    return null
  }
  return {
    baseUrl: SOCKET_URL,
    params: {
      channel: `user.${userUuid}`,
    },
  }
}

export {
  getUserSocketSpecifier,
}
