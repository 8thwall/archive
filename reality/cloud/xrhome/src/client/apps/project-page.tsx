import * as React from 'react'
import {Link, useHistory} from 'react-router-dom'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import appsActions from './apps-actions'
import appsBillingActions from '../billing/apps-billing-actions'
import {
  isCameraAccount,
  isEntryWebAccount, isCustomDomainsEnabled,
} from '../../shared/account-utils'
import {isCloudStudioApp, dashboardShowsCodeBrowse} from '../../shared/app-utils'
import {APP_HOSTING_TYPE_NAMES} from '../../shared/app-constants'
import {CampaignRedirectSection} from './widgets/campaign-redirect-section'
import {QrCodeSection} from './widgets/qr-code-section'

import {AppPathEnum} from '../common/paths'
import Page from '../widgets/page'
import {FluidCardContainer, FluidCardContent} from '../widgets/fluid-card'
import CampaignUsageSection from './widgets/campaign-usage-section'
import TopProjectSection from './widgets/top-project-section'
import ErrorMessage from '../home/error-message'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import {DomainManagerSection} from './widgets/domain-manager-section'
import {gray1, gray4} from '../static/styles/settings'
import {useAppPathsContext} from '../common/app-container-context'
import useAppSharingInfo from '../common/use-app-sharing-info'
import useCurrentAccount from '../common/use-current-account'
import useCurrentApp from '../common/use-current-app'
import {useSelector} from '../hooks'
import useActions from '../common/use-actions'
import {ViewTrendsSection} from './widgets/view-trends-section'
import WhiteLabelSubscriptionCard from './widgets/white-label-subscription-card'
import {canPurchaseWhiteLabelLicense} from '../../shared/billing/white-label-gating'

const LazyCodeBrowseSection = React.lazy(() => import('./code-browse-section'))

const useStyles = createUseStyles({
  hostingType: {
    padding: '0 0.75em',
    marginBottom: '1rem !important',
    color: gray4,
    backgroundColor: gray1,
    fontSize: '1em',
    lineHeight: '1.5em',
    textAlign: 'center',
    borderRadius: '4px',
  },
  upgradeHostLink: {
    color: gray4,
    fontStyle: 'italic',
    maxWidth: '31em',
  },
  hostingCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
  },
  fluidShrink: {
    flexShrink: '1 !important',
  },
})

const ProjectPage = () => {
  const account = useCurrentAccount()
  const app = useCurrentApp()
  const classes = useStyles()
  const {getPathForApp} = useAppPathsContext()
  const {t} = useTranslation(['app-pages'])
  const history = useHistory()
  const cameraEditPath = getPathForApp(AppPathEnum.edit)
  const {isExternalApp} = useAppSharingInfo(app)
  const {updateApp} = useActions(appsActions)
  const {fetchAppBilledUsage} = useActions(appsBillingActions)
  const billedUsage = useSelector(state => state.usage.billedUsageByApp[app?.appKey])

  React.useEffect(() => {
    if (app.isCommercial && app.subscriptionId &&
      app.commercialStatus === 'LAUNCH' && app.usageSubscriptionItemId) {
      fetchAppBilledUsage(app)
    }
  }, [app.uuid])

  const isCamera = isCameraAccount(account)
  const hostingType = APP_HOSTING_TYPE_NAMES[app.hostingType]
  const customDomainEnabled = isCustomDomainsEnabled(account)
  const showHostingTypeBadge = hostingType && app.hostingType !== 'UNSET'
  const hostingCard = (
    <FluidCardContent className={isEntryWebAccount(account) && classes.fluidShrink}>
      <div className={classes.hostingCard}>
        <div className='project-section-header-with-link'>
          <h2 className='cam-section'>
            {t('project_dashboard_page.connected_domain_card.header')}
          </h2>
          {showHostingTypeBadge && <p className={classes.hostingType}>{hostingType}</p>}
        </div>
        <DomainManagerSection account={account} app={app} />
      </div>
    </FluidCardContent>
  )

  return (
    <Page centered={false} headerVariant='workspace'>
      <div className='section centered'>
        <WorkspaceCrumbHeading
          text={t('project_dashboard_page.header')}
          account={account}
          app={app}
        />

        <ErrorMessage />

        <TopProjectSection app={app} account={account} />
      </div>

      <div className='section centered'>

        <FluidCardContainer>
          {!isExternalApp && canPurchaseWhiteLabelLicense(account) &&
            <WhiteLabelSubscriptionCard account={account} />
          }

          {!isCloudStudioApp(app) && !isCamera &&
            <FluidCardContent className='image-target-section'>
              <h2 className='cam-section'>
                {t('project_dashboard_page.image_target_card.header')}
              </h2>
              <p>
                <Link to={getPathForApp(AppPathEnum.targets)}>
                  {t('project_dashboard_page.image_target_card.cta.manage_image_targets')}
                </Link>
              </p>
            </FluidCardContent>
          }

          {customDomainEnabled && hostingCard}
        </FluidCardContainer>

        {['LAUNCH', 'COMPLETE'].includes(app.commercialStatus) &&
          <FluidCardContent>
            <CampaignRedirectSection app={app} updateApp={updateApp} />
          </FluidCardContent>
        }

        <FluidCardContent scrollOnHash={app.webUrl ? undefined : 'url'}>
          <QrCodeSection
            app={app}
            account={account}
            editApp={() => history.push(cameraEditPath)}
            updateApp={updateApp}
          />
        </FluidCardContent>

        {billedUsage &&
          <FluidCardContent>
            <p className='cam-section'>Usage</p>
            <CampaignUsageSection usage={billedUsage} />
          </FluidCardContent>
        }

        <FluidCardContent>
          <ViewTrendsSection app={app} />
        </FluidCardContent>

        {dashboardShowsCodeBrowse(app) &&
          <React.Suspense fallback={null}>
            <LazyCodeBrowseSection appUuid={app.uuid} />
          </React.Suspense>
        }
      </div>
    </Page>
  )
}

export default ProjectPage
