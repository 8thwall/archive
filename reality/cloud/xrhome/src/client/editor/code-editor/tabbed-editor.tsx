import React, {useEffect, useContext, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {FileTabInfo, SortableFileTabs} from './sortable-file-tabs'
import {isMarkdownPath, NEW_TAB_PATH} from '../editor-utils'
import {useTheme} from '../../user/use-theme'
import {SaveSemaphoreContext} from '../hooks/save-challenge-semaphore'
import {useLiveEditState} from '../hooks/use-live-edit-state'
import {FileActionsContext, useFileActionsContext} from '../files/file-actions-context'
import {
  isAssetPath, isDependencyPath, isBackendPath, isLintablePath, MANIFEST_FILE_PATH,
  README_FILE_PATH,
} from '../../common/editor-files'
import AssetInspector from '../asset-inspector'
import type {ScrollTo} from '../hooks/use-ace-scroll'
import {MarkdownPreview} from '../markdown-preview'
import {MarkdownButtonBar} from '../markdown-button-bar'
import {ModuleConfigBuilder} from '../module-config/module-config-builder'
import {TextEditor} from '../texteditor/texteditor'
import {
  deriveLocationKey, EditorFileLocation, editorFileLocationEqual, extractFilePath,
} from '../editor-file-location'
import {useChangeEffect} from '../../hooks/use-change-effect'
import {DependencyPane} from '../dependency-pane'
import type {CustomState, EditorTab} from '../tab-state'
import {IconButton} from '../../ui/components/icon-button'
import {createThemedStyles} from '../../ui/theme'
import {useMountedRef} from '../../hooks/use-mounted'
import {useTextEditorContext} from '../texteditor/texteditor-context'
import {isMac} from '../device-models'
import {useTabPaneContext} from './tab-pane-context'
import {useEvent} from '../../hooks/use-event'
import * as EditorTabState from '../tab-state'
import {BackendConfigBuilder} from '../backend-config/backend-config-builder'
import {RepoIdProvider} from '../../git/repo-id-context'
import {isBuiltInMonacoFile} from '../is-built-in-monaco-file'

const FORMAT_LOADING_DELAY = 400
const FORMAT_SHORTCUT = isMac(navigator.userAgent, navigator.platform) ? '⌥-⇧-F' : 'Alt-⇧-F'

const useStyles = createThemedStyles(theme => ({
  tabbedEditor: {
    display: 'flex',
    flex: '1 0 0',
    flexDirection: 'column',
    minWidth: '0',
    height: '100%',
    position: 'relative',
  },
  tabRow: {
    display: 'flex',
    backgroundColor: theme.tabBarBg,
  },
  plusButton: {
    padding: '0.5em 0.5em 0.25em 0.5em',
  },
  actionButton: {
    'padding': '0.5em 0 0.25em 0',
    'color': theme.fgMuted,
    '&:hover': {
      color: theme.fgMain,
    },
    // (Dale) Added to remove changed layout when loading
    'height': '0',
    'minHeight': '100%',
  },
  actionBar: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: '0.5em',
    gap: '0.5em',
  },
  deletedMessage: {
    paddingLeft: '0.75rem',
  },
}))

interface IFormatButton {
  onClick: () => Promise<void>
}

const FormatButton: React.FC<IFormatButton> = ({onClick}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isVisiblyLoading, setIsVisiblyLoading] = React.useState(false)
  const {focusTextEditor} = useTextEditorContext()
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  const mountedRef = useMountedRef()
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

  const handleClick = async () => {
    setIsLoading(true)
    // NOTE(christoph): We only want the loading state to appear after a certain time.
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsVisiblyLoading(true)
    }, FORMAT_LOADING_DELAY)
    try {
      await onClick()
    } finally {
      clearTimeout(timeoutRef.current)
      if (mountedRef.current) {
        setIsLoading(false)
        setIsVisiblyLoading(false)
        focusTextEditor()
      }
    }
  }

  React.useEffect(() => () => {
    clearTimeout(timeoutRef.current)
  }, [])

  return (
    <div className={classes.actionButton}>
      <IconButton
        onClick={handleClick}
        disabled={isLoading}
        loading={isVisiblyLoading}
        text={t('editor_page.tabbed_editor.buttons.action_bar.format_file')}
        // TODO(christoph): Switch to exposing title by default after auditing usage.
        title={
          // eslint-disable-next-line local-rules/hardcoded-copy
          `${t('editor_page.tabbed_editor.buttons.action_bar.format_file')} (${FORMAT_SHORTCUT})`
        }
        stroke='format'
      />
    </div>
  )
}

const PopoutButton: React.FC = () => {
  const {t} = useTranslation(['cloud-editor-pages'])
  const classes = useStyles()
  const {onPopout} = useTabPaneContext()
  return (
    <div className={classes.actionButton}>
      <IconButton
        onClick={onPopout}
        text={t('editor_page.tabbed_editor.buttons.action_bar.pop_out')}
        title={t('editor_page.tabbed_editor.buttons.action_bar.pop_out')}
        stroke='popOut'
      />
    </div>
  )
}

const SearchButton: React.FC<{a8?: string}> = ({a8}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  const classes = useStyles()
  const {onSearch} = useFileActionsContext()
  return (
    <div className={classes.actionButton}>
      <IconButton
        a8={a8}
        stroke='search'
        onClick={onSearch}
        text={t('editor_page.tabbed_editor.buttons.action_bar.search')}
        title={t('editor_page.tabbed_editor.buttons.action_bar.search')}
      />
    </div>
  )
}

interface ISplitButton {
  paneId: number
}

const SplitButton: React.FC<ISplitButton> = ({paneId}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  const classes = useStyles()
  const {splitPane} = useTabPaneContext()
  return (
    <div className={classes.actionButton}>
      <IconButton
        onClick={() => splitPane(paneId)}
        text={t('editor_page.tabbed_editor.buttons.action_bar.split_pane')}
        title={t('editor_page.tabbed_editor.buttons.action_bar.split_pane')}
        stroke='split'
      />
    </div>
  )
}

interface ITabbedEditor {
  paneId: number
  activeEditorLocation: EditorFileLocation
  tabs: FileTabInfo[]
  makeNewTab: () => void
  scrollTo?: ScrollTo
  onFilePathChange?: (location: string, options?: ScrollTo) => void

  // TODO(pawel) Can logic relying on this be brought into this component?
  currentTab?: EditorTab
  onTabStateChange?: (cs: CustomState) => void
}

const TabbedEditor: React.FunctionComponent<ITabbedEditor> = ({
  paneId, activeEditorLocation, tabs, makeNewTab, scrollTo, onFilePathChange,
  currentTab, onTabStateChange,
}) => {
  const themeName = useTheme()
  const classes = useStyles()
  const tabPaneContext = useTabPaneContext()
  const textEditorContext = useTextEditorContext()
  const tabbedEditorElementRef = useRef<HTMLDivElement>(null)
  const {t} = useTranslation(['cloud-editor-pages'])
  const topTab = EditorTabState.getTopTabInStack(tabPaneContext.tabState)
  const topTabInPane = EditorTabState.getTopTabInPane(tabPaneContext.tabState, paneId)
  const onFocus = useEvent(() => {
    if (currentTab?.id !== topTab?.id) {
      tabPaneContext.onFocus(currentTab?.id)
    }
  })
  const {draggingTab, dragTargetPaneId, disableSplit, isStandAlone, onPopout} = tabPaneContext

  const {onSearch} = useFileActionsContext()

  const onMouseEnter = () => {
    if (draggingTab.current) {
      dragTargetPaneId.current = paneId
    }
  }

  const onMouseLeave = () => {
    if (draggingTab.current) {
      dragTargetPaneId.current = -1
    }
  }

  useEffect(() => {
    const tabbedEditorElement = tabbedEditorElementRef.current

    // TODO(johnny): Swap over to 'onFocus' solution proposed in this issue.
    // https://github.com/facebook/react/issues/6410#issuecomment-671499208
    tabbedEditorElement.addEventListener('focusin', onFocus)
    return () => {
      tabbedEditorElement.removeEventListener('focusin', onFocus)
    }
  }, [])

  const unscopedFilepath = extractFilePath(activeEditorLocation)

  const [makeFileTabInView, setMakeFileTabInView] = useState(true)

  // TODO(pawel) Monaco needs to know that we can't import across repos.
  // This is temporary so that the edit sessions/models don't get mixed up.
  const virtualPath = deriveLocationKey(activeEditorLocation)

  const editState = useLiveEditState(activeEditorLocation)

  const renderedFilePath = editState.liveFile?.filePath || ''
  const renderedContent = editState.liveFile?.content || ''

  const [previewTheme, setPreviewTheme] = React.useState(themeName)

  const toggleRichPreview = () => {
    tabPaneContext.updateTabCustomState(currentTab.id, {
      previewingMarkdown: !currentTab.customState.previewingMarkdown,
    })
  }

  const toggleRichPreviewTheme = () => {
    setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')
  }

  const {onFormat, onSelect} = useContext(FileActionsContext)
  const handleLint = () => onFormat(activeEditorLocation)

  const saveSemaphore = useContext(SaveSemaphoreContext)
  useEffect(() => {
    const id = saveSemaphore.subscribe(editState.flush)
    return () => saveSemaphore.unsubscribe(id)
  }, [saveSemaphore, editState.flush])

  // Flush contents when path changes.
  useChangeEffect(
    ([previousEditorLocation, previousFlush]: [EditorFileLocation | undefined, () => void]) => {
      if (previousEditorLocation === undefined) {
        return
      }
      if (!editorFileLocationEqual(
        previousEditorLocation, activeEditorLocation
      )) {
        previousFlush()
        setMakeFileTabInView(true)
      }
    }, [activeEditorLocation, editState.flush]
  )

  useChangeEffect(([, prevFilePath]) => {
    // TODO(christoph): Switch module editor to use EditorTabs
    const fileChangedWhileEphemeral = prevFilePath &&
      editorFileLocationEqual(prevFilePath, unscopedFilepath) &&
      currentTab?.ephemeral

    if (fileChangedWhileEphemeral) {
      onSelect(activeEditorLocation, null, paneId)
    }

    // Default to preview mode for README.md files.
    if (currentTab && currentTab.customState.previewingMarkdown === undefined &&
        unscopedFilepath === README_FILE_PATH) {
      currentTab.customState.previewingMarkdown = true
    }
  }, [renderedContent, unscopedFilepath])

  // When unmounting, also flush the edit state.
  const latestFlush = useRef(null)
  useEffect(() => {
    latestFlush.current = editState.flush
  }, [editState.flush])
  useEffect(() => () => latestFlush.current?.(), [])

  const getTextEditor = () => (
    <TextEditor
      activePath={virtualPath}
      value={renderedContent}
      onValueChange={editState.onChange}
      flush={editState.flush}
      handleLint={handleLint}
      scrollTo={scrollTo}
      onFilePathChange={onFilePathChange}
      currentTabId={currentTab?.id}
    />
  )

  const isDefFile = isBuiltInMonacoFile(topTabInPane?.filePath) &&
    textEditorContext.editorToUse === 'Monaco'

  const getViewToDisplay = () => {
    // NOTE(johnny): Since git redux is not cleaned on client switch, editorState can exist
    // but the tab can be deleted.
    if (tabs.find(tab => tab.filePath === topTabInPane?.filePath)?.deleted && !isDefFile) {
      return (
        <div className={classes.deletedMessage}>
          {t('editor_page.tabbed_editor.file_content.file_deleted')}
        </div>
      )
    }
    if (renderedFilePath === NEW_TAB_PATH && !isDefFile) {
      return null
    }
    if (isAssetPath(unscopedFilepath)) {
      return (
        <AssetInspector
          assetPath={renderedFilePath}
          assetContent={renderedContent}
        />
      )
    }
    if (tabPaneContext.mode === 'module' && unscopedFilepath === MANIFEST_FILE_PATH) {
      return (
        <>
          <ModuleConfigBuilder />
          {BuildIf.EXPERIMENTAL && getTextEditor()}
        </>
      )
    }
    if (isMarkdownPath(unscopedFilepath)) {
      if (currentTab?.customState.previewingMarkdown) {
        return (
          <MarkdownPreview
            activeEditorLocation={activeEditorLocation}
            previewTheme={previewTheme}
            toggleRichPreviewTheme={toggleRichPreviewTheme}
            toggleRichPreview={toggleRichPreview}
          />
        )
      } else {
        return (
          <>
            <MarkdownButtonBar
              isShowingRichPreview={false}
              previewTheme={previewTheme}
              toggleRichPreviewTheme={toggleRichPreviewTheme}
              toggleRichPreview={toggleRichPreview}
            />
            {getTextEditor()}
          </>
        )
      }
    }
    if (tabPaneContext.mode === 'app' && isDependencyPath(unscopedFilepath)) {
      return (
        <DependencyPane
          dependencyPath={unscopedFilepath}  // Currently assumes primaryRepoId.
          tabState={currentTab?.customState}
          onTabStateChange={onTabStateChange}
        />
      )
    }
    if (isBackendPath(unscopedFilepath)) {
      const tabRepoId = topTabInPane?.repoId
      return tabRepoId
        ? (
          <RepoIdProvider value={tabRepoId}>
            <BackendConfigBuilder
              key={deriveLocationKey(activeEditorLocation)}
              configPath={unscopedFilepath}
            />
          </RepoIdProvider>
        )
        : <BackendConfigBuilder
            key={deriveLocationKey(activeEditorLocation)}
            configPath={unscopedFilepath}
        />
    }

    return getTextEditor()
  }

  const showActionBar = topTab?.paneId === paneId

  return (
    <div className={classes.tabbedEditor} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className={classes.tabRow}>
        <SortableFileTabs
          items={tabs}
          themeName={themeName}
          makeFileTabInView={makeFileTabInView}
          unsetMakeFileTabInView={() => setMakeFileTabInView(false)}
        />
        <div className={classes.plusButton}>
          <IconButton
            onClick={makeNewTab}
            text={t('editor_page.tabbed_editor.buttons.new_tab')}
            stroke='plus'
            color='main'
          />
        </div>
        {showActionBar &&
          <div className={classes.actionBar}>
            {onSearch && <SearchButton a8='click;tabbed-editor;search-click' />}
            {!disableSplit && <SplitButton paneId={paneId} />}
            {isLintablePath(unscopedFilepath) && <FormatButton onClick={handleLint} />}
            {!isStandAlone && onPopout && <PopoutButton />}
          </div>
        }
      </div>
      {/* eslint-disable-next-line */}
      <div
        className={classes.tabbedEditor}
        onClick={onFocus}
        ref={tabbedEditorElementRef}
      >
        {getViewToDisplay()}
      </div>
    </div>
  )
}

export {
  TabbedEditor,
}
