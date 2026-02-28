import {BroadcastChannel} from 'broadcast-channel'
import uuid from 'uuid/v4'

const REPO_BROADCAST_CHANNEL_NAME = 'repo-broadcast-channel'
const CHANNEL_CLOSE_TIMEOUT = 1000 * 10

const currentTabId = uuid()

export type RepoBroadcastListener = (channel: string, message: RepoCoordinationMessage) => void

// Listeners are universal i.e. they receive messages from any broadcast channel
// It is listener responsibility to filter unwanted messages
// This provides the best flexibility downstream
// Tabs do not received their own message echoed back to them
let listeners: RepoBroadcastListener[] = []

type RepoCoordinationBlockStage =
  'begin-write-operation' |
  'run-write-operation' |
  'end-write-operation'

export interface RepoCoordinationMessage {
  type: RepoCoordinationBlockStage
  actionName: string
}

interface RawMessage {
  channel: string
  senderId: string
  data: RepoCoordinationBlockStage  // TODO(pawel) backwards compatible, remove after rollout window
  message: RepoCoordinationMessage
}

let broadcastChannel: BroadcastChannel<RawMessage> = null

let closeTimeout: ReturnType<typeof setTimeout>

const closeChannel = () => {
  broadcastChannel?.close()
  broadcastChannel = null
}

const startClose = () => {
  if (closeTimeout) {
    return
  }
  closeTimeout = setTimeout(() => {
    closeChannel()
  }, CHANNEL_CLOSE_TIMEOUT)
}

const maybeStartClose = () => {
  if (listeners.length === 0) {
    startClose()
  }
}

const createChannel = () => {
  broadcastChannel = new BroadcastChannel<RawMessage>(REPO_BROADCAST_CHANNEL_NAME, {
    idb: {
      onclose: async () => {
        // The onclose event is just the IndexedDB closing.
        // This can occur in browsers that don't support native BroadcastChannel
        // and revert back to indexedDB e.g. safari
        await broadcastChannel.close()
        createChannel()
      },
    },
  })
  broadcastChannel.onmessage = (rawMsg: RawMessage) => {
    const {channel, data, senderId} = rawMsg

    // @TODO(pawel) remove after rollout window; old format to new format
    const message = rawMsg.message || {
      type: data,
      actionName: 'unknownPreviousVersion',
    }
    if (senderId !== currentTabId) {
      listeners.forEach((listener) => {
        listener(channel, message)
      })
    }
  }
}

const ensureChannel = () => {
  if (broadcastChannel) {
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      closeTimeout = null
    }
  } else {
    createChannel()
  }
}

const addRepoBroadcastListener = (listener: RepoBroadcastListener) => {
  ensureChannel()
  listeners.push(listener)
}

const removeRepoBroadcastListener = (listener: RepoBroadcastListener) => {
  listeners = listeners.filter(l => l !== listener)
  maybeStartClose()
}

const postRepoBroadcastMessage = async (channel: string, message: RepoCoordinationMessage) => {
  ensureChannel()
  await broadcastChannel.postMessage({
    channel,
    message,
    senderId: currentTabId,
    data: message.type,  // TODO(pawel) backwards compatibility; remove after rollout window
  })
  maybeStartClose()
}

export {
  addRepoBroadcastListener,
  removeRepoBroadcastListener,
  postRepoBroadcastMessage,
}
