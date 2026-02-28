import {describe, it} from 'mocha'
import {assert} from 'chai'

import {getEditorFileRoute} from '../src/client/editor/editor-route'
import type {IAccount} from '../src/client/common/types/models'

describe('Editor Route Match - getEditorFileRoute', () => {
  const app = {appName: 'tri-app', hostingType: 'CLOUD_EDITOR' as const}
  const file = 'a/b/c/test.js'
  const dependency = '.dependencies/tri-dep/manifest.js'
  describe('when the account is a string', () => {
    it('getEditorFileRoute return a file path', () => {
      assert.equal(getEditorFileRoute('tri', app, file), '/tri/tri-app/files/a/b/c/test.js')
    })

    it('getEditorFileRoute return a dependency path', () => {
      assert.equal(getEditorFileRoute('tri', app, dependency), '/tri/tri-app/modules/manifest')
    })
  })

  describe('when the account is an IAccount', () => {
    const account = {shortName: 'tri'} as IAccount
    it('getEditorFileRoute return a file path', () => {
      assert.equal(getEditorFileRoute(account, app, file), '/tri/tri-app/files/a/b/c/test.js')
    })

    it('getEditorFileRoute return a dependency path', () => {
      assert.equal(getEditorFileRoute(account, app, dependency), '/tri/tri-app/modules/manifest')
    })
  })

  describe('when a member account is provided', () => {
    const member = {shortName: 'tri'} as IAccount
    it('getEditorFileRoute return a file path', () => {
      assert.equal(getEditorFileRoute({member}, app, file), '/tri/tri-app/files/a/b/c/test.js')
    })

    it('getEditorFileRoute return a dependency path', () => {
      assert.equal(getEditorFileRoute({member}, app, dependency), '/tri/tri-app/modules/manifest')
    })
    it('Returns the correct path for a module file within a project', () => {
      assert.strictEqual(
        getEditorFileRoute({member}, app, {moduleAlias: 'my-module', filePath: 'my-file.ts'}),
        '/tri/tri-app/modules/my-module/files/my-file.ts'
      )
    })

    describe('with an external account', () => {
      const external = {shortName: 'ghost'} as IAccount
      it('getEditorFileRoute return a file path', () => {
        assert.equal(
          getEditorFileRoute({member, external}, app, file),
          '/tri/external/ghost/tri-app/files/a/b/c/test.js'
        )
      })

      it('getEditorFileRoute return a dependency path', () => {
        assert.equal(
          getEditorFileRoute({member, external}, app, dependency),
          '/tri/external/ghost/tri-app/modules/manifest'
        )
      })
      it('Returns the correct path for a module file within a project', () => {
        assert.strictEqual(
          getEditorFileRoute(
            {member, external}, app, {moduleAlias: 'my-module', filePath: 'my-file.ts'}
          ),
          '/tri/external/ghost/tri-app/modules/my-module/files/my-file.ts'
        )
      })
    })
  })
})
