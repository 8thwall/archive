import React from 'react'

import {Button, Dropdown} from 'semantic-ui-react'

import {useTheme} from '../user/use-theme'
import {ClientDropdown} from '../editor/client-dropdown'
import {
  useCurrentGit,
  useGitActiveClient,
  useGitClients,
  useGitProgress,
} from '../git/hooks/use-current-git'
import {SyncButton} from '../git/components/sync-button'
import {SaveButton} from '../git/components/save-button'
import coreGitActions from '../git/core-git-actions'
import useActions from '../common/use-actions'
import {ModuleVersionButton} from './widgets/module-version-button'
import type {IModule} from '../common/types/models'
import {LandButton} from '../git/components/land-button'
import SaveAndBuildStatusText from '../editor/save-and-build-status-text'
import {getModuleSpecifier} from './module-specifier'
import {ModuleEditorSocketBranchEnum} from './module-editor-constants'
import RevertCloudSaveModal from '../editor/modals/revert-cloud-save-modal'
import moduleGitActions from '../git/module-git-actions'
import AbandonChangesModal from '../editor/modals/abandon-changes-modal'
import {EditorLandButton} from '../editor/editor-land-button'

interface IModuleRepoToolbar {
  module: IModule
}

const ModuleRepoToolbar: React.FC<IModuleRepoToolbar> = ({module}) => {
  const themeName = useTheme()
  const git = useCurrentGit()
  const {repo} = git
  const clients = useGitClients()
  const gitProgress = useGitProgress()
  const activeClient = useGitActiveClient()
  const [isRevertCloudSaveModalShown, setIsRevertCloudSaveModalShown] = React.useState(false)
  const [isAbandonChangesModalShown, setIsAbandonChangesModalShown] = React.useState(false)

  const {revertClient, syncRepoStateFromDisk} = useActions(coreGitActions)
  const {revertModuleToSave} = useActions(moduleGitActions)

  const specifier = getModuleSpecifier(module, git, ModuleEditorSocketBranchEnum.currentClient)

  React.useEffect(() => {
    // TODO(pawel) Replace with Dale's isGitLoaded() when it lands.
    if (git.progress.load !== 'DONE') {
      return undefined
    }
    let timeout: number
    const delayRefresh = () => {
      clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        syncRepoStateFromDisk(repo)
      }, 150)
    }
    window.addEventListener('focus', delayRefresh)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('focus', delayRefresh)
    }
  }, [git.progress.load, syncRepoStateFromDisk])

  return (
    <div className={`top-pane horizontal-flex ${themeName}`}>
      <div className='expand-1 left button-bar'>
        <ClientDropdown />
        {isRevertCloudSaveModalShown &&
          <RevertCloudSaveModal
            confirmSwitch={() => {
              revertModuleToSave(git.repo)
              setIsRevertCloudSaveModalShown(false)
            }}
            rejectSwitch={() => setIsRevertCloudSaveModalShown(false)}
          />
        }
        {isAbandonChangesModalShown &&
          <AbandonChangesModal
            confirmSwitch={() => {
              setIsAbandonChangesModalShown(false)
              revertClient(git.repo)
            }}
            rejectSwitch={() => setIsAbandonChangesModalShown(false)}
          />
        }
        {clients && gitProgress.client !== 'START' &&
          <>
            <div>
              <SyncButton />
            </div>
            <Dropdown icon='bars' floating button className='icon'>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setIsRevertCloudSaveModalShown(true)}
                  disabled={gitProgress.sync === 'START'}
                >Revert to Cloud Save
                </Dropdown.Item>
                <Dropdown.Item
                  disabled={!activeClient?.name || gitProgress.sync === 'START'}
                  onClick={() => setIsAbandonChangesModalShown(true)}
                >Abandon Changes
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        }
      </div>
      <div className='button-bar center'>
        <Button.Group>
          <SaveButton />
        </Button.Group>
        <SaveAndBuildStatusText specifier={specifier} />
      </div>
      <div className='expand-1 right button-bar'>
        <LandButton renderButton={props => <EditorLandButton {...props} />} />
        <ModuleVersionButton module={module} />
      </div>
    </div>
  )
}

export {
  ModuleRepoToolbar,
}
