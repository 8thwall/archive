import {BroadcastChannel} from 'broadcast-channel'
import uuidv4 from 'uuid/v4'

interface UserLogoutMessage {
  senderTabId: string
}

type UserLogoutListener = () => void

const CURRENT_TAB_ID = uuidv4()
const CHANNEL_NAME = 'user-logout'

let broadcastChannel: BroadcastChannel = null
let listeners: UserLogoutListener[] = []

const initBroadcastChannel = () => {
  if (!broadcastChannel) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME)

    broadcastChannel.addEventListener('message', (message: UserLogoutMessage) => {
      const {senderTabId} = message
      if (CURRENT_TAB_ID === senderTabId) {
        return
      }

      listeners.forEach(listener => listener())
    })
  }

  return broadcastChannel
}

const maybeCloseChannel = () => {
  if (listeners.length || broadcastChannel === null) {
    return
  }

  broadcastChannel.close()
  broadcastChannel = null
}

const addUserLogoutListener = (listener: UserLogoutListener) => {
  initBroadcastChannel()
  listeners.push(listener)
}

const removeUserLogoutListener = (listener: UserLogoutListener) => {
  listeners = listeners.filter(l => l !== listener)
  maybeCloseChannel()
}

const postUserLogoutMessage = async () => {
  initBroadcastChannel()
  await broadcastChannel.postMessage({
    senderTabId: CURRENT_TAB_ID,
  })
  maybeCloseChannel()
}

export {
  addUserLogoutListener,
  removeUserLogoutListener,
  postUserLogoutMessage,
}
