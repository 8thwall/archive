import React from 'react'
import {useTranslation} from 'react-i18next'

import {
  ASSET_FOLDER, ASSET_FOLDER_PREFIX, isModuleMainPath,
} from '../common/editor-files'
import {useCurrentGit} from '../git/hooks/use-current-git'
import {FileBrowserList} from './file-browser-list'
import {extractModuleFileLists} from '../editor/files/extract-file-lists'
import {useCurrentRepoId} from '../git/repo-id-context'
import {
  EditorFileLocation, extractScopedLocation, ScopedFileLocation,
} from '../editor/editor-file-location'
import {
  FileActionsContext, IFileActionsContext, NewItem,
} from '../editor/files/file-actions-context'
import {FileTreeContainer} from '../editor/file-tree-container'
import {useTheme} from '../user/use-theme'
import {NEW_TAB_PATH} from '../editor/editor-utils'
import {Loader} from '../ui/components/loader'

interface IModuleFileList {
  activeFileLocation: ScopedFileLocation
}

const ModuleFileList: React.FC<IModuleFileList> = ({activeFileLocation}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  const git = useCurrentGit()
  const progress = git.progress.load

  const repoId = useCurrentRepoId()

  const themeName = useTheme()

  const {
    onDiff, onRevert, onDelete, onRename, onSelect, onCreate, onDrop, onUploadStart, onFormat,
    onAssetBundleStart, build, onCreateOrEditBackend,
  } = React.useContext(FileActionsContext)

  if (progress !== 'DONE') {
    return (
      <Loader inline size='small' />
    )
  }

  // NOTE(christoph): The manifest is available through the module item directly so we don't
  // need to show it in the in-context list.
  const includeManifest = false
  const files = extractModuleFileLists(git, includeManifest)

  const activeFilePath = activeFileLocation.repoId === repoId ? activeFileLocation : null

  const actionsContext: IFileActionsContext = {
    onCreate: (newItem: NewItem, location: EditorFileLocation) => {
      onCreate(newItem, {...extractScopedLocation(location), repoId: git.repo.repoId})
    },
    onDrop: (e: React.DragEvent, location: EditorFileLocation) => {
      onDrop(e, location ? {...extractScopedLocation(location), repoId} : {repoId, filePath: ''})
    },
    onSelect: (location: EditorFileLocation) => {
      onSelect({...extractScopedLocation(location), repoId: git.repo.repoId})
    },
    onDelete: (location: EditorFileLocation) => {
      onDelete({...extractScopedLocation(location), repoId})
    },
    onRename: (newPath: string, prevLocation: EditorFileLocation) => {
      onRename(newPath, {...extractScopedLocation(prevLocation), repoId})
    },
    onRevert: (location: EditorFileLocation) => {
      onRevert({...extractScopedLocation(location), repoId})
    },
    onFormat: (location?: EditorFileLocation) => (
      onFormat({...extractScopedLocation(location), repoId})
    ),
    onDiff: (location: EditorFileLocation) => onDiff({...extractScopedLocation(location), repoId}),
    onUploadStart: (location?: EditorFileLocation) => (
      onUploadStart({...extractScopedLocation(location), repoId})
    ),
    onAssetBundleStart: (type?: string, location?: EditorFileLocation) => (
      onAssetBundleStart(type, {...extractScopedLocation(location), repoId})
    ),
    onCreateOrEditBackend,
    build,
    isProtectedFile: isModuleMainPath,
  }

  return (
    <FileActionsContext.Provider value={actionsContext}>
      <FileTreeContainer themeName={themeName}>
        <FileBrowserList
          paths={files.main}
          currentEditorFileLocation={activeFilePath}
        />

        <FileBrowserList
          title={t('editor_page.file_list.files')}
          paths={files.text}
          currentEditorFileLocation={activeFilePath}
          onFileSelect={actionsContext.onUploadStart}
          onCreateItem={newItem => onCreate(newItem, {repoId, filePath: undefined})}
        />

        <FileBrowserList
          title={t('editor_page.file_list.backends')}
          onCreateBackendConfig={() => {
            actionsContext.onCreateOrEditBackend({repoId, filePath: NEW_TAB_PATH})
          }}
          disableNewFiles
          paths={files.backends}
          currentEditorFileLocation={activeFilePath}
        />

        <FileBrowserList
          title={t('editor_page.file_list.assets')}
          subtitle={ASSET_FOLDER_PREFIX}
          onFileSelect={actionsContext.onUploadStart}
          disableNewFiles
          paths={files.assets}
          currentEditorFileLocation={activeFilePath}
          onCreateItem={newItem => onCreate(newItem, {repoId, filePath: ASSET_FOLDER})}
          onCreateAssetBundle={type => actionsContext.onAssetBundleStart(type)}
        />
      </FileTreeContainer>
    </FileActionsContext.Provider>
  )
}

export {
  ModuleFileList,
}
