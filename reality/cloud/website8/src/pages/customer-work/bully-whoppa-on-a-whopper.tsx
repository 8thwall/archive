import React from 'react'
import {graphql} from 'gatsby'

import videoPath from '../../../img/customer-work/video/bully-burger-king-video.mp4'
import studioLogoPath from '../../../img/customer-work/logos/bully.png'
import * as CaseStudyInterface from '../../components/case-study-interfaces'
import {IStat} from '../../components/topline-stats'
import CaseStudy from '../../components/case-study'
import {carouselItems} from '../../components/case-study-carousel'

const BullyWhoppa: React.FunctionComponent = () => {
  const toplineStats: IStat[] = [
    {
      title: 'bully_whoppa.stats.social_impressions.title',
      valueStart: 0.5,
      valueEnd: 'bully_whoppa.stats.social_impressions.value',
      staticSuffix: 'bully_whoppa.stats.social_impressions.suffix',
      numDecimalPlaces: 1,
    },
    {
      title: 'bully_whoppa.stats.press_coverage.title',
      valueStart: 0,
      valueEnd: 'bully_whoppa.stats.press_coverage.value',
    },
  ]

  const heroAwards: CaseStudyInterface.IAward[] = [
  ]

  const resultsAwards: CaseStudyInterface.IAward[] = [
  ]

  const studioLogo: CaseStudyInterface.IStudioLogo = {
    img: studioLogoPath,
    alt: 'Bully! Entertainment Logo',
    scale: '0.6',
  }

  const caseStudyData: CaseStudyInterface.ICaseStudyData = {
    metaData: {
      titleTag: 'bully_whoppa.meta.title',
      metaDescription: 'bully_whoppa.meta.description',
      metaImage: 'https://cdn.8thwall.com/images/website8/casestudies/hero/burgerking_2rtt44qucub3g1a70ataeadpqkinfwa1ky9q6o3haudswcwdd3bqn9ko-1120x630',
    },

    hero: {
      img: 'https://cdn.8thwall.com/images/website8/casestudies/hero/burgerking_2rtt44qucub3g1a70ataeadpqkinfwa1ky9q6o3haudswcwdd3bqn9ko-1920x1080',
      h1: 'bully_whoppa.hero.heading',
      awards: heroAwards,
    },

    projectOverview: {
      paragraph: 'bully_whoppa.overview.paragraph',
      stats: toplineStats,
      blockQuote: 'bully_whoppa.overview.quote',
      citation: 'bully_whoppa.overview.quote_citation',
    },

    experience: {
      paragraph: 'bully_whoppa.experience.paragraph',
      video: videoPath,
      videoOrientation: 'horizontal',
      videoSize: 6,
    },

    results: {
      paragraph: 'bully_whoppa.results.paragraph',
      awards: resultsAwards,
      tags: ['bully_whoppa.results.tags.food_beverage', 'bully_whoppa.results.tags.entertainment', 'bully_whoppa.results.tags.image_targets', 'bully_whoppa.results.tags.holograms'],
    },

    about: {
      paragraph: 'bully_whoppa.about.paragraph',
      studioName: 'bully_whoppa.about.studio_name',
      studioLogo,
      profilePage: '/bullyentertainment',
    },

    carousel: carouselItems,
  }

  return <CaseStudy caseStudyData={caseStudyData} />
}

export default BullyWhoppa

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
