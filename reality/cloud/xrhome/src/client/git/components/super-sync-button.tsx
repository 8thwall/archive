import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'

import {
  useGitClients,
  useGitProgress,
} from '../hooks/use-current-git'
import {doesRepoNeedSync, doesRepoHaveConflicts, isRepoLoaded} from '../git-checks'
import coreGitActions from '../core-git-actions'
import useActions from '../../common/use-actions'
import {SuperMergeModal} from '../../editor/modals/super-merge-modal'
import {useMultiRepoContext} from '../../editor/multi-repo-context'
import {useOpenGits} from '../hooks/use-open-gits'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'

type IRenderButton = {
  renderButton: (props: {
    disabled: boolean
    onClick: () => void
    needsSync: boolean
    hasConflict: boolean
    loading?: boolean
  }) => React.ReactElement
  showSyncMessage?: boolean
}

const SuperSyncButton: React.FunctionComponent<IRenderButton> = ({
  renderButton, showSyncMessage = true,
}) => {
  const gitProgress = useGitProgress()
  const clients = useGitClients()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const [isAttemptingSync, setIsAttemptingSync] = useState(false)
  const [repoIdsNeedingSync, setRepoIdsNeedingSync] = React.useState<string[]>([])

  const {trySyncClient} = useActions(coreGitActions)

  const openRepos = useOpenGits()
  const multiRepoContext = useMultiRepoContext()

  const abandon = useAbandonableFunction(async () => null)

  if (!clients || gitProgress.client === 'START' || !multiRepoContext) {
    return null
  }

  const {primaryRepoId} = multiRepoContext
  const subRepoIds = [...multiRepoContext?.subRepoIds || []]
  const reposPresent = gitProgress.load === 'DONE' && openRepos.every(isRepoLoaded)

  if (!reposPresent) {
    return null
  }

  const gitSyncMessage = (needsSync: boolean, hasConflicts: boolean) => {
    if (needsSync) {
      return hasConflicts
        ? t('editor_page.sync_message.conflicts')
        : t('editor_page.sync_message.new_updates')
    }
    return t('editor_page.sync_message.up_to_date')
  }

  const needsSync = openRepos.some(repoState => doesRepoNeedSync(repoState))
  const hasConflict = openRepos.some(repoState => doesRepoHaveConflicts(repoState))

  const syncChangeMessage = gitSyncMessage(needsSync, hasConflict)

  const loadingInProgress = gitProgress.sync === 'START' || isAttemptingSync ||
  (gitProgress.load !== 'DONE' && gitProgress.load !== 'NEEDS_INIT')

  const isDisabled = gitProgress.sync === 'START' || gitProgress.load !== 'DONE' || !needsSync

  const trySync = async () => {
    setIsAttemptingSync(true)
    const allRepoIds = [primaryRepoId, ...subRepoIds]
    const syncResults = await Promise.all(allRepoIds.map(async repoId => ({
      repoId,
      needsMerge: await trySyncClient(repoId, null),
    })))
    await abandon()
    setRepoIdsNeedingSync(syncResults.filter(r => r.needsMerge).map(r => r.repoId))
    setIsAttemptingSync(false)
  }

  return (
    <>
      {
        renderButton({
          disabled: isDisabled,
          onClick: trySync,
          loading: loadingInProgress,
          needsSync,
          hasConflict,
        })
      }
      {showSyncMessage &&
        <small className='top-pane-label'>
          {syncChangeMessage}
        </small>
      }
      {repoIdsNeedingSync.length > 0 &&
        <SuperMergeModal
          repoIds={repoIdsNeedingSync}
          onClose={() => setRepoIdsNeedingSync([])}
        />
      }
    </>
  )
}

export {
  SuperSyncButton,
}
