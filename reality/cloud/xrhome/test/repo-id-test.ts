import {describe, it} from 'mocha'
import {assert} from 'chai'

import {parseRepoId, stripDeletedPrefix} from '../src/shared/repo-id'

describe('parseRepoId', () => {
  it('Parses legacy app repoIds', () => {
    assert.deepEqual(parseRepoId('8w.test58'), {
      store: 'cc',
      partition: '0',
      type: 'app',
      isLegacyFormat: true,
      workspace: '8w',
      appName: 'test58',
    })
  })

  it('Parses repoId for app', () => {
    assert.deepEqual(parseRepoId('cc.3.app.my-app-uuid'), {
      store: 'cc',
      partition: '3',
      type: 'app',
      id: 'my-app-uuid',
    })
  })

  it('Parses repoId for module', () => {
    assert.deepEqual(parseRepoId('cc.sandbox.module.my-module-uuid'), {
      store: 'cc',
      partition: 'sandbox',
      type: 'module',
      id: 'my-module-uuid',
    })
  })

  it('Rejects invalid repoIds', () => {
    assert.throws(() => {
      parseRepoId('cc.sandbox.notmoduleorapp.my-module-uuid')
    })
    assert.throws(() => {
      parseRepoId('notcc.sandbox.module.my-module-uuid')
    })
    assert.throws(() => {
      parseRepoId('cc.sandbox.module.my-module-uuid.extra-part')
    })
    assert.throws(() => {
      parseRepoId('cc.sandbox.module')
    })
  })
})

describe('stripDeletedPrefix', () => {
  it('Leaves normal repoIds unchanged', () => {
    assert.strictEqual(stripDeletedPrefix('8w.test58'),
      '8w.test58')

    assert.strictEqual(
      stripDeletedPrefix('deleted.58-58'),
      'deleted.58-58'
    )
    assert.strictEqual(
      stripDeletedPrefix('cc.1.app.my-app-uuid'),
      'cc.1.app.my-app-uuid'
    )
    assert.strictEqual(
      stripDeletedPrefix('cc.4.module.my-module-uuid'),
      'cc.4.module.my-module-uuid'
    )
  })
  it('Removes the deleted prefix', () => {
    assert.strictEqual(
      stripDeletedPrefix('deleted-123-8w.test58'),
      '8w.test58'
    )
    assert.strictEqual(
      stripDeletedPrefix('deleted-124-cc.1.app.my-app-uuid'),
      'cc.1.app.my-app-uuid'
    )
    assert.strictEqual(
      stripDeletedPrefix('deleted-124-cc.4.module.my-module-uuid'),
      'cc.4.module.my-module-uuid'
    )
    assert.strictEqual(
      stripDeletedPrefix('deleted-1666815412888-cc.1.app.02eec286-bb82-4a00-81fa-63393fa96e8a'),
      'cc.1.app.02eec286-bb82-4a00-81fa-63393fa96e8a'
    )
  })
})
