import * as React from 'react'
import {Button, Dimmer, Message, Input, Segment} from 'semantic-ui-react'
import Cropper from 'react-easy-crop'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {gray5, brandBlack} from '../../../static/styles/settings'
import type {ConicalWizardStep} from './types'
import {useStyles} from './conical-set-top-arc'
import OrientationIcon from '../orientation-icon'
import FanCropVisualizer from './fan-crop-visualizer'
import type {CropAreaPixels} from '../../../common/image-cropper'
import ImageMetadata from './image-metadata'
import {getMaxZoom, isUsableDimensions, isValidDimensions} from '../image-helpers'
import {MINIMUM_SHORT_LENGTH, MINIMUM_LONG_LENGTH} from '../../../../shared/xrengine-config'
import uploadConicalUnwrappedTrackingRegion
  from '../../../static/uploadConicalUnwrappedTrackingRegion.svg'
import {combine} from '../../../common/styles'
import {LinkButton} from '../../../ui/components/link-button'
import {Loader} from '../../../ui/components/loader'
import {Icon} from '../../../ui/components/icon'

const useSpecificStyles = createUseStyles({
  cropper: {
    position: 'relative',
    width: '100%',
    backgroundColor: brandBlack,
    overflow: 'hidden',
    borderRadius: '1em',
  },
  fanCrop: {
    borderRadius: '0.35em',
    overflow: 'hidden',
  },
  fanCropVisualizer: {
    flex: '1 0 0',
  },
  sliderBar: {
    display: 'flex',
    marginTop: '1em',
  },
  orientationButton: {
    display: 'inline-block',
    outline: 'none',
    border: 0,
    marginRight: '1em',
    pointer: 'cursor',
    borderRadius: '0.35em',
  },
  selectedOrientation: {
    border: `solid 2px ${gray5}`,
  },
  loader: {
    minHeight: '10em',
  },
})

interface IConicalSetTrackingRegion extends ConicalWizardStep {
  onReUpload(): void  // go back to the first step and clear
  name: string
  processing: boolean
  topRadius: number
  bottomRadius: number
  image: string
  width: number
  height: number
  unconedImage: ImageData
  unconedImageUrl: string
  cropPixels: CropAreaPixels
  setCropPixels(crop: CropAreaPixels): void
  isRotated: boolean
  setIsRotated(isRotated: boolean): void
  setRunUnconing(toRun: boolean): void
}

const ConicalSetTrackingRegion: React.FunctionComponent<IConicalSetTrackingRegion> = ({
  onClose, onNext, onPrevious, onReUpload, topRadius, bottomRadius, image, width, height,
  unconedImage, setRunUnconing, cropPixels, setCropPixels, isRotated, setIsRotated, name,
  processing, unconedImageUrl,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const [crop, setCrop] = React.useState({x: 0, y: 0})
  const [zoom, setZoom] = React.useState(1)
  const [maxZoom, setMaxZoom] = React.useState(3)
  const [validDimensionsError, setValidDimensionsError] = React.useState('')
  const isLandscape = isRotated
  const setIsLandscape = setIsRotated
  const classes = useStyles()
  const specificStyles = useSpecificStyles()

  React.useEffect(() => {
    setRunUnconing(true)
    return () => {
      setRunUnconing(false)
    }
  }, [])

  React.useEffect(() => {
    if (unconedImage) {
      setMaxZoom(getMaxZoom(unconedImage.width, unconedImage.height, isLandscape))
    }
  }, [unconedImage])

  React.useEffect(() => {
    if (unconedImage && !isUsableDimensions(unconedImage.width, unconedImage.height)) {
      setValidDimensionsError(t('image_target_page.edit_image_target.error_invalid_image_conical',
        {min_long_length: MINIMUM_LONG_LENGTH, min_short_length: MINIMUM_SHORT_LENGTH}))
    }
  }, [unconedImage])

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    const croppedAreaIsValid = isValidDimensions(croppedAreaPixels.width, croppedAreaPixels.height,
      isLandscape)
    const initialImageIsValid = isValidDimensions(unconedImage.width, unconedImage.height,
      isLandscape)

    // Rounding issues from Cropper can cause us to get an image cropped to 479x639 for example.
    // This fixes that by setting the crop dimensions back up to the minimum size, since we know
    // that the initial image is valid.
    if (!croppedAreaIsValid && initialImageIsValid) {
      const fullWidth = isLandscape ? unconedImage.height : unconedImage.width
      const fullHeight = isLandscape ? unconedImage.width : unconedImage.height

      // Prevent extra added pixels to be off the edge of the image
      croppedAreaPixels.x = Math.min(croppedAreaPixels.x, fullWidth - MINIMUM_SHORT_LENGTH)
      croppedAreaPixels.y = Math.min(croppedAreaPixels.y, fullHeight - MINIMUM_LONG_LENGTH)

      croppedAreaPixels.height = MINIMUM_LONG_LENGTH
      croppedAreaPixels.width = MINIMUM_SHORT_LENGTH
    }

    // Unlike for planar targets, when the user rotates a conical target we rotate the crop, not
    // the whole image.
    // But the native engine expects an upright 3:4 image in which the pixels have been rotated,
    // so we must adjust the crop pixels accordingly.
    // You can see CylindricalImageTargetGeometryVisualizer for more context on the expectations
    // around landscape images.
    setCropPixels({
      top: isLandscape ? Math.floor(croppedAreaPixels.x) : Math.floor(croppedAreaPixels.y),
      left: isLandscape
        ? unconedImage.height - Math.floor(croppedAreaPixels.y) -
        Math.floor(croppedAreaPixels.height)
        : Math.floor(croppedAreaPixels.x),
      width: isLandscape
        ? Math.floor(croppedAreaPixels.height)
        : Math.floor(croppedAreaPixels.width),
      height: isLandscape
        ? Math.floor(croppedAreaPixels.width)
        : Math.floor(croppedAreaPixels.height),
    })
  }

  const handleLandscapeChange = (newIsLandscape) => {
    if (isLandscape === newIsLandscape) {
      return
    }
    const newMaxZoom = getMaxZoom(unconedImage.width, unconedImage.height, newIsLandscape)
    const newZoom = Math.max(Math.min(newMaxZoom, zoom), 1)
    setZoom(newZoom)
    setMaxZoom(newMaxZoom)
    setIsLandscape(newIsLandscape)
    setCrop({x: 0, y: 0})
  }

  const cropWidth = isLandscape ? cropPixels.height : cropPixels.width
  const cropHeight = isLandscape ? cropPixels.width : cropPixels.height
  const cropError = isLandscape
    ? t('image_target_page.edit_image_target.error_invalid_crop_landscape',
      {min_long_length: MINIMUM_LONG_LENGTH, min_short_length: MINIMUM_SHORT_LENGTH})
    : t('image_target_page.edit_image_target.error_invalid_crop',
      {min_long_length: MINIMUM_LONG_LENGTH, min_short_length: MINIMUM_SHORT_LENGTH})
  const getDimensionErr = !isValidDimensions(cropWidth, cropHeight, isLandscape) ? (cropError) : ''
  const dimensionsError = (width && height && cropPixels.width && cropPixels.height)
    ? getDimensionErr
    : ''

  return (
    <>
      <h3>{t('image_target_page.conical_tracking_region.heading')}</h3>
      <p>{t('image_target_page.conical_tracking_region.instruction')}</p>
      {validDimensionsError && <Message error>{validDimensionsError}</Message>}
      {!validDimensionsError && dimensionsError &&
        <Message error>{dimensionsError}</Message>
      }
      <div className={classes.controls}>
        <div className={classes.instructions}>
          <img
            alt='set tracking region by zoom and pan'
            src={uploadConicalUnwrappedTrackingRegion}
          />
        </div>
        <div className={classes.instructions}>
          <h3>{t('image_target_page.tracking_region.orientation')}</h3>
          <button
            type='button'
            className={combine(specificStyles.orientationButton,
              !isLandscape && specificStyles.selectedOrientation)}
            onClick={() => handleLandscapeChange(false)}
          >
            <OrientationIcon type='CONICAL' isLandscape={false} />
          </button>
          <button
            type='button'
            className={combine(specificStyles.orientationButton,
              isLandscape && specificStyles.selectedOrientation)}
            onClick={() => handleLandscapeChange(true)}
          >
            <OrientationIcon type='CONICAL' isLandscape />
          </button>
          <div className={combine(specificStyles.sliderBar, 'slider-bar')}>
            <Icon inline stroke='zoomIn' size={1.4} />
            <Input
              type='range'
              className='thumb-slider'
              value={zoom}
              min='1'
              step='0.002'
              max={Math.max(1, maxZoom)}
              onChange={e => setZoom(Number(e.target.value))}
            />
          </div>
        </div>
        <div className={specificStyles.fanCropVisualizer}>
          {unconedImage && image &&
            <FanCropVisualizer
              className={specificStyles.fanCrop}
              image={image}
              width={width}
              height={height}
              topRadius={topRadius}
              bottomRadius={bottomRadius}
              unconedWidth={unconedImage.width}
              unconedHeight={unconedImage.height}
              cropPixels={cropPixels}
              isLandscape={isLandscape}
            />
          }
        </div>
      </div>
      <div className='image-preview'>
        {!unconedImageUrl && (
          <Segment className={specificStyles.loader}>
            <Dimmer active>
              <Loader>{t('loader.loading', {ns: 'common'})}</Loader>
            </Dimmer>
          </Segment>
        )}
        {unconedImageUrl &&
          <>
            <ImageMetadata
              name={name}
              width={isLandscape ? cropPixels.height : cropPixels.width}
              height={isLandscape ? cropPixels.width : cropPixels.height}
            />
            <div className={specificStyles.cropper} style={{height: '50vh'}}>
              <Cropper
                image={unconedImageUrl}
                crop={crop}
                zoom={zoom}
                maxZoom={Math.max(1, maxZoom)}
                aspect={isLandscape ? 4 / 3 : 3 / 4}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          </>
        }
      </div>
      <div className='wizard-actions'>
        <div className='left'>
          {validDimensionsError &&
            <Button
              color='grey'
              className={classes.resetButton}
              onClick={onReUpload}
            >
              {t('image_target_page.upload_image.button.reupload')}
            </Button>
          }
          {!validDimensionsError &&
            <LinkButton
              onClick={onPrevious}
            >
              {t('button.back', {ns: 'common'})}
            </LinkButton>
          }
        </div>
        <div className={classes.buttonGroupRight}>
          <LinkButton onClick={onClose}>
            {t('button.cancel', {ns: 'common'})}
          </LinkButton>
          <Button
            className={classes.nextButton}
            size='tiny'
            primary
            onClick={onNext}
            loading={processing}
            disabled={processing || !!validDimensionsError || !!dimensionsError || !unconedImageUrl}
          >
            {t('button.create', {ns: 'common'})}
          </Button>
        </div>
      </div>
    </>
  )
}

export default ConicalSetTrackingRegion
