#!/usr/bin/env npx tsx

// Usage:
//   > ./backfill-asset-requests.ts <data-realm> <dry-run>

import * as fs from 'node:fs/promises'
import {Op} from 'sequelize'

import {Db} from '../../src/shared/integration/db/db-api'
import type {AssetRequest} from '../../src/shared/integration/db/models'
import {connectDb} from './db-connection'
import {
  getImageToImageParent,
  getImageToMeshParent,
  getMeshToAnimationParent,
} from './parent-request'

let lastCompletedStep = 0

const VALID_TYPES = [
  'TEXT_TO_IMAGE',
  'IMAGE_TO_IMAGE',
  'IMAGE_TO_MESH',
  'MESH_TO_ANIMATION',
]

// NOTE(kyle): The input fields are taken from xrhome/src/shared/genai/types/
const baseInputFields = [
  'type',
]

const toImageInputFields = [
  ...baseInputFields,
  'aspectRatio',
  'outputFormat',
]

const textToImageInputFields = [
  ...toImageInputFields,
]

const imageToImageInputFields = [
  ...toImageInputFields,
  'imageUrls',
]

const imageToMeshInputFields = [
  ...baseInputFields,
  'imageUrls',
  'ssGuidanceStrength',
  'ssSamplingSteps',
  'slatGuidanceStrength',
  'slatSamplingSteps',
  'meshSimplify',
  'textureSize',
  'multiimageAlgo',
  'numInferenceSteps',
  'guidanceScale',
  'octreeResolution',
  'texturedMesh',
]

const meshToAnimationInputFields = [
  ...baseInputFields,
  'unriggedMeshUrl',
]

const getFieldsForType = (type: AssetRequest['type']) => {
  switch (type) {
    case 'TEXT_TO_IMAGE': return textToImageInputFields
    case 'IMAGE_TO_IMAGE': return imageToImageInputFields
    case 'IMAGE_TO_MESH': return imageToMeshInputFields
    case 'MESH_TO_ANIMATION': return meshToAnimationInputFields
    default: return []
  }
}

// NOTE(kyle): asset-generator writes fields into AsseGenerations.metadata in snake_case.
const makeSnakeCase = (word: string) => word.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

const makeSaveCheckpoint = (assetRequestsFile: string, lastCompletedStepFile: string) => async (
  step: number,
  assetRequests: AssetRequest[]
) => {
  const assetRequestChanges = assetRequests.map(ar => ({
    ...ar.get({plain: true}),
    changed: ar.changed(),
  }))
  await fs.writeFile(assetRequestsFile, JSON.stringify(assetRequestChanges, null, 2))
  console.log(`Wrote AssetRequests to ${assetRequestsFile}`)
  await fs.writeFile(lastCompletedStepFile, String(step))
  console.log(`Wrote last completed step to ${lastCompletedStepFile}`)
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
    disconnectDb = await connectDb(dbSecretName)
    const {AssetRequest, AssetGeneration, CreditBalanceTransaction, sequelize} = Db.use()

    const dir = `${__dirname}/out/${dataRealm}`
    const assetRequestsFile = `${dir}/asset-requests.json`
    const lastCompletedStepFile = `${dir}/last-completed-step.json`
    const failedSavesFile = `${dir}/failed-saves.json`
    await fs.mkdir(dir, {recursive: true})
    const saveCheckpoint = makeSaveCheckpoint(assetRequestsFile, lastCompletedStepFile)

    console.log('Finding AssetRequests that need backfilling...')
    await sequelize.transaction(async (transaction) => {
      const assetRequests = await AssetRequest.findAll({
        where: {
          [Op.or]: [
            {ParentRequestUuid: null},
            {type: null},
            {input: null},
            {totalActionQuantity: null},
          ],
        },
        include: [
          {
            model: AssetGeneration,
            as: 'AssetGenerations',
            required: false,
          },
        ],
        transaction,
      })

      const cbtsForReqMissingCost = await CreditBalanceTransaction.findAll({
        attributes: [
          'AssetRequestUuid',
          [
            sequelize.fn('max', sequelize.col('totalActionQuantity')),
            'totalActionQuantity',
          ],
        ],
        where: {
          AssetRequestUuid: assetRequests
            .filter(ar => ar.totalActionQuantity === null)
            .map(ar => ar.uuid),
          type: 'REDEEM',
        },
        group: ['AssetRequestUuid'],
      })

      console.log('Setting totalActionQuantity...')
      assetRequests.forEach((assetReq) => {
        // NOTE(kyle): Using find incurs O(n) search on every iteration but that's okay for a
        // locally run backfill script.
        const cost = cbtsForReqMissingCost.find(cbt => cbt.AssetRequestUuid === assetReq.uuid)
        if (!cost) {
          return
        }
        assetReq.set({totalActionQuantity: cost.totalActionQuantity})
      })
      await saveCheckpoint(++lastCompletedStep, assetRequests)

      console.log('Setting type...')
      assetRequests.forEach((assetReq) => {
        if (assetReq.type) {
          return
        }
        const assetGen = assetReq.AssetGenerations[0]
        if (!assetGen) {
          return
        }
        const type = assetGen.metadata?.type
        if (!type || !VALID_TYPES.includes(type as string)) {
          return
        }
        assetReq.set({type})
      })
      await saveCheckpoint(++lastCompletedStep, assetRequests)

      console.log('Setting input...')
      assetRequests.forEach((assetReq) => {
        if (assetReq.input) {
          return
        }
        const assetGen = assetReq.AssetGenerations[0]
        if (!assetGen) {
          return
        }
        // NOTE(kyle): numRequests is lost on backfills, we never stored that anywhere.
        const input = {
          type: assetGen.metadata?.type,
          modelId: assetGen.modelName,
          prompt: assetGen.prompt,
          negativePrompt: assetGen.negativePrompt,
          style: assetGen.style,
        }
        const fields = getFieldsForType(assetReq.type)
        fields.forEach((field) => {
          const snakeCaseField = makeSnakeCase(field)
          const value = assetGen.metadata?.[snakeCaseField]
          if (value === undefined) {
            return
          }
          // NOTE(kyle): unrigged_mesh_url is a special case that should be rewritten to meshUrl.
          // There's also some unriggged_mesh_url entries (typo with extra g) that was fixed by
          // https://github.com/8thwall/code8/pull/1542. Not going to fix those because those
          // typos never made it to prod.
          if (snakeCaseField === 'unrigged_mesh_url') {
            // @ts-ignore Ignoring the type error that meshUrl does not exist on input.
            input.meshUrl = value
          } else {
            input[field] = value
          }
        })
        assetReq.set({input})
      })
      await saveCheckpoint(++lastCompletedStep, assetRequests)

      console.log('Setting ParentRequestUuid...')
      const setParentPromises = assetRequests.map(async (assetReq) => {
        if (assetReq.ParentRequestUuid) {
          return
        }

        let parentRequestUuid: string | null = null
        switch (assetReq.type) {
          case 'TEXT_TO_IMAGE': return
          case 'IMAGE_TO_IMAGE':
            parentRequestUuid = await getImageToImageParent(assetReq)
            break
          case 'IMAGE_TO_MESH':
            parentRequestUuid = await getImageToMeshParent(assetReq)
            break
          case 'MESH_TO_ANIMATION':
            parentRequestUuid = await getMeshToAnimationParent(assetReq)
            break
          default: return
        }

        if (parentRequestUuid) {
          assetReq.set({ParentRequestUuid: parentRequestUuid})
        }
      })
      await Promise.all(setParentPromises)
      const assetReqWithChanges = assetRequests.filter(ar => ar.changed())
      await saveCheckpoint(++lastCompletedStep, assetReqWithChanges)
      console.log(`${assetReqWithChanges.length} AssetRequests need to be updated`)

      if (!isDryRun) {
        const backfillRes = await Promise.allSettled(
          assetRequests.map(async (assetReq) => {
            const res = await assetReq.save({transaction})
            console.log('Updated', assetReq.uuid)
            return res
          })
        )
        const failedSaves = backfillRes.filter(e => e.status === 'rejected')
        if (failedSaves.length) {
          await fs.writeFile(failedSavesFile, JSON.stringify(failedSaves, null, 2))
          throw new Error(`Failed to save ${failedSaves.length} AssetRequests`)
        }
        console.log('Backfill complete!')
      }
    })
  } finally {
    if (disconnectDb) {
      await disconnectDb()
    }
  }
}

backfill(process.argv[2], process.argv[3])
