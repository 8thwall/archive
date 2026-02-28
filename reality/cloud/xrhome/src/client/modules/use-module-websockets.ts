import {useCallback, useMemo} from 'react'
import type {DeepReadonly} from 'ts-essentials'

import ConsoleLogStreams, {IncomingMessage} from '../editor/console-log-streams'

import type {IModule} from '../common/types/models'
import {useSpecifiersWebsocketHandler} from '../hooks/use-specifiers-websocket-handler'
import {getModuleSpecifiers} from './module-specifier'
import editorActions from '../editor/editor-actions'
import coreGitActions from '../git/core-git-actions'
import useActions from '../common/use-actions'
import {useScopedGit} from '../git/hooks/use-current-git'
import {ModuleEditorSocketBranchEnum as BranchEnum} from './module-editor-constants'
import type {IRepo} from '../git/g8-dto'

const useModuleWebsocketsHandler = (repo: DeepReadonly<IRepo>) => {
  const {addEditorLogs} = useActions(editorActions)
  const {syncRepo} = useActions(coreGitActions)
  return useCallback((msg: IncomingMessage) => {
    const streamsToLog = []
    streamsToLog.push(ConsoleLogStreams.devOnlyRawMessageLog(msg))
    const consoleLog = ConsoleLogStreams.messageLog(msg)
    // CONSOLE_ACTIVITY messages are always an array but other messages are singles
    if (Array.isArray(consoleLog)) {
      streamsToLog.push(...consoleLog)
    } else {
      streamsToLog.push(consoleLog)
    }
    addEditorLogs(repo.repoId, streamsToLog.filter(l => !!l))

    if (msg.action === 'NEW_BUILD') {
      if (msg?.branch === BranchEnum.master) {
        // When a new repo branch build is available, the deployment pointers update and new logs
        // are potentially available. New logs were actually available on BUILD_REQUEST, but it
        // seems acceptable to delay a few seconds and have them be updated here in tandem with
        // the deployment branches.
        syncRepo(repo)
      }
    }
  }, [repo])
}

const useModuleWebsockets = (module: IModule) => {
  const git = useScopedGit(module?.repoId)
  const wsHandler = useModuleWebsocketsHandler(git?.repo)
  const specifiers = useMemo(() => getModuleSpecifiers(module, git), [module, git])
  useSpecifiersWebsocketHandler(wsHandler, specifiers)
}

export {useModuleWebsockets}
