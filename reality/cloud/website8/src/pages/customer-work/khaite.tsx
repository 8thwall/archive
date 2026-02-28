import React from 'react'
import {graphql} from 'gatsby'

import videoPath from '../../../img/customer-work/video/khaite-video.mp4'
import studioLogoPath from '../../../img/customer-work/logos/rose-digital-logo.svg'
import * as CaseStudyInterface from '../../components/case-study-interfaces'
import {IStat} from '../../components/topline-stats'
import CaseStudy from '../../components/case-study'
import {carouselItems} from '../../components/case-study-carousel'

const Khaite: React.FunctionComponent = () => {
  const toplineStats: IStat[] = [
    {
      title: 'khaite.stats.dwell_time.title',
      valueStart: 0,
      valueEnd: 'khaite.stats.dwell_time.value',
      staticSuffix: 'khaite.stats.dwell_time.suffix',
    },
    {
      title: 'khaite.stats.increase_sales.title',
      valueStart: 0,
      valueEnd: 'khaite.stats.increase_sales.value',
      staticSuffix: 'khaite.stats.increase_sales.suffix',
    },
    {
      title: 'khaite.stats.inline_ar.title',
      valueStart: 0,
      valueEnd: 'khaite.stats.inline_ar.value',
      isTextStatic: true,
    },
  ]

  const heroAwards: CaseStudyInterface.IAward[] = [
  ]

  const resultsAwards: CaseStudyInterface.IAward[] = [
  ]

  const studioLogo: CaseStudyInterface.IStudioLogo = {
    img: studioLogoPath,
    alt: 'Fourteen Four Logo',
    scale: '0.6',
  }

  const caseStudyData: CaseStudyInterface.ICaseStudyData = {
    metaData: {
      titleTag: 'khaite.meta.title',
      metaDescription: 'khaite.meta.description',
      metaImage: 'https://cdn.8thwall.com/images/website8/casestudies/hero/khaite_50xc5jmn7p96i1jr7o945h3a3z2e82jqqanbmp8to7revgt37fcl3o83-1120x630',
    },

    hero: {
      img: 'https://cdn.8thwall.com/images/website8/casestudies/hero/khaite_50xc5jmn7p96i1jr7o945h3a3z2e82jqqanbmp8to7revgt37fcl3o83-1920x1080',
      h1: 'khaite.hero.heading',
      awards: heroAwards,
    },

    projectOverview: {
      paragraph: 'khaite.overview.paragraph',
      stats: toplineStats,
      blockQuote: 'khaite.overview.quote',
      citation: 'khaite.overview.quote_citation',
    },

    experience: {
      paragraph: 'khaite.experience.paragraph',
      video: videoPath,
      videoOrientation: 'horizontal',
      videoSize: 4,
    },

    results: {
      paragraph: 'khaite.results.paragraph',
      awards: resultsAwards,
      tags: ['khaite.results.tags.fashion', 'khaite.results.tags.ecommerce', 'khaite.results.tags.image_targets', 'khaite.results.tags.worldwide', 'khaite.results.tags.increase_sale'],
    },

    about: {
      paragraph: 'khaite.about.paragraph',
      studioName: 'ROSE',
      studioLogo,
      profilePage: '/rosedigital',
    },

    carousel: carouselItems,
  }

  return <CaseStudy caseStudyData={caseStudyData} />
}

export default Khaite

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
