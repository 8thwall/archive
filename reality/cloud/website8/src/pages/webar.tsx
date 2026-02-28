import React from 'react'
import {useTranslation} from 'gatsby-plugin-react-i18next'
import {graphql} from 'gatsby'

import Layout from '../components/layouts/layout'
import WhyWebARSection from '../components/why-webar/why-webar-section'
import WebARStatsSection from '../components/why-webar/webar-stats-section'
import WebARFAQSection from '../components/why-webar/webar-faq-section'
import IndustrySection from '../components/why-webar/industry-section'
import CaseStudySection from '../components/case-study-section'
import ComparePlatformSection from '../components/compare-platform-section'
import EffectsCardSection from '../components/effect-cards-section'
import WebARHeroSection from '../components/why-webar/webar-hero'
import GetRetailBrandGuideSection from '../components/why-webar/get-retail-brand-guide-section'

const WebAR = () => {
  const {t} = useTranslation(['why-webar-page'])

  return (
    <Layout title={t('page.title')}>
      <WebARHeroSection />
      <WhyWebARSection />
      <EffectsCardSection />
      <WebARStatsSection />
      <IndustrySection />
      <ComparePlatformSection />
      <CaseStudySection
        from='webar'
        heading={t('case_study_section.heading')}
        description={t('case_study_section.description')}
      />
      <WebARFAQSection />
      <GetRetailBrandGuideSection />
    </Layout>
  )
}

export default WebAR

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
