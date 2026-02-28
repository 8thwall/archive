import * as React from 'react'
import {Button, Form, Modal} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import '../../static/styles/app-basic-info.scss'
import {deriveAppCoverImageUrl} from '../../../shared/app-utils'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../../shared/app-constants'
import appsActions from '../apps-actions'
import ProjectTitleField from '../forms/project-title-field'
import ProjectCoverImageField from '../forms/project-cover-image-field'
import ProjectDescriptionField from '../forms/project-description-field'
import '../../static/styles/default8.scss'
import Accordion from '../../widgets/accordion'
import {isEntryWebAccount} from '../../../shared/account-utils'
import {makeHostedProductionUrl} from '../../../shared/hosting-urls'
import useActions from '../../common/use-actions'
import type {IAccount, IApp} from '../../common/types/models'
import type {IDeployment} from '../../git/g8-dto'
import {Icon} from '../../ui/components/icon'

const unsetSplash = ({buildSettingsSplashScreen}) => (
  !buildSettingsSplashScreen || buildSettingsSplashScreen === 'UNKNOWN'
)

const getInitialFormState = (app: IApp) => ({
  appTitle: app.appTitle || '',
  appDescription: app.appDescription || '',
  // Apps have their buildSettingsSplashScreen set to 'DEFAULT' when their git repos are created.
  // Apps without buildSettingsSplashScreen are probably legacy apps that don't expect to have
  // a splash screen (e.g. 72andsunny) and we should not add one here. When new apps are created
  // this should be set to DEFAULT by default.
  buildSettingsSplashScreen: unsetSplash(app) ? 'DISABLED' : app.buildSettingsSplashScreen,
  // Check if we have a server provided image, if not, try to derive it ourselves.
  coverImagePreview: app.smallCoverImageUrl ||
    deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[400]),
  cropResult: null,
})

interface IEditBasicInfoCard {
  account: IAccount
  app: IApp
  deployment: IDeployment
  active: boolean
  onTitleClick: () => void
}
/**
 * Card used to edit project information such as the title, description, and cover image.
 * This can be found within the app settings.
 */
const EditBasicInfoCard: React.FC<IEditBasicInfoCard> = ({
  account, app, deployment, active, onTitleClick,
}) => {
  const {updateAppMetadata} = useActions(appsActions)
  const {t} = useTranslation(['app-pages', 'common'])
  const [loading, setIsLoading] = React.useState(false)
  const initialFormState = getInitialFormState(app)
  const [formState, setFormState] = React.useState(initialFormState)
  const [isRepublishModalOpen, setIsRepublishModalOpen] = React.useState(false)

  React.useEffect(() => {
    setFormState(getInitialFormState(app))
  }, [app.appTitle, app.appDescription, app.coverImageId, app.buildSettingsSplashScreen])

  const isSaveDisabled = () => (
    Object.keys(initialFormState).every(key => initialFormState[key] === formState[key]) ||
    (isEntryWebAccount(account) && formState.appTitle.trim().length < 1)
  )

  const onSaveClick = () => {
    const {appTitle, appDescription, buildSettingsSplashScreen, cropResult} = formState
    const fieldsToUpdate = {
      appTitle: appTitle.trim(),
      appDescription,
      buildSettingsSplashScreen,
      ...(cropResult && {file: cropResult.original.file, crop: cropResult.cropAreaPixels}),
    }
    setIsLoading(true)
    updateAppMetadata(app.uuid, fieldsToUpdate, deployment).then(() => {
      setIsLoading(false)
      setIsRepublishModalOpen(false)
    }).catch(() => {
      setIsLoading(false)
    })
  }

  const onTextFieldChange = (e) => {
    const {name, value} = e.target
    const newState = {...formState}
    newState[name] = value
    setFormState(newState)
  }

  const onCoverImageChange = (coverImagePreview, cropResult) => {
    setFormState({...formState, coverImagePreview, cropResult})
  }

  const labelForDeployments = () => {
    if (!deployment) {
      return 'Save'
    }
    if (deployment.production) {
      return 'Save + Republish'
    }
    if (deployment.staging) {
      return 'Save + Republish Staging'
    }
    return 'Save'
  }

  const mightNeedRedeployment = deployment && (deployment.production || deployment.staging)

  return (
    <Accordion className='edit-basic-info-card'>
      <Accordion.Title
        active={active}
        onClick={onTitleClick}
        a8='click;xrhome-project-settings;basic-information-accordian'
      >
        {t('project_settings_page.edit_basic_info_card.accordion.title')}
      </Accordion.Title>
      <Accordion.Content>
        <Form>
          <ProjectTitleField
            value={formState.appTitle}
            disabled={loading}
            onChange={onTextFieldChange}
            subtitle={t('project_settings_page.edit_basic_info_card.popup.project_title')}
          />
          <p><Icon stroke='link' inline />{makeHostedProductionUrl(account.shortName, app.appName)}
          </p>
          <ProjectDescriptionField
            value={formState.appDescription}
            disabled={loading}
            onChange={onTextFieldChange}
            subtitle={t('project_settings_page.edit_basic_info_card.popup.project_description')}
          />
          <ProjectCoverImageField
            value={formState.coverImagePreview}
            disabled={loading}
            onChange={onCoverImageChange}
            subtitle={t('project_settings_page.edit_basic_info_card.popup.cover_image')}
          />
          <Form.Group>
            {mightNeedRedeployment
              ? (
                <>
                  <Form.Button
                    primary
                    content={labelForDeployments()}
                    onClick={() => setIsRepublishModalOpen(true)}
                    loading={loading}
                    disabled={isSaveDisabled()}
                  />
                  <Modal open={isRepublishModalOpen} size='tiny'>
                    <Modal.Header>
                      {t('project_settings_page.edit_basic_info_card.modal.header')}
                    </Modal.Header>
                    <Modal.Content>
                      <p>{t('project_settings_page.edit_basic_info_card.modal.content')}</p>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button
                        primary
                        content={t('project_settings_page.edit_basic_info_card.button.republish')}
                        onClick={onSaveClick}
                      />
                      <Button
                        content={t('button.cancel', {ns: 'common'})}
                        onClick={() => setIsRepublishModalOpen(false)}
                      />
                    </Modal.Actions>
                  </Modal>
                </>
              )
              : (
                <Form.Button
                  primary
                  content={t('button.save', {ns: 'common'})}
                  onClick={onSaveClick}
                  loading={loading}
                  disabled={isSaveDisabled()}
                />
              )
            }
          </Form.Group>
        </Form>
      </Accordion.Content>
    </Accordion>
  )
}

export default EditBasicInfoCard
