import {useRef, useState} from 'react'
import SimplePeer from 'simple-peer'

import {useWebsocketHandler} from '../../hooks/use-websocket-handler'
import {
  StudioLinkActionType,
  StudioMessage,
  StudioWebRTCAnswerData,
} from '../webrtc/socket-data'
import {sendP2POffer} from '../webrtc/from-studio'
import type {SocketSpecifier} from '../../websockets/websocket-pool'

type IUseWebrtcConnect = {
  channelSpecifier: SocketSpecifier
  onData: (data: any) => void
}

type UseWebRtcConnectHookReturn = {
  isConnected: boolean
  connectToSimulator: (simulatorId: string) => Promise<void>
  disconnect: () => void
  sendData: (data: Object) => void
}

const PAYLOAD_SIZE_LIMIT_BYTES = 250_000

const useWebrtcConnect = (
  {channelSpecifier, onData}: IUseWebrtcConnect
): UseWebRtcConnectHookReturn => {
  const [isConnected, setIsConnected] = useState(false)
  const peerBroadcasterRef = useRef<SimplePeer | null>(null)
  const lastSimulatorIdRef = useRef<string>('')

  const destroyP2PConnection = async () => {
    setIsConnected(false)

    if (peerBroadcasterRef.current) {
      peerBroadcasterRef.current.destroy()
    }

    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  }

  const onCallAnswered = (webRTCData) => {
    if (peerBroadcasterRef.current) {
      peerBroadcasterRef.current.signal(webRTCData)
    }
  }

  /**
   * Listen for new client remote connection requests
   */
  const handleWebsocketMessage = (msg: { data: StudioMessage; action: string; }) => {
    const actionName = msg?.action
    const data = msg
    const isAnswerMessage = actionName === StudioLinkActionType.WEBRTC_ANSWER

    if (isAnswerMessage) {
      const answerData = (data as unknown as StudioWebRTCAnswerData).webRTCData
      const fromSimulatorId = (data as unknown as StudioWebRTCAnswerData).simulatorId

      if (lastSimulatorIdRef.current === fromSimulatorId) {
        onCallAnswered(answerData)
      }
    }
  }

  const connectToSimulator = async (simulatorId: string) => {
    if (isConnected) {
      // Maybe tell the user that something else is trying to connect and what do they want to do?
      // For now, just destroy the current connection and establish a new one
      await destroyP2PConnection()
    }

    // Denote which simulator we are expecting an answer from
    lastSimulatorIdRef.current = simulatorId

    const onP2PConnectionSuccess = () => {
      setIsConnected(true)
    }

    const onP2PConnectionClose = () => {
      destroyP2PConnection()
    }

    const onP2PConnectionError = () => {
      destroyP2PConnection()
    }

    // Create an offer and send it down the socket
    const peerBroadcaster = new SimplePeer({initiator: true, objectMode: true})

    peerBroadcaster.on('signal', (data) => {
      sendP2POffer(data, channelSpecifier, simulatorId)
    })

    peerBroadcaster.on('data', (data) => {
      const parsed = JSON.parse(data)

      onData(parsed)
    })

    // Wait for a connection success
    peerBroadcaster.on('connect', onP2PConnectionSuccess)
    peerBroadcaster.on('close', onP2PConnectionClose)
    peerBroadcaster.on('error', onP2PConnectionError)

    // Store a reference so we can destroy this later
    peerBroadcasterRef.current = peerBroadcaster
  }

  const disconnect = async () => {
    try {
      await destroyP2PConnection()
    } catch {
      peerBroadcasterRef.current = null
      lastSimulatorIdRef.current = ''
    }
  }

  const sendData = (payload: Object) => {
    const payloadSize = JSON.stringify(payload).length

    // If the payload is greater than 250 KB, don't send it to avoid the browser from
    // terminating the P2P connection.
    if (payloadSize > PAYLOAD_SIZE_LIMIT_BYTES) {
      if (BuildIf.LOCAL_DEV) {
        // eslint-disable-next-line no-console,max-len
        console.error(`Attempted to send payload of size ${payloadSize} bytes over WebRTC! Message not sent`)
      }
      return
    }

    if (peerBroadcasterRef.current) {
      peerBroadcasterRef.current.send(JSON.stringify(payload))
    }
  }

  useWebsocketHandler(handleWebsocketMessage, channelSpecifier)

  return {
    isConnected,
    connectToSimulator,
    disconnect,
    sendData,
  }
}

export {
  useWebrtcConnect,
  UseWebRtcConnectHookReturn,
}
