import React from 'react'

import {useGitRepo} from '../git/hooks/use-current-git'
import coreGitActions from '../git/core-git-actions'
import type {ModuleDependency} from '../../shared/module/module-dependency'
import type {ModuleTarget} from '../../shared/module/module-target'
import useActions from '../common/use-actions'

type LoadState = {
  status: 'loaded' | 'error'
  dependencyPath: string
  target?: ModuleTarget
}

type CurrentLoad = {
  dependencyPath: string
}

type Result = LoadState | {status: 'loading'}

const useForkTarget = (dependencyPath: string | undefined): Result => {
  const {inspectFiles} = useActions(coreGitActions)
  const repo = useGitRepo()

  const [loadState, setLoadState] = React.useState<LoadState>(null)
  const [currentLoad, setCurrentLoad] = React.useState<CurrentLoad>(null)

  const hasApplicableLoadState = loadState && dependencyPath &&
                                 dependencyPath === loadState.dependencyPath

  const loadCounter = React.useRef(0)

  React.useEffect(() => {
    if (!dependencyPath) {
      return
    }
    const alreadyLoading = currentLoad && currentLoad.dependencyPath === dependencyPath

    if (alreadyLoading) {
      return
    }

    const expectedLoadCounter = ++loadCounter.current
    setCurrentLoad({dependencyPath})
    const maybeSaveState = (state: LoadState) => {
      if (expectedLoadCounter === loadCounter.current) {
        setLoadState(state)
      }
    }

    ;(async () => {
      try {
        const forkFiles = await inspectFiles(repo, {
          inspectPoint: 'FORK',
          // TODO(christoph): Switch to specific path
          inspectRegex: '\\.dependencies/.*',
        })
        const dependencyFile = forkFiles.find(file => file.path === dependencyPath)
        if (dependencyFile) {
          try {
            const fileDep: ModuleDependency = JSON.parse(dependencyFile.contents)
            maybeSaveState({status: 'loaded', dependencyPath, target: fileDep.target})
            return
          } catch {
            // Ignore
          }
        }
        maybeSaveState({status: 'loaded', dependencyPath})
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        maybeSaveState({status: 'error', dependencyPath})
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
  useForkTarget,
}
