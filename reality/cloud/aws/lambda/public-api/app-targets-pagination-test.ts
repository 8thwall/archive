// @attr(npm_rule = "@npm-public-api//:npm-public-api")
// @attr(externalize_npm = True)

import {describe, it, assert, before, beforeEach, afterEach} from '@nia/bzl/js/chai-js'

import {Sequelize} from 'sequelize'

import {makeRequestContext} from './test/common'
import {handleTargetsListGet} from './app-targets'
import * as models from './models'
import {initializeModels} from './models/init'

const makeUuid = (n: number) => `${n.toString().padStart(8, '0')}-0000-1000-a000-000000000000`

const withRequestContext = (request: {}) => ({...request, ...makeRequestContext()})

const doGet = (params?: Record<string, string[]>) => handleTargetsListGet(
  withRequestContext({
    multiValueQueryStringParameters: params,
    pathParameters: {app: 'app1'},
  })
)

const assertFirstEl = (uuid, response, message?: string) => {
  assert.equal(response.statusCode, 200)
  const resObject = JSON.parse(response.body)
  assert.equal(resObject.targets[0].uuid, uuid, message)
}

const makeBasicTarget = (uuid, name, createdAt, updatedAt) => ({
  uuid,
  name,
  AppUuid: 'app1',
  status: 'DRAFT',
  type: 'PLANAR',
  metadata: '{"top": 1}',
  userMetadata: null,
  userMetadataIsJson: true,
  createdAt,
  updatedAt,
})

describe('App /targets GET', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })

  before(() => {
    models.register(initializeModels(sequelize))
  })
  beforeEach(async () => {
    await sequelize.sync()
    const {App, Account, ImageTarget} = models.use()

    await Account.bulkCreate([{
      uuid: 'account1',
      shortName: 'account1',
      status: 'ENABLED',
    }])

    await App.bulkCreate([{
      uuid: 'app1',
      AccountUuid: 'account1',
      name: 'app1',
      appKey: 'app1',
      status: 'ENABLED',
    }])

    await ImageTarget.bulkCreate([
      makeBasicTarget(makeUuid(0), 'nameCB', 1, 3),
      makeBasicTarget(makeUuid(1), 'nameCC', 5, 3),
      makeBasicTarget(makeUuid(2), 'nameZA', 3, 1),
      makeBasicTarget(makeUuid(3), 'nameAA', 3, 3),
      makeBasicTarget(makeUuid(4), 'nameC', 1, 4),
      makeBasicTarget(makeUuid(5), 'nameBA', 6, 3),
    ])
  })
  afterEach(async () => {
    await sequelize.drop()
  })
  it('Rejects if uuid is not the last by specified', async () => {
    const res = await doGet({by: ['uuid', 'updated']})
    assert.equal(res.statusCode, 400)
  })
  it('Rejects if you specify an invalid uuid as a start/after', async () => {
    const shouldAllReject = [
      await doGet({by: ['uuid'], start: ['not-real']}),
      await doGet({by: ['uuid'], after: ['not-real']}),
      await doGet({by: ['name', 'uuid'], start: ['my-name-', 'not-real']}),
    ]
    shouldAllReject.forEach((res) => {
      assert.equal(res.statusCode, 400)
    })
  })

  it('Defaults to createdAt asc and uuid asc', async () => {
    assertFirstEl(makeUuid(0), await doGet())
  })
  it('Rejects if you specify dir/start/after without a by', async () => {
    const shouldAllReject = [
      await doGet({dir: ['asc']}),
      await doGet({start: ['3']}),
      await doGet({after: ['3']}),
    ]

    shouldAllReject.forEach((res) => {
      assert.equal(res.statusCode, 400)
    })
  })

  it('Can skip to an inclusive starting point', async () => {
    assertFirstEl(makeUuid(2), await doGet({by: ['created'], start: ['3']}))
  })
  it('Can skip to an exclusive starting point', async () => {
    assertFirstEl(makeUuid(1), await doGet({by: ['created'], after: ['3']}))
  })
  it('Can go in the reverse direction', async () => {
    assertFirstEl(makeUuid(5), await doGet({by: ['created'], dir: ['desc']}))
  })
  it('Rejects if you specify more dirs/afters/starts than bys', async () => {
    const shouldAllReject = [
      await doGet({by: ['created'], start: ['3', makeUuid(2)]}),
      await doGet({by: ['created'], after: ['3', makeUuid(2)]}),
      await doGet({by: ['created'], start: ['3'], after: [makeUuid(2)]}),
      await doGet({by: ['created'], dir: ['asc', 'desc']}),
    ]

    shouldAllReject.forEach((res) => {
      assert.equal(res.statusCode, 400)
    })
  })

  it('Can use a uuid as a tiebreaker', async () => {
    assertFirstEl(makeUuid(3), await doGet({
      by: ['created', 'uuid'],
      start: ['3'],
      after: [makeUuid(2)],
    }))
  })
  it('Includes uuids that are lower that come after the created start', async () => {
    assertFirstEl(makeUuid(1), await doGet({
      by: ['created', 'uuid'],
      start: ['3'],
      after: [makeUuid(3)],
    }))
  })
  it('Can sort by name', async () => {
    assertFirstEl(makeUuid(3), await doGet({by: ['name']}))
  })
  it('Can start from by name', async () => {
    assertFirstEl(makeUuid(4), await doGet({by: ['name'], start: ['nameC']}))
  })
  it('Can after by name', async () => {
    assertFirstEl(makeUuid(0), await doGet({by: ['name'], after: ['nameC']}))
  })
})
