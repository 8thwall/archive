#!/usr/bin/env npx ts-node

// Usage:
//   > ./fix-contacts.ts <data-realm> <dry-run>

/* eslint-disable no-console */

import {GetSecretValueCommand, SecretsManagerClient} from '@aws-sdk/client-secrets-manager'
import {Client as HubSpotClient} from '@hubspot/api-client'
import * as fs from 'fs/promises'
import {Op, fn, col, literal, cast} from 'sequelize'
import type {SimplePublicObject} from '@hubspot/api-client/lib/codegen/crm/companies'

import dbConfigForEnv from '../../config/db'
import {Db} from '../../src/shared/integration/db/db-api'
import {createDb} from '../../src/shared/integration/db/db-impl'
import {makeRunQueue} from '../../src/shared/run-queue'

// These are the properties we want to copy from the old contact to the new contact.
// We cannot copy all contact properties because many properties are read-only or calculated-only.
const WRITABLE_PROPERTIES = [
  'address',
  'annualrevenue',
  'associatedcompanyid',
  'city',
  'company',
  'company_size',
  'country',
  'date_of_birth',
  'degree',
  'free_trial_end_date',
  'free_trial_stage',
  'free_trial_workspace_shortname',
  'gender',
  'graduation_date',
  'job_function',
  'lifecyclestage',
  'mobilephone',
  'phone',
  'state',
  'website',
  'work_email',
  'zip',
]

const SecretsManager = new SecretsManagerClient({region: 'us-west-2'})

const getSecret = async (secretName: string) => {
  const res = await SecretsManager.send(new GetSecretValueCommand({
    SecretId: secretName,
  }))

  return JSON.parse(res.SecretString)
}

const initDb = async (dbSecretName: string) => {
  const dbSecret = await getSecret(dbSecretName)
  process.env.DB_USERNAME = dbSecret.username
  process.env.DB_PASSWORD = dbSecret.password
  process.env.DB_NAME = dbSecret.dbname
  process.env.HOSTNAME = dbSecret.host

  const dbEnv = dbSecretName.startsWith('/Prod') ? 'production' : 'development'

  Db.register(createDb({
    ...dbConfigForEnv(dbEnv),
    ...(dbSecretName.startsWith('/Prod') ? {port: 5454} : {}),
  }))

  return () => Db.use().sequelize.close()
}

let closeDbConnection: () => Promise<void> | undefined

const chunkItems = <T>(items: T[], chunkSize: number) => items
  .reduce((acc, request, i) => {
    const chunkIndex = Math.floor(i / (chunkSize))
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []
    }
    acc[chunkIndex].push(request)
    return acc
  }, [] as T[][])

const makeAcUserUrl = (dataRealm: string, uuid: string) => (
  `https://${dataRealm === 'prod' ? 'ac' : 'ac.qa'}.8thwall.com/user/${uuid}`
)

const run = async (dataRealm: string, dryRun: string = 'true') => {
  try {
    const isDryRun = dryRun ? dryRun === 'true' : true
    if (isDryRun) {
      console.log('\n***********************')
      console.log('** THIS IS A DRY RUN **')
      console.log('***********************\n')
    }

    const secretPrefix = dataRealm.toLowerCase() === 'prod' ? '/Prod' : '/Dev'
    const dbSecretName = `${secretPrefix}/xrhome/pg`

    closeDbConnection = await initDb(dbSecretName)

    const crmIdCounts = await Db.use().User.findAll({
      attributes: [
        [cast(col('crmId'), 'VARCHAR'), 'crmId'],
        [fn('COUNT', col('crmId')), 'count'],
      ],
      where: {
        crmId: {
          [Op.ne]: null,
        },
      },
      group: 'crmId',
      having: literal('count(*) > 1'),
    }) as any as Array<{crmId: string, count: string}>

    const hubSpotSecretName = `${secretPrefix}/data/hubspot-sync-access-token`
    const hubSpotSecret = await getSecret(hubSpotSecretName)
    const HubSpot = new HubSpotClient({
      accessToken: hubSpotSecret.accessToken,
      numberOfApiCallRetries: 6,
    })

    // HubSpot has a limit of 100 inputs per batch read.
    const maxInputSize = 100
    const chunkedCrmIdCounts = chunkItems(crmIdCounts, maxInputSize)

    const runQueue = makeRunQueue()

    // Multiple users are mapped to these contacts.
    const contactsWithMultipleUsers: Record<string, SimplePublicObject> = (await Promise.all(
      chunkedCrmIdCounts.flatMap(chunk => runQueue.next(() => (
        HubSpot.crm.contacts.batchApi.read({
          properties: [
            ...WRITABLE_PROPERTIES,
            'hs_additional_emails',
          ],
          propertiesWithHistory: [],
          inputs: chunk.map(crmIdCount => ({id: crmIdCount.crmId})),
        })
      )))
    ))
      .flatMap(res => res.results)
      .reduce((acc, contact) => {
        acc[contact.id] = contact
        return acc
      }, {})

    const contactsWithMultipleUsersButNoAdditionalEmails = []
    const additionalEmails = []

    Object.values(contactsWithMultipleUsers).forEach((contact: any) => {
      if (contact.errors?.length) {
        console.error('Error fetching crmId:', contact.id, JSON.stringify(contact.errors, null, 2))
      }

      if (contact.properties.hs_additional_emails) {
        additionalEmails.push(...contact.properties.hs_additional_emails.split(';'))
        return
      }

      contactsWithMultipleUsersButNoAdditionalEmails.push(contact)
    })

    const usersThatNeedHumanReview = await Db.use().User.findAll({
      where: {
        crmId: {
          [Op.in]: contactsWithMultipleUsersButNoAdditionalEmails.map(c => c.id),
        },
      },
    })

    const normalizedUsersThatNeedHumanReview = usersThatNeedHumanReview.reduce((acc, user) => {
      if (!acc[user.crmId]) {
        acc[user.crmId] = []
      }

      acc[user.crmId].push(user)
      return acc
    }, {})

    const usersFromAdditionalEmails = await Db.use().User.findAll({
      where: {
        primaryContactEmail: {
          [Op.in]: additionalEmails,
        },
      },
    })

    const dir = `${__dirname}/output/${dataRealm}`
    await fs.mkdir(dir, {recursive: true})
    await Promise.all([
      fs.writeFile(
        `${dir}/contacts-with-multiple-users.json`,
        JSON.stringify(contactsWithMultipleUsers, null, 2),
        'utf8'
      ),
      fs.writeFile(
        `${dir}/users-that-need-review.json`,
        JSON.stringify(normalizedUsersThatNeedHumanReview, null, 2),
        'utf8'
      ),
      fs.writeFile(
        `${dir}/users-from-additional-emails.json`,
        JSON.stringify(usersFromAdditionalEmails, null, 2),
        'utf8'
      ),
      console.log(`Read output written to ${dir}`),
    ])

    if (isDryRun) {
      return
    }

    // HubSpot doesn't allow you to create a contact with the same email that already exists as
    // an additional email on another contact. So we need to remove the additional emails first.
    await Promise.all(usersFromAdditionalEmails
      .map(user => runQueue.next(async () => {
        await HubSpot.apiRequest({
          method: 'DELETE',
          path: `/contacts/v1/secondary-email/${user.crmId}/email/${user.primaryContactEmail}`,
        })
        console.log(`Removed email: ${user.primaryContactEmail} from contact: ${user.crmId}`)

        // Prevent HubSpot's 15 requests per second rate limit.
        await new Promise(resolve => setTimeout(resolve, 100))
      })))

    await Promise.all(usersFromAdditionalEmails.map(user => runQueue.next(async () => {
      const {properties} = contactsWithMultipleUsers[user.crmId]
      const newProperties = WRITABLE_PROPERTIES.reduce((acc, prop) => {
        acc[prop] = properties[prop]
        return acc
      }, {})

      const newContact = await HubSpot.crm.contacts.basicApi.create({
        properties: {
          ...newProperties,
          'email': user.primaryContactEmail,
          'email_verified': user.emailVerified.toString(),
          'firstname': user.givenName,
          'lastname': user.familyName,
          'user_uuid': user.uuid,
          'release_admin_user': makeAcUserUrl(dataRealm, user.uuid),
        },
        associations: null,
      })
      console.log(
        'Created new contact for user:', user.uuid,
        'email:', user.primaryContactEmail,
        'new crmId:', newContact.id
      )

      await user.update({crmId: newContact.id})
      console.log('Updated user row:', user.uuid, 'with new crmId:', newContact.id)

      // Prevent HubSpot's 15 requests per second rate limit.
      await new Promise(resolve => setTimeout(resolve, 100))
    })))
  } finally {
    await closeDbConnection()
  }
}

run(process.argv[2], process.argv[3])
