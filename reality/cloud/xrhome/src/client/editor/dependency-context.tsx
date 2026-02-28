import React from 'react'
import type {DeepReadonly, DeepWritable} from 'ts-essentials'

import type {ModuleDependency} from '../../shared/module/module-dependency'
import type {ModuleOverrideSettings} from '../../shared/module/module-override-settings'
import type {ModuleTarget} from '../../shared/module/module-target'

import {CLIENT_FILE_PATH, DEPENDENCY_FOLDER} from '../common/editor-files'
import {useCurrentGit} from '../git/hooks/use-current-git'

type IDependencyContext = DeepReadonly<{
  moduleIdToAlias: Record<string, string>
  dependenciesByPath: Record<string, ModuleDependency>
  targetOverrides: Record<string, ModuleTarget>
  dependencyIdToPath: Record<string, string>
  aliasToPath: Record<string, string>
}>

const DependencyContext = React.createContext<IDependencyContext | null>(null)

const DependencyContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const filesByPath = useCurrentGit(s => s.filesByPath)
  const dependencyFilePaths = useCurrentGit(s => s.childrenByPath[DEPENDENCY_FOLDER])
  const clientFile = useCurrentGit(s => s.filesByPath[CLIENT_FILE_PATH]?.content)

  const value = React.useMemo(() => {
    const context: DeepWritable<IDependencyContext> = {
      moduleIdToAlias: {},
      dependenciesByPath: {},
      targetOverrides: {},
      dependencyIdToPath: {},
      aliasToPath: {},
    }

    if (clientFile) {
      try {
        const overrideSettings = (JSON.parse(clientFile) as ModuleOverrideSettings)
        context.targetOverrides = overrideSettings.moduleTargetOverrides || {}
      } catch (err) {
        // Ignore
      }
    }

    if (dependencyFilePaths) {
      dependencyFilePaths.forEach((dependencyPath) => {
        try {
          const dependency: ModuleDependency = JSON.parse(filesByPath[dependencyPath].content)
          context.dependenciesByPath[dependencyPath] = dependency
          context.moduleIdToAlias[dependency.moduleId] = dependency.alias
          context.dependencyIdToPath[dependency.dependencyId] = dependencyPath
          context.aliasToPath[dependency.alias] = dependencyPath
        } catch (err) {
          // Ignore
        }
      })
    }
    return context
  }, [filesByPath, dependencyFilePaths, clientFile])

  return <DependencyContext.Provider value={value}>{children}</DependencyContext.Provider>
}

const useDependencyContext = () => React.useContext(DependencyContext)

export {
  DependencyContext,
  DependencyContextProvider,
  useDependencyContext,
}

export type {
  IDependencyContext,
}
