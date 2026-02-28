import React, {useState} from 'react'
import {Button} from 'semantic-ui-react'

import {useTranslation} from 'react-i18next'

import {
  useGitActiveClient,
  useGitClients,
  useGitHasConflicts,
  useGitNeedsSync,
  useGitProgress,
  useGitRepo,
} from '../hooks/use-current-git'
import coreGitActions from '../core-git-actions'
import useActions from '../../common/use-actions'
import {MergeModal} from '../../editor/modals/merge-modal'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'

const SyncButton: React.FunctionComponent = () => {
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const gitProgress = useGitProgress()
  const repoId = useGitRepo()?.repoId
  const clients = useGitClients()
  const [showMergeModal, setShowMergeModal] = useState(false)

  const trySyncClientAbandonable = useAbandonableFunction(useActions(coreGitActions).trySyncClient)

  const gitSyncMessage = (needsSync: boolean, hasConflicts: boolean) => {
    if (needsSync) {
      return hasConflicts
        ? t('editor_page.sync_message.conflicts')
        : t('editor_page.sync_message.new_updates')
    }
    return t('editor_page.sync_message.up_to_date')
  }

  const activeClient = useGitActiveClient()
  const needsG8Sync = useGitNeedsSync()
  const hasConflict = useGitHasConflicts()
  const syncChangeMessage = gitSyncMessage(needsG8Sync, hasConflict)

  const activeClientName = activeClient?.name

  if (!clients || gitProgress.client === 'START') {
    return null
  }

  const trySync = () => {
    if (!activeClientName || !repoId) {
      return
    }
    trySyncClientAbandonable(repoId, activeClientName).then((needsMerging) => {
      setShowMergeModal(needsMerging)
    })
  }

  return (
    <>
      <Button
        className='sync-button'
        onClick={trySync}
        icon='undo alternate'
        content={t('button.sync', {ns: 'common'})}
        loading={
          gitProgress.sync === 'START' ||
          (gitProgress.load !== 'DONE' && gitProgress.load !== 'NEEDS_INIT')
        }
        primary={needsG8Sync && !hasConflict}
        secondary={needsG8Sync && hasConflict}
        disabled={
          gitProgress.sync === 'START' ||
          gitProgress.load !== 'DONE' ||
          !needsG8Sync
        }
      />
      {gitProgress.load !== 'NEEDS_INIT' &&
        <small className='top-pane-label'>
          {syncChangeMessage}
        </small>
      }
      {showMergeModal &&
        <MergeModal onClose={() => setShowMergeModal(false)} />
      }
    </>
  )
}

export {
  SyncButton,
}
