import * as React from 'react'
import {createUseStyles} from 'react-jss'

import {Link, useHistory, useLocation} from 'react-router-dom'

import {useTranslation} from 'react-i18next'

import type {IPublicAccount, IPublicModule} from '../common/types/models'
import {PrimaryButton} from '../ui/components/primary-button'
import {LinkButton} from '../ui/components/link-button'
import {StandardDropdownField} from '../ui/components/standard-dropdown-field'
import {bodySanSerif, cherry} from '../static/styles/settings'
import ModuleBasicInfoPreview from '../widgets/module-basic-info-preview'
import useTextStyles from '../styles/text-styles'
import usePageStyles from '../styles/page-styles'
import {FluidCardContent} from '../widgets/fluid-card'
import icons from '../apps/icons'
import {useSelector} from '../hooks'
import {SpaceBetween} from '../ui/layout/space-between'
import {
  AppPathEnum, getPathForApp,
  getAccountRootPath, getPublicPathForModule, getPublicPathForModuleImport,
} from '../common/paths'
import {isEditorEnabled} from '../../shared/account-utils'

const useStyles = createUseStyles({
  isRequired: {
    color: cherry,
    paddingLeft: '0.25rem',
  },
  labelText: {
    fontFamily: bodySanSerif,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '24px',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
  },
})

interface IModuleImportForm {
  module: IPublicModule
  fromAccount: IPublicAccount
}

const ModuleImportForm: React.FunctionComponent<IModuleImportForm> = ({module, fromAccount}) => {
  const textStyles = useTextStyles()
  const pageStyles = usePageStyles()
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  const {t} = useTranslation(['module-pages', 'common'])

  const [workspaceName, setWorkspaceName] = React.useState(null)
  const [appUuid, setAppUuid] = React.useState(null)

  // TODO(Dale): Add disabled property to StandardDropdownFieldOptions and
  // display and disable non editor enabled accounts (similar to create-app-account-select)
  const accounts = useSelector(state => state.accounts.allAccounts)
    ?.filter(a => a.isWeb && isEditorEnabled(a))

  // TODO(Dale): should we check if logged in here?
  const showWorkspaceSelect = true

  const currentAccount = accounts.find(a => a.name === workspaceName)

  const apps = useSelector(state => state.apps)
    ?.filter(a => !!a.repoId && a.AccountUuid === currentAccount?.uuid)

  const handleImport = () => {
    const {appName, hostingType} = apps.find(a => a.uuid === appUuid)
    const appPath = getPathForApp(
      currentAccount, appName,
      hostingType === 'CLOUD_STUDIO' ? AppPathEnum.studio : AppPathEnum.files
    )
    history.push(appPath, {
      importModule: true,
      moduleUuid: module.uuid,
      moduleName: module.name,
    })
  }

  const handleWorkspaceChange = (value) => {
    setWorkspaceName(value)
    const account = accounts.find(a => a.name === value)
    const importPath = getPublicPathForModuleImport(fromAccount, module)
    const path = account
      ? `${getAccountRootPath(account)}${importPath}`
      : importPath
    history.push(path)
  }

  React.useEffect(() => {
    const firstPart = location?.pathname.split('/')[1]
    const isAccount = accounts.find(a => a.shortName === firstPart)

    if (isAccount) {
      handleWorkspaceChange(isAccount.name)
    }
  }, [location?.pathname])

  React.useEffect(() => {
    if (accounts.length === 1) {
      handleWorkspaceChange(accounts[0].name)
    }
  }, [])

  const handleProjectChange = (value) => {
    setAppUuid(value)
  }

  const workspaceOptions = accounts.map(a => ({
    value: a.name,
    content: a.name,
  }))

  const projectOptions = apps
    .filter(a => a.appName.length > 0)
    .sort((a, b) => (
      new Date(b.userSpecific?.accessDate || b.updatedAt).getTime()) - (
      new Date(a.userSpecific?.accessDate || a.updatedAt).getTime()))
    .map(a => ({
      value: a.uuid,
      content: a.appName,
    }))

  return (
    <div className='section centered'>
      <div className={textStyles.heading}>
        <img
          className={textStyles.headingImage}
          src={icons.importModuleHeading}
          alt='Import Module'
          title='Import Module'
        />
        <h1 className={textStyles.headingText}>
          {t('import_module_page.heading.heading_text')}
        </h1>
      </div>
      <form
        className={pageStyles.createContainer}
        onSubmit={(e) => {
          e.preventDefault()
          handleImport()
        }}
      >
        <FluidCardContent>
          <ModuleBasicInfoPreview account={fromAccount} module={module} />
          <SpaceBetween direction='vertical'>
            {showWorkspaceSelect &&
              <StandardDropdownField
                label={(
                  <div className={classes.labelText}>
                    {t('import_module_page.workspace_dropdown.label')}
                    <b className={classes.isRequired}>*</b>
                  </div>
                )}
                id='workspace'
                options={workspaceOptions}
                value={workspaceName}
                onChange={handleWorkspaceChange}
                disabled={accounts.length < 1}
              />
              }
            {workspaceName &&
              <StandardDropdownField
                label={(
                  <div className={classes.labelText}>
                    {t('import_module_page.project_dropdown.label')}
                    <b className={classes.isRequired}>*</b>
                  </div>
                )}
                id='project'
                options={projectOptions}
                value={appUuid}
                onChange={handleProjectChange}
                disabled={(projectOptions.length < 1)}
              />
            }
          </SpaceBetween>
        </FluidCardContent>
        <SpaceBetween>
          <PrimaryButton
            type='submit'
            spacing='wide'
            a8='click;xr-home-import_module;import-cta'
            disabled={!appUuid || !workspaceName}
          >{t('button.import', {ns: 'common'})}
          </PrimaryButton>
          <Link
            className={classes.cancelButton}
            to={getPublicPathForModule(fromAccount, module)}
          >
            <LinkButton
              type='button'
            >{t('button.cancel', {ns: 'common'})}
            </LinkButton>
          </Link>
        </SpaceBetween>
      </form>
    </div>
  )
}

export default ModuleImportForm
