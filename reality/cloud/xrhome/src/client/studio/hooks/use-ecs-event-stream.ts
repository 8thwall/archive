import type {DebugMessage} from '@ecs/shared/debug-messaging'

import {useEffect} from 'react'

import {useWebrtcConnect} from './use-webrtc-connect'
import WebsocketPool, {SocketSpecifier} from '../../websockets/websocket-pool'
import {useWindowMessageHandler} from '../../hooks/use-window-message-handler'
import useSocket from '../../common/use-socket'
import {useAppPreviewWindow} from '../../common/app-preview-window-context'
import type {StudioDebugSession} from '../../editor/editor-reducer'

type IUseEcsEventStream = {
  currentSession: StudioDebugSession | null
  inlineSimulatorId: string
  channelSpecifier: SocketSpecifier
  onDebugMessage: (msg: DebugMessage) => void
}

type UseEcsEventStreamHookReturn = {
  sendData: (
    msg: DebugMessage, simulatorId?: string,
    attemptPostMessage?: boolean, attemptWebrtc?: boolean
  ) => void
  sendDataViaPostMessage: (msg: DebugMessage, simulatorId?: string) => void
  sendDataViaSockets: (msg: DebugMessage) => void
  sendDataViaWebrtc: (msg: DebugMessage) => void
}

/**
 * The idea with this hook is to abstract away the transport of how debug messages from ECS
 * arrive. We only care about actually getting the events. Sometimes we might care to send
 * events via certain transports, but however it arrives to the client, that doesn't matter.
 */
const useEcsEventStream = ({
  currentSession,
  inlineSimulatorId,
  channelSpecifier,
  onDebugMessage,
}: IUseEcsEventStream): UseEcsEventStreamHookReturn => {
  const {getInlinePreviewWindow, getFramedPreviewWindow} = useAppPreviewWindow()

  const currentSimulatorId = currentSession?.simulatorId

  // Purely for debug purposes
  const onDebugMessageFromSockets = (msg: DebugMessage) => {
    // console.log('===== SOCKET =====', msg.action)
    onDebugMessage(msg)
  }
  const onDebugMessageFromWebrtc = (msg: DebugMessage) => {
    // console.log('===== WEBRTC =====', msg.action)
    onDebugMessage(msg)
  }
  const onDebugMessageFromPostMessage = (msg: DebugMessage) => {
    // console.log('===== POST MESSAGE =====', msg.action)
    onDebugMessage(msg)
  }

  const {isConnected, sendData: sendDataViaWebrtc} = useWebrtcConnect({
    channelSpecifier,
    onData: onDebugMessageFromWebrtc,
  })

  const handleEcsReadyEvent = (msg: DebugMessage) => {
    switch (msg.action) {
      case 'ECS_READY': {
        const {simulatorId} = msg
        if (simulatorId && simulatorId === currentSimulatorId) {
          // @mchen - Commented out for now, no webRTC activated
          // connectToSimulator(simulatorId)
        }
        break
      }
      default:
    }
  }

  // For webrtc, we need to listen to an ecs ready event to know when to start
  // connecting. This can happen over sockets or post message.
  useSocket(channelSpecifier, handleEcsReadyEvent)
  useWindowMessageHandler((event) => {
    const debugMessage = event.data

    if (debugMessage.action) {
      handleEcsReadyEvent(debugMessage)
    }
  })

  // When the current simulator changes, connect to it via webrtc
  useEffect(() => {
    if (currentSimulatorId) {
      // @mchen - Commented out for now, no webRTC activated
      // connectToSimulator(currentSimulatorId)
    }
  }, [currentSimulatorId])

  // For other events that a developer cares about, handle them here.
  useSocket(channelSpecifier, onDebugMessageFromSockets)
  useWindowMessageHandler((event) => {
    const debugMessage = event.data

    if (debugMessage.action) {
      onDebugMessageFromPostMessage(debugMessage)
    }
  })

  const getTargetWindow = (simulatorId?: string): Window | null => {
    const isTargetSimulatorInline = simulatorId && simulatorId === inlineSimulatorId
    const isTargetSimulatorStandalone = simulatorId && simulatorId !== inlineSimulatorId
    // NOTE(Julie): We were attempting to recover the previously opened preview tab
    // so we could use postMessage, however this caused issues and was opening a blank tab
    // since we did not have enough info to determine whether or not the tab exists within the
    // current browser or somewhere external (e.g. a different browser or device session)
    // This is removed for now, and will fallback to using websocket.

    if (isTargetSimulatorInline) {
      return getInlinePreviewWindow()
    } else if (isTargetSimulatorStandalone) {
      return getFramedPreviewWindow()
    }

    return null
  }

  const sendDataViaPostMessage = (msg: DebugMessage, simulatorId?: string) => {
    const targetWindow = getTargetWindow(simulatorId)

    targetWindow?.postMessage(msg, '*')
  }

  const sendDataViaSockets = ({action, ...data}: DebugMessage) => {
    if (!channelSpecifier) {
      return
    }

    WebsocketPool.broadcastMessage(channelSpecifier, {action, data})
  }

  /**
   * Sends using a channel available. Default will be sockets
   * but if specified to attempt other transports, will attempt to use that instead. On the
   * condition that transport is not ready or connected, default/fallback (sockets) will be used.
   */
  const sendDataOverTransport = (
    data: DebugMessage,
    simulatorId?: string,
    attemptPostMessage: boolean = true,
    attemptWebrtc: boolean = false
  ) => {
    const targetWindow = getTargetWindow(simulatorId)
    const canPostMessage = targetWindow
    const canSendViaWebrtc = isConnected

    if (attemptPostMessage && canPostMessage) {
      sendDataViaPostMessage(data, simulatorId)
    } else if (attemptWebrtc && canSendViaWebrtc) {
      sendDataViaWebrtc(data)
    } else {
      sendDataViaSockets(data)
    }
  }

  return {
    sendData: sendDataOverTransport,
    sendDataViaSockets,
    sendDataViaPostMessage,
    sendDataViaWebrtc,
  }
}

export {
  useEcsEventStream,
  UseEcsEventStreamHookReturn,
}
