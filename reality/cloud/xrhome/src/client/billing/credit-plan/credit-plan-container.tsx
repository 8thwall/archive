import React from 'react'
import {Dimmer} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {
  brandWhite, gray1, gray2, tinyViewOverride,
} from '../../static/styles/settings'
import {Loader} from '../../ui/components/loader'
import {CreditDisplayTracker} from './credit-display-tracker'
import {CreditDisplayInterval} from './credit-display-interval'
import AutoHeading from '../../widgets/auto-heading'
import ButtonLink from '../../uiWidgets/button-link'
import {CreditPurchasePlanCard} from './credit-purchase-plan-card'
import useActions from '../../common/use-actions'
import type {IAccount} from '../../common/types/models'
import {getPathForAccount, AccountPathEnum} from '../../common/paths'
import {
  ACCOUNT_FEATURES, CREDIT_GRANT_FEATURE, FREE_TOP_UP_OPTION, getTopUpOption,
} from '../../../shared/feature-config'
import useCurrentAccount from '../../common/use-current-account'
import {getActiveCreditGrant} from '../../../shared/feature-utils'
import {isBillingRole} from '../../../shared/roles-utils'
import {createSuccessUrl, useFeatureSearchParams} from '../use-feature-search-params'
import CancelCreditPlanModal from './cancel-credit-plan-modal'
import accountActions from '../../accounts/account-actions'
import {useSelector} from '../../hooks'
import {useCurrentUser} from '../../user/use-current-user'
import featuresActions from '../feature-actions'
import CreditTopUpModal from './credit-top-up-modal'
import CreditTopUpConfirmModal from './credit-top-up-confirm-modal'
import {StandardContainer} from '../../ui/components/standard-container'
import {createThemedStyles} from '../../ui/theme'
import {StandardLink} from '../../ui/components/standard-link'
import {SecondaryButton} from '../../ui/components/secondary-button'

const useStyles = createThemedStyles(theme => ({
  creditPlanContainer: {
    padding: '2em',
    borderRadius: '0.5em',
    boxShadow: `2px 2px 18px 8px ${gray1}`,
    background: brandWhite,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    gap: '0.5em',
    alignItems: 'center',
  },
  planName: {
    fontWeight: 600,
    color: theme.fgMuted,
    textTransform: 'uppercase',
  },
  trackerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1.5em',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5em',
    margin: '1.5em 0',
    [tinyViewOverride]: {
      gridTemplateColumns: '1fr',
    },
  },
  contactSalesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
    fontWeight: 600,
    textAlign: 'right',
    [tinyViewOverride]: {
      textAlign: 'center',
      gap: 0,
      marginTop: '1em',
      border: `1px solid ${gray2}`,
      padding: '1em',
      borderRadius: '0.75em',
    },
  },
}))

interface ICreditPlanContainer {
  account: IAccount
  hasBillingAccess: boolean
  setIsModalOpen: (isOpen: boolean) => void
}

const CreditPlanContainer: React.FC<ICreditPlanContainer> = ({
  account,
  hasBillingAccess,
  setIsModalOpen,
}) => {
  const classes = useStyles()
  const user = useCurrentUser()
  const userRole = useSelector(
    state => account.Users?.find(u => u.UserUuid === state.user.uuid)?.role
  )
  const {t} = useTranslation(['account-pages'])
  const {
    createFeatureCheckout, reactivateAccountFeatureSubscription,
  } = useActions(featuresActions)
  const {submitCancelPlanFeedback} = useActions(accountActions)
  const [loading, setLoading] = React.useState(false)
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false)
  const [topUpModalOpen, setTopUpModalOpen] = React.useState(false)
  const [topUpConfirmModalOpen, setTopUpConfirmModalOpen] = React.useState(false)
  const cancelPlanPending = useSelector(state => state.billing.cancelPendingPlanPending)

  React.useEffect(() => {
    setLoading(cancelPlanPending)
  }, [cancelPlanPending])
  React.useEffect(() => {
    setIsModalOpen(topUpModalOpen || cancelModalOpen || topUpConfirmModalOpen)
  }, [topUpModalOpen, cancelModalOpen, topUpConfirmModalOpen])

  const {Features} = useCurrentAccount()
  const activeCreditGrant = getActiveCreditGrant(Features)
  const activeCreditGrantName = activeCreditGrant?.optionName || CREDIT_GRANT_FEATURE.Free.name
  const {
    featureSearchParams,
    isAccountFeaturesLoading,
    isAccountCreditGrantTopUpPurchased,
  } = useFeatureSearchParams()
  const topUpOption = getTopUpOption(activeCreditGrant?.optionName) || FREE_TOP_UP_OPTION
  const topUpBaseCreditAmount = topUpOption?.presetCreditAmounts[0]
  const topUpBasePrice = topUpOption?.price * topUpBaseCreditAmount

  const purchasePlan = async (optionName: string) => {
    setLoading(true)
    // Set the return URL to the current page
    const rootUrl =
    `${window.location.origin}${getPathForAccount(account, AccountPathEnum.account)}`
    const successUrl = createSuccessUrl(rootUrl, {
      category: ACCOUNT_FEATURES.name,
      featureName: CREDIT_GRANT_FEATURE.name,
      optionName,
      entityName: account.shortName,
    })

    await createFeatureCheckout({
      account,
      category: ACCOUNT_FEATURES.name,
      featureName: CREDIT_GRANT_FEATURE.name,
      optionName,
      entityName: account.shortName,
      successUrl,
      cancelUrl: rootUrl,
    })
    setLoading(false)
  }

  const handleSubmitCancelPlanFeedback = (
    feedbackName: any, feedbackDetail: any, setupCall: any
  ) => (
    submitCancelPlanFeedback(
      account.uuid,
      feedbackName,
      feedbackDetail,
      setupCall,
      {crmId: user['custom:crmId'], email: user.email}
    )
  )

  const renewPlan = async () => {
    setLoading(true)
    await reactivateAccountFeatureSubscription({
      account,
      featureName: activeCreditGrant.featureName,
      optionName: activeCreditGrant.optionName,
    })
    setLoading(false)
  }

  React.useEffect(() => {
    if (isAccountCreditGrantTopUpPurchased) {
      setTopUpConfirmModalOpen(true)
    }
  }, [isAccountCreditGrantTopUpPurchased])

  if (isAccountFeaturesLoading) {
    return (
      <div className={classes.creditPlanContainer}>
        <Loader inline centered />
      </div>
    )
  }

  return (
    <StandardContainer padding='large'>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <AutoHeading className={classes.header}>
        <span className={classes.planName}>
          {CREDIT_GRANT_FEATURE[activeCreditGrantName].planName}
        </span>
        <CreditDisplayInterval
          planName={CREDIT_GRANT_FEATURE[activeCreditGrantName].planName}
          creditAmount={CREDIT_GRANT_FEATURE[activeCreditGrantName].creditAmount}
        />
      </AutoHeading>
      <div className={classes.trackerContainer}>
        <CreditDisplayTracker activeCreditGrant={activeCreditGrant} />
        <div className={classes.contactSalesContainer}>
          <div>{t('plan_billing_page.credit_purchase_plan_card.for_enterprise')}</div>
          <StandardLink to='/custom' a8='click;xrhome-account;contact-sales'>
            {t('plan_billing_page.credit_purchase_plan_card.button.contact_sales')}
          </StandardLink>
        </div>
      </div>
      {hasBillingAccess &&
        <>
          {!activeCreditGrant &&
            <div className={classes.cardContainer}>
              <CreditPurchasePlanCard
                planName={CREDIT_GRANT_FEATURE.CoreSub.planName}
                optionName={CREDIT_GRANT_FEATURE.CoreSub.name}
                creditAmount={CREDIT_GRANT_FEATURE.CoreSub.creditAmount}
                price={CREDIT_GRANT_FEATURE.CoreSub.price}
                purchasePlan={purchasePlan}
              />
              <CreditPurchasePlanCard
                planName={CREDIT_GRANT_FEATURE.PowerSub.planName}
                optionName={CREDIT_GRANT_FEATURE.PowerSub.name}
                creditAmount={CREDIT_GRANT_FEATURE.PowerSub.creditAmount}
                price={CREDIT_GRANT_FEATURE.PowerSub.price}
                purchasePlan={purchasePlan}
              />
            </div>
          }
          {isBillingRole(userRole) &&
            <div className={classes.cardContainer}>
              <CreditPurchasePlanCard
                planName={topUpOption.planName}
                optionName={topUpOption.name}
                creditAmount={topUpBaseCreditAmount}
                price={topUpBasePrice}
                purchasePlan={() => setTopUpModalOpen(true)}
              />
            </div>
          }
          {activeCreditGrant && isBillingRole(userRole) &&
            <div className={classes.footerRow}>
              {activeCreditGrant.subscriptionEndsAt &&
                <ButtonLink
                  color='black'
                  onClick={renewPlan}
                >
                  {t('plan_billing_page.credit_purchase_plan.button.reactivate_plan')}
                </ButtonLink>
              }
              {!activeCreditGrant.subscriptionEndsAt &&
                <SecondaryButton onClick={() => setCancelModalOpen(true)}>
                  {t('plan_billing_page.credit_purchase_plan.button.cancel_plan')}
                </SecondaryButton>
              }
            </div>
          }
        </>
      }
      {cancelModalOpen &&
        <CancelCreditPlanModal
          onClose={() => setCancelModalOpen(false)}
          submitCancelPlanFeedback={handleSubmitCancelPlanFeedback}
        />
      }
      {topUpModalOpen &&
        <CreditTopUpModal onClose={() => setTopUpModalOpen(false)} />
      }
      {topUpConfirmModalOpen &&
        <CreditTopUpConfirmModal
          creditAmount={featureSearchParams?.quantity || 0}
          onClose={() => setTopUpConfirmModalOpen(false)}
        />
      }
    </StandardContainer>
  )
}

export {CreditPlanContainer}
