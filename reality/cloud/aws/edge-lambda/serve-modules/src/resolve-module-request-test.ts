// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, beforeEach, assert, afterEach} from 'bzl/js/chai-js'

import {register as registerDdb} from './dynamodb'
import {resolveModuleRequest} from './resolve-module-request'

describe('resolveModuleRequest', () => {
  beforeEach(() => {
    // Default fake ddb loader
    registerDdb({
      getItem: () => Promise.resolve({
        Item: {
          buildLocation: {S: 'path/to/build'},
        },
      } as any),
    })
  })

  afterEach(() => {
    registerDdb(null)
  })

  it('Resolves to the correct location', async () => {
    assert.strictEqual(
      await resolveModuleRequest({
        moduleId: 'my-module',
        target: {'type': 'branch', 'branch': 'my-branch'},
        file: 'bundle.js',
      }),
      'path/to/build'
    )
  })
  it('Returns null for missing builds', async () => {
    registerDdb({getItem: () => Promise.resolve(null)})

    assert.strictEqual(
      await resolveModuleRequest({
        moduleId: 'my-module',
        target: {'type': 'branch', 'branch': 'my-branch'},
        file: 'bundle.js',
      }),
      null
    )
  })

  it('Requests the correct versions for pre-releases', async () => {
    const requestedTargetSks: string[] = []
    registerDdb({
      getItem: async (req) => {
        requestedTargetSks.push(req.Key.sk.S)
        const pathToReturn = req.Key.sk.S.includes(':pre:') ? 'path/to/pre-build' : 'path/to/build'
        return {
          Item: {
            patchTarget: {S: 'target:version:patch:9:4:3'},
            buildLocation: {S: pathToReturn},
          },
        } as any
      },
    })

    assert.strictEqual(
      await resolveModuleRequest({
        moduleId: 'my-module',
        target: {type: 'version', pre: true, level: 'major', major: 9, minor: 4, patch: 3},
        file: 'bundle.js',
      }),
      'path/to/build'
    )

    assert.deepEqual(
      requestedTargetSks,
      ['target:version:major:9']
    )
  })

  it('Falls back to pre-release build if not yet finalized', async () => {
    const requestedTargetSks: string[] = []
    registerDdb({
      getItem: async (req) => {
        requestedTargetSks.push(req.Key.sk.S)
        if (!req.Key.sk.S.includes(':pre:')) {
          return null
        }
        return {
          Item: {
            buildLocation: {S: 'path/to/pre-build'},
          },
        } as any
      },
    })

    assert.strictEqual(
      await resolveModuleRequest({
        moduleId: 'my-module',
        target: {type: 'version', pre: true, level: 'major', major: 9, minor: 4, patch: 3},
        file: 'bundle.js',
      }),
      'path/to/pre-build'
    )

    assert.deepEqual(
      requestedTargetSks,
      ['target:version:major:9', 'target:version:pre:patch:9:4:3']
    )
  })

  it('Ignores published version if older than requested pre-release', async () => {
    const requestedTargetSks: string[] = []
    registerDdb({
      getItem: async (req): Promise<any> => {
        requestedTargetSks.push(req.Key.sk.S)
        return req.Key.sk.S.includes(':pre:')
          ? {
            Item: {
              buildLocation: {S: 'path/to/pre-build'},
            },
          } : {
            Item: {
              patchTarget: {S: 'target:version:patch:9:4:2'},
              buildLocation: {S: 'path/to/build'},
            },
          }
      },
    })

    assert.strictEqual(
      await resolveModuleRequest({
        moduleId: 'my-module',
        target: {type: 'version', pre: true, level: 'major', major: 9, minor: 4, patch: 3},
        file: 'bundle.js',
      }),
      'path/to/pre-build'
    )

    assert.deepEqual(
      requestedTargetSks,
      ['target:version:major:9', 'target:version:pre:patch:9:4:3']
    )
  })
  it('Uses final release if newer than pre-release', async () => {
    const requestedTargetSks: string[] = []
    registerDdb({
      getItem: async (req): Promise<any> => {
        requestedTargetSks.push(req.Key.sk.S)
        return req.Key.sk.S.includes(':pre:')
          ? {
            Item: {
              buildLocation: {S: 'path/to/pre-build'},
            },
          } : {
            Item: {
              patchTarget: {S: 'target:version:patch:9:4:5'},
              buildLocation: {S: 'path/to/newer-build'},
            },
          }
      },
    })

    assert.strictEqual(
      await resolveModuleRequest({
        moduleId: 'my-module',
        target: {type: 'version', pre: true, level: 'minor', major: 9, minor: 2, patch: 2},
        file: 'bundle.js',
      }),
      'path/to/newer-build'
    )

    assert.deepEqual(
      requestedTargetSks,
      ['target:version:minor:9:2']
    )
  })
  it('Uses final release if released is at least the target pre-release version', async () => {
    const requestedTargetSks: string[] = []
    registerDdb({
      getItem: async (req): Promise<any> => {
        requestedTargetSks.push(req.Key.sk.S)
        return req.Key.sk.S.includes(':pre:')
          ? {
            Item: {
              buildLocation: {S: 'path/to/pre-build'},
            },
          } : {
            Item: {
              patchTarget: {S: 'target:version:patch:9:2:2'},
              buildLocation: {S: 'path/to/newer-build'},
            },
          }
      },
    })

    assert.strictEqual(
      await resolveModuleRequest({
        moduleId: 'my-module',
        target: {type: 'version', pre: true, level: 'minor', major: 9, minor: 2, patch: 2},
        file: 'bundle.js',
      }),
      'path/to/newer-build'
    )

    assert.deepEqual(
      requestedTargetSks,
      ['target:version:minor:9:2']
    )
  })
})
