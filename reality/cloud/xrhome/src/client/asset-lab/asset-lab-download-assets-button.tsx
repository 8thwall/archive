import React from 'react'
import {useTranslation} from 'react-i18next'

import type JSZip from 'jszip'

import {Icon} from '../ui/components/icon'
import {TertiaryButton} from '../ui/components/tertiary-button'
import {useSelector} from '../hooks'
import useCurrentAccount from '../common/use-current-account'
import {downloadAndZip, downloadAndZipImage, downloadBlob} from '../common/download-utils'
import {makeRunQueue} from '@nia/reality/shared/run-queue'
import {resolveAll} from '../../shared/async'
import {createThemedStyles} from '../ui/theme'
import {Tooltip} from '../ui/components/tooltip'
import {isAssetGenerationMesh} from './types'
import {getImageUrl, getMeshUrl, getOptimizedMeshUrl} from '../../shared/genai/constants'

const useStyles = createThemedStyles(() => ({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    verticalAlign: 'middle',
    alignItems: 'center',
    gap: '0.25rem',
  },
}))

type ProgressState = {
  current: number
  total: number
}

const getIdFromUrl = (url: string): string | null => {
  try {
    const u = new URL(url)
    const {pathname} = u
    return pathname.split('/').pop() || null
  } catch {
    return null
  }
}

// This is different from getIdFromUrl because the mesh URL is a different format. Example:
/* eslint-disable max-len */
// https://cdn-dev.8thwall.com/asset-generations/6e68aee8-431d-4578-8214-c7e3ddbbad3d/9d40827d-33a5-45e9-96c4-8ee1613a7a0e/optimized.glb -> '9d40827d-33a5-45e9-96c4-8ee1613a7a0e-optimized.glb'
// https://cdn-dev.8thwall.com/asset-generations/eeb93d6a-8672-4627-97d3-f2ee9b9585bd/dc0985d4-e0ea-4534-b245-ba71c14bb194.glb -> 'dc0985d4-e0ea-4534-b245-ba71c14bb194.glb'
/* eslint-enable max-len */
const meshIdAndExtensionFromUrl = (url: string): string => {
  try {
    const u = new URL(url)
    const {pathname} = u
    if (pathname.endsWith('/optimized.glb')) {
      return `${pathname.split('/').slice(-2, -1)[0]}-optimized.glb`
    }
    return pathname.split('/').pop()
  } catch {
    return null
  }
}

const saveGenerationImage = async (
  zip: JSZip,
  requestFolder: string,
  generationUuid: string,
  accountUuid: string | undefined
): Promise<void> => {
  const primaryImageUrl = getImageUrl(accountUuid, generationUuid)
  if (!primaryImageUrl) {
    return
  }
  await downloadAndZipImage(
    zip,
    `${requestFolder}/${generationUuid}`,
    primaryImageUrl
  )
}

const saveMeshAssets = async (
  zip: JSZip,
  requestFolder: string,
  accountUuid: string | undefined,
  assetGeneration: any
): Promise<void> => {
  const promises: Promise<any>[] = []

  if (assetGeneration?.metadata?.optimizer?.completed) {
    const optimizedMeshUrl = getOptimizedMeshUrl(
      accountUuid,
      assetGeneration.uuid,
      assetGeneration.metadata?.optimizer?.timestampMs
    )
    promises.push(downloadAndZip(
      zip,
      `${requestFolder}/${assetGeneration.uuid}-optimized.glb`,
      optimizedMeshUrl
    ))
  }
  const meshUrl = getMeshUrl(accountUuid, assetGeneration.uuid)
  promises.push(downloadAndZip(
    zip,
    `${requestFolder}/${assetGeneration.uuid}.glb`,
    meshUrl
  ))

  await resolveAll(promises)
}

const AssetLabDownloadAssetsButton: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['asset-lab', 'common'])
  const currentAccount = useCurrentAccount()
  const assetRequests = useSelector(s => s.assetLab.assetRequests) || []
  const [progressState, setProgressState] = React.useState<ProgressState | null>(null)
  const [errors, setErrors] = React.useState<string[]>([])

  if (!currentAccount) {
    return null
  }

  const handleDownload = async () => {
    try {
      const JsZip = (await import('jszip')).default
      const zip = new JsZip()

      const assetRequestsForCurrentAccount = Object
        .values(assetRequests)
        .filter(req => req.AccountUuid === currentAccount.uuid)

      const queue = makeRunQueue(10)

      const total = assetRequestsForCurrentAccount.length
      setProgressState({current: 0, total})
      let completed = 0
      const currentErrors: string[] = []

      await resolveAll(assetRequestsForCurrentAccount.map(request => queue.next(async () => {
        const requestFolder = request.uuid
        zip.file(`${requestFolder}/request.json`, JSON.stringify(request, null, 2))

        // Download input images used in the request.
        const imageUrls = request.input?.imageUrls || []
        await resolveAll(imageUrls.map(async (url: string) => {
          try {
            const idFromUrl = getIdFromUrl(url)
            if (!idFromUrl) {
              return
            }
            await downloadAndZipImage(zip, `${requestFolder}/${idFromUrl}`, url)
          } catch (error) {
            // eslint-disable-next-line local-rules/hardcoded-copy
            currentErrors.push(`Failed to download image ${url}: ${error.message}`)
          }
        }))

        // Download input mesh URL used in the request.
        const meshUrl = request.input?.meshUrl
        if (meshUrl) {
          try {
            const meshIdAndExtension = meshIdAndExtensionFromUrl(meshUrl)
            if (!meshIdAndExtension) {
              return
            }
            await downloadAndZip(zip, `${requestFolder}/${meshIdAndExtension}`, meshUrl)
          } catch (error) {
            // eslint-disable-next-line local-rules/hardcoded-copy
            currentErrors.push(`Failed to download mesh ${meshUrl}: ${error.message}`)
          }
        }

        // Download the output files.
        await resolveAll(request.AssetGenerations?.map(async (assetGeneration) => {
          try {
            zip.file(
              `${requestFolder}/${assetGeneration.uuid}.json`,
              JSON.stringify(assetGeneration, null, 2)
            )

            if (isAssetGenerationMesh(assetGeneration)) {
              return await saveMeshAssets(
                zip,
                requestFolder,
                currentAccount?.uuid,
                assetGeneration
              )
            } else {
              return await saveGenerationImage(
                zip,
                requestFolder,
                assetGeneration.uuid,
                currentAccount?.uuid
              )
            }
          } catch (error) {
            currentErrors.push(
              // eslint-disable-next-line local-rules/hardcoded-copy
              `Failed to download asset generation ${assetGeneration.uuid}: ${error.message}`
            )
            return Promise.resolve(null)
          }
        }))

        completed++
        setProgressState({current: completed, total})
      })))

      const zipBlob = await zip.generateAsync({type: 'blob'})
      downloadBlob(zipBlob, `asset-lab-${currentAccount.uuid}.zip`)
      setErrors(currentErrors)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      setErrors([error.message])
    } finally {
      setProgressState(null)
    }
  }

  return (
    <TertiaryButton
      height='small'
      onClick={handleDownload}
      disabled={progressState !== null}
    >
      <span className={classes.buttonContainer}>
        <Icon inline stroke='download' />

        {progressState
          ? t(
            'asset_lab.download_assets_progress',
            {current: progressState.current, total: progressState.total}
          )
          : t('asset_lab.download_assets')}
        {errors.length > 0 &&
          <Tooltip
            content={errors.map(error => <div key={error}>{error}</div>)}
            position='bottom-start'
          >
            <Icon inline stroke='warning' color='warning' />
          </Tooltip>
        }
      </span>
    </TertiaryButton>
  )
}

export {
  AssetLabDownloadAssetsButton,
}
