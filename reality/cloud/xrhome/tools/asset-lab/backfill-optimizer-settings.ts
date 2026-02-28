#!/usr/bin/env npx tsx

// Usage:
//   > ./backfill-optimizer-settings.ts <data-realm> <dry-run>

import {S3Client, ListObjectsV2Command, ListObjectsV2CommandOutput} from '@aws-sdk/client-s3'

import {Db} from '../../src/shared/integration/db/db-api'
import {
  POSITION,
  ROTATION,
  SCALE,
  SETTINGS,
  makeOptimizerMetadata,
} from '../../src/client/asset-lab/hooks/use-request-model-post-processing'
import {connectDb} from './db-connection'

const S3 = new S3Client({region: 'us-west-2'})

const listOptimizedGlbKeys = async (bucket: string) => {
  const keys: string[] = []
  let continuationToken: string | undefined

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      ContinuationToken: continuationToken,
    })

    // eslint-disable-next-line no-await-in-loop
    const response: ListObjectsV2CommandOutput = await S3.send(command)
    const validGlbKeys = response.Contents
      ?.map(obj => obj.Key || '')
      .filter((key) => {
        const parts = key.split('/')
        // eslint-disable-next-line max-len
        // e.g. asset-generations/eeb93d6a-8672-4627-97d3-f2ee9b9585bd/fcc769b3-85c5-42aa-a342-504307599717/optimized.glb"
        return (
          parts.length === 4 &&
            parts[0] === 'asset-generations' &&
            parts[3] === 'optimized.glb'
        )
      })
    keys.push(...validGlbKeys || [])
    continuationToken = response.NextContinuationToken
  } while (continuationToken)

  return keys
}

const backfill = async (dataRealm: string, dryRun: string) => {
  let disconnectDb: () => Promise<void>
  try {
    const isDryRun = dryRun ? dryRun === 'true' : true
    if (isDryRun) {
      console.log('\n***********************')
      console.log('** THIS IS A DRY RUN **')
      console.log('***********************\n')
    }

    const secretPrefix = dataRealm.toLowerCase() === 'prod' ? '/Prod' : '/Dev'
    const dbSecretName = `${secretPrefix}/xrhome/pg`
    const s3Bucket = dataRealm.toLowerCase() === 'prod'
      ? 'asset-generations-prod'
      : 'asset-generations-qa'

    disconnectDb = await connectDb(dbSecretName)

    console.log(`Listing all objects in S3 bucket: ${s3Bucket}...`)
    const optimizedGlbKeys = await listOptimizedGlbKeys(s3Bucket)
    console.log(`Found ${optimizedGlbKeys.length} total optimized GLB files`)

    console.log('Querying for AssetGenerations that need backfilling...')
    const modelGens = await Db.use().AssetGeneration.findAll({
      where: {
        uuid: optimizedGlbKeys.map(key => key.split('/')[2]),
        assetType: 'MESH',
        metadata: {
          optimizer: null,
        },
      },
    })
    console.log(`Found ${modelGens.length} AssetGenerations that need backfilling`)

    if (!isDryRun) {
      console.log('Updating AssetGenerations...')
      await Db.use().AssetGeneration.update(
        {
          metadata: Db.use().sequelize.fn(
            'jsonb_set',
            Db.use().sequelize.col('metadata'),
            '{optimizer}',
            JSON.stringify(makeOptimizerMetadata(
              SETTINGS,
              POSITION,
              ROTATION,
              SCALE
            ))
          ),
        },
        {
          where: {
            uuid: modelGens.map(mg => mg.uuid),
          },
        }
      )
    }
    console.log('Backfill complete!')
  } catch (error) {
    console.error('Error during backfill:', error)
    throw error
  } finally {
    if (disconnectDb) {
      await disconnectDb()
    }
  }
}

backfill(process.argv[2], process.argv[3])
