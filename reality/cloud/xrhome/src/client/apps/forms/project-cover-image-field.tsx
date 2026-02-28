import * as React from 'react'
import {Form} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {createThemedStyles} from '../../ui/theme'
import ImageCropModal from '../widgets/image-crop-modal'
import {MIN_COVER_IMAGE_WIDTH, MIN_COVER_IMAGE_HEIGHT} from '../../../shared/app-constants'
import {bool, combine} from '../../common/styles'
import '../../static/styles/app-basic-info.scss'
import {STANDARD_IMAGE_TYPES, STANDARD_IMAGE_TYPE_STRING} from '../../../shared/standard-image-type'
import {
  bodySanSerif, brandBlack, brandHighlight, cherry, gray4, tinyViewOverride,
} from '../../static/styles/settings'
import imageIcon from '../../static/image-regular.svg'
import ProjectCoverImageLabel from './project-cover-image-label'
import {Icon} from '../../ui/components/icon'

const useStyles = createThemedStyles(theme => ({
  formLabel: {
    '& > label': {
      display: 'flex !important',
      alignItems: 'baseline',
    },
  },
  imageIcon: {
    marginRight: '0.5em',
  },
  imageButton: {
    'background': 'transparent',
    'color': theme.fgBlue,
    'border': 'none',
    'display': 'flex',
    'alignItems': 'center',
    'cursor': 'pointer',
    'padding': 0,
    'fontFamily': bodySanSerif,
    'fontWeight': 600,
    '&:hover': {
      textDecoration: 'underline',
    },
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
    color: gray4,
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  imageContainer: {
    marginBottom: '1em',

    [tinyViewOverride]: {
      width: '100%',
    },
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
    aspectRatio: '40/21',
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

const ProjectCoverImageField = (
  {
    className = '', value, onChange, disabled = false, subtitle = '', hideBorder = false,
    isRequired = false, disablePopup = false, a8 = '',
  }
) => {
  const [file, setFile] = React.useState(null)
  const [imageHovering, setImageHovering] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(false)
  const inputFileRef = React.useRef<HTMLInputElement>()
  const [error, setError] = React.useState(null)
  const onReplaceImageClick = () => inputFileRef.current && inputFileRef.current.click()
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

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
  }

  const displayBorder = hideBorder ? classes.imageContainer : classes.coverImageContainer

  return (
    <Form.Field className={combine('basic-info-field', className, classes.formLabel)}>
      <ProjectCoverImageLabel
        subtitle={subtitle}
        isRequired={isRequired}
        disablePopup={disablePopup}
      />
      <Form.Group className={bool(!hideBorder, classes.coverImageFields)}>
        <div className={displayBorder}>
          <img
            src={value}
            className={combine(classes.coverImage, bool(hideBorder, classes.roundEdges))}
            alt='App Cover'
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
      <div className={classes.imageRow}>
        <button
          className={classes.imageButton}
          type='button'
          disabled={disabled}
          onDragOver={(e) => { e.preventDefault() }}
          onDrop={handleDrop}
          onClick={onReplaceImageClick}
          // @ts-ignore
          a8={a8}
        >
          <img className={classes.imageIcon} src={imageIcon} alt='Replace Project Cover' />
          {t('button.replace_image', {ns: 'common'})}
        </button>
        <span className={classes.imageSizeText}>
          {t('editor_page.cover_image_field.image_size_guide')}
        </span>
      </div>
      {error && (
        <p
          className={classes.coverImageError}
        ><Icon stroke='info' inline />{error}
        </p>
      )}
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

export default ProjectCoverImageField
