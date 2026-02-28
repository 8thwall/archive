// @inliner-off

import type {ModuleDependency} from './module-dependency'
import {MAX_DEPENDENCIES_PER_BUILD} from './module-constants'
import type {DependencyValidationData} from './load-module-dependency-access'
import {validateAccessLevel} from './validate-access-token'
import {getTargetVisibility} from './module-target-visibility'

type DependenciesById = Record<string, ModuleDependency>

type AppInfoIds = {uuid: string, AccountUuid: string}

const validateAppDependency = (
  moduleDependency: ModuleDependency, appInfo: AppInfoIds, dependencyData: DependencyValidationData
): string | null => {
  const {alias, moduleId} = moduleDependency

  if (dependencyData) {
    if (dependencyData.appUuid !== appInfo.uuid) {
      return `Access for dependency with alias [${alias}] is for another app`
    }
    if (dependencyData.accountUuid !== appInfo.AccountUuid) {
      return `Access for dependency with alias [${alias}] is for another workspace`
    }
    if (dependencyData.moduleId !== moduleId) {
      return `Access for dependency with alias [${alias}] is for another module`
    }

    const requiredLevel = getTargetVisibility(moduleDependency.target)
    if (!validateAccessLevel({data: dependencyData, requiredLevel, moduleId})) {
      return `Access for dependency with alias [${alias}] does not permit current action`
    }

    return null
  }

  return `Missing authorization to use dependency with alias [${alias}]`
}

const validateAliases = (dependencies: DependenciesById): string[] => {
  const usedOnce = new Set<string>()
  const usedTwice = new Set<string>()
  Object.values(dependencies).forEach(({alias}) => {
    if (usedOnce.has(alias)) {
      usedTwice.add(alias)
    } else {
      usedOnce.add(alias)
    }
  })
  return [...usedTwice].map(e => (
    `Alias [${e}] used by multiple dependencies, cannot rebuild until one is renamed.`
  ))
}

const validateModuleIds = (dependencies: DependenciesById): string[] => {
  const errors: string[] = []

  if (Object.keys(dependencies).length > MAX_DEPENDENCIES_PER_BUILD) {
    errors.push(
      `Exceeded limit of ${MAX_DEPENDENCIES_PER_BUILD} modules per project.`
    )
  }

  const dependenciesByModuleId: Record<string, string[]> = {}

  Object.values(dependencies).forEach(({moduleId, dependencyId}) => {
    dependenciesByModuleId[moduleId] = dependenciesByModuleId[moduleId] || []
    dependenciesByModuleId[moduleId].push(dependencyId)
  })

  Object.values(dependenciesByModuleId).forEach((dependencyIds) => {
    if (dependencyIds.length > 1) {
      errors.push(
        `Aliases [${dependencyIds.map(e => dependencies[e].alias).join(', ')}] reference the \
same module, cannot build until duplicate imports are cleaned up.`
      )
    }
  })

  return errors
}

const validateAppDependencies = (
  dependencies: DependenciesById, appInfo: AppInfoIds,
  dependencyDataById: Record<string, DependencyValidationData> = {}
) => (
  Object.values(dependencies)
    .map(md => validateAppDependency(md, appInfo, dependencyDataById[md.dependencyId]))
    .filter(Boolean)
    .concat(validateAliases(dependencies), validateModuleIds(dependencies))
)

export {
  validateAliases,
  validateAppDependency,
  validateAppDependencies,
}

export type {
  DependenciesById,
  AppInfoIds,
}
