import {describe, it} from 'mocha'
import {assert} from 'chai'

import {
  editorRouteMatchEqual, getEditorFileRoute, parseEditorRouteParams,
} from '../src/client/editor/editor-route'
import {AppPathEnum} from '../src/client/common/paths'
import type {IAccount, IApp} from '../src/client/common/types/models'

describe('parseEditorRouteParams', () => {
  it('Returns the correct file for a file path', () => {
    assert.strictEqual(parseEditorRouteParams({
      account: 'testAccount',
      routeAppName: 'testApp',
      editorPrefix: AppPathEnum.files,
      editorSuffix: 'my-file.ts',
    }), 'my-file.ts')
  })
  it('Returns the correct file for a scoped file path', () => {
    assert.strictEqual(parseEditorRouteParams({
      account: 'testAccount',
      routeAppName: 'testApp',
      editorPrefix: AppPathEnum.files,
      editorSuffix: 'path/to/my-file.ts',
    }), 'path/to/my-file.ts')
  })
  it('Returns a dependency path for a module alias', () => {
    assert.deepEqual(parseEditorRouteParams({
      account: 'testAccount',
      routeAppName: 'testApp',
      editorPrefix: AppPathEnum.modules,
      editorSuffix: 'my-alias',
    } as const), {
      isDependencyFile: true,
      moduleAlias: 'my-alias',
    })
  })

  it('Returns a module file path for a module file', () => {
    assert.deepEqual(parseEditorRouteParams({
      account: 'testAccount',
      routeAppName: 'testApp',
      editorPrefix: AppPathEnum.modules,
      editorSuffix: 'my-alias/files/path/to/my-file.js',
    } as const), {moduleAlias: 'my-alias', filePath: 'path/to/my-file.js'})
  })
})

const ACCOUNT = {shortName: 'myaccount'} as IAccount
const APP = {appName: 'my-app'} as IApp

describe('getEditorFileRoute', () => {
  it('Returns the correct path for an editor file', () => {
    assert.strictEqual(
      getEditorFileRoute(ACCOUNT, APP, 'my-file.ts'),
      '/myaccount/my-app/files/my-file.ts'
    )
  })
  it('Returns the correct path for a scoped editor file', () => {
    assert.strictEqual(
      getEditorFileRoute(ACCOUNT, APP, 'path/to/my-file.ts'),
      '/myaccount/my-app/files/path/to/my-file.ts'
    )
  })
  it('Returns the correct path for a dependency file', () => {
    assert.strictEqual(
      getEditorFileRoute(ACCOUNT, APP, '.dependencies/my-alias.json'),
      '/myaccount/my-app/modules/my-alias'
    )
  })
  it('Returns the correct path for a module file within a project', () => {
    assert.strictEqual(
      getEditorFileRoute(ACCOUNT, APP, {moduleAlias: 'my-alias', filePath: 'my-file.ts'}),
      '/myaccount/my-app/modules/my-alias/files/my-file.ts'
    )
  })
  it('Returns the correct path for a project file with alias excluded ', () => {
    assert.strictEqual(
      getEditorFileRoute(ACCOUNT, APP, {moduleAlias: null, filePath: 'my-file.ts'}),
      '/myaccount/my-app/files/my-file.ts'
    )
  })
})

describe('editorRouteMatchEqual', () => {
  it('Returns true for equal paths', () => {
    assert.isTrue(editorRouteMatchEqual('path/to/file.ts', 'path/to/file.ts'))
  })
  it('Returns false for different paths', () => {
    assert.isFalse(editorRouteMatchEqual('path/to/file.ts', 'path/to/other-file.ts'))
  })
  it('Returns false for different folders', () => {
    assert.isFalse(editorRouteMatchEqual('path/to/file.ts', 'other-path/to/file.ts'))
  })
  it('Returns true for falsy values', () => {
    assert.isTrue(editorRouteMatchEqual('', null))
    assert.isTrue(editorRouteMatchEqual(null, undefined))
    assert.isTrue(editorRouteMatchEqual(undefined, ''))
  })
  it('Returns true for same module file', () => {
    assert.isTrue(editorRouteMatchEqual(
      {moduleAlias: 'my-module', filePath: 'my-file.ts'},
      {moduleAlias: 'my-module', filePath: 'my-file.ts'}
    ))
  })
  it('Returns false for files within different module aliases', () => {
    assert.isFalse(editorRouteMatchEqual(
      {moduleAlias: 'my-module', filePath: 'my-file.ts'},
      {moduleAlias: 'my-other-module', filePath: 'my-file.ts'}
    ))
  })
  it('Returns false for a top level file and a module file', () => {
    assert.isFalse(editorRouteMatchEqual(
      'my-file.ts',
      {moduleAlias: 'my-other-module', filePath: 'my-file.ts'}
    ))
  })
  it('Returns true for falsy module files', () => {
    assert.isTrue(editorRouteMatchEqual(
      {moduleAlias: 'my-module', filePath: ''},
      {moduleAlias: 'my-module', filePath: null}
    ))
  })
  it('Returns true for falsy paths within different module aliases', () => {
    assert.isTrue(editorRouteMatchEqual(
      {moduleAlias: 'my-module', filePath: ''},
      {moduleAlias: 'my-other-module', filePath: null}
    ))
    assert.isTrue(editorRouteMatchEqual('', {moduleAlias: 'my-other-module', filePath: null}))
  })
  it('Returns false when comparing dependency route against non dependency routes', () => {
    assert.isFalse(editorRouteMatchEqual(
      'my-file.ts',
      {moduleAlias: 'module', isDependencyFile: true}
    ))
    assert.isFalse(editorRouteMatchEqual(
      {moduleAlias: 'my-module', filePath: 'my-file.ts'},
      {moduleAlias: 'my-module', isDependencyFile: true}
    ))
  })
})
