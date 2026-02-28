import React from 'react'
import {graphql} from 'gatsby'

import auggieImgWhite from '../../../img/customer-work/logos/awards-auggie-white.svg'
import auggieImgBlack from '../../../img/customer-work/logos/awards-auggie-black.svg'
import videoPath from '../../../img/customer-work/video/jumanji-vid.mp4'
import studioLogoPath from '../../../img/customer-work/logos/trigger-logo.png'
import * as CaseStudyInterface from '../../components/case-study-interfaces'
import {IStat} from '../../components/topline-stats'
import CaseStudy from '../../components/case-study'
import {carouselItems} from '../../components/case-study-carousel'

const Jumanji: React.FunctionComponent = () => {
  const toplineStats: IStat[] = [
    {
      title: 'jumanji.stats.dwell_time.title',
      valueStart: 0,
      staticPrefix: '>',
      valueEnd: 'jumanji.stats.dwell_time.value',
      staticSuffix: 'jumanji.stats.dwell_time.suffix',
    },
    {
      title: 'jumanji.stats.time_spent.title',
      valueStart: 0.5,
      valueEnd: 'jumanji.stats.time_spent.value',
      staticSuffix: 'jumanji.stats.time_spent.suffix',
      numDecimalPlaces: 1,
    },
    {
      title: 'jumanji.stats.amazon_lex.title',
      valueStart: 0,
      valueEnd: "jumanji.stats.amazon_lex.value",
      isTextStatic: true,
      // staticSuffix: 'st',
    },
  ]

  const heroAwards: CaseStudyInterface.IAward[] = [
    {
      src: auggieImgWhite,
      alt: 'Auggie Award',
    },
  ]

  const resultsAwards: CaseStudyInterface.IAward[] = [
    {
      src: auggieImgBlack,
      alt: 'Auggie Award',
    },
  ]

  const studioLogo: CaseStudyInterface.IStudioLogo = {
    img: studioLogoPath,
    alt: 'Trigger Logo',
    scale: '0.6',
  }

  const caseStudyData: CaseStudyInterface.ICaseStudyData = {
    metaData: {
      titleTag: 'jumanji.meta.title',
      metaDescription: 'jumanji.meta.description',
      metaImage: 'https://cdn.8thwall.com/images/website8/casestudies/hero/jumanji_4sedi8ca1ktccx2e4s6xbdxex5fcarnkm3xxud80sa0x1b4gbaycok6u-1120x630',
    },

    hero: {
      img: 'https://cdn.8thwall.com/images/website8/casestudies/hero/jumanji_4sedi8ca1ktccx2e4s6xbdxex5fcarnkm3xxud80sa0x1b4gbaycok6u-1920x1080',
      h1: 'jumanji.hero.heading',
      awards: heroAwards,
    },

    projectOverview: {
      paragraph: 'jumanji.overview.paragraph',
      stats: toplineStats,
      blockQuote: 'jumanji.overview.quote',
      citation: 'jumanji.overview.quote_citation',
    },

    experience: {
      paragraph: 'jumanji.experience.paragraph',
      video: videoPath,
      videoSize: 4,
    },

    results: {
      paragraph: 'jumanji.results.paragraph',
      awards: resultsAwards,
      tags: ['jumanji.results.tags.entertainment', 'jumanji.results.tags.world_tracking', 'jumanji.results.tags.north_america', 'jumanji.results.tags.drive_sales'],
    },

    about: {
      paragraph: 'jumanji.about.paragraph',
      studioName: 'jumanji.about.studio_name',
      studioLogo,
      profilePage: '/trigger',
    },

    carousel: carouselItems,
  }

  return <CaseStudy caseStudyData={caseStudyData} />
}

export default Jumanji

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
