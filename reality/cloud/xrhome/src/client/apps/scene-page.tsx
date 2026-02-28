import React from 'react'
import SplitPane from 'react-split-pane'
import {useTranslation} from 'react-i18next'

import editorActions from '../editor/editor-actions'
import '../static/styles/code-editor.scss'
import ErrorMessage from '../home/error-message'
import {G8ErrorMessage} from '../git/g8-error-message'
import Title from '../widgets/title'
import {getDisplayNameForApp} from '../../shared/app-utils'
import useActions from '../common/use-actions'
import useCurrentApp from '../common/use-current-app'
import {useSimulatorVisible} from '../editor/app-preview/use-simulator-state'
import SceneFileEdit from '../studio/scene-file-edit'
import {useCurrentGit} from '../git/hooks/use-current-git'
import GitProgressIndicator from '../editor/git-progress-indicator'
import {EditorThemeProvider} from '../editor/editor-theme-provider'
import {useUserEditorSettings} from '../user/use-user-editor-settings'
import {combine} from '../common/styles'
import {FloatingTray} from '../ui/components/floating-tray'
import {BuildControlTray} from '../studio/build-control-tray'
// eslint-disable-next-line import/no-cycle
import {FloatingNavigation} from '../studio/floating-navigation'
import {FileActionsContext} from '../editor/files/file-actions-context'
import {CodeEditor} from '../editor/code-editor/code-editor'
import {LogContainerSplit} from './log-container-split'
import {ModuleActionsContext} from '../editor/modules/module-actions-context'
import {SceneStateContext} from '../studio/scene-state-context'
import {ErrorMessage as StudioErrorMessage} from '../studio/error-message'
import {actions as gitActions} from '../git/git-actions'
import {ProjectSwitchActiveBrowserModal} from '../editor/project-active-broswer-modal'
import NewProjectModal from '../editor/modals/new-project-modal'
import {useUuid} from '../hooks/use-uuid'
import {SceneDebugContext} from '../studio/scene-debug-context'
import {FloatingIconButton} from '../ui/components/floating-icon-button'
import {SourceControlConfigurator} from '../studio/configuration/source-control-configurator'
import {useStudioFileActionState} from '../studio/hooks/use-studio-file-action-state'
import {AppPathEnum} from '../common/paths'
import {CodeEditorSettings} from '../studio/configuration/code-editor-settings'
import {openInWindow} from '../editor/app-preview/open-window'
import {useAppPathsContext} from '../common/app-container-context'
import {FixedHelpButtonTray} from '../studio/fixed-help-button-tray'
import {
  EditorFileLocation,
  editorFileLocationEqual,
  extractFilePath,
  extractRepoId,
} from '../editor/editor-file-location'
import {isAssetPath} from '../common/editor-files'
import {PanelSelection, useStudioStateContext} from '../studio/studio-state-context'
import {GsbStateContextProvider, useGsbStateContext} from '../studio/gsb/gsb-state-context'
import {StudioAgentStateContextProvider} from '../studio/studio-agent/studio-agent-context'
import {LocalSyncContextProvider} from '../studio/local-sync-context'
import {DebugSessionsMenu} from '../studio/debug-sessions-menu'
import {AssetLabStateContextProvider} from '../asset-lab/asset-lab-context'
import {PublishingStateContextProvider} from '../editor/publishing/publish-context'
import {useSceneContext} from '../studio/scene-context'
import {replaceAssetInScene} from '../studio/replace-asset'
import type {FileRenameHandler} from '../editor/hooks/use-file-actions-state'
import coreGitActions from '../git/core-git-actions'
import {CurrentSceneDiffModal} from '../studio/current-scene-diff-modal'
import {StudioMonacoSetup} from '../editor/texteditor/monaco-setup'
import {ErrorBoundary} from '../common/error-boundary'
import {WhatsNewTrigger} from './whats-new-trigger'
import {useTextEditorContext} from '../editor/texteditor/texteditor-context'

const CODE_EDITOR_DEFAULT_SIZE = 400
const CODE_EDITOR_COLLAPSED_SIZE = 60
const MIN_SPLIT_PANE_WIDTH = 600

interface IInnerScenePage {
  simulatorId: string
}

const InnerScenePage: React.FC<IInnerScenePage> = ({simulatorId}) => {
  const [codeEditorVisible, setCodeEditorVisible] = React.useState(false)
  const [codeEditorPaneWidth, setCodeEditorPaneWidth] = React.useState(CODE_EDITOR_DEFAULT_SIZE)
  const {listFiles} = useActions(coreGitActions)

  const app = useCurrentApp()
  const appPaths = useAppPathsContext()
  const {t} = useTranslation(['app-pages', 'cloud-editor-pages', 'cloud-studio-pages'])
  const repo = useCurrentGit(g => g.repo)

  const {loadSimulatorState, loadLastHmdLinkState} = useActions(editorActions)
  const ctx = useSceneContext()

  const inlinePreviewVisible = useSimulatorVisible(app)
  const isDesktop = Build8.PLATFORM_TARGET === 'desktop'

  const getMaxSplitPaneSize = () => (
    (inlinePreviewVisible && codeEditorVisible)
      ? window.innerWidth * 0.4
      : window.innerWidth * 0.8
  )

  const handleCodeEditorResize = (size: number) => {
    if (size < CODE_EDITOR_COLLAPSED_SIZE) {
      setCodeEditorVisible(false)
      setCodeEditorPaneWidth(CODE_EDITOR_DEFAULT_SIZE)
    } else {
      setCodeEditorPaneWidth(size)
    }
  }

  const handleCodeEditorPopout = () => {
    const windowHeight = window.innerHeight
    const defaultWidth = 800
    openInWindow(
      appPaths.getPathForApp(AppPathEnum.codeEditor),
      {width: defaultWidth, height: windowHeight}
    )
    setCodeEditorVisible(false)
  }

  React.useEffect(() => {
    loadSimulatorState(app.appKey)
  }, [app.appKey])

  React.useEffect(() => {
    loadLastHmdLinkState()
  }, [])

  const settings = useUserEditorSettings()
  const stateCtx = useStudioStateContext()
  const {state: gsbState, setState: setGsbState} = useGsbStateContext()
  const textEditorContext = useTextEditorContext()

  const handleBeforeFileSelect = (
    nextLocation: EditorFileLocation,
    renamePrevLocation?: EditorFileLocation
  ) => {
    if ((isDesktop || isAssetPath(extractFilePath(nextLocation))) &&
      (!renamePrevLocation ||
        editorFileLocationEqual(renamePrevLocation, stateCtx.state.selectedAsset))) {
      stateCtx.update(p => ({
        ...p,
        selectedIds: [],
        selectedAsset: nextLocation,
        selectedImageTarget: undefined,
        currentPanelSection: PanelSelection.INSPECTOR,
      }))
      return true
    }

    return false
  }

  const handleFileRename: FileRenameHandler = async (oldLocation, newLocation) => {
    if (extractRepoId(oldLocation) || extractRepoId(newLocation)) {
      // NOTE(christoph): We only care about the primary repo's assets.
      return
    }

    const oldPath = extractFilePath(oldLocation)
    const newPath = extractFilePath(newLocation)
    if (!isAssetPath(oldPath) || !isAssetPath(newPath)) {
      return
    }

    const renames: Map<string, string> = new Map()
    renames.set(oldPath, newPath)

    const newFilePaths = await listFiles(repo)

    const oldPrefix = `${oldPath}/`
    const newPrefix = `${newPath}/`
    newFilePaths
      .filter(f => f.startsWith(newPrefix))
      .forEach((newFilePath) => {
        const oldFilePath = newFilePath.replace(newPrefix, oldPrefix)
        renames.set(oldFilePath, newFilePath)
      })

    ctx.updateScene((oldScene) => {
      let newScene = oldScene

      Array.from(renames.entries())
        .forEach(([oldFilePath, newFilePath]) => {
          newScene = replaceAssetInScene(newScene, oldFilePath, newFilePath)
        })

      return newScene
    })
  }

  const {
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
  } = useStudioFileActionState(AppPathEnum.studio, false, handleBeforeFileSelect, handleFileRename)

  React.useEffect(() => {
    if (tabState.tabs.length === 1 && !tabState.tabs[0].filePath) {
      setCodeEditorVisible(false)
    }
  }, [tabState.tabs])

  React.useEffect(() => {
    if (fileUrlParam || moduleUrlParam) {
      setCodeEditorVisible(true)
    }
  }, [fileUrlParam, moduleUrlParam])

  const sceneFileEditContent = (
    <>
      <LogContainerSplit extraTabContent={<DebugSessionsMenu />}>
        <SceneFileEdit
          simulatorId={simulatorId}
          errorMessage={<StudioErrorMessage />}
          navigationMenu={<FloatingNavigation />}
          buildControlTray={<BuildControlTray app={app} />}
          codeEditorToggle={!isDesktop && (
            <FloatingTray>
              <FloatingIconButton
                a8={`click;studio;${codeEditorVisible ? 'hide' : 'show'}-code-editor-button`}
                stroke={codeEditorVisible ? 'sideDrawerOpen' : 'sideDrawerClose'}
                onClick={() => setCodeEditorVisible(!codeEditorVisible)}
                text={codeEditorVisible
                  ? t('scene_page.button.hide_code_editor', {ns: 'cloud-studio-pages'})
                  : t('scene_page.button.show_code_editor', {ns: 'cloud-studio-pages'})
                }
              />
            </FloatingTray>
          )}
          mapToggle={(
            <FloatingTray>
              <FloatingIconButton
                stroke='mapOutline'
                onClick={() => {
                  setGsbState({open: !gsbState.open})
                }}
                isActive={gsbState.open}
                text={gsbState.open
                  ? t('scene_page.button.hide_gsb_map', {ns: 'cloud-studio-pages'})
                  : t('scene_page.button.show_gsb_map', {ns: 'cloud-studio-pages'})
                }
              />
            </FloatingTray>
          )}
          fileBrowser={fileBrowser}
          sourceControlConfigurator={<SourceControlConfigurator />}
          codeEditorSettings={<CodeEditorSettings />}
          fixedHelpButtonTray={<FixedHelpButtonTray />}
        />
      </LogContainerSplit>
      {fileActionModals}
      {moduleActionModals}
    </>
  )

  const sceneFileWithCodeEditor = Build8.PLATFORM_TARGET === 'desktop'
    ? sceneFileEditContent
    : (
      <SplitPane
        split='vertical'
        size={codeEditorVisible ? codeEditorPaneWidth : 0}
        maxSize={getMaxSplitPaneSize()}
        onChange={handleCodeEditorResize}
        primary='second'
        allowResize={codeEditorVisible}
        resizerStyle={codeEditorVisible ? {} : {display: 'none'}}
      >
        {sceneFileEditContent}
        {codeEditorVisible
          ? <CodeEditor
              editorSession={editorSession}
              focusedEditor={focusedEditor}
              disableSplit={codeEditorPaneWidth < MIN_SPLIT_PANE_WIDTH}
              onPopout={handleCodeEditorPopout}
          />
          : <div />}
      </SplitPane>
    )

  return (
    <div className={combine('studio-editor', settings.darkMode ? 'dark' : 'light')}>
      <EditorThemeProvider>
        {stateCtx.state.sceneDiffOpen && <CurrentSceneDiffModal />}
        <Title>{`${getDisplayNameForApp(app)} - ${t('studio_page.page_title')}`}</Title>
        <ErrorMessage />
        <G8ErrorMessage appUuid={app.uuid} />
        <ProjectSwitchActiveBrowserModal />
        {textEditorContext.editorToUse === 'Monaco' &&
          <ErrorBoundary fallback={null}>
            <React.Suspense fallback={null}>
              <StudioMonacoSetup />
            </React.Suspense>
          </ErrorBoundary>
        }
        <FileActionsContext.Provider value={actionsContext}>
          <ModuleActionsContext.Provider value={moduleActionsContext}>
            {sceneFileWithCodeEditor}
          </ModuleActionsContext.Provider>
        </FileActionsContext.Provider>
        <WhatsNewTrigger />
      </EditorThemeProvider>
    </div>
  )
}

const ScenePage = () => {
  const app = useCurrentApp()
  const gitProgress = useCurrentGit(g => g.progress.load)

  const {bootstrapAppRepo} = useActions(gitActions)

  const {loadFileBrowserHeightPercent} = useActions(editorActions)

  React.useEffect(() => {
    if (gitProgress === 'HAS_REPO_NEEDS_CLONE') {
      bootstrapAppRepo(app.uuid, {ensureLocalClone: true})
    }
  }, [gitProgress, app.uuid, bootstrapAppRepo])

  React.useEffect(() => {
    loadFileBrowserHeightPercent(app.appKey)
  }, [app.appKey])

  const simulatorId = useUuid()

  if (gitProgress === 'DONE') {
    // NOTE(dat): Context changes make to this component should ALSO be made to scene-local-edit.tsx
    // which powers our playground view.

    let inner = (
      <SceneDebugContext simulatorId={simulatorId}>
        <InnerScenePage simulatorId={simulatorId} />
      </SceneDebugContext>
    )

    if (Build8.PLATFORM_TARGET === 'desktop') {
      inner = <LocalSyncContextProvider key={app.appKey}>{inner}</LocalSyncContextProvider>
    }

    return (
      <SceneStateContext>
        <GsbStateContextProvider>
          <AssetLabStateContextProvider>
            <StudioAgentStateContextProvider>
              <PublishingStateContextProvider>
                {inner}
              </PublishingStateContextProvider>
            </StudioAgentStateContextProvider>
          </AssetLabStateContextProvider>
        </GsbStateContextProvider>
      </SceneStateContext>
    )
  }

  if (gitProgress === 'NEEDS_INIT' || !app.repoId) {
    return (
      <EditorThemeProvider>
        <NewProjectModal app={app} />
      </EditorThemeProvider>
    )
  }

  return (
    <>
      <ErrorMessage />
      <G8ErrorMessage appUuid={app.uuid} />
      <GitProgressIndicator status={gitProgress || 'UNSPECIFIED'} />
    </>
  )
}

export default ScenePage
