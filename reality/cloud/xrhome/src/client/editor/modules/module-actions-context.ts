import React from 'react'

import type {ModuleTarget} from '../../../shared/module/module-target'

interface IModuleActionsContext {
  onAliasChange: (newName: string, dependencyPath: string) => void
  onDeleteDependency: (dependencyPath: string) => void
  addDependency: (
    moduleUuid: string, target: ModuleTarget, alias: string, targetOverride?: ModuleTarget
  ) => Promise<void>
}

const ModuleActionsContext = React.createContext<IModuleActionsContext>(null)

export {
  IModuleActionsContext,
  ModuleActionsContext,
}
