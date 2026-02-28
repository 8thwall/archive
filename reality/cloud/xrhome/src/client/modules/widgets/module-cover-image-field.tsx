import React from 'react'
import {Form} from 'semantic-ui-react'

import ImageCropModal from '../../apps/widgets/image-crop-modal'
import {MIN_COVER_IMAGE_WIDTH, MIN_COVER_IMAGE_HEIGHT} from '../../../shared/module/module-constants'
import {bool, combine} from '../../common/styles'
import '../../static/styles/app-basic-info.scss'
import {STANDARD_IMAGE_TYPES, STANDARD_IMAGE_TYPE_STRING} from '../../../shared/standard-image-type'
import {Icon} from '../../ui/components/icon'

const ModuleCoverImageField = ({inputId, value, onChange, disabled = false, subtitle = ''}) => {
  const [file, setFile] = React.useState(null)
  const [imageHovering, setImageHovering] = React.useState(false)
  const [replaceButtonHovering, setReplaceButtonHovering] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(false)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const [error, setError] = React.useState(null)
  const onReplaceImageClick = () => inputFileRef?.current.click()

  const onFileChange = (event) => {
    const newFile = event.dataTransfer?.files[0] || event.target.files[0]
    if (!STANDARD_IMAGE_TYPES.some(type => newFile.type === type)) {
      setError('Image must be a PNG or JPG.')
      return
    }
    setError(null)
    setFile(newFile)
    setModalOpen(true)
  }

  const onModalClose = () => {
    setModalOpen(false)
  }

  const onConfirm = (result) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setModalOpen(false)
      onChange(e.target.result, result)
    }
    reader.readAsDataURL(result.cropped.file)
  }

  const onError = (msg) => {
    setModalOpen(false)
    setError(msg)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    onFileChange(e)
    setImageHovering(false)
    setReplaceButtonHovering(false)
  }

  return (
    <Form.Field className='basic-info-field'>
      <label htmlFor={inputId}>
        Cover Image
        {subtitle && <span className='subtitle'>{subtitle}</span>}
        <Form.Group className='cover-image-fields'>
          <div className='cover-image-container'>
            <img src={value} className='cover-image' alt='App Cover' />
            <div
              className={combine('cover-image-overlay', bool(imageHovering, 'hovering'))}
              onDragEnter={() => { setImageHovering(true) }}
              onDragLeave={() => { setImageHovering(false) }}
              onDragOver={(e) => { e.preventDefault() }}
              onDrop={handleDrop}
            />
          </div>
          <Form.Button
            basic={!replaceButtonHovering}
            primary
            content='Replace Image'
            disabled={disabled}
            onDragEnter={() => { setReplaceButtonHovering(true) }}
            onDragLeave={() => { setReplaceButtonHovering(false) }}
            onDragOver={(e) => { e.preventDefault() }}
            onDrop={handleDrop}
            onClick={onReplaceImageClick}
          />
          <input
            id={inputId}
            name='coverImage'
            type='file'
            accept={STANDARD_IMAGE_TYPE_STRING}
            onChange={onFileChange}
            ref={inputFileRef}
            value=''
          />
        </Form.Group>
      </label>
      {error && (
        <p>
          <Icon stroke='info' inline color='danger' />{error}
        </p>
      )}
      {modalOpen && <ImageCropModal
        file={file}
        headerText='Crop Your Cover Image'
        minHeight={MIN_COVER_IMAGE_HEIGHT}
        minWidth={MIN_COVER_IMAGE_WIDTH}
        onClose={onModalClose}
        onConfirm={onConfirm}
        onError={onError}
      />}
    </Form.Field>
  )
}

export default ModuleCoverImageField
