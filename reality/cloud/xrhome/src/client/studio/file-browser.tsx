import React from 'react'
import {useTranslation} from 'react-i18next'

import {FileBrowserList, ItemType} from './file-browser-list'
import {ASSET_FOLDER_PREFIX, STUDIO_UPLOAD_ACCEPT} from '../common/editor-files'
import {extractProjectFileLists} from '../editor/files/extract-file-lists'
import {FileActionsContext} from '../editor/files/file-actions-context'
import {useCurrentGit} from '../git/hooks/use-current-git'
import type {UploadState} from '../editor/hooks/use-file-upload-state'
import FileUploadProgressBar from '../editor/file-upload-progress-bar'
import {FileTreeContainer} from '../editor/file-tree-container'
import {useUserEditorSettings} from '../user/use-user-editor-settings'
import {createThemedStyles} from '../ui/theme'
import {combine} from '../common/styles'
import type {ScopedFileLocation} from '../editor/editor-file-location'
import {ModuleListItem} from './module-list-item'
import {FloatingPanelButton} from '../ui/components/floating-panel-button'
import {Icon} from '../ui/components/icon'
import {useStudioMenuStyles} from './ui/studio-menu-styles'
import {FileBrowserSearchResults, FILE_BROWSER_FILTERS} from './file-browser-search-results'
import {OptionalFilters, SearchBar} from './ui/search-bar'
import {FileBrowserCornerButton} from './file-browser-corner-button'
import {StudioImageTargetBrowser} from './image-target-browser'
import editorActions from '../editor/editor-actions'
import useActions from '../common/use-actions'
import {useSelector} from '../hooks'
import useCurrentApp from '../common/use-current-app'
import {PrefabsList} from './prefabs-list'
import {Loader} from '../ui/components/loader'
import {useStudioStateContext, type FileBrowserSection} from './studio-state-context'
import {useMaybeLocalSyncContext} from './local-sync-context'
import {FloatingPanelIconButton} from '../ui/components/floating-panel-icon-button'
import {openProject} from './local-sync-api'

const AssetLabMiniLibrary = React.lazy(() => import('../asset-lab/asset-lab-mini-library'))

const FILE_ACCEPT = `.${STUDIO_UPLOAD_ACCEPT.join(',.')}`

const useStyles = createThemedStyles(theme => ({
  fileBrowser: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: theme.studioSectionBorder,
    height: '100%',
    flexGrow: 1,
  },
  sectionTitle: {
    'cursor': 'pointer',
    'userSelect': 'none',
    '&:disabled': {
      cursor: 'default',
    },
  },
  sectionTitleContainer: {
    'padding': '0.75em 0.75em 0.5em 0.75em',
    'display': 'flex',
    'flexDirection': 'row',
    'fontWeight': 700,
    'justifyContent': 'flex-start',
    'gap': '1em',
    'borderTop': theme.studioSectionBorder,
    'color': theme.fgMuted,
  },
  sectionTitleHorizontal: {
    'overflow-x': 'auto',
    'flex': '0 0 auto',  // Since we are scrolling horizontally, don't allow to be squished.
    '&::-webkit-scrollbar': {
      height: '6px !important',
    },
    '& > *': {
      flex: '1 0 auto',
    },
  },
  sectionActive: {
    color: theme.fgMain,
  },
  fileListContainer: {
    overflowY: 'auto',
    flexGrow: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  fileTreeContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  onDropHover: {
    backgroundColor: theme.studioTreeHoverBg,
  },
  importModuleButton: {
    margin: '0.5em 1em',
  },
  searchBarContainer: {
    'padding': '0 0.75rem 0.5rem',
    'display': 'flex',
    'gap': '0.5rem',
    '& > div': {
      minWidth: 0,
    },
  },
  collapseToggle: {
    'flexGrow': 1,
    '&:disabled': {
      cursor: 'default',
    },
  },
}))

interface IFileBrowser {
  onCreateAssetBundle: (type?: string) => void
  uploadDropRef: React.RefObject<HTMLInputElement>
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileUploadState: UploadState
  activeFileLocation: ScopedFileLocation
  openCreateModuleModal: () => void
  isStudio?: boolean
}

const FileBrowser: React.FC<IFileBrowser> = ({
  onCreateAssetBundle, uploadDropRef, handleFileUpload, fileUploadState, activeFileLocation,
  openCreateModuleModal, isStudio,
}) => {
  const classes = useStyles()
  const studioStyles = useStudioMenuStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'cloud-studio-pages'])

  const [searchValue, setSearchValue] = React.useState('')
  const [filters, setFilters] = React.useState<string[]>([])
  const [externalAdding, setExternalAdding] = React.useState(false)
  const [externalAddingAssets, setExternalAddingAssets] = React.useState(false)
  const [externalItemType, setExternalItemType] = React.useState<ItemType>(null)

  const app = useCurrentApp()
  const {saveFileBrowserHeightPercent} = useActions(editorActions)
  const isFileBrowserCollapsed = useSelector(
    s => s.editor.byKey[app.appKey]?.fileBrowserHeightPercent === 0
  )

  const localSyncContext = useMaybeLocalSyncContext()
  const filesLoading = localSyncContext && localSyncContext.fileSyncStatus !== 'active'

  const stateCtx = useStudioStateContext()
  const {currentBrowserSection: currentSection} = stateCtx.state

  const handleExternalAdding = (adding: boolean, isAssetPath?: boolean) => {
    setExternalAddingAssets(isAssetPath && adding)
    setExternalAdding(!isAssetPath && adding)
  }

  const handleToggleCollapsed = () => {
    if (!isFileBrowserCollapsed) {
      saveFileBrowserHeightPercent(app.appKey, 0)
    } else {
      saveFileBrowserHeightPercent(app.appKey)
    }
  }

  const handleSectionClick = (section: FileBrowserSection) => {
    if (isFileBrowserCollapsed) {
      handleToggleCollapsed()
    }

    stateCtx.update(p => ({...p, currentBrowserSection: section}))
  }

  const git = useCurrentGit()
  const files = extractProjectFileLists(git, () => false)
  const modulePaths = files.dependencies.filePaths
  // note(alan): deprecating modules, hide if none exist in the project but show if they do
  const hasModules = modulePaths.length > 0

  const {onCreate, onUploadStart} = React.useContext(FileActionsContext)

  const {
    uploadTotalNumFiles, uploadFiles, uploadTotalBytes, uploadBytesUploaded,
  } = fileUploadState

  const editorSettings = useUserEditorSettings()
  const isDarkMode = editorSettings.darkMode
  const themeName = isDarkMode ? 'dark' : 'light'

  const filesList = filesLoading
    ? <Loader size='small' />
    : (
      <FileTreeContainer
        themeName={themeName}
        hoverClassName={classes.onDropHover}
        classNameOverride={classes.fileTreeContainer}
      >
        {files.main.filePaths.length > 0 && files.main.folderPaths.length > 0 &&
          <FileBrowserList
            paths={files.main}
            currentEditorFileLocation={activeFileLocation}
          />
      }
        <FileBrowserList
          onCreateItem={onCreate}
          onFileSelect={onUploadStart}
          paths={files.text}
          currentEditorFileLocation={activeFileLocation}
          externalAdding={externalAdding}
          setExternalAdding={handleExternalAdding}
          externalItemType={externalItemType}
          setExternalItemType={setExternalItemType}
        />
        <FileBrowserList
          title={t('editor_page.file_list.assets')}
          subtitle={ASSET_FOLDER_PREFIX}
          onCreateItem={newItem => onCreate(newItem, 'assets')}
          onCreateAssetBundle={onCreateAssetBundle}
          disableNewFiles
          onFileSelect={onUploadStart}
          setExternalAdding={handleExternalAdding}
          externalAdding={externalAddingAssets}
          externalItemType={externalItemType}
          setExternalItemType={setExternalItemType}
          paths={files.assets}
          currentEditorFileLocation={activeFileLocation}
          grow
        />
        <input
          className='hidden-input'
          type='file'
          accept={FILE_ACCEPT}
          ref={uploadDropRef}
          onChange={handleFileUpload}
          value=''
          multiple
        />
        <FileUploadProgressBar
          numFileUploading={uploadFiles.length}
          totalNumFiles={uploadTotalNumFiles}
          bytesUploaded={uploadBytesUploaded}
          totalBytes={uploadTotalBytes}
        />
      </FileTreeContainer>
    )

  const modulesList = (
    <>
      <div>
        {modulePaths.map(modulePath => (
          <ModuleListItem
            key={modulePath}
            filePath={modulePath}
            activeFileLocation={activeFileLocation}
          />
        ))}
      </div>
      <div className={classes.importModuleButton}>
        <FloatingPanelButton
          a8='click;studio;new-module-button'
          spacing='full'
          onClick={() => openCreateModuleModal()}
        >
          <Icon stroke='plus' inline />
          {t('file_browser.modules_list.button.new_module', {ns: 'cloud-studio-pages'})}
        </FloatingPanelButton>
      </div>
    </>
  )

  const searchResults = (
    <FileBrowserSearchResults
      searchValue={searchValue}
      filters={filters}
      clearSearch={() => {
        setSearchValue('')
        setFilters([])
      }}
    />
  )

  return (
    <div className={combine(classes.fileBrowser, isStudio && studioStyles.studioFont)}>
      <div className={combine(classes.sectionTitleContainer, classes.sectionTitleHorizontal)}>
        <button
          a8='click;studio;file-browser-files-tab'
          type='button'
          onClick={() => handleSectionClick('files')}
          className={combine(
            'style-reset', classes.sectionTitle,
            currentSection === 'files' && classes.sectionActive
          )}
          disabled={!isFileBrowserCollapsed && currentSection === 'files'}
        >
          {t('editor_page.file_list.files')}
        </button>
        <button
          a8='click;studio;file-browser-asset-lab-tab'
          type='button'
          onClick={() => {
            handleSectionClick('assetLab')
            setSearchValue('')
          }}
          className={combine(
            'style-reset', classes.sectionTitle,
            currentSection === 'assetLab' && classes.sectionActive
          )}
        >
          {t('file_browser.asset_lab.label', {ns: 'cloud-studio-pages'})}
        </button>
        <button
          type='button'
          onClick={() => {
            handleSectionClick('prefabs')
            setSearchValue('')
          }}
          className={combine(
            'style-reset', classes.sectionTitle,
            currentSection === 'prefabs' && classes.sectionActive
          )}
        >
          {t('file_browser.prefabs.label', {ns: 'cloud-studio-pages'})}
        </button>
        <button
          type='button'
          onClick={() => {
            handleSectionClick('imageTargets')
            setSearchValue('')
            setFilters([])
          }}
          className={combine(
            'style-reset', classes.sectionTitle,
            currentSection === 'imageTargets' && classes.sectionActive
          )}
          disabled={!isFileBrowserCollapsed && currentSection === 'imageTargets'}
        >
          {t('file_browser.image_targets.short_label', {ns: 'cloud-studio-pages'})}
        </button>
        {hasModules &&
          <button
            a8='click;studio;file-browser-modules-tab'
            type='button'
            onClick={() => {
              handleSectionClick('modules')
              setSearchValue('')
              setFilters([])
            }}
            className={combine(
              'style-reset', classes.sectionTitle,
              currentSection === 'modules' && classes.sectionActive
            )}
            disabled={!isFileBrowserCollapsed && currentSection === 'modules'}
          >
            {t('file_browser.modules_list.label', {ns: 'cloud-studio-pages'})}
          </button>}
      </div>
      {currentSection === 'files' &&
        <div className={classes.searchBarContainer}>
          <SearchBar
            searchText={searchValue}
            setSearchText={setSearchValue}
            filterOptions={collapse => (
              <OptionalFilters
                options={FILE_BROWSER_FILTERS}
                noneOption={t('file_browser.search_bar.option.all', {ns: 'cloud-studio-pages'})}
                filters={filters}
                setFilters={setFilters}
                collapse={collapse}
              />
            )}
            a8='click;studio-bottom-left-pane;file-browser-click'
          />
          {Build8.PLATFORM_TARGET === 'desktop' &&
            <FloatingPanelIconButton
              text={t('file_configurator.button.open_externally', {ns: 'cloud-studio-pages'})}
              stroke='openFolder'
              onClick={() => openProject(app.appKey)}
            />
          }
          <FileBrowserCornerButton
            onFileSelect={onUploadStart}
            onCreateAssetBundle={onCreateAssetBundle}
            onCreateItem={onCreate}
            onCreateNewModule={() => openCreateModuleModal()}
            setExternalAdding={handleExternalAdding}
            setExternalItemType={setExternalItemType}
            isFileSection={currentSection === 'files'}
          />
        </div>
      }
      {((!searchValue && filters.length === 0) || externalItemType)
        ? (
          <div className={classes.fileListContainer}>
            {currentSection === 'files' && filesList}
            {currentSection === 'modules' && modulesList}
            {currentSection === 'prefabs' && <PrefabsList />}
            {currentSection === 'imageTargets' && <StudioImageTargetBrowser />}
            {currentSection === 'assetLab' &&
              <React.Suspense fallback={<div><Loader animateSpinnerColor /></div>}>
                <AssetLabMiniLibrary />
              </React.Suspense>
            }
          </div>
        )
        : searchResults
      }
    </div>
  )
}

export {
  FileBrowser,
  useStyles as useFileBrowserStyles,
}
