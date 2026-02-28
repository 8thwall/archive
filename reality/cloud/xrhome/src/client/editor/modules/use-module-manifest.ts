import React from 'react'
import type {DeepReadonly} from 'ts-essentials'

import type {ModuleManifest} from '../../../shared/module/module-manifest'
import type {ModuleTarget} from '../../../shared/module/module-target'
import useActions from '../../common/use-actions'
import dependencyActions from '../dependency-actions'
import {
  moduleTargetsEqual, moduleTargetsPartiallyEqual,
} from '../../../shared/module/compare-module-target'
import type {ModuleDependency} from '../../../shared/module/module-dependency'
import {useMultiRepoContext} from '../multi-repo-context'
import {MANIFEST_FILE_PATH, README_FILE_PATH} from '../../common/editor-files'
import {useScopedGit} from '../../git/hooks/use-current-git'
import {getMarkdownContent} from '../get-markdown-content'

type LoadState = {
  status: 'loaded' | 'error' | 'missing'
  moduleId: string
  target: ModuleTarget
  manifest?: ModuleManifest
  message?: string
  readme?: string
}

type CurrentLoad = {
  moduleId: string
  target: ModuleTarget
}

type Result = LoadState | {status: 'loading'}

// NOTE(christoph): Passing a null dependency is allowed if the dependency is invalid.
const useModuleManifest = (
  dependency: DeepReadonly<ModuleDependency> | null,
  inDevelopment: boolean
): Result => {
  const {fetchModuleManifest} = useActions(dependencyActions)

  const [loadState, setLoadState] = React.useState<LoadState>(null)
  const [currentLoad, setCurrentLoad] = React.useState<CurrentLoad>(null)
  const multiRepoContext = useMultiRepoContext()

  const moduleId = dependency?.moduleId
  const target = dependency?.target
  const dependencyId = dependency?.dependencyId

  const devRepoId = inDevelopment && multiRepoContext?.openDependencies[dependencyId]
  const scopedGit = useScopedGit(devRepoId)
  const devManifest = scopedGit?.filesByPath[MANIFEST_FILE_PATH]?.content
  const devReadme = scopedGit?.filesByPath[README_FILE_PATH]?.content

  const hasApplicableLoadState = loadState && target && moduleId &&
                                 moduleId === loadState.moduleId &&
                                 moduleTargetsPartiallyEqual(loadState.target, target)

  const loadCounter = React.useRef(0)

  React.useEffect(() => {
    if (!moduleId || !target || devRepoId) {
      return
    }
    const alreadyLoading = currentLoad &&
      currentLoad.moduleId === moduleId &&
      moduleTargetsEqual(currentLoad.target, target)

    if (alreadyLoading) {
      return
    }

    const expectedLoadCounter = ++loadCounter.current
    setCurrentLoad({moduleId, target})

    ;(async () => {
      try {
        const {manifest, readme} = await fetchModuleManifest({
          moduleId, target, dependencyId,
        })
        if (expectedLoadCounter === loadCounter.current) {
          setLoadState({status: 'loaded', moduleId, target, manifest, readme})
        }
      } catch (err) {
        if (err.status === 404) {
          if (expectedLoadCounter === loadCounter.current) {
            setLoadState({status: 'missing', moduleId, target})
          }
          return
        }
        // eslint-disable-next-line no-console
        console.error(err)
        if (expectedLoadCounter === loadCounter.current) {
          setLoadState({status: 'error', moduleId, target})
        }
      }
    })()
  })

  // Abandon last load on unmount.
  React.useEffect(() => () => {
    loadCounter.current = -1
  }, [])

  const devManifestState: LoadState = React.useMemo(() => {
    if (devManifest) {
      try {
        const manifest = JSON.parse(devManifest)
        const readme = devReadme && getMarkdownContent(scopedGit.filesByPath, devReadme)
        return {status: 'loaded', moduleId, target, manifest, readme}
      } catch {
        return {status: 'error', moduleId, target, message: 'Invalid manifest.json'}
      }
    } else {
      return null
    }
  }, [devManifest, devReadme])

  if (devManifestState) {
    return devManifestState
  } else if (hasApplicableLoadState) {
    return loadState
  } else {
    return {status: 'loading' as const}
  }
}

export {
  useModuleManifest,
}
