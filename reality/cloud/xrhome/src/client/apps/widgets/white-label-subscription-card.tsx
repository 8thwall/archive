import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'

import {FluidCardContent} from '../../widgets/fluid-card'
import type {IAccount} from '../../common/types/models'
import {gray4} from '../../static/styles/settings'
import {PrimaryButton} from '../../ui/components/primary-button'
import {isEntryWebAccount} from '../../../shared/account-utils'
import useCurrentApp from '../../common/use-current-app'
import {getPathForLicensePurchase} from '../../common/paths'
import appsBillingActions from '../../billing/apps-billing-actions'
import useActions from '../../common/use-actions'
import {isActiveCommercialApp, isArchived, isPaidCommercial} from '../../../shared/app-utils'
import ActiveIndicator from '../../widgets/active-indicator'
import CampaignDurationSection from './campaign-duration-section'
import {isBillingRole} from '../../../shared/roles-utils'
import {useSelector} from '../../hooks'
import {hasUnlimitedWhiteLabelAccess} from '../../../shared/billing/white-label-gating'

const useStyles = createUseStyles({
  buttonRow: {
    'margin-top': '1em',
  },
  upgradeLink: {
    'color': gray4,
    'fontStyle': 'italic',
    'maxWidth': '31em',
  },
  fluidShrink: {
    flexShrink: '1 !important',
  },
})

interface IWhiteLabelSubscriptionCard {
  account: IAccount
}

const WhiteLabelSubscriptionCard: React.FunctionComponent<IWhiteLabelSubscriptionCard> = (
  {account}
) => {
  const history = useHistory()
  const app = useCurrentApp()
  const classes = useStyles()
  const {t} = useTranslation(['app-pages', 'common'])
  const {upgradeEnterpriseApp} = useActions(appsBillingActions)
  const isLaunched = isPaidCommercial(app)
  const userRole = useSelector(s => s.team.roles.find(e => e.email === s.user.email)?.role)
  const canUpgrade = isBillingRole(userRole)

  let appStatus
  const isCommercialActiveApp = isActiveCommercialApp(app)
  const isArchivedApp = isArchived(app)
  if (isCommercialActiveApp) {
    appStatus = t('status.active', {ns: 'common'})
  } else if (isArchivedApp) {
    appStatus = t('status.complete', {ns: 'common'})
  }

  const onSubscribeWhiteLabel = async () => {
    if (hasUnlimitedWhiteLabelAccess(account)) {
      await upgradeEnterpriseApp(app.uuid)
    } else {
      history.push(getPathForLicensePurchase(account, app))
    }
  }

  return (
    <FluidCardContent className={isEntryWebAccount(account) && classes.fluidShrink}>
      <p className='cam-section'>{t('project_dashboard_page.white_label_subscription.header')}</p>
      {!isLaunched && canUpgrade &&
        <>
          <p>
            {hasUnlimitedWhiteLabelAccess(account)
              ? t('project_dashboard_page.white_label_subscription.description.enterprise_launch')
              : t('project_dashboard_page.white_label_subscription.description.purchase')}
          </p>
          <PrimaryButton
            onClick={onSubscribeWhiteLabel}
          >
            {hasUnlimitedWhiteLabelAccess(account)
              ? t('project_dashboard_page.white_label_subscription.button.launch')
              : t('project_dashboard_page.white_label_subscription.button.purchase')}
          </PrimaryButton>
        </>
      }
      {!isLaunched && !canUpgrade &&
        <p>
          {t('project_dashboard_page.white_label_subscription.description.cannot_upgrade')}
        </p>
      }
      {isLaunched &&
        <>
          <p>{t('project_dashboard_page.white_label_subscription.description.launched')}</p>
          <div>
            {t('project_dashboard_page.white_label_subscription.label.status', {appStatus})}{' '}
            <ActiveIndicator />
          </div>
          <CampaignDurationSection
            app={app}
          />
        </>}
    </FluidCardContent>
  )
}

export default WhiteLabelSubscriptionCard
