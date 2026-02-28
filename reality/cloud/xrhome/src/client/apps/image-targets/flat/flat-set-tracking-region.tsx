import * as React from 'react'
import {Button, Input, Menu, Message} from 'semantic-ui-react'
import Cropper from 'react-easy-crop'
import {useTranslation} from 'react-i18next'

import type {CropAreaPixels} from '../../../common/image-cropper'
import ImageMetadata from '../conical/image-metadata'
import OrientationIcon from '../orientation-icon'
import type {ConicalWizardStep} from '../conical/types'
import {getMaxZoom, isValidDimensions} from '../image-helpers'
import {MINIMUM_SHORT_LENGTH, MINIMUM_LONG_LENGTH} from '../../../../shared/xrengine-config'
import {useStyles} from './flat-upload'
import {LinkButton} from '../../../ui/components/link-button'
import uploadFlatBoxRegion from '../../../static/uploadFlatBoxRegion.svg'
import uploadFlatLabelRegion from '../../../static/uploadFlatLabelRegion.svg'
import {Icon} from '../../../ui/components/icon'

const isCropPixelsValid = (width, height) => (
  width >= MINIMUM_SHORT_LENGTH && height >= MINIMUM_LONG_LENGTH
)

interface IFlatSetTrackingRegion extends ConicalWizardStep {
  name: string
  processing: boolean
  image: string
  rotatedImage: string
  width: number
  height: number
  cropPixels: CropAreaPixels
  setCropPixels(crop: CropAreaPixels): void
  isRotated: boolean
  setIsRotated(isRotated: boolean): void
}

const FlatSetTrackingRegion: React.FunctionComponent<IFlatSetTrackingRegion> = ({
  onClose, onNext, onPrevious, image, rotatedImage, width, height, cropPixels,
  setCropPixels, isRotated, setIsRotated, name, processing,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const classes = useStyles()
  const [crop, setCrop] = React.useState({x: 0, y: 0})
  const [zoom, setZoom] = React.useState(1)
  const [maxZoom, setMaxZoom] = React.useState(getMaxZoom(width, height, isRotated))
  const isLandscape = isRotated
  const setIsLandscape = setIsRotated

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    const croppedAreaIsValid = isCropPixelsValid(croppedAreaPixels.width, croppedAreaPixels.height)
    const initialImageIsValid = isValidDimensions(width, height, isLandscape)

    // Rounding issues from Cropper can cause us to get an image cropped to 479x639 for example.
    // This fixes that by setting the crop dimensions back up to the minimum size, since we know
    // that the initial image is valid.
    if (!croppedAreaIsValid && initialImageIsValid) {
      const fullWidth = isLandscape ? height : width
      const fullHeight = isLandscape ? width : height

      // Prevent extra added pixels to be off the edge of the image
      croppedAreaPixels.x = Math.min(croppedAreaPixels.x, fullWidth - MINIMUM_SHORT_LENGTH)
      croppedAreaPixels.y = Math.min(croppedAreaPixels.y, fullHeight - MINIMUM_LONG_LENGTH)

      croppedAreaPixels.height = MINIMUM_LONG_LENGTH
      croppedAreaPixels.width = MINIMUM_SHORT_LENGTH
    }

    setCropPixels({
      left: Math.floor(croppedAreaPixels.x),
      top: Math.floor(croppedAreaPixels.y),
      width: Math.floor(croppedAreaPixels.width),
      height: Math.floor(croppedAreaPixels.height),
    })
  }

  const handleLandscapeChange = (newIsLandscape) => {
    if (isLandscape === newIsLandscape) {
      return
    }
    const newMaxZoom = getMaxZoom(width, height, newIsLandscape)
    const newZoom = Math.max(Math.min(newMaxZoom, zoom), 1)
    setZoom(newZoom)
    setMaxZoom(newMaxZoom)
    setIsLandscape(newIsLandscape)
    setCrop({x: 0, y: 0})
  }

  const isInvalidCrop = !isCropPixelsValid(cropPixels.width, cropPixels.height)
    ? t('image_target_page.edit_image_target.error_invalid_crop',
      {min_long_length: MINIMUM_LONG_LENGTH, min_short_length: MINIMUM_SHORT_LENGTH})
    : ''
  const dimensionsError = (width && height && cropPixels.width && cropPixels.height)
    ? isInvalidCrop
    : ''

  return (
    <>
      <h3>{t('image_target_page.flat_image_modal.tracking_region.heading')}</h3>
      <p>{t('image_target_page.flat_image_modal.tracking_region.instruction')}</p>
      {!!dimensionsError && <Message error>{dimensionsError}</Message>}
      <div className='image-target-editor'>
        <div className='main control'>
          <div className={classes.instructionImages}>
            <img alt='a box with a region selected' src={uploadFlatBoxRegion} />
            <img
              alt='an flat label of the box with a region selected'
              src={uploadFlatLabelRegion}
            />
          </div>
          <h3>{t('image_target_page.tracking_region.orientation')}</h3>
          <Menu compact>
            <Menu.Item onClick={() => handleLandscapeChange(false)} active={!isLandscape}>
              <OrientationIcon isLandscape={false} />
            </Menu.Item>

            <Menu.Item onClick={() => handleLandscapeChange(true)} active={isLandscape}>
              <OrientationIcon isLandscape />
            </Menu.Item>
          </Menu>
          <div className='slider-bar'>
            <Icon stroke='regionSelect' size={1.5} />
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
          <p>{t('image_target_page.flat_image_modal.tracking_region.important')}</p>
        </div>
        <div className='image-preview'>
          {image && rotatedImage &&
            <>
              <ImageMetadata name={name} width={cropPixels.width} height={cropPixels.height} />
              <div className='image-crop'>
                <Cropper
                  image={isLandscape ? rotatedImage : image}
                  crop={crop}
                  zoom={zoom}
                  maxZoom={Math.max(1, maxZoom)}
                  aspect={3 / 4}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
            </>
          }
        </div>
      </div>
      <div className='wizard-actions'>
        <div className='left'>
          <LinkButton onClick={onPrevious}>
            {t('button.back', {ns: 'common'})}
          </LinkButton>
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
            disabled={processing || !!dimensionsError}
          >
            {t('button.create', {ns: 'common'})}
          </Button>
        </div>
      </div>
    </>
  )
}

export default FlatSetTrackingRegion
