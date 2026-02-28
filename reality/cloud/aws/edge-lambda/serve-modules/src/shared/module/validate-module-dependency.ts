import {isValidAlias} from './is-valid-alias'
import type {ModuleDependency} from './module-dependency'
import {isValidTarget} from './validate-module-target'

const isFilledString = (t: any) => typeof t === 'string' && t.length > 0

const isValidDependency = (dependency: ModuleDependency | any): dependency is ModuleDependency => {
  if (!dependency || typeof dependency !== 'object') {
    return false
  }

  return dependency.type === 'module' &&
         isFilledString(dependency.dependencyId) &&
         isFilledString(dependency.moduleId) &&
         isValidAlias(dependency.alias) &&
         isValidTarget(dependency.target) &&
         (dependency.accessToken === undefined || isFilledString(dependency.accessToken))
}

export {
  isValidDependency,
}
