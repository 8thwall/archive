import * as React from 'react'
import {useHistory} from 'react-router-dom'
import {useEffect, useState} from 'react'

import type {SocketSpecifier} from '../../websockets/websocket-pool'
import {useAwakeDetector} from '../../hooks/use-awake-detector'
import {useNetworkDetector} from '../../hooks/use-network-detector'
import {useWebsocketHandler} from '../../hooks/use-websocket-handler'
import {useWebsocketRestart} from '../../hooks/use-websocket-restart'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import {getUserSocketSpecifier} from '../../user/get-user-socket-specifier'
import {useCurrentRepoId} from '../../git/repo-id-context'
import {BaseSwitchActiveBrowserModal} from './base-switch-active-browser-modal'
import {broadcastRepoBecameActive} from '../broadcast-active-browser'
import {useBrowserUuid} from '../../common/use-browser-uuid'
import {useUserUuid} from '../../user/use-current-user'

interface UserBrowser {
  activeBrowser: string | null
}

interface ISwitchActiveBrowserModal {
  entityUuid: string
  activeBrowserUuid: string
  chatSpecifier: SocketSpecifier
  backPath: string
  getUserSpecific: () => Promise<UserBrowser>
  updateUserSpecific: (activeBrowser: string) => Promise<UserBrowser>
  revertToSave: () => Promise<void>
}

/**
 * This component is totally and entirely responsible for enforcing browser activeness.
 * Only one browser at a time may be active; i.e. only one browser may access cloud editor for
 * a given project and user at a time. Multiple tabs in the _same_ browser session is allowed since
 * the worker is able to coordinate across tabs.
 *
 * Ask server who is active browser on the following events:
 * - Component mount.
 * - App change.
 * - Websocket message from other browser claiming it is active.
 * - Websocket message from other tab claiming we are active.
 * - Websocket was re-opened after timeout/connection loss.
 * - Network connection is established ("online" window event).
 * - Computer wakes from sleep (we detected a long pause in the event loop).
 *
 * NOTE(pawel) Unsaved changes in a browser that is no longer active are lost.
 */
const SwitchActiveBrowserModal: React.FC<ISwitchActiveBrowserModal> = ({
  entityUuid, activeBrowserUuid, chatSpecifier: editorChatChannelSpecifier, backPath,
  getUserSpecific, updateUserSpecific, revertToSave,
}) => {
  const hasRepo = useCurrentGit(git => !!git.repo)
  const repoId = useCurrentRepoId()
  const history = useHistory()
  const userUuid = useUserUuid()

  const myBrowserUuid = useBrowserUuid()

  const [activating, setActivating] = useState(false)

  const hasActiveBrowser = typeof activeBrowserUuid === 'string'
  const isActiveBrowser = myBrowserUuid === activeBrowserUuid

  // Takes you back to main page for app.
  const rejectActive = () => {
    history.push(backPath)
  }

  // Always fetch the latest active browser on component mount and app switch.
  // This happens when we go to editor tab and history tab.
  useEffect(() => {
    getUserSpecific().then((res) => {
      if (res && !res.activeBrowser) {
        // Case when there is no active browser (first editor launch for this user).
        updateUserSpecific(myBrowserUuid).then((res2) => {
          if (res2?.activeBrowser === myBrowserUuid) {
            broadcastRepoBecameActive(
              userUuid,
              editorChatChannelSpecifier,
              myBrowserUuid,
              repoId
            )
          }
        })
      }
    })
  }, [entityUuid, myBrowserUuid, repoId, userUuid])

  const onWebsocketMsg = (msg) => {
    if (msg.action === 'ACTIVE_BROWSER_SET') {
      const otherBrowserBecameActive = msg.activeBrowser !== myBrowserUuid && isActiveBrowser
      const otherTabBecameActive = msg.activeBrowser === myBrowserUuid && !isActiveBrowser

      if (!otherBrowserBecameActive && !otherTabBecameActive) {
        return
      }

      if (msg.repoId === repoId) {
        // TODO(pawel) Replace with app and module specific logic contained in this component.
        getUserSpecific().then(({activeBrowser}) => {
          // If another tab becomes active, revert ourselves to save as well.
          // The revert will happen in series between tabs because of write blocks.
          if (activeBrowser === myBrowserUuid) {
            if (hasRepo) {
              setActivating(true)
              revertToSave().then(() => setActivating(false))
            }
          }
        })
      }
      return
    }

    // TODO(pawel) Remove this legacy handler after migration period.
    if (msg.action === 'SET_ACTIVE_BROWSER') {
      const otherBrowserBecameActive = msg.activeBrowser !== myBrowserUuid && isActiveBrowser
      const otherTabBecameActive = msg.activeBrowser === myBrowserUuid && !isActiveBrowser

      if (otherBrowserBecameActive || otherTabBecameActive) {
        getUserSpecific().then(({activeBrowser}) => {
          // If another tab becomes active, revert ourselves to save as well.
          // The revert will happen in series between tabs because of write blocks.
          if (activeBrowser === myBrowserUuid) {
            if (hasRepo) {
              setActivating(true)
              revertToSave().then(() => setActivating(false))
            }
          }
        })
      }
    }
  }

  // Listen for active browser websocket message and ask server to verify.
  useWebsocketHandler(onWebsocketMsg, editorChatChannelSpecifier)
  useWebsocketHandler(onWebsocketMsg, getUserSocketSpecifier(userUuid))

  // When websocket connection becomes re-established there is a window of time in which
  // we could have missed a message.
  useWebsocketRestart(getUserSpecific, editorChatChannelSpecifier)
  useWebsocketRestart(getUserSpecific, getUserSocketSpecifier(userUuid))

  // When we re-connect back to a network, check to see who is active.
  useNetworkDetector((becameOnline) => {
    if (becameOnline) {
      getUserSpecific()
    }
  })

  // Fetch latest userSpecific after computer was in sleep or tab was background.
  useAwakeDetector(() => {
    getUserSpecific()
  })

  const isOpen = (hasActiveBrowser && !isActiveBrowser) || activating

  if (!isOpen) {
    return null
  }

  // Tell server we are claiming to be active, let other browsers know, revert ourselves to cloud.
  const requestActive = async () => {
    setActivating(true)
    const updatedUserSpecific = await updateUserSpecific(myBrowserUuid)

    // Tell other browsers that the server accepted our request to be active.
    if (updatedUserSpecific.activeBrowser === myBrowserUuid) {
      broadcastRepoBecameActive(
        userUuid,
        editorChatChannelSpecifier,
        myBrowserUuid,
        repoId
      )
      revertToSave()
    }
    setActivating(false)
  }

  return (
    <BaseSwitchActiveBrowserModal
      onReject={rejectActive}
      onAccept={requestActive}
      activating={activating}
    />
  )
}

export default SwitchActiveBrowserModal
