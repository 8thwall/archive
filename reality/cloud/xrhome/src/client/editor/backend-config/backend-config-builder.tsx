import React, {useContext} from 'react'

import useActions from '../../common/use-actions'
import coreGitActions from '../../git/core-git-actions'
import {useScopedGit} from '../../git/hooks/use-current-git'
import {useCurrentRepoId} from '../../git/repo-id-context'
import {
  initBackendConfigState, backendConfigBuilderReducer, saveStartAction, fileChangeAction,
} from './backend-config-builder-reducer'
import {FileActionsContext} from '../files/file-actions-context'
import {ProxyConfigView} from './proxy-config-view'
import {BACKEND_FOLDER, isBackendPath} from '../../common/editor-files'
import type {GatewayDefinition} from '../../../shared/gateway/gateway-types'
import type {RepoState} from '../../git/git-redux-types'
import {FunctionConfigView} from './function-config-view'

const getOtherBackendsRouteCount = (git: RepoState, thisConfigPath: string) => {
  const {childrenByPath} = git
  const backendsPaths = childrenByPath?.[BACKEND_FOLDER]?.filter(path => (
    isBackendPath(path) && path !== thisConfigPath)) || []
  const count = backendsPaths.reduce(
    (currentCount, path) => {
      try {
        const fileContent = git.filesByPath[path]?.content
        const template = JSON.parse(fileContent) as GatewayDefinition
        const currentTemplateCount = template.type === 'function'
          ? 1
          : Object.entries(template.routes).length
        return currentCount + currentTemplateCount
      } catch (error) {
        return currentCount + 0
      }
    }, 0
  )
  return count
}

interface IBackendConfigBuilder {
  configPath: string
}

const BackendConfigBuilder: React.FC<IBackendConfigBuilder> = ({configPath}) => {
  const {transformFile} = useActions(coreGitActions)
  const {onCreateOrEditBackend} = useContext(FileActionsContext)

  const repoId = useCurrentRepoId()
  const git = useScopedGit(repoId)
  const fileContent = git.filesByPath[configPath]?.content

  const [backendConfigState, dispatch] = React.useReducer(
    backendConfigBuilderReducer, fileContent, initBackendConfigState
  )

  const hasChanges = backendConfigState.needsSave

  React.useEffect(() => {
    dispatch(fileChangeAction(fileContent))
  }, [fileContent])

  React.useEffect(() => {
    if (!hasChanges) {
      return undefined
    }

    const timeout = setTimeout(async () => {
      await transformFile(git?.repo, configPath, () => {
        const newContent = JSON.stringify(backendConfigState.config, null, 2)
        dispatch(saveStartAction(newContent))
        return newContent
      })
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [transformFile, hasChanges, backendConfigState])

  return backendConfigState.config.type === 'function'
    ? <FunctionConfigView
        config={backendConfigState.config}
        dispatch={dispatch}
        onEditBackend={() => onCreateOrEditBackend({repoId, filePath: configPath})}
        configPath={configPath}
    />
    : (
      <ProxyConfigView
        config={backendConfigState.config}
        dispatch={dispatch}
        onEditBackend={() => onCreateOrEditBackend({repoId, filePath: configPath})}
        configPath={configPath}
        otherRoutesCount={getOtherBackendsRouteCount(git, configPath)}
      />
    )
}

export {
  BackendConfigBuilder,
}
