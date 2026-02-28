import * as React from 'react'
import {Form, Icon} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {createThemedStyles} from '../../ui/theme'
import ImageCropModal from '../../apps/widgets/image-crop-modal'
import {MIN_COVER_IMAGE_WIDTH, MIN_COVER_IMAGE_HEIGHT} from '../../../shared/app-constants'
import {bool, combine} from '../../common/styles'
import '../../static/styles/app-basic-info.scss'
import {STANDARD_IMAGE_TYPES, STANDARD_IMAGE_TYPE_STRING} from '../../../shared/standard-image-type'
import {
  brandBlack, brandHighlight, cherry, tinyViewOverride,
} from '../../static/styles/settings'
import {PublishingPrimaryButton} from './publish-primary-button'

const useStyles = createThemedStyles(theme => ({
  publishCoverImageField: {
    padding: '1em',
    borderRadius: '0.5em',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.inputFieldBg,
    gap: '0.5em',
  },
  imageIcon: {
    marginRight: '0.5em',
  },
  imageRow: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '28rem',

    [tinyViewOverride]: {
      maxWidth: 'none',
    },
  },
  imageSizeText: {
    color: theme.fgMuted,
    alignSelf: 'center',
  },
  imageContainer: {
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  imageButton: {
    borderRadius: '0.25rem',
    padding: '0.25em 0.5em',
    height: '1.5rem',
    fontSize: '0.75rem',
  },
  requiredField: {
    color: cherry,
  },
  coverImageContainer: {
    position: 'relative',
    margin: '0.3em',
    padding: '0.3em',
    border: `0.3em solid ${brandHighlight}`,
    maxHeight: '14em',
    maxWidth: '90%',
    boxSizing: 'content-box',
  },
  coverImageFields: {
    'display': 'flex',
    'flexWrap': 'wrap',
    'alignItems': 'flex-end',
    'justifyContent': 'flex-start',
    '.field': {
      margin: '0.3em !important',
    },
  },
  coverImage: {
    maxHeight: 'inherit',
    maxWidth: '100%',
    aspectRatio: '16/9',
  },
  coverImageOverlay: {
    position: 'absolute',
    padding: '0.3em',
  },
  hovering: {
    background: `${brandBlack}32`,
  },
  roundEdges: {
    borderRadius: '0.5em',
    maxHeight: 'inherit',
    width: '100%',
  },
  input: {
    display: 'none',
  },
  coverImageError: {
    color: theme.fgError,
  },
}))

interface IPublishCoverImageField {
  className?: string
  value: string
  onChange: (value: string | ArrayBuffer | null, croppedImage?: any) => void
  disabled?: boolean
  hideBorder?: boolean
  a8?: string
}

type FileChangeEvent = React.ChangeEvent<HTMLInputElement>
  | React.DragEvent<HTMLDivElement | HTMLButtonElement>

// eslint-disable-next-line max-len
const isDragEvent = (event: FileChangeEvent): event is React.DragEvent<HTMLDivElement | HTMLButtonElement> => (
  event && (event.type === 'dragover' || event.type === 'drop')
)

const PublishCoverImageField: React.FC<IPublishCoverImageField> = ({
  className = '', value, onChange, disabled = false, hideBorder = false, a8 = '',
}) => {
  const [file, setFile] = React.useState(null)
  const [imageHovering, setImageHovering] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(false)
  const inputFileRef = React.useRef<HTMLInputElement>()
  const [error, setError] = React.useState(null)
  const onReplaceImageClick = () => inputFileRef.current && inputFileRef.current.click()
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const onFileChange = (event: FileChangeEvent) => {
    const isDrag = isDragEvent(event)
    const newFile = isDrag ? event.dataTransfer?.files[0] : event.target.files[0]
    if (!STANDARD_IMAGE_TYPES.some(type => newFile.type === type)) {
      setError(t('editor_page.cover_image_field.invalid_file_type', {ns: 'cloud-editor-pages'}))
      return
    }
    setError(null)
    setFile(newFile)
    setModalOpen(true)
  }

  const onModalClose = () => {
    setModalOpen(false)
  }

  const onConfirm = (result: React.MouseEvent<HTMLButtonElement> & {cropped: any}) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setModalOpen(false)
      onChange(e.target.result, result)
    }
    reader.readAsDataURL(result.cropped.file)
  }
  const onError = (msg: string) => {
    setModalOpen(false)
    setError(msg)
  }

  const handleDrop: React.DragEventHandler<HTMLButtonElement | HTMLDivElement> = (e) => {
    e.preventDefault()
    onFileChange(e)
    setImageHovering(false)
  }

  const displayBorder = hideBorder ? classes.imageContainer : classes.coverImageContainer

  return (
    <Form.Field className={combine(className, classes.publishCoverImageField)}>
      <Form.Group className={bool(!hideBorder, classes.coverImageFields)}>
        <div className={displayBorder}>
          <img
            src={value}
            className={combine(classes.coverImage, bool(hideBorder, classes.roundEdges))}
            alt={t('editor_page.final_publish_modal.publish_cover_image.alt_text')}
          />
          <div
            className={combine(classes.coverImageOverlay, bool(imageHovering, classes.hovering))}
            onDragEnter={() => { setImageHovering(true) }}
            onDragLeave={() => { setImageHovering(false) }}
            onDragOver={(e) => { e.preventDefault() }}
            onDrop={handleDrop}
          />
        </div>
        <input
          name='coverImage'
          className={classes.input}
          type='file'
          accept={STANDARD_IMAGE_TYPE_STRING}
          onChange={onFileChange}
          ref={inputFileRef}
          value=''
        />
      </Form.Group>
      <span className={classes.imageSizeText}>
        {t('editor_page.final_publish_modal.publish_cover_image.size_guide')}
      </span>
      <PublishingPrimaryButton
        height='small'
        className={classes.imageButton}
        type='button'
        disabled={disabled}
        onDragOver={(e) => { e.preventDefault() }}
        onDrop={handleDrop}
        onClick={onReplaceImageClick}
        a8={a8}
      >
        {t('editor_page.final_publish_modal.publish_cover_image.button_text')}
      </PublishingPrimaryButton>
      {error && <p className={classes.coverImageError}><Icon name='info circle' />{error}</p>}
      {modalOpen &&
        <ImageCropModal
          file={file}
          headerText={t('editor_page.cover_image_field.crop_your_cover_image')}
          minHeight={MIN_COVER_IMAGE_HEIGHT}
          minWidth={MIN_COVER_IMAGE_WIDTH}
          onClose={onModalClose}
          onConfirm={onConfirm}
          onError={onError}
        />
      }
    </Form.Field>
  )
}

export {PublishCoverImageField}
