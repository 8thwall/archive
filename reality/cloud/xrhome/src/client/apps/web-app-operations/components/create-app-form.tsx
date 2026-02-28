import * as React from 'react'
import {Button, Form, Container} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useLocation} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {COVER_IMAGE_PREVIEW_SIZES} from '../../../../shared/module/module-constants'
import {DeemphasizedButton} from '../../../widgets/deemphasized-button'
import AddBasicInfoFields from '../../forms/add-basic-info-fields'
import AppBasicInfoPreview from '../../../widgets/app-basic-info-preview'
import {FluidCardContent} from '../../../widgets/fluid-card'
import CreateAppAccountSelect from '../../create/create-app-account-select'
import {
  isOkAppName, getAttributesForAppType, CommercialProjectType, getRandomDefaultAppCoverImage,
} from '../../../../shared/app-utils'
import type {IAccount, IApp, IPublicAccount, IPublicApp} from '../../../common/types/models'
import useCurrentAccount from '../../../common/use-current-account'
import {useSelector} from '../../../hooks'
import icons from '../../icons'
import {tinyViewOverride, brandPurple} from '../../../static/styles/settings'
import useTextStyles from '../../../styles/text-styles'
import usePageStyles from '../../../styles/page-styles'
import {
  isCloudStudioEnabled, validateAppType,
} from '../../../../shared/account-utils'
import type {AppHostingType} from '../../../common/types/db'
import type {NewAppData} from '../../apps-actions'

const useStyles = createUseStyles({
  buttonGroup: {
    display: 'flex',
    [tinyViewOverride]: {
      justifyContent: 'space-evenly',
    },
  },
  createButton: {
    zIndex: '0',
    flexBasis: '140px',
    [tinyViewOverride]: {
      flex: '1',
    },
  },
  cancelButton: {
    color: `${brandPurple} !important`,
    [tinyViewOverride]: {
      flex: '1',
    },
  },
})

interface ICreateAppForm {
  onCancel: () => void
  onSubmit: (data: NewAppData) => void
  fromAccount: IAccount | IPublicAccount
  fromApp: IApp | IPublicApp
  isMyAccount: boolean
}

const getInitialBasicInfoState = (
  fromApp: IApp | IPublicApp, defaultHostingType: AppHostingType
) => {
  const {coverImageId, url} = getRandomDefaultAppCoverImage(COVER_IMAGE_PREVIEW_SIZES[400])

  return (
    {
      appTitle: '',
      appName: '',
      appDescription: '',
      coverImagePreview: url,
      coverImageId,
      hostingType: (fromApp?.hostingType && fromApp?.hostingType !== 'UNSET')
        ? fromApp.hostingType
        : defaultHostingType,
    }
  )
}

const setDefaultHostingType = (
  fromApp: IApp | IPublicApp, cloudStudioEnabled: boolean, isLegacyCreationFlow: boolean
) => {
  if (isLegacyCreationFlow) {
    return 'CLOUD_EDITOR'
  }

  if (!fromApp) {
    return cloudStudioEnabled ? 'CLOUD_STUDIO' : 'CLOUD_EDITOR'
  }

  return fromApp?.hostingType !== 'CLOUD_STUDIO' ? 'CLOUD_EDITOR' : 'CLOUD_STUDIO'
}

const CreateAppForm: React.FunctionComponent<ICreateAppForm> = ({
  onSubmit, onCancel, fromAccount, fromApp, isMyAccount,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const apps = useSelector(state => state.apps)
  const accountsLength = useSelector(state => state.accounts.allAccounts.length)
  const account = useCurrentAccount()
  const location = useLocation<{fromWorkspace?: string, isLegacyButton?: boolean}>()
  const cloudStudioEnabled = isCloudStudioEnabled(account)
  const isLegacyCreationFlow = location.state?.isLegacyButton
  const defaultHostingType: AppHostingType = (
    setDefaultHostingType(fromApp, cloudStudioEnabled, isLegacyCreationFlow)
  )
  const [basicInfoState, setBasicInfoState] = React.useState<Partial<IApp>>(
    getInitialBasicInfoState(fromApp, defaultHostingType)
  )

  const [selectedProjectType] = React.useState<CommercialProjectType>(
    'DEMO'
  )
  const cloneProjectString = isMyAccount
    ? t('create_project_page.create_app.form.heading.duplicate_project')
    : t('create_project_page.create_app.form.heading.clone_project')
  const textStyles = useTextStyles()
  const pageStyles = usePageStyles()
  const classes = useStyles()

  const onBasicInfoChange = (data) => {
    setBasicInfoState(data)
  }

  // Logic to display workspace selection
  const hasMultiAccts = accountsLength > 1
  const cloneFromOutsideAcct = (!isMyAccount && fromApp)
  const newOutsideWorkspace = !fromApp &&
  (location.state?.fromWorkspace || '') !== account.shortName
  const clonePublicRepo = fromApp && fromApp?.repoStatus === 'PUBLIC'

  const showWorkspaceSelect = (hasMultiAccts && (newOutsideWorkspace || clonePublicRepo)) ||
    cloneFromOutsideAcct

  const isDuplicateAppName = appName => apps.map(app => app.appName).includes(appName)

  const appInfoReady = () => {
    const {appName, hostingType} = basicInfoState

    if (validateAppType(account, basicInfoState.hostingType)) {
      return false
    }

    if (!isOkAppName(appName) || isDuplicateAppName(appName)) {
      return false
    }

    if (!hostingType || hostingType === 'UNSET') { return false }

    return !!selectedProjectType
  }

  if (validateAppType(account, basicInfoState.hostingType)) {
    setBasicInfoState({...basicInfoState, hostingType: defaultHostingType})
  }

  const onSubmitClick = () => {
    onSubmit({
      ...basicInfoState,
      ...getAttributesForAppType(selectedProjectType, account),
    })
  }

  return (
    <>
      <div className={textStyles.heading}>
        <img
          className={textStyles.headingImage}
          src={fromApp ? icons.cloneHeading : icons.newProjectHeading}
          alt={fromApp
            ? cloneProjectString
            : t('create_project_page.create_app.form.heading.new_project')}
          title={fromApp
            ? cloneProjectString
            : t('create_project_page.create_app.form.heading.new_project')}
        />
        <h1 className={textStyles.headingText}>
          {fromApp
            ? cloneProjectString
            : t('create_project_page.create_app.form.heading.new_project')
          }
        </h1>
      </div>
      <Container className='topContainer' fluid>
        <Form className={pageStyles.createContainer}>
          <FluidCardContent className='fluid'>
            {!!fromApp &&
              <AppBasicInfoPreview account={fromAccount} app={fromApp} isMyAccount={isMyAccount} />}
            {showWorkspaceSelect &&
              <CreateAppAccountSelect
                fromAccount={fromAccount}
                fromApp={fromApp}
                disabled={(!!fromApp && fromApp.repoStatus !== 'PUBLIC') || accountsLength === 1}
              />
            }
            <AddBasicInfoFields
              basicInfo={basicInfoState}
              onChange={onBasicInfoChange}
              fromApp={fromApp}
            />
          </FluidCardContent>
          <Form.Field className={classes.buttonGroup}>
            <Button
              primary
              className={classes.createButton}
              disabled={!appInfoReady()}
              content={t('button.create', {ns: 'common'})}
              onClick={onSubmitClick}
              a8='click;xr-home-create-project;create-cta'
            />
            <DeemphasizedButton
              className={classes.cancelButton}
              content={t('button.cancel', {ns: 'common'})}
              onClick={onCancel}
            />
          </Form.Field>
        </Form>
      </Container>
    </>
  )
}

export default CreateAppForm
