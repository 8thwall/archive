import React from 'react'

import {getEditorSocketSpecifier} from '../common/hosting-urls'
import {useAppPathsContext} from '../common/app-container-context'
import useCurrentApp from '../common/use-current-app'
import {actions as gitActions} from '../git/git-actions'
import useActions from '../common/use-actions'
import {useCurrentGit} from '../git/hooks/use-current-git'
import SwitchActiveBrowserModal from './modals/switch-active-browser-modal'
import appActions from '../apps/apps-actions'

const ProjectSwitchActiveBrowserModal = () => {
  const app = useCurrentApp()
  const {getAppUserSpecific, updateAppUserSpecific} = useActions(appActions)
  const {getExitRepoPath} = useAppPathsContext()

  const git = useCurrentGit()
  const {revertToSave} = useActions(gitActions)

  return (
    <SwitchActiveBrowserModal
      entityUuid={app.uuid}
      activeBrowserUuid={app.userSpecific?.activeBrowser}
      chatSpecifier={getEditorSocketSpecifier({app, git}, 'editor-chat-channel')}
      backPath={getExitRepoPath()}
      getUserSpecific={() => getAppUserSpecific(app.uuid)}
      updateUserSpecific={activeBrowser => updateAppUserSpecific(app.uuid, {activeBrowser})}
      revertToSave={() => revertToSave(git.repo, app.uuid)}
    />
  )
}

export {
  ProjectSwitchActiveBrowserModal,
}
