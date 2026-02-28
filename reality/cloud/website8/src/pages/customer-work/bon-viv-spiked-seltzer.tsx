import React from 'react'
import {graphql} from 'gatsby'

import videoPath from '../../../img/customer-work/video/bon-viv-video.mp4'
import studioLogoPath from '../../../img/customer-work/logos/aircards-logo.png'
import * as CaseStudyInterface from '../../components/case-study-interfaces'
import {IStat} from '../../components/topline-stats'
import CaseStudy from '../../components/case-study'
import {carouselItems} from '../../components/case-study-carousel'

const PotNoodleUnilever: React.FunctionComponent = () => {
  const toplineStats: IStat[] = [
    {
      title: 'bonviv.stats.click_through_rate.title',
      valueStart: 0,
      valueEnd: 'bonviv.stats.click_through_rate.value',
      staticSuffix: 'bonviv.stats.click_through_rate.suffix',
    },
    {
      title: 'bonviv.stats.dwell_time.title',
      valueStart: 0,
      valueEnd: 'bonviv.stats.dwell_time.value',
      staticSuffix: 'bonviv.stats.dwell_time.suffix',
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
      titleTag: 'bonviv.meta.title',
      metaDescription: 'bonviv.meta.description',
      metaImage: 'https://cdn.8thwall.com/images/website8/casestudies/hero/bonviv_2f47y78u0ufhzwc8zxww35idy7hkm4ac0ptunfxrybd7kwj3cchx3xh0-1120x630',
    },

    hero: {
      img: 'https://cdn.8thwall.com/images/website8/casestudies/hero/bonviv_2f47y78u0ufhzwc8zxww35idy7hkm4ac0ptunfxrybd7kwj3cchx3xh0-1920x1080',
      h1: 'bonviv.hero.heading',
      awards: heroAwards,
    },

    projectOverview: {
      paragraph: 'bonviv.overview.paragraph',
      stats: toplineStats,
      blockQuote: 'bonviv.overview.quote',
      citation: 'bonviv.overview.quote_citation',
    },

    experience: {
      paragraph: 'bonviv.experience.paragraph',
      video: videoPath,
      videoSize: 4,
      videoOrientation: 'horizontal',
    },

    results: {
      paragraph: 'bonviv.results.paragraph',
      awards: resultsAwards,
      tags: [
        'bonviv.results.tags.beer_wine_spirits',
        'bonviv.results.tags.food_beverage',
        'bonviv.results.tags.image_targets',
        'bonviv.results.tags.drive_sales',
      ],
    },

    about: {
      paragraph: 'bonviv.about.paragraph',
      studioName: 'bonviv.about.studio_name',
      studioLogo,
      profilePage: '/aircards',
    },

    carousel: carouselItems,
  }

  return <CaseStudy caseStudyData={caseStudyData} />
}

export default PotNoodleUnilever

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
