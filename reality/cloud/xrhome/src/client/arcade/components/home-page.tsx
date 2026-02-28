import React from 'react'
import {createUseStyles} from 'react-jss'

import apps from '../example-apps'
import Page from '../widgets/page'
import {mobileViewOverride} from '../../static/arcade/arcade-settings'
import {ProjectsContainer} from './apps/projects-container'
import {UpsellBanner} from './upsell-banner'
import {HeroBanner} from './hero-banner'
import {ARCADE_CDN_URL} from '../common/arcade-app-constants'

const EXAMPLE_FEATURED_APP = {
  appName: 'studio-daf',
  appTitle: 'Doty Run',
  uuid: 'b76b8e53-4bc9-44e3-81f5-ed52773e5645',
  coverImageUrl: `${ARCADE_CDN_URL}/web/hero-images/studio-daf-m73xepwf`,
  previewVideoUrl: `${ARCADE_CDN_URL}/web/hero-videos/studio-daf-m73xhqfe`,
  Account: {
    shortName: 'xradventure',
    name: 'Camilo Medina',
    uuid: 'b5da84c4-38e3-476a-b514-0ddf48ed2bdc',
  },
}

const useStyles = createUseStyles({
  'page': {
    [mobileViewOverride]: {
      position: 'relative',
      height: '100vh',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
    },
  },
})

// NOTE(wayne): This is for tracking the 2024 Into The Scaniverse launch
const QUERY_PARAMS = {
  utm_source: 'nianticarcade',
  utm_medium: 'web',
  utm_campaign: 'doty-run-hero',
}

const HomePage = () => {
  const classes = useStyles()

  return (
    <Page
      className={classes.page}
      isHeaderFloating
    >
      <HeroBanner app={EXAMPLE_FEATURED_APP} queryParams={QUERY_PARAMS} />
      <ProjectsContainer
        apps={apps}
      />
      <UpsellBanner />
    </Page>
  )
}

export default HomePage
