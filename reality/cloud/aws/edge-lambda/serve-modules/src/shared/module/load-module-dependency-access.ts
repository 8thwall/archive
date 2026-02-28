// @inliner-off

import type {DependenciesById} from './validate-app-dependencies'
import type {ModuleDependency} from './module-dependency'
import {AttributesForRaw, fromAttributes} from '../typed-attributes'
import {
  keyForModuleDependency, ModuleDependencyData, pkForDependency,
} from './module-dependency-data'
import type {DynamoDbApi} from '../dynamodb'

const MAX_CACHE_SIZE = 1000

type DependencyValidationData = Pick<
ModuleDependencyData, 'accessLevel' | 'moduleId' | 'accountUuid' | 'appUuid'
>

const createModuleDependencyLoader = (ddb: () => DynamoDbApi, tableName: string) => {
  const dependencyCache = new Map<string, DependencyValidationData>()

  const loadCachedDependencies = (dependencies: ModuleDependency[]) => {
    const cached: Record<string, DependencyValidationData> = {}

    dependencies.forEach((dependency) => {
      if (dependencyCache.has(dependency.dependencyId)) {
        cached[dependency.dependencyId] = dependencyCache.get(dependency.dependencyId)
      }
    })

    return cached
  }

  const fetchDependencyData = async (needsFetchDependencies: ModuleDependency[]) => {
    const keyToDependencyId: Record<string, string> = {}

    needsFetchDependencies.forEach((d) => {
      keyToDependencyId[pkForDependency(d.dependencyId)] = d.dependencyId
    })

    const fetchRes = await ddb().batchGetItem({
      RequestItems: {
        [tableName]: {
          Keys: needsFetchDependencies.map(d => keyForModuleDependency(d.dependencyId)),
          ProjectionExpression: 'pk,accessLevel,moduleId,accountUuid,appUuid',
        },
      },
    })

    if (Object.values(fetchRes.UnprocessedKeys).some(e => e.Keys.length)) {
      console.error('Did not fully fetch dependencies', fetchRes)
      throw new Error('Unable to load dependency data')
    }

    const dependencyDataById: Record<string, DependencyValidationData> = {}

    fetchRes.Responses[tableName]
      .map(i => fromAttributes(i as AttributesForRaw<{pk: string, } & DependencyValidationData>))
      .forEach(({pk, ...data}) => {
        const dependencyId = keyToDependencyId[pk]
        dependencyDataById[dependencyId] = data
        dependencyCache.set(dependencyId, data)
      })

    return dependencyDataById
  }

  const loadDependencyData = async (dependencies: DependenciesById) => {
    if (!dependencies) {
      return null
    }

    // Use cached slugs if present
    const dependencyDataById = loadCachedDependencies(Object.values(dependencies))

    const needsFetchDependencies = Object.values(dependencies)
      .filter(({dependencyId}) => !dependencyDataById[dependencyId])

    // If we didn't have the slug cached, see if it already exists
    if (needsFetchDependencies.length) {
      Object.assign(dependencyDataById, await fetchDependencyData(needsFetchDependencies))
    }

    if (dependencyCache.size > MAX_CACHE_SIZE) {
      dependencyCache.clear()
    }

    return dependencyDataById
  }

  const loadModuleDependencyData = async (dependencies: DependenciesById) => {
    try {
      return await loadDependencyData(dependencies)
    } catch (err) {
      console.error(err)
      // Ensure that unexpected errors are surfaced as something reasonable to show the user.
      throw new Error('Failed to load module access information.')
    }
  }

  return {
    loadModuleDependencyData,
  }
}

export {
  createModuleDependencyLoader,
}

export type {
  DependencyValidationData,
}
