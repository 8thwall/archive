import * as React from 'react'
import {Button, Message} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import type {ConicalWizardStep} from './types'
import {UploadDrop} from '../../../uiWidgets/upload-drop'
import {gray3, mobileViewOverride, gray4, brandHighlight} from '../../../static/styles/settings'
import uploadCoffee from '../../../static/uploadCoffee.svg'
import uploadConicalUnwrapped from '../../../static/uploadConicalUnwrapped.svg'
import imageIcon from '../../../static/imageDefault.svg'
import ImageMetadata from './image-metadata'
import {LinkButton} from '../../../ui/components/link-button'

const useStyles = createUseStyles({
  imageIcon: {
    height: '2em',
  },
  dropHeader: {
    marginTop: '1em',
  },
  resetButton: {
    backgroundColor: `${gray4} !important`,
  },
  nextButton: {
    backgroundColor: `${brandHighlight} !important`,
  },
  dropText: {},
  uploadDrop: {
    'textAlign': 'center',
    'height': '24em',
    'display': 'flex',
    'flexDirection': 'column',
    [mobileViewOverride]: {
      height: 'auto',
    },
    '& .drop-target': {
      height: 'min-content',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
  },
  uploadedImgViewer: {
    '& img': {
      width: '100%',
      borderRadius: '0.5em',
      border: `3px solid ${gray3}`,
    },
  },
  instructionImages: {
    'marginTop': '1em',
    'marginBottom': '1em',
    'height': '8em',
    '& img + img': {
      marginLeft: '1em',
    },
  },
  buttonGroupRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '2em',
  },
})

interface IConicalUpload extends ConicalWizardStep {
  image: string
  setFile(file: File): void
  name: string
  width: number
  height: number
  error: string
}

const ConicalUpload: React.FunctionComponent<IConicalUpload> = ({
  onNext, onClose, setFile, image, name, width, height, error,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const onDrop = (file) => { setFile(file) }
  const classes = useStyles()

  return (
    <>
      <h3>{t('image_target_page.conical_target_modal.upload_image.heading')}</h3>
      <p>{t('image_target_page.conical_target_modal.upload_image.instruction')}</p>
      {!!error && <Message error>{error}</Message>}
      <div className={classes.instructionImages}>
        <img alt='a coffee cup' src={uploadCoffee} />
        <img alt='an unwrapped label of the coffee cup' src={uploadConicalUnwrapped} />
      </div>
      {image
        ? (
          <div className={classes.uploadedImgViewer}>
            <ImageMetadata name={name} width={width} height={height} />
            <img alt='uploaded target' src={image} />
          </div>
        )
        : (
          <UploadDrop
            uploadMessage=''
            elementClickInsteadOfButton
            dropMessage={t('image_target_pages.upload_image.drop_message')}
            onDrop={onDrop}
            fileAccept='.jpg,.jpeg,.png'
            noButton
            className={classes.uploadDrop}
          >
            <img alt='icon' src={imageIcon} className={classes.imageIcon} />
            <h3 className={classes.dropHeader}>{t('upload.drag_and_drop', {ns: 'common'})}</h3>
            <p className={classes.dropText}>(.jpg, .jpeg, .png)</p>
          </UploadDrop>
        )}

      <div className='wizard-actions'>
        <div className='left'>
          {image &&
            <Button
              color='grey'
              size='tiny'
              className={classes.resetButton}
              onClick={() => setFile(null)}
            >
              {t('image_target_page.upload_image.button.reupload')}
            </Button>
          }
        </div>
        <div className={classes.buttonGroupRight}>
          <LinkButton onClick={onClose}>
            {t('button.cancel', {ns: 'common'})}
          </LinkButton>
          <Button
            className={classes.nextButton}
            size='tiny'
            disabled={!image}
            primary
            onClick={onNext}
          >
            {t('button.next', {ns: 'common'})}
          </Button>
        </div>
      </div>
    </>
  )
}

export default ConicalUpload
