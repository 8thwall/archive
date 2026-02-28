import React from 'react'

import {createThemedStyles} from '../../ui/theme'
import {combine} from '../../common/styles'
import {tinyViewOverride} from '../../static/styles/settings'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {PrimaryButton} from '../../ui/components/primary-button'
import {StandardFieldContainer} from '../../ui/components/standard-field-container'
import {BoldButton} from '../../ui/components/bold-button'
import ProjectCoverImageField from '../../apps/forms/project-cover-image-field'
import type {ModuleVersionState} from './version-state-reducer'
import {StandardModal} from '../../editor/standard-modal'
import {StandardModalContent} from '../../editor/standard-modal-content'
import {StandardModalActions} from '../../editor/standard-modal-actions'
import {StandardModalHeader} from '../../editor/standard-modal-header'
import useTextStyles from '../../styles/text-styles'
import {MAX_MODULE_DESCRIPTION_LENGTH} from '../../../shared/module/module-constants'

const useStyles = createThemedStyles(theme => ({
  moduleVersionFinalModal: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    [tinyViewOverride]: {
      'flexDirection': 'column',
    },
  },
  panel: {
    display: 'flex',
    flex: '1 0 0',
    flexDirection: 'column',
  },
  textarea: {
    'padding': '1rem',
    'fontFamily': 'inherit',
    'background': 'transparent',
    'border': 'none',
    'outline': 'none',
    'cursor': 'text',
    'color': theme.fgMain,
    'width': '100%',
    'resize': 'none',
    '&::selection': {
      background: theme.sfcHighlight,
      color: theme.fgMain,
    },
    '&::placeholder': {
      color: theme.fgMuted,
    },
    '&::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
  },
  subTitle: {
    textAlign: 'center',
  },
  charCount: {
    'color': theme.fgMuted,
    'float': 'right',
    'position': 'absolute',
    'right': '0.7em',
    'bottom': '0.2em',
  },
  errorText: {
    color: theme.fgError,
  },
  descriptionLabel: {
    height: '100%',
  },
  descriptionArea: {
    // NOTE(johnny): Use aspect ratio to match the height of the img in ProjectCoverImageField
    aspectRatio: '16/9',
  },
}))

interface IModuleVersionFinalModal {
  onClose: () => void
  onBack: () => void
  onSubmit: (e: any) => Promise<void>
  publishing: boolean
  moduleTitle: string
  moduleDescription: string
  coverImagePreviewUrl: string
  updateVersionState: (update: Partial<ModuleVersionState>) => void
}

const ModuleVersionFinalModal: React.FC<IModuleVersionFinalModal> = ({
  onClose, onBack, publishing, moduleDescription, moduleTitle, coverImagePreviewUrl,
  onSubmit, updateVersionState,
}) => {
  const classes = useStyles()
  const textStyles = useTextStyles()

  const onCoverImageChange = (newCoverImagePreview, newCropResult) => {
    updateVersionState({coverImagePreviewUrl: newCoverImagePreview, cropResult: newCropResult})
  }

  return (
    <StandardModal onClose={onClose}>
      <StandardModalHeader>
        <h2>
          Deploy Initial Version
        </h2>
        <p className={classes.subTitle}>
          Add a cover image and description to help make your module easier for your team to
          discover.
        </p>
      </StandardModalHeader>
      <form onSubmit={onSubmit}>
        <StandardModalContent>
          <div>
            <h3 className={textStyles.miniHeading}>
              Module Title
            </h3>
            <span>
              {moduleTitle}
            </span>
          </div>
          <div className={classes.moduleVersionFinalModal}>
            <div className={classes.panel}>
              <label htmlFor='module-description' className={classes.descriptionLabel}>
                <span className={textStyles.miniHeading}>
                  Module Description
                </span>
                <div className={classes.descriptionArea}>
                  <StandardFieldContainer grow>
                    <textarea
                      placeholder='Provide a brief description of this module'
                      className={classes.textarea}
                      value={moduleDescription}
                      maxLength={MAX_MODULE_DESCRIPTION_LENGTH}
                      onChange={e => updateVersionState({moduleDescription: e.target.value})}
                      name='module-description'
                      id='module-description'
                      cols={150}
                      rows={10}
                    />
                    <span className={combine(classes.charCount,
                      (moduleDescription?.length >=
                        MAX_MODULE_DESCRIPTION_LENGTH) && classes.errorText)}
                    >
                      {`${moduleDescription?.length}/${MAX_MODULE_DESCRIPTION_LENGTH}`}
                    </span>
                  </StandardFieldContainer>
                </div>
              </label>
            </div>
            <div className={classes.panel}>
              <ProjectCoverImageField
                value={coverImagePreviewUrl}
                onChange={onCoverImageChange}
                isRequired={false}
                hideBorder
                disablePopup
              />
            </div>
          </div>
        </StandardModalContent>
        <StandardModalActions>
          <BoldButton type='button' onClick={onClose}>
            Cancel
          </BoldButton>
          <TertiaryButton type='button' onClick={onBack}>
            Back
          </TertiaryButton>
          <PrimaryButton type='submit' disabled={publishing}>
            {publishing ? 'Deploying' : 'Deploy'}
          </PrimaryButton>
        </StandardModalActions>
      </form>
    </StandardModal>
  )
}

export {ModuleVersionFinalModal}
