// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {v4 as uuid} from 'uuid'

// @inliner-skip-next
import type {DependencyValidationData} from './load-module-dependency-access'
import type {ModuleDependency} from './module-dependency'
import {validateAppDependencies, AppInfoIds} from './validate-app-dependencies'

describe('validateAppDependencies', () => {
  const moduleUuid = uuid()
  const testApp = {uuid: uuid(), AccountUuid: uuid()} as AppInfoIds

  const accessDataBase: DependencyValidationData = {
    accessLevel: 'owned',
    moduleId: moduleUuid,
    appUuid: testApp.uuid,
    accountUuid: testApp.AccountUuid,
  }

  const DEFAULT_DEPENDENCY: ModuleDependency = {
    type: 'module',
    target: {type: 'branch', branch: 'master'},
    dependencyId: 'example',
    moduleId: moduleUuid,
    alias: 'example',
  } as const

  const makeAuth = (deps: Record<string, ModuleDependency>) => (
    Object.fromEntries(Object.values(deps).map((dep): [string, DependencyValidationData] => [
      dep.dependencyId,
      {
        ...accessDataBase,
        moduleId: dep.moduleId,
      },
    ]))
  )

  const makeDependency = (baseDep: Partial<ModuleDependency>): ModuleDependency => ({
    ...DEFAULT_DEPENDENCY,
    ...baseDep,
  })

  it('Rejects valid dependency with token', async () => {
    const token = 'not-a-valid-token'

    const testDep = {
      type: 'module',
      dependencyId: uuid(),
      moduleId: moduleUuid,
      accessToken: token,
      alias: uuid(),
      target: {
        type: 'branch',
        branch: 'master',
      },
    } as ModuleDependency

    const res = validateAppDependencies({[testDep.dependencyId]: testDep}, testApp)
    assert.equal(res.length, 1)
    assert.isNotEmpty(res[0])
  })

  it('Pass valid dependency with database auth', async () => {
    const deps = {
      dep1: makeDependency({dependencyId: 'dep1', alias: 'alias1', moduleId: uuid()}),
    }
    const res = validateAppDependencies(deps, testApp, makeAuth(deps))
    assert.equal(res.length, 0)
  })

  it('Pass valid alias combination', () => {
    const deps = {
      dep1: makeDependency({dependencyId: 'dep1', alias: 'alias1', moduleId: uuid()}),
      dep2: makeDependency({dependencyId: 'dep2', alias: 'alias2', moduleId: uuid()}),
    }
    const res = validateAppDependencies(deps, testApp, makeAuth(deps))
    assert.equal(res.length, 0)
  })

  it('Pass valid set of 10 dependencies', () => {
    const deps = Object.fromEntries(Array.from({length: 10}).map((_, i) => {
      const id = `dep${i}`
      return [id, makeDependency({dependencyId: id, alias: id, moduleId: id})]
    }))
    const res = validateAppDependencies(deps, testApp, makeAuth(deps))
    assert.equal(res.length, 0)
  })

  it('Fail with alias collision', () => {
    const deps = {
      dep1: makeDependency({dependencyId: 'dep1', alias: 'same', moduleId: uuid()}),
      dep2: makeDependency({dependencyId: 'dep2', alias: 'same', moduleId: uuid()}),
      dep3: makeDependency({dependencyId: 'dep3', alias: 'same', moduleId: uuid()}),
    }
    const res = validateAppDependencies(deps, testApp, makeAuth(deps))
    assert.equal(res.length, 1)
    assert.isNotEmpty(res[0])
  })

  it('Fail with an error for each alias collision', () => {
    const deps = {
      dep1: makeDependency({dependencyId: 'dep1', alias: 'same', moduleId: uuid()}),
      dep2: makeDependency({dependencyId: 'dep2', alias: 'same', moduleId: uuid()}),
      dep3: makeDependency({dependencyId: 'dep3', alias: 'other', moduleId: uuid()}),
      dep4: makeDependency({dependencyId: 'dep4', alias: 'other', moduleId: uuid()}),
    }

    const res = validateAppDependencies(deps, testApp, makeAuth(deps))
    assert.equal(res.length, 2)
    assert.isNotEmpty(res[0])
    assert.isNotEmpty(res[1])
  })

  it('Fail with 11 dependencies', () => {
    const deps = Object.fromEntries(Array.from({length: 11}).map((_, i) => {
      const id = `dep${i}`
      return [id, makeDependency({dependencyId: id, alias: id, moduleId: id})]
    }))
    const res = validateAppDependencies(deps, testApp, makeAuth(deps))
    assert.equal(res.length, 1)
    assert.isNotEmpty(res[0])
  })

  it('Fail with multiple import of modules', () => {
    const module1 = uuid()
    const module2 = uuid()

    const deps = {
      dep1: makeDependency({dependencyId: 'dep1', alias: 'alias1', moduleId: module1}),
      dep2: makeDependency({dependencyId: 'dep2', alias: 'alias2', moduleId: module1}),
      dep3: makeDependency({dependencyId: 'dep3', alias: 'alias3', moduleId: module1}),
      dep4: makeDependency({dependencyId: 'dep4', alias: 'alias4', moduleId: module2}),
      dep5: makeDependency({dependencyId: 'dep5', alias: 'alias5', moduleId: module2}),
    }
    const res = validateAppDependencies(deps, testApp, makeAuth(deps))
    assert.equal(res.length, 2)
    assert.isNotEmpty(res[0])
    assert.isNotEmpty(res[1])
  })

  it('Fail with database auth appUuid mismatch', async () => {
    const deps = {
      dep1: makeDependency({dependencyId: 'dep1', alias: 'alias1', moduleId: uuid()}),
    }
    const auth = makeAuth(deps)
    auth[deps.dep1.dependencyId].appUuid = uuid()

    const res = validateAppDependencies(deps, testApp, auth)
    assert.equal(res.length, 1)
    assert.isNotEmpty(res[0])
  })

  it('Fail with database auth accountUuid mismatch', async () => {
    const deps = {
      dep1: makeDependency({dependencyId: 'dep1', alias: 'alias1', moduleId: uuid()}),
    }
    const auth = makeAuth(deps)
    auth[deps.dep1.dependencyId].accountUuid = uuid()

    const res = validateAppDependencies(deps, testApp, auth)
    assert.equal(res.length, 1)
    assert.isNotEmpty(res[0])
  })

  it('Fail with database auth not owned', async () => {
    const deps = {
      dep1: makeDependency({dependencyId: 'dep1', alias: 'alias1', moduleId: uuid()}),
    }
    const auth = makeAuth(deps)
    auth[deps.dep1.dependencyId].accessLevel = 'public'

    const res = validateAppDependencies(deps, testApp, auth)
    assert.equal(res.length, 1)
    assert.isNotEmpty(res[0])
  })

  it('Fail with database auth moduleId mismatch', async () => {
    const deps = {
      dep1: makeDependency({dependencyId: 'dep1', alias: 'alias1', moduleId: uuid()}),
    }
    const auth = makeAuth(deps)
    auth[deps.dep1.dependencyId].moduleId = uuid()

    const res = validateAppDependencies(deps, testApp, auth)
    assert.equal(res.length, 1)
    assert.isNotEmpty(res[0])
  })

  it('Fail with disallowed target for current access level', async () => {
    const deps = {
      dep1: makeDependency({dependencyId: 'dep1', alias: 'alias1', moduleId: uuid()}),
    }
    const auth = makeAuth(deps)
    auth[deps.dep1.dependencyId].accessLevel = 'public'

    const res = validateAppDependencies(deps, testApp, auth)
    assert.equal(res.length, 1)
    assert.isNotEmpty(res[0])
  })
})
