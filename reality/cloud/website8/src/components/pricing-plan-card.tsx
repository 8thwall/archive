import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'
import {Link} from 'gatsby'

import {bool, combine} from '../styles/classname-utils'
import {
  brandBlack, brandPurple, brandWhite, brandHighlight,
  gray4, gray5, gray2, darkMint,
} from '../styles/brand-colors'
import checkMark from '../../img/mint-checkmark.svg'
import {
  MOBILE_VIEW_OVERRIDE, SMALL_MONITOR_VIEW_OVERRIDE, TABLET_VIEW_OVERRIDE,
} from '../styles/constants'
import {useUserContext, IUserContext} from '../common/user-context'

const useStyles = createUseStyles({
  planCard: {
    'position': 'relative',
    'backgroundColor': brandWhite,
    'borderColor': gray2,
    'borderWidth': '0 1px 1px 1px',
    'width': '367px',
    'maxWidth': '367px',
    'padding': '2em 1.25em',
    'overflow': 'hidden',
    'flex': 1,
    'borderStyle': 'solid',
    'borderRight': `1px solid ${gray2}`,
    'borderBottom': `1px solid ${gray2}`,
    'borderLeft': `1px solid ${gray2}`,
    'borderRadius': '16px',
    'boxShadow': '1px 1px 5px 0px rgba(70, 71, 102, 0.10)',
    [SMALL_MONITOR_VIEW_OVERRIDE]: {
      'padding': '2em 0.5em',
    },
    [TABLET_VIEW_OVERRIDE]: {
      'max-width': '50%',
      'padding': '2em 1.25em',
    },
    [MOBILE_VIEW_OVERRIDE]: {
      'minWidth': '100%',
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
  priceSubtext: {
    color: brandBlack,
    fontSize: '0.75em',
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
  discountText: {
    fontSize: '12px',
  },
  discountNewPrice: {
    color: darkMint,
  },
  value: {
    'fontFamily': '\'Noto Sans JP\', sans-serif',
    'fontWeight': 900,
    'fontSize': '2rem',
    'letterSpacing': -0.45,
    'paddingRight': '.2rem',
    'color': brandBlack,
    'marginBlockEend': '0 !important',
    'marginBlockStart': '0 !important',

    '&:not(last-child)': {
      marginBottom: 0,
    },
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
  hide: {
    visibility: 'hidden',
  },
})

const IncludedFeature = ({info}) => {
  const styles = useStyles()
  let featureContent = info

  if (typeof info === 'object') {
    featureContent = (
      <div>
        <Trans
          ns='pricing-page'
          i18nKey={info.key}
          components={{
            a: <Link to={info.link} />,
          }}
        />
      </div>
    )
  }

  return (
    <div className={styles.includedFeature}>
      <img src={checkMark} className={styles.checkMark} alt='checkmark' />
      {featureContent}
    </div>
  )
}

const tryNewAccount = (currentUser) => () => {
  window.location.href = currentUser ? '/workspaces' : '/get-started'
}

interface IPricingPlanCard {
  accentColor: string,
  description: string,
  featureList: string[],
  name: string,
  discount?: {oldPrice: number, newPrice: number}
  needToContact?: boolean
  price?: string | number
  isAnnuallyBilled?: boolean
  contactLink: string
}

const PricingPlanCard: React.FC<IPricingPlanCard> = ({
  name, description, price, accentColor, featureList = [], discount, isAnnuallyBilled,
  needToContact,
}) => {
  const {t} = useTranslation(['pricing-page'])
  const {currentUser}: IUserContext = useUserContext()
  const styles = useStyles(accentColor)
  const showPriceNumber = typeof price === 'number'
  const hideContactButton = !needToContact || showPriceNumber
  const buttonLink = tryNewAccount(currentUser)
  const buttonLinkCta = needToContact
    ? t('pricing_plan_card.contact_us')
    : t('pricing_plan_card.get_started')

  const priceText = (
    <p className='m-0'>
      <span className={styles.value}>${price}</span>
      <span className={styles.priceSubtext}>
        {isAnnuallyBilled ? '/ month billed annually' : ' / month'}
      </span>
    </p>
  )

  const noPriceText = (
    <p className={styles.value}>{price}</p>
  )

  return (
    <div className={combine(styles.planCard, 'd-lg-block')}>
      <div className={styles.accentBox} />
      <div className={styles.name}>{name}</div>
      <div className='text-center'>
        <p className={combine(styles.description, 'font8-semibold text-center')}>
          {description}
        </p>
      </div>
      <div className='text-center mb-3'>
        {showPriceNumber ? priceText : noPriceText}
        <span className={combine(styles.discountText, bool(!discount, styles.hide))}>
          <s>
            ${discount?.oldPrice}
          </s>&nbsp;
          <span className={styles.discountNewPrice}>${discount?.newPrice} / year</span>
        </span>
      </div>
      <div>
        <button
          id='start-trial-agency'
          type='button'
          onClick={buttonLink}
          className={combine(styles.planButton, bool(hideContactButton, styles.highlightButton))}
          // TODO(Brandon): Update a8 tagging to not refer to free trial.
          a8='click;click-free-trial-cta;agency-free-trial-cta'
        >
          {buttonLinkCta}
        </button>
      </div>
      <div className={`card-footer ${styles.featureList}`}>
        {!!featureList.length && featureList.map((point) => <IncludedFeature info={point} />)}
      </div>
    </div>

  )
}

export default PricingPlanCard
