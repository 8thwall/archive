#!/usr/bin/env npx ts-node

// Usage:
//   > ./generate-workspace-objects.ts <data-realm> <dry-run>

/* eslint-disable no-console */
import AWS from 'aws-sdk'
import {Op} from 'sequelize'
import _ from 'lodash'

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
import type {Account, User} from '../../src/shared/integration/db/models'

let closeDbConnection: () => Promise<void>

AWS.config.update({region: 'us-west-2'})

const CONTACT_OBJECT_TYPE_ID = '0-1'
const USER_ACCOUNT_ROLE_TO_ASSOCIATION_NAME_MAP = {
  DEV: 'workspace_dev',
  ADMIN: 'workspace_admin',
  BILLMANAGER: 'workspace_billmanager',
  OWNER: 'workspace_owner',
}
const WORKSPACE_OBJECT_NAME = 'workspaces'
// Setting arbtriary limit of 1000 accounts to return from DB to prevent unnecessary data transfer
// errors.
const DB_ACCOUNT_RETURN_LIMIT = 1000

// Batch limit for custom objects is 100 records per patch request.
const HUBSPOT_OBJECT_BATCH_LIMIT = 100

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

const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const createUsersAssociationsForAccount = async (users, associations) => {
  try {
    const userAssociations = await Promise.all(users.map(async (user) => {
      const dbUser = await Db.use().User.findOne({
        where: {
          uuid: user.UserUuid,
        },
        attributes: ['crmId'],
      }) as Partial<User>

      if (!dbUser?.crmId) {
        return null
      }

      const association = associations.find(
        assoc => assoc.name === USER_ACCOUNT_ROLE_TO_ASSOCIATION_NAME_MAP[user.role]
      )

      return {
        types: [
          {
            associationCategory: 'USER_DEFINED',
            associationTypeId: association.id,
          },
        ],
        to: {
          id: dbUser.crmId,
        },
      }
    }))

    return userAssociations.filter(Boolean)
  } catch (err) {
    console.error(`Error creating user associations - ${err.message}`)
    return null
  }
}

const getAllXrhomeDbAccounts = async (): Promise<Account[]> => {
  const whereQuery = {
    where: {
      accountType: {
        [Op.not]: 'Lightship',
      },
      status: {
        [Op.not]: 'DELETED',
      },
    },
  }

  const totalAccounts = await Db.use().Account.count(whereQuery)
  let page = 0
  const totalPages = Math.ceil(totalAccounts / DB_ACCOUNT_RETURN_LIMIT)
  const accountsPromises: any = []

  while (page < totalPages) {
    const recordOffset = page * DB_ACCOUNT_RETURN_LIMIT
    try {
      accountsPromises.push(Db.use().Account.findAll({
        ...whereQuery,
        attributes: ['shortName', 'name', 'uuid'],
        limit: DB_ACCOUNT_RETURN_LIMIT,
        offset: recordOffset,
        include: [{
          model: Db.use().User_Account,
          required: true,
          as: 'Users',
          attributes: ['role', 'UserUuid'],
        }],
      }))
    } finally {
      page++
    }
  }

  // Merge all queries for accounts into one array.
  const allDbAccounts = await Promise.all(accountsPromises)

  return allDbAccounts.reduce((acc, val) => [...acc, ...val], [] as Account[])
}

const createHubspotInputsParam = async (accounts, accountAssociations) => {
  const inputs = await Promise.all(accounts.map(async (account) => {
    const userAccountAssociations = account.Users.length > HUBSPOT_OBJECT_BATCH_LIMIT
      ? []
      : await createUsersAssociationsForAccount(account.Users, accountAssociations)

    return {
      idProperty: 'short_name',
      id: account.shortName,
      properties: {
        name: account.name,
        short_name: account.shortName,
        workspace_uuid: account.uuid,
      },
      associations: [...userAccountAssociations],
    }
  }))

  return inputs
}

const createHubspotWorkspaceObjectBatch = async (
  accounts, workspaceObjectId, accountAssociations
) => {
  try {
    const reqBody = {
      method: 'POST',
      path: `/crm/v3/objects/${workspaceObjectId}/batch/create`,
      body: {
        inputs: await createHubspotInputsParam(accounts, accountAssociations),
      },
    }
    await Hubspot.use().apiRequest(reqBody)
  } catch (err) {
    const errorMsg = (`Error creating workspace object - ${err.message}`)
    console.error(errorMsg)
    throw new Error(errorMsg)
  }
}

const createBatchReadRequest = (accountBatch) => {
  const reqBody = {
    method: 'POST',
    path: `/crm/v3/objects/${WORKSPACE_OBJECT_NAME}/batch/read`,
    body: {
      idProperty: 'short_name',
      inputs: accountBatch.map((acc: Account) => {
        const {shortName} = acc
        return {
          id: shortName,
        }
      }),
    },
  }

  return reqBody
}

// This function takes the current xrhome users for an account, and checks if that association
// exists for the corresponding workspace in hubspot.
// If it does not, it will return the association to be added.
const determineAssociationToAdd = (
  xrHomeAssociations, hubspotAssociations, accountAssociations
) => {
  if (!xrHomeAssociations.length) {
    return []
  }

  const associationsToAdd = xrHomeAssociations.filter((userAssoc) => {
    const userAssocTypeId = userAssoc.types[0].associationTypeId  // asociation type id
    const userAssocTo = userAssoc.to.id  // crmId of a user in xrhome
    const correctAccountAssociation = (
      accountAssociations.find(assoc => assoc.id === userAssocTypeId)
    )

    if (!correctAccountAssociation) {
      return false
    }

    const userAssocExists = hubspotAssociations.find(hubspotAssoc => (
      hubspotAssoc.id === userAssocTo &&
        hubspotAssoc.type === correctAccountAssociation.name
    ))
    // if user association does not exists in hubspot, we want to add it.
    return !userAssocExists
  })

  return associationsToAdd
}

// This function takes the current hubspot associations for an account, and checks if that user
// exists for the corresponding workspace.
// If it does not, it will return the association to be deleted.
const determineAssociationToDelete = (
  xrHomeAssociations, hubspotAssociations, workspaceObjectAssociationTypes
) => {
  if (!hubspotAssociations.length) {
    return []
  }

  // Filter associations with ids that do not exist in xrhome.
  const associationsToDelete = hubspotAssociations.filter((hubspotAssoc) => {
    if (hubspotAssoc.type === 'contact_to_workspaces') {
      return false
    }

    const workspaceObjectAssociation = workspaceObjectAssociationTypes.find(type => (
      type.name === hubspotAssoc.type
    ))

    const xrhomeAssociationDoesExist = xrHomeAssociations.find((xrhomeAssoc) => {
      const xrhomeAssocTypeId = xrhomeAssoc.types[0].associationTypeId
      const xrhomeAssocTo = xrhomeAssoc.to.id

      return (
        xrhomeAssocTypeId === workspaceObjectAssociation?.id &&
        xrhomeAssocTo === hubspotAssoc.id
      )
    })

    return !xrhomeAssociationDoesExist
  })

  return associationsToDelete
}

const updateHubspotWorkspaceObject = async (
  accounts, workspaceObjectType, accountAssociations
) => {
  const deleteAssociationList = []
  const addAssociationList = []
  try {
    await Promise.all(accounts.map(async (account) => {
      const searchParams = new URLSearchParams()
      searchParams.append('properties', 'short_name,name,account_uuid')
      searchParams.append('associations', CONTACT_OBJECT_TYPE_ID)
      // get current association per account.
      const res = await Hubspot.use().apiRequest({
        method: 'GET',
        path: (
          `/crm/v3/objects/${workspaceObjectType}/${account.workspaceId}?${searchParams.toString()}`
        ),
      })
      const hubspotAssocations = res.associations?.contacts?.results || []
      const xrhomeAssociations = (
        await createUsersAssociationsForAccount(account.Users, accountAssociations)
      )

      const associationsToDelete = determineAssociationToDelete(
        xrhomeAssociations, hubspotAssocations, accountAssociations
      )

      if (associationsToDelete.length) {
        associationsToDelete.forEach((assoc) => {
          deleteAssociationList.push({
            type: assoc.type,
            from: {
              id: account.workspaceId,
            },
            to: {
              id: assoc.id,
            },
          })
        })
      }

      const associationsToAdd = determineAssociationToAdd(
        xrhomeAssociations, hubspotAssocations, accountAssociations
      )

      if (associationsToAdd.length) {
        addAssociationList.push(...associationsToAdd.map(assoc => ({
          type: assoc.types[0].associationTypeId,
          from: {
            id: account.workspaceId,
          },
          to: {
            id: assoc.to.id,
          },
        })))
      }
    }))
  } catch (err) {
    const errorMsg = (`Error fetching workspace associations to add/delete - ${err.message}`)
    console.error(errorMsg)
    throw new Error(errorMsg)
  }

  if (deleteAssociationList.length) {
    console.log('Deleting workspace associations...')
    try {
      // Chunk associations into 100 associations per request.
      const deleteAssociationBatches = _.chunk(deleteAssociationList, HUBSPOT_OBJECT_BATCH_LIMIT)
      let page = 0
      const totalBatches = Math.ceil(deleteAssociationBatches.length / HUBSPOT_OBJECT_BATCH_LIMIT)

      while (page < totalBatches) {
        // eslint-disable-next-line no-await-in-loop
        await Hubspot.use().apiRequest({
          method: 'POST',
          path: (
            `/crm/v3/associations/${workspaceObjectType}/${CONTACT_OBJECT_TYPE_ID}/batch/archive`
          ),
          body: {
            inputs: deleteAssociationBatches[page],
          },
        })
        page++
      }

      // send out requests per each chunk
    } catch (err) {
      const errorMsg = (`Error adding workspace associations - ${err.message}`)
      console.error(errorMsg)
      throw new Error(errorMsg)
    } finally {
      console.log('Done')
    }
  }

  if (addAssociationList.length) {
    console.log('Adding workspace associations...')
    try {
      const addAssociationBatches = _.chunk(addAssociationList, HUBSPOT_OBJECT_BATCH_LIMIT)
      let page = 0
      const totalBatches = Math.ceil(addAssociationBatches.length / HUBSPOT_OBJECT_BATCH_LIMIT)

      while (page < totalBatches) {
      // eslint-disable-next-line no-await-in-loop
        await Hubspot.use().apiRequest({
          method: 'POST',
          path: `/crm/v3/associations/${workspaceObjectType}/contacts/batch/create`,
          body: {
            inputs: addAssociationBatches[page],
          },
        })
        page++
      }
    } catch (err) {
      const errorMsg = (`Error deleting workspace associations - ${err.message}`)
      console.error(errorMsg)
      throw new Error(errorMsg)
    } finally {
      console.log('Done')
    }
  }
}

const generateWorkspaceObjects = async (dataRealm: string, dryRun: string) => {
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

    let accounts: Account[]
    try {
      // Fetch all xrhome accounts from DB
      console.log('Fetching accounts from DB...')
      accounts = await getAllXrhomeDbAccounts()
      console.log(`# of accounts fetched: ${accounts.length}`)
    } catch (err) {
      console.error(`Error fetching DB accounts - ${err.message}`)
    }

    if (!accounts) {
      console.error('No accounts found in DB')
      return
    }

    if (isDryRun) {
      console.log(`Dry run. # of accounts being migrated: ${accounts.length}`)
    } else {
      // Get workspace object id and generate associations
      const {objectTypeId, associations} = await Hubspot.use().apiRequest({
        method: 'GET',
        path: `/crm/v3/schemas/${WORKSPACE_OBJECT_NAME}`,
      })

      const validAssociations = associations.filter(association => (
        association.fromObjectTypeId === objectTypeId &&
        Object.values(USER_ACCOUNT_ROLE_TO_ASSOCIATION_NAME_MAP).includes(association.name)
      ))

      // Split all accounts into subarrays of 100 accounts to batch create.
      const accountBatches = _.chunk(accounts, HUBSPOT_OBJECT_BATCH_LIMIT)
      let page = 0
      const totalBatches = Math.ceil(accountBatches.length / 10)

      while (page < totalBatches) {
        // Take 10 (100 account) batches (1000 accounts total per batch)
        // and create workspace objects.
        const recordOffset = (page * 10)
        const batch = accountBatches.slice(recordOffset, recordOffset + 10)
        const flatBatch = _.flatten(batch)
        try {
          // eslint-disable-next-line no-await-in-loop
          const readResults = await Promise.all(batch.map(async accs => (
            Hubspot.use().apiRequest(createBatchReadRequest(accs))
          )))

          const listOfUncreatedAccounts = readResults.map(
            (result) => {
              if (!result?.errors) {
                return []
              }

              // if result errors exists, there are accounts to be created, return those accounts.
              const notFoundError = (
                result.errors.find(err => err.category === 'OBJECT_NOT_FOUND')
              )

              if (!notFoundError) {
                return []
              }

              return (
                notFoundError.context.ids.map(
                  id => flatBatch.find(acc => acc.shortName === id)
                )
              )
            }

          )

          // Create all workspace objects for each xrhome account.
          console.log(`Creating workspace objects for batch ${page + 1} of ${totalBatches}...`)
          // eslint-disable-next-line no-await-in-loop
          await Promise.all(listOfUncreatedAccounts.map(async accs => (
            createHubspotWorkspaceObjectBatch(accs, objectTypeId, validAssociations)
          )))
          console.log('Done')

          const listOfAccountToUpdate = readResults.map(
            (result) => {
              if (!result?.results) {
                return []
              }

              return result.results.map(({properties}) => {
                const accToBeUpdated = flatBatch.find(
                  acc => properties.short_name === acc.shortName
                )

                return {
                  ...accToBeUpdated,
                  workspaceId: properties.hs_object_id,
                }
              })
            }
          )

          console.log(`Updating workspace objects for batch ${page + 1} of ${totalBatches}...`)
          // eslint-disable-next-line no-await-in-loop
          await Promise.all(listOfAccountToUpdate.map(async accs => (
            updateHubspotWorkspaceObject(accs, objectTypeId, validAssociations)
          )))
          console.log('Finishing up batch...')
          // eslint-disable-next-line no-await-in-loop
          await delay(10000)
        } finally {
          page++
          console.log(
            `Batch ${page} of ${totalBatches} completed (batch size: ${flatBatch.length} accounts)`
          )
        }
      }
    }

    console.log('Script Complete')
  } catch (err) {
    console.error(err)
  } finally {
    closeDbConnection()
  }
}

generateWorkspaceObjects(process.argv[2], process.argv[3])
