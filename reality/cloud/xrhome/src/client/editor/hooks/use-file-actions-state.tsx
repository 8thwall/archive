import React, {useEffect, useRef} from 'react'

import {GlobalHotKeys} from 'react-hotkeys'

import {SearchModal, type SearchModes, type SearchValue} from '../modals/search-modal'
import {
  extractRepoId, type EditorFileLocation,
  extractFilePath, stripPrimaryRepoId,
} from '../editor-file-location'
import type {PersistentEditorSession} from './use-persistent-editor-session'
import {getRepoState} from '../../git/repo-state'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import {useOpenGits} from '../../git/hooks/use-open-gits'
import {useSelector} from '../../hooks'
import {useTabActions} from './use-tab-actions'
import coreGitActions from '../../git/core-git-actions'
import useActions from '../../common/use-actions'
import {lintAndFormat} from '../tooling/eslint'
import type {IGitFile} from '../../git/g8-dto'
import {
  containsFolderEntry, getDraggedFilePath, getRenamedFilePath, hasBundleFile,
  isLintablePath,
} from '../../common/editor-files'
import {useSaveSemaphoreContext} from './save-challenge-semaphore'
import {useUserEditorSettings} from '../../user/use-user-editor-settings'
import {PRIORITY_LATE} from '../../common/challenge-semaphore'
import {useEvent} from '../../hooks/use-event'
import {getEditorSocketSpecifier} from '../../common/hosting-urls'
import WebsocketPool from '../../websockets/websocket-pool'
import type {IFileActionsContext, NewItem} from '../files/file-actions-context'
import appsActionsProvider from '../../apps/apps-actions'
import {FOLDER_UPLOAD_ERROR} from '../editor-errors'
import {useFileUploadState} from './use-file-upload-state'
import type {IApp} from '../../common/types/models'
import type {MonacoEditor} from '../texteditor/monaco-types'
import {getSelection} from '../texteditor/monaco-selection'
import AssetBundleModal from '../modals/asset-bundle-modal'
import {useTextEditorContext} from '../texteditor/texteditor-context'
import {ModuleImportModal} from '../modules/module-import-modal'
import ViewSingleDiffModal from '../single-diff-view'
import AbandonChangesModal from '../modals/abandon-changes-modal'
import DeleteFileModal from '../modals/delete-file-modal'
import BackendConfigModal from '../modals/backend-config-modal'
import {useDismissibleModalContext} from '../dismissible-modal-context'
import {useCurrentRepoId} from '../../git/repo-id-context'
import {useDependencyContext} from '../dependency-context'
import {useMultiRepoContext} from '../multi-repo-context'
import FbxToGlbModal from '../modals/fbx-to-glb-modal'
import {isCloudStudioApp} from '../../../shared/app-utils'
import {CodeSearchContextProvider} from '../modals/code-search-context'

type BeforeFileSelectHandler = (
  file: EditorFileLocation,
  prevRenameFile?: EditorFileLocation
) => boolean

type FileRenameHandler = (
  oldLocation: EditorFileLocation,
  newLocation?: EditorFileLocation
) => void

interface IFileActionsState {
  app: IApp
  focusedEditor: React.MutableRefObject<MonacoEditor>
  editorSession: PersistentEditorSession
  checkProtectedFile: (filePath: string) => boolean
  onBeforeFileSelect?: BeforeFileSelectHandler
  onFileRename?: FileRenameHandler
}

const useFileActionsState = ({
  app, focusedEditor, editorSession, checkProtectedFile, onBeforeFileSelect, onFileRename,
}: IFileActionsState) => {
  const git = useCurrentGit()
  const {repo} = git
  const openRepos = useOpenGits(oGit => oGit.repo)
  const {error: showError} = useActions(appsActionsProvider)
  const globalGit = useSelector(s => s.git)
  const repoId = useCurrentRepoId()
  const {
    performDiff, createFolder, createFile, saveMultiRepo, revertFile,
    deleteFile, performMove, transformFile, renameFile: renameFileAction,
  } = useActions(coreGitActions)
  const dependencyContext = useDependencyContext()
  const multiRepoContext = useMultiRepoContext()

  const {focusTextEditor} = useTextEditorContext()
  const editorSettings = useUserEditorSettings()
  const {dismissModals} = useDismissibleModalContext()
  const repoStateForFile = (fileLocation: EditorFileLocation) => (
    getRepoState({git: globalGit}, extractRepoId(fileLocation) || repoId)
  )
  const {
    tabState, currentFileLocation,
  } = editorSession

  const {
    closeTabById, closeTab, switchTab, updateTab, handleSwitchTabs,
  } = useTabActions(editorSession)

  /* ==================== asset bundle modal ==================== */
  const [isCreatingAssetBundle, setIsCreatingAssetBundle] = React.useState(false)
  const [assetBundleTargetRepoId, setAssetBundleTargetRepoId] = React.useState<string>('')
  const [bundleFiles, setBundleFiles] = React.useState<File[]>(null)
  const [bundleType, setBundleType] = React.useState('')

  const handleCancelAssetBundle = () => {
    setIsCreatingAssetBundle(false)
    setBundleType(null)
    setBundleFiles(null)
    setAssetBundleTargetRepoId('')
  }

  const handleCreateAssetBundle = (type?: string, withinPath?: EditorFileLocation) => {
    setIsCreatingAssetBundle(true)
    setBundleType(type)
    setAssetBundleTargetRepoId(extractRepoId(withinPath))
  }

  /* ==================== FBX to GLB modal ==================== */
  const [showFbxToGlbModal, setShowFbxToGlbModal] = React.useState(false)
  const [fbxFilesToConvert, setFbxFilesToConvert] = React.useState<File[]>([])

  const handleCancelFbxToGlb = () => {
    setShowFbxToGlbModal(false)
    setFbxFilesToConvert([])
  }

  const maybeHandleFbxToGlb = (files: File[]) => {
    const fbxFiles = files.filter(file => file.name.endsWith('.fbx'))
    const restFiles = files.filter(file => !file.name.endsWith('.fbx'))
    if (!isCloudStudioApp(app) || fbxFiles.length === 0) {
      return files
    }
    setFbxFilesToConvert(fbxFiles)
    setShowFbxToGlbModal(true)
    return restFiles
  }

  /* ==================== search modal ==================== */
  const [searchModalMode, setSearchModalMode] = React.useState<SearchModes>(null)
  const [initialSearchValue, setInitialSearchValue] = React.useState('')

  const handleFileAndLineSelect = (searchValue: SearchValue) => {
    const {lineNum, column, ...loc} = searchValue
    if (lineNum && column) {
      switchTab(loc, {line: lineNum, column})
    } else {
      switchTab(loc)
    }
    setSearchModalMode(null)
  }

  const handleSearchShortcut = useEvent(async (evt?: Event) => {
    if (evt) {
      evt.preventDefault()
    }
    setSearchModalMode('code')
    setInitialSearchValue(getSelection(focusedEditor.current))
  })

  const handleSearch = () => {
    dismissModals()
    setSearchModalMode('both')
  }

  /* ==================== import and backend proxy modal ==================== */
  const [showImportModal, setShowImportModal] = React.useState(false)
  const [showBackendProxyModal, setShowBackendProxyModal] = React.useState(false)
  const [locationForBackend, setLocationForBackend] = React.useState<EditorFileLocation>('')

  /* ==================== file actions ==================== */
  const [viewDiff, setViewDiff] = React.useState<EditorFileLocation>('')
  const [revertingFile, setRevertingFile] = React.useState<EditorFileLocation>('')
  const [deletingFile, setDeletingFile] = React.useState<EditorFileLocation>('')

  const saveSemaphore = useSaveSemaphoreContext()

  const lintFile = async (fileLocation: EditorFileLocation = currentFileLocation) => {
    const repoForFile = repoStateForFile(fileLocation)?.repo
    if (!repoForFile) {
      // eslint-disable-next-line no-console
      console.error('Unable to format file due to missing repo for file')
      return
    }

    const filePath = extractFilePath(fileLocation)
    await transformFile(repoForFile, filePath, async (file: IGitFile) => {
      const linted = await lintAndFormat({
        filename: filePath,
        val: file.content,
      })
      return linted.val
    }, true)
  }

  useEffect(() => {
    if (!editorSettings.autoFormat || !isLintablePath(extractFilePath(currentFileLocation))) {
      return undefined
    }
    const sub = saveSemaphore.subscribe(async () => {
      await lintFile()
    }, {priority: PRIORITY_LATE})
    return () => saveSemaphore.unsubscribe(sub)
  }, [currentFileLocation])

  const saveDirtyAndBuild = useEvent(async (evt?: Event) => {
    if (evt) {
      evt.preventDefault()
    }
    await saveSemaphore.postChallenge()
    const clientSpecifier = getEditorSocketSpecifier({git, app}, 'current-client')
    WebsocketPool.broadcastMessage(clientSpecifier, {action: 'WAIT_AFTER_BUILD'})
    await saveMultiRepo(openRepos, dependencyContext, multiRepoContext)
  })

  const renameFile = async (newName: string, prevLocation_: EditorFileLocation) => {
    const prevLocation = stripPrimaryRepoId(prevLocation_, repoId)

    const newPath = getRenamedFilePath(newName, extractFilePath(prevLocation))
    const fileRepo = repoStateForFile(prevLocation)?.repo
    if (!fileRepo) {
      // eslint-disable-next-line no-console
      console.error('Cannot perform rename with missing repo for', prevLocation)
      return
    }
    const newLocation = {...prevLocation, filePath: newPath}
    await renameFileAction(fileRepo, extractFilePath(prevLocation), newPath)

    updateTab(prevLocation, newLocation)
    onBeforeFileSelect?.(newLocation, prevLocation_)
    onFileRename?.(prevLocation, newLocation)
  }

  const createItem = async (newItem: NewItem, folderLocation_?: EditorFileLocation) => {
    const folderLocation = stripPrimaryRepoId(folderLocation_, repoId)

    const folderPath = extractFilePath(folderLocation)
    const itemPath = folderPath ? `${folderPath}/${newItem.name}` : newItem.name
    const fileRepo = repoStateForFile(folderLocation)?.repo
    if (!fileRepo) {
      // eslint-disable-next-line no-console
      console.error('Cannot create file with missing repo for', folderPath)
      return
    }
    if (newItem.isFile) {
      await createFile(fileRepo, itemPath, newItem.fileContent || '')
      const newLocation = {repoId: extractRepoId(folderLocation), filePath: itemPath}
      switchTab(newLocation)
    } else {
      createFolder(fileRepo, itemPath)
    }
  }

  /* handle upload files */
  const uploadTargetLocation = useRef<EditorFileLocation>(null)
  const uploadDropRef = useRef<HTMLInputElement>(null)

  const {fileUploadState, uploadFiles} = useFileUploadState(
    app.repoId,
    app.assetLimitOverrides,
    isCloudStudioApp(app)
  )

  const handleUploadStart = (folderPath?: EditorFileLocation) => {
    uploadTargetLocation.current = folderPath
    uploadDropRef.current?.click()
  }

  const maybeHandleUploadAsBundle = (files: File[], folderLocation?: EditorFileLocation) => {
    if (hasBundleFile(files)) {
      setBundleFiles(files)
      setIsCreatingAssetBundle(true)
      setAssetBundleTargetRepoId(extractRepoId(folderLocation))
      return true
    }

    return false
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesAsArray: File[] = Array.from(e.target.files)
    if (maybeHandleUploadAsBundle(filesAsArray, uploadTargetLocation.current)) {
      return
    }
    const restFiles = maybeHandleFbxToGlb(filesAsArray)
    uploadFiles(restFiles, uploadTargetLocation.current)
  }

  const moveFileToFolder = async (
    fileLocation: EditorFileLocation, folderLocation: EditorFileLocation
  ) => {
    const prevLocation = stripPrimaryRepoId(fileLocation, repoId)

    const filePath = extractFilePath(fileLocation)
    const folderPath = extractFilePath(folderLocation)
    const newPath = getDraggedFilePath(filePath, folderPath)

    const newLocation = stripPrimaryRepoId(
      {repoId: extractRepoId(folderLocation), filePath: newPath},
      repoId
    )

    await performMove(
      {repoId: extractRepoId(fileLocation) || repoId, filePath},
      {repoId: extractRepoId(folderLocation) || repoId, filePath: newPath}
    )

    updateTab(prevLocation, newLocation)
    onBeforeFileSelect?.(newLocation, prevLocation)
    onFileRename?.(prevLocation, newLocation)
  }

  // Note (cindyhu): If file paths include a folder and its children files, we only want to
  // perform file actions on the folder
  const reduceToTopLevelFiles = (filePaths: string[]): string[] => {
    const sorted = [...filePaths].sort((a, b) => a.length - b.length)
    const result: string[] = []
    sorted.forEach((path: string) => {
      if (!result.some(parent => path !== parent && path.startsWith(`${parent}/`))) {
        result.push(path)
      }
    })
    return result
  }

  // e is a drop event that may contain files or the filePath of an existing file to move
  // folderPath is the target folder's path
  const handleDropEvent = (e: React.DragEvent, folderLocation: EditorFileLocation = null) => {
    const filePaths = e.dataTransfer.getData('filePaths')
    if (filePaths) {
      const topLevelFiles = reduceToTopLevelFiles(JSON.parse(filePaths))
      topLevelFiles.forEach((path: string) => {
        moveFileToFolder({filePath: path, repoId: e.dataTransfer.getData('repoId')}, folderLocation)
      })
      return
    }

    const filePath = e.dataTransfer.getData('filePath')
    if (filePath) {
      moveFileToFolder({filePath, repoId: e.dataTransfer.getData('repoId')}, folderLocation)
      return
    }

    if (containsFolderEntry(e.dataTransfer.items)) {
      showError(FOLDER_UPLOAD_ERROR)
      return
    }

    if (e.dataTransfer.files?.length > 0) {
      const filesAsArray: File[] = Array.from(e.dataTransfer.files)
      if (maybeHandleUploadAsBundle(filesAsArray, folderLocation)) {
        return
      }
      const restFiles = maybeHandleFbxToGlb(filesAsArray)
      // TODO(christoph): Handle upload within module
      uploadFiles(restFiles, folderLocation)
    }
  }
  /* end of handle upload files */

  const actionsContext: IFileActionsContext = {
    onCreate: createItem,
    onDrop: handleDropEvent,
    onSelect: (loc, options, paneId) => {
      const shouldSkip = onBeforeFileSelect?.(loc)
      if (shouldSkip) {
        return
      }
      switchTab(loc, options, paneId)
    },
    onUploadStart: handleUploadStart,
    onDelete: (loc: EditorFileLocation) => setDeletingFile(loc),
    onRename: renameFile,
    onRevert: (filePath: EditorFileLocation) => setRevertingFile(filePath),
    onFormat: lintFile,
    onDiff: (loc: EditorFileLocation) => {
      const fileRepo = repoStateForFile(loc)?.repo
      if (!fileRepo) {
        // eslint-disable-next-line no-console
        console.error('Cannot perform diff with missing repo for', loc)
        return
      }
      performDiff({
        repositoryName: fileRepo.repositoryName,
        repoId: fileRepo.repoId,
        findRenames: true,
        changePoint: 'WORKING',
      })
      setViewDiff(loc)
    },
    isProtectedFile: checkProtectedFile,
    onAssetBundleStart: handleCreateAssetBundle,
    onCreateOrEditBackend: (filePath: EditorFileLocation) => {
      setLocationForBackend(filePath)
      setShowBackendProxyModal(true)
    },
    build: saveDirtyAndBuild,
    onClose: closeTabById,
    onSearch: handleSearch,
  }
  /*  ==================== end of file actions ==================== */

  return {
    actionsContext,
    fileUploadState,
    handleFileUpload,
    setSearchModalMode,
    setShowImportModal,
    uploadDropRef,
    fileActionModals:
  <>
    {/* TODO(Dale): Refactor to react-hotkeys-hook */}
    <GlobalHotKeys
      keyMap={{
        saveDirtyAndBuild: Build8.PLATFORM_TARGET === 'desktop'
          ? undefined
          : ['ctrl+s', 'command+s'],
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
          dismissModals()
          handleSearchShortcut(e)
        },
        tabRight: e => handleSwitchTabs(e, 'right'),
        tabLeft: e => handleSwitchTabs(e, 'left'),
      }}
    />
    {isCreatingAssetBundle &&
      <AssetBundleModal
        repoId={assetBundleTargetRepoId || app.repoId}
        assetLimitOverrides={app.assetLimitOverrides}
        files={bundleFiles}
        type={bundleType}
        onClose={handleCancelAssetBundle}
      />
      }
    {showFbxToGlbModal &&
      <FbxToGlbModal
        files={fbxFilesToConvert}
        onClose={handleCancelFbxToGlb}
      />
    }
    <CodeSearchContextProvider>
      {searchModalMode &&
        <SearchModal
          onClose={() => {
            setSearchModalMode(null)
            setInitialSearchValue('')
            focusTextEditor()
          }}
          onFileSelect={(searchValue: SearchValue) => {
            handleFileAndLineSelect(searchValue)
            focusTextEditor()
          }}
          onModeChange={mode => setSearchModalMode(mode)}
          openFiles={tabState.tabs}
          searchMode={searchModalMode}
          initialSearchValue={initialSearchValue}
          filterOutAssets={isCloudStudioApp(app)}
        />
      }
    </CodeSearchContextProvider>
    {showImportModal && (
      <ModuleImportModal
        onClose={() => setShowImportModal(false)}
        appHostingType={app.hostingType}
      />
    )}
    {!!viewDiff &&
      <ViewSingleDiffModal
        onClose={(() => setViewDiff(''))}
        fileLocation={viewDiff}
      />
    }
    {!!revertingFile &&
      <AbandonChangesModal
        confirmSwitch={() => {
          const fileRepo = repoStateForFile(revertingFile)?.repo
          if (!fileRepo) {
            // eslint-disable-next-line no-console
            console.error('Cannot perform revert with missing repo for', revertingFile)
            return
          }
          revertFile(fileRepo, extractFilePath(revertingFile))
          setRevertingFile('')
        }}
        rejectSwitch={() => setRevertingFile('')}
        file={extractFilePath(revertingFile)}
      />
      }
    {!!deletingFile &&
      <DeleteFileModal
        confirmSwitch={async () => {
          const fileRepo = repoStateForFile(deletingFile)?.repo
          if (!fileRepo) {
            // eslint-disable-next-line no-console
            console.error('Cannot perform delete with missing repo for', deletingFile)
            return
          }
          closeTab(stripPrimaryRepoId(deletingFile, repo.repoId))
          await deleteFile(fileRepo, extractFilePath(deletingFile))
          setDeletingFile('')
        }}
        rejectSwitch={() => setDeletingFile('')}
        file={extractFilePath(deletingFile)}
      />
      }
    {showBackendProxyModal &&
      <BackendConfigModal
        onClose={(filePath) => {
          if (filePath) {
            if (extractFilePath(locationForBackend)) {
              updateTab(locationForBackend, filePath)
            } else {
              switchTab(filePath)
            }
          }
          setLocationForBackend('')
          setShowBackendProxyModal(false)
          focusTextEditor()
        }}
        location={locationForBackend}
      />
    }
  </>,
  }
}

export {
  useFileActionsState,
}

export type {
  BeforeFileSelectHandler,
  FileRenameHandler,
}
