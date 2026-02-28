/* eslint react-hooks/exhaustive-deps: error */
import React from 'react'
import type {DeepReadonly} from 'ts-essentials'

import {useSelector} from '../../hooks'
import moduleGitActions from '../../git/module-git-actions'
import {IDependencyContext, useDependencyContext} from '../dependency-context'
import useActions from '../../common/use-actions'
import dependencyActions from '../dependency-actions'
import moduleUserActions from '../../modules/module-user-actions'
import {IMultiRepoContext, useMultiRepoContext} from '../multi-repo-context'
import {BaseSwitchActiveBrowserModal} from './base-switch-active-browser-modal'
import {useCurrentRepoId} from '../../git/repo-id-context'
import {useMountedRef} from '../../hooks/use-mounted'
import {useWebsocketHandler} from '../../hooks/use-websocket-handler'
import {useWebsocketRestart} from '../../hooks/use-websocket-restart'
import {getUserSocketSpecifier} from '../../user/get-user-socket-specifier'
import {broadcastRepoBecameActive} from '../broadcast-active-browser'
import {useBrowserUuid} from '../../common/use-browser-uuid'
import {useUserUuid} from '../../user/use-current-user'

const resolveOpenModules = (
  multiRepoContext: DeepReadonly<IMultiRepoContext>,
  dependencies: DeepReadonly<IDependencyContext>
) => {
  if (!multiRepoContext || !dependencies) {
    return []
  }

  const {dependenciesByPath, dependencyIdToPath} = dependencies

  return Object.entries(multiRepoContext.openDependencies)
    .map(([dependencyId, repoId]) => ({
      dependencyId,
      repoId,
      moduleId: dependenciesByPath[dependencyIdToPath[dependencyId]]?.moduleId,
    }))
}

const DependencyActiveBrowserModal: React.FC = () => {
  const primaryRepoId = useCurrentRepoId()
  const dependencies = useDependencyContext()
  const multiRepoContext = useMultiRepoContext()

  const moduleUsers = useSelector(state => state.modules.moduleUsers)
  const myBrowserUuid = useBrowserUuid()
  const userUuid = useUserUuid()

  const {clearTargetOverride} = useActions(dependencyActions)
  const {getModuleUser, updateModuleUser} = useActions(moduleUserActions)
  const {revertModuleToSave} = useActions(moduleGitActions)

  const [activating, setActivating] = React.useState(false)

  const mountedRef = useMountedRef()
  const fetchedIds = React.useRef<Set<string>>()

  const openModules = React.useMemo(() => (
    resolveOpenModules(multiRepoContext, dependencies)
  ), [multiRepoContext, dependencies])

  // This effect is responsible for fetching the module users initially for each open module
  React.useEffect(() => {
    openModules.forEach(({moduleId, repoId}) => {
      fetchedIds.current = fetchedIds.current || new Set()
      if (fetchedIds.current.has(repoId)) {
        return
      }
      fetchedIds.current.add(repoId)
      getModuleUser(moduleId)
    })
  }, [openModules, getModuleUser])

  // This effect is responsible for backfilling the active browser into modules for the first time
  React.useEffect(() => {
    openModules.forEach(({moduleId}) => {
      const moduleUser = moduleUsers[moduleId]
      if (moduleUser && !moduleUser.activeBrowser) {
        updateModuleUser(moduleId, {activeBrowser: myBrowserUuid})
      }
    })
  }, [updateModuleUser, myBrowserUuid, moduleUsers, openModules])

  const neededSyncs = openModules.filter(({moduleId}) => {
    const moduleUser = moduleUsers[moduleId]
    return moduleUser?.activeBrowser && moduleUser.activeBrowser !== myBrowserUuid
  })

  const handleWebsocketMessage = (msg: {action: string, repoId?: string}) => {
    if (msg.action === 'ACTIVE_BROWSER_SET') {
      const openModule = openModules.find(e => e.repoId === msg.repoId)
      if (openModule) {
        getModuleUser(openModule.moduleId)
      } else {
        // NOTE(christoph): If we get notified that an active browser changed for a repo, even if
        // it isn't currently open for editing, we might have loaded the moduleUser already, so we
        // should make sure it isn't cached from an earlier time when we had the module open for
        // editing.
        fetchedIds.current?.delete(msg.repoId)
      }
    }
  }

  // Listen for active browser websocket message and ask server to verify.
  useWebsocketHandler(handleWebsocketMessage, getUserSocketSpecifier(userUuid))

  const handleWebsocketRestart = () => {
    openModules.map(e => e.moduleId).forEach(getModuleUser)
  }

  // When websocket connection becomes re-established there is a window of time in which
  // we could have missed a message.
  useWebsocketRestart(handleWebsocketRestart, getUserSocketSpecifier(userUuid))

  if (!neededSyncs.length && !activating) {
    return null
  }

  // When we reject becoming the active browser, we can just exit development mode for them.
  const handleReject = () => {
    neededSyncs.forEach(s => clearTargetOverride(primaryRepoId, s.dependencyId))
  }

  const handleAccept = async () => {
    setActivating(true)

    await Promise.all(neededSyncs.map(async (sync) => {
      const newModuleUser = await updateModuleUser(sync.moduleId, {activeBrowser: myBrowserUuid})
      if (newModuleUser.activeBrowser === myBrowserUuid) {
        const editorChatChannelSpecifier = null  // NOTE(christoph): This is deprecated
        broadcastRepoBecameActive(
          userUuid,
          editorChatChannelSpecifier,
          myBrowserUuid,
          sync.repoId
        )
        await revertModuleToSave(sync.repoId)
      }
    }))

    if (mountedRef.current) {
      setActivating(false)
    }
  }

  return (
    <BaseSwitchActiveBrowserModal
      onReject={handleReject}
      onAccept={handleAccept}
      activating={activating}
    />
  )
}

export {
  DependencyActiveBrowserModal,
}
