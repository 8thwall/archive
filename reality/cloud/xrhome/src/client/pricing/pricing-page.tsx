import * as React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useLocation} from 'react-router-dom'

import Page from '../widgets/page'
import {Footer} from '../widgets/web8-footer'
import {SpaceBetween} from '../ui/layout/space-between'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import {PricingPageSection} from './pricing-page-section'
import {PricingPlanSection} from './pricing-plan-section'
import {mobileViewOverride} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'
import {StandardLink} from '../ui/components/standard-link'
import {getPathForSignUpPage} from '../common/paths'
import {PricingLinkButton} from './pricing-link-button'

import pricingAgentScreenshot from '../static/pricing-agent-screenshot.png'
import pricingAgentBackground from '../static/pricing-agent-background.png'

const useStyles = createThemedStyles(() => ({
  pricingPage: {
    'fontSize': '16px',
    'overflowY': 'scroll',
    'scrollBehavior': 'smooth',
    'userSelect': 'text',
    '& > .page-content': {
      display: 'flex',
      flexDirection: 'column',
      gap: '2em',
      padding: '0 2em !important',
      [mobileViewOverride]: {
        gap: '1em',
        padding: '0 1em !important',
      },
    },
  },
  description: {
    fontSize: '1.25em',
  },
  agentSectionScreeshotContainer: {
    position: 'absolute',
    left: '10%',
    bottom: '10%',
    [mobileViewOverride]: {
      position: 'relative',
      left: 'unset',
      bottom: 'unset',
    },
  },
  agentSectionScreeshot: {
    boxShadow: '0 4px 4px rgba(0, 0, 0, 0.5)',
    borderRadius: '15px',
  },
}))

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
      <AutoHeadingScope>
        <SpaceBetween direction='vertical' extraWide>
          <PricingPageSection
            title={t('pricing_page.layout.heading.text')}
            description={t('pricing_page.layout.subheading.text')}
            color='transparent'
          />
          <PricingPlanSection />
          <PricingPageSection
            id='create-app-section'
            color='transparent'
            wide
          >
            <PricingLinkButton
              url={getPathForSignUpPage()}
              height='medium'
              spacing='wide'
            >
              {t('credit_pricing_card.button.create_for_free')}
            </PricingLinkButton>
            <div>
              <Trans
                ns='pricing-page'
                i18nKey='pricing_page.social.cta.enterprise.text'
                components={{
                  // TODO (Tri): fix link to enterprise page
                  // eslint-disable-next-line max-len
                  1: <StandardLink color='main' underline to='/' />,
                }}
              />
            </div>
          </PricingPageSection>

          <PricingPageSection
            id='pricing-page-agent-section'
            title={t('pricing_page.features.agent.title')}
            description={t('pricing_page.features.agent.description')}
            color='gray'
            backgroundImage={pricingAgentBackground}
          >
            <div className={classes.agentSectionScreeshotContainer}>
              <img
                className={classes.agentSectionScreeshot}
                src={pricingAgentScreenshot}
                alt={t('pricing_page.features.agent.image.alt')}
              />
            </div>
          </PricingPageSection>
          {/* TODO (Tri) remove this sections with eslint disabled */}
          {/* eslint-disable local-rules/hardcoded-copy */ }
          <PricingPageSection
            id='purple'
            title='Lorem Ipsum'
            description='Lorem ipsum dolor sit amet'
            color='purple'
          >
            <div>Content goes here</div>
          </PricingPageSection>
          <PricingPageSection
            id='blue'
            title='Lorem Ipsum'
            description='Lorem ipsum dolor sit amet'
            color='blue'
          >
            <div>Content goes here</div>
          </PricingPageSection>
          {/* eslint-enable local-rules/hardcoded-copy */ }
        </SpaceBetween>
      </AutoHeadingScope>
    </Page>

  )
}

export default PricingPage
