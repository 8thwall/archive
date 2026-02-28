import React from 'react'
import type {DebugMessage} from '@ecs/shared/debug-messaging'
import {v4 as uuid} from 'uuid'
import {SceneDoc, createEmptySceneDoc} from '@ecs/shared/crdt'
import {bytesToString} from '@ecs/shared/data'
import {TRANSFORM_MAP_VERSION} from '@ecs/shared/transform-map'

import type {SceneContext} from '../scene-context'
import {getEditorSocketSpecifier} from '../../common/hosting-urls'
import useCurrentApp from '../../common/use-current-app'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import type {SocketSpecifier} from '../../websockets/websocket-pool'
import useActions from '../../common/use-actions'
import editorActions from '../../editor/editor-actions'
import {useStudioDebug} from '../../editor/app-preview/use-studio-debug-state'
import type {StudioDebugSession} from '../../editor/editor-reducer'
import {useChangeEffect} from '../../hooks/use-change-effect'
import {useEcsEventStream} from './use-ecs-event-stream'
import {useAppPreviewWindow} from '../../common/app-preview-window-context'
import {getPreviouslyOpenedSimulatorWindow} from '../../editor/app-preview/open-window'
import {useSimulator} from '../../editor/app-preview/use-simulator-state'
import {useStudioStateContext} from '../studio-state-context'
import {deriveActiveSpace} from './active-space'

type DebugSession = {
  debugId: string
  pageId: string
  url: SocketSpecifier
  baseDoc: SceneDoc
  simulatorId?: string
  activeSpaceId?: string
}

interface DebugSceneOptions {
  paused?: boolean
  pointing?: boolean
  inlineSimulatorId: string
  baseScene: SceneContext['scene']
}

const EDITOR_ACTOR_ID = 'ed'  // Arbitrary hex digits

const useRemoteScene = ({baseScene, paused, inlineSimulatorId}: DebugSceneOptions) => {
  const debugSessionRef = React.useRef<DebugSession | null>(null)
  const inlineSessionActiveRef = React.useRef<boolean>()
  const [status, setStatus] = React.useState<SceneContext['debugStatus']>('waiting')

  const {studioDebugState} = useStudioDebug()
  const {currentSession, connected} = studioDebugState

  const stateCtx = useStudioStateContext()
  const {restartKey} = stateCtx.state

  // TODO(cindyhu): baseScene should not be null, we will need to update useState in expanse
  const activeSpaceId = baseScene && deriveActiveSpace(baseScene, stateCtx.state.activeSpace)?.id

  const {
    getFramedPreviewWindow,
    setFramedPreviewWindow,
  } = useAppPreviewWindow()

  const git = useCurrentGit()
  const app = useCurrentApp()

  const {
    setStudioSessionId, cancelDebugSession,
    ensureSimulatorStateReady,
  } = useActions(editorActions)

  const {simulatorState} = useSimulator()

  React.useEffect(() => {
    ensureSimulatorStateReady(app.appKey)

    return () => cancelDebugSession(app.appKey)
  }, [app.appKey])

  React.useEffect(() => {
    inlineSessionActiveRef.current = simulatorState.inlinePreviewDebugActive
  }, [simulatorState.inlinePreviewDebugActive])

  const specifier = getEditorSocketSpecifier({git, app}, 'current-client')

  const handleDebugMessage = (msg: DebugMessage) => {
    switch (msg.action) {
      case 'ECS_READY': {
        const {
          sessionId, pageId, screenWidth, screenHeight, ua, simulatorId, version,
        } = msg
        const connectSimulator = inlineSessionActiveRef.current && simulatorId === inlineSimulatorId
        if (connectSimulator) {
          setStudioSessionId(
            app.appKey, sessionId, pageId, screenWidth, screenHeight, ua, simulatorId,
            version === TRANSFORM_MAP_VERSION, true
          )
        }
        break
      }
      case 'ECS_ATTACH_CONFIRM': {
        const {debugId} = msg
        if (!debugSessionRef.current || debugSessionRef.current.debugId !== debugId) {
          return
        }
        setStatus('attach-confirmed')
        break
      }

      default:
    }
  }

  const {sendData} = useEcsEventStream({
    currentSession,
    inlineSimulatorId,
    channelSpecifier: specifier,
    onDebugMessage: handleDebugMessage,
  })

  const sendAttach = (session: StudioDebugSession) => {
    const debugId = uuid()
    const {pageId, simulatorId} = session

    const doc = createEmptySceneDoc(EDITOR_ACTOR_ID)

    if (!baseScene) {
      return
    }
    doc.update(() => baseScene)
    debugSessionRef.current = {
      debugId,
      pageId,
      url: specifier,
      baseDoc: doc,
      simulatorId,
      activeSpaceId,
    }
    // Note(Julie): When reattaching during an ongoing session (refresh) we'll want to send the
    // current debug state to retain the previous behavior. This will change in the future to
    // handle other cases, e.g. switching to a different device with a running scene should not
    // be affected by the current editor state
    sendData({
      action: 'ECS_ATTACH',
      pageId,
      debugId,
      state: {
        paused,
        activeSpaceId,
      },
      doc: bytesToString(doc.save()),
      mode: 'base',
    }, simulatorId)
    setStatus('attach-sent')
  }

  const sendDetach = () => {
    if (!debugSessionRef.current) {
      return
    }

    sendData({
      action: 'ECS_DETACH',
      debugId: debugSessionRef.current.debugId,
    }, debugSessionRef.current.simulatorId)
    debugSessionRef.current = null
    setStatus('waiting')
  }

  const updatePreviewWindowRefs = (session: StudioDebugSession) => {
    // If we are attaching to a standalone window simulator,
    // see if we have a saved one still. If not, try to recover one so we can
    // send post messages to it.
    const isSimulatorInPopout = session.simulatorId &&
      session.simulatorId !== inlineSimulatorId
    const savedFramedPreviewWindow = getFramedPreviewWindow()

    if (!savedFramedPreviewWindow && isSimulatorInPopout) {
      const framedPreviewWindow = getPreviouslyOpenedSimulatorWindow()
      setFramedPreviewWindow(framedPreviewWindow)
    }
    // NOTE(Julie): We were attempting to recover the previously opened preview tab
    // so we could use postMessage, however this caused issues and was opening a blank tab
    // since we did not have enough info to determine whether or not the tab exists within the
    // current browser or somewhere external (e.g. a different browser or device session)
    // This is removed for now, and will fallback to using websocket.
  }

  useChangeEffect(([prevSession, prevConnected]) => {
    if (prevConnected && !connected) {
      sendDetach()
      return
    }
    if (prevSession?.pageId !== currentSession?.pageId) {
      sendDetach()
    }
    if (currentSession && connected && currentSession?.pageId !== prevSession?.pageId) {
      updatePreviewWindowRefs(currentSession)
      sendAttach(currentSession)
    }
  }, [currentSession, connected] as const)

  React.useEffect(() => {
    if (!debugSessionRef.current) {
      return
    }
    sendData({
      action: 'ECS_STATE_UPDATE',
      debugId: debugSessionRef.current.debugId,
      state: {paused},
    }, debugSessionRef.current.simulatorId)
  }, [paused])

  React.useEffect(() => {
    if (!debugSessionRef.current || !activeSpaceId ||
      debugSessionRef.current.activeSpaceId === activeSpaceId
    ) {
      return
    }
    sendData({
      action: 'ECS_STATE_UPDATE',
      debugId: debugSessionRef.current.debugId,
      state: {activeSpaceId},
    }, debugSessionRef.current.simulatorId)
    debugSessionRef.current.activeSpaceId = activeSpaceId
  }, [activeSpaceId])

  useChangeEffect(([prevRestartKey]) => {
    if (!debugSessionRef.current) {
      return
    }
    if (prevRestartKey && prevRestartKey !== restartKey) {
      sendData({
        action: 'ECS_RESET_SCENE',
        debugId: debugSessionRef.current.debugId,
      })
    }
  }, [restartKey])

  React.useEffect(() => {
    if (!debugSessionRef.current) {
      return
    }
    const {baseDoc} = debugSessionRef.current
    const prevBaseDoc = baseDoc.raw()
    baseDoc.update(() => baseScene)
    sendData({
      action: 'ECS_BASE_EDIT',
      debugId: debugSessionRef.current.debugId,
      diffs: baseDoc.getChanges(prevBaseDoc).map(bytesToString),
    }, debugSessionRef.current.simulatorId)
  }, [baseScene])

  return {status}
}

export {
  useRemoteScene,
}
