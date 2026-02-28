import React, {useState, useEffect} from 'react'
import {Elements} from '@stripe/react-stripe-js'
import {Container} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import billingActions from './billing-actions'
import featureActions from './feature-actions'
import ErrorMessage from '../home/error-message'
import LegacyManagePlan from './web-plans'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import stripe from './stripe'
import RequestScheduledPlanMessage from './widgets/request-scheduled-plan-message'
import useActions from '../common/use-actions'
import AccountBillingSettings from '../accounts/settings/account-billing-settings'
import {getPathForAccount, AccountPathEnum} from '../common/paths'
import PlatformApiSection from '../accounts/platform-api-section'
import {isPlatformApiVisible} from '../../shared/account-utils'
import {useSelector} from '../hooks'
import AccountPlanContainer from './account-plan/account-plan-container'
import {isAnnualBillingAllowed} from './account-plan/annual-plan-gating'
import useCurrentAccount from '../common/use-current-account'
import {isBillingRole} from '../../shared/roles-utils'
import {CreditPlanContainer} from './credit-plan/credit-plan-container'
import {withTeamLoaded} from '../common/with-state-loaded'
import {areCreditPlansEnabled} from './account-plan/account-credit-gating'
import {TextButton} from '../ui/components/text-button'

const useStyles = createUseStyles({
  manageBillingContainer: {
    paddingTop: '1em',
  },
})

const PlanBillingPage: React.FC = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const account = useCurrentAccount()
  const userRole = useSelector(
    state => state.team.roles.find(e => e.email === state.user.email)?.role
  )
  const accountSubscriptionSchedule = useSelector(
    state => state.billing.accountSubscriptionSchedule
  )
  const deleteScheduledPlanPending = useSelector(
    state => state.billing.deleteScheduledPlanPending
  )
  const {deleteScheduledPlan} = useActions(billingActions)
  const {createFeaturePortal} = useActions(featureActions)
  const [forceReactivateState, setForceReactivateState] = useState(false)
  const [loadingPortal, setLoadingPortal] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const isCamera = !!account?.isCamera
  const hasBillingAccess = isBillingRole(userRole)

  useEffect(() => {
    if (forceReactivateState) {
      setForceReactivateState(false)
    }
  }, [forceReactivateState])

  const handleCancelScheduledPlanRequest = () => {
    deleteScheduledPlan(account)
  }

  const showScheduledPlan = account.accountSubscriptionScheduleId &&
    account.accountSubscriptionScheduleId === accountSubscriptionSchedule?.id

  const launchBillingPortal = async () => {
    setLoadingPortal(true)
    // Set the return URL to the current page
    const returnUrl =
      `${window.location.origin}${getPathForAccount(account, AccountPathEnum.account)}`

    const sessionUrl = await createFeaturePortal({
      account,
      returnUrl,
      configName: 'BillingManagement',
    })
    if (!sessionUrl) {
      setLoadingPortal(false)
      return
    }

    window.location.href = sessionUrl
  }

  return (
    <>
      <WorkspaceCrumbHeading
        text={t('plan_billing_page.heading')}
        account={account}
      />
      {!isModalOpen && <ErrorMessage />}
      <Container className='topContainer content' fluid>
        {showScheduledPlan &&
          <RequestScheduledPlanMessage
            accountSubscriptionSchedule={accountSubscriptionSchedule}
            onCancelScheduledPlanClick={handleCancelScheduledPlanRequest}
            cancelScheduledPlanPending={deleteScheduledPlanPending}
          />
        }

        {isAnnualBillingAllowed(account) &&
          <Elements stripe={stripe}>
            <AccountPlanContainer />
          </Elements>
        }

        {!isAnnualBillingAllowed(account) && !isCamera &&
          <LegacyManagePlan />
        }

        {areCreditPlansEnabled(account) &&
          <CreditPlanContainer
            account={account}
            hasBillingAccess={hasBillingAccess}
            setIsModalOpen={setIsModalOpen}
          />
        }

        {hasBillingAccess && account.stripeId &&
          <div className={classes.manageBillingContainer}>
            <TextButton
              type='button'
              height='medium'
              spacing='short'
              onClick={launchBillingPortal}
              loading={loadingPortal}
            >
              {t('plan_billing_page.manage_billing.button')}
            </TextButton>
          </div>
        }

        <Elements stripe={stripe}>
          <>
            {hasBillingAccess && <AccountBillingSettings />
            }

            {isPlatformApiVisible(account) &&
              <PlatformApiSection account={account} />
            }
          </>
        </Elements>
      </Container>
    </>
  )
}

export default withTeamLoaded(PlanBillingPage)
