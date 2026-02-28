// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'
import {randomUUID as uuid} from 'crypto'

import type {ModuleDependency, ResourceConfigValue} from './module-dependency'
import {mergeDependencySets} from './merge-dependency-sets'

const makeDependency = (): ModuleDependency => ({
  type: 'module',
  dependencyId: uuid(),
  moduleId: uuid(),
  alias: 'example',
  target: {type: 'version', level: 'major', major: 3},
  config: {},
})

const makeSet = (...deps: ModuleDependency[]) => deps.reduce((acc, dep) => {
  acc[dep.dependencyId] = dep
  return acc
}, {})

describe('mergeDependencySets', () => {
  it('Leaves everything the same if nothing changed', () => {
    const originalDependency = makeDependency()
    const original = makeSet(originalDependency)
    const yours = makeSet(originalDependency)
    const theirs = makeSet(originalDependency)

    assert.deepEqual(mergeDependencySets(original, yours, theirs), original)
  })

  describe('Adding dependencies', () => {
    it('Preserves dependencies added by them', () => {
      const originalDependency = makeDependency()
      const newDependency = makeDependency()
      const original = makeSet(originalDependency)
      const yours = makeSet(originalDependency)
      const theirs = makeSet(originalDependency, newDependency)

      assert.deepEqual(mergeDependencySets(original, yours, theirs), theirs)
    })

    it('Preserves dependencies added by us', () => {
      const originalDependency = makeDependency()
      const newDependency = makeDependency()
      const original = makeSet(originalDependency)
      const yours = makeSet(originalDependency, newDependency)
      const theirs = makeSet(originalDependency)

      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })

    it('Combines states when dependency is added by both', () => {
      const dep1 = makeDependency()
      const original = makeSet()
      const yours = makeSet({...dep1, alias: 'my-alias', config: {config1: 42}})
      const theirs = makeSet({...dep1, alias: 'their-alias', config: {config2: false}})
      const dep1After = {...dep1, alias: 'my-alias', config: {config1: 42, config2: false}}
      const final = makeSet(dep1After)
      assert.deepEqual(mergeDependencySets(original, yours, theirs), final)
    })
  })

  describe('Removing dependencies', () => {
    it('Removes dependencies removed by them', () => {
      const dep1 = makeDependency()
      const dep2 = makeDependency()
      const original = makeSet(dep1, dep2)
      const yours = makeSet(dep1, dep2)
      const theirs = makeSet(dep1)
      assert.deepEqual(mergeDependencySets(original, yours, theirs), theirs)
    })

    it('Removes dependencies removed by us', () => {
      const dep1 = makeDependency()
      const dep2 = makeDependency()
      const original = makeSet(dep1, dep2)
      const yours = makeSet(dep1)
      const theirs = makeSet(dep1, dep2)
      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })

    it('Removes dependencies removed by both', () => {
      const dep1 = makeDependency()
      const dep2 = makeDependency()
      const original = makeSet(dep1, dep2)
      const yours = makeSet(dep1)
      const theirs = makeSet(dep1)
      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })

    it('Removes dependencies removed by both', () => {
      const dep1 = makeDependency()
      const dep2 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet()
      const theirs = makeSet(dep1, dep2)
      const final = makeSet(dep2)
      assert.deepEqual(mergeDependencySets(original, yours, theirs), final)
    })

    it('Removes dependencies removed by them, even if I made changes', () => {
      const dep1 = makeDependency()
      const dep2 = makeDependency()
      const original = makeSet(dep1, dep2)
      const yours = makeSet(dep1, {...dep2, config: {myConfig: true}})
      const theirs = makeSet(dep1)
      assert.deepEqual(mergeDependencySets(original, yours, theirs), theirs)
    })
  })

  describe('Updating config values', () => {
    it('Preserves config updates made by us', () => {
      const dep1 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet({...dep1, config: {config: true}})
      const theirs = makeSet(dep1)
      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })

    it('Preserves config updates made by them', () => {
      const dep1 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet(dep1)
      const theirs = makeSet({...dep1, config: {config: true}})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), theirs)
    })

    it('Prefers our changes when both made changes', () => {
      const dep1 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet({...dep1, config: {field: true}})
      const theirs = makeSet({...dep1, config: {field: false}})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })

    it('Merges multiple config changes into one', () => {
      const dep1 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet({...dep1, config: {a: true, both: 42}})
      const theirs = makeSet({...dep1, config: {b: false, both: 25}})
      const final = makeSet({...dep1, config: {a: true, b: false, both: 42}})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), final)
    })

    it('Merges multiple config changes into one', () => {
      const dep1 = makeDependency()
      const originalConfig = {a: 1, b: 2, c: 3}
      const yoursConfig = {a: 1, b: 4, c: 5}
      const theirsConfig = {a: 1, b: 6, d: 7}
      const finalConfig = {a: 1, b: 4, c: 5, d: 7}
      const original = makeSet({...dep1, config: originalConfig})
      const yours = makeSet({...dep1, config: yoursConfig})
      const theirs = makeSet({...dep1, config: theirsConfig})
      const final = makeSet({...dep1, config: finalConfig})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), final)
    })

    it('Can delete config fields', () => {
      const dep1 = makeDependency()
      const original = makeSet({...dep1, config: {config1: true, deleteMe: 42}})
      const yours = makeSet({...dep1, config: {config1: false, config2: true}})
      const theirs = original
      const final = makeSet({...dep1, config: {config1: false, config2: true}})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), final)
    })

    it('Properly handles asset resources when we change it', () => {
      const dep1 = makeDependency()
      // Creating unique object references here to prevent reference comparison
      const asset1: ResourceConfigValue = {type: 'asset', asset: 'original-asset.png'}
      const asset2: ResourceConfigValue = {type: 'asset', asset: 'new-asset.png'}
      const asset3: ResourceConfigValue = {type: 'asset', asset: 'original-asset.png'}

      const original = makeSet({...dep1, config: {asset: asset1}})
      const yours = makeSet({...dep1, config: {asset: asset2}})
      const theirs = makeSet({...dep1, config: {asset: asset3}})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })

    it('Properly handles asset resources when they change it', () => {
      const dep1 = makeDependency()
      // Creating unique object references here to prevent reference comparison
      const asset1: ResourceConfigValue = {type: 'asset', asset: 'original-asset.png'}
      const asset2: ResourceConfigValue = {type: 'asset', asset: 'original-asset.png'}
      const asset3: ResourceConfigValue = {type: 'asset', asset: 'other-asset.png'}

      const original = makeSet({...dep1, config: {asset: asset1}})
      const yours = makeSet({...dep1, config: {asset: asset2}})
      const theirs = makeSet({...dep1, config: {asset: asset3}})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), theirs)
    })

    it('Properly handles asset resources we both change it', () => {
      const dep1 = makeDependency()
      // Creating unique object references here to prevent reference comparison
      const asset1: ResourceConfigValue = {type: 'asset', asset: 'original-asset.png'}
      const asset2: ResourceConfigValue = {type: 'asset', asset: 'new-asset.png'}
      const asset3: ResourceConfigValue = {type: 'asset', asset: 'other-asset.png'}

      const original = makeSet({...dep1, config: {asset: asset1}})
      const yours = makeSet({...dep1, config: {asset: asset2}})
      const theirs = makeSet({...dep1, config: {asset: asset3}})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })

    it('Properly handles falsy config values', () => {
      const dep1 = makeDependency()
      const original = makeSet({...dep1, config: {a: 0}})
      const yours = makeSet({...dep1, config: {a: false, b: null as any, c: false, d: undefined}})
      const theirs = makeSet({...dep1, config: {a: true, b: 'blah', c: true, d: true}})
      const final = makeSet({...dep1, config: {a: false, b: null as any, c: false, d: true}})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), final)
    })
  })

  describe('Updating alias', () => {
    it('Handles alias update by us', () => {
      const dep1 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet({...dep1, alias: 'youralias'})
      const theirs = makeSet(dep1)
      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })

    it('Preserves alias updates made by them', () => {
      const dep1 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet(dep1)
      const theirs = makeSet({...dep1, alias: 'theiralias'})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), theirs)
    })

    it('Prefers our alias when both changed it', () => {
      const dep1 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet({...dep1, alias: 'youralias'})
      const theirs = makeSet({...dep1, alias: 'theiralias'})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })
  })

  describe('Updating target', () => {
    it('Handles target update by us', () => {
      const dep1 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet({...dep1, target: {type: 'branch', branch: 'master'}})
      const theirs = makeSet(dep1)
      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })

    it('Handles target update by them', () => {
      const dep1 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet(dep1)
      const theirs = makeSet({...dep1, target: {type: 'branch', branch: 'master'}})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), theirs)
    })

    it('Prefers our target when both changed it', () => {
      const dep1 = makeDependency()
      const original = makeSet(dep1)
      const yours = makeSet({...dep1, target: {type: 'branch', branch: 'master1'}})
      const theirs = makeSet({...dep1, target: {type: 'branch', branch: 'master2'}})
      assert.deepEqual(mergeDependencySets(original, yours, theirs), yours)
    })
  })

  it('Handles complex updates', () => {
    const dep1 = makeDependency()
    const dep2 = makeDependency()
    const dep3 = makeDependency()
    const dep4 = makeDependency()
    const dep5 = makeDependency()
    const dep6 = makeDependency()

    const dep2WithChanges = {...dep2, config: {update: 42}}
    const dep3WithChanges = {...dep3, config: {update: 43}}
    const dep4WithChanges = {...dep4, alias: 'myalias'}

    const original = makeSet(dep1, dep2, dep3, dep4)
    const yours = makeSet(dep1, dep2WithChanges, dep4, dep5)
    const theirs = makeSet(dep1, dep2, dep3WithChanges, dep4WithChanges, dep6)
    const final = makeSet(dep1, dep2WithChanges, dep4WithChanges, dep5, dep6)
    assert.deepEqual(mergeDependencySets(original, yours, theirs), final)
  })
})
