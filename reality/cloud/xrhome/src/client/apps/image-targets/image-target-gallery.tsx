import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {Image} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import flatIconGlyph from '../../static/galleryFlatGlyph.svg'
import cylinderIconGlyph from '../../static/galleryCylindricalGlyph.svg'
import conicalIconGlyph from '../../static/galleryConicalGlyph.svg'
import {ImageTargetLoader} from '../../image-targets/image-target-loader'

const TYPE_TO_ICON = {
  'PLANAR': flatIconGlyph,
  'CYLINDER': cylinderIconGlyph,
  'CONICAL': conicalIconGlyph,
}
const toTypeIcon = type => TYPE_TO_ICON[type] || flatIconGlyph

const ImageTargetThumbnail = ({
  status, loadAutomatically, type, thumbnailImageSrc, name, editPath, forceLoading,
}) => {
  const [imageLoading, setImageLoading] = useState(true)
  return (
    <div className='image-item'>
      {!forceLoading &&
        <>
          {status === 'TAKEN_DOWN' &&
            <div className='taken-down status-label'>Removed</div>
          }
          {loadAutomatically &&
            <div
              title='This image target is loaded automatically when your app starts.'
              className='enabled status-label'
            >
              Auto
            </div>
          }
        </>
      }

      <div className={`loading-thumbnail ${imageLoading || forceLoading ? 'animate' : ''}`}>
        {!forceLoading &&
          <Link to={editPath}>
            {status !== 'TAKEN_DOWN'
              ? (
                <Image
                  className='image-thumbnail'
                  src={thumbnailImageSrc}
                  onLoad={() => setImageLoading(false)}
                />
              )
              : <div className='taken-down-thumbnail' />
          }
          </Link>
        }
      </div>
      <div className='name-line'>
        <span className='name-box'>{forceLoading ? '' : name}</span>
        <span className='icon-box'>
          {!forceLoading && <img className='image-type-icon' alt={type} src={toTypeIcon(type)} />}
        </span>
      </div>
    </div>
  )
}

const ImageTargetThumbnailGrid = ({imageTargets, getTargetEditPath, forceLoading}) => (
  <div className='image-group'>
    {imageTargets.map(target => (
      <ImageTargetThumbnail
        {...target}
        editPath={getTargetEditPath(target)}
        key={target.uuid}
        forceLoading={forceLoading}
      />
    ))}
  </div>
)

const ImageTargetGallery = (
  {galleryUuid, imageTargets, getTargetEditPath, hasMoreTargets, loadingTargets, forceLoading}
) => {
  const {t} = useTranslation(['app-pages'])

  return (
    <>
      {!!imageTargets.length &&
        <ImageTargetThumbnailGrid
          imageTargets={imageTargets}
          getTargetEditPath={getTargetEditPath}
          forceLoading={forceLoading}
        />
        }
      <ImageTargetLoader galleryUuid={galleryUuid} />
      {!loadingTargets && !hasMoreTargets && imageTargets.length === 0 &&
        <div className='no-results'>{t('image_target_gallery.no_results.label')}</div>
      }
    </>
  )
}

export default ImageTargetGallery
