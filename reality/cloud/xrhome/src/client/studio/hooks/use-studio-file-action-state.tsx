import React from 'react'
import {useLocation} from 'react-router-dom'

import useCurrentApp from '../../common/use-current-app'
import {useStringUrlState} from '../../hooks/url-state'
import {extractRemainingUrlParams, parseStudioLocation} from '../studio-route'
import type {MonacoEditor} from '../../editor/texteditor/monaco-types'
import {usePersistentEditorSession} from '../../editor/hooks/use-persistent-editor-session'
import {useTabActions} from '../../editor/hooks/use-tab-actions'
import {useStudioUrlSync} from './use-studio-url-sync'
import {
  deriveEditorRouteParams,
  type EditorFileLocation,
} from '../../editor/editor-file-location'
import {
  BeforeFileSelectHandler, FileRenameHandler, useFileActionsState,
} from '../../editor/hooks/use-file-actions-state'
import {FileBrowser} from '../file-browser'
import {useEditorModuleActions} from '../../editor/hooks/use-editor-module-actions'
import coreGitActions from '../../git/core-git-actions'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import useActions from '../../common/use-actions'
import {useMultiRepoContext} from '../../editor/multi-repo-context'
import {useDependencyContext} from '../../editor/dependency-context'
import type {AppPathEnum} from '../../common/paths'
import {useAppPathsContext} from '../../common/app-container-context'

const useStudioFileActionState = (
  page: AppPathEnum,
  openFileFromLocalForage: boolean = true,
  onBeforeFileSelect?: BeforeFileSelectHandler,
  onFileRename?: FileRenameHandler
) => {
  const app = useCurrentApp()
  const {repo} = useCurrentGit()
  const {syncRepoStateFromDisk} = useActions(coreGitActions)

  const [fileUrlParam, setFileUrlParam] = useStringUrlState('file', undefined)
  const [moduleUrlParam, setModuleUrlParam] = useStringUrlState('module', undefined)
  const location = useLocation()
  const studioEditorParams = parseStudioLocation(location)
  const studioStateParams = extractRemainingUrlParams(location.search, ['file', 'module'])

  const focusedEditor = React.useRef<MonacoEditor>()
  const multiRepoContext = useMultiRepoContext()
  const dependencyContext = useDependencyContext()

  const {getStudioRoute} = useAppPathsContext()

  const getLocationFromFile = (file: EditorFileLocation) => getStudioRoute(
    deriveEditorRouteParams(file, multiRepoContext, dependencyContext), page, studioStateParams
  )

  const editorSession = usePersistentEditorSession(
    '',
    getLocationFromFile,
    studioEditorParams,
    openFileFromLocalForage
  )

  const {currentFileLocation, isTabsFromLocalForageLoaded, tabState} = editorSession

  const {switchTab} = useTabActions(editorSession)

  useStudioUrlSync(
    currentFileLocation,
    isTabsFromLocalForageLoaded,
    switchTab,
    setFileUrlParam,
    setModuleUrlParam
  )

  React.useEffect(() => {
    if (tabState.tabs.length === 1 && !tabState.tabs[0].filePath) {
      setFileUrlParam(undefined)
      setModuleUrlParam(undefined)
    }
  }, [tabState.tabs])

  React.useEffect(() => {
    let timeout: number
    const delayedRefresh = () => {
      clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        syncRepoStateFromDisk(repo)
      }, 150)
    }
    window.addEventListener('focus', delayedRefresh)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('focus', delayedRefresh)
    }
  }, [app.uuid, repo, syncRepoStateFromDisk])

  const checkProtectedFile = () => false

  const {
    actionsContext, fileActionModals, fileUploadState, uploadDropRef, handleFileUpload,
    setShowImportModal,
  } = useFileActionsState({
    app,
    focusedEditor,
    editorSession,
    checkProtectedFile,
    onBeforeFileSelect,
    onFileRename,
  })

  const {
    moduleActionsContext,
    moduleActionModals,
  } = useEditorModuleActions({app, editorSession, curRouteParams: studioEditorParams})

  const fileBrowser = (
    <FileBrowser
      onCreateAssetBundle={actionsContext.onAssetBundleStart}
      uploadDropRef={uploadDropRef}
      handleFileUpload={handleFileUpload}
      fileUploadState={fileUploadState}
      activeFileLocation={currentFileLocation}
      openCreateModuleModal={() => setShowImportModal(true)}
      isStudio
    />
  )

  return {
    focusedEditor,
    actionsContext,
    tabState,
    editorSession,
    fileUrlParam,
    moduleUrlParam,
    fileBrowser,
    fileActionModals,
    moduleActionsContext,
    moduleActionModals,
  }
}

export {useStudioFileActionState}
