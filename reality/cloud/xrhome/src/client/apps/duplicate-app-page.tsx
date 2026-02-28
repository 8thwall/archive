import React from 'react'
import {useHistory, useRouteMatch} from 'react-router-dom'
import {createUseStyles} from 'react-jss'

import Page from '../widgets/page'
import {isEditorEnabled} from '../../shared/account-utils'
import {withAccountsLoaded} from '../common/with-state-loaded'
import {
  AccountPathEnum, getRootPath, getPathForAccount,
  getRouteFromAccount, getRouteFromApp, getPathForApp,
} from '../common/paths'
import AppBasicInfoPreview from '../widgets/app-basic-info-preview'
import {FluidCardContent} from '../widgets/fluid-card'
import CreateWebApp from './create/create-web-app'
import CreateAppAccountSelect from './create/create-app-account-select'
import ErrorMessage from '../home/error-message'
import icons from './icons'
import usePageStyles from '../styles/page-styles'
import useTextStyles from '../styles/text-styles'
import useCurrentAccount from '../common/use-current-account'
import {useSelector} from '../hooks'
import useActions from '../common/use-actions'
import appsActions from './apps-actions'
import {isAdApp} from '../../shared/app-utils'
import {
  AppLoadingScreenContextProvider,
  useAppLoadingScreenContext,
} from './widgets/loading-screen/app-loading-screen-context'
import {BokehBackground} from '../home/bokeh-background'
import {combine, bool} from '../common/styles'
import NavLogo from '../widgets/nav-logo'

class ErrorWithPath extends Error {
  public readonly path: string

  constructor(message: string, path: string) {
    super(message)
    this.path = path
  }
}

const checkCanDuplicate = (account, fromAccount, fromApp) => {
  if (!fromAccount || !fromApp) {
    if (account) {
      throw new ErrorWithPath(`Can't duplicate project to ${account.shortName}`,
        getPathForAccount(account, AccountPathEnum.workspace))
    } else {
      throw new ErrorWithPath('Can\'t duplicate project', getRootPath())
    }
  }
  if (account && !isEditorEnabled(account)) {
    throw new ErrorWithPath(
      `Can't duplicate project to ${account.shortName}. Please upgrade your plan`,
      getPathForAccount(account, AccountPathEnum.account)
    )
  }
  if (!(fromAccount.publicFeatured && fromAccount.isWeb) &&
    !isEditorEnabled(fromAccount)) {
    throw new ErrorWithPath(`Can't duplicate project from ${fromAccount.shortName}`, getRootPath())
  }
  if (fromApp.repoStatus !== 'PUBLIC' && account !== fromAccount) {
    throw new ErrorWithPath(`Can't duplicate project to ${account.shortName}`, getRootPath())
  }
  if (isAdApp(fromApp)) {
    throw new ErrorWithPath('Can\'t duplicate an Ad project', getPathForApp(fromAccount, fromApp))
  }
}

const useStyles = createUseStyles({
  header: {
    zIndex: 2,
  },
  navLogo: {
    padding: '1.5rem',
    display: 'inline-block',
  },
})

const OnlyLogoHeader: React.FC = () => {
  const classes = useStyles()

  return (
    <header className={classes.header}>
      <NavLogo size='wide' color='white' className={classes.navLogo} />
    </header>
  )
}

const DuplicateAppPage: React.FC = () => {
  const history = useHistory()
  const match = useRouteMatch<{routeAppName, fromAccount}>()

  const {error} = useActions(appsActions)

  const account = useCurrentAccount()
  const fromAccount = useSelector(s => getRouteFromAccount(s, match))
  const fromApp = useSelector(s => getRouteFromApp(s, match))
  const {isAppLoading} = useAppLoadingScreenContext()
  const isMyAccount = useSelector(s => (
    fromAccount && s.accounts.allAccounts.some(a => a.uuid === fromAccount.uuid)
  ))

  const pageStyles = usePageStyles()
  const textStyles = useTextStyles()
  React.useEffect(() => {
    try {
      checkCanDuplicate(account, fromAccount, fromApp)
    } catch (e) {
      error(e.message)
      history.push(e.path)
    }
  }, [account, fromAccount, fromApp])

  let appCreate = null
  if (fromAccount && fromApp) {
    if (account) {
      appCreate = (
        <CreateWebApp
          fromAccount={fromAccount}
          fromApp={fromApp}
          isMyAccount={isMyAccount}
        />
      )
    } else {
      appCreate = (
        <>
          <div className={textStyles.heading}>
            <img
              className={textStyles.headingImage}
              src={icons.cloneHeading}
              alt={isMyAccount ? 'Duplicate Project' : 'Clone Project'}
              title={isMyAccount ? 'Duplicate Project' : 'Clone Project'}
            />
            <h1 className={textStyles.headingText}>
              {isMyAccount ? 'Duplicate Project' : 'Clone Project'}
            </h1>
          </div>
          <div className={pageStyles.createContainer}>
            <FluidCardContent>
              <AppBasicInfoPreview
                account={fromAccount}
                app={fromApp}
                isMyAccount={isMyAccount}
              />
              <CreateAppAccountSelect fromAccount={fromAccount} fromApp={fromApp} />
            </FluidCardContent>
          </div>
        </>
      )
    }
  }

  const pageClasses = combine(
    pageStyles.pageProfile,
    bool(isAppLoading, pageStyles.appLoadingScreen)
  )
  return (
    <Page
      centered={!isAppLoading}
      className={pageClasses}
      hasFooter={!isAppLoading}
      customHeader={isAppLoading && <OnlyLogoHeader />}
    >
      <ErrorMessage />
      {appCreate}
      {isAppLoading && <BokehBackground />}
    </Page>
  )
}

const DuplicateAppPageWithAppLoadingContext = () => (
  <AppLoadingScreenContextProvider>
    <DuplicateAppPage />
  </AppLoadingScreenContextProvider>
)

export default withAccountsLoaded(DuplicateAppPageWithAppLoadingContext)
