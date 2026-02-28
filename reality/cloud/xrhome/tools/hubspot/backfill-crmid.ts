#!/usr/bin/env npx ts-node

// Usage:
//   > ./backfill-crmid.ts <data-realm> <dry-run>

// On March 20th, 2024 crmId was migrated from INTEGER to VARCHAR(255).
// https://github.com/8thwall/prod8/pull/795
// This script backfills any crmId that was not previously set if the HubSpot contact ID
// was greater than 4 bytes.

/* eslint-disable no-console */

import {GetSecretValueCommand, SecretsManagerClient} from '@aws-sdk/client-secrets-manager'
import type {SimplePublicObject} from '@hubspot/api-client/lib/codegen/crm/contacts'
import {Client as HubSpotClient} from '@hubspot/api-client'
import * as fs from 'fs/promises'

import {Db} from '../../src/shared/integration/db/db-api'
import {createDb} from '../../src/shared/integration/db/db-impl'
import dbConfigForEnv from '../../config/db'

const MAX_SEARCH_SIZE = 100
const PG_MAX_INTEGER = (2 ** 31) - 1

let closeDbConnection: () => Promise<void>

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

const backfill = async (dataRealm: string, dryRun: string) => {
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

    const hubSpotSecretName = `${secretPrefix}/data/hubspot-sync-access-token`
    const hubSpotSecret = await getSecret(hubSpotSecretName)
    const HubSpot = new HubSpotClient({
      accessToken: hubSpotSecret.accessToken,
      numberOfApiCallRetries: 6,
    })

    const doSearch = (after: number) => HubSpot.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'hs_object_id',
              operator: 'GT',
              value: PG_MAX_INTEGER.toString(),
            },
          ],
        },
      ],
      sorts: ['createDate'],
      properties: ['user_uuid'],
      limit: MAX_SEARCH_SIZE,
      after,
    })

    let searchAfter = 0
    const contacts: SimplePublicObject[] = []
    const dir = `${__dirname}/output/${dataRealm}`
    const outputLocation = `${dir}/contacts-with-big-ids.json`
    await fs.mkdir(dir, {recursive: true})

    console.log('Searching for contacts with IDs greater than', PG_MAX_INTEGER)
    do {
      // eslint-disable-next-line no-await-in-loop
      const page = await doSearch(searchAfter)
      // Contacts that do not have a user_uuid are ones created by:
      //  - Lightship
      //  - Zendesk
      //  - Website Form
      //  - HubSpot Gmail plugin
      //  - Manual contact import
      contacts.push(...page.results.filter(contact => !!contact.properties.user_uuid))
      searchAfter = parseInt(page.paging?.next?.after, 10)
    } while (searchAfter)

    console.log(
      `Found ${contacts.length} contacts with IDs greater than`,
      PG_MAX_INTEGER,
      'with a corresponding user_uuid'
    )
    await fs.writeFile(outputLocation, JSON.stringify(contacts, null, 2))

    if (isDryRun) {
      console.log(`Dry run complete, output written to ${outputLocation}`)
      return
    }

    console.log('Backfilling Users with crmId from HubSpot contacts...')
    await Promise.all(contacts.map(async (contact) => {
      const [affectedRows] = await Db.use().User.update(
        {crmId: contact.id},
        {
          where: {
            uuid: contact.properties.user_uuid,
            crmId: null,
          },
        }
      )

      if (affectedRows) {
        console.log(
          'Updated user',
          contact.properties.user_uuid,
          'with crmId',
          parseInt(contact.id, 10)
        )
      }
    }))
    console.log('Done!')
  } finally {
    closeDbConnection()
  }
}

backfill(process.argv[2], process.argv[3])
