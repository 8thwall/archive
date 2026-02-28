import React from 'react'

import {useGitRepo} from '../git/hooks/use-current-git'
import coreGitActions from '../git/core-git-actions'
import type {ModuleDependency} from '../../shared/module/module-dependency'
import useActions from '../common/use-actions'
import {isUnsafeModuleTarget} from '../../shared/module/unsafe-module-target'
import {isSameBaseVersion} from '../../shared/module/compare-module-target'
import type {ModuleVersionTarget} from '../../shared/module/module-target'
import dependencyActions from './dependency-actions'

type LoadState = {
  status: 'loaded' | 'error'
  commitId?: string
  aliases?: string[]
}

type CurrentLoad = {
  commitId: string
}

type Result = LoadState | {status: 'loading'}

const useUnsafeTargets = (commitId: string): Result => {
  const {inspectFiles} = useActions(coreGitActions)
  const repo = useGitRepo()

  const [loadState, setLoadState] = React.useState<LoadState>(null)
  const [currentLoad, setCurrentLoad] = React.useState<CurrentLoad>(null)

  const hasApplicableLoadState = loadState && commitId &&
  commitId === loadState.commitId

  const loadCounter = React.useRef(0)

  const {fetchModuleTargets} = useActions(dependencyActions)

  const isVersionFinalized = async (dependency: ModuleDependency, target: ModuleVersionTarget) => {
    const res = await fetchModuleTargets.bind(dependency.dependencyId)
    return res.versions.some(version => isSameBaseVersion(target, version.patchTarget))
  }

  React.useEffect(() => {
    if (!commitId) {
      return
    }
    const alreadyLoading = currentLoad &&
      currentLoad.commitId === commitId

    if (alreadyLoading) {
      return
    }

    const expectedLoadCounter = ++loadCounter.current
    setCurrentLoad({commitId})

    ;(async () => {
      try {
        const commitFiles = await inspectFiles(repo, {
          inspectPoint: commitId,
          inspectRegex: '\\.dependencies/.*',
        })
        const aliases = []
        await Promise.all(commitFiles.map(async (file) => {
          try {
            const fileDep: ModuleDependency = JSON.parse(file.contents)
            const isUnsafe = await isUnsafeModuleTarget(
              fileDep.target, isVersionFinalized.bind(null, fileDep)
            )
            if (isUnsafe) {
              aliases.push(fileDep.alias)
            }
          } catch {
            // ignore
          }
        }))
        if (expectedLoadCounter === loadCounter.current) {
          setLoadState({status: 'loaded', commitId, aliases})
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        if (expectedLoadCounter === loadCounter.current) {
          setLoadState({status: 'error', commitId})
        }
      }
    })()
  })

  // Abandon last load on unmount.
  React.useEffect(() => () => {
    loadCounter.current = -1
  }, [])

  if (hasApplicableLoadState) {
    return loadState
  } else {
    return {status: 'loading' as const}
  }
}

export {
  useUnsafeTargets,
}
