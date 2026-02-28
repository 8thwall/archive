import React, {useEffect} from 'react'
import {useRouteMatch} from 'react-router-dom'
import format from 'date-fns/format'
import {shallowEqual} from 'react-redux'

import {useSelector} from '../hooks'
import clockIcon from '../static/clockIcon.png'
import {getRouteAccount, getPathForAccount, AccountPathEnum} from '../common/paths'
import {
  getCurrentBillingEndDate, describeSource, getAccountSubscriptionPaymentMethod,
} from './billing-utils'
import {
  isBusiness, isEnterprise, getPlanTypeForAccountType, hasPendingCancellation,
} from '../../shared/account-utils'
import {gray5} from '../static/styles/settings'
import invoicesActions from '../invoices/actions'
import useActions from '../common/use-actions'
import NextPamyent from './widgets/next-payment'
import {createCustomUseStyles} from '../common/create-custom-use-styles'
import {isBillingRole} from '../../shared/roles-utils'
import {Loader} from '../ui/components/loader'
import {StandardContainer} from '../ui/components/standard-container'
import {SpaceBetween} from '../ui/layout/space-between'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import AutoHeading from '../widgets/auto-heading'
import {Badge} from '../ui/components/badge'
import {Icon} from '../ui/components/icon'
import {StandardLink} from '../ui/components/standard-link'

const useStyles = createCustomUseStyles<{isTinyScreen: boolean}>()({
  accountSubscriptionPaymentMethod: {
    marginBottom: '1em',
    color: gray5,
  },
  nextPayment: {
    marginBottom: '0',
    fontSize: '1.2em !important',
  },
  heading: {
    margin: '0 !important',
  },
  subHeading: {
    fontSize: '1.25em',
    margin: '0 !important',
  },
  cost: {
    fontSize: '1.5em',
  },
  currentPlanBadge: {
    placeSelf: 'center',
  },
})

const BusinessPlan: React.FC = () => {
  const match = useRouteMatch()
  const account = useSelector(state => getRouteAccount(state, match))
  const isTinyScreen = useSelector(state => state.common.isTinyScreen)
  const userRole = useSelector(
    state => account?.Users?.find(u => u.UserUuid === state.user?.uuid)?.role
  )
  const cycleEndDate = useSelector(state => getCurrentBillingEndDate(state))
  const accountSubscriptionPaymentMethod = useSelector(
    state => getAccountSubscriptionPaymentMethod(state)
  )
  const {getUpcomingPlanInvoice} = useActions(invoicesActions)
  const upcomingInvoice = useSelector(state => state.invoices.upcomingPlanInvoice)
  const loadingUpcomingInvoice = useSelector(
    state => state.invoices.pending.upcomingPlanInvoice !== false
  )
  const errorFetchingUpcomingInvoice = useSelector(
    state => state.invoices.error.upcomingPlanInvoice
  )
  const address = useSelector(state => state.billing.address, shallowEqual)
  const classes = useStyles({isTinyScreen})

  const endDate = cycleEndDate && format(cycleEndDate, 'MM/dd/yyyy')
  const teamPath = getPathForAccount(account, AccountPathEnum.team)
  const canEditPlan = isBillingRole(userRole)
  const isBusinessAccount = isBusiness(account) || isEnterprise(account)
  const isBillingRoleOnActivePlan = isBusinessAccount && canEditPlan &&
    !hasPendingCancellation(account)

  const displaySubscriptionInfo = () => {
    if (!isBusinessAccount) {
      return null
    } else if (account.pendingCancellation === 'EndOfCycle') {
      return (
        <p className='expiring-description'>
          <img className='expiring-img' src={clockIcon} alt='clock' />
              &nbsp;Your subscription expires on {endDate}
        </p>
      )
    } else {
      return (
        <div className={classes.currentPlanBadge}>
          <Badge color='mint' height='small'>
            <Icon stroke='checkmark' />
            Current Plan
          </Badge>
        </div>
      )
    }
  }

  useEffect(() => {
    if (isBillingRoleOnActivePlan) {
      getUpcomingPlanInvoice(account)
    }
  }, [account.uuid, address])

  if (isBillingRoleOnActivePlan && loadingUpcomingInvoice) {
    return (
      <StandardContainer padding='large'>
        <Loader inline centered />
      </StandardContainer>
    )
  }

  return (
    <AutoHeadingScope>
      <StandardContainer padding='large'>
        <SpaceBetween between centered>
          <SpaceBetween direction='vertical'>
            <AutoHeading className={classes.heading}>{
            getPlanTypeForAccountType('WebBusiness').toUpperCase()}
            </AutoHeading>
            <AutoHeading className={classes.subHeading}>
              <span className={classes.cost}>$250/</span> month for your entire team *
            </AutoHeading>
            <b>
              For companies managing their own 8th Wall account and integrations
            </b>
            <span>
              Commercial Use Licenses are purchased separately.{' '}
              <StandardLink newTab href='https://www.8thwall.com/pricing'>
                View Pricing
              </StandardLink>
            </span>
            <span>
              * Depending on where you live, you may be charged taxes <br />
              in addition to your subscription price.
            </span>
          </SpaceBetween>
          <SpaceBetween direction='vertical' extraWide>
            {isBillingRoleOnActivePlan && accountSubscriptionPaymentMethod &&
              <>
                {/* TODO(johnny): This still needs to be updated. */}
                <NextPamyent
                // Silently fail if there was an error fetching the upcoming plan invoice.
                  upcomingInvoice={!errorFetchingUpcomingInvoice && upcomingInvoice}
                  className={classes.nextPayment}
                />
                {describeSource(
                  accountSubscriptionPaymentMethod,
                  {
                    icons: true,
                    mask: 'ending in',
                    className: classes.accountSubscriptionPaymentMethod,
                  }
                )}
              </>
            }
            {displaySubscriptionInfo()}
            {isBusinessAccount && canEditPlan &&
              <p>
                Business plan has been discontinued.<br />
                To change or cancel your plan, please contact{' '}<br />
                <StandardLink newTab href='mailto:support@8thwall.com'>
                  support@8thwall.com
                </StandardLink>
              </p>
            }
            {!canEditPlan &&
              <p>
                Contact the{' '}
                <StandardLink to={teamPath}>workspace owner</StandardLink>
                {' '}to {isBusinessAccount ? 'modify' : 'upgrade'}.
              </p>
            }
          </SpaceBetween>
        </SpaceBetween>
      </StandardContainer>
    </AutoHeadingScope>
  )
}

export default BusinessPlan
