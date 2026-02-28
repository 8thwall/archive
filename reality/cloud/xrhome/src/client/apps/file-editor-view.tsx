import * as React from 'react'
import SplitPane from 'react-split-pane'

import {createUseStyles} from 'react-jss'

import type {BoundingRect} from 'react-measure'

import RepoControllerView from '../editor/repo-controller-view'
import GitProgressIndicator from '../editor/git-progress-indicator'
import editorActions from '../editor/editor-actions'
import '../static/styles/code-editor.scss'
import ErrorMessage from '../home/error-message'
import {G8ErrorMessage} from '../git/g8-error-message'
import Title from '../widgets/title'
import {Loader} from '../ui/components/loader'
import {getDisplayNameForApp} from '../../shared/app-utils'
import useActions from '../common/use-actions'
import {useCurrentGit} from '../git/hooks/use-current-git'
import useCurrentApp from '../common/use-current-app'
import {useTheme} from '../user/use-theme'
import {EditorThemeProvider} from '../editor/editor-theme-provider'
import {DependencyActiveBrowserModal} from '../editor/modals/dependency-active-browser-modal'
import useCurrentAccount from '../common/use-current-account'
import {OnboardingId} from '../editor/product-tour/product-tour-constants'
import {InlineAppPreviewPane} from '../editor/app-preview/inline-app-preview-pane'
import {useSimulatorVisible} from '../editor/app-preview/use-simulator-state'
import {APP_PREVIEW_PANE_MIN_SIZE} from '../editor/app-preview/app-preview-utils'
import {useSimulatorDimension} from '../editor/app-preview/use-simulator-dimension'
import {LogContainerSplit} from './log-container-split'
import {useUuid} from '../hooks/use-uuid'
import {PublishingStateContextProvider} from '../editor/publishing/publish-context'

const getMaxInlineAppPreviewSize = () => window.innerWidth * 0.8

const LazyBrowsableMultitabEditorView = React.lazy(() => (
  import('../editor/browsable-multitab-editor-view')
))

const useStyles = createUseStyles({
  editorContent: {
    display: 'flex',
    flex: '1 0 0',
    position: 'relative !important',
  },
})

const FileEditorView: React.FC = () => {
  const classes = useStyles()
  const [inlinePreviewSplitSize, setInlinePreviewSplitSize] = React.useState(400)
  const [inlinePreviewBounds, setInlinePreviewBounds] = React.useState<BoundingRect>(null)
  const [isDraggingIframe, setIsDraggingIframe] = React.useState(false)

  const app = useCurrentApp()
  const account = useCurrentAccount()
  const gitProgress = useCurrentGit(git => git.progress.load)
  const themeName = useTheme()
  const simulatorId = useUuid()

  const {
    loadLeftPaneSplitSize, loadModulePaneSplitSize, loadSimulatorState,
  } = useActions(editorActions)

  const inlinePreviewVisible = useSimulatorVisible(app)
  const {iframeWidth, iframeHeight} = useSimulatorDimension()

  const handleResizerDoubleCLick = () => {
    const resizeWidth = inlinePreviewVisible && inlinePreviewBounds
      ? Math.min(
        Math.floor(inlinePreviewBounds.height * (iframeWidth / iframeHeight)),
        Math.floor(window.innerWidth / 2)
      )
      : 400
    setInlinePreviewSplitSize(resizeWidth)
  }

  React.useEffect(() => {
    loadLeftPaneSplitSize()
    loadSimulatorState(app.appKey)
    loadModulePaneSplitSize(app.repoId)
  }, [app.appKey, app.repoId])

  const isLoaded = gitProgress === 'DONE'

  const mainContent = (
    <LogContainerSplit>
      <div className='main-view vertical'>
        {isLoaded
          ? (
            <React.Suspense fallback={<Loader />}>
              <LazyBrowsableMultitabEditorView app={app} account={account} />
            </React.Suspense>
          )
          : <GitProgressIndicator status={gitProgress || 'UNSPECIFIED'} />
        }
      </div>
    </LogContainerSplit>
  )

  return (
    <PublishingStateContextProvider>
      <EditorThemeProvider>
        <DependencyActiveBrowserModal />
        <div className={`studio-editor ${themeName}`} id={OnboardingId.WELCOME}>
          <Title>{`${getDisplayNameForApp(app)} - Editor`}</Title>
          <ErrorMessage />
          <G8ErrorMessage appUuid={app.uuid} />
          <RepoControllerView app={app} />
          {inlinePreviewVisible
            ? (
              <SplitPane
                split='vertical'
                className={classes.editorContent}
                primary='second'
                minSize={APP_PREVIEW_PANE_MIN_SIZE}
                size={inlinePreviewSplitSize}
                maxSize={getMaxInlineAppPreviewSize()}
                onChange={(size: number) => setInlinePreviewSplitSize(size)}
                onDragStarted={() => setIsDraggingIframe(true)}
                onDragFinished={() => setIsDraggingIframe(false)}
                onResizerDoubleClick={handleResizerDoubleCLick}
              >
                {mainContent}
                <InlineAppPreviewPane
                  app={app}
                  simulatorId={simulatorId}
                  isDragging={isDraggingIframe}
                  onBoundsChange={setInlinePreviewBounds}
                />
              </SplitPane>
            )
            : (
              <div className={classes.editorContent}>
                {mainContent}
              </div>
            )
        }
        </div>
      </EditorThemeProvider>
    </PublishingStateContextProvider>
  )
}

export default FileEditorView
