/* eslint-disable no-console */
import {Op} from 'sequelize'

import {createDb} from '../../src/shared/integration/db/db-impl'
import dbConfigForEnv from '../../config/db'
import {makeRunQueue} from '../../src/shared/run-queue'

const DEV = false

// Config for production-tunnel was intentionally not checked in, but it uses ssh port forwarding
// with the prod credentials to be able to pull prod data. If you manually export the data in
// some other way, write it to "apps-production-tunnel.json" and turn off FRESH_OVERRIDE,
// you can proceed without needing to connect directly to prod, at least to validate.
const DB_ENV = DEV ? 'local' : 'production-tunnel'
const db = createDb(dbConfigForEnv(DB_ENV) as any)

const fetchAppsFromPostgres = () => db.App.findAll({
  where: {
    isWeb: true,
    status: {[Op.not]: 'DELETED'},
  },
  include: [{model: db.Account as any, required: true, attributes: ['shortName']}],
  attributes: ['uuid', 'appKey', 'appName', 'repoId', 'repoStatus'],
})

const queue = makeRunQueue(1)

const updateRepoIdByUuid = async (appUuid: string, repoId: string) => queue.next(async () => {
  console.log('updating app:', appUuid, 'to repoId:', repoId)
  // Commented out just in case
  // await db.App.update({repoId}, {where: {uuid: appUuid}, silent: true})
})

const updateRepoRepoStatusByUuid = async (appUuid: string) => queue.next(async () => {
  console.log('Updating repoStatus to PRIVATE for:', appUuid)
  // Commented out just in case
  // await db.App.update({repoStatus: 'PRIVATE'}, {where: {uuid: appUuid}, silent: true})
})

export {
  DB_ENV,
  fetchAppsFromPostgres,
  updateRepoIdByUuid,
  updateRepoRepoStatusByUuid,
}
