/* eslint react-hooks/exhaustive-deps: error */

import * as React from 'react'
import {Button, Dropdown} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import type {IApp} from '../common/types/models'
import {ClientDropdown} from './client-dropdown'
import AbandonChangesModal from './modals/abandon-changes-modal'
import RevertCloudSaveModal from './modals/revert-cloud-save-modal'
import NewProjectModal from './modals/new-project-modal'
import {DevQRCodePopup} from './token/dev-qr-code-popup'
import SaveAndBuildStatusText from './save-and-build-status-text'
import {getEditorSocketSpecifier} from '../common/hosting-urls'
import coreGitActions from '../git/core-git-actions'
import {useTheme} from '../user/use-theme'
import {
  useCurrentGit, useGitActiveClient, useGitClients, useGitProgress,
} from '../git/hooks/use-current-git'
import useActions from '../common/use-actions'
import useCurrentAccount from '../common/use-current-account'
import {isAppLicenseType} from '../../shared/app-utils'
import {actions as gitActions} from '../git/git-actions'
import {useOpenGits} from '../git/hooks/use-open-gits'
import {LandButton} from '../git/components/land-button'
import {SuperSyncButton} from '../git/components/super-sync-button'
import moduleActions from '../git/module-git-actions'
import {CLIENT_FILE_PATH} from '../common/editor-files'
import {OnboardingId} from './product-tour/product-tour-constants'
import {PublishButton} from './publish-button'
import {useLandPublishState} from './hooks/use-land-publish-state'
import {EditorLandButton} from './editor-land-button'
import {EditorSaveButton} from './editor-save-button'
import {ProjectSwitchActiveBrowserModal} from './project-active-broswer-modal'

const useStyles = createUseStyles({
  buttonTray: {
    display: 'flex',
    flexDirection: 'row',
  },
  trayButton: {
    '&:first-child': {
      borderRadius: '0.5em 0 0 0.5em',
      margin: 0,
    },
    '&:last-child': {
      borderRadius: '0 0.5em 0.5em 0',
    },
  },
})

interface IRepoControllerView {
  // From attributes.
  app: IApp
  disableTemplatePicker?: boolean
}

const RepoControllerView: React.FC<IRepoControllerView> = ({app, disableTemplatePicker}) => {
  const themeName = useTheme()
  const git = useCurrentGit()
  const account = useCurrentAccount()
  const {repo} = git
  const gitProgress = useGitProgress()
  const gitClients = useGitClients()
  const activeClient = useGitActiveClient()
  const activeClientName = activeClient?.name
  const openGits = useOpenGits()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const openRepoIds = openGits.map(g => g.repo.repoId)
  const classes = useStyles()

  // Actions
  const {
    revertClient, syncRepoStateFromDisk,
  } = useActions(coreGitActions)

  const {revertToSave, bootstrapAppRepo} = useActions(gitActions)

  // States
  const [isRevertCloudSaveModalShown, setIsRevertCloudSaveModalShown] = React.useState(false)
  const [isAbandonChangesModalShown, setIsAbandonChangesModalShown] = React.useState(false)

  const [isLoadingSuperAbandon, setIsLoadingSuperAbandon] = React.useState(false)
  const [isLoadingSuperRevert, setIsLoadingSuperRevert] = React.useState(false)

  const {revertModuleToSave} = useActions(moduleActions)

  const {
    landPublishState,
    publish,
    onRemoteLand,
  } = useLandPublishState(app)

  React.useEffect(() => {
    if (gitProgress.load === 'HAS_REPO_NEEDS_CLONE') {
      bootstrapAppRepo(app.uuid, {ensureLocalClone: true})
    }
  }, [gitProgress.load, app.uuid, bootstrapAppRepo])

  // If we switch from one tab to another, the new tab receives 'focus' before the old tab
  // receives 'blur', and so the changes from the old tab won't be picked up in the new one.
  //  Adding a slight delay allows blur to be received and processed by the previous tab.
  React.useEffect(() => {
    // We're currently loading; don't interfere.

    if (gitProgress.load !== 'DONE') {
      return undefined
    }

    let timeout: number
    const delayedRefresh = () => {
      clearTimeout(timeout)
      // Get more recent data from disk if applicable.
      timeout = window.setTimeout(() => {
        syncRepoStateFromDisk(repo)
      }, 150)
    }
    // After a short delay, double check with the local filesystem that nothing has been updated
    // in another tab.
    window.addEventListener('focus', delayedRefresh)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('focus', delayedRefresh)
    }
  }, [app.uuid, gitProgress.load, repo, syncRepoStateFromDisk])

  const clientSocketSpecifier = getEditorSocketSpecifier({git, app}, 'current-client')

  const newProjectModalVisible = !disableTemplatePicker && (
    git.progress.load === 'NEEDS_INIT' ||
    !app.repoId
  )

  const reposLoaded = gitProgress.load === 'DONE'

  const superAbandon = async () => {
    if (reposLoaded) {
      setIsLoadingSuperAbandon(true)
      await Promise.all(openRepoIds.map((repoId) => {
        const isPrimary = repoId === app.repoId
        return revertClient(repoId, {pathsToPreserve: isPrimary && [CLIENT_FILE_PATH]})
      }))
      setIsAbandonChangesModalShown(false)
      setIsLoadingSuperAbandon(false)
    }
  }

  const superRevert = async () => {
    if (reposLoaded) {
      setIsLoadingSuperRevert(true)
      await Promise.all(openRepoIds.map(repoId => revertModuleToSave(repoId)))
      setIsRevertCloudSaveModalShown(false)
      setIsLoadingSuperRevert(false)
    }
  }

  return (
    <>
      <div className={`top-pane horizontal-flex ${themeName}`} id={OnboardingId.SOURCE_CONTROL}>
        <div className='expand-1 left button-bar'>
          <ClientDropdown app={app} />
          {gitClients && gitProgress.client !== 'START' &&
            <>
              <div>
                <SuperSyncButton
                  renderButton={({disabled, onClick, loading, needsSync, hasConflict}) => (
                    <Button
                      className='sync-button'
                      onClick={onClick}
                      icon='undo alternate'
                      content={t('button.sync', {ns: 'common'})}
                      loading={loading}
                      primary={needsSync && !hasConflict}
                      secondary={needsSync && hasConflict}
                      disabled={disabled}
                    />
                  )}
                />
              </div>
              <Dropdown icon='bars' floating button className='icon'>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setIsRevertCloudSaveModalShown(true)}
                    disabled={gitProgress.sync === 'START'}
                  >{t('editor_page.button.revert_to_cloud_save')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    disabled={!activeClientName || gitProgress.sync === 'START'}
                    onClick={() => setIsAbandonChangesModalShown(true)}
                  >{t('editor_page.button.abandon_changes')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
         }
        </div>
        <div className='button-bar center'>
          <div className={classes.buttonTray}>
            <EditorSaveButton
              renderButton={({disabled, onClick, needSave, loading}) => (
                <Button
                  className={classes.trayButton}
                  primary={needSave}
                  loading={loading}
                  onClick={onClick}
                  disabled={disabled}
                  content={t('editor_page.button.save_and_build')}
                />
              )}
              app={app}
            />
            <DevQRCodePopup
              app={app}
              trigger={(
                <Button
                  className={classes.trayButton}
                  content={t('editor_page.button.preview')}
                  disabled={gitProgress.load !== 'DONE'}
                  a8='click;cloud-editor;preview-button'
                />
              )}
            />
          </div>
          {gitProgress.load !== 'NEEDS_INIT' &&
            <SaveAndBuildStatusText specifier={clientSocketSpecifier} />
        }
        </div>
        <div className='expand-1 right button-bar'>
          <LandButton
            renderButton={props => <EditorLandButton {...props} />}
            secondaryButtonText={t('editor_page.button.land_files_and_publish')}
            disableSecondaryButton={isAppLicenseType(app) && !account.publicFeatured}
            onRemoteLandComplete={onRemoteLand}
          />
          <PublishButton
            renderButton={({disabled}) => (
              <Button
                icon='cloud upload'
                content={t('editor_page.button.publish')}
                position='bottom right'
                disabled={disabled}
                a8='click;cloud-editor-publish-flow;publish-button'
              />
            )}
            publish={publish}
            landPublishState={landPublishState}
          />
        </div>
      </div>
      <ProjectSwitchActiveBrowserModal />
      {isAbandonChangesModalShown &&
        <AbandonChangesModal
          confirmSwitch={() => {
            revertClient(repo, {pathsToPreserve: [CLIENT_FILE_PATH]})
            setIsAbandonChangesModalShown(false)
          }}
          confirmSwitchAll={superAbandon}
          rejectSwitch={() => setIsAbandonChangesModalShown(false)}
          disabled={!reposLoaded}
          loadingAbandon={isLoadingSuperAbandon}
        />
      }
      {isRevertCloudSaveModalShown &&
        <RevertCloudSaveModal
          confirmSwitch={() => {
            revertToSave(repo, app.uuid)
            setIsRevertCloudSaveModalShown(false)
          }}
          confirmSwitchAll={superRevert}
          rejectSwitch={() => setIsRevertCloudSaveModalShown(false)}
          disabled={!reposLoaded}
          loadingRevert={isLoadingSuperRevert}
        />
      }
      {newProjectModalVisible &&
        <NewProjectModal app={app} />
      }
    </>
  )
}

export default RepoControllerView
