import React, {FC} from 'react'
import {Switch, Route, Redirect, useRouteMatch, useLocation} from 'react-router-dom'
import {join} from 'path'

import Page from '../widgets/page'
import ErrorMessage from '../home/error-message'
import WebAppUpgrade from './upgrade/web-app-upgrade'
import {getPathForApp, PurchaseLicensePathEnum} from '../common/paths'
import useCurrentAccount from '../common/use-current-account'
import useCurrentApp from '../common/use-current-app'
import WebAppUpgradeConfirmation from './upgrade/web-app-upgrade-confirmation'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import {useSelector} from '../hooks'
import {isBillingRole} from '../../shared/roles-utils'
import type {ILicensePackage} from '../contracts/contract-utils'

type PurchaseLocationState = {
  currentStep?: PurchaseLicensePathEnum
  isRecurring?: boolean
  selectedLicense?: ILicensePackage
}

const PurchaseLicenseContainer: FC = () => {
  const location = useLocation<PurchaseLocationState>()
  const match = useRouteMatch()
  const account = useCurrentAccount()
  const app = useCurrentApp()
  const userRole = useSelector(
    state => account.Users?.find(u => u.UserUuid === state.user.uuid)?.role
  )

  const currentStep = (
    location.state?.currentStep || PurchaseLicensePathEnum.selectLicense
  )

  // TODO(Brandon): After removing buildif, remove isRecurring
  const isRecurring = (location.state?.isRecurring)

  const selectedLicense = (
    location.state?.selectedLicense
  )
  if (!isBillingRole(userRole)) {
    return <Redirect to={getPathForApp(account, app)} />
  }
  return (
    <Page centered={false}>
      <ErrorMessage />
      <div className='section centered-wider'>
        <WorkspaceCrumbHeading text='' account={account} app={app} />
        <Switch>
          {currentStep === PurchaseLicensePathEnum.selectLicense &&
            <Route path={join(match.path, PurchaseLicensePathEnum.selectLicense)}>
              <WebAppUpgrade isRecurring={isRecurring} />
            </Route>
          }
          {currentStep === PurchaseLicensePathEnum.thankYou &&
            <Route path={join(match.path, PurchaseLicensePathEnum.thankYou)}>
              <WebAppUpgradeConfirmation license={selectedLicense} />
            </Route>
          }
        </Switch>
      </div>
    </Page>
  )
}

export default PurchaseLicenseContainer
