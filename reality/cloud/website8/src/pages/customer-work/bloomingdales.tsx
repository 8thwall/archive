import React from 'react'
import {graphql} from 'gatsby'

import videoPath from '../../../img/customer-work/video/bloomingdales-video.mp4'
import studioLogoPath from '../../../img/customer-work/logos/rose-digital-logo.svg'
import webbyAwardBlack from '../../../img/customer-work/logos/awards-webby23-nominee-black.png'
import webbyAwardWhite from '../../../img/customer-work/logos/awards-webby23-nominee-white.png'
import shortyAwardWhite from '../../../img/customer-work/logos/awards-shorty-logo-white.png'
import shortyAwardBlack from '../../../img/customer-work/logos/awards-shorty-logo-black.png'
import * as CaseStudyInterface from '../../components/case-study-interfaces'
import {IStat} from '../../components/topline-stats'
import CaseStudy from '../../components/case-study'
import {carouselItems} from '../../components/case-study-carousel'

const PotNoodleUnilever: React.FunctionComponent = () => {
  const toplineStats: IStat[] = [
    {
      title: 'bloomingdales.stats.conversion.title',
      valueStart: 0,
      valueEnd: 'bloomingdales.stats.conversion.value',
      staticSuffix: 'bloomingdales.stats.conversion.suffix',
    },
    {
      title: 'bloomingdales.stats.engagement.title',
      valueStart: 0,
      valueEnd: 'bloomingdales.stats.engagement.value',
      staticSuffix: 'bloomingdales.stats.engagement.suffix',
    },
    {
      title: 'bloomingdales.stats.activated_catalogs.title',
      valueStart: 0,
      valueEnd: 'bloomingdales.stats.activated_catalogs.value',
      staticSuffix: 'bloomingdales.stats.activated_catalogs.suffix',
    },
  ]

  const heroAwards: CaseStudyInterface.IAward[] = [
    {
      src: webbyAwardWhite,
      alt: 'Webby Award Nominee',
    },
    {
      src: shortyAwardWhite,
      alt: 'Shorty Award',
    },
  ]

  const resultsAwards: CaseStudyInterface.IAward[] = [
    {
      src: webbyAwardBlack,
      alt: 'Webby Award Nominee',
    },
    {
      src: shortyAwardBlack,
      alt: 'Shorty Award',
    },
  ]

  const studioLogo: CaseStudyInterface.IStudioLogo = {
    img: studioLogoPath,
    alt: 'Fourteen Four Logo',
    scale: '0.6',
  }

  const caseStudyData: CaseStudyInterface.ICaseStudyData = {
    metaData: {
      titleTag: 'bloomingdales.meta.title',
      metaDescription: 'bloomingdales.meta.description',
      metaImage: 'https://cdn.8thwall.com/images/website8/casestudies/hero/bloomingdales_4sf2lvu18enbozzyzyvj48h5iuey41kgzup1hfj56bahs5q96y4tcbj5-1120x630',
    },

    hero: {
      img: 'https://cdn.8thwall.com/images/website8/casestudies/hero/bloomingdales_4sf2lvu18enbozzyzyvj48h5iuey41kgzup1hfj56bahs5q96y4tcbj5-1920x1080',
      h1: 'bloomingdales.hero.heading',
      awards: heroAwards,
    },

    projectOverview: {
      paragraph: 'bloomingdales.overview.paragraph',
      stats: toplineStats,
      blockQuote: 'bloomingdales.overview.quote',
      citation: 'bloomingdales.overview.quote_citation',
    },

    experience: {
      paragraph: 'bloomingdales.experience.paragraph',
      video: videoPath,
      videoSize: 4,
      videoOrientation: 'horizontal',
    },

    results: {
      paragraph: 'bloomingdales.results.paragraph',
      awards: resultsAwards,
      tags: [
        'bloomingdales.results.tags.retail',
        'bloomingdales.results.tags.image_targets',
        'bloomingdales.results.tags.holograms',
        'bloomingdales.results.tags.drive_sales',
      ],
    },

    about: {
      paragraph: 'bloomingdales.about.paragraph',
      studioName: 'bloomingdales.about.studio_name',
      studioLogo,
      profilePage: '/rosedigital',
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
