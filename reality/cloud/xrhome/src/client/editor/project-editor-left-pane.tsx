import React, {useEffect, useRef} from 'react'
import {Icon, Segment} from 'semantic-ui-react'
import localForage from 'localforage'
import SplitPane from 'react-split-pane'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import useActions from '../common/use-actions'
import editorActions from './editor-actions'
import {FileList} from './file-list'
import {ASSET_FOLDER_PREFIX, isMainPath} from '../common/editor-files'
import FileUploadProgressBar from './file-upload-progress-bar'
import {LEFT_PANE_EXPANDED_SIZE} from './editor-utils'
import {FileActionsContext} from './files/file-actions-context'
import {extractProjectFileLists} from './files/extract-file-lists'
import {useCurrentGit} from '../git/hooks/use-current-git'
import type {UploadState} from './hooks/use-file-upload-state'
import {ModuleList} from './modules/module-list'
import {useSelector} from '../hooks'
import {extractTopLevelPath, ScopedFileLocation} from './editor-file-location'
import {FileTreeContainer} from './file-tree-container'
import {CollapseButton} from './files/collapse-button'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import AutoHeading from '../widgets/auto-heading'
import {combine} from '../common/styles'
import {IconButton} from '../ui/components/icon-button'
import {SpaceBetween} from '../ui/layout/space-between'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import useCurrentApp from '../common/use-current-app'
import {OnboardingId} from './product-tour/product-tour-constants'

const LEFT_PANE_COLLAPSED_SIZE = 30

const LEFT_PANE_MIN_EXPANDED_SIZE = 100

const MAX_SPLIT_PANE_SIZE = -35
const MIN_SPLIT_PANE_SIZE = 35

const MODULES_PANE_COLLAPSED_SIZE = 35
const MODULES_PANE_MIN_EXPANDED_SIZE = 100
const MODULES_PANE_MAX_EXPANDED_SIZE = 100

const SHOW_MODULES_PANE_TIMEOUT = 700

const getMaxLeftPaneSize = () => window.innerWidth * 0.8
const limitLeftPaneSize = (size: number) => Math.min(getMaxLeftPaneSize(), size)

const useStyles = createUseStyles({
  iconContainer: {
    position: 'absolute',
    gap: '1em',
    right: '16px',
    top: '8px',
    zIndex: '6',
  },
  hiddenIconContainer: {
    alignItems: 'center',
    right: '8px',
    top: '0',
    gap: '1em',
  },
  moduleList: {
    width: '100%',
    overflowY: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  fileBar: {
    flex: 'auto 1 90%',
    height: '100%',
  },
  uploadPrompt: {
    flex: '1 2 auto',
  },
  pane1: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
})

interface IProjectEditorLeftPane {
  themeName: string
  activeFileLocation: ScopedFileLocation
  onSearch: () => void
  fileUploadState: UploadState
  onCreateAssetBundle: (type?: string) => void
  modulesVisible: boolean
  onModuleImport: () => void
  showModulesPane: boolean
  children?: React.ReactNode
}

const ProjectEditorLeftPane: React.FC<IProjectEditorLeftPane> = ({
  themeName, activeFileLocation, onSearch,
  fileUploadState, onCreateAssetBundle, modulesVisible, onModuleImport,
  showModulesPane, children,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])
  const savedSize = useSelector(s => s.editor.leftPaneSplitSize)
  const savedModuleSize = useSelector(s => s.editor.modulePaneSplitSize)

  const initialPreferredSize = savedSize < LEFT_PANE_MIN_EXPANDED_SIZE
    ? LEFT_PANE_EXPANDED_SIZE
    : savedSize

  const [splitSize, setSplitSize] = React.useState(savedSize || LEFT_PANE_EXPANDED_SIZE)
  const [preferredSize, setPreferredSize] = React.useState(initialPreferredSize)
  const [modulesPaneSize, setModulesPaneSize] =
    React.useState(savedModuleSize || MODULES_PANE_COLLAPSED_SIZE)

  const [showProjectFiles, setShowProjectFiles] = React.useState(true)
  const [showModulesContent, setShowModulesContent] =
    React.useState(modulesPaneSize > MODULES_PANE_MIN_EXPANDED_SIZE)

  const app = useCurrentApp()
  const git = useCurrentGit()
  const files = extractProjectFileLists(git, isMainPath)

  const {setLeftPaneSplitSize} = useActions(editorActions)

  const {onCreate, onUploadStart} = React.useContext(FileActionsContext)

  const fileRef = useRef(null)

  const modulesPaneSizeKey = `editor-module-pane-size-${app.repoId}`

  useAbandonableEffect(async (maybeAbandon) => {
    const size = await maybeAbandon(localForage.getItem<number>(modulesPaneSizeKey))
    const clientHeight = fileRef.current?.clientHeight
    if (!size || !clientHeight) {
      return
    }
    setModulesPaneSize(size)
    setShowProjectFiles(size < clientHeight - MODULES_PANE_COLLAPSED_SIZE)
  }, [])

  const getCurrentHeight = () => fileRef.current?.clientHeight
  const getMaxHeight = () => getCurrentHeight() - MODULES_PANE_COLLAPSED_SIZE

  const handleFileDisplay = () => {
    setShowProjectFiles(!showProjectFiles)
    if (showModulesContent) {
      const finalSize = showProjectFiles ? getMaxHeight() : window.innerHeight / 3
      setModulesPaneSize(finalSize)
      localForage.setItem(modulesPaneSizeKey, finalSize)
    } else {
      const finalSize = showProjectFiles ? getMaxHeight() : MODULES_PANE_COLLAPSED_SIZE
      setModulesPaneSize(finalSize)
      localForage.setItem(modulesPaneSizeKey, finalSize)
    }
  }

  const handleModuleCollapse = () => {
    if (showModulesContent) {
      const finalSize = showProjectFiles ? MODULES_PANE_COLLAPSED_SIZE : getMaxHeight()
      setModulesPaneSize(finalSize)
      localForage.setItem(modulesPaneSizeKey, finalSize)
      setShowModulesContent(false)
    } else {
      if (showProjectFiles) {
        const finalSize = window.innerHeight / 3
        setModulesPaneSize(finalSize)
        localForage.setItem(modulesPaneSizeKey, finalSize)
      }
      setShowModulesContent(true)
    }
  }

  useEffect(() => {
    if (showModulesPane && !showModulesContent) {
      // TODO(Dale): Timeout used so not overwritten by localForage. Update with better solution.
      setTimeout(() => {
        handleModuleCollapse()
      }, SHOW_MODULES_PANE_TIMEOUT)
    }
  }, [showModulesPane])

  const toggleShowLeftPane = () => {
    setSplitSize((oldSize) => {
      const newSize = oldSize < LEFT_PANE_MIN_EXPANDED_SIZE
        ? limitLeftPaneSize(preferredSize)
        : LEFT_PANE_COLLAPSED_SIZE

      setLeftPaneSplitSize(newSize)
      return newSize
    })
  }

  const onLeftPaneResize = (newSize: number) => {
    setSplitSize(newSize)
  }

  const onLeftPaneResizeFinished = (rawSize: number) => {
    if (!rawSize) {
      return
    }
    const size = limitLeftPaneSize(rawSize)
    const collapse = size < LEFT_PANE_MIN_EXPANDED_SIZE

    const newSize = collapse ? LEFT_PANE_COLLAPSED_SIZE : size
    setLeftPaneSplitSize(newSize)

    if (!collapse) {
      setPreferredSize(newSize)
    }
    setSplitSize(newSize)
  }

  const handleResize = (size: number) => {
    setModulesPaneSize(size)
    setShowModulesContent(modulesPaneSize > MODULES_PANE_MIN_EXPANDED_SIZE)
    setShowProjectFiles(modulesPaneSize < getCurrentHeight() - MODULES_PANE_MAX_EXPANDED_SIZE)
  }

  const handleResizeFinished = (rawSize: number) => {
    const size = rawSize
    const collapse = size < MODULES_PANE_MIN_EXPANDED_SIZE
    const expand = size > getCurrentHeight() - MODULES_PANE_MAX_EXPANDED_SIZE

    if (collapse) {
      localForage.setItem(modulesPaneSizeKey, MODULES_PANE_COLLAPSED_SIZE)
      setModulesPaneSize(MODULES_PANE_COLLAPSED_SIZE)
    } else {
      const finalSize = expand ? getMaxHeight() : size
      setModulesPaneSize(finalSize)
      localForage.setItem(modulesPaneSizeKey, finalSize)
    }
  }

  const {
    uploadTotalNumFiles, uploadFiles,
    uploadTotalBytes, uploadBytesUploaded, uploadErrorMessage,
  } = fileUploadState

  const currentTopLevelPath = extractTopLevelPath(activeFileLocation)

  return (
    <SplitPane
      split='vertical'
      minSize={LEFT_PANE_COLLAPSED_SIZE}
      size={splitSize}
      maxSize={getMaxLeftPaneSize()}
      onChange={onLeftPaneResize}
      onDragFinished={onLeftPaneResizeFinished}
    >
      {splitSize >= LEFT_PANE_MIN_EXPANDED_SIZE
        ? (
          <div className='left-pane'>
            <div className={classes.fileBar} ref={fileRef}>
              <FileTreeContainer themeName={themeName}>
                <div className='pane-segment'>
                  <div className={classes.iconContainer}>
                    <SpaceBetween narrow>
                      <IconButton
                        stroke='search'
                        onClick={onSearch}
                        text='Search'
                        color='main'
                      />
                      <IconButton
                        stroke='caretSquareLeft'
                        onClick={toggleShowLeftPane}
                        text='Close File Pane'
                        color='main'
                      />
                    </SpaceBetween>
                  </div>
                  <SplitPane
                    primary='second'
                    split='horizontal'
                    minSize={MIN_SPLIT_PANE_SIZE}
                    maxSize={MAX_SPLIT_PANE_SIZE}
                    pane1Style={{overflowY: 'hidden', flex: '1 0 35px'}}
                    pane2Style={{flex: '0 1 auto'}}
                    size={modulesPaneSize}
                    onChange={handleResize}
                    onDragFinished={handleResizeFinished}
                  >
                    <div className={classes.pane1}>
                      <AutoHeadingScope>
                        <div className='file-list-heading'>
                          <CollapseButton
                            onClick={handleFileDisplay}
                            showFiles={showProjectFiles}
                          />
                          <AutoHeading className='file-list-heading-text'>
                            App
                          </AutoHeading>
                        </div>
                        {showProjectFiles &&
                          <div className='app-file-list'>
                            <FileList
                              paths={files.main}
                              currentEditorFilePath={currentTopLevelPath}
                              productTourId={OnboardingId.CORE_FILES}
                            />
                            <FileList
                              title='Files'
                              onCreateItem={onCreate}
                              onFileSelect={onUploadStart}
                              paths={files.text}
                              currentEditorFilePath={currentTopLevelPath}
                              productTourId={OnboardingId.FILES_AND_ASSETS}
                            />
                            {git.files && git.files.length === 0 &&
                              <Segment basic>
                                <Icon name='asterisk' loading />Loading...
                              </Segment>
                    }
                            <FileList
                              title='Assets'
                              subtitle={ASSET_FOLDER_PREFIX}
                              onCreateItem={newItem => onCreate(newItem, 'assets')}
                              onCreateAssetBundle={onCreateAssetBundle}
                              disableNewFiles
                              onFileSelect={onUploadStart}
                              paths={files.assets}
                              currentEditorFilePath={currentTopLevelPath}
                            />
                          </div>
                      }
                      </AutoHeadingScope>
                    </div>
                    {modulesVisible &&
                      <div className={classes.moduleList} id={OnboardingId.MODULES}>
                        <ModuleList
                          title='Modules'
                          openCreateModuleModal={onModuleImport}
                          paths={files.dependencies}
                          activeFileLocation={activeFileLocation}
                          showModulesContent={showModulesContent}
                          onToggleCollapsed={handleModuleCollapse}
                        />
                      </div>
                  }
                  </SplitPane>
                </div>
              </FileTreeContainer>
            </div>
            <div className={classes.uploadPrompt}>
              <FileTreeContainer
                themeName={themeName}
                classNameOverride='upload-prompt'
              >
                <p>{uploadErrorMessage || t('editor_page.widget.drag_and_drop_to_upload')}</p>
              </FileTreeContainer>
            </div>
            <FileUploadProgressBar
              numFileUploading={uploadFiles.length}
              totalNumFiles={uploadTotalNumFiles}
              bytesUploaded={uploadBytesUploaded}
              totalBytes={uploadTotalBytes}
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
              onClick={onSearch}
              text='Search'
              color='main'
            />
          </div>
        )
      }
      {children}
    </SplitPane>
  )
}

export {
  ProjectEditorLeftPane,
}
