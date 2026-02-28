import {toAttributes} from '../typed-attributes'
import type {AccessLevelType} from './dependency-token-payload'

type ModuleDependencyData = {
  version: number
  accessLevel: AccessLevelType
  moduleId: string
  accountUuid: string
  appUuid: string
  appKey: string
}

const pkForDependency = (dependencyId: string) => `dependency:${dependencyId}`

const keyForModuleDependency = (dependencyId: string) => (
  toAttributes({
    pk: pkForDependency(dependencyId),
    sk: '-',
  })
)

export {
  keyForModuleDependency,
  pkForDependency,
}

export type {
  ModuleDependencyData,
}
