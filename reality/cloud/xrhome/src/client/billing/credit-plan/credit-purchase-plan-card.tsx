import React, {useMemo} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'

import {mobileViewOverride} from '../../static/styles/settings'
import {Icon} from '../../ui/components/icon'
import {SecondaryButton} from '../../ui/components/secondary-button'
import {CreditDisplayBudget} from './credit-display-budget'
import {CreditDisplayPrice} from './credit-display-price'
import {CREDIT_GRANT_FEATURE} from '../../../shared/feature-config'
import useCurrentAccount from '../../common/use-current-account'
import {getActiveCreditGrant} from '../../../shared/feature-utils'
import {Badge} from '../../ui/components/badge'
import {formatToCurrency} from '../../../shared/billing/currency-formatter'
import {StandardContainer} from '../../ui/components/standard-container'
import {SpaceBetween} from '../../ui/layout/space-between'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  planName: {
    textTransform: 'uppercase',
    color: theme.fgMuted,
    fontSize: '1.25em',
    fontWeight: 700,
  },
  description: {
    fontSize: '1.125em',
  },
  buttonRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '-1em',
  },
  costContainer: {
    display: 'flex',
    gap: '0.5em',
    [mobileViewOverride]: {
      flexDirection: 'column',
      gap: 0,
    },
  },
  costPerCredit: {
    fontStyle: 'italic',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25em',
  },
}))

interface ICreditPurchasePlanCard {
  planName: string
  optionName: string
  creditAmount?: number
  price?: number
  originalPrice?: number
  purchasePlan?: (priceId: string) => void
}

const CreditPurchasePlanCard: React.FC<ICreditPurchasePlanCard> = ({
  planName,
  optionName,
  creditAmount = 500,
  price,
  originalPrice,
  purchasePlan,
}) => {
  const account = useCurrentAccount()
  const classes = useStyles()
  const {t} = useTranslation(['account-pages', 'common'])
  const activeCreditGrant = getActiveCreditGrant(account.Features)

  const isEnterprise = planName === CREDIT_GRANT_FEATURE.Enterprise.planName
  const isTopUp = CREDIT_GRANT_FEATURE[optionName]?.isTopUp

  const planTitle = `plan_billing_page.credit_purchase_plan_card.title.${planName.toLowerCase()}`
  const planDescription =
    `plan_billing_page.credit_purchase_plan_card.description.${planName.toLowerCase()}`

  const pricingPageLink = useMemo(() => {
    const pricingUrlParams = new URLSearchParams()
    pricingUrlParams.set('account', account.shortName)
    return decodeURIComponent(`/pricing?${pricingUrlParams.toString()}#pricing-credit-plans`)
  }, [account.shortName])

  return (
    <StandardContainer>
      <SpaceBetween direction='vertical'>
        <div className={classes.planName}>{t(planTitle)}</div>
        <div className={classes.description}>{t(planDescription)}</div>
        <CreditDisplayPrice
          optionName={optionName}
          price={price}
          originalPrice={originalPrice}
        />
        <CreditDisplayBudget
          optionName={optionName}
          creditAmount={creditAmount}
        />
        <div className={classes.buttonRow}>
          {!isTopUp &&
            <Link
              to={pricingPageLink}
              className={classes.link}
            >
              {t('plan_billing_page.credit_purchase_plan_card.button.view_details')}
              <Icon
                size={0.75}
                stroke='chevronRight'
              />
            </Link>
        }
          {isTopUp &&
            <div className={classes.costContainer}>
              <span className={classes.costPerCredit}>
                {t(
                  'plan_billing_page.credit_purchase_plan_card.cost_per_credit',
                  {
                    costPerCredit: formatToCurrency(
                      (price / creditAmount) * 100,
                      {currency: 'usd', decimalPlaces: 2}
                    ),
                  }
                )}
              </span>
              {activeCreditGrant &&
                <Badge color='mint' variant='pastel'>
                  <Trans
                    ns='account-pages'
                    i18nKey={'plan_billing_page.credit_purchase_plan_card.discount.' +
                              `${activeCreditGrant.optionName.toLowerCase()}`}
                    values={{
                      planName: (CREDIT_GRANT_FEATURE[activeCreditGrant.optionName].planName)
                        .toUpperCase(),
                    }}
                    components={{1: <b />}}
                  />
                </Badge>
            }
            </div>
        }
          {!isEnterprise &&
            <SecondaryButton
              spacing='normal'
              onClick={() => purchasePlan(optionName)}
            >
              {isTopUp
                ? t('plan_billing_page.credit_purchase_plan_card.button.buy_now')
                : t('plan_billing_page.credit_purchase_plan_card.button.upgrade')
            }
            </SecondaryButton>
        }
          {isEnterprise &&
            <a
              href='/custom'
            >
              <SecondaryButton onClick={() => {}}>
                {t('plan_billing_page.credit_purchase_plan_card.button.contact_sales')}
              </SecondaryButton>
            </a>
        }
        </div>
      </SpaceBetween>
    </StandardContainer>
  )
}

export {CreditPurchasePlanCard}
