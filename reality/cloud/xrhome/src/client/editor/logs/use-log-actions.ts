import React from 'react'

import {TRANSFORM_MAP_VERSION} from '@ecs/shared/transform-map'

import useActions from '../../common/use-actions'
import editorActions from '../editor-actions'
import ConsoleLogStreams from '../console-log-streams'
import {getEditorSocketSpecifier, getEditorSocketSpecifiers} from '../../common/hosting-urls'
import {ModuleEditorSocketBranchEnum} from '../../modules/module-editor-constants'
import WebsocketPool, {SocketSpecifier} from '../../websockets/websocket-pool'
import {useMultiRepoContext, type IMultiRepoContext} from '../multi-repo-context'
import {actions as gitActions} from '../../git/git-actions'
import appsActions from '../../apps/apps-actions'
import coreGitActions from '../../git/core-git-actions'
import {useSelector} from '../../hooks'
import {
  addRepoBroadcastListener, removeRepoBroadcastListener, RepoCoordinationMessage,
} from '../../common/repo-broadcast'
import {clearRepositoryWriteBlock, setRepositoryWriteBlock} from '../../common/repo-coordination'
import {useDependencyContext} from '../dependency-context'
import {getModuleSpecifier, getModuleSpecifiers} from '../../modules/module-specifier'
import {useMultiBuildCoordination} from '../../common/use-multi-build-coordination'
import {useScopedGit} from '../../git/hooks/use-current-git'
import type {IApp} from '../../common/types/models'

const getMsgTitle = (repoId: string, multiRepoContext: IMultiRepoContext): string => {
  const title = multiRepoContext?.subRepoIds.size && multiRepoContext.repoIdToTitle[repoId]
  return title ? `[${title}] ` : ''
}

const useLogActions = (app: IApp, editorEnabled: boolean) => {
  const git = useScopedGit(app.repoId)
  const repoIdToGit = useSelector(s => s.git.byRepoId)
  const modules = useSelector(s => s.modules.entities)

  const logActions = useActions(editorActions)
  const {syncRepo} = useActions(coreGitActions)
  const {syncRepoStateFromServer} = useActions(gitActions)
  const {syncApp} = useActions(appsActions)

  const clientSpecifier = getEditorSocketSpecifier({git, app}, 'current-client')
  const multiBuildCoordination = useMultiBuildCoordination(clientSpecifier)
  const multiRepoContext = useMultiRepoContext()
  const dependencyContext = useDependencyContext()

  const closeSessionTimeoutsRef = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const {openModuleSpecifiers, activeModuleSpecifiers} = React.useMemo(() => {
    if (!repoIdToGit || !multiRepoContext || !dependencyContext || !modules) {
      return {openModuleSpecifiers: [], activeModuleSpecifiers: []}
    }
    const openSpecifiers: SocketSpecifier[] = []
    const activeSpecifiers: SocketSpecifier[] = []
    Object.entries(multiRepoContext.openDependencies).forEach(([depId, repoId]) => {
      const dependencyPath = dependencyContext.dependencyIdToPath[depId]
      openSpecifiers.push(...getModuleSpecifiers(
        modules[dependencyContext.dependenciesByPath[dependencyPath].moduleId],
        repoIdToGit[repoId]
      ))
      activeSpecifiers.push(getModuleSpecifier(
        modules[dependencyContext.dependenciesByPath[dependencyPath].moduleId],
        repoIdToGit[repoId],
        ModuleEditorSocketBranchEnum.currentClient
      ))
    })
    return {openModuleSpecifiers: openSpecifiers, activeModuleSpecifiers: activeSpecifiers}
  }, [repoIdToGit, multiRepoContext, dependencyContext, modules])

  React.useEffect(() => () => {
    Object.keys(closeSessionTimeoutsRef.current).forEach((sessionId) => {
      clearTimeout(closeSessionTimeoutsRef.current[sessionId])
      delete closeSessionTimeoutsRef.current[sessionId]
    })
  }, [])

  React.useEffect(() => {
    if (!editorEnabled) {
      return undefined
    }

    const handleWebSocketMessage = (msg) => {
      const streamsToLog: any[] = []

      streamsToLog.push(ConsoleLogStreams.devOnlyRawMessageLog(msg))
      const title = getMsgTitle(msg.repoId, multiRepoContext)
      const consoleLog = ConsoleLogStreams.messageLog(msg, title)
      // CONSOLE_ACTIVITY messages are always an array but other messages are singles
      if (Array.isArray(consoleLog)) {
        streamsToLog.push(...consoleLog)
      } else {
        streamsToLog.push(consoleLog)
      }

      logActions.addEditorLogs(app.appKey, streamsToLog.filter(l => !!l))

      if (msg.action === 'SESSION_START') {
        logActions.clearEditorLogStreamOnRun(
          app.appKey, msg.sessionId ?? msg.deviceId, msg.timestamp
        )
      }

      if (msg.action === 'INITIAL_DEBUG_HUD_STATUS') {
        logActions.setLogStreamDebugInitialHudStatus(
          app.appKey,
          msg.deviceId,
          msg.sessionId || msg.deviceId,
          msg.status,
          msg.screenWidth,
          msg.screenHeight,
          msg.ua
        )
      }

      if (msg.action === 'SET_DEBUG_HUD_STATUS') {
        logActions.setLogStreamDebugHudStatus(app.appKey, msg.sessionId ?? msg.deviceId, msg.status)
      }

      if (msg.action === 'NEW_BUILD') {
        const isRepoBranch = msg.branch && ['master', 'staging', 'production'].includes(msg.branch)
        if (isRepoBranch) {
          // When a new repo branch build is available, the deployment pointers update and new logs
          // are potentially available. New logs were actually available on BUILD_REQUEST, but it
          // seems acceptable to delay a few seconds and have them be updated here in tandem with
          // the deployment branches.
          const currentClient = git.clients.filter(c => c.active)
          if (currentClient.length) {
            syncRepoStateFromServer(git.repo, app.uuid)

            // Update app thats recently deployed to production.
            // This is being done due to the final project modal's reliance on an app's
            // productionCommitHash to determine if they've published or not, which renders
            // additional modals.
            if (msg.branch === 'production') {
              syncApp(app.uuid)
            }
          }
        } else {
          logActions.notifyClientBuilt(app.appKey)
        }
      }

      // Update App's productionCommitHash after undeployment is finished
      if (msg.action === 'PRODUCTION_DEPLOYMENT_DELETED') {
        syncApp(app.uuid)
      }

      if (msg.action === 'ECS_READY') {
        const timeoutId = closeSessionTimeoutsRef.current[msg.sessionId]
        if (timeoutId) {
          clearTimeout(timeoutId)
          delete closeSessionTimeoutsRef.current[msg.sessionId]
        }

        logActions.addStudioSessionId(
          app.appKey,
          msg.sessionId,
          msg.pageId,
          msg.screenWidth,
          msg.screenHeight,
          msg.ua,
          msg.simulatorId,
          msg.version === TRANSFORM_MAP_VERSION
        )
      }

      if (msg.action === 'ECS_CLOSE') {
        // There's currently no way to differentiate between a reload and a window close
        // in browsers so instead we'll have a timeout to clear the session
        // if we don't receive ECS_READY shortly after.
        if (closeSessionTimeoutsRef.current[msg.sessionId]) {
          return
        }
        closeSessionTimeoutsRef.current[msg.sessionId] = setTimeout(() => {
          logActions.removeStudioSessionId(app.appKey, msg.sessionId)
          delete closeSessionTimeoutsRef.current[msg.sessionId]
        }, 5000)
      }
    }

    const specifiers = getEditorSocketSpecifiers({git, app})

    specifiers.forEach((specifier) => {
      WebsocketPool.addHandler(specifier, handleWebSocketMessage)
    })

    return () => {
      specifiers.forEach((specifier) => {
        WebsocketPool.removeHandler(specifier, handleWebSocketMessage)
      })
    }
  }, [app, git, editorEnabled, logActions, syncRepoStateFromServer])

  React.useEffect(() => {
    if (!editorEnabled) {
      return undefined
    }

    const handleModuleWebSocketMessage = (msg) => {
      const streamsToLog: any[] = []
      streamsToLog.push(ConsoleLogStreams.devOnlyRawMessageLog(msg))
      const title = getMsgTitle(msg.repoId, multiRepoContext)
      const consoleLog = ConsoleLogStreams.messageLog(msg, title)
      // CONSOLE_ACTIVITY messages are always an array but other messages are singles
      if (Array.isArray(consoleLog)) {
        streamsToLog.push(...consoleLog)
      } else {
        streamsToLog.push(consoleLog)
      }

      logActions.addEditorLogs(app.appKey, streamsToLog.filter(l => !!l))

      if (msg.action === 'NEW_BUILD') {
        if (msg?.branch === ModuleEditorSocketBranchEnum.master) {
          syncRepo(repoIdToGit[msg.repoId].repo)
        }
      }
    }

    openModuleSpecifiers.forEach((specifier) => {
      WebsocketPool.addHandler(specifier, handleModuleWebSocketMessage)
    })

    return () => {
      openModuleSpecifiers.forEach((specifier) => {
        WebsocketPool.removeHandler(specifier, handleModuleWebSocketMessage)
      })
    }
  }, [editorEnabled, logActions, openModuleSpecifiers])

  React.useEffect(() => {
    if (!editorEnabled) {
      return undefined
    }

    const activeSpecifiers = [clientSpecifier, ...activeModuleSpecifiers].filter(Boolean)

    const handleBuildMessage = (msg) => {
      if (msg.action === 'BUILD_REQUEST') {
        multiBuildCoordination.buildStart()
      }
      if (msg.action === 'NEW_BUILD') {
        multiBuildCoordination.buildComplete()
      }
    }

    activeSpecifiers.forEach((specifier) => {
      WebsocketPool.addHandler(specifier, handleBuildMessage)
    })

    return () => {
      activeSpecifiers.forEach((specifier) => {
        WebsocketPool.removeHandler(specifier, handleBuildMessage)
      })
    }
  }, [editorEnabled, clientSpecifier, activeModuleSpecifiers])

  React.useEffect(() => {
    if (!editorEnabled) {
      return undefined
    }

    const listener = (channel: string, message: RepoCoordinationMessage) => {
      // run-write-operation is emitted every half second while a write operation is writing.
      // We keep track of the write blocks of other projects so that when the user switches
      // over to that project, we eliminate the possible race condition of syncing during a
      // an active write operation.
      const {type, actionName} = message
      if (type === 'begin-write-operation' || type === 'run-write-operation') {
        setRepositoryWriteBlock(channel, actionName)
      }
      if (type === 'end-write-operation') {
        clearRepositoryWriteBlock(channel)
      }
    }

    addRepoBroadcastListener(listener)

    return () => {
      removeRepoBroadcastListener(listener)
    }
  }, [editorEnabled])
}

export {useLogActions}
