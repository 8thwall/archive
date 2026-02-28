import React from 'react'
import {graphql} from 'gatsby'

import auggieImgWhite from '../../../img/customer-work/logos/awards-auggie-white.svg'
import auggieImgBlack from '../../../img/customer-work/logos/awards-auggie-black.svg'
import tellyImg from '../../../img/customer-work/logos/awards-telly.png'
import videoPath from '../../../img/customer-work/video/pink-floyd-vid.mp4'
import studioLogoPath from '../../../img/customer-work/logos/draw-and-code.svg'
import * as CaseStudyInterface from '../../components/case-study-interfaces'
import {IStat} from '../../components/topline-stats'
import CaseStudy from '../../components/case-study'
import {carouselItems} from '../../components/case-study-carousel'

const PinkFloyd: React.FunctionComponent = () => {
  const toplineStats: IStat[] = [
    {
      title: 'pink_floyd.stats.dwell_time.title',
      valueStart: 0,
      valueEnd: 'pink_floyd.stats.dwell_time.value',
      staticSuffix: 'pink_floyd.stats.dwell_time.suffix',
    },
    {
      title: 'pink_floyd.stats.countries_reached.title',
      valueStart: 115,
      valueEnd: 'pink_floyd.stats.countries_reached.value',
    },
  ]

  const heroAwards: CaseStudyInterface.IAward[] = [
    {
      src: auggieImgWhite,
      alt: 'Auggie Award',
    },
    {
      src: tellyImg,
      alt: 'Telly Award',
    },
  ]

  const resultsAwards: CaseStudyInterface.IAward[] = [
    {
      src: tellyImg,
      alt: 'Telly Award',
    },
    {
      src: auggieImgBlack,
      alt: 'Auggie Award',
    },
  ]

  const studioLogo: CaseStudyInterface.IStudioLogo = {
    img: studioLogoPath,
    alt: 'Draw & Code Logo',
    scale: '0.9',
  }

  const caseStudyData: CaseStudyInterface.ICaseStudyData = {
    metaData: {
      titleTag: 'pink_floyd.meta.title',
      metaDescription: 'pink_floyd.meta.description',
      metaImage: 'https://cdn.8thwall.com/images/website8/casestudies/hero/pinkfloyd_2tajheitys8rtnnayzojregcgv1i0gsc02spiu7spakryxzmjn06let0-1120x630',
    },

    hero: {
      img: 'https://cdn.8thwall.com/images/website8/casestudies/hero/pinkfloyd_2tajheitys8rtnnayzojregcgv1i0gsc02spiu7spakryxzmjn06let0-1920x1080',
      h1: 'pink_floyd.hero.heading',
      awards: heroAwards,
    },

    projectOverview: {
      paragraph: 'pink_floyd.overview.paragraph',
      stats: toplineStats,
      blockQuote: 'pink_floyd.overview.quote',
      citation: 'pink_floyd.overview.quote_citation',
    },

    experience: {
      paragraph: 'pink_floyd.experience.paragraph',
      video: videoPath,
    },

    results: {
      paragraph: 'pink_floyd.results.paragraph',
      awards: resultsAwards,
      tags: ['pink_floyd.results.tags.entertainment', 'pink_floyd.results.tags.world_tracking', 'pink_floyd.results.tags.worldwide', 'pink_floyd.results.tags.brand_awareness'],
    },

    about: {
      paragraph: 'pink_floyd.about.paragraph',
      studioName: 'pink_floyd.about.studio_name',
      studioLogo,
      profilePage: '/drawandcode',
    },

    carousel: carouselItems,
  }

  return <CaseStudy caseStudyData={caseStudyData} />
}

export default PinkFloyd

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
