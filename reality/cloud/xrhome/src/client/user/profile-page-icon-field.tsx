import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'
import type {DeepReadonly} from 'ts-essentials'

import {brandWhite, cherry, gray1, gray3, gray4, gray5} from '../static/styles/settings'
import {hexColorWithAlpha} from '../../shared/colors'
import {ProfileIcon} from '../widgets/profile-icon'
import {STANDARD_IMAGE_TYPES, STANDARD_IMAGE_TYPE_STRING} from '../../shared/standard-image-type'
import {ACCOUNT_MIN_ICON_WIDTH, ACCOUNT_MIN_ICON_HEIGHT} from '../../shared/account-constants'
import ImageCropModal from '../apps/widgets/image-crop-modal'
import {Icon} from '../ui/components/icon'
import {combine, bool} from '../common/styles'
import type {LoggedInUserState} from '../user-niantic/user-niantic-types'

const ICON_INPUT_ID = 'userProfileIconInput'
const UPLOAD_BUTTON_ID = 'userProfileIconUploadButton'

const useStyles = createUseStyles({
  iconContainer: {
    margin: '0 auto',
    gap: '0.5em',
    position: 'relative',
  },
  profileIcon: {
    height: '8.5em',
    width: '8.5em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: brandWhite,
    boxShadow: `2px 2px 10px 1px ${hexColorWithAlpha(gray5, 0.1)}`,
    overflow: 'hidden',
  },
  iconReplaceInput: {
    display: 'none',
  },
  generalErrorMessage: {
    color: cherry,
    textAlign: 'center',
    margin: '0',
  },
  iconUpload: {
    'fontSize': '1.5em',
    'textAlign': 'center',
    'backgroundColor': 'white',
    'cursor': 'pointer',
    'color': gray4,
    'fontWeight': '550',
    'lineHeight': '1.4',
    'border': 'none',
    'width': '100%',
    'height': '100%',
    'padding-block': '0px',
    '&:hover': {
      backgroundColor: gray1,
    },
    '&.imageHovering': {
      backgroundColor: gray1,
    },
  },
  cancelIcon: {
    'borderRadius': '50%',
    'border': 'none',
    'padding': '0.2em',
    'right': '10px',
    'cursor': 'pointer',
    'position': 'absolute',
    'backgroundColor': gray3,
    '&:hover': {
      backgroundColor: gray4,
    },
  },
})

interface IProfilePageIconFieldProps {
  currentIcon: string
  user: DeepReadonly<LoggedInUserState>
  onIconChange: (profileIcon: string, profileIconFile: File) => void
}

const ProfilePageIconField: React.FC<IProfilePageIconFieldProps> = ({
  currentIcon,
  user,
  onIconChange,
}) => {
  const inputFileRef = React.useRef(null)
  const [imageFile, setImageFile] = React.useState(null)
  const [imageCropModalOpen, setImageCropModalOpen] = React.useState(false)
  const [imageHovering, setimageHovering] = React.useState(false)
  const classes = useStyles()
  const {t} = useTranslation(['account-pages', 'user-profile-page', 'common'])
  const [error, setError] = React.useState<string>(null)

  const onImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLButtonElement>
  ) => {
    const newImageFile =
      (event as React.DragEvent<HTMLButtonElement>).dataTransfer?.files?.[0] ||
      (event as React.ChangeEvent<HTMLInputElement>).target?.files?.[0]

    // Check image type
    if (!newImageFile || !STANDARD_IMAGE_TYPES.some(type => newImageFile.type === type)) {
      setError(t(
        'profile_page.logo_reqs',
        {min_icon_width: ACCOUNT_MIN_ICON_WIDTH, min_icon_height: ACCOUNT_MIN_ICON_HEIGHT}
      ))
      return
    }

    // Check image size
    const img = new Image()
    img.src = window.URL.createObjectURL(newImageFile)
    await img.decode()

    if ((img.width < ACCOUNT_MIN_ICON_WIDTH) || (img.height < ACCOUNT_MIN_ICON_HEIGHT)) {
      setError(t(
        'profile_page.logo_reqs',
        {min_icon_width: ACCOUNT_MIN_ICON_WIDTH, min_icon_height: ACCOUNT_MIN_ICON_HEIGHT}
      ))
      return
    }

    setError(null)
    setImageFile(newImageFile)
    setImageCropModalOpen(true)
  }

  const onImageDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setimageHovering(false)
    onImageFileChange(e)
  }

  const onImageCropModalClose = () => {
    setImageCropModalOpen(false)
  }

  const onImageCropModalConfirm = (modalResult: { cropped: { file: File } }) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageCropModalOpen(false)
      onIconChange(e.target.result as string, modalResult.cropped.file)
    }
    reader.readAsDataURL(modalResult.cropped.file)
  }

  const onImageCropModalError = (msg: string) => {
    setImageCropModalOpen(false)
    setError(msg)
  }

  const onReplaceImageClick = () => inputFileRef.current && inputFileRef.current.click()
  const onRemoveImageClick = () => {
    setImageFile(null)
    onIconChange(null, null)
  }

  return (
    <>
      {!!currentIcon &&
        <div className={classes.iconContainer}>
          <button
            type='button'
            className={classes.cancelIcon}
            onClick={onRemoveImageClick}
          >
            <Icon
              stroke='cancel'
              color='white'
              size={1.25}
              block
            />
          </button>
          <div className={classes.profileIcon}>
            {currentIcon &&
              <ProfileIcon
                size={120}
                user={user}
                icon={currentIcon}
              />
            }
          </div>
        </div>
      }
      {!currentIcon &&
        <div className={combine(classes.iconContainer, classes.profileIcon)}>
          <button
            id={UPLOAD_BUTTON_ID}
            className={combine(classes.iconUpload, bool(imageHovering, 'imageHovering'))}
            type='button'
            onDragOver={e => e.preventDefault()}
            onDragEnter={() => setimageHovering(true)}
            onDragLeave={() => setimageHovering(false)}
            onDrop={onImageDrop}
            onClick={onReplaceImageClick}
          >
            {t('profile_page.upload_photo')}
          </button>
          <input
            className={classes.iconReplaceInput}
            id={ICON_INPUT_ID}
            name='icon'
            type='file'
            accept={STANDARD_IMAGE_TYPE_STRING}
            onChange={onImageFileChange}
            ref={inputFileRef}
            value=''
          />
          {imageCropModalOpen &&
            <ImageCropModal
              file={imageFile}
              headerText={t('profile_page.modal.crop_image.title')}
              minHeight={ACCOUNT_MIN_ICON_HEIGHT}
              minWidth={ACCOUNT_MIN_ICON_WIDTH}
              onClose={onImageCropModalClose}
              onConfirm={onImageCropModalConfirm}
              onError={onImageCropModalError}
            />
          }
        </div>
      }
      {error &&
        <p className={classes.generalErrorMessage}>
          {error}
        </p>
      }
    </>
  )
}

export {ProfilePageIconField}
