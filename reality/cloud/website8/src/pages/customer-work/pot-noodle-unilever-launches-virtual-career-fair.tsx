import React from 'react'
import {graphql} from 'gatsby'

import videoPath from '../../../img/customer-work/video/pot-noodle-unilever-video.mp4'
import studioLogoPath from '../../../img/customer-work/logos/aircards-logo.png'
import * as CaseStudyInterface from '../../components/case-study-interfaces'
import {IStat} from '../../components/topline-stats'
import CaseStudy from '../../components/case-study'
import {carouselItems} from '../../components/case-study-carousel'

const PotNoodleUnilever: React.FunctionComponent = () => {
  const toplineStats: IStat[] = [
    {
      title: 'pot_noodle.stats.reach.title',
      valueStart: 0.5,
      valueEnd: 'pot_noodle.stats.reach.value',
      staticSuffix: 'pot_noodle.stats.reach.suffix',
      numDecimalPlaces: 1,
    },
    {
      title: 'pot_noodle.stats.dwell_time.title',
      valueStart: 0.5,
      valueEnd: 'pot_noodle.stats.dwell_time.value',
      staticSuffix: 'pot_noodle.stats.dwell_time.suffix',
      numDecimalPlaces: 1,
    },
    {
      title: 'pot_noodle.stats.increase_applicants.title',
      valueStart: 0,
      valueEnd: 'pot_noodle.stats.increase_applicants.value',
      staticSuffix: 'pot_noodle.stats.increase_applicants.suffix',
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
      titleTag: 'pot_noodle.meta.title',
      metaDescription: 'pot_noodle.meta.description',
      metaImage: 'https://cdn.8thwall.com/images/website8/casestudies/hero/pot_noodle_unilever_2kqto0o3r9rdb011j15u7nbbqnnw4t3bnbobghl7xtkq2bguvqahrpdi-1120x630',
    },

    hero: {
      img: 'https://cdn.8thwall.com/images/website8/casestudies/hero/pot_noodle_unilever_2kqto0o3r9rdb011j15u7nbbqnnw4t3bnbobghl7xtkq2bguvqahrpdi-1920x1080',
      h1: 'pot_noodle.hero.heading',
      awards: heroAwards,
    },

    projectOverview: {
      paragraph: 'pot_noodle.overview.paragraph',
      stats: toplineStats,
      blockQuote: 'pot_noodle.overview.quote',
      citation: 'pot_noodle.overview.quote_citation',
    },

    experience: {
      paragraph: 'pot_noodle.experience.paragraph',
      video: videoPath,
      videoSize: 4,
    },

    results: {
      paragraph: 'pot_noodle.results.paragraph',
      awards: resultsAwards,
      tags: ['pot_noodle.results.tags.education', 'pot_noodle.results.tags.world_effects', 'pot_noodle.results.tags.virtual_event', 'pot_noodle.results.tags.brand_awareness'],
    },

    about: {
      paragraph: 'pot_noodle.about.paragraph',
      studioName: 'pot_noodle.about.studio_name',
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
