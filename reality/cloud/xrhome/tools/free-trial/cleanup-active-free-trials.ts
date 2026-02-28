#!/usr/bin/env npx ts-node

// Usage:
//   > ./cleanup-active-free-trials.ts

/* eslint-disable no-console */
import AWS from 'aws-sdk'

import {Op} from 'sequelize'
import * as fs from 'fs/promises'

import dbConfigForEnv from '../../config/db'
import {Db} from '../../src/shared/integration/db/db-api'
import {createDb} from '../../src/shared/integration/db/db-impl'
import {
  SecretsProvider,
} from '../../src/shared/integration/secrets-provider/secrets-provider-api'
import {
  createSecretsProvider,
} from '../../src/shared/integration/secrets-provider/secrets-provider-impl'
import type {
  DeprecatedDataRealm,
  DeprecatedDeploymentStage,
  Environment,
} from '../../src/shared/data-realm'
import type {Account} from '../../src/shared/integration/db/models'
import {makeRunQueue} from '../../src/shared/run-queue'

const MAX_ROWS_PER_UPDATE = 100

AWS.config.update({region: 'us-west-2'})

const chunkItems = <T>(items: T[], chunkSize: number) => items
  .reduce((acc, request, i) => {
    const chunkIndex = Math.floor(i / (chunkSize))
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []
    }
    acc[chunkIndex].push(request)
    return acc
  }, [] as T[][])

const initDb = async (env: Environment) => {
  const dbSecret = await SecretsProvider.use().getSecret({
    name: 'xrhome/pg',
    versionIdsByRealm: {
      qa: '<REMOVED_BEFORE_OPEN_SOURCING>',
      prod: '<REMOVED_BEFORE_OPEN_SOURCING>',
    },
  })
  process.env.DB_USERNAME = dbSecret.username
  process.env.DB_PASSWORD = dbSecret.password
  process.env.DB_NAME = dbSecret.dbname
  process.env.HOSTNAME = dbSecret.host

  const dbEnv = env.dataRealm === 'prod' ? 'production' : 'development'

  Db.register(createDb({
    ...dbConfigForEnv(dbEnv),
    ...(env.dataRealm === 'prod' ? {port: 5454} : {}),
  }))

  return () => Db.use().sequelize.close()
}

let closeDbConnection: () => Promise<void>

const run = async (dataRealm: string, dryRun: string = 'true') => {
  try {
    if (!['prod', 'dev'].includes(dataRealm)) {
      console.error(`Invalid dataRealm: ${dataRealm}. Must be 'prod' or 'dev'`)
      return
    }
    const isDryRun = dryRun ? dryRun === 'true' : true
    if (isDryRun) {
      console.log('\n***********************')
      console.log('** THIS IS A DRY RUN **')
      console.log('***********************\n')
    }

    const env: Environment = {
      dataRealm: dataRealm as DeprecatedDataRealm,
      deploymentStage: dataRealm as DeprecatedDeploymentStage,
    }

    SecretsProvider.register(createSecretsProvider(env))

    closeDbConnection = await initDb(env)

    // Lookup accounts which need their trial status cleaned up.
    const activeFreeTrials: Pick<Account, 'uuid' | 'trialStatus' | 'trialUntil'>[] = (
      await Db.use().Account.findAll({
        where: {
          trialStatus: {
            [Op.or]: ['ACCOUNT', 'BILLING', 'ACTIVE', 'CANCELED'],
          },
        },
        attributes: ['uuid', 'trialStatus', 'trialUntil'],
      })
    ).map(a => a.get({plain: true}))

    // Write out which accounts were updated, and their original trial data.
    const dir = `${__dirname}/output/${dataRealm}`
    await fs.mkdir(dir, {recursive: true})
    await fs.writeFile(
      `${dir}/active-free-trials.json`,
      JSON.stringify(activeFreeTrials, null, 2),
      'utf-8'
    )

    const chunkedAccounts = chunkItems(activeFreeTrials, MAX_ROWS_PER_UPDATE)

    // Update accounts in chunks to avoid one large update.
    await Db.use().sequelize.transaction(async () => {
      const runQueue = makeRunQueue(5)
      await Promise.all(chunkedAccounts.map(async (accounts, index) => {
        await runQueue.next(async () => {
          const uuids = accounts.map(a => a.uuid)
          console.log(`Updating account chunk ${index + 1} of  ${chunkedAccounts.length}`)

          if (!isDryRun) {
            await Db.use().Account.update(
              {trialStatus: 'NONE', trialUntil: null},
              {where: {uuid: {[Op.in]: uuids}}}
            )
          }
        })
      }))
    })

    console.log(`Complete! ${activeFreeTrials.length} accounts updated.`)
  } catch (e) {
    console.error(e)
  } finally {
    await closeDbConnection()
  }
}

run(process.argv[2], process.argv[3])
