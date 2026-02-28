import {LINK_SOCKET_URL} from '../common/websocket-constants'

const getChannelSpecifier = (channelName: string) => {
  if (!channelName) {
    return null
  }
  return {
    baseUrl: LINK_SOCKET_URL,
    params: {
      channel: channelName,
    },
  }
}

export {
  getChannelSpecifier,
}
