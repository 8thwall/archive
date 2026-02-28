import React from 'react'
import {useEffect} from 'react'

import '../../static/styles/code-editor.scss'
import useActions from '../../common/use-actions'
import hmdLinkActions from '../../hmd-link/hmd-link-actions'
import WebsocketPool from '../../websockets/websocket-pool'
import {useCurrentGit, useGitActiveClient} from '../../git/hooks/use-current-git'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import {getChannelSpecifier} from '../../hmd-link/get-channel-socket-specifier'
import {
  LocalLinkActionType, ShareLinkType, ShareMessageType,
} from '../../hmd-link/hmd-link-types'
import {useUuid} from '../../hooks/use-uuid'
import {useWebsocketHandler} from '../../hooks/use-websocket-handler'
import useCurrentAccount from '../../common/use-current-account'
import useCurrentApp from '../../common/use-current-app'
import {useEvent} from '../../hooks/use-event'

/* eslint react-hooks/exhaustive-deps: error */
const useLinkSharing = (
  active: boolean,
  link: string,
  linkType: ShareLinkType = 'project',
  onLocalLinkEvent?: (data: { action: LocalLinkActionType; data: unknown }) => void
) => {
  const sessionId = useUuid()
  const [channelSpecifier, setChannelSpecifier] = React.useState(null)
  const activeClientName = useGitActiveClient()?.name
  const activeHandle = useCurrentGit(g => g.repo?.handle)
  const account = useCurrentAccount()
  const app = useCurrentApp()

  const {getChannelName} = useActions(hmdLinkActions)

  useAbandonableEffect(async (maybeAbandon) => {
    if (!active || channelSpecifier) {
      return
    }
    const name = await maybeAbandon(getChannelName())
    setChannelSpecifier(getChannelSpecifier(name))
  }, [active])

  const sendUpdate = React.useCallback(() => {
    const ready = active && channelSpecifier && activeClientName &&
                  activeHandle && link && app && account && sessionId

    if (!ready) {
      return
    }

    WebsocketPool.broadcastMessage(channelSpecifier, {
      action: LocalLinkActionType.UPDATE,
      data: {
        app: {
          coverImageId: app.coverImageId,
          appName: app.appName,
          appTitle: app.appTitle,
        },
        account: {
          shortName: account.shortName,
          uuid: account.uuid,
          name: account.name,
        },
        clientName: `${activeHandle}-${activeClientName}`,
        link,
        linkType,
        sessionId,
      },
    })
  }, [
    channelSpecifier,
    active,
    app,
    account,
    link,
    activeClientName,
    activeHandle,
    sessionId,
    linkType,
  ])

  const sendStop = React.useCallback(() => {
    if (!channelSpecifier || !sessionId) {
      return
    }
    WebsocketPool.broadcastMessage(channelSpecifier,
      {
        action: LocalLinkActionType.STOP,
        data: {sessionId},
      })
  }, [sessionId, channelSpecifier])

  const unloadCallback = useEvent(() => {
    sendStop()
  })

  // Hide the share link when no longer active
  React.useEffect(() => {
    if (active) {
      return sendStop
    } else {
      return undefined
    }
  }, [active, sendStop])

  // Send an update whenever we have new data
  useEffect(() => {
    sendUpdate()
  }, [sendUpdate])

  // Send data whenever a new link page opens
  useWebsocketHandler(({data}: {data: ShareMessageType}) => {
    if (data.action === LocalLinkActionType.READY) {
      sendUpdate()
    }

    if (data.data.sessionId === sessionId) {
      if (onLocalLinkEvent) {
        onLocalLinkEvent(data)
      }
    }
  }, channelSpecifier)

  return {
    // Allow the sharing to be cancelled immediately if we're closing the page
    beforeUnload: unloadCallback,
  }
}

export {
  useLinkSharing,
}
