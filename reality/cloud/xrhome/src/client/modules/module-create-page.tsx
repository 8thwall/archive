import React from 'react'
import {useHistory, Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {
  ModulePathEnum, getPathForModule, AccountDashboardPathEnum, getPathForAccountDashboard,
} from '../common/paths'
import useCurrentAccount from '../common/use-current-account'
import {PrimaryButton} from '../ui/components/primary-button'
import {createThemedStyles} from '../ui/theme'
import Page from '../widgets/page'
import MainErrorMessage from '../home/error-message'
import {ModuleCreateForm} from './module-create-form'
import {brandWhite, gray3, headerSanSerif, brandHighlight} from '../static/styles/settings'
import ProjectModulesIcon from '../apps/widgets/project-modules-icon'

const useStyles = createThemedStyles(theme => ({
  formContainer: {
    boxSizing: 'border-box',
    // display
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    gap: '1.5rem',
    // border
    border: theme.createFormBorder,
    boxShadow: '0px 0px 4px rgba(70, 71, 102, 0.15)',
    borderRadius: '6px',
    background: theme.createFormBackground,
  },
  heading: {
    display: 'flex',
    marginBottom: '1.2em',
    marginTop: '3em',
  },
  headingText: {
    fontFamily: headerSanSerif,
    fontWeight: '900',
    margin: '0 0 0 0.5em',
  },
  headingIcon: {
    opacity: '50%',
    color: brandHighlight,
    width: '30px',
  },
  cancel: {
    padding: '1rem',
  },
  actions: {
    marginTop: '1rem',
  },
  badge: {
    padding: '0.5rem',
    color: brandWhite,
    background: gray3,
    borderRadius: '4px',
  },
}))

const ModuleCreatePage: React.FC<{}> = () => {
  const classes = useStyles()
  const account = useCurrentAccount()
  const history = useHistory()
  const {t} = useTranslation(['module-pages', 'common'])

  const handleCreate = async (module) => {
    history.push(getPathForModule(account, module, ModulePathEnum.files))
  }

  return (
    <Page title={t('create_module_page.title')}>
      <MainErrorMessage />
      <div className={classes.heading}>
        <ProjectModulesIcon className={classes.headingIcon} />
        <h1 className={classes.headingText}>
          {t('create_module_page.heading_text')}
        </h1>
        <div className={classes.badge}>
          {account.name}
        </div>
      </div>
      <ModuleCreateForm
        onCreate={handleCreate}
        inputContainerClassName={classes.formContainer}
        renderActions={canSubmit => (
          <div className={classes.actions}>
            <PrimaryButton
              type='submit'
              disabled={!canSubmit}
              spacing='wide'
            >{t('button.create', {ns: 'common'})}
            </PrimaryButton>
            <Link
              className={classes.cancel}
              to={getPathForAccountDashboard(account, AccountDashboardPathEnum.modules)}
            >{t('button.cancel', {ns: 'common'})}
            </Link>
          </div>
        )}
      />
    </Page>
  )
}

export {ModuleCreatePage}
