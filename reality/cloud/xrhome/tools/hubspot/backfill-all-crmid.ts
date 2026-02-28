#!/usr/bin/env npx ts-node

// Usage:
//   > ./generate-workspace-objects.ts <data-realm> <dry-run>

/* eslint-disable no-console */
import AWS from 'aws-sdk'
import {Op} from 'sequelize'
import _ from 'lodash'
import * as fs from 'fs/promises'
import {createObjectCsvWriter} from 'csv-writer'

import {
  SecretsProvider,
} from '../../src/shared/integration/secrets-provider/secrets-provider-api'
import {
  createSecretsProvider,
} from '../../src/shared/integration/secrets-provider/secrets-provider-impl'
import {Hubspot} from '../../src/shared/integration/hubspot/hubspot-api'
import {Db} from '../../src/shared/integration/db/db-api'
import {createDb} from '../../src/shared/integration/db/db-impl'
import dbConfigForEnv from '../../config/db'
import type {
  DeprecatedDataRealm, DeprecatedDeploymentStage, Environment,
} from '../../src/shared/data-realm'
import {createAccessTokenHubspot} from '../../src/shared/integration/hubspot/hubspot-api-impl'
import {registerThirdPartyScope, THIRD_PARTY_SCOPE} from '../../src/server/secret-scopes'
import type {User} from '../../src/shared/integration/db/models'

let closeDbConnection: () => Promise<void>

AWS.config.update({region: 'us-west-2'})

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

type HubspotContact = {
  vid: number
  properties: {
    email?: {
      value: string
    }
  }
}

type UserCrmIdRecord = {
  userPrimaryContactEmail: string
  userUuid: string | null
  crmId: string | null
  error?: string
}

type ErrorLogRecord = {
  error: string
}

type resolveDifferenceAcc = {
  usersWithContact: UserCrmIdRecord[]
}

const resolveDifference = (hubspotUsers: HubspotContact[], dbUsers: User[]) => {
  const {
    usersWithContact,
  } = hubspotUsers.reduce((acc: resolveDifferenceAcc, user: HubspotContact) => {
    const userEmail = user.properties.email.value
    const dbUser = dbUsers.find((u: User) => u.primaryContactEmail === userEmail)
    if (dbUser) {
      const {vid} = user
      if (vid) {
        acc.usersWithContact.push({
          userPrimaryContactEmail: userEmail,
          userUuid: dbUser.uuid,
          crmId: JSON.stringify(vid),
        } as UserCrmIdRecord)
      }
    }
    return acc
  }, {usersWithContact: []})

  return {
    usersWithContact,
  }
}

const backfillAllCrmIds = async (dataRealm: string, dryRun: string) => {
  const dir = `${__dirname}/output/${dataRealm}`
  await fs.mkdir(dir, {recursive: true})
  const TIME_STAMP = Date.now()
  const backfilledUsersOutput = `${dir}/back-filled-users-${TIME_STAMP}.csv`
  const errorOutput = `${dir}/error-users-${TIME_STAMP}.csv`

  const backfillCsvWriter = createObjectCsvWriter({
    path: backfilledUsersOutput,
    header: [
      {id: 'userPrimaryContactEmail', title: 'User primary contact email'},
      {id: 'userUuid', title: 'UserUuid'},
      {id: 'crmId', title: 'crmId'},
    ],
  })

  const errorLogWriter = createObjectCsvWriter({
    path: errorOutput,
    header: [
      {id: 'error', title: 'Error Logs'},
    ],
  })

  // eslint-disable-next-line no-undef
  const errorRecords = [] as ErrorLogRecord[]
  const updatedRecords = [] as UserCrmIdRecord[]

  try {
    if (!['prod', 'dev'].includes(dataRealm)) {
      console.error(`Invalid dataRealm: ${dataRealm}. Must be 'prod' or 'dev'`)
      return
    }

    const isDryRun = dryRun !== 'false'
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
    registerThirdPartyScope()
    await SecretsProvider.use().getScope(THIRD_PARTY_SCOPE)
    Hubspot.register(createAccessTokenHubspot())
    closeDbConnection = await initDb(env)

    let users: User[]
    try {
      console.log('Fetching users from DB...')
      users = await Db.use().User.findAll({
        where: {
          crmId: {
            [Op.is]: null,
          },
        },
      })
      console.log(`# of accounts fetched: ${users.length}`)
    } catch (err) {
      console.error(`Error fetching DB users - ${err.message}`)
      return
    }

    if (!users) {
      console.error('No users found in DB')
      return
    }

    const xrhomeUserToHubspotId = [] as UserCrmIdRecord[]

    const userBatches = _.chunk(users, 100)
    const totalBatches = userBatches.length
    let page = 0
    console.log(userBatches.length, 'batch(es) of 100 users')

    while (page < totalBatches) {
      const batch = userBatches[page]
      try {
        const hubspotContacts: HubspotContact[] = (
          // eslint-disable-next-line no-await-in-loop
          Object.values(await Hubspot.use().contacts.getByEmailBatch(
            batch.map((user => user.primaryContactEmail))
          ))
        )
        const {
          usersWithContact,
        } = resolveDifference(hubspotContacts, batch)

        xrhomeUserToHubspotId.push(...usersWithContact)
      } catch (err) {
        console.error(`Error fetching users from Hubspot - ${err.message}`)
      }
      page++
    }
    console.log('Total amount of contacts found', xrhomeUserToHubspotId.length)

    // Pre fetching users by crmId to avoid updating users to have the same crmId.
    console.log('Pre-fetching users by crmId...')
    const crmIds = xrhomeUserToHubspotId.map((record: UserCrmIdRecord) => record.crmId)
    const preFetchedUsersByCrmId = await Db.use().User.findAll({
      where: {
        crmId: crmIds,
      },
      attributes: ['primaryContactEmail'],
    })
    console.log('Total amount of users pre-fetched by crmId', preFetchedUsersByCrmId.length)
    // Update users in DB w/ correct crmId
    const updatedUsersPromises = await Promise.allSettled(xrhomeUserToHubspotId.map(
      async (record: UserCrmIdRecord) => {
        const {userPrimaryContactEmail, userUuid, crmId} = record
        try {
          // Check if crmId exists with a different user (by email).
          const userByCrmId = preFetchedUsersByCrmId.find((user: User) => user.crmId === crmId)

          if (userByCrmId && userByCrmId.primaryContactEmail !== userPrimaryContactEmail) {
            throw new Error(
              `Cannot update email: ${userPrimaryContactEmail} crmId ` +
              `${crmId} already exists for a different user ${userByCrmId.primaryContactEmail}`
            )
          }

          if (userByCrmId && userByCrmId.primaryContactEmail === userPrimaryContactEmail) {
            throw new Error(
              `No action taken ${crmId} already exists for user ${userByCrmId.primaryContactEmail}`
            )
          }

          if (!isDryRun) {
            await Db.use().User.update({crmId}, {where: {uuid: userUuid}})
          }

          return record
        } catch (err) {
          throw new Error(`Error updating user ${userPrimaryContactEmail} - ${err}`)
        }
      }
    ))

    updatedUsersPromises.forEach((result) => {
      if (result.status === 'rejected') {
        errorRecords.push({error: result.reason})
      }

      if (result.status === 'fulfilled') {
        updatedRecords.push(result.value)
      }
    })

    console.log('Total amount of users updated', updatedRecords.length)
  } catch (err) {
    console.error(err)
  } finally {
    backfillCsvWriter.writeRecords(updatedRecords)
    errorLogWriter.writeRecords(errorRecords)
    closeDbConnection()
  }
}

backfillAllCrmIds(process.argv[2], process.argv[3])
