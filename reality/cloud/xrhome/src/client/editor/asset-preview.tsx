import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {
  IMAGE_FILES,
  SPECIAL_IMAGE_FILES,
  VIDEO_FILES,
  AUDIO_FILES,
  MODEL_FILES,
  NO_PREVIEW_MODEL_FILES,
  TEXT_FILES,
} from '../common/editor-files'
import {fileExt} from './editor-common'
import StudioModelPreview from '../studio/studio-model-preview-with-loader'
import CustomImagePreview from './custom-image-preview'
import {getAssetUrl} from '../common/hosting-urls'
import {getMainPath} from '../../shared/asset-pointer'
import TextPreview from './text-preview'
import {
  brandLight, statusRounding, statusShadow, gray1, brandBlack, almostBlack, gray3,
} from '../static/styles/settings'
import {combine} from '../common/styles'
import {fetchSize} from '../common/fetch-utils'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import {AudioPreview, ImagePreview, VideoPreview} from './asset-previews/asset-previewers'
import type {AssetDimension, AdditionalAssetData, ModelInfo, HcapInfo} from './asset-preview-types'
import useActions from '../common/use-actions'
import editorActions from './editor-actions'
import {SECONDS_PER_HOUR, SECONDS_PER_MINUTE} from '../../shared/time-utils'
import {formatBytesToText} from '../../shared/asset-size-limits'

const sizeCache: Record<string, number> = {}

const useStyles = createUseStyles({
  publicAssetView: {
    'position': 'relative',
    'minHeight': '35em',
    'borderBottomRightRadius': statusRounding,
    'borderBottomLeftRadius': statusRounding,
    'boxShadow': statusShadow,
    'display': 'flex',
    'flexDirection': 'column',
    'flex': '1 0 35rem',
    'background':
      `radial-gradient(circle, ${brandLight}, #c1aad8)`,
    'backgroundSize': '150%',
    'backgroundPosition': 'center',
    '& .model-preview': {
      'display': 'flex !important',
      'flex': '1 0 35rem',
      'flexDirection': 'column !important',
    },
    '& a-scene': {
      flex: '1 0 0',
    },
    '--asset-metadata-background': gray1,
    '--asset-metadata-color': brandBlack,
    '--lil-gui-title-text-color': almostBlack,
    '--lil-gui-widget-color': gray3,
  },
  assetPreview: {
    'position': 'relative',
    'borderTop': 'var(--pane-border-style)',
    'minWidth': '0',
    'minHeight': '0',
    'backgroundColor': 'var(--asset-preview-background)',
    'display': 'flex',
    'flexDirection': 'column',
    'flex': '1 0 auto',

    '& img, audio, video, canvas': {
      display: 'block',
      position: 'absolute',
      left: '50%',
      top: '50%',
      maxWidth: 'calc(100% - 2em)',
      maxHeight: 'calc(100% - 2em)',
      transform: 'translate(-50%, -50%)',
      minWidth: '0',
      minHeight: '0',
    },

    '& img, video, canvas': {
      objectFit: 'scale-down',
      border: 'var(--asset-preview-border-width) solid var(--asset-preview-border-color)',
      borderRadius: 'var(--asset-preview-border-width)',
      backgroundColor: 'var(--asset-preview-border-color)',
    },

    '& audio': {
      width: '40em',
    },
  },
  info: {
    'position': 'absolute',
    'bottom': '1em',
    'left': '1em',
    'borderRadius': '.5em',
    'padding': '.5em',
    'background': 'var(--asset-metadata-background)',
    'color': 'var(--asset-metadata-color)',
    'display': 'grid',
    'gridTemplate': 'auto / auto 1fr',
    'gridGap': '.125em',
    '& dd': {
      textAlign: 'right',
      marginLeft: '0.5em',
    },
  },
})

const roundedCountText = (count) => {
  if (!count && count !== 0) {
    return null
  }

  const k = count / 1000
  const m = k / 1000
  const b = m / 1000

  if (b > 1) {
    return `${b.toFixed(2)}b`
  } else if (m > 1) {
    return `${m.toFixed(2)}m`
  } else if (k > 1) {
    return `${k.toFixed(2)}k`
  } else {
    return `${count}`
  }
}

const timeText = (totalSeconds) => {
  if (!totalSeconds && totalSeconds !== 0) {
    return null
  }

  if (totalSeconds < 1) {
    return `${totalSeconds.toFixed(3)} seconds`
  }

  const hours = Math.trunc(totalSeconds / SECONDS_PER_HOUR)
  const minutes = Math.trunc((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
  const seconds = Math.trunc(totalSeconds % SECONDS_PER_MINUTE)
  const hourString = hours > 0 ? `${hours}:` : ''
  const minuteString = hours > 0 ? minutes.toString().padStart(2, '0') : minutes
  const secondString = seconds.toString().padStart(2, '0')
  return `${hourString}${minuteString}:${secondString}`
}

interface IAssetInfoPane {
  metadata: Record<string, string>
}

const AssetInfoPane: React.FunctionComponent<IAssetInfoPane> = ({metadata}) => {
  const classes = useStyles()
  const entries = Object.entries(metadata).filter(([, v]) => typeof v === 'string')
  return (
    <dl className={classes.info}>
      {entries.map(([title, description]) => (
        <React.Fragment key={title}>
          <dt>{`${title}:`}</dt>
          <dd>{description}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}

const AssetPreview = (
  {assetPath, assetContent, isPublicView = false, bundleId = null}
) => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])
  const fullUrl = getAssetUrl(getMainPath(assetContent))

  const {fetchAssetBundleMetadata} = useActions(editorActions)

  const [fileSize, setFileSize] = useState<Number>(null)
  const [dimensions, setDimensions] = useState<AssetDimension>(null)
  const [duration, setDuration] = useState<Number>(null)
  const [modelInfo, setModelInfo] = useState<ModelInfo>(null)
  const [hcapInfo, setHcapInfo] = useState<HcapInfo>(null)

  // Clear info on asset change.
  useEffect(() => {
    setFileSize(null)
    setDimensions(null)
    setDuration(null)
    setModelInfo(null)
    setHcapInfo(null)
  }, [fullUrl])

  // Since the loading can complete after component unmounts, we use abandon to prevent
  // state updates.
  useAbandonableEffect(async (abandon) => {
    if (sizeCache[fullUrl]) {
      setFileSize(sizeCache[fullUrl])
    } else {
      let size
      if (bundleId) {
        const metadata = await abandon(fetchAssetBundleMetadata(bundleId))
        size = metadata.totalRawSize
      } else {
        size = await abandon(fetchSize(fullUrl))
      }
      sizeCache[fullUrl] = size
      setFileSize(size)
    }
  }, [fullUrl])

  const onMoreData = (data: Partial<AdditionalAssetData>) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const {dimension, duration} = data
    if (dimension) {
      setDimensions(dimension)
    }
    if (duration) {
      setDuration(duration)
    }
  }

  const ext = fullUrl && fileExt(fullUrl)

  if (TEXT_FILES.includes(ext)) {
    return <TextPreview src={fullUrl} isPublicView={isPublicView} />
  }

  let inner
  // Explicitly disable preview of some model types until support is added to ModelPreview.
  if (MODEL_FILES.includes(ext) && !NO_PREVIEW_MODEL_FILES.includes(ext)) {
    inner = (
      <>
        <StudioModelPreview
          src={fullUrl}
          isPublicView={isPublicView}
          onModelInfo={setModelInfo}
          onHcapInfo={setHcapInfo}
          showDebugUi
        />
        <AssetInfoPane metadata={{
          [t('editor_page.asset_preview.metadata.size')]: formatBytesToText(fileSize),
          [t('editor_page.asset_preview.metadata.duration')]: timeText(hcapInfo?.duration),
          [t('editor_page.asset_preview.metadata.tris')]: (
            roundedCountText(hcapInfo?.faces ?? modelInfo?.triangles)
          ),
          // eslint-disable-next-line local-rules/hardcoded-copy
          [t('editor_page.asset_preview.metadata.compression')]: modelInfo?.isDraco && 'Draco',
        }}
        />
      </>
    )
  } else {
    let previewElement
    if (IMAGE_FILES.includes(ext)) {
      previewElement = (
        <ImagePreview
          src={fullUrl}
          alt={t('editor_page.asset_preview.img_alt.preview', {assetPath})}
          onMoreData={onMoreData}
        />
      )
    } else if (SPECIAL_IMAGE_FILES.includes(ext)) {
      previewElement = <CustomImagePreview src={fullUrl} onMoreData={onMoreData} />
    } else if (VIDEO_FILES.includes(ext)) {
      previewElement = <VideoPreview src={fullUrl} onMoreData={onMoreData} />
    } else if (AUDIO_FILES.includes(ext)) {
      previewElement = <AudioPreview src={fullUrl} onMoreData={onMoreData} />
    } else {
      previewElement = (
        <div className='preview-not-available'>
          {t('editor_page.asset_preview.preview_not_available')}
        </div>
      )
    }

    const displayMetadata = fileSize || dimensions || duration
    const showBundleOrFile = bundleId
      ? t('editor_page.asset_preview.metadata.bundle_size')
      : t('editor_page.asset_preview.metadata.file_size')

    inner = (
      <div className={combine(classes.assetPreview, 'expand-1')}>
        {previewElement}
        {displayMetadata &&
          <AssetInfoPane
            metadata={{
              [showBundleOrFile]: formatBytesToText(fileSize),
              [t('editor_page.asset_preview.metadata.dimensions')]: (
                dimensions && `${dimensions.width} x ${dimensions.height}`
              ),
              [t('editor_page.asset_preview.metadata.duration')]: timeText(duration),
            }}
          />
        }
      </div>
    )
  }

  if (isPublicView) {
    return <div className={classes.publicAssetView}>{inner}</div>
  } else {
    return inner
  }
}

export default AssetPreview
