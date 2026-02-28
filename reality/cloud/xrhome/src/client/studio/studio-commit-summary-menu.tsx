import React from 'react'
import {useTranslation} from 'react-i18next'

import {createUseStyles} from 'react-jss'

import {SelectMenu} from './ui/select-menu'
import {useStudioMenuStyles} from './ui/studio-menu-styles'
import {combine} from '../common/styles'
import {IconButton} from '../ui/components/icon-button'
import {NewClientConfigurator} from './configuration/new-client-configurator'
import coreGitActions from '../git/core-git-actions'
import useActions from '../common/use-actions'
import {useCurrentGit, useGitActiveClient} from '../git/hooks/use-current-git'
import {getTruncatedHash} from '../git/g8-commit'
import {FloatingMenuButton} from '../ui/components/floating-menu-button'
import {VALID_CLIENT_NAME_REGEX} from '../git/g8-common'
import AbandonChangesModal from '../editor/modals/abandon-changes-modal'
import {gitNeedsLand} from '../git/git-checks'

const useStyles = createUseStyles({
  menuWrapper: {
    zIndex: 100,
  },
})

interface IStudioCommitSummaryMenu {
  commitId: string
  onClose: () => void
  onError: (message: string) => void
}

const StudioCommitSummaryMenu: React.FC<IStudioCommitSummaryMenu> = ({
  commitId, onClose, onError,
}) => {
  const classes = useStyles()
  const menuStyles = useStudioMenuStyles()
  const {t} = useTranslation(['common', 'cloud-studio-pages'])
  const repo = useCurrentGit(g => g.repo)
  const clients = useCurrentGit(git => git.clients)
  const hasChanges = useCurrentGit(gitNeedsLand)
  const activeClient = useGitActiveClient()
  const activeClientName = activeClient?.name

  const [showNewClientNameInput, setShowNewClientNameInput] = React.useState(false)
  const [isAbandoningChanges, setIsAbandoningChanges] = React.useState(false)
  const [loadingAbandon, setLoadingAbandon] = React.useState(false)

  const {newClientFromCommit, revertClient, completeSyncClient} = useActions(coreGitActions)

  const handleNewClientFromCommit = async (name: string, collapse: () => void) => {
    if (!name || !name.match(VALID_CLIENT_NAME_REGEX)) {
      onError(
        t('project_history_page.studio_commit_summary_menu.invalid_client_name',
          {ns: 'cloud-studio-pages'})
      )
      return
    }
    try {
      collapse()
      await newClientFromCommit(repo, name, commitId)
      onClose()
    } catch {
      onError(
        t('project_history_page.studio_commit_summary_menu.create_client_error',
          {ns: 'cloud-studio-pages'})
      )
    }
  }

  const handleGoToCommit = async (collapse: () => void) => {
    collapse()
    if (hasChanges) {
      setIsAbandoningChanges(true)
      return
    }
    try {
      await completeSyncClient(repo, activeClientName, {syncCommitId: commitId})
      onClose()
    } catch {
      onError(
        t('project_history_page.studio_commit_summary_menu.go_to_commit_error',
          {ns: 'cloud-studio-pages'})
      )
    }
  }

  const handleConfirmAbandonAndSync = async () => {
    setLoadingAbandon(true)
    try {
      await revertClient(repo)
      await completeSyncClient(repo, activeClientName, {syncCommitId: commitId})
      onClose()
    } catch {
      onError(
        t('project_history_page.studio_commit_summary_menu.go_to_commit_error',
          {ns: 'cloud-studio-pages'})
      )
    }
    setIsAbandoningChanges(false)
    setLoadingAbandon(false)
  }

  return (
    <>
      <SelectMenu
        id='commit-summary-dropdown-menu'
        menuWrapperClassName={combine(menuStyles.studioMenu, classes.menuWrapper)}
        placement='left-start'
        trigger={(
          <IconButton
            stroke='kebab'
            onClick={() => setShowNewClientNameInput(false)}
            text={t('project_history_page.commit_summary.menu_label',
              {ns: 'cloud-studio-pages'})}
            inline
          />
        )}
      >
        {collapse => (
          <div>
            {showNewClientNameInput
              ? <NewClientConfigurator
                  onSave={name => handleNewClientFromCommit(name, collapse)}
                  onCancel={collapse}
                  clients={new Set(clients.map(client => client.name))}
                  prefill={`${getTruncatedHash(commitId)}_copy`}
              />
              : (
                <>
                  <FloatingMenuButton
                    onClick={() => setShowNewClientNameInput(true)}
                  >
                    {t('project_history_page.studio_commit_summary_menu.new_client',
                      {ns: 'cloud-studio-pages'})}
                  </FloatingMenuButton>
                  <FloatingMenuButton
                    onClick={async () => {
                      await handleGoToCommit(collapse)
                    }}
                  >
                    {t('project_history_page.studio_commit_summary_menu.go_to_commit',
                      {ns: 'cloud-studio-pages'})}
                  </FloatingMenuButton>
                </>

              )
        }
          </div>
        )}
      </SelectMenu>
      {isAbandoningChanges && (
        <AbandonChangesModal
          confirmSwitch={handleConfirmAbandonAndSync}
          rejectSwitch={() => setIsAbandoningChanges(false)}
          loadingAbandon={loadingAbandon}
          description={
            t('project_history_page.studio_commit_summary_menu.abandon_changes_modal.description',
              {ns: 'cloud-studio-pages'})
            }
        />
      )}
    </>
  )
}

export {
  StudioCommitSummaryMenu,
}
