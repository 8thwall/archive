// @attr(npm_rule = "@npm-public-api//:npm-public-api")
// @attr(externalize_npm = True)

import {describe, it, assert, afterEach, before, beforeEach} from '@nia/bzl/js/chai-js'

import {Sequelize} from 'sequelize'

import {makeRequestContext, makeQueryParameters} from './test/common'
import {handleTargetsListGet} from './app-targets'
import * as models from './models'
import {initializeModels} from './models/init'

const withRequestContext = request => ({...request, ...makeRequestContext()})

describe('App /targets GET', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })

  const generateImageTarget = (AppUuid, uuid) => ({
    uuid,
    name: uuid,
    AppUuid,
    status: 'ENABLED',
    type: 'PLANAR',
    updatedAt: '1996-01-17',
    createdAt: '1706-01-17',
    metadata: JSON.stringify({
      topRadius: 200,
      bottomRadius: 1000,
      top: 0,
      left: 0,
      width: 50,
      height: 100,
      originalHeight: 200,
      originalWidth: 300,
      isRotated: true,
      arcAngle: 90,
      coniness: 2,
      inputMode: 'BASIC',
    }),
  })

  before(() => {
    models.register(initializeModels(sequelize))
    process.env.PUBLIC_API_CONTINUATION_TOKEN_SIGNING = 'test signing'
  })
  beforeEach(async () => {
    await sequelize.sync()
    const {App, Account, ImageTarget, ApiKey} = models.use()

    await Account.bulkCreate([{
      uuid: 'account1',
      shortName: 'account1',
      status: 'ENABLED',
    }])

    await ApiKey.bulkCreate([{
      uuid: 'key',
      secretKey: 'test-api-key',
      status: 'ENABLED',
      name: 'test-api-key',
      AccountUuid: 'account1',
      fullAccountAccess: true,
    }])

    await App.bulkCreate([{
      uuid: 'app1',
      AccountUuid: 'account1',
      name: 'app1',
      appKey: 'app1',
      status: 'ENABLED',
    }, {
      uuid: 'app2',
      AccountUuid: 'account1',
      name: 'app2',
      appKey: 'app2',
      status: 'ENABLED',
    }, {
      uuid: 'app3',
      AccountUuid: 'account1',
      name: 'app3',
      appKey: 'app3',
      status: 'ENABLED',
    }, {
      uuid: 'lots-of-targets',
      AccountUuid: 'account1',
      name: 'lots-of-targets',
      appKey: 'lots-of-targets',
      status: 'ENABLED',
    }, {
      uuid: 'even-more-targets',
      AccountUuid: 'account1',
      name: 'even-more-targets',
      appKey: 'even-more-targets',
      status: 'ENABLED',
    }])

    await ImageTarget.bulkCreate([{
      uuid: 'target1',
      name: 'target1',
      AppUuid: 'app1',
      status: 'DRAFT',
      type: 'PLANAR',
      metadata: '{"top": 1}',
      userMetadata: null,
      userMetadataIsJson: true,
    }, {
      uuid: 'target2',
      name: 'target2',
      AppUuid: 'app2',
      status: 'ENABLED',
      type: 'PLANAR',
      metadata: '{"top": 2}',
      userMetadata: 'this is not json',
      userMetadataIsJson: false,
    }, {
      uuid: 'target3',
      name: 'target3',
      AppUuid: 'app2',
      type: 'CONICAL',
      status: 'TAKEN_DOWN',
      metadata: JSON.stringify({
        topRadius: 200,
        bottomRadius: 1000,
        top: 0,
        left: 0,
        width: 50,
        height: 100,
        originalHeight: 200,
        originalWidth: 300,
        isRotated: true,
        arcAngle: 90,
        coniness: 2,
        inputMode: 'BASIC',
      }),
      userMetadata: null,
      userMetadataIsJson: true,
    },
    ...Array.from({length: 9}, (_, i) => generateImageTarget('lots-of-targets', `t${i}`)),
    ...Array.from({length: 55}, (_, i) => generateImageTarget('even-more-targets', `e${i}`)),
    ])
  })
  afterEach(async () => {
    await sequelize.drop()
  })
  it('returns image data', async () => {
    const res = await handleTargetsListGet(withRequestContext({pathParameters: {app: 'app1'}}))

    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)

    assert.equal(resObject.targets.length, 1)

    assert.deepNestedInclude(resObject.targets[0], {
      uuid: 'target1',
      name: 'target1',
      appKey: 'app1',
      status: 'AVAILABLE',
      loadAutomatically: false,
      type: 'PLANAR',
      geometry: {top: 1},
      metadata: null,
      metadataIsJson: true,
    })
  })
  it('handles status and conical geometry correctly', async () => {
    const res = await handleTargetsListGet(withRequestContext({pathParameters: {app: 'app2'}}))

    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)

    assert.equal(resObject.targets.length, 2)

    const expectedTarget2 = {
      uuid: 'target2',
      name: 'target2',
      appKey: 'app2',
      status: 'AVAILABLE',
      loadAutomatically: true,
      type: 'PLANAR',
      geometry: {top: 2},
      metadata: 'this is not json',
      metadataIsJson: false,
    }

    const expectedTarget3 = {
      uuid: 'target3',
      name: 'target3',
      appKey: 'app2',
      type: 'CONICAL',
      status: 'TAKEN_DOWN',
      loadAutomatically: false,
      geometry: {
        topRadius: 200,
        bottomRadius: 1000,
        top: 0,
        left: 0,
        width: 50,
        height: 100,
        originalHeight: 200,
        originalWidth: 300,
        isRotated: true,
        arcAngle: 90,
        coniness: 2,
        inputMode: 'BASIC',
      },
      metadata: null,
      metadataIsJson: true,
    }

    if (resObject.targets[0].name === 'target2') {
      assert.deepNestedInclude(resObject.targets[0], expectedTarget2)
      assert.deepNestedInclude(resObject.targets[1], expectedTarget3)
    } else {
      assert.deepNestedInclude(resObject.targets[0], expectedTarget3)
      assert.deepNestedInclude(resObject.targets[1], expectedTarget2)
    }
  })

  it('returns an empty array for an app with no targets', async () => {
    const res = await handleTargetsListGet(withRequestContext({pathParameters: {app: 'app3'}}))
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.deepNestedInclude(resObject, {targets: []})
  })
  it('rejects nonexistent app with 404', async () => {
    const res = await handleTargetsListGet(withRequestContext({pathParameters: {app: 'app0'}}))
    assert.equal(res.statusCode, 404)
  })
  it('paginates a list of 2 image targets (asc)', async () => {
    const res = await handleTargetsListGet(withRequestContext({
      pathParameters: {app: 'app2'},
      ...makeQueryParameters({
        by: ['created'],
        dir: ['asc'],
        limit: ['1'],
      }),
    }))
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.hasAllKeys(resObject, ['targets', 'continuationToken'])
    assert.equal(resObject.targets.length, 1)

    const res2 = await handleTargetsListGet(withRequestContext({
      pathParameters: {app: 'app2'},
      ...makeQueryParameters({
        continuation: [resObject.continuationToken],
      }),
    }))
    assert.equal(res2.statusCode, 200)
    const resObject2 = JSON.parse(res2.body)
    assert.hasAllKeys(resObject2, ['targets'])
    assert.equal(resObject2.targets.length, 1)

    assert.notDeepEqual(resObject.targets, resObject2.targets)
  })
  it('paginates a list of 2 image targets (desc)', async () => {
    // desc
    const res = await handleTargetsListGet(withRequestContext({
      pathParameters: {app: 'app2'},
      ...makeQueryParameters({
        by: ['created'],
        dir: ['desc'],
        limit: ['1'],
      }),
    }))
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.hasAllKeys(resObject, ['targets', 'continuationToken'])
    assert.equal(resObject.targets.length, 1)

    const res2 = await handleTargetsListGet(withRequestContext({
      pathParameters: {app: 'app2'},
      ...makeQueryParameters({
        continuation: [resObject.continuationToken],
      }),
    }))
    assert.equal(res2.statusCode, 200)
    const resObject2 = JSON.parse(res2.body)
    assert.hasAllKeys(resObject2, ['targets'])
    assert.equal(resObject2.targets.length, 1)
  })
  it('404 on unprivileged request', async () => {
    const res = await handleTargetsListGet({
      pathParameters: {app: 'lots-of-targets'},
      ...makeRequestContext(false, {apiKey: 'bad-api-key'}),
      ...makeQueryParameters({
        by: ['created'],
        dir: ['asc'],
        limit: ['8'],
      }),
    })
    assert.equal(res.statusCode, 404)
  })
  it('paginates many targets (authenticated)', async () => {
    const res = await handleTargetsListGet({
      pathParameters: {app: 'lots-of-targets'},
      ...makeRequestContext(false, {apiKey: 'test-api-key'}),
      ...makeQueryParameters({
        by: ['created'],
        dir: ['asc'],
        limit: ['8'],
      }),
    })
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.hasAllKeys(resObject, ['targets', 'continuationToken'])
    assert.equal(resObject.targets.length, 8)

    const res2 = await handleTargetsListGet(withRequestContext({
      pathParameters: {app: 'lots-of-targets'},
      ...makeQueryParameters({
        continuation: [resObject.continuationToken],
      }),
    }))
    assert.equal(res2.statusCode, 200)
    const resObject2 = JSON.parse(res2.body)
    assert.hasAllKeys(resObject2, ['targets'])
    assert.equal(resObject2.targets.length, 1)

    assert.notDeepEqual(resObject.targets, resObject2.targets)
  })
  it('allows privileged requests to fetch all targets', async () => {
    const res = await handleTargetsListGet({
      pathParameters: {app: 'even-more-targets'},
      ...makeRequestContext(true),
    })
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.equal(resObject.targets.length, 55)
  })
  it('defaults unprivileged requests to 50 targets', async () => {
    const res = await handleTargetsListGet({
      pathParameters: {app: 'even-more-targets'},
      ...makeRequestContext(false, {apiKey: 'test-api-key'}),
    })
    assert.equal(res.statusCode, 200)
    const resObject = JSON.parse(res.body)
    assert.equal(resObject.targets.length, 50)
  })
})
