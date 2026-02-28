import {StudioLinkActionType, StudioWebRTCOffer} from './socket-data'
import websocketPool, {SocketSpecifier} from '../../websockets/websocket-pool'

/**
 * Sends data to XRHome needed to start a P2P connection with a simulator browser window.
 */
const sendP2POffer = (
  webRTCData: unknown,
  channelSpecifier: SocketSpecifier,
  simulatorId: string
) => {
  const payload: StudioWebRTCOffer = {
    action: StudioLinkActionType.WEBRTC_OFFER,
    data: {
      simulatorId,
      webRTCData,
    },
  }

  // This payload needs to be caught by the simulator app!
  // Then they can signal back over the same WS and this component needs to handle that
  websocketPool.broadcastMessage(channelSpecifier, payload)
}

export {
  sendP2POffer,
}
