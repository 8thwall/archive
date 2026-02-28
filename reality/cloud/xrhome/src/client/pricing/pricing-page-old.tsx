import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'react-router-dom'

import Page from '../widgets/page'
import {Footer} from '../widgets/web8-footer'
import {PricingPlanSection} from './pricing-plan-section-old'
import {PricingFaqSection} from './pricing-faq-section-old'

const useStyles = createUseStyles({
  pricingPage: {
    'overflowY': 'scroll',
    'scrollBehavior': 'smooth',
    '& > .page-content': {
      padding: '0 !important',
    },
    'userSelect': 'text',
  },
})

const PricingPage: React.FunctionComponent = () => {
  const classes = useStyles()
  const {t} = useTranslation(['pricing-page', 'common'])
  const location = useLocation()

  React.useEffect(() => {
    const element = document.getElementById(location.hash.slice(1))
    if (element) {
      element.scrollIntoView()
    }
  }, [location.hash])

  return (
    <Page
      className={classes.pricingPage}
      centered={false}
      title={t('pricing_page.layout.title')}
      commonPrefixed
      customFooter={<Footer />}
    >
      <PricingPlanSection />
      <PricingFaqSection />
    </Page>

  )
}

export default PricingPage
