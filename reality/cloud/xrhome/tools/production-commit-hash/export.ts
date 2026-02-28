import AWS from 'aws-sdk'
import {Op} from 'sequelize'

import {createDb} from '../../src/shared/integration/db/db-impl'
import dbConfigForEnv from '../../config/db'
import {makeRunQueue} from '../../src/shared/run-queue'

/* eslint-disable no-console */

const DEV = true

const DDB_TABLE = DEV ? 'studio' : 'studio-global'

// production-tunnel is a temporarydb config that accesses the prod db through an ssh tunnel
const DB_ENV = DEV ? 'local' : 'production-tunnel'

const ddb = new AWS.DynamoDB({region: 'us-west-2'})

const fetchCommitsFromDdb = async () => {
  let exclusiveStartKey = null

  const results: {pk: string, sk: string, commitId: string, buildTime: number}[] = []

  do {
    // eslint-disable-next-line no-await-in-loop
    const result = await ddb.scan({
      TableName: DDB_TABLE,
      FilterExpression: 'sk = :val',
      ExpressionAttributeValues: {
        ':val': {S: 'ref:production'},
      },
      ExclusiveStartKey: exclusiveStartKey,
    }).promise()

    exclusiveStartKey = result.LastEvaluatedKey

    result.Items.forEach((e) => {
      results.push({
        pk: e.pk.S,
        sk: e.sk.S,
        commitId: e.commitId.S,
        buildTime: Number(e.buildTime.N),
      })
    })
  } while (exclusiveStartKey)

  return results
}

const db = createDb(dbConfigForEnv(DB_ENV)) as any

const fetchAppsFromPostgres = () => db.App.findAll({
  where: {productionCommitHash: {[Op.not]: null}},
  include: [{model: db.Account as any, required: true, attributes: ['shortName']}],
  attributes: ['uuid', 'appKey', 'appName', 'productionCommitHash'],
})

const checkDiscrepancies = async () => {
  const [appsWithHash, commits] = await Promise.all([
    fetchAppsFromPostgres(),
    fetchCommitsFromDdb(),
  ])

  console.log('Got apps:', appsWithHash.length, 'commits:', commits.length)
  const appsByUuid = appsWithHash.reduce((acc, e) => {
    acc[e.uuid] = e
    return acc
  }, {})

  const specToUuid = appsWithHash.reduce((acc, e) => {
    acc[`${(e as any).Account.shortName}.${e.appName}`] = e.uuid
    return acc
  }, {})

  const unassignedValues: {spec: string, hash: string}[] = []

  const mismatchedValues: {appUuid: string, actual: string, expected: string}[] = []

  const appUuidsWithCommit = new Set()

  commits.forEach((c) => {
    const spec = c.pk
    const app = appsByUuid[specToUuid[spec]]

    if (!app) {
      // App doesn't have a production commit hash, need to add.
      unassignedValues.push({spec, hash: c.commitId})
      return
    }

    appUuidsWithCommit.add(app.uuid)

    if (app.productionCommitHash !== c.commitId) {
      // App has a mismatched hash
      mismatchedValues.push({
        appUuid: app.uuid,
        actual: app.productionCommitHash,
        expected: c.commitId,
      })
    }
  })

  const needsClearAppUuids = appsWithHash.map(a => a.uuid)
    .filter(uuid => !appUuidsWithCommit.has(uuid))

  return {unassignedValues, mismatchedValues, needsClearAppUuids}
}

const queue = makeRunQueue(1)

const updateHashBySpecifier = async (spec: string, value: string) => queue.next(async () => {
  const split = spec.split('.')
  const app = await db.App.findOne({
    where: {appName: split[1]},
    include: [{
      model: db.Account as any,
      required: true,
      where: {shortName: split[0]},
      attributes: ['uuid', 'shortName'],
    }],
    attributes: ['uuid', 'productionCommitHash', 'appKey', 'appName'],
  }) as any
  if (!app) {
    console.warn('Nonexistent app with specifier:', spec)
    return
  }
  console.log('updating app:', app.appName, 'to', value, 'from', app.productionCommitHash)
  await app.update({productionCommitHash: value}, {silent: true})
})

const updateHashByUuid = async (appUuid: string, value: string) => queue.next(async () => {
  console.log('updating app:', appUuid, 'to', value)
  await db.App.update({productionCommitHash: value}, {where: {uuid: appUuid}, silent: true})
})

export {
  checkDiscrepancies,
  updateHashBySpecifier,
  updateHashByUuid,
}
