import React from 'react'

import {useSimulatorVisible, useSimulator} from '../editor/app-preview/use-simulator-state'
import useCurrentApp from '../common/use-current-app'
import {InlineAppPreviewPane} from '../editor/app-preview/inline-app-preview-pane'
import {
  MIN_PREVIEW_HEIGHT, MIN_PREVIEW_WIDTH, DEFAULT_PREVIEW_WIDTH,
} from '../editor/app-preview/app-preview-utils'
import {combine} from '../common/styles'
import {useSceneContext} from './scene-context'
import {useStudioStateContext} from './studio-state-context'
import useActions from '../common/use-actions'
import editorActions from '../editor/editor-actions'
import {ResizablePanel} from '../ui/components/resizable-panel'
import {useSceneLocations} from './hooks/use-scene-locations'
import {useGsbStateContext} from './gsb/gsb-state-context'
import {
  IMAGE_TARGET_SIMULATOR_PANEL_GALLERY_ID as SIMULATOR_PANEL_GALLERY_ID,
} from '../apps/image-targets/image-target-constants'
import {getImageTargetRotation} from './hooks/use-app-image-targets'
import {MARGIN_SIZE} from './interface-constants'
import {createThemedStyles} from '../ui/theme'
import {SimulatorViewActions, SimulatorViewControls} from './simulator-view-controls'
import {useDerivedScene} from './derived-scene-context'
import {useDebounced} from './use-debounced'

const LOADING_SCREEN_DISAPPEAR_DELAY = 200

const MAX_HEIGHT = `100% - ${MARGIN_SIZE} - ${MARGIN_SIZE}`
const MAX_WIDTH = `max(40%, ${MIN_PREVIEW_WIDTH}px)`

const useStyles = createThemedStyles(theme => ({
  debugSimulatorContainer: {
    'position': 'relative',
    'margin': `0 ${MARGIN_SIZE}`,
    'height': '100%',
    'pointerEvents': 'none',
  },
  panel: {
    'position': 'absolute',
    'top': 0,
    'bottom': 0,
    'overflow': 'auto',
    // NOTE(Julie): This is to prevent the simulator from overlapping the right panel.
    'right': 0,
    'marginTop': MARGIN_SIZE,
    'borderRadius': '0.5em',
    'zIndex': 1000,
    '--simulator-preview-actions-height': '32px',
  },
  fullscreenSimulatorPanel: {
    'position': 'relative',
    'borderLeft': theme.studioBgBorder,
    'borderRight': theme.studioBgBorder,
    'minWidth': 0,
    'zIndex': 1500,
    '--simulator-preview-actions-height': '40px',
  },
  hidden: {
    // NOTE(Julie): Most browsers will pause calls to requestAnimationFrame if the window/iframe is
    // considered hidden. Setting the opacity low will appear transparent to the user while still
    // being considered "visible" by the browser.
    opacity: 0.0001,
    pointerEvents: 'none',
  },
  interactive: {
    pointerEvents: 'auto',
  },
}))

interface IDebugSimulatorPanel {
  simulatorId: string
}

const DebugSimulatorPanel: React.FC<IDebugSimulatorPanel> = ({simulatorId}) => {
  const classes = useStyles()
  const app = useCurrentApp()
  const simulatorVisible = useSimulatorVisible(app)
  const stateCtx = useStudioStateContext()
  const derivedScene = useDerivedScene()
  const {simulatorCollapsed, simulatorMode} = stateCtx.state
  const {ensureSimulatorStateReady} = useActions(editorActions)
  const {simulatorState, updateSimulatorState} = useSimulator()
  const {panelHeight, panelWidth} = simulatorState

  const ctx = useSceneContext()
  const allCameras = derivedScene.getAllCameras()

  const anyWorld = allCameras
    .some(obj => obj.camera.xr?.xrCameraType && obj.camera.xr?.xrCameraType !== '3dOnly')
  const anyVps = allCameras.some(obj => obj.camera.xr?.world?.enableVps)

  const locations = useSceneLocations()

  const mapPoints = Object.values(ctx.scene.objects).filter(obj => obj.mapPoint)

  const {state: {resizing: mapResizing}} = useGsbStateContext()
  const [resizing, setResizing] = React.useState(false)

  React.useEffect(() => {
    ensureSimulatorStateReady(app.appKey)
  }, [app.appKey])

  const imageTargetQuaternion = React.useMemo(
    () => getImageTargetRotation(derivedScene, simulatorState.imageTargetName),
    [derivedScene, simulatorState.imageTargetName]
  )

  // NOTE(christoph): The 'attached-confirmed' state is entered after ECS_ATTACH_CONFIRM is
  // received, which is only sent by a newer version dev8. As a fallback, either in the case of a
  // crash, or an old version of dev8, we hide the loading screen after a delay.
  // If we're attached-confirmed, we don't show the loading screen.
  const oldDebugStatus = useDebounced(ctx.debugStatus, LOADING_SCREEN_DISAPPEAR_DELAY)
  const debugReady = (
    ctx.debugStatus === 'attach-confirmed' ||
    // Attach has been sent for a while, so hide the loading screen.
    (ctx.debugStatus === 'attach-sent' && oldDebugStatus === 'attach-sent')
  )

  if (!simulatorVisible) {
    return null
  }

  let resizeProps: Partial<React.ComponentProps<typeof ResizablePanel>>

  const visibilityClass = simulatorCollapsed ? classes.hidden : classes.interactive

  if (simulatorMode === 'full') {
    // NOTE(christoph): Typically we'd just use a different wrapper here, but to preserve the iframe
    // (to avoid restarting the simulator session) we need to preserve the same react hierarchy
    // but with pretty much all the props removed from the resizer.
    resizeProps = {
      className: combine(classes.fullscreenSimulatorPanel, visibilityClass),
      defaultHeight: 100000,
      defaultWidth: 100000,
    }
  } else {
    resizeProps = {
      className: combine(classes.panel, visibilityClass),
      left: true,
      bottom: true,
      bottomLeft: true,
      onResizeStart: () => { setResizing(true) },
      onResizeEnd: (width, height) => {
        setResizing(false)
        updateSimulatorState({panelWidth: width, panelHeight: height})
      },
      minHeight: MIN_PREVIEW_HEIGHT,
      minWidth: MIN_PREVIEW_WIDTH,
      maxHeight: MAX_HEIGHT,
      maxWidth: MAX_WIDTH,
      defaultHeight: MAX_HEIGHT,
      defaultWidth: DEFAULT_PREVIEW_WIDTH,
      panelHeight,
      panelWidth,
    }
  }

  return (
    <div
      className={classes.debugSimulatorContainer}
    >
      {simulatorCollapsed && <SimulatorViewControls />}
      <ResizablePanel
        {...resizeProps}
      >
        <InlineAppPreviewPane
          app={app}
          simulatorId={simulatorId}
          sessionId={simulatorId.replace(/-/g, '')}
          isDragging={ctx.isDraggingGizmo || mapResizing || resizing}
          hidePreviewBottom={!anyWorld}
          locations={locations}
          targetsGalleryUuid={SIMULATOR_PANEL_GALLERY_ID}
          mapPoints={mapPoints}
          vpsEnabled={anyVps}
          imageTargetQuaternion={imageTargetQuaternion}
          renderActions={() => <SimulatorViewActions />}
          liveSyncMode='inline'
          showLoadingOverlay={!debugReady}
        />
      </ResizablePanel>
    </div>
  )
}

export {
  DebugSimulatorPanel,
}
