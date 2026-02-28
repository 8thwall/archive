import * as React from 'react'
import {Button, Message} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import type {ConicalWizardStep} from '../conical/types'
import {UploadDrop} from '../../../uiWidgets/upload-drop'
import {gray3, gray4, brandHighlight} from '../../../static/styles/settings'
import OptimizingTipsLinkOut from '../optimizing-tips-link-out'

import imageIcon from '../../../static/imageDefault.svg'
import uploadCylindricalBottle from '../../../static/uploadCylindricalBottle.svg'
import uploadCylindricalLabel from '../../../static/uploadCylindricalLabel.svg'
import {LinkButton} from '../../../ui/components/link-button'

export const useStyles = createUseStyles({
  resetButton: {
    backgroundColor: `${gray4} !important`,
  },
  nextButton: {
    backgroundColor: `${brandHighlight} !important`,
  },
  imageIcon: {
    height: '2em',
  },
  uploadDrop: {
    'textAlign': 'center',
    'height': '100%',
    'display': 'flex',
    'flexDirection': 'column',
    '& .drop-target': {
      height: 'min-content',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
  },
  uploadedImgViewer: {
    '& img': {
      'width': '100%',
      'borderRadius': '0.5em',
      'border': `3px solid ${gray3}`,
    },
  },
  instructionImages: {
    'marginTop': '1em',
    'marginBottom': '1em',
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

interface ICylinderUpload extends ConicalWizardStep {
  image: string
  error: string
  setFile(file: File): void
}

const CylinderUpload: React.FunctionComponent<ICylinderUpload> = ({
  onNext, onClose, setFile, image, error,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const onDrop = (file) => {
    setFile(file)
  }
  const classes = useStyles()

  return (
    <>
      <div className='image-target-editor'>
        <div className='main control'>
          <h3>{t('image_target_page.cylinder_target_modal.heading')}</h3>
          <p>{t('image_target_page.cylinder_target_modal.instruction')}</p>
          {!!error && <Message error>{error}</Message>}
          <div className={classes.instructionImages}>
            <img alt='a bottle' src={uploadCylindricalBottle} />
            <img alt='an flat unwrapped label of the bottle' src={uploadCylindricalLabel} />
          </div>
          <p>{t('image_target_page.cylinder_target_modal.targets_track_best')}.</p>
          <div>{t('image_target_page.upload_image.avoid')}
            <ul>
              <li>{t('image_target_page.upload_image.li.repetitive')}</li>
              <li>{t('image_target_page.upload_image.li.excessive')}</li>
              <li>{t('image_target_page.upload_image.li.low_res')}</li>
            </ul>
          </div>
          <p>
            <OptimizingTipsLinkOut />
          </p>
        </div>
        <div className='image-preview'>
          {image
            ? (
              <div className={classes.uploadedImgViewer}>
                <img alt='uploaded target' src={image} />
              </div>
            )
            : (
              <UploadDrop
                uploadMessage=''
                elementClickInsteadOfButton
                dropMessage='Drop your image here'
                onDrop={onDrop}
                fileAccept='.jpg,.jpeg,.png'
                noButton
                className={classes.uploadDrop}
              >
                <img alt='placeholder icon' src={imageIcon} className={classes.imageIcon} />
                <h3>{t('upload.drag_and_drop', {ns: 'common'})}</h3>
                <p>(.jpg, .jpeg, .png)</p>
              </UploadDrop>
            )}
        </div>
      </div>

      <div className='wizard-actions'>
        <div className='left'>
          {image &&
            <Button
              className={classes.resetButton}
              color='grey'
              onClick={() => setFile(null)}
            >
              {t('image_target_page.upload_image.button.reupload')}
            </Button>}
        </div>
        <div className={classes.buttonGroupRight}>
          <LinkButton onClick={onClose}>
            {t('button.cancel', {ns: 'common'})}
          </LinkButton>
          <Button
            className={classes.nextButton}
            size='tiny'
            disabled={!image || !!error}
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

export default CylinderUpload
