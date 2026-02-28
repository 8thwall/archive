import React from 'react'

import {useQuery} from '@tanstack/react-query'

import useActions from '../common/use-actions'
import {useBrowserUuid} from '../common/use-browser-uuid'
import useCurrentApp from '../common/use-current-app'
import {useCurrentUser} from '../user/use-current-user'
import userNianticActions from '../user-niantic/user-niantic-actions'
import {ReleaseNotesModal} from '../studio/release-notes-modal'
import {RELEASE_NOTES_QUERY} from '../studio/release-notes'
import {MILLISECONDS_PER_DAY} from '../../shared/time-utils'

const NEW_USER_DURATION_MILLIS = 3 * MILLISECONDS_PER_DAY  // 3 days

const WhatsNewTrigger: React.FC = () => {
  const lastSeenPopupId = useCurrentUser(u => u.loggedInUser.lastSeenReleasePopupId)
  const isNewUser = useCurrentUser(u => u.loggedInUser.createdAt &&
      (Date.now() - new Date(u.loggedInUser.createdAt).getTime() < NEW_USER_DURATION_MILLIS))

  const {patchUser} = useActions(userNianticActions)

  const latestPopupId = useQuery(RELEASE_NOTES_QUERY).data?.latestPopupId
  const hasSeenLatestPopup = lastSeenPopupId && latestPopupId === lastSeenPopupId

  const activeBrowserUuid = useCurrentApp().userSpecific?.activeBrowser
  const currentBrowserUuid = useBrowserUuid()
  const isActiveBrowser = currentBrowserUuid === activeBrowserUuid

  if (!latestPopupId || hasSeenLatestPopup) {
    return null
  }

  // Don't show the popup to new users so that it doesn't interfere with the new user experience
  // such as Pendo product tour.
  if (isNewUser) {
    return null
  }

  // Only show the popup in the active browser so that it doesn't conflict with the active browser
  // switching modal.
  if (!isActiveBrowser) {
    return null
  }

  return (
    <ReleaseNotesModal
      trigger={null}
      startOpen
      onOpenChange={(open) => {
        if (!open) {
          patchUser({lastSeenReleasePopupId: latestPopupId})
        }
      }}
    />
  )
}

export {
  WhatsNewTrigger,
}
