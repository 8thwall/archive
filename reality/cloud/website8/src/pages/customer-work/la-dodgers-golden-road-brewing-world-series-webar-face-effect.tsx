import React from 'react'
import {graphql} from 'gatsby'

import videoPath from '../../../img/customer-work/video/la-dodgers-golden-road-brewing-vid.mp4'
import studioLogoPath from '../../../img/customer-work/logos/aircards-logo.png'
import * as CaseStudyInterface from '../../components/case-study-interfaces'
import {IStat} from '../../components/topline-stats'
import CaseStudy from '../../components/case-study'
import {carouselItems} from '../../components/case-study-carousel'

const GoldenRoadBrewing: React.FunctionComponent = () => {
  const toplineStats: IStat[] = [
    {
      title: 'la_dodgers.stats.dwell_time.title',
      valueStart: 0.5,
      valueEnd: 'la_dodgers.stats.dwell_time.value',
      staticSuffix: 'la_dodgers.stats.dwell_time.suffix',
      numDecimalPlaces: 1,
    },
    {
      title: 'la_dodgers.stats.click_through_rate.title',
      valueStart: 0.5,
      valueEnd: 'la_dodgers.stats.click_through_rate.value',
      staticSuffix: 'la_dodgers.stats.click_through_rate.suffix',
      numDecimalPlaces: 1,
    },
  ]

  const heroAwards: CaseStudyInterface.IAward[] = [
  ]

  const resultsAwards: CaseStudyInterface.IAward[] = [
  ]

  const studioLogo: CaseStudyInterface.IStudioLogo = {
    img: studioLogoPath,
    alt: 'Aircards Logo',
    scale: '0.6',
  }

  const caseStudyData: CaseStudyInterface.ICaseStudyData = {
    metaData: {
      titleTag: 'la_dodgers.meta.title',
      metaDescription: 'la_dodgers.meta.description',
      metaImage: 'https://cdn.8thwall.com/images/website8/casestudies/hero/ladodgersgoldenroadbrewing_2rit4b4hgf4guchnwa0m2v5zl5ecjhu5gxrwcxf508ckpmf76wkp4fn8-1120x630',
    },

    hero: {
      img: 'https://cdn.8thwall.com/images/website8/casestudies/hero/ladodgersgoldenroadbrewing_2rit4b4hgf4guchnwa0m2v5zl5ecjhu5gxrwcxf508ckpmf76wkp4fn8-1920x1080',
      h1: 'la_dodgers.hero.heading',
      awards: heroAwards,
    },

    projectOverview: {
      paragraph: 'la_dodgers.overview.paragraph',
      stats: toplineStats,
      blockQuote: 'la_dodgers.overview.quote',
      citation: 'la_dodgers.overview.quote_citation',
    },

    experience: {
      paragraph: 'la_dodgers.experience.paragraph',
      video: videoPath,
      videoSize: 6,
    },

    results: {
      paragraph: 'la_dodgers.results.paragraph',
      awards: resultsAwards,
      tags: ['la_dodgers.results.tags.sports', 'la_dodgers.results.tags.face_effects', 'la_dodgers.results.tags.los_angeles', 'la_dodgers.results.tags.drive_sales'],
    },

    about: {
      paragraph: 'la_dodgers.about.paragraph',
      studioName: 'la_dodgers.about.studio_name',
      studioLogo,
      profilePage: '/aircards',
    },

    carousel: carouselItems,
  }

  return <CaseStudy caseStudyData={caseStudyData} />
}

export default GoldenRoadBrewing

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
