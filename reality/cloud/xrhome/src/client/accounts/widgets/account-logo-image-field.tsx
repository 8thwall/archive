import React from 'react'
import {Form, Button} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {combine, bool} from '../../common/styles'
import {ACCOUNT_MIN_ICON_WIDTH, ACCOUNT_MIN_ICON_HEIGHT} from '../../../shared/account-constants'
import ImageCropModal from '../../apps/widgets/image-crop-modal'
import useStyles from '../account-profile-page-jss'
import {STANDARD_IMAGE_TYPES, STANDARD_IMAGE_TYPE_STRING} from '../../../shared/standard-image-type'
import useCurrentAccount from '../../common/use-current-account'
import {requiresCustomIcon} from '../../../shared/account-utils'

// To resolve jsx-a11y/label-has-associated-control
// and we want to have an id as distinct as possible
const LOGO_INPUT_ID = 'accountPublicProfileLogoInput'

const AccountLogoImageField = ({iconImage, iconImageFileName, onChange}) => {
  const inputFileRef = React.useRef(null)
  const classes = useStyles()
  const account = useCurrentAccount()
  const {t} = useTranslation(['account-pages', 'common'])
  const [imageFile, setImageFile] = React.useState(null)
  const [imageHovering, setimageHovering] = React.useState(false)
  const [replaceButtonHovering, setReplaceButtonHovering] = React.useState(false)
  const [imageCropModalOpen, setImageCropModalOpen] = React.useState(false)
  const [error, setError] = React.useState(null)

  const onImageFileChange = async (event) => {
    const newImageFile = event.dataTransfer?.files[0] || event.target.files[0]
    // Check image type
    if (!STANDARD_IMAGE_TYPES.some(type => newImageFile.type === type)) {
      setError('File must be a PNG or JPEG.')
      return
    }

    // Check image size
    const img = new Image()
    img.src = window.URL.createObjectURL(newImageFile)
    await img.decode()

    if ((img.width < ACCOUNT_MIN_ICON_WIDTH) || (img.height < ACCOUNT_MIN_ICON_HEIGHT)) {
      setError('File size is too small. ' +
        'Please upload a PNG or JPEG with a minimum size of ' +
        `${ACCOUNT_MIN_ICON_WIDTH}x${ACCOUNT_MIN_ICON_HEIGHT}px.`)
    }

    setError(null)
    setImageFile(newImageFile)
    setImageCropModalOpen(true)
  }

  const onimageDrop = (e) => {
    e.preventDefault()
    onImageFileChange(e)
    setimageHovering(false)
    setReplaceButtonHovering(false)
  }

  const onImageCropModalClose = () => {
    setImageCropModalOpen(false)
  }

  const onImageCropModalConfirm = (result) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageCropModalOpen(false)
      onChange(e.target.result, result, imageFile.name)
    }
    reader.readAsDataURL(result.cropped.file)
  }

  const onImageCropModalError = (msg) => {
    setImageCropModalOpen(false)
    setError(msg)
  }

  const onReplaceImageImageClick = () => inputFileRef.current && inputFileRef.current.click()

  return (
    <Form.Group className={classes.logoContainer}>
      <div className={classes.logo}>
        {iconImage && <img alt={`${account.name} Logo`} src={iconImage} />}
        <div
          className={
            combine(classes.logoImageOverlay, bool(imageHovering, 'hovering'))
          }
          onDragEnter={() => setimageHovering(true)}
          onDragLeave={() => setimageHovering(false)}
          onDragOver={e => e.preventDefault()}
          onDrop={onimageDrop}
        />
      </div>
      <Form.Field
        className={
          combine(classes.logoField, bool(requiresCustomIcon(account), classes.requiredAsterisk))
        }
      >
        {/* eslint jsx-a11y/label-has-associated-control: ["error", {assert: "either"}] */}
        <label htmlFor={LOGO_INPUT_ID}>
          {t('profile_page.logo')}
        </label>
        <p className={bool(requiresCustomIcon(account) && !iconImage, classes.generalErrorMessage)}>
          {t(
            'profile_page.logo_reqs',
            {min_icon_width: ACCOUNT_MIN_ICON_WIDTH, min_icon_height: ACCOUNT_MIN_ICON_HEIGHT}
          )}
        </p>
        {error && <p className={classes.generalError}>{error}</p>}
        <div className='ui input'>
          <Button
            basic={!replaceButtonHovering}
            className={classes.logoReplaceButton}
            color='violet'
            content={t('profile_page.logo_replace')}
            type='button'
            onDragEnter={() => setReplaceButtonHovering(true)}
            onDragLeave={() => setReplaceButtonHovering(false)}
            onDragOver={e => e.preventDefault()}
            onDrop={onimageDrop}
            onClick={onReplaceImageImageClick}
          />
          <input
            className={classes.logoReplaceInput}
            id={LOGO_INPUT_ID}
            name='icon'
            type='file'
            accept={STANDARD_IMAGE_TYPE_STRING}
            onChange={onImageFileChange}
            ref={inputFileRef}
            value=''
          />
          <div className={classes.logoImageFileName}>
            {iconImageFileName}
          </div>
        </div>
      </Form.Field>
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
    </Form.Group>
  )
}

export default AccountLogoImageField
