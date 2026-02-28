import type React from 'react'

import {useGitsNeedsSave, useOpenGits} from '../git/hooks/use-open-gits'
import {useCurrentGit, useGitProgress} from '../git/hooks/use-current-git'
import {useSaveSemaphoreContext} from './hooks/save-challenge-semaphore'
import {getEditorSocketSpecifier} from '../common/hosting-urls'
import useActions from '../common/use-actions'
import coreGitActions from '../git/core-git-actions'
import type {IApp} from '../common/types/models'
import WebsocketPool from '../websockets/websocket-pool'
import {useDependencyContext} from './dependency-context'
import {useMultiRepoContext} from './multi-repo-context'

interface IEditorSaveButton {
  app: IApp
  ignoreExpanse?: boolean
  renderButton: (props: {
    disabled: boolean
    onClick: (evt: any) => Promise<void>
    needSave?: boolean
    loading?: boolean
  }) => React.ReactElement
}

const EditorSaveButton: React.FC<IEditorSaveButton> = ({app, renderButton, ignoreExpanse}) => {
  const needsG8Save = useGitsNeedsSave({ignoreExpanse})
  const gitProgress = useGitProgress()
  const git = useCurrentGit()
  const dependencyContext = useDependencyContext()
  const multiRepoContext = useMultiRepoContext()

  const saveSemaphore = useSaveSemaphoreContext()
  const {saveMultiRepo} = useActions(coreGitActions)
  const openGits = useOpenGits()
  const openRepos = openGits.map(g => g.repo)

  const handleSave = async (evt) => {
    if (evt) {
      evt.preventDefault()  // prevent focusing on the location bar in the browser
    }
    await saveSemaphore.postChallenge()
    const clientSpecifier = getEditorSocketSpecifier({git, app}, 'current-client')
    WebsocketPool.broadcastMessage(clientSpecifier, {action: 'WAIT_AFTER_BUILD'})
    return saveMultiRepo(openRepos, dependencyContext, multiRepoContext)
  }

  return (
    renderButton({
      disabled: gitProgress.sync === 'START' || gitProgress.load !== 'DONE',
      onClick: handleSave,
      loading: gitProgress.save === 'START',
      needSave: needsG8Save,
    })
  )
}

export {EditorSaveButton}
