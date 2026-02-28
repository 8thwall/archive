import * as React from 'react'
import * as ExifJs from 'exif-js'
import {Modal} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {useCanvasPool, useImgPool} from '../../../common/resource-pool'

import actions from '../../apps-actions'
import type {IImageTarget} from '../../../common/types/models'
import {gray5} from '../../../static/styles/settings'
import {makeFileName} from '../naming'

import CylinderUpload from './cylinder-upload'
import CylinderSetTrackingRegion from './cylinder-set-tracking-region'
import {
  loadImage, getLuminosity, getImageDataRotated,
  getImageBlobFromUrl, getImageDataWithBackground, getDownScaledImage, isUsableDimensions,
} from '../image-helpers'
import {
  EXIF_ORIENTATION_TO_ROTATION, MINIMUM_LONG_LENGTH, MINIMUM_SHORT_LENGTH,
} from '../../../../shared/xrengine-config'
import {IMAGE_TARGET_MAX_WIDTH, IMAGE_TARGET_MAX_HEIGHT} from '../image-target-constants'
import modal8Styles from '../../../uiWidgets/styles/modal'
import {combine} from '../../../common/styles'
import {selectImageTargetsForApp} from '../../../image-targets/state-selectors'
import useActions from '../../../common/use-actions'
import useCurrentApp from '../../../common/use-current-app'
import {useSelector} from '../../../hooks'

const useStyles = createUseStyles({
  uploadModal: {
    '& h2': {},
    '& h3': {
      marginBottom: 0,
    },
    '& .wizard-actions': {
      'marginTop': '1em',
      'display': 'flex',
      'alignItems': 'center',
      '& a, & button': {
        color: gray5,
      },
      '& .left': {
        flex: '1 0 0',
      },
      '& .right': {
        flex: '1 0 0',
        textAlign: 'right',
      },
      '& .cancel': {
        margin: '0 2em',
      },
    },
  },
})

interface IImageTargetCylinderModalUpload {
  modalOpen: boolean
  onClose(): void
  onUploadComplete(it: IImageTarget): void
}

const ImageTargetCylinderModalUpload: React.FC<IImageTargetCylinderModalUpload> = ({
  modalOpen, onClose, onUploadComplete,
}) => {
  const {t} = useTranslation(['app-pages'])
  const app = useCurrentApp()
  const appUuid = app?.uuid
  const imageTargets = useSelector(s => (
    appUuid ? selectImageTargetsForApp(appUuid, s.imageTargets) : []
  ))
  const otherImageNames = imageTargets.map(it => it.name)
  const {uploadImageTarget} = useActions(actions)
  const modal8 = modal8Styles()
  const [image, setImage] = React.useState('')  // dataURL to the image
  const [rotatedImage, setRotatedImage] = React.useState('')  // dataURL to the rotated image
  const [processing, setProcessing] = React.useState(false)
  const [name, setName] = React.useState('')
  const [error, setError] = React.useState('')
  const [imageFileType, setImageFileType] = React.useState<string>(null)

  // editable fields using form controls
  const [cropPixels, setCropPixels] = React.useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })
  const [isRotated, setIsRotated] = React.useState(false)

  // info about our image
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)

  const canvasPool = useCanvasPool()
  const imgPool = useImgPool()

  const classes = useStyles()

  const processFile = (fileName, data) => {
    setName(makeFileName(fileName, otherImageNames))
    const fileType = data.includes('data:image/png;') ? 'image/png' : 'image/jpeg'
    loadImage(data, imgPool)
      .then((img) => {
        const imgValid = isUsableDimensions(img.naturalWidth, img.naturalHeight)
        if (!imgValid) {
          setError(t(
            'image_target_page.edit_image_target.error_invalid_image',
            {min_long_length: MINIMUM_LONG_LENGTH, min_short_length: MINIMUM_SHORT_LENGTH}
          ))
        }

        img.exifdata = null
        return new Promise((resolve) => {
          ExifJs.getData(img, () => {
            resolve({img, imgValid})
          })
        })
      })
      .then(async ({img, imgValid}) => {
        // Scale down the image if it is too big otherwise pass along the original image.
        if (imgValid) {
          const scaledImg =
            await getDownScaledImage(img, IMAGE_TARGET_MAX_WIDTH, IMAGE_TARGET_MAX_HEIGHT,
              fileType, canvasPool, imgPool)
          // Since we maintain aspect ratio when scaling, if the user uploads an image with a large
          // aspect ratio, then the scaled down image may not have enough pixels in either width or
          // height. Example: user uploads a 10,000x640 image, then we crop it to 2000x128 image,
          // where 128 is below the min pixel requirement.
          if (!isUsableDimensions(scaledImg.naturalWidth, scaledImg.naturalHeight)) {
            if (scaledImg.naturalWidth > scaledImg.naturalHeight) {
              setError(t('image_target_page.edit_image_target.error_image_width_too_big'))
            } else {
              setError(t('image_target_page.edit_image_target.error_image_height_too_big'))
            }
          }
          return scaledImg
        }
        return img
      })
      .then((img) => {
        const rotation = img.exifdata && EXIF_ORIENTATION_TO_ROTATION[img.exifdata.Orientation]

        if (!rotation) {
          return img
        }

        const rotatedData = getImageDataRotated(img, rotation, fileType, canvasPool)
        img.release()
        return loadImage(rotatedData, imgPool)
      })
      .then((img) => {
        const fillColor = getLuminosity(img, canvasPool) > 128 ? 'black' : 'white'

        setImage(getImageDataWithBackground(img, fillColor, false, fileType, canvasPool).dataURL)
        setRotatedImage(
          getImageDataWithBackground(img, fillColor, true, fileType, canvasPool).dataURL
        )

        setWidth(img.naturalWidth)
        setHeight(img.naturalHeight)
        setIsRotated(img.naturalWidth > img.naturalHeight)
        setImageFileType(fileType)
        img.release()
      })
  }

  const onFileDrop = (file) => {
    if (!file) {
      setImage('')
      setRotatedImage('')
      setError('')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      processFile(file.name, e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const uploadCylinderImageTarget = async () => {
    setProcessing(true)
    const imgTag = await loadImage(isRotated ? rotatedImage : image, imgPool)
    const imageBlob = await getImageBlobFromUrl(
      imgTag, imgTag.naturalWidth, imgTag.naturalHeight, imageFileType, canvasPool
    )
    const it = await uploadImageTarget(appUuid, imageBlob, name, 'CYLINDER', cropPixels, {
      isRotated,
      originalWidth: imgTag.naturalWidth,
      originalHeight: imgTag.naturalHeight,
    })
    if (!it) {
      onClose()
      return
    }
    setProcessing(false)
    onUploadComplete(it)
  }

  // setting up the wizard
  const [wizardStep, setWizardStep] = React.useState(0)
  const STEP_TO_WIDGET = [
    <CylinderUpload
      onNext={() => setWizardStep(1)}
      onClose={onClose}
      setFile={onFileDrop}
      image={image}
      error={error}
    />,
    <CylinderSetTrackingRegion
      onNext={uploadCylinderImageTarget}
      onPrevious={() => setWizardStep(0)}
      onClose={onClose}
      image={image}
      width={width}
      height={height}
      cropPixels={cropPixels}
      setCropPixels={setCropPixels}
      isRotated={isRotated}
      setIsRotated={setIsRotated}
      name={name}
      processing={processing}
    />,
  ]
  const stepWidget = STEP_TO_WIDGET[wizardStep]

  return (
    <Modal
      open={modalOpen}
      onClose={onClose}
      size='large'
      closeOnDimmerClick={false}
      className={combine(classes.uploadModal, modal8.modal)}
    >
      <h2>{t('image_target_page.cylinder_target_modal.heading')}</h2>
      {stepWidget}
    </Modal>
  )
}

export default ImageTargetCylinderModalUpload
