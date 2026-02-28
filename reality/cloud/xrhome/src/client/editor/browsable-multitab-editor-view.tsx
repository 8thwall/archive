/* eslint-disable jsx-a11y/media-has-caption */
import * as React from 'react'
import {GlobalHotKeys} from 'react-hotkeys'
import {useRef} from 'react'

import {DEPENDENCY_FOLDER, STUDIO_FILES, isMainPath} from '../common/editor-files'
import {removeRichSuffixScoped} from './browsable-multitab-editor-view-helpers'
import {FileActionsContext} from './files/file-actions-context'
import {useCurrentGit} from '../git/hooks/use-current-git'
import {ModuleActionsContext} from './modules/module-actions-context'
import {isModuleUserAllowed} from '../../shared/account-module-access'
import {useAppPathsContext} from '../common/app-container-context'
import {ProjectEditorLeftPane} from './project-editor-left-pane'
import {deriveEditorRouteParams, EditorFileLocation} from './editor-file-location'
import {useMultiRepoContext} from './multi-repo-context'
import {useDependencyContext} from './dependency-context'
import {useUserEditorSettings} from '../user/use-user-editor-settings'
import type {IAccount, IApp} from '../common/types/models'
import type {MonacoEditor} from './texteditor/monaco-types'
import {usePersistentEditorSession} from './hooks/use-persistent-editor-session'
import {useTabActions} from './hooks/use-tab-actions'
import {useUrlSync} from './hooks/use-url-sync'
import {useDismissibleModalContext} from './dismissible-modal-context'
import {useFileActionsState} from './hooks/use-file-actions-state'
import {CodeEditor} from './code-editor/code-editor'
import {useEditorModuleActions} from './hooks/use-editor-module-actions'
import {parseEditorRouteParams, useEditorParams} from './editor-route'

const FILE_ACCEPT = `.${STUDIO_FILES.join(',.')}`

const DEFAULT_OPEN_FILE = 'app.js'

interface IBrowsableMultitabEditorView {
  // From attributes.
  app: IApp
  account: IAccount
}

const BrowsableMultitabEditorView: React.FC<IBrowsableMultitabEditorView> = ({app, account}) => {
  const git = useCurrentGit()
  const {dismissModals} = useDismissibleModalContext()
  const {getFileRoute} = useAppPathsContext()
  const editorSettings = useUserEditorSettings()
  const params = useEditorParams()
  const editorRouteParams = parseEditorRouteParams(params)
  const focusedEditor = useRef<MonacoEditor>()

  const multiRepoContext = useMultiRepoContext()
  const dependencyContext = useDependencyContext()

  const getLocationFromFile = (file: EditorFileLocation) => getFileRoute(
    deriveEditorRouteParams(file, multiRepoContext, dependencyContext)
  )

  const editorSession = usePersistentEditorSession(
    DEFAULT_OPEN_FILE,
    getLocationFromFile,
    editorRouteParams
  )

  const {
    currentFileLocation, isTabsFromLocalForageLoaded,
  } = editorSession

  const {switchTab, handleSwitchTabs} = useTabActions(editorSession)

  useUrlSync(
    currentFileLocation,
    isTabsFromLocalForageLoaded,
    switchTab,
    getLocationFromFile
  )

  const checkProtectedFile = isMainPath
  const {
    actionsContext,
    fileUploadState,
    handleFileUpload,
    fileActionModals,
    uploadDropRef,
    setSearchModalMode,
    setShowImportModal,
  } = useFileActionsState({app, focusedEditor, editorSession, checkProtectedFile})

  const {
    moduleActionsContext,
    moduleActionModals,
    showModulesContent,
  } = useEditorModuleActions({app, editorSession, curRouteParams: editorRouteParams})

  const isDarkMode = editorSettings.darkMode
  const themeName = isDarkMode ? 'dark' : 'light'

  return (
    <div className='scrollable-pane-container horizontal-flex expand-1'>
      <GlobalHotKeys
        keyMap={{
          tabRight: ['alt+=', 'alt+='],
          tabLeft: ['alt+-', 'alt+-'],
        }}
        handlers={{
          tabRight: e => handleSwitchTabs(e, 'right'),
          tabLeft: e => handleSwitchTabs(e, 'left'),
        }}
      />
      <ModuleActionsContext.Provider value={moduleActionsContext}>
        {fileActionModals}
      </ModuleActionsContext.Provider>
      {moduleActionModals}
      <FileActionsContext.Provider value={actionsContext}>
        <ModuleActionsContext.Provider value={moduleActionsContext}>
          <ProjectEditorLeftPane
            themeName={themeName}
            activeFileLocation={removeRichSuffixScoped(currentFileLocation)}
            onSearch={() => {
              dismissModals()
              setSearchModalMode('both')
            }}
            fileUploadState={fileUploadState}
            onCreateAssetBundle={actionsContext.onAssetBundleStart}
            modulesVisible={!!git.filesByPath[DEPENDENCY_FOLDER] || isModuleUserAllowed(account)}
            onModuleImport={() => setShowImportModal(true)}
            showModulesPane={showModulesContent}
          >
            <CodeEditor editorSession={editorSession} focusedEditor={focusedEditor} />
          </ProjectEditorLeftPane>
          <input
            className='hidden-input'
            type='file'
            accept={FILE_ACCEPT}
            ref={uploadDropRef}
            onChange={handleFileUpload}
            value=''
            multiple
          />
        </ModuleActionsContext.Provider>
      </FileActionsContext.Provider>
    </div>
  )
}

export default BrowsableMultitabEditorView
