import * as React from 'react'
import {useTranslation} from 'react-i18next'

import ImageCropper, {CropArea, GenerateFunc} from '../../common/image-cropper'
import {StandardModalActions} from '../../editor/standard-modal-actions'
import {StandardModalContent} from '../../editor/standard-modal-content'
import {StandardModalHeader} from '../../editor/standard-modal-header'
import {StandardModal} from '../../editor/standard-modal'
import {PrimaryButton} from '../../ui/components/primary-button'

interface IImageCropModal {
  file: File
  headerText: string
  minHeight: number
  minWidth: number
  onClose: () => void
  onConfirm: Function
  onError: Function
}

const ImageCropModal: React.FunctionComponent<IImageCropModal> = (
  {file, headerText, minHeight, minWidth, onClose, onConfirm, onError}
) => {
  const {t} = useTranslation(['common'])
  const [generateCroppedImage, setGenerateCroppedImage] = React.useState(null)
  const onCropComplete = (
    croppedArea: CropArea, croppedAreaPx: CropArea, generateCroppedImg: GenerateFunc
  ) => {
    // React will try to call the function if you try to set a state var directly to a function.
    // Let's wrap it in an object to get around this.
    setGenerateCroppedImage({call: generateCroppedImg})
  }

  const onConfirmClick = () => {
    generateCroppedImage.call().then(([original, cropped, cropAreaPixels]) => {
      onConfirm({original, cropped, cropAreaPixels})
    })
  }
  return (
    <StandardModal onClose={onClose}>
      <StandardModalHeader>
        {headerText}
      </StandardModalHeader>
      <StandardModalContent>
        <ImageCropper
          file={file}
          minHeight={minHeight}
          minWidth={minWidth}
          onCropComplete={onCropComplete}
          onError={onError}
        />
      </StandardModalContent>
      <StandardModalActions>
        <PrimaryButton onClick={onConfirmClick}>
          {t('button.confirm')}
        </PrimaryButton>
      </StandardModalActions>
    </StandardModal>
  )
}

export default ImageCropModal
