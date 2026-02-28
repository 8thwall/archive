import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import {bool, combine} from '../styles/classname-utils'
import {
  brandBlack, brandPurple, brandWhite, brandHighlight,
  gray4, gray5, gray2,
} from '../styles/brand-colors'
import checkMark from '../../img/blue-checkmark.svg'
import {SMALL_MONITOR_VIEW_OVERRIDE, TABLET_VIEW_OVERRIDE} from '../styles/constants'
import {useUserContext, IUserContext} from '../common/user-context'

const useStyles = createUseStyles({
  planCard: {
    'position': 'relative',
    'backgroundColor': brandWhite,
    'borderColor': gray2,
    'borderWidth': '0 1px 0 0',
    'filter': `drop-shadow(0 0 20px rgba(${gray5}, 20%))`,
    'padding': '2em 1.25em',
    'overflow': 'hidden',
    'flex': 1,
    'borderStyle': 'solid',
    '&:last-child': {
      borderWidth: '0',
    },
    [SMALL_MONITOR_VIEW_OVERRIDE]: {
      'padding': '2em 0.5em',
    },
    [TABLET_VIEW_OVERRIDE]: {
      'width': '350px',
      'padding': '2em 1.25em',
      'borderRadius': '8px',
      'borderWidth': '1px',
      'margin': '1em',
      'filter': `drop-shadow(2px 2px 10px ${gray5}1A)`,
      '&:last-child': {
        borderWidth: '1px',
      },
    },
  },
  accentBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '6px',
    width: '100%',
    backgroundColor: (accentColor) => `${accentColor}`,
  },
  name: {
    fontFamily: '\'Nunito\', sans-serif',
    fontWeight: 700,
    fontSize: '1.5rem',
    letterSpacing: '1.3px',
    color: brandBlack,
    textAlign: 'center',
    marginBottom: '0.5em',
  },
  description: {
    'color': gray4,
    'height': '5.5em',
    'lineHeight': '1.5em',
    'fontWeight': 400,
    'fontSize': '0.88em',
    '@media (min-width: 1200px)': {
      height: '4em',
    },
    [TABLET_VIEW_OVERRIDE]: {
      height: 'auto',
      margin: 0,
    },
  },
  pricingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1em',
  },
  pricingMain: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  priceSubtext: {
    color: gray4,
    fontSize: '0.75em',
    fontStyle: 'italic',
  },
  cents: {
    fontSize: '0.7em',
  },
  checkMark: {
    flex: '0 0 0.5rem',
    margin: '0.35rem 0.75rem 0 0',
  },
  includedFeature: {
    'display': 'flex',
    'alignItems': 'start',
    'margin': '0.5em 0',
    'fontFamily': '\'Nunito\', sans-serif',
    'fontSize': '0.88em',
    '& span': {
      color: gray4,
      fontWeight: 400,
    },
    '& b': {
      fontWeight: 700,
      color: gray5,
    },
  },
  value: {
    fontFamily: '\'Noto Sans JP\', sans-serif',
    fontWeight: 900,
    fontSize: '2rem',
    letterSpacing: -0.45,
    paddingRight: '.2rem',
    color: brandBlack,
    margin: '0 !important',
    marginBlockEend: '0 !important',
    marginBlockStart: '0 !important',
  },
  customPricing: {
    fontSize: '1.5rem',
    padding: '0.25em 0 1em',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    marginTop: 0,
    padding: '2rem 0 0 0',
    [SMALL_MONITOR_VIEW_OVERRIDE]: {
      padding: '2em 0.5em 0',
    },
    [TABLET_VIEW_OVERRIDE]: {
      padding: '2rem 0 0 0',
    },
  },
  planButton: {
    'fontFamily': '\'Nunito\', sans-serif',
    'whiteSpace': 'nowrap',
    'borderRadius': '8px',
    'backgroundColor': 'transparent',
    'border': `1px solid ${brandPurple}`,
    'color': brandPurple,
    'display': 'block',
    'width': '100%',
    'paddingTop': '6px',
    'paddingBottom': '6px',
    'cursor': 'pointer',
    '&:active': {
      boxShadow: 'none',
      outline: 'none',
      backgroundColor: brandHighlight,
      borderColor: brandWhite,
    },
    '&:focus': {
      outline: 'none',
    },
    '&:focus-visible': {
      outline: 'none',
    },
    [SMALL_MONITOR_VIEW_OVERRIDE]: {
      fontSize: '0.85em',
    },
    [TABLET_VIEW_OVERRIDE]: {
      fontSize: '1em',
    },
  },
  highlightButton: {
    backgroundColor: brandPurple,
    color: brandWhite,
  },
})

const IncludedFeature = ({info}) => {
  const styles = useStyles()
  return (
    <div className={styles.includedFeature}>
      <img src={checkMark} className={styles.checkMark} alt='checkmark' />
      {info}
    </div>
  )
}

const tryFreeTrial = (currentUser) => () => {
  window.location.href = currentUser
    ? '/workspaces'
    : '/start-your-free-trial'
}

interface IPricingPlanCard {
  name: string,
  description: string,
  priceNumber?: string,
  billingText?: React.ReactNode,
  children: React.ReactNode,
  accentColor: string,
  highlight?: boolean,
  hide: boolean,
}

const PricingPlanCard: React.FC<IPricingPlanCard> = ({
  name, description, priceNumber, children, accentColor, highlight = false,
  hide, billingText,
}) => {
  const {t} = useTranslation(['pricing-page'])
  const {currentUser}: IUserContext = useUserContext()
  // how to set custom style
  const styles = useStyles(accentColor)
  const buttonLink = tryFreeTrial(currentUser)
  const splitPrice = (`${priceNumber}`).split('.')

  const tryFreeTrialText = currentUser
    ? t('pricing_plan_card.button.manage_account')
    : t('pricing_plan_card.button.start_trial')
  return (
    <div className={combine(
      styles.planCard,
      bool(hide, 'd-none'),
      'd-lg-block'
    )}
    >
      <div className={styles.accentBox} />
      <div className={styles.name}>{name}</div>
      <div className='text-center'>
        <p className={combine(
          styles.description,
          'text8-md font8-semibold text-center'
        )}
        >
          {description}
        </p>
      </div>
      {priceNumber &&
        <div className={styles.pricingContainer}>
          <div className={styles.pricingMain}>
            <p className={styles.value}>
              ${splitPrice[0]}
              {splitPrice[1] && <span className={styles.cents}>{`.${splitPrice[1]}`}</span>}
            </p>
            <p className={combine(styles.priceSubtext, 'mb-0 text8-md')}>
              <em>/ {t('pricing_plan_card.month_after_trial')}</em>
            </p>
          </div>
          <div className={styles.priceSubtext}>
            {billingText || t('pricing_plan_card.billed_monthly')}
          </div>
        </div>}
      {!priceNumber &&
        <div className={styles.pricingContainer}>
          <div className={styles.pricingMain}>
            <p className={combine(styles.value, styles.customPricing)}>
              {t('pricing_plan_card.custom_pricing')}
            </p>
          </div>
        </div>}
      <div>
        <button
          id='start-trial-agency'
          type='button'
          onClick={buttonLink}
          className={combine(styles.planButton, bool(highlight, styles.highlightButton))}
          a8='click;click-free-trial-cta;agency-free-trial-cta'
        >
          {priceNumber ? tryFreeTrialText : t('pricing_plan_card.contact_sales')}
        </button>
      </div>
      <div className={`card-footer ${styles.featureList}`}>
        {children && children.map((point) => <IncludedFeature info={point} />)}
      </div>
    </div>

  )
}

export default PricingPlanCard
