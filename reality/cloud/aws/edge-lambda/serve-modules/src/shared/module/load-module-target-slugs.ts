import {v4 as uuid} from 'uuid'

import type {DependenciesById} from './validate-app-dependencies'
import type {ModuleDependency} from './module-dependency'
import {AttributesForRaw, fromAttributes, toAttributes} from '../typed-attributes'
import {pkForModule} from './module-build'
import {
  keyForPrimarySlug, keyForSlug, ModuleSlugData, skForPrimarySlug,
} from './module-slug'
import type {DynamoDbApi} from '../dynamodb'

const MAX_CACHE_SIZE = 1000

const makeCacheKey = (pk: string, sk: string) => `${pk}/${sk}`

const makeCacheKeyForDependency = (dep: ModuleDependency) => (
  makeCacheKey(pkForModule(dep.moduleId), skForPrimarySlug(dep.target))
)

type WriteItem = {
  key: AttributesForRaw<{pk: string, sk: string}>
  data: ModuleSlugData
}

type Slugs = Record<string, string>

const createModuleTargetSlugLoader = (ddb: () => DynamoDbApi, tableName: string) => {
  const slugCache = new Map<string, string>()

  const loadCachedSlugs = (dependencies: ModuleDependency[]) => {
    const cachedSlugs: Slugs = {}

    dependencies.forEach((dependency) => {
      const key = makeCacheKeyForDependency(dependency)
      if (slugCache.has(key)) {
        cachedSlugs[dependency.dependencyId] = slugCache.get(key)
      }
    })

    return cachedSlugs
  }

  const fetchSlugs = async (needsFetchDependencies: ModuleDependency[]): Promise<Slugs> => {
    const keyToDependencyId: Record<string, string> = {}

    needsFetchDependencies.forEach((d) => {
      keyToDependencyId[makeCacheKeyForDependency(d)] = d.dependencyId
    })

    const fetchRes = await ddb().batchGetItem({
      RequestItems: {
        [tableName]: {
          Keys: needsFetchDependencies.map(d => keyForPrimarySlug(d.moduleId, d.target)),
          ProjectionExpression: 'pk,sk,slug',
        },
      },
    })

    if (Object.values(fetchRes.UnprocessedKeys).some(e => e.Keys.length)) {
      console.error('Did not fully fetch slugs', fetchRes)
      throw new Error('Unable to load dependency keys')
    }

    const fetchedSlugs: Record<string, string> = {}

    fetchRes.Responses[tableName]
      .map(i => fromAttributes(i as AttributesForRaw<{pk: string, sk: string} & ModuleSlugData>))
      .forEach(({pk, sk, slug}) => {
        const key = makeCacheKey(pk, sk)
        const dependencyId = keyToDependencyId[key]
        if (!dependencyId) {
          throw new Error(`Missing dependency for key: ${key}`)
        }
        fetchedSlugs[dependencyId] = slug
        slugCache.set(key, slug)
      })

    return fetchedSlugs
  }

  const writeSlugs = async (needsCreateDependencies: ModuleDependency[]): Promise<Slugs> => {
    const chosenSlugs: Slugs = {}

    const itemsToWrite: WriteItem[] = []

    const newCacheFields: {cacheKey: string, value: string}[] = []

    needsCreateDependencies.forEach((dependency) => {
      const {moduleId, target, dependencyId} = dependency
      const slug = uuid()
      chosenSlugs[dependencyId] = slug

      newCacheFields.push({cacheKey: makeCacheKeyForDependency(dependency), value: slug})

      const data: ModuleSlugData = {slug, status: 'ACTIVE'}
      itemsToWrite.push(
        {key: keyForPrimarySlug(moduleId, target), data},
        {key: keyForSlug(moduleId, target, slug), data}
      )
    })

    // We use a transaction to ensure that all primary targets also have their secondary
    // slug saved. After a partial write, we might be in a bad state because writing the
    // primary slug without also saving the secondary slug means the validation will fail at
    // serve time.
    await ddb().transactWriteItems({
      TransactItems: itemsToWrite.map(({key, data}) => ({
        Put: {
          TableName: tableName,
          Item: {...key, ...toAttributes(data)},
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
        },
      })),
    })

    // Only write to the cache after a successful write
    newCacheFields.forEach(({cacheKey, value}) => {
      slugCache.set(cacheKey, value)
    })

    return chosenSlugs
  }

  const loadModuleTargetSlugs = async (dependencies: DependenciesById): Promise<Slugs> => {
    if (!dependencies) {
      return null
    }

    // Use cached slugs if present
    const dependencyIdToSlug = loadCachedSlugs(Object.values(dependencies))

    const unloadedDependencies = new Set(
      Object.keys(dependencies).filter(id => !dependencyIdToSlug[id])
    )

    // If we didn't have the slug cached, see if it already exists
    if (unloadedDependencies.size) {
      const needsFetchDependencies = Array.from(unloadedDependencies).map(id => dependencies[id])
      const fetchedSlugs = await fetchSlugs(needsFetchDependencies)
      Object.keys(fetchedSlugs).forEach(id => unloadedDependencies.delete(id))
      Object.assign(dependencyIdToSlug, fetchedSlugs)
    }

    // If we don't have slugs left for some targets, create them
    if (unloadedDependencies.size) {
      const needCreateDependencies = Array.from(unloadedDependencies).map(id => dependencies[id])
      Object.assign(dependencyIdToSlug, await writeSlugs(needCreateDependencies))
    }

    const loadedIds = Object.keys(dependencyIdToSlug)
    const expectedIds = Object.keys(dependencies)
    const mismatchPresent = loadedIds.length !== expectedIds.length ||
      loadedIds.some(id => !expectedIds.includes(id))
    if (mismatchPresent) {
      console.error('Mismatch between loaded slugs', {loadedIds, expectedIds})
      throw new Error('Final resolution lacks expected dependency keys')
    }

    if (slugCache.size > MAX_CACHE_SIZE) {
      slugCache.clear()
    }

    return dependencyIdToSlug
  }

  return {
    loadModuleTargetSlugs,
  }
}

export {
  createModuleTargetSlugLoader,
}

export type {
  Slugs,
}
