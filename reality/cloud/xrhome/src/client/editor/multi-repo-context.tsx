/* eslint react-hooks/exhaustive-deps: error */
import React from 'react'

import {useCurrentRepoId} from '../git/repo-id-context'
import {useSelector} from '../hooks'
import moduleGitActions from '../git/module-git-actions'
import {useDependencyContext} from './dependency-context'
import useActions from '../common/use-actions'
import coreGitActions from '../git/core-git-actions'
import useCurrentApp from '../common/use-current-app'
import {isOpenForDevelopment} from '../../shared/module/module-target-override'

interface IMultiRepoContext {
  primaryRepoId: string
  subRepoIds: Set<string>
  openDependencies: Record<string, string>
  repoIdToDependencyId: Record<string, string>
  repoIdToTitle: Record<string, string>
}

const MultiRepoContext = React.createContext<IMultiRepoContext | null>(null)

const MultiRepoContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const primaryRepoId = useCurrentRepoId()
  const dependencies = useDependencyContext()
  const modules = useSelector(e => e.modules.entities)
  const gitsById = useSelector(s => s.git.byRepoId)

  const {bootstrapModuleRepo} = useActions(moduleGitActions)
  const {syncRepoStateFromDisk} = useActions(coreGitActions)

  const {appName} = useCurrentApp()

  // Stores which repos we've already bootstrapped.
  // TODO(christoph): Add additional sophistication around managing active browser, and switching
  // clients
  const bootstrappedReposRef = React.useRef<Record<string, boolean>>({})

  const value = React.useMemo(() => {
    if (!primaryRepoId) {
      return null
    }
    const subRepoIds = new Set<string>()
    const openDependencies: Record<string, string> = {}
    const repoIdToDependencyId: Record<string, string> = {}
    const repoIdToTitle: Record<string, string> = {}
    // NOTE(pawel) If we use the multi-repo-context outside of apps, this needs updating.
    repoIdToTitle[primaryRepoId] = appName

    // NOTE(christoph): Disable multi-repo context in desktop since Hub doesn't support this.
    if (Build8.PLATFORM_TARGET !== 'desktop' && dependencies?.dependenciesByPath) {
      Object.values(dependencies.dependenciesByPath).forEach((dependency) => {
        const isOnDev = isOpenForDevelopment(
          dependency.target,
          dependencies.targetOverrides[dependency.dependencyId]
        )
        const ownModule = modules[dependency.moduleId]
        if (isOnDev && ownModule?.repoId) {
          subRepoIds.add(ownModule.repoId)
          openDependencies[dependency.dependencyId] = ownModule.repoId
          repoIdToDependencyId[ownModule.repoId] = dependency.dependencyId
          repoIdToTitle[ownModule.repoId] = dependency.alias
        }
      })
    }
    return {primaryRepoId, subRepoIds, openDependencies, repoIdToDependencyId, repoIdToTitle}
  }, [appName, primaryRepoId, dependencies, modules])

  React.useEffect(() => {
    if (!value) {
      return
    }
    Array.from(value.subRepoIds).forEach((repoId) => {
      if (!bootstrappedReposRef.current[repoId]) {
        bootstrappedReposRef.current[repoId] = true
        bootstrapModuleRepo(repoId)
      }
    })
  }, [value, bootstrapModuleRepo])

  React.useEffect(() => {
    if (!value?.subRepoIds.size) {
      return undefined
    }
    let timeout: number
    const delayRefresh = () => {
      clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        [...value.subRepoIds].forEach((repoId) => {
          syncRepoStateFromDisk(gitsById[repoId].repo)
        })
      }, 150)
    }
    window.addEventListener('focus', delayRefresh)
    return () => {
      window.removeEventListener('focus', delayRefresh)
    }
  }, [value, gitsById, syncRepoStateFromDisk])

  return <MultiRepoContext.Provider value={value}>{children}</MultiRepoContext.Provider>
}

const useMultiRepoContext = () => React.useContext(MultiRepoContext)

export {
  MultiRepoContextProvider,
  useMultiRepoContext,
}

export type {
  IMultiRepoContext,
}
