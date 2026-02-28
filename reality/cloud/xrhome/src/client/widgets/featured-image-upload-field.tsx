import React, {FC, useState, ReactNode} from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {brandPurple, eggshell, gray2, gray4, linkBlue} from '../static/styles/settings'
import type {CropArea, ImageFile} from '../common/image-cropper'
import type {IFeaturedAppImage} from '../common/types/models'
import {
  BYTES_PER_MB, MAX_APP_FEATURED_IMAGE_COUNT,
  MAX_FEATURED_IMAGE_SIZE, MIN_FEATURED_IMAGE_HEIGHT, MIN_FEATURED_IMAGE_WIDTH,
} from '../../shared/app-constants'
import {StandardFieldLabel} from '../ui/components/standard-field-label'
import {UploadDrop} from '../uiWidgets/upload-drop'
import {Loader} from '../ui/components/loader'
import FeaturedImagePreview from '../apps/widgets/featured-image-preview'
import ErrorMessage from '../apps/widgets/error-message'
import ImageCropModal from '../apps/widgets/image-crop-modal'
import {Icon} from '../ui/components/icon'

// Allow 1% margin of error before requiring crop.
const LOWER_LIMIT_ASPECT_RATIO = (9 / 16) * 0.99
const UPPER_LIMIT_ASPECT_RATIO = (9 / 16) * 1.01

const useStyles = createUseStyles({
  topDistance: {
    marginTop: '1em',
  },
  imageGalleryDropArea: {
    border: 'none !important',
    background: `${eggshell}6E`,  // 43% opacity. TODO(kyle): Prefer to use standard brand color.
    paddingTop: '0.5rem !important',
  },
  imageGalleryInstructions: {
    border: `4px solid ${gray2}2B`,  // 17% opacity. TODO(kyle): Prefer to use standard brand color.
    borderRadius: '0.25rem',
    height: '18rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  deemphasized: {
    marginBottom: '0.25em',
    color: `${gray4}`,
  },
  imageGalleryHeader: {
    'font-size': '1.5em',
    'font-weight': 'bold',
    'margin-bottom': 0,
    '& span': {
      fontWeight: 'normal',
    },
  },
  imageGalleryMiniHeader: {
    'font-size': '1em !important',
    '& span': {
      'color': brandPurple,
      '&:hover': {
        color: linkBlue,
      },

    },
  },
})

interface IFeaturedImageUploadField {
  id: string
  label: React.ReactNode
  uploadImage: (file: File, cropAreaPixels?: CropArea) => void
  featuredImages: readonly IFeaturedAppImage[]
  onDelete: (featuredImage: IFeaturedAppImage) => void
  uploadImageError: React.ReactNode
  loading: boolean
  makeImageUrl: (id: string) => string
  maxImageCount?: number
  maxImageSize?: number
  minImageHeight?: number
  minImageWidth?: number
}

const FeaturedImageUploadField: FC<IFeaturedImageUploadField> = ({
  id, label, uploadImage, featuredImages, onDelete, uploadImageError, loading, makeImageUrl,
  maxImageCount = MAX_APP_FEATURED_IMAGE_COUNT,
  maxImageSize = MAX_FEATURED_IMAGE_SIZE,
  minImageHeight = MIN_FEATURED_IMAGE_HEIGHT,
  minImageWidth = MIN_FEATURED_IMAGE_WIDTH,
}) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const [errorMessage, setErrorMessage] = useState<ReactNode>(null)
  const [cropperModalOpen, setCropperModalOpen] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File>(null)

  const onSelectImage = (file: File) => {
    setErrorMessage(null)
    if (file.size > MAX_FEATURED_IMAGE_SIZE) {
      setErrorMessage(
        <p>
          <Trans
            ns='app-pages'
            i18nKey='feature_project_page.showcase_media.error.file_too_large'
          >
            Your image file, <b>{{fileName: file.name}}</b>, is too large.
            Must not exceed {{maxImageSize: maxImageSize / BYTES_PER_MB}}MB.
          </Trans>
        </p>
      )
      return
    }
    if (featuredImages.length >= maxImageCount) {
      setErrorMessage(
        <p>
          {t('feature_project_page.showcase_media.error.too_many_files')}
        </p>
      )
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      const image = new Image()
      image.src = reader.result as string
      image.onload = () => {
        const {naturalWidth, naturalHeight} = image
        const aspectRatio = naturalWidth / naturalHeight
        if (naturalWidth < minImageWidth || naturalHeight < minImageHeight) {
          setErrorMessage(
            <p>
              <Trans
                ns='app-pages'
                i18nKey='feature_project_page.showcase_media.error.image_too_small'
              >
                Your image file, <b>{{fileName: file.name}}</b>, is too small.
                Minimum dimensions are {{minWidth: minImageWidth}}x
                {{minHeight: minImageHeight}}.
              </Trans>
            </p>
          )
        } else if (
          aspectRatio < LOWER_LIMIT_ASPECT_RATIO || aspectRatio > UPPER_LIMIT_ASPECT_RATIO
        ) {
          if (file.type === 'image/gif') {
            setErrorMessage(
              <p>
                <Trans
                  ns='app-pages'
                  i18nKey='feature_project_page.showcase_media.error.bad_aspect_ratio'
                >
                  Your GIF file, <b>{{fileName: file.name}}</b>, is not the right aspect ratio.
                  Must be 9:16.
                </Trans>
              </p>
            )
          } else {
            setImageFile(file)
            setCropperModalOpen(true)
          }
        } else {
          uploadImage(file)
        }
      }
    }
  }

  const onModalClose = () => {
    setCropperModalOpen(false)
  }

  const onError = () => {
    setErrorMessage(<p>{t('feature_project_page.showcase_media.error.unable_to_save_media')}</p>)
    setCropperModalOpen(false)
  }

  const onConfirm = ({original, cropAreaPixels}: {
    original: ImageFile, cropAreaPixels: CropArea
  }) => {
    uploadImage(original.file, cropAreaPixels)
    setCropperModalOpen(false)
  }

  return (
    <div>
      <label tabIndex={-1} htmlFor={id}>
        <StandardFieldLabel label={label} />
        <UploadDrop
          onDrop={onSelectImage}
          elementClickInsteadOfButton={!loading}
          noButton
          className={classes.imageGalleryDropArea}
          dropMessage='Drop your image here'
          fileAccept='.jpg,.jpeg,.png,.gif'
        >
          <div className={classes.imageGalleryInstructions}>
            {loading
              ? <Loader centered inline />
              : (
                <>
                  <Icon stroke='image' size={4} color='gray2' />
                  <p className={classes.deemphasized}>
                    {t('feature_project_page.showcase_media.accepted_formats',
                      {min_width: minImageWidth, min_height: minImageHeight})}
                  </p>
                  <p className={classes.deemphasized}>
                    {t('feature_project_page.showcase_media.required_aspect_ratio')}
                  </p>
                  <p className={classes.deemphasized}>
                    {t('feature_project_page.showcase_media.max_size')}
                  </p>
                  <h3 className={classes.imageGalleryHeader}>
                    <Trans
                      ns='app-pages'
                      i18nKey='feature_project_page.showcase_media.drag_drop_images'
                    >
                      Drag and drop up to {{maxImageCount}} images <span>(one at a time)</span>
                    </Trans>
                  </h3>
                  <p className={classes.imageGalleryMiniHeader}>
                    <Trans
                      ns='app-pages'
                      i18nKey='feature_project_page.showcase_media.browse_to_upload'
                    >
                      or <span>browse</span> to upload
                    </Trans>
                  </p>
                </>
              )
            }
          </div>
        </UploadDrop>
        <FeaturedImagePreview
          featuredImages={featuredImages}
          onDelete={onDelete}
          maxImageCount={maxImageCount}
          makeImageUrl={(objectId: string) => makeImageUrl(objectId)}
        />
        {(errorMessage || uploadImageError) &&
          <div className={classes.topDistance}>
            <ErrorMessage className={classes.topDistance} icon='exclamation'>
              {uploadImageError || errorMessage}
            </ErrorMessage>
          </div>
        }
        {cropperModalOpen &&
          <ImageCropModal
            file={imageFile}
            headerText={t('feature_project_page.showcase_media.image_crop_modal.header')}
            minHeight={minImageHeight}
            minWidth={minImageWidth}
            onClose={onModalClose}
            onConfirm={onConfirm}
            onError={onError}
          />
      }
      </label>
    </div>
  )
}

export default FeaturedImageUploadField
