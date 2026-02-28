/* eslint-disable local-rules/hardcoded-copy */
import localForage from 'localforage'

import {dispatchify} from '../common'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import type {SimulatorState, StudioDebugSession} from './editor-reducer'
import unauthenticatedFetch from '../common/unauthenticated-fetch'
import {publicApiFetch} from '../common/public-api-fetch'
import type {AssetMetadataResponse} from '../../shared/api-types/asset-metadata'
import type {HmdLinkState} from './editor-reducer'

const getStudioFileBrowserHeightPercentKey = (repoId: string) => (
  `studio-file-browser-height-percent-${repoId}`
)

const addConsoleInput = (command: string) => (dispatch, getState) => {
  const {uuid} = getState().user
  dispatch({type: 'CONSOLE_INPUT_ADD', command, uuid})
}

const addEditorLogs = (key, logs) => (dispatch) => {
  dispatch({type: 'EDITOR_LOGS_ADD', key, logs})
}

const deleteEditorLogStream = (key, logStreamName) => (dispatch) => {
  dispatch({type: 'EDITOR_LOG_STREAM_DELETE', key, logStreamName})
}

const clearEditorLogStream = (key, logStreamName) => (dispatch) => {
  dispatch({type: 'EDITOR_LOG_STREAM_CLEAR', key, logStreamName})
}

const clearEditorLogStreamOnRun = (
  key: string,
  logStreamName: string,
  timestamp: number
) => (dispatch) => {
  dispatch({type: 'EDITOR_LOG_STREAM_CLEAR_ON_RUN', key, logStreamName, timestamp})
}

const loadConsoleInputHistory = () => async (dispatch, getState) => {
  const {isCommandHistoryLoaded} = getState().editor.consoleInput
  const {uuid} = getState().user
  if (!isCommandHistoryLoaded) {
    const inputHistory = await localForage.getItem(`${uuid}-command-history`)
    dispatch({type: 'CONSOLE_INPUT_HISTORY_LOAD', inputHistory})
  }
}

const toggleIsClearOnRunActive = (key: string, logStreamName: string) => (dispatch) => {
  dispatch({type: 'EDITOR_IS_CLEAR_ON_RUN_ACTIVE_TOGGLE', key, logStreamName})
}

const setLeftPaneSplitSize = size => async (dispatch) => {
  await localForage.setItem('editor-left-pane-size', size)
  dispatch({type: 'SET_LEFT_PANE_SPLIT_SIZE', size})
}

const loadLeftPaneSplitSize = () => async (dispatch) => {
  const size = await localForage.getItem('editor-left-pane-size')
  dispatch({type: 'SET_LEFT_PANE_SPLIT_SIZE', size})
}

const loadModulePaneSplitSize = (repoId: string) => async (dispatch) => {
  const size = await localForage.getItem(`editor-module-pane-size-${repoId}`)
  dispatch({type: 'SET_MODULE_PANE_SPLIT_SIZE', size})
}

const loadFileBrowserHeightPercent = (key: string) => async (dispatch) => {
  const size = await localForage.getItem(getStudioFileBrowserHeightPercentKey(key))
  dispatch({type: 'SET_STUDIO_FILE_BROWSER_HEIGHT_PERCENT', key, size})
}

const setFileBrowserHeightPercent = (key: string, size?: number) => (dispatch) => {
  dispatch({type: 'SET_STUDIO_FILE_BROWSER_HEIGHT_PERCENT', key, size})
}

const saveFileBrowserHeightPercent = (key: string, size?: number) => async (dispatch) => {
  await localForage.setItem(getStudioFileBrowserHeightPercentKey(key), size)
  dispatch({type: 'SET_STUDIO_FILE_BROWSER_HEIGHT_PERCENT', key, size})
}

const setLogStreamDebugInitialHudStatus = (
  key: string,
  deviceId: string,
  sessionId: string,
  status: boolean,
  screenWidth: any,
  screenHeight: any,
  ua: string
) => (dispatch) => {
  dispatch({
    type: 'SET_LOG_STREAM_DEBUG_HUD_STATUS',
    key,
    deviceId,
    sessionId,
    status,
    screenWidth,
    screenHeight,
    ua,
  })
}

const setLogStreamDebugHudStatus = (
  key: string, sessionId: string, status: boolean
) => (dispatch) => {
  dispatch({type: 'SET_LOG_STREAM_DEBUG_HUD_STATUS', key, sessionId, status})
}

const fetchAssetBundleMetadata = (bundleId: string): AsyncThunk<AssetMetadataResponse> => (
  async (dispatch) => {
    try {
      return await dispatch(publicApiFetch(`/asset-metadata/bundle/${bundleId}`))
    } catch (err) {
      dispatch({type: 'ERROR', msg: `Failed to fetch metadata for asset bundle ${bundleId}`})
      throw err
    }
  }
)

const setPreviewLinkDebugModeSelected = (status: boolean) => (dispatch) => {
  localForage.setItem('preview-link-debug-mode', status)
  dispatch({type: 'SET_PREVIEW_LINK_DEBUG_MODE', status})
}

const setHmdLinkState = (hmdLinkState: Partial<HmdLinkState>) => (dispatch) => {
  localForage.setItem('last-hmd-link-state', hmdLinkState)
  dispatch({type: 'SET_HMD_LINK_STATE', hmdLink: hmdLinkState})
}

const loadPreviewLinkDebugModeSelected = () => async (dispatch) => {
  const status = await localForage.getItem('preview-link-debug-mode')
  dispatch({type: 'SET_PREVIEW_LINK_DEBUG_MODE', status})
}

const loadLastHmdLinkState = () => async (dispatch) => {
  const status = await localForage.getItem('last-hmd-link-state')
  dispatch({type: 'SET_HMD_LINK_STATE', status})
}

const simulatorStateKey = (appKey: string) => `simulator-state-${appKey}`

const updateSimulatorState = (
  appKey: string,
  status: Partial<SimulatorState>
): AsyncThunk<void> => async (dispatch, getState) => {
  dispatch({type: 'UPDATE_SIMULATOR_STATE', appKey, status})
  const updatedState = getState().editor.byKey[appKey].simulatorState
  await localForage.setItem(simulatorStateKey(appKey), updatedState)
}

const loadSimulatorState = (appKey: string): AsyncThunk<void> => async (dispatch) => {
  const status = await localForage.getItem(simulatorStateKey(appKey)) || {}
  dispatch({type: 'SET_SIMULATOR_STATE', appKey, status})
}

const ensureSimulatorStateReady = (
  appKey: string
): AsyncThunk<void> => async (dispatch, getState) => {
  const scopedState = getState().editor.byKey[appKey]
  if (!scopedState?.simulatorState) {
    await dispatch(loadSimulatorState(appKey))
  }
}

const fetchSequenceMetadata = (url: string) => async (dispatch) => {
  try {
    return await dispatch(unauthenticatedFetch(url))
  } catch (err) {
    dispatch({type: 'ERROR', msg: `Failed to fetch metadata for simulator sequences at ${url}`})
    throw err
  }
}

const addStudioSessionId = (
  appKey: string, sessionId: string, pageId: string,
  screenWidth: number, screenHeight: number, ua: string, simulatorId: string,
  enableTransformMap: boolean
) => (dispatch) => {
  dispatch({
    type: 'EDITOR_ADD_STUDIO_DEBUG_SESSION',
    appKey,
    sessionId,
    pageId,
    screenWidth,
    screenHeight,
    ua,
    simulatorId,
    enableTransformMap,
  })
}

const setStudioSessionId = (
  appKey: string, sessionId: string, pageId: string,
  screenWidth: number, screenHeight: number, ua: string, simulatorId: string,
  enableTransformMap: boolean, autoConnected: boolean
) => (dispatch) => {
  dispatch({
    type: 'EDITOR_SET_STUDIO_DEBUG_SESSION',
    appKey,
    sessionId,
    pageId,
    screenWidth,
    screenHeight,
    ua,
    simulatorId,
    enableTransformMap,
    autoConnected,
  })
}

const removeStudioSessionId = (appKey: string, sessionId: string) => (dispatch) => {
  dispatch({type: 'EDITOR_REMOVE_STUDIO_DEBUG_SESSION', appKey, sessionId})
}

const filterStudioSessionIds = (
  appKey: string, availableSessionIds: Record<string, boolean>
) => (dispatch) => {
  dispatch({type: 'EDITOR_FILTER_STUDIO_DEBUG_SESSIONS', appKey, availableSessionIds})
}

const selectDebugSession = (
  appKey: string, session: StudioDebugSession, inlinePreviewSession: boolean
): AsyncThunk<void> => async (dispatch, getState) => {
  dispatch({type: 'EDITOR_DEBUG_SESSION_SELECT', appKey, session, inlinePreviewSession})
  const updatedState = getState().editor.byKey[appKey].simulatorState
  await localForage.setItem(simulatorStateKey(appKey), updatedState)
}

const disconnectDebugSession = (appKey: string) => (dispatch) => {
  dispatch({type: 'EDITOR_DEBUG_SESSION_DISCONNECT', appKey})
}

const cancelDebugSession = (appKey: string) => (dispatch) => {
  dispatch({type: 'EDITOR_DEBUG_SESSION_CANCEL', appKey})
}

const selectSimulatorSession = (
  appKey: string, simulatorId: string
): AsyncThunk<void> => async (dispatch, getState) => {
  dispatch({type: 'EDITOR_SELECT_DEBUG_SIMULATOR_SESSION', appKey, simulatorId})
  const updatedState = getState().editor.byKey[appKey]?.simulatorState
  await localForage.setItem(simulatorStateKey(appKey), updatedState)
}

const removeSimulatorSession = (
  appKey: string, simulatorId: string
): AsyncThunk<void> => async (dispatch, getState) => {
  dispatch({type: 'EDITOR_REMOVE_DEBUG_SIMULATOR_SESSION', appKey, simulatorId})
  const updatedState = getState().editor.byKey[appKey]?.simulatorState
  await localForage.setItem(simulatorStateKey(appKey), updatedState)
}

const fetchEcsDefinitions = (url: string): AsyncThunk<string> => async (dispatch) => {
  // note(owenmech): replace this to test ECS definitions on a release PR
  // url = 'https://cdn-dev.8thwall.com/pr/859/54z94itd/web/ecs/release/ecs-definition-file.ts'
  try {
    return await dispatch(unauthenticatedFetch(url))
  } catch (err) {
    dispatch({type: 'ERROR', msg: `Failed to fetch ECS definition file at ${url}`})
    throw err
  }
}

const notifyClientBuilt = (key: string) => ({type: 'EDITOR_CLIENT_BUILT', key})

const rawActions = {
  addConsoleInput,
  addEditorLogs,
  deleteEditorLogStream,
  clearEditorLogStream,
  clearEditorLogStreamOnRun,
  toggleIsClearOnRunActive,
  loadConsoleInputHistory,
  setLeftPaneSplitSize,
  loadLeftPaneSplitSize,
  loadModulePaneSplitSize,
  loadFileBrowserHeightPercent,
  setFileBrowserHeightPercent,
  saveFileBrowserHeightPercent,
  setLogStreamDebugHudStatus,
  fetchAssetBundleMetadata,
  setPreviewLinkDebugModeSelected,
  loadPreviewLinkDebugModeSelected,
  setLogStreamDebugInitialHudStatus,
  loadSimulatorState,
  ensureSimulatorStateReady,
  updateSimulatorState,
  fetchSequenceMetadata,
  addStudioSessionId,
  setStudioSessionId,
  removeStudioSessionId,
  filterStudioSessionIds,
  selectDebugSession,
  disconnectDebugSession,
  cancelDebugSession,
  selectSimulatorSession,
  removeSimulatorSession,
  notifyClientBuilt,
  setHmdLinkState,
  loadLastHmdLinkState,
  fetchEcsDefinitions,
}

export type EditorActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
