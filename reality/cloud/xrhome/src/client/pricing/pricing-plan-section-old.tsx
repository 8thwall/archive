import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {headerSanSerif, mobileViewOverride, tinyViewOverride} from '../static/styles/settings'
import {FeaturePricingSection} from './feature-pricing-section-old'
import {CreditPricingSection} from './credit-pricing-section-old'
import {SocialProofSection} from '../home/social-proof-section'

const useStyles = createUseStyles({
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4em 2em 0',
    gap: '2em',
    [mobileViewOverride]: {
      gap: 0,
      padding: '4em 1em 0',
    },
  },
  headingContainer: {
    marginBottom: '1em',
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
  description: {
    fontSize: '1.25em',
  },
})

const PricingPlanSection: React.FunctionComponent = () => {
  const classes = useStyles()
  const {t} = useTranslation(['pricing-page', 'common'])

  return (
    <section className={classes.section}>
      <div className={classes.headingContainer}>
        <div className={classes.heading} id='pricing-container'>
          {t('pricing_page.heading.build_and_deploy_free')}
        </div>
        <div className={classes.description}>
          {t('pricing_page.subheading.idea_to_playable')}
        </div>
      </div>
      <FeaturePricingSection />
      <CreditPricingSection />
      <SocialProofSection />
    </section>
  )
}

export {PricingPlanSection}
