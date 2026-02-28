import React from 'react'
import {graphql} from 'gatsby'

import videoPath from '../../../img/customer-work/video/saatchi-video.gif'
import studioLogoPath from '../../../img/customer-work/logos/rpr.webp'
import * as CaseStudyInterface from '../../components/case-study-interfaces'
import {IStat} from '../../components/topline-stats'
import CaseStudy from '../../components/case-study'
import {carouselItems} from '../../components/case-study-carousel'

const Saatchi: React.FunctionComponent = () => {
  const toplineStats: IStat[] = [
    {
      title: 'saatchi.stats.increase_spend.title',
      valueStart: 0,
      valueEnd: 'saatchi.stats.increase_spend.value',
      staticSuffix: 'saatchi.stats.increase_spend.suffix',
      numDecimalPlaces: 1,
    },
    {
      title: 'saatchi.stats.likely_to_purchase.title',
      valueStart: 0,
      valueEnd: 'saatchi.stats.likely_to_purchase.value',
      staticSuffix: 'saatchi.stats.likely_to_purchase.suffix',
      numDecimalPlaces: 1,
    },
    {
      title: 'saatchi.stats.viewable_webar.title',
      valueStart: 0,
      valueEnd: 'saatchi.stats.viewable_webar.value',
      staticSuffix: 'saatchi.stats.viewable_webar.suffix',
    },
  ]

  const heroAwards: CaseStudyInterface.IAward[] = [
  ]

  const resultsAwards: CaseStudyInterface.IAward[] = [
  ]

  const studioLogo: CaseStudyInterface.IStudioLogo = {
    img: studioLogoPath,
    alt: 'Rock Paper Reality Logo',
    scale: '0.6',
  }

  const caseStudyData: CaseStudyInterface.ICaseStudyData = {
    metaData: {
      titleTag: 'saatchi.meta.title',
      metaDescription: 'saatchi.meta.description',
      metaImage: 'https://cdn.8thwall.com/images/website8/casestudies/hero/saatchi_2dnxxjibrirkplg0nzalkqsrrqj679d6zqeccnhp5bkg9fnxa3srks4k-1120x630',
    },

    hero: {
      img: 'https://cdn.8thwall.com/images/website8/casestudies/hero/saatchi_2dnxxjibrirkplg0nzalkqsrrqj679d6zqeccnhp5bkg9fnxa3srks4k-1920x1080',
      h1: 'saatchi.hero.heading',
      awards: heroAwards,
    },

    projectOverview: {
      paragraph: 'saatchi.overview.paragraph',
      stats: toplineStats,
      blockQuote: 'saatchi.overview.quote',
      citation: 'saatchi.overview.quote_citation',
    },

    experience: {
      paragraph: 'saatchi.experience.paragraph',
      video: videoPath,
      videoOrientation: 'horizontal',
      videoSize: 4,
      isGif: true,
    },

    results: {
      paragraph: 'saatchi.results.paragraph',
      awards: resultsAwards,
      tags: ['saatchi.results.tags.art', 'saatchi.results.tags.ecommerce', 'saatchi.results.tags.worldwide', 'saatchi.results.tags.increase_sale', 'saatchi.results.tags.virtual_tryon'],
    },

    about: {
      paragraph: 'saatchi.about.paragraph',
      studioName: 'saatchi.about.studio_name',
      studioLogo,
      profilePage: '/rockpaperreality',
    },

    carousel: carouselItems,
  }

  return <CaseStudy caseStudyData={caseStudyData} />
}

export default Saatchi

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
