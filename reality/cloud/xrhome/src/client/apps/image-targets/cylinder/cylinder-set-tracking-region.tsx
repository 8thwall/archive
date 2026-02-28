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
import {useStyles} from './cylinder-upload'
import uploadCylindricalBottleRegion from '../../../static/uploadCylindricalBottleRegion.svg'
import uploadCylindricalLabelRegion from '../../../static/uploadCylindricalLabelRegion.svg'
import {LinkButton} from '../../../ui/components/link-button'
import {Icon} from '../../../ui/components/icon'

interface ICylinderSetTrackingRegion extends ConicalWizardStep {
  name: string
  processing: boolean
  image: string
  width: number
  height: number
  cropPixels: CropAreaPixels
  setCropPixels(crop: CropAreaPixels): void
  isRotated: boolean
  setIsRotated(isRotated: boolean): void
}

const CylinderSetTrackingRegion: React.FunctionComponent<ICylinderSetTrackingRegion> = ({
  onClose, onNext, onPrevious, image, width, height, cropPixels,
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
    const croppedAreaIsValid = isValidDimensions(croppedAreaPixels.width, croppedAreaPixels.height,
      isLandscape)
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

    // Unlike for planar targets, when the user rotates a cylindrical target we rotate the crop,
    // not the whole image.
    // But the native engine expects an upright 3:4 image in which the pixels
    // have been rotated, so we must adjust the crop pixels accordingly.
    // You can see CylindricalImageTargetGeometryVisualizer for more context on the expectations
    // around landscape images.
    setCropPixels({
      top: isLandscape ? Math.floor(croppedAreaPixels.x) : Math.floor(croppedAreaPixels.y),
      left: isLandscape
        ? height - Math.floor(croppedAreaPixels.y) - Math.floor(croppedAreaPixels.height)
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
    const newMaxZoom = getMaxZoom(width, height, newIsLandscape)
    const newZoom = Math.max(Math.min(newMaxZoom, zoom), 1)
    setZoom(newZoom)
    setMaxZoom(newMaxZoom)
    setIsLandscape(newIsLandscape)
    setCrop({x: 0, y: 0})
  }

  const cropXPixels = isLandscape ? cropPixels.height : cropPixels.width
  const cropYPixels = isLandscape ? cropPixels.width : cropPixels.height
  const errorInvalid = isLandscape
    ? t('image_target_page.edit_image_target.error_invalid_crop_landscape',
      {min_long_length: MINIMUM_LONG_LENGTH, min_short_length: MINIMUM_SHORT_LENGTH})
    : t('image_target_page.edit_image_target.error_invalid_crop',
      {min_long_length: MINIMUM_LONG_LENGTH, min_short_length: MINIMUM_SHORT_LENGTH})
  const validDimensions = !isValidDimensions(cropXPixels, cropYPixels, isLandscape)
    ? errorInvalid
    : ''
  const dimensionsError = (width && height && cropPixels.width && cropPixels.height)
    ? (validDimensions)
    : ''

  return (
    <>
      <h3>{t('image_target_page.cylinder_target_modal.tracking_region.heading')}</h3>
      <p>{t('image_target_page.cylinder_target_modal.tracking_region.instruction')}</p>
      {!!dimensionsError && <Message error>{dimensionsError}</Message>}
      <div className='image-target-editor'>
        <div className='main control'>
          <div className={classes.instructionImages}>
            <img alt='a bottle' src={uploadCylindricalBottleRegion} />
            <img alt='an flat unwrapped label of the bottle' src={uploadCylindricalLabelRegion} />
          </div>
          <h3>{t('image_target_page.upload_image.button.reupload')}</h3>
          <Menu compact>
            <Menu.Item onClick={() => handleLandscapeChange(false)} active={!isLandscape}>
              <OrientationIcon type='CONICAL' isLandscape={false} />
            </Menu.Item>
            <Menu.Item onClick={() => handleLandscapeChange(true)} active={isLandscape}>
              <OrientationIcon type='CONICAL' isLandscape />
            </Menu.Item>
          </Menu>
          <div className='slider-bar'>
            <Icon inline stroke='regionSelect' size={1.2} />
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
        <div className='image-preview'>
          {image &&
            <>
              <ImageMetadata
                name={name}
                width={isLandscape ? cropPixels.height : cropPixels.width}
                height={isLandscape ? cropPixels.width : cropPixels.height}
              />
              <div className='image-crop'>
                <Cropper
                  image={image}
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
            loading={processing || !!dimensionsError}
            disabled={processing}
          >
            {t('button.create', {ns: 'common'})}
          </Button>
        </div>
      </div>
    </>
  )
}

export default CylinderSetTrackingRegion
