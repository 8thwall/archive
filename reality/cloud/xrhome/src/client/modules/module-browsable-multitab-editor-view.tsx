import React from 'react'
import {useRef, useState} from 'react'
import SplitPane from 'react-split-pane'
import {Icon, Segment} from 'semantic-ui-react'
import {useDispatch} from 'react-redux'
import {createUseStyles} from 'react-jss'
import {GlobalHotKeys} from 'react-hotkeys'
import {useTranslation} from 'react-i18next'

import {useCurrentModule} from '../common/use-current-module'
import {
  FileActionsContext, IFileActionsContext, NewItem,
} from '../editor/files/file-actions-context'
import {FileList} from '../editor/file-list'
import {
  ASSET_FOLDER_PREFIX, STUDIO_FILES, getDraggedFilePath, getRenamedFilePath, hasBundleFile,
  containsFolderEntry, isModuleMainPath, isLintablePath, ASSET_FOLDER,
} from '../common/editor-files'
import FileUploadProgressBar from '../editor/file-upload-progress-bar'
import {useSelector} from '../hooks'
import {useCurrentGit} from '../git/hooks/use-current-git'
import {extractModuleFileLists} from '../editor/files/extract-file-lists'
import editorActions from '../editor/editor-actions'
import {LEFT_PANE_EXPANDED_SIZE} from '../editor/editor-utils'
import useActions from '../common/use-actions'
import {useTheme} from '../user/use-theme'
import coreGitActions from '../git/core-git-actions'
import DeleteFileModal from '../editor/modals/delete-file-modal'
import AbandonChangesModal from '../editor/modals/abandon-changes-modal'
import {useUrlSync} from '../editor/hooks/use-url-sync'
import {getPathForModuleFile} from '../common/paths'
import useCurrentAccount from '../common/use-current-account'
import ViewSingleDiffModal from '../editor/single-diff-view'
import {lintAndFormat} from '../editor/tooling/eslint'
import {useAbandonableFunction} from '../hooks/use-abandonable-function'
import {SaveSemaphoreContext} from '../editor/hooks/save-challenge-semaphore'
import type {IGitFile} from '../git/g8-dto'
import {useFileUploadState} from '../editor/hooks/use-file-upload-state'
import {errorAction} from '../common/error-action'
import {FOLDER_UPLOAD_ERROR} from '../editor/editor-errors'
import AssetBundleModal from '../editor/modals/asset-bundle-modal'
import {
  EditorFileLocation, extractFilePath,
  maybeRemoveImplicitExtension,
} from '../editor/editor-file-location'
import {FileTreeContainer} from '../editor/file-tree-container'
import {SearchModal, SearchModes, SearchValue} from '../editor/modals/search-modal'
import {SpaceBetween} from '../ui/layout/space-between'
import {IconButton} from '../ui/components/icon-button'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import AutoHeading from '../widgets/auto-heading'
import {combine} from '../common/styles'
import {useUserEditorSettings} from '../user/use-user-editor-settings'
import {PRIORITY_LATE} from '../common/challenge-semaphore'
import {useTextEditorContext} from '../editor/texteditor/texteditor-context'
import {usePersistentEditorSession} from '../editor/hooks/use-persistent-editor-session'
import {useTabActions} from '../editor/hooks/use-tab-actions'
import {ITabPaneContext, TabPaneContext} from '../editor/code-editor/tab-pane-context'
import {PaneDisplay} from '../editor/code-editor/pane-display'
import {getNewestTabbedPaneId, handleSplitPane} from '../editor/pane-state'
import type {MonacoEditor} from '../editor/texteditor/monaco-types'
import {handleTabSelect, handleReorder} from '../editor/tab-state'
import {useDismissibleModalContext} from '../editor/dismissible-modal-context'
import BackendConfigModal from '../editor/modals/backend-config-modal'
import {FileStateContextProvider} from '../editor/file-state-context'
import {NEW_TAB_PATH} from '../editor/editor-utils'
import {parseEditorRouteParams, useEditorParams} from '../editor/editor-route'
import {CodeSearchContextProvider} from '../editor/modals/code-search-context'

const DEFAULT_OPEN_FILE = 'module.js'

const FILE_ACCEPT = `.${STUDIO_FILES.join(',.')}`

const LEFT_PANE_COLLAPSED_SIZE = 30
const LEFT_PANE_MIN_EXPANDED_SIZE = 100
const getMaxLeftPaneSize = () => window.innerWidth * 0.8
const limitLeftPaneSize = size => Math.min(getMaxLeftPaneSize(), size)

const useStyles = createUseStyles({
  iconContainer: {
    position: 'absolute',
    right: '16px',
    top: '8px',
    zIndex: '6',
  },
  hiddenIconContainer: {
    alignItems: 'center',
  },
  heading: {
    padding: '0.75em 1em',
  },
  pane: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  fileList: {
    overflowY: 'scroll',
    height: '100%',
  },
})

const ModuleBrowsableMultitabEditorView: React.FunctionComponent = () => {
  const module = useCurrentModule()
  const account = useCurrentAccount()
  const themeName = useTheme()
  const git = useCurrentGit()
  const dispatch = useDispatch()
  const {t} = useTranslation(['cloud-editor-pages'])
  const {repo} = git

  const {dismissModals} = useDismissibleModalContext()

  const files = extractModuleFileLists(git)

  const classes = useStyles()

  const editorSettings = useUserEditorSettings()

  const {focusTextEditor} = useTextEditorContext()

  const {setLeftPaneSplitSize: setReduxLeftPaneSplitSize} = useActions(editorActions)
  const {
    renameFile, createFolder, createFile, deleteFile, revertFile, performDiff, transformFile,
    saveClient,
  } = useActions(coreGitActions)

  const getLocationFromFile = (file: string) => {
    const filepath = extractFilePath(file)
    return getPathForModuleFile(account, module, maybeRemoveImplicitExtension(filepath))
  }

  const params = useEditorParams()

  const editorSession = usePersistentEditorSession(
    DEFAULT_OPEN_FILE,
    getLocationFromFile,
    parseEditorRouteParams(params)
  )

  const {
    tabState, setTabState, paneState, setPaneState, scrollTo, setScrollTo,
    currentFileLocation, isTabsFromLocalForageLoaded,
  } = editorSession

  const activeFilePath = currentFileLocation?.filePath

  const {
    closeTabById, closeTabsInPane, closeOtherTabsInPane, closeTabsInDirection,
    closeTab, switchTab, updateTab, updateTabState, handleSwitchTabs,
  } = useTabActions(editorSession)

  // Left pane sizing stuff.
  const [leftPaneSplitSize, setLeftPaneSplitSize] =
    useState(useSelector(state => state.editor.leftPaneSplitSize) || LEFT_PANE_EXPANDED_SIZE)
  const [leftPanePreferredExpandedSize, setLeftPanePreferredExpandedSize] =
    useState(
      leftPaneSplitSize >= LEFT_PANE_MIN_EXPANDED_SIZE ? leftPaneSplitSize : LEFT_PANE_EXPANDED_SIZE
    )

  const toggleShowLeftPane = () => {
    const newLeftPaneSplitSize = leftPaneSplitSize < LEFT_PANE_MIN_EXPANDED_SIZE
      ? limitLeftPaneSize(leftPanePreferredExpandedSize)
      : LEFT_PANE_COLLAPSED_SIZE
    setLeftPaneSplitSize(newLeftPaneSplitSize)
  }

  const onLeftPaneResize = (size: number) => {
    setLeftPaneSplitSize(limitLeftPaneSize(size))
  }

  const onLeftPaneResizeFinished = (rawSize: number) => {
    const size = limitLeftPaneSize(rawSize)
    const collapse = size < LEFT_PANE_MIN_EXPANDED_SIZE
    if (!collapse) {
      setLeftPanePreferredExpandedSize(size)
    }
    const newPaneSize = collapse ? LEFT_PANE_COLLAPSED_SIZE : size
    setLeftPaneSplitSize(newPaneSize)
    setReduxLeftPaneSplitSize(newPaneSize)
  }

  const uploadDrop = useRef<HTMLInputElement>(null)

  const {fileUploadState, uploadFiles} = useFileUploadState(module.repoId, null)

  const focusedEditor = useRef<MonacoEditor>()

  const draggingTab = useRef<boolean>()
  const dragTargetPaneId = useRef<number>(-1)

  useUrlSync(
    currentFileLocation,
    isTabsFromLocalForageLoaded,
    switchTab,
    getLocationFromFile
  )

  const [deleteFilePath, setDeleteFilePath] = useState<string>(null)
  const [revertFilePath, setRevertFilepath] = useState<string>(null)
  const [viewDiffFile, setViewDiffFile] = useState<string>(null)

  // Code Search stuff
  const [searchModalMode, setSearchModalMode] = useState<SearchModes>(null)

  const handleFileAndLineSelect = (searchValue: SearchValue) => {
    const {filePath, lineNum, column} = searchValue
    switchTab(filePath)
    if (lineNum && column) {
      setScrollTo({line: lineNum, column})
    }
    setSearchModalMode(null)
  }

  // Asset bundles.
  const [bundleState, setBundleState] = useState<{ type?: string, initialFiles?: File[] }>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesAsArray: File[] = Array.from(e.target.files)
    if (hasBundleFile(filesAsArray)) {
      setBundleState({initialFiles: filesAsArray})
      return
    }
    uploadFiles(filesAsArray)
  }

  // Backend proxy
  const [showBackendProxyModal, setShowBackendProxyModal] = useState(false)
  const [locationForBackend, setLocationForBackend] = React.useState<EditorFileLocation>('')

  const handleCreateAssetBundle = (type: string) => {
    setBundleState({type})
  }

  // TODO(pawel) Git stuff stubbed for now.
  const gitFilesLoading = false

  const handleConfirmDelete = () => {
    if (deleteFilePath === activeFilePath) {
      switchTab(DEFAULT_OPEN_FILE)
    }
    setDeleteFilePath(null)
    closeTab(deleteFilePath)
    deleteFile(repo, deleteFilePath)
  }

  const handleConfirmRevert = () => {
    setRevertFilepath(null)
    revertFile(repo, revertFilePath)
  }

  const createItem = async (newItem: NewItem, folderLocation: EditorFileLocation = null) => {
    const folderPath = extractFilePath(folderLocation)
    const itemPath = folderPath ? `${folderPath}/${newItem.name}` : newItem.name
    if (newItem.isFile) {
      await createFile(repo, itemPath)
      switchTab(itemPath)
    } else {
      createFolder(repo, itemPath)
    }
  }

  const handleMove = async (filePath: string, newPath: string) => {
    await renameFile(repo, filePath, newPath)
    if (activeFilePath === filePath) {
      updateTab(filePath, newPath)
    }
  }

  const handleRename = (newName: string, prevLocation: EditorFileLocation) => {
    const filePath = extractFilePath(prevLocation)
    handleMove(filePath, getRenamedFilePath(newName, filePath))
  }

  const handleFileDrag = (filePath: string, folderPath: string = null) => {
    handleMove(filePath, getDraggedFilePath(filePath, folderPath))
  }

  const handleDropEvent = (e: React.DragEvent, folderLocation: EditorFileLocation = null) => {
    const folderPath = extractFilePath(folderLocation)
    const filePath = e.dataTransfer.getData('filePath')
    if (filePath) {
      handleFileDrag(filePath, folderPath)
      return
    }

    if (containsFolderEntry(e.dataTransfer.items)) {
      dispatch(errorAction(FOLDER_UPLOAD_ERROR))
      return
    }

    const hasFiles = e.dataTransfer.files?.length > 0
    if (!hasFiles) {
      return
    }

    const filesAsArray: File[] = Array.from(e.dataTransfer.files)
    if (hasBundleFile(filesAsArray)) {
      setBundleState({initialFiles: filesAsArray})
      return
    }

    uploadFiles(filesAsArray, folderPath)
  }

  const saveSemaphore = React.useContext(SaveSemaphoreContext)
  const postSaveChallenge = useAbandonableFunction(saveSemaphore.postChallenge)

  const lintFile = async (filePath: string) => {
    transformFile(repo, filePath, async (file: IGitFile) => {
      const linted = await lintAndFormat({
        filename: filePath,
        val: file.content,
      })

      return linted.val
    }, true)
  }

  const handleFormat = (fileLocation: EditorFileLocation) => {
    const filePath = extractFilePath(fileLocation)
    return lintFile(filePath)
  }

  React.useEffect(() => {
    if (!editorSettings.autoFormat || !isLintablePath(activeFilePath)) {
      return undefined
    }
    const sub = saveSemaphore.subscribe(async () => {
      await lintFile(activeFilePath)
    }, {priority: PRIORITY_LATE})
    return () => saveSemaphore.unsubscribe(sub)
  }, [activeFilePath])

  const saveDirtyAndBuild = async (evt?: Event) => {
    if (evt) {
      evt.preventDefault()
    }
    await postSaveChallenge()
    saveClient(repo)
  }

  const fileActionsContext: IFileActionsContext = {
    onCreate: createItem,
    onDrop: handleDropEvent,
    onSelect: (loc, options, paneId) => switchTab(loc, options, paneId),
    onRename: handleRename,
    onFormat: handleFormat,
    onDiff: (location: EditorFileLocation) => {
      setViewDiffFile(extractFilePath(location))
      performDiff({
        repositoryName: git.repo.repositoryName,
        repoId: git.repo.repoId,
        findRenames: true,
        changePoint: 'WORKING',
      })
    },
    onDelete: (filePath: EditorFileLocation) => setDeleteFilePath(extractFilePath(filePath)),
    onRevert: (location: EditorFileLocation) => setRevertFilepath(extractFilePath(location)),
    isProtectedFile: isModuleMainPath,
    onUploadStart: () => uploadDrop.current.click(),
    onAssetBundleStart: handleCreateAssetBundle,
    onCreateOrEditBackend: (filePath: EditorFileLocation) => {
      setLocationForBackend(filePath || '')
      setShowBackendProxyModal(true)
    },
    build: saveDirtyAndBuild,
    onClose: closeTabById,
  }

  const tabPaneContext: ITabPaneContext = {
    mode: 'module',
    paneState,
    setPaneState,
    tabState,
    setTabState,
    focusedEditor,
    draggingTab,
    dragTargetPaneId,
    updateTabCustomState: updateTabState,
    splitPane: (paneId) => {
      setPaneState((ps) => {
        switchTab(currentFileLocation, null, paneId)
        const newPaneState = handleSplitPane(ps, paneId)
        switchTab(currentFileLocation, {persistent: true}, getNewestTabbedPaneId(newPaneState))
        return newPaneState
      })
    },
    onFocus: (tabId) => {
      setTabState(ts => handleTabSelect(ts, tabId))
    },
    onDropTab: (oldIndex: number, newIndex: number, srcPaneId: number, targetPaneId: number) => {
      setTabState(
        ts => handleReorder(ts, oldIndex, newIndex, srcPaneId, targetPaneId)
      )
    },
    scrollTo,  // TODO(johnny): Make this work with multi pane
    closeTabsInPane,
    closeOtherTabsInPane,
    closeTabsInDirection,
  }

  return (
    <div className='scrollable-pane-container horizontal-flex expand-1'>
      <GlobalHotKeys
        keyMap={{
          saveDirtyAndBuild: ['ctrl+s', 'command+s'],
          fileSearch: ['ctrl+p', 'command+p'],
          codeSearch: ['ctrl+shift+f', 'command+shift+f'],
          tabRight: ['alt+=', 'alt+='],
          tabLeft: ['alt+-', 'alt+-'],
        }}
        handlers={{
          saveDirtyAndBuild,
          fileSearch: (e) => {
            e.preventDefault()
            dismissModals()
            setSearchModalMode('file')
          },
          codeSearch: (e) => {
            e.preventDefault()
            dismissModals()
            setSearchModalMode('code')
          },
          tabRight: e => handleSwitchTabs(e, 'right'),
          tabLeft: e => handleSwitchTabs(e, 'left'),
        }}
        allowChanges
      />
      {bundleState &&
        <AssetBundleModal
          repoId={module.repoId}
          files={bundleState.initialFiles}
          type={bundleState.type}
          onClose={() => setBundleState(null)}
        />
      }
      <CodeSearchContextProvider>
        {searchModalMode &&
          <SearchModal
            onClose={() => {
              setSearchModalMode(null)
              focusTextEditor()
            }}
            onFileSelect={(searchValue: SearchValue) => {
              handleFileAndLineSelect(searchValue)
              focusTextEditor()
            }}
            onModeChange={mode => setSearchModalMode(mode)}
            openFiles={tabState.tabs}
            searchMode={searchModalMode}
          />
        }
      </CodeSearchContextProvider>
      {viewDiffFile &&
        <ViewSingleDiffModal fileLocation={viewDiffFile} onClose={() => setViewDiffFile(null)} />
      }
      {revertFilePath &&
        <AbandonChangesModal
          confirmSwitch={handleConfirmRevert}
          rejectSwitch={() => setRevertFilepath(null)}
          file={revertFilePath}
        />
      }
      {deleteFilePath &&
        <DeleteFileModal
          confirmSwitch={handleConfirmDelete}
          rejectSwitch={() => setDeleteFilePath(null)}
          file={deleteFilePath}
        />
      }
      {showBackendProxyModal &&
        <BackendConfigModal
          onClose={(filePath) => {
            if (filePath) {
              const wasNew = extractFilePath(locationForBackend) === NEW_TAB_PATH
              if (wasNew) {
                switchTab(filePath)
              } else {
                updateTab(extractFilePath(locationForBackend), filePath)
              }
            }
            setLocationForBackend('')
            setShowBackendProxyModal(false)
            focusTextEditor()
          }}
          location={locationForBackend}
        />
      }
      <FileActionsContext.Provider value={fileActionsContext}>
        <SplitPane
          split='vertical'
          minSize={LEFT_PANE_COLLAPSED_SIZE}
          size={leftPaneSplitSize}
          maxSize={getMaxLeftPaneSize()}
          onChange={onLeftPaneResize}
          onDragFinished={onLeftPaneResizeFinished}
        >
          {leftPaneSplitSize >= LEFT_PANE_MIN_EXPANDED_SIZE
            ? (
              <div className='left-pane'>
                <FileTreeContainer themeName={themeName}>
                  <div className={combine(classes.pane, 'pane-segment')}>
                    <div className={classes.iconContainer}>
                      <SpaceBetween narrow>
                        <IconButton
                          stroke='search'
                          onClick={() => setSearchModalMode('both')}
                          text='Search'
                        />
                        <IconButton
                          stroke='caretSquareLeft'
                          onClick={toggleShowLeftPane}
                          text='Close File Pane'
                        />
                      </SpaceBetween>
                    </div>
                    <AutoHeadingScope>
                      <div className={combine(classes.heading, 'file-list-heading no-padding')}>
                        <AutoHeading className='file-list-heading-text'>
                          Module
                        </AutoHeading>
                      </div>
                      <div className={classes.fileList}>
                        <FileList
                          paths={files.main}
                          currentEditorFilePath={activeFilePath}
                        />
                        <FileList
                          title={t('editor_page.file_list.files')}
                          onCreateItem={createItem}
                          onFileSelect={fileActionsContext.onUploadStart}
                          paths={files.text}
                          currentEditorFilePath={activeFilePath}
                        />
                        {gitFilesLoading &&
                          <Segment basic>
                            <Icon name='asterisk' loading />Loading...
                          </Segment>
                        }
                        <FileList
                          title={t('editor_page.file_list.backends')}
                          onCreateBackendConfig={fileActionsContext.onCreateOrEditBackend}
                          disableNewFiles
                          paths={files.backends}
                          currentEditorFilePath={activeFilePath}
                        />
                        <FileList
                          title={t('editor_page.file_list.assets')}
                          subtitle={ASSET_FOLDER_PREFIX}
                          onCreateItem={newItem => createItem(newItem, ASSET_FOLDER)}
                          onCreateAssetBundle={fileActionsContext.onAssetBundleStart}
                          disableNewFiles
                          onFileSelect={fileActionsContext.onUploadStart}
                          paths={files.assets}
                          currentEditorFilePath={activeFilePath}
                        />
                      </div>
                    </AutoHeadingScope>

                    <input
                      className='hidden-input'
                      type='file'
                      accept={FILE_ACCEPT}
                      ref={uploadDrop}
                      onChange={handleFileUpload}
                      value=''
                      multiple
                    />
                  </div>
                  <div className='upload-prompt'>
                    <p>Drag + Drop to Upload</p>
                  </div>
                </FileTreeContainer>
                <FileUploadProgressBar
                  numFileUploading={fileUploadState.uploadFiles.length}
                  totalNumFiles={fileUploadState.uploadTotalNumFiles}
                  bytesUploaded={fileUploadState.uploadBytesUploaded}
                  totalBytes={fileUploadState.uploadTotalBytes}
                />
              </div>
            )
            : (
              <div className={combine(classes.hiddenIconContainer, 'hidden-pane vertical')}>
                <IconButton
                  stroke='caretSquareRight'
                  onClick={toggleShowLeftPane}
                  text='Open File Pane'
                  color='main'
                />
                <IconButton
                  stroke='search'
                  onClick={() => setSearchModalMode('both')}
                  text='Search'
                  color='main'
                />
              </div>
            )
          }
          <div className='main-pane'>
            <TabPaneContext.Provider value={tabPaneContext}>
              <FileStateContextProvider>
                <PaneDisplay />
              </FileStateContextProvider>
            </TabPaneContext.Provider>
          </div>
        </SplitPane>
      </FileActionsContext.Provider>
    </div>
  )
}

export {
  ModuleBrowsableMultitabEditorView as default,
}
