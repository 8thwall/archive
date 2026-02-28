import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {Trans, useTranslation} from 'react-i18next'

import {Link} from 'react-router-dom'

import {
  brandHighlight, brandWhite, mobileViewOverride, mango, darkOrange, gray4, headerSanSerif,
  brandPurple, smallMonitorViewOverride, blueberry, brandPurpleDark,
  tinyViewOverride,
} from '../static/styles/settings'
import {combine} from '../common/styles'
import {hexColorWithAlpha} from '../../shared/colors'
import {Icon} from '../ui/components/icon'
import {getPathForSignUpPage} from '../common/paths'

const useStyles = createUseStyles({
  planContainer: {
    maxWidth: '1500px',
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
    gap: '1.5em',
    padding: '0 6em',
    [smallMonitorViewOverride]: {
      padding: '1em 1em 2em',
    },
    [mobileViewOverride]: {
      flexDirection: 'column',
      gap: '1em',
      padding: '1em 0 2em',
    },
  },
  cardColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    justifyContent: 'center',
  },
  planName: {
    fontFamily: headerSanSerif,
    fontWeight: 700,
    fontSize: '1.75em',
    textAlign: 'center',
    lineHeight: '1em',
    marginBottom: '0.25em',
  },
  freePlanName: {
    textAlign: 'left',
    background: `linear-gradient(90deg, ${brandPurple}, ${brandHighlight} 30%, ${blueberry} 60%)`,
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontSize: '2.25em',
    margin: 0,
  },
  freePricing: {
    fontSize: '1.5em',
  },
  freeDescription: {
    fontWeight: 600,
    fontSize: '1.5em',
    lineHeight: '1.25em',
    [tinyViewOverride]: {
      textAlign: 'center',
      fontSize: '1.25em',
    },
  },
  freePlanHeading: {
    display: 'flex',
    gap: '0.5em',
    alignItems: 'center',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  card: {
    background: brandWhite,
    filter: `drop-shadow(0.25em 0.25em 0.25em ${hexColorWithAlpha(gray4, 0.15)})`,
    borderRadius: '0.75em',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 5,
  },
  freeCard: {
    display: 'flex',
    gap: '1em',
    flexDirection: 'row',
    width: '100%',
    padding: '2.125em',
    [tinyViewOverride]: {
      flexDirection: 'column',
      gap: '1em',
    },
  },
  freeCardInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: '3',
    gap: '1em',
    [tinyViewOverride]: {
      alignItems: 'center',
    },
  },
  featureCard: {
    alignItems: 'center',
    gap: '0.5em',
    padding: '1.25em 2em',
    flex: 1,
    fontSize: '1.125em',
    fontWeight: 300,
    [mobileViewOverride]: {
      padding: '1.25em',
    },
  },
  featureCardRow: {
    display: 'flex',
    gap: '1em',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  freeFeaturesContainer: {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '1.25em',
    'flex': '2',
    '& $feature': {
      fontWeight: 600,
      justifyContent: 'flex-end',
      gap: '1.75em',
      [tinyViewOverride]: {
        justifyContent: 'space-between',
      },
    },
  },
  freeFeaturesHeading: {
    alignSelf: 'flex-end',
    fontWeight: 300,
    fontSize: '1.125em',
    [tinyViewOverride]: {
      alignSelf: 'center',
    },
  },
  featureHeading: {
    fontWeight: 600,
    display: 'flex',
    gap: '0.5em',
    alignItems: 'center',
  },
  plusIconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25em',
  },
  plusIcon: {
    backgroundColor: brandWhite,
    border: `1px solid ${gray4}`,
    padding: '0.35em',
    borderRadius: '50%',
    display: 'flex',
    zIndex: 5,
  },
  gradientBlock: {
    height: '1px',
    flex: 1,
    background: `linear-gradient(90deg, ${hexColorWithAlpha(gray4, 0)} 0%, ${gray4} 100%)`,
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
  addOnPrice: {
    fontWeight: 700,
  },
  badge: {
    backgroundColor: hexColorWithAlpha(mango, 0.3),
    color: darkOrange,
    borderRadius: '2em',
    padding: '0 1em',
    fontSize: '0.75em',
    fontWeight: 300,
  },
  ctaButton: {
    fontSize: '1.125em',
    lineHeight: '1.625em',
    fontWeight: 600,
    padding: '0.5em 1.25em',
    borderRadius: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  freeCtaButton: {
    'color': brandWhite,
    'background': brandPurple,
    'alignSelf': 'center',
    [mobileViewOverride]: {
      width: '100%',
      padding: '0.75em 1em',
      margin: 0,
    },
    '&:hover': {
      background: brandPurpleDark,
    },
  },
  feature: {
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'space-between',
    'fontSize': '1.125em',
    '& span:last-child': {
      fontWeight: 700,
    },
  },
  bokehBackground: {
    position: 'absolute',
  },
  bokehParticle: {
    borderRadius: '50%',
    filter: 'blur(5em)',
    position: 'absolute',
    zIndex: 0,
  },
  bokehBlue: {
    left: '30%',
    height: '15em',
    width: '15em',
    background: hexColorWithAlpha(blueberry, 0.3),
  },
  bokehPurpleLeft: {
    left: '-5%',
    top: '30%',
    height: '15em',
    width: '15em',
    background: hexColorWithAlpha(brandHighlight, 0.3),
  },
  bokehPurpleRight: {
    right: '0%',
    top: '10%',
    height: '30em',
    width: '30em',
    background: hexColorWithAlpha(brandHighlight, 0.3),
  },
  whiteLabelPriceContainer: {
    borderRadius: '0.5em',
    display: 'flex',
    gap: '2em',
    [mobileViewOverride]: {
      flexDirection: 'column',
      gap: '0.5em',
      alignItems: 'center',
    },
  },
  addOnPriceContainer: {
    display: 'flex',
  },
  addOnIntervalSpace: {
    display: 'none',
    [mobileViewOverride]: {
      display: 'block',
    },
  },
  addOnIntervalDash: {
    display: 'block',
    [mobileViewOverride]: {
      display: 'none',
    },
  },
})

const FeaturePricingSection: React.FunctionComponent = () => {
  const classes = useStyles()
  const {t} = useTranslation(['pricing-page'])

  return (
    <div className={classes.planContainer}>
      <div className={classes.cardColumnContainer}>
        <div className={combine(classes.card, classes.freeCard)}>
          <div className={classes.freeCardInfoContainer}>
            <div className={classes.freePlanHeading}>
              <div className={combine(classes.planName, classes.freePlanName)}>
                {t('credit_pricing_section.plan.free.name').toLocaleUpperCase()}
              </div>
              <div className={classes.freePricing}>
                <Trans
                  ns='pricing-page'
                  i18nKey='credit_pricing_section.feature.pricing'
                  components={{1: <span />}}
                  values={{pricing: '$0'}}
                />
              </div>
            </div>
            <div className={classes.freeDescription}>
              {t('credit_pricing_section.plan.free.description')}
            </div>
            <Link
              to={getPathForSignUpPage()}
            >
              <div
                className={combine(classes.ctaButton, classes.freeCtaButton)}
              >
                {t('credit_pricing_card.button.create_for_free')}
              </div>
            </Link>
          </div>
          <div className={classes.freeFeaturesContainer}>
            <div className={classes.freeFeaturesHeading}>
              {t('credit_pricing_section.description.all_core_tools_features')}
            </div>
            <div className={classes.feature}>
              <span>{t('pricing_plan_card.feature.team_size')}</span>
              <span>1-10</span>
            </div>
            <div className={classes.feature}>
              <span>{t('pricing_plan_card.feature.monthly_credits')}</span>
              <span>50</span>
            </div>
            <div className={classes.feature}>
              <span>{t('pricing_plan_card.feature.web_hosting')}</span>
              <Icon stroke='checkmark' size={1.25} color='success' />
            </div>
            <div className={classes.feature}>
              <span>{t('pricing_plan_card.feature.commercial_use')}</span>
              <Icon stroke='checkmark' size={1.25} color='success' />
            </div>
            <div className={classes.feature}>
              <span>{t('pricing_plan_card.feature.studio_cloud_editor')}</span>
              <Icon stroke='checkmark' size={1.25} color='success' />
            </div>
          </div>
        </div>
        <div className={classes.plusIconContainer}>
          <div className={classes.gradientBlock} />
          <div className={classes.plusIcon}>
            <Icon stroke='plus' color='gray4' size={1.25} />
          </div>
          <div className={combine(classes.gradientBlock, classes.rotate)} />
          <div className={combine(classes.bokehParticle, classes.bokehBlue)} />
        </div>
        <div className={classes.featureCardRow}>
          <div className={combine(classes.card, classes.featureCard)}>
            <div className={classes.featureHeading}>
              {t('credit_pricing_section.feature.white_label.heading')}
              <span className={classes.badge}>{t('pricing_plan_card.badge.add-on')}</span>
            </div>
            <div>{t('credit_pricing_section.feature.white_label.description')}</div>
            <div className={classes.whiteLabelPriceContainer}>
              <div className={classes.addOnPriceContainer}>
                <Trans
                  ns='pricing-page'
                  i18nKey='pricing_plan_card.white_label_card.pricing.monthly'
                  components={{
                    1: <span className={classes.addOnPrice} />,
                    2: <span className={classes.addOnIntervalSpace}>nbsp;</span>,
                    3: <span className={classes.addOnIntervalDash} />,
                  }}
                  values={{pricing: '$999'}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={combine(classes.bokehParticle, classes.bokehPurpleLeft)} />
      <div className={combine(classes.bokehParticle, classes.bokehPurpleRight)} />
    </div>
  )
}

export {FeaturePricingSection}
