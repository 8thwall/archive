import React, {useState, useEffect} from 'react'
import {TextArea} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {createThemedStyles} from '../../ui/theme'
import {
  bodySanSerif, mobileViewOverride, tinyViewOverride,
} from '../../static/styles/settings'
import useCurrentApp from '../../common/use-current-app'
import {deriveAppCoverImageUrl} from '../../../shared/app-utils'
import {
  COVER_IMAGE_PREVIEW_SIZES, MAX_APP_DESCRIPTION_LENGTH,
} from '../../../shared/app-constants'
import {PublishCoverImageField} from './publish-cover-image-field'
import useActions from '../../common/use-actions'
import appsActions from '../../apps/apps-actions'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import {combine} from '../../common/styles'
import type {IApp} from '../../common/types/models'
import {PrimaryButton} from '../../ui/components/primary-button'
import {PublishTipBanner} from './publish-tip-banner'
import {PublishPageWrapper} from './publish-page-wrapper'
import {StandardFieldLabel} from '../../ui/components/standard-field-label'

const useStyles = createThemedStyles(theme => ({
  baseline: {
    alignItems: 'baseline',
  },
  fullHeight: {
    height: '100% !important',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    [mobileViewOverride]: {
      'flexDirection': 'column',
    },
  },
  gap: {
    gap: '1rem',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: 'fit-content',
  },
  finalPublishContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    gap: '2rem',
  },
  coverImage: {
    'width': '50%',
    '& h3': {
      'fontSize': '16px',
      'fontWeight': 600,
    },
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  descriptionField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'relative',
    flex: '1',
  },
  input: {
    'color': theme.fgMain,
    'backgroundColor': `${theme.inputFieldBg} !important`,
    'boxShadow': `0 0 0 1px ${theme.sfcBorderDefault} inset`,
    '&:selection': {
      backgroundColor: theme.inputFieldBg,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${theme.sfcBorderDefault} inset`,
    },
    '&::placeholder': {
      color: theme.fgMuted,
    },
  },
  textArea: {
    'fontFamily': 'inherit',
    'flex': '1',
    'padding': '0.64em 1em',
    'resize': 'none',
    'border': 'none',
    'borderRadius': '0.27em',
    '&::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
  },
  charCounter: {
    color: theme.fgMuted,
    fontSize: '0.71em',
    position: 'absolute',
    right: '0.7em',
    bottom: '0.2em',
    [tinyViewOverride]: {
      bottom: '1em',
    },
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: '1',
  },
  invalid: {
    'boxShadow': `0 0 0 1px ${theme.sfcBorderError} inset`,
    '&:focus-visible': {
      'boxShadow': `0 0 0 2px ${theme.sfcBorderError} inset`,
    },
  },
  error: {
    color: theme.fgError,
  },
  titleInput: {
    'fontFamily': bodySanSerif,
    'height': '2.71em',
    'width': 'inherit',
    'border': 'none',
    'borderRadius': '0.29em',
    'padding': '0.64em 1em',
  },
}))

const getInitialFormState = (app: IApp) => ({
  appTitle: app.appTitle || '',
  appDescription: app.appDescription || '',
  // Check if we have a server provided image, if not, try to derive it ourselves.
  coverImagePreview: app.smallCoverImageUrl ||
    deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[400]),
  cropResult: null,
  buildSettingsSplashScreen: app.buildSettingsSplashScreen,
})

interface IFinalPublishContent {
  onClose: () => void
  onCancel: () => void
  publish: () => Promise<boolean>
  setShowPostPublish: React.Dispatch<React.SetStateAction<boolean>>
}

const FinalPublishContent: React.FC<IFinalPublishContent> = ({
  onClose,
  onCancel,
  publish,
  setShowPostPublish,
}) => {
  const classes = useStyles()
  const app = useCurrentApp()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const {updateAppMetadata} = useActions(appsActions)
  const deployment = useCurrentGit(git => git.deployment)
  const isPublished = !!app.productionCommitHash

  const [formState, setFormState] = useState(getInitialFormState(app))
  const [publishPending, setPublishPending] = useState(false)

  useEffect(() => {
    if (publishPending && isPublished) {
      setPublishPending(false)
      setShowPostPublish(true)
    }
  }, [isPublished])

  const onTextFieldChange = (e: any) => {
    const {name, value} = e.target
    const newState = {...formState}
    newState[name] = value
    setFormState(newState)
  }

  const onCoverImageChange = (coverImagePreview: string, cropResult: any): void => {
    setFormState({...formState, coverImagePreview, cropResult})
  }

  const finishPublishing = async () => {
    const {appTitle, appDescription, cropResult, buildSettingsSplashScreen} = formState
    const fieldsToUpdate = {
      appTitle,
      appDescription,
      buildSettingsSplashScreen,
      ...(cropResult && {file: cropResult.original.file, crop: cropResult.cropAreaPixels}),
    }

    try {
      setPublishPending(true)
      await updateAppMetadata(app.uuid, fieldsToUpdate, deployment)
      const deploymentRequestSent = await publish()

      // Due to our app not being updated in DEV on publish, productionCommitHash would always
      // evaluate to NULL. As a result, this workaround below simulates a publishing (UI wise) in
      // DEV environments.
      if (BuildIf.ALL_QA && deploymentRequestSent) {
        setPublishPending(false)
        setShowPostPublish(true)
      }

      if (!deploymentRequestSent) {
        onClose()
      }
    } catch (err) {
      // Error being handled in redux from updateAppMetaData action, resulting in error showing up
      // in banner above. So just closing the modal is ok.
      onClose()
    }
  }

  const isAppTitleValid = formState?.appTitle.trim().length > 0
  const showAppTitleError = !isAppTitleValid
  const isAppPublishable = isAppTitleValid

  return (
    <PublishPageWrapper
      headline={t('editor_page.native_publish_modal.online_publish_finalize_headline')}
      headlineType='web'
      onBack={onCancel}
      actionButton={(
        <PrimaryButton
          type='submit'
          height='small'
          disabled={!isAppPublishable}
          loading={publishPending}
          onClick={finishPublishing}
          spacing='wide'
          a8='click;cloud-editor-publish-flow;final-publish-done'
        >{t('editor_page.final_publish_modal.button.done')}
        </PrimaryButton>
      )}
    >
      <div className={classes.finalPublishContentContainer}>
        <div className={combine(classes.row, classes.gap)}>
          <PublishCoverImageField
            className={classes.coverImage}
            value={formState.coverImagePreview}
            onChange={onCoverImageChange}
            hideBorder
            a8='click;cloud-editor-publish-flow;final-publish-replace-image'
          />
          <div className={combine(classes.column, classes.gap, classes.fullHeight)}>
            <label
              className={combine(classes.row, classes.gap, classes.baseline)}
              htmlFor='appTitle'
            >
              <StandardFieldLabel
                label={t('editor_page.final_publish_modal.label.project_title')}
                mutedColor
              />
              <div className={classes.inputContainer}>
                <input
                  id='appTitle'
                  className={combine(
                    classes.titleInput, classes.input, showAppTitleError && classes.invalid
                  )}
                  name='appTitle'
                  type='text'
                  placeholder={t('editor_page.final_publish_modal.placeholder.project_title')}
                  onChange={onTextFieldChange}
                  onKeyDown={onTextFieldChange}
                  value={formState.appTitle}
                />
                {showAppTitleError && (
                  <span className={classes.error}>
                    {t('editor_page.final_publish_modal.error.project_title_required')}
                  </span>
                )}
              </div>
            </label>
            <label className={combine(classes.column, classes.gap)} htmlFor='appDescription'>
              <StandardFieldLabel
                label={t('editor_page.final_publish_modal.project_description.label')}
                mutedColor
              />
              <div className={classes.descriptionField}>
                <TextArea
                  id='appDescription'
                  className={combine(classes.input, classes.textArea)}
                  placeholder={t('editor_page.final_publish_modal.project_description.placeholder')}
                  name='appDescription'
                  maxLength={MAX_APP_DESCRIPTION_LENGTH}
                  onKeyDown={onTextFieldChange}
                  onChange={onTextFieldChange}
                  value={formState.appDescription}
                />
                <div className={classes.charCounter}>
                  {formState.appDescription.length}/{MAX_APP_DESCRIPTION_LENGTH}
                </div>
              </div>
            </label>
          </div>
        </div>

        <PublishTipBanner
          iconStroke='pointLight'
          content={t('editor_page.final_publish_modal.tip_text')}
        />
      </div>
    </PublishPageWrapper>
  )
}

export {FinalPublishContent}
