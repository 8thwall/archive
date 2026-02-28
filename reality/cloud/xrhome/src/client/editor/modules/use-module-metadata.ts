import React from 'react'

import useActions from '../../common/use-actions'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'
import dependencyActions, {ModuleDependencyMetadata} from '../dependency-actions'
import type {ModuleDependency} from '../../../shared/module/module-dependency'

type LoadState = {
  status: 'loading' | 'loaded' | 'error'
  moduleId: string
  metadata?: ModuleDependencyMetadata
  message?: string
}

// NOTE(christoph): Passing a null dependency is allowed if the dependency is invalid.
const useModuleMetadata = (dependency: ModuleDependency | null) => {
  const {fetchModuleMetadata} = useActions(dependencyActions)

  const fetchModuleMetadataAbandonable = useAbandonableFunction(fetchModuleMetadata)

  const [loadState, setLoadState] = React.useState<LoadState>(null)

  const moduleId = dependency?.moduleId

  const hasApplicableLoadState = loadState && moduleId && moduleId === loadState.moduleId

  React.useEffect(() => {
    if (hasApplicableLoadState) {
      return
    }
    if (!moduleId) {
      return
    }

    setLoadState({status: 'loading', moduleId})

    ;(async () => {
      try {
        const metadata = await fetchModuleMetadataAbandonable(dependency)
        setLoadState({status: 'loaded', moduleId, metadata})
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        setLoadState({status: 'error', moduleId})
      }
    })()
  })

  if (hasApplicableLoadState) {
    return loadState
  } else {
    return {status: 'loading' as const}
  }
}

export {
  useModuleMetadata,
}
