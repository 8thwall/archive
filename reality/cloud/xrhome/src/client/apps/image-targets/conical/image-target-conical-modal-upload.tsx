import * as React from 'react'
import * as ExifJs from 'exif-js'
import {Modal} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import Worker from './unconify.worker'

import type {IImageTarget} from '../../../common/types/models'
import {gray5} from '../../../static/styles/settings'
import {computePixelPointsFromRadius} from './unconify'
import {useCanvasPool, useImgPool} from '../../../common/resource-pool'
import ConicalUpload from './conical-upload'
import ConicalSetTopArc from './conical-set-top-arc'
import ConicalSetBottomArc from './conical-set-bottom-arc'
import ConicalSetTrackingRegion from './conical-set-tracking-region'
import {makeFileName} from '../naming'
import {
  loadImage, getLuminosity, getImageDataRotated,
  getImageBlobFromUrl, getImageDataWithBackground, getDownScaledImage, isUsableDimensions,
} from '../image-helpers'
import {
  EXIF_ORIENTATION_TO_ROTATION, MINIMUM_LONG_LENGTH, MINIMUM_SHORT_LENGTH,
} from '../../../../shared/xrengine-config'
import modal8Styles from '../../../uiWidgets/styles/modal'
import {combine} from '../../../common/styles'
import {selectImageTargetsForApp} from '../../../image-targets/state-selectors'
import {IMAGE_TARGET_MAX_WIDTH, IMAGE_TARGET_MAX_HEIGHT} from '../image-target-constants'
import useCurrentApp from '../../../common/use-current-app'
import {useSelector} from '../../../hooks'
import useActions from '../../../common/use-actions'
import appsActions from '../../apps-actions'

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

interface ImageTargetConicalModalUploadProps {
  modalOpen: boolean
  onClose(): void
  onUploadComplete(it: IImageTarget): void
}

const ImageTargetConicalModalUpload: React.FC<ImageTargetConicalModalUploadProps> = ({
  modalOpen, onClose, onUploadComplete,
}) => {
  const app = useCurrentApp()
  const appUuid = app?.uuid
  const otherImageNames = useSelector(s => (app
    ? (selectImageTargetsForApp(appUuid, s.imageTargets) || []).map(it => it.name)
    : []
  ))
  const {uploadImageTarget} = useActions(appsActions)
  const {t} = useTranslation('app-pages')
  const modal8 = modal8Styles()
  const [image, setImage] = React.useState('')  // dataURL to the image
  const [imageData, setImageData] = React.useState<ImageData>(null)
  // TODO - Determine if we should instead be saving the rotated image when isLandscape=true
  // const [rotatedImage, setRotatedImage] = React.useState('')  // dataURL to the rotated image
  const [processing, setProcessing] = React.useState(false)
  const [name, setName] = React.useState('')
  const [error, setError] = React.useState('')
  const [runUnconing, setRunUnconing] = React.useState(false)

  // editable fields using form controls
  const [topRadius, setTopRadius] = React.useState(4479)
  // by setting bottomRadius to 0, ConicalSetTopArc will automatically set bottomRadius to a
  // reasonable number before going to ConicalSetBottom Arc.  That way the bottom arc appears
  // visually on the screen for the user
  const [bottomRadius, setBottomRadius] = React.useState(0)
  const [cropPixels, setCropPixels] = React.useState({left: 0, top: 0, width: 0, height: 0})
  const [isRotated, setIsRotated] = React.useState(false)
  // info about our image
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)
  const [imageFileType, setImageFileType] = React.useState<string>(null)

  const canvasPool = useCanvasPool()
  const imgPool = useImgPool()

  // setting up the wizard
  const [wizardStep, setWizardStep] = React.useState(0)

  const classes = useStyles()

  const [unconedImage, setUnconedImage] = React.useState(null)
  const worker = React.useRef<Worker>()
  React.useEffect(() => {
    worker.current = new Worker()
    worker.current.onmessage = (event) => {
      setUnconedImage(event.data)
    }
  }, [])

  React.useEffect(() => {
    if (runUnconing) {
      // TODO(dat): this value affects the ability to crop in landscape
      const outputWidth = width
      worker.current.postMessage({
        imgData: imageData,
        pixelPoints: computePixelPointsFromRadius(topRadius, bottomRadius, width),
        outputWidth,
      })
    }
  }, [topRadius, bottomRadius, imageData, runUnconing])

  const processFile = (filename, data) => {
    setName(makeFileName(filename, otherImageNames))
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
        (img as any).exifdata = null
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
              setError(t(''))
            }
          }
          return scaledImg
        }
        // Otherwise pass along the original image to display to the user along with the error
        // message that was set.
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

        const imgData = getImageDataWithBackground(img, fillColor, false, fileType, canvasPool)
        setImage(imgData.dataURL)
        setImageData(imgData.imageData)

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
      setImageData(null)
      setError('')
      // setRotatedImage('')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      processFile(file.name, e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const onReUpload = () => {
    setRunUnconing(false)
    setWizardStep(0)
    onFileDrop(null)
  }

  const uploadConicalImageTarget = async () => {
    setProcessing(true)
    const imgTag = await loadImage(image, imgPool)
    const imageBlob = await getImageBlobFromUrl(imgTag, width, height, imageFileType, canvasPool)
    // TODO(dat): Make uploading more efficient by not storing data that will get overwritten anyway
    const it = await uploadImageTarget(appUuid, imageBlob, name, 'CONICAL', cropPixels, {
      isRotated,
      originalWidth: width,
      originalHeight: height,
      topRadius,
      bottomRadius,
    })
    if (!it) {
      onClose()
    } else {
      setProcessing(false)
      onUploadComplete(it)
    }
  }

  const canvasRef = React.useRef<HTMLCanvasElement>()
  const unconedImageUrl = React.useMemo(() => {
    // unconedImage may not be defined if the user comes back from setting the tracking region
    if (!canvasRef.current || !unconedImage) {
      return null
    }
    canvasRef.current.width = unconedImage.width
    canvasRef.current.height = unconedImage.height
    const ctx = canvasRef.current.getContext('2d')
    ctx.putImageData(unconedImage, 0, 0)
    return canvasRef.current.toDataURL()
  }, [unconedImage])

  const STEP_TO_WIDGET = [
    <ConicalUpload
      onNext={() => setWizardStep(1)}
      onClose={onClose}
      setFile={onFileDrop}
      image={image}
      name={name}
      width={width}
      height={height}
      error={error}
    />,
    <ConicalSetTopArc
      onNext={() => setWizardStep(2)}
      onPrevious={() => setWizardStep(0)}
      onClose={onClose}
      topRadius={topRadius}
      bottomRadius={bottomRadius}
      image={image}
      width={width}
      height={height}
      setTopRadius={setTopRadius}
      setBottomRadius={setBottomRadius}
      name={name}
    />,
    <ConicalSetBottomArc
      onNext={() => setWizardStep(3)}
      onPrevious={() => setWizardStep(1)}
      onClose={onClose}
      topRadius={topRadius}
      bottomRadius={bottomRadius}
      image={image}
      width={width}
      height={height}
      setBottomRadius={setBottomRadius}
      name={name}
    />,
    <ConicalSetTrackingRegion
      onNext={uploadConicalImageTarget}
      onPrevious={() => setWizardStep(2)}
      onClose={onClose}
      onReUpload={onReUpload}
      topRadius={topRadius}
      bottomRadius={bottomRadius}
      image={image}
      width={width}
      height={height}
      unconedImage={unconedImage}
      setRunUnconing={setRunUnconing}
      cropPixels={cropPixels}
      setCropPixels={setCropPixels}
      isRotated={isRotated}
      setIsRotated={setIsRotated}
      name={name}
      processing={processing}
      unconedImageUrl={unconedImageUrl}
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
      <h2>{t('image_target_page.conical_target_modal.heading')}</h2>
      {stepWidget}
      <canvas style={{display: 'none'}} ref={canvasRef} />
    </Modal>
  )
}

export default ImageTargetConicalModalUpload
