import React from 'react'
import {useHistory} from 'react-router-dom'
import {createUseStyles} from 'react-jss'

import {AppLoadingScreen} from '../../../apps/app-loading-screen'
import {
  useAppLoadingProgress,
  useAppLoadingScreenContext,
  useLoadingApp,
} from '../../../apps/widgets/loading-screen/app-loading-screen-context'
import {AppPathEnum, getPathForApp, getPathForMyProjectsPage} from '../../../common/paths'
import {useOnboardingAccount} from '../account-onboarding-context'
import useActions from '../../../common/use-actions'
import appsActions from '../../../apps/apps-actions'
import {useAbandonableEffect} from '../../../hooks/abandonable-effect'
import {
  ONBOARDING_FIRST_PROJECT,
} from '../../../home/first-time-user-experience/first-time-user-constants'
import {useSelector} from '../../../hooks'
import {makeProjectSpecifier} from '../../../../shared/project-specifier'
import crmActions from '../../../crm/crm-actions'
import {tabletViewOverride} from '../../../static/arcade/arcade-settings'
import accountActions from '../../account-actions'

const useStyles = createUseStyles({
  onboardingFirstApp: {
    width: '75em',
    [tabletViewOverride]: {
      width: '100%',
    },
  },
})

const AccountOnboardingFirstApp = () => {
  const {startAppLoading, clearLoadingApp} = useAppLoadingScreenContext()
  const app = useLoadingApp()
  const progress = useAppLoadingProgress()
  const account = useOnboardingAccount()
  // NOTE(Brandon): Ensure selectedAccount is set so newApp has an account to create an app to.
  const selectedAccount = useSelector(s => s.accounts.selectedAccount)
  const history = useHistory()
  const classes = useStyles()
  const accountApps = useSelector(
    s => s.accounts.allAccounts.find(a => a.uuid === account?.uuid)
  )?.Apps
  const {cloneIntoApp} = useActions(appsActions)
  const {updateCurrentUserCrm} = useActions(crmActions)
  const {clearActivatingAccount} = useActions(accountActions)

  const cloneApp = async () => {
    try {
      if (accountApps.length > 0) {
        history.push(getPathForMyProjectsPage())
      } else {
        const newApp = await startAppLoading(ONBOARDING_FIRST_PROJECT.image, {
          appName: ONBOARDING_FIRST_PROJECT.appName,
          isWeb: true,
          buildSettingsSplashScreen: 'DEMO',
          hostingType: 'CLOUD_STUDIO',
        })
        await cloneIntoApp({
          appUuid: newApp.uuid,
          fromAppUuid: ONBOARDING_FIRST_PROJECT.uuid,
          fromProjectSpecifier: makeProjectSpecifier(
            ONBOARDING_FIRST_PROJECT.accountName, ONBOARDING_FIRST_PROJECT.appName
          ),
          deployment: 'published',
        })
      }
    } catch (e) {
      // If there are errors creating an app, redirect them to the my-projects page.
      clearLoadingApp()
      history.push(getPathForMyProjectsPage())
    }
  }

  useAbandonableEffect(async (abandonableExecutor) => {
    if (selectedAccount) {
      await abandonableExecutor(cloneApp())
      await abandonableExecutor(updateCurrentUserCrm(null, null, null, 'COMPLETE', account.uuid))
    }
  }, [selectedAccount])

  React.useEffect(() => {
    if (progress === 'DONE' && app?.appName) {
      const redirectPath = getPathForApp(account, app, AppPathEnum.studio)
      clearActivatingAccount()
      history.push(redirectPath)
    }
  }, [progress, app?.appName])

  return (
    <div className={classes.onboardingFirstApp}>
      <AppLoadingScreen isNewBranding />
    </div>
  )
}

export {
  AccountOnboardingFirstApp,
}
