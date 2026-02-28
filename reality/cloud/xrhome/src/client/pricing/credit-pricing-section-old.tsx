import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'
import {Link, useLocation} from 'react-router-dom'
import querystring from 'query-string'

import {
  brandWhite, mobileViewOverride, headerSanSerif, brandPurple, gray1, tinyViewOverride,
} from '../static/styles/settings'
import {CreditPricingCard} from './credit-pricing-card-old'
import {useSelector} from '../hooks'
import {AccountPathEnum, getPathForAccount, getPathForSignUpPage} from '../common/paths'
import {AssetLabSampleCarousel} from './asset-lab-sample-carousel-old'

const useStyles = createUseStyles({
  planContainer: {
    maxWidth: '1500px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2em',
    margin: '0 2em',
    borderRadius: '1.5em',
    padding: '2em 1.5em',
    color: brandWhite,
    background: 'linear-gradient(#000, #76327B)',
    [mobileViewOverride]: {
      flexDirection: 'column',
      padding: '1em 1em 2em',
    },
    [tinyViewOverride]: {
      alignItems: 'stretch',
    },
  },
  headingContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    scrollMarginTop: '5em',
    gap: '1em',
    textAlign: 'center',
  },
  heading: {
    fontFamily: headerSanSerif,
    fontWeight: 900,
    textAlign: 'center',
    fontSize: '2.25em',
    lineHeight: '1.25em',
    [mobileViewOverride]: {
      fontSize: '1.5em',
    },
    [tinyViewOverride]: {
      maxWidth: '15em',
    },
  },
  subheading: {
    fontSize: '1.25em',
  },
  cardContainer: {
    display: 'flex',
    gap: '0.75em',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  ctaButton: {
    'marginBottom': '1em',
    'padding': '1em',
    'borderRadius': '3em',
    'fontWeight': 700,
    'fontSize': '1.125em',
    'whiteSpace': 'nowrap',
    'textAlign': 'center',
    'background': brandWhite,
    'color': brandPurple,
    'minWidth': '12em',
    '&:hover': {
      background: gray1,
    },
  },
})

const CreditPricingSection: React.FunctionComponent = () => {
  const classes = useStyles()
  const {t} = useTranslation(['pricing-page'])
  const location = useLocation()
  const account = useSelector((state) => {
    const accounts = state.accounts.allAccounts
    return accounts.find(acct => acct.shortName === querystring.parse(location.search).account)
  })

  const creditPlans = [
    {
      // eslint-disable-next-line local-rules/hardcoded-copy
      planName: 'Free',
      topUpName: 'FreeTopUp',
      modelCount: 6,
      imageCount: 28,
    },
    {
      planName: 'CoreSub',
      topUpName: 'CoreTopUp',
      modelCount: 125,
      imageCount: 285,
      discountPercentage: 50,
    },
    {
      planName: 'PowerSub',
      topUpName: 'PowerTopUp',
      modelCount: 750,
      imageCount: 1785,
      discountPercentage: 60,
    },
  ]

  return (
    <div id='pricing-credit-plans' className={classes.planContainer}>
      <div className={classes.headingContainer}>
        <div className={classes.heading}>
          {t('credit_pricing_section.heading')}
        </div>
        <div className={classes.subheading}>
          {t('credit_pricing_section.subheading')}
        </div>
      </div>
      <AssetLabSampleCarousel />
      <div className={classes.cardContainer}>
        {creditPlans.map(creditPlan => (
          <CreditPricingCard
            key={creditPlan.planName}
            planName={creditPlan.planName}
            topUpName={creditPlan.topUpName}
            modelCount={creditPlan.modelCount}
            imageCount={creditPlan.imageCount}
            discount={creditPlan.discountPercentage}
          />
        ))}
      </div>
      <Link
        to={account
          ? getPathForAccount(account, AccountPathEnum.account)
          : getPathForSignUpPage()}
      >
        <div className={classes.ctaButton}>
          {t('credit_pricing_card.button.create_for_free')}
        </div>
      </Link>
    </div>
  )
}

export {CreditPricingSection}
