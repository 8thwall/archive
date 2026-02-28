import React from 'react'
import Measure, {BoundingRect, ContentRect} from 'react-measure'
import {useTranslation} from 'react-i18next'
import * as THREE from 'three'
import type {GraphObject} from '@ecs/shared/scene-graph'
import type {DeepReadonly} from 'ts-essentials'

import type {IApp} from '../../common/types/models'
import {combine} from '../../common/styles'
import {IconButton} from '../../ui/components/icon-button'
import editorActions from '../editor-actions'
import useActions from '../../common/use-actions'
import {createThemedStyles} from '../../ui/theme'
import {AppPreviewBottomBar} from './app-preview-bottom-bar'
import {
  APP_PREVIEW_METADATA_SRC,
  MIN_PREVIEW_WIDTH,
  MIN_PREVIEW_HEIGHT,
  getCurrentRecording,
  SectionData,
  SequenceMetadata,
  SimulatorConfig,
  SimulatorRendererConfig,
  useAppPreviewStyles,
} from './app-preview-utils'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import {useAppPathsContext} from '../../common/app-container-context'
import {AppPathEnum} from '../../common/paths'
import {useChangeEffect} from '../../hooks/use-change-effect'
import {getPathWithSession, openSimulatorWindow} from './open-window'
import {InitializingScreen, useIsInitializingBuild} from './initializing-screen'
import {Loader} from '../../ui/components/loader'
import {useSimulator} from './use-simulator-state'
import {resolveSequenceSelection} from './sequence-selection'
import {useWindowMessageHandler} from '../../hooks/use-window-message-handler'
import {MILLISECONDS_PER_SECOND} from '../../../shared/time-utils'
import {LiveSyncMode, useSimulatorConfigUrl} from './encode-simulator-config'
import {useSimulatorDimension} from './use-simulator-dimension'
import {Popup} from '../../ui/components/popup'
import {generateIframePermissions} from './iframe-permissions'
import {useStudioDebug} from './use-studio-debug-state'
import {useAppPreviewWindow} from '../../common/app-preview-window-context'
import {
  useStandalonePostMessageBridge,
} from './use-standalone-post-message-bridge'
import {Keys} from '../../studio/common/keys'
import type {EntityLocation} from '../../studio/hooks/use-scene-locations'
import {useSelector} from '../../hooks'
import {
  useAlignedSpace, useSplatByPoi, useSrcToDstNodeTransform, useVpsMeshes,
} from '../../apps/vps/vps-helpers'
import {MESH_TYPE_PRIORITY} from '../../vps/vps-constants'
import {AppPreviewVpsUnavailableModal} from './app-preview-vps-unavailable-modal'
import {AppPreviewMockLocation} from './app-preview-mock-location'
import {AppPreviewAspectRatio} from './app-preview-aspect-ratio'

const useStyles = createThemedStyles(theme => ({
  appPreviewPane: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '100%',
    maxWidth: '100%',
    fontSize: '12px',
  },
  iframeContainer: {
    flex: '1 0 0',
    position: 'relative',
    background: theme.tabPaneBg,
  },
  dimmed: {
    opacity: 0.5,
    transitionDelay: '300ms',
  },
  previewActionButtons: {
    display: 'flex',
    marginLeft: 'auto',
  },
  iframe: {
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: 'center center',
    background: 'white',
    // Note(Dale): The iframe background is white and is visible on the edges of the iframe, so
    // adding a outline and clip path to hides it.
    outline: `10px solid ${theme.tabPaneBg}`,
    clipPath: 'inset(-1px)',
  },
  notInteractive: {
    pointerEvents: 'none',
    userSelect: 'none',
  },
  hidden: {
    // NOTE(Julie): Most browsers will pause calls to requestAnimationFrame if the window/iframe is
    // considered hidden. Setting the opacity low will appear transparent to the user while still
    // being considered "visible" by the browser.
    opacity: 0.0001,
    pointerEvents: 'none',
  },
  collapsed: {
    borderRadius: '0.5em',
  },
}))

type ContainerSize = {
  width: number
  height: number
}

interface IInlineAppPreviewPane {
  app: IApp
  simulatorId: string
  isDragging?: boolean
  isStandalone?: boolean
  sessionId?: string
  onBoundsChange?: (bounds: BoundingRect) => void
  collapsed?: boolean
  setCollapsed?: () => void
  hidePreviewBottom?: boolean
  targetsGalleryUuid?: string
  locations?: EntityLocation[]
  mapPoints?: DeepReadonly<GraphObject>[]
  showVpsUnavailable?: boolean
  vpsEnabled?: boolean
  imageTargetQuaternion?: DeepReadonly<GraphObject['rotation']> | undefined
  renderActions?: () => React.ReactNode
  liveSyncMode?: LiveSyncMode
  showLoadingOverlay?: boolean
}

const HARD_RELOAD_TIMEOUT = MILLISECONDS_PER_SECOND
const CONFIG_UPDATE_RETRY_TIMEOUT = 3 * MILLISECONDS_PER_SECOND

const BRIDGED_PARENT_ACTIONS = [
  'ECS_STATE_UPDATE',
  'ECS_DEBUG_EDIT',
  'ECS_BASE_EDIT',
  'ECS_DOC_REFRESH',
  'ECS_ATTACH',
  'ECS_DETACH',
]
const BRIDGED_CHILD_ACTIONS = [
  'ECS_WORLD_UPDATE',
  'ECS_TRANSFORM_UPDATE',
  'ECS_READY',
]

const InlineAppPreviewPane: React.FC<IInlineAppPreviewPane> = ({
  app, simulatorId, isDragging, isStandalone, sessionId, onBoundsChange, collapsed, setCollapsed,
  hidePreviewBottom, targetsGalleryUuid, locations, mapPoints, showVpsUnavailable = false,
  vpsEnabled = false, imageTargetQuaternion, renderActions, liveSyncMode, showLoadingOverlay,
}) => {
  const classes = useStyles()
  const appPreviewStyles = useAppPreviewStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  const {fetchSequenceMetadata} = useActions(editorActions)

  const [loadingSequence, setLoadingSequence] = React.useState<boolean>(false)
  const [sequenceMetadata, setSequenceMetadata] = React.useState<SequenceMetadata>(null)

  const isInitializingBuild = useIsInitializingBuild()

  const appPaths = useAppPathsContext()

  const {simulatorState, updateSimulatorState} = useSimulator()
  const {setInlinePreviewWindow, setFramedPreviewWindow} = useAppPreviewWindow()
  const {
    isLiveView, isPaused, start, end, isLandscape, responsive, poiId, manualVpsEvents,
    imageTargetName, imageTargetType, imageTargetMetadata, imageTargetOriginalUrl,
    mockLat, mockLng, mockCoordinateValue, responsiveWidth, responsiveHeight,
  } = simulatorState

  const {closeDebugSimulatorSession} = useStudioDebug()

  const showVpsUnavailableWarning = showVpsUnavailable && poiId

  const wantsLandscapeRecording = responsive ? responsiveWidth > responsiveHeight : isLandscape

  const sequenceSelection = resolveSequenceSelection(
    sequenceMetadata,
    simulatorState,
    app.defaultSimulatorSequence
  )

  // TODO(Dale): Clean up double fetch with app-preview-bottom-bar.tsx
  useAbandonableEffect(async (abandonable) => {
    setSequenceMetadata(await abandonable(fetchSequenceMetadata(APP_PREVIEW_METADATA_SRC)))
  }, [])

  useWindowMessageHandler((event) => {
    if (event.data.action === 'SIMULATOR_SEQUENCE_LOADING') {
      setLoadingSequence(event.data.data.status)
    }
  })

  const selectedEntityLocation = poiId && locations?.find(({poi}) => poi?.id === poiId)
  const selectedLocation = selectedEntityLocation?.poi
  const locationShortName = selectedEntityLocation?.shortName

  // Get merged POI mesh data
  const defaultNodeId =
    useSelector(s => s.vps.poiToDefaultAnchor[selectedLocation?.id]?.defaultNode)
  const nodes = useSelector(s => s.vps.nodes)
  const defaultSpaceId = nodes[defaultNodeId]?.spaceIdentifier
  const defaultSpaceNodeIds = useSelector(s => s.vps.spaceToNodes[defaultSpaceId])
  const vpsMeshes = useVpsMeshes(defaultSpaceNodeIds || [defaultNodeId], MESH_TYPE_PRIORITY)
  const meshOffset = useSrcToDstNodeTransform(defaultNodeId, selectedEntityLocation?.anchorNodeId)
  const {loadedMesh} = useAlignedSpace(vpsMeshes, defaultNodeId, false, undefined, meshOffset)

  // In manual mode, clone the largest node mesh as the detected mesh for a realistic experience
  const detectedMesh: THREE.BufferGeometry | THREE.Group | undefined = React.useMemo(() => {
    if (!loadedMesh || !loadedMesh?.children?.length) {
      // If no mesh is loaded, add an empty mesh to avoid errors in the simulator
      return undefined
    }

    const largestGeometry: THREE.BufferGeometry = loadedMesh.children
      .filter((child: THREE.Object3D): child is THREE.Mesh => child instanceof THREE.Mesh)
      .reduce((largest: THREE.Mesh, child: THREE.Mesh) => {
        const largestSize = largest.geometry.getAttribute('position').array.length
        const childSize = child.geometry.getAttribute('position').array.length
        return largestSize > childSize ? largest : child
      }).geometry

    // Detected Mesh needs a coordinate conversion to match the mesh returned by the engine
    return largestGeometry.clone().rotateY(Math.PI).rotateZ(Math.PI)
  }, [loadedMesh])

  // TODO(Riyaan): Convert to session ID which is a random ID which is stable for this session.
  const detectedMeshSessionId = defaultNodeId

  // TODO(yuhsianghuang): Fall back to mesh/sequence when failed to get splat?
  const [splatOffset] = React.useState<THREE.Matrix4>(new THREE.Matrix4().identity())
  const poiSplat = useSplatByPoi(
    selectedLocation?.id, selectedEntityLocation?.anchorNodeId, splatOffset
  )

  const [simulatorConfigVersion, setSimulatorConfigVersion] = React.useState(0)

  const simulatorConfig: SimulatorConfig = React.useMemo(() => {
    const version = simulatorConfigVersion + 1
    setSimulatorConfigVersion(version)

    // TODO(Julie): Handle loop endpoint changes
    if (isLiveView || hidePreviewBottom) {
      return {version, simulatorId, mockLat, mockLng, mockCoordinateValue}
    }

    if (!sequenceSelection?.variation) {
      return null
    }
    const currentRecording = getCurrentRecording(
      sequenceSelection.variation, wantsLandscapeRecording
    )

    return {
      version,
      simulatorId,
      cameraUrl: !selectedLocation ? currentRecording.cameraUrl : null,
      sequenceUrl: !selectedLocation ? currentRecording.sequenceUrl : null,
      isPaused,
      userAgent: sequenceMetadata?.defaultUserAgent,
      start,
      end,
      imageTargetName,
      imageTargetType,
      imageTargetOriginalUrl,
      imageTargetMetadata,
      imageTargetQuaternion,
      poiId: selectedLocation?.id ?? null,
      gpsLatitude: selectedLocation?.lat ?? null,
      gpsLongitude: selectedLocation?.lng ?? null,
      locationName: locationShortName,
      manualVpsEvents: selectedLocation?.id ? manualVpsEvents : null,
      mockLat,
      mockLng,
      mockCoordinateValue,
    }
  }, [
    sequenceMetadata?.defaultUserAgent, isPaused, isLiveView, start, end,
    isLandscape, sequenceSelection?.variation, simulatorId, wantsLandscapeRecording,
    hidePreviewBottom, selectedLocation?.id, manualVpsEvents, imageTargetName,
    imageTargetQuaternion, mockLat, mockLng, mockCoordinateValue,
  ])

  const simulatorRendererConfig: SimulatorRendererConfig = React.useMemo(() => {
    const version = simulatorConfigVersion + 1
    setSimulatorConfigVersion(version)

    return {
      version,
      loadedMesh: selectedLocation ? loadedMesh?.toJSON() : null,
      detectedMesh: selectedLocation ? detectedMesh?.toJSON() : null,
      detectedMeshSessionId: selectedLocation ? detectedMeshSessionId : null,
      splatUrl: selectedLocation ? poiSplat?.splatUrl : null,
      splatOffset: splatOffset?.toArray(),
      visualization: selectedEntityLocation?.visualization ?? 'mesh',
    }
  }, [selectedLocation?.id, loadedMesh, poiSplat, splatOffset, detectedMesh, detectedMeshSessionId,
    selectedEntityLocation?.visualization,
  ])

  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [lockedInUrl, setLockedInUrl] = React.useState<string>('')

  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  useStandalonePostMessageBridge({
    isActive: isStandalone,
    iframeEl: iframeRef.current,
    childActions: BRIDGED_CHILD_ACTIONS,
    parentActions: BRIDGED_PARENT_ACTIONS,
  })

  const {iframeHeight, iframeWidth} = useSimulatorDimension()

  const {
    rawDevUrl,
    currentConfigUrl,
  } = useSimulatorConfigUrl(app, simulatorConfig, !!lockedInUrl, sessionId, liveSyncMode)

  const broadcastSimulatorMessage = (
    action: string,
    data?: {
      simulatorConfig?: SimulatorConfig
      simulatorRendererConfig?: SimulatorRendererConfig
      progress?: number
      manualVpsEvents?: boolean
    }
  ) => {
    iframeRef.current?.contentWindow.postMessage({
      action,
      data,
    }, '*')
  }

  const hardReloadTimeout = React.useRef(null)
  const reloadSimulator = () => {
    broadcastSimulatorMessage('SIMULATOR_RELOAD', {simulatorConfig})

    hardReloadTimeout.current = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.src = currentConfigUrl
      }
    }, HARD_RELOAD_TIMEOUT)
  }

  const configUpdateRetryTimeout = React.useRef(null)
  const updateSimulatorConfigs = () => {
    broadcastSimulatorMessage('SIMULATOR_CONFIG_UPDATE', {
      simulatorConfig, simulatorRendererConfig,
    })

    // TODO(yuhsianghuang): Extend timeout exponentially?
    clearTimeout(configUpdateRetryTimeout.current)
    configUpdateRetryTimeout.current = setTimeout(() => {
      updateSimulatorConfigs()
    }, CONFIG_UPDATE_RETRY_TIMEOUT)
  }

  useWindowMessageHandler((event) => {
    if (event.data.action === 'SIMULATOR_INITIALIZE_ACKNOWLEDGE') {
      // Send out configs to simulator as it's initialized and ready for updates.
      updateSimulatorConfigs()
    } else if (event.data.action === 'SIMULATOR_RELOAD_ACKNOWLEDGE') {
      clearTimeout(hardReloadTimeout.current)
    } else if (event.data.action === 'SIMULATOR_CONFIG_UPDATE_ACKNOWLEDGE') {
      clearTimeout(configUpdateRetryTimeout.current)
    }
  })

  const handleRefresh = (e: React.MouseEvent) => {
    setIsRefreshing(true)
    if (e.shiftKey) {
      if (iframeRef.current && currentConfigUrl) {
        iframeRef.current.src = currentConfigUrl
      }
    } else {
      reloadSimulator()
    }
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const getScale = (contentRect: ContentRect) => (
    (contentRect.bounds && !responsive)
      ? Math.min(
        contentRect.bounds.height / iframeHeight,
        contentRect.bounds.width / iframeWidth
      )
      : 1
  )

  const getStyles = (contentRect: ContentRect) => ({
    transform: `translate(-50%, -50%) scale(${getScale(contentRect)})`,
    width: responsive && '100%',
    height: responsive && '100%',
  })

  const handlePopOut = (boundingSize: ContainerSize) => {
    const simulatorPath = appPaths.getPathForApp(AppPathEnum.simulator)
    const childWindow = openSimulatorWindow(getPathWithSession(simulatorPath), boundingSize)
    updateSimulatorState({inlinePreviewVisible: false, inlinePreviewDebugActive: false})
    closeDebugSimulatorSession(simulatorId)
    setFramedPreviewWindow(childWindow)
  }

  React.useEffect(() => {
    setLockedInUrl(c => c || currentConfigUrl)
  }, [currentConfigUrl])

  React.useLayoutEffect(() => {
    if (iframeRef.current) {
      setInlinePreviewWindow(iframeRef.current.contentWindow)
    }
  }, [iframeRef.current])

  useChangeEffect(([previousRawDevUrl, previousConfig, prevManualVpsEvents]) => {
    if (!currentConfigUrl) {
      // Not ready to do anything
      return
    }
    if (previousRawDevUrl !== rawDevUrl) {
      // Something changed on the raw dev URL, such as changing clients.
      setLockedInUrl(currentConfigUrl)
      return
    }

    // Update the simulator with updated configs if neither of the following is true; otherwise,
    // reload the simulator:
    // 1. Whether the type of the simulator has changed.
    //   - If config.cameraUrl has value -> using simulatorsequence
    //   - Otherwise -> using simulatorrenderer
    const simulatorTypeChanged = !!simulatorConfig.cameraUrl !== !!previousConfig?.cameraUrl
    // 2. Whether the selected location has changed.
    const selectedLocationChanged = simulatorConfig.poiId !== previousConfig?.poiId
    // 3. Whether the manual VPS mode has been toggled.
    const manualVpsToggled = manualVpsEvents !== prevManualVpsEvents
    // 4. Whether the selected image target has changed.
    const selectedImageTargetChanged =
      simulatorConfig.imageTargetName !== previousConfig?.imageTargetName

    if (!simulatorTypeChanged && !selectedLocationChanged && !manualVpsToggled &&
      !selectedImageTargetChanged) {
      updateSimulatorConfigs()
    } else {
      reloadSimulator()
    }
  }, [rawDevUrl, simulatorConfig, manualVpsEvents, simulatorRendererConfig] as const)

  const activeUrl = lockedInUrl || currentConfigUrl

  const handlePlayPause = (e: React.KeyboardEvent) => {
    if (e.key === Keys.SPACE) {
      e.stopPropagation()
      updateSimulatorState({isPaused: !isPaused})
    }
  }

  const showDisconnectedFromParentWindow = isStandalone && !window.opener

  const renderCollapseButton = (containerSize: ContainerSize) => {
    const {width, height} = containerSize
    if (width < MIN_PREVIEW_WIDTH * 1.1 && height < MIN_PREVIEW_HEIGHT * 1.1) {
      return null
    }

    return (
      <div className={appPreviewStyles.actionButton}>
        <IconButton
          stroke={collapsed ? 'unfurl' : 'furl'}
          onClick={setCollapsed}
          text={collapsed
            ? t('editor_page.inline_app_preview.iframe.expand_button.text')
            : t('editor_page.inline_app_preview.iframe.collapse_button.text')}
        />
      </div>
    )
  }

  const renderPreviewBottom = (containerSize: ContainerSize) => (
    <AppPreviewBottomBar
      selectedSequence={sequenceSelection?.sequence}
      selectedVariation={sequenceSelection?.variationName}
      sequences={sequenceMetadata?.sequences}
      simulatorId={simulatorId}
      broadcastSimulatorMessage={broadcastSimulatorMessage}
      maxDropdownHeight={responsiveHeight * 0.8}
      maxDropdownWidth={responsiveWidth * 0.9}
      containerHeight={containerSize.height}
      containerWidth={containerSize.width}
      selectedLocationId={selectedLocation?.id}
      locations={locations}
      targetsGalleryUuid={targetsGalleryUuid}
      selectedImageTargetName={imageTargetName}
      showVpsUnavailable={showVpsUnavailable}
      vpsEnabled={vpsEnabled}
    />
  )

  const isPendingLoad = !activeUrl || (isInitializingBuild && Build8.PLATFORM_TARGET === 'web')

  return (
    <Measure bounds>
      {previewPaneMeasure => (
        <div
          className={combine(classes.appPreviewPane, isDragging && classes.notInteractive)}
          ref={previewPaneMeasure.measureRef}
          tabIndex={-1}
          onKeyDown={handlePlayPause}
          role='none'
        >
          <div className={combine(appPreviewStyles.previewActions, collapsed && classes.collapsed)}>
            <div className={appPreviewStyles.selectionContainer}>
              <AppPreviewAspectRatio
                responsiveHeight={responsiveHeight}
                responsiveWidth={responsiveWidth}
                previewPaneMeasure={previewPaneMeasure}
              />
              <div className={appPreviewStyles.dropdown}>
                <AppPreviewMockLocation
                  locations={locations}
                  mapPoints={mapPoints}
                  responsiveHeight={responsiveHeight}
                  responsiveWidth={responsiveWidth}
                  iframeRef={iframeRef}
                />
              </div>
            </div>
            <div className={classes.previewActionButtons}>
              {renderActions
                ? renderActions()
                : (
                  <>
                    {showDisconnectedFromParentWindow && (
                      <Popup
                        content={(
                          <>
                            {/* eslint-disable-next-line max-len */}
                            {t('editor_page.inline_app_preview.iframe.connection_warning_button.popup.reload')}
                          </>
                        )}
                        position='bottom'
                        alignment='right'
                        size='tiny'
                        delay={750}
                      >
                        <div className={appPreviewStyles.actionButton}>
                          <IconButton
                            stroke='warning'
                            onClick={() => {}}
                            text=''
                          />
                        </div>
                      </Popup>
                    )}
                    <div className={appPreviewStyles.actionButton}>
                      <Popup
                        content={(
                          <>
                            {t('editor_page.inline_app_preview.iframe.refresh_button.popup.refresh')}
                            <br />
                            {t('editor_page.inline_app_preview.iframe.refresh_button.popup.reload')}
                          </>
                        )}
                        position='bottom'
                        popupDisabled={isRefreshing}
                        alignment='right'
                        size='tiny'
                        delay={750}
                      >
                        <IconButton
                          stroke='standardReload'
                          onClick={handleRefresh}
                          text={t('editor_page.inline_app_preview.iframe.refresh_button.text')}
                          loading={isRefreshing}
                        />
                      </Popup>
                    </div>
                    {setCollapsed && renderCollapseButton(previewPaneMeasure.contentRect.bounds)}
                    {!isStandalone &&
                      <>
                        <div className={appPreviewStyles.actionButton}>
                          <IconButton
                            stroke='popOut'
                            onClick={() => handlePopOut(previewPaneMeasure.contentRect.bounds)}
                            text={t('editor_page.inline_app_preview.iframe.pop_out_button.text')}
                          />
                        </div>
                        <div className={appPreviewStyles.actionButton}>
                          <IconButton
                            stroke='cancelLarge'
                            onClick={() => {
                              updateSimulatorState({inlinePreviewVisible: false})
                              closeDebugSimulatorSession(simulatorId)
                            }}
                            text={t('editor_page.inline_app_preview.iframe.close_button.text')}
                          />
                        </div>
                      </>}
                  </>
                )}
            </div>
          </div>
          <Measure
            bounds
            onResize={(contentRect) => {
              updateSimulatorState({responsiveHeight: Math.round(contentRect.bounds.height)})
              updateSimulatorState({responsiveWidth: Math.round(contentRect.bounds.width)})
              onBoundsChange?.(contentRect.bounds)
            }}
          >
            {({measureRef, contentRect}) => (
              <div
                ref={measureRef}
                className={combine(classes.iframeContainer, collapsed && classes.hidden)}
              >
                {loadingSequence && <Loader /> }
                {/* NOTE(christoph): We don't mount the iframe until the build is initialized. */}
                {!isPendingLoad &&
                  <iframe
                    ref={iframeRef}
                    className={combine(classes.iframe, loadingSequence && classes.dimmed)}
                    style={getStyles(contentRect)}
                    src={activeUrl}
                    title={t('editor_page.inline_app_preview.iframe.title')}
                    frameBorder='0'
                    allow={generateIframePermissions(rawDevUrl)}
                    height={!responsive ? iframeHeight : undefined}
                    width={!responsive ? iframeWidth : undefined}
                    allowFullScreen
                  /> }
                {(isPendingLoad || showLoadingOverlay) &&
                  <InitializingScreen />}
              </div>
            )}
          </Measure>
          {(!collapsed && !hidePreviewBottom) && (
            renderPreviewBottom(previewPaneMeasure.contentRect.bounds)
          )}
          {showVpsUnavailableWarning && <AppPreviewVpsUnavailableModal />}
        </div>
      )}
    </Measure>
  )
}

export {
  InlineAppPreviewPane,
}

export type {
  SectionData,
}
