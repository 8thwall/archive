import {scriptify} from '../html'
import type {DependenciesById} from './validate-app-dependencies'
import type {Slugs} from './load-module-target-slugs'
import {getModuleTargetParts} from './module-target'

const makeModuleSrc = (pathParts: string[], slug: string, baseDomain: string = '') => (
  `${baseDomain}/modules/v1/${pathParts.join('/')}/module.js?s=${slug}`
)

const scriptsForDependencies = (
  dependencies: DependenciesById,
  slugs: Slugs,
  headLineSpacer: string,
  baseDomain: string = ''
) => {
  if (!dependencies) {
    return ''
  }

  return `${headLineSpacer}${Object.values(dependencies).map(dependency => (
    scriptify(makeModuleSrc(
      [dependency.moduleId, ...getModuleTargetParts(dependency.target)],
      slugs[dependency.dependencyId],
      baseDomain
    ))
  )).join(headLineSpacer)}`
}

export {
  scriptsForDependencies,
}
