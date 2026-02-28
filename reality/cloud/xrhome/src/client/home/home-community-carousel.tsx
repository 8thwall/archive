import React from 'react'

import type {IBrowseApp} from '../common/types/models'
import {Loader} from '../ui/components/loader'
import {brandWhite, smallMonitorWidthBreakpoint, tinyViewOverride} from '../static/styles/settings'
import {createCustomUseStyles} from '../common/create-custom-use-styles'
import ProjectCard from '../browse/project-card'

const ANIMATION_SPEED = 240
const TRACK_GAP = '1.5em'
const SLIDE_SIZE = '23em'
const SLIDE_SIZE_MIN = '17em'
const CATEGORY_PROJECT_AMOUNT = 10

const useStyles = createCustomUseStyles<{appCount: number}>()({
  '@keyframes scroll': {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: `translateX(calc(-1 * (${SLIDE_SIZE} + ${TRACK_GAP}) * ` +
      `${CATEGORY_PROJECT_AMOUNT}))`,
    },
    [tinyViewOverride]: {
      '100%': {
        transform: `translateX(calc(-1 * ${SLIDE_SIZE} * ${CATEGORY_PROJECT_AMOUNT}))`,
      },
    },
  },
  'carousel': {
    position: 'relative',
    color: brandWhite,
    overflow: 'hidden',
    width: smallMonitorWidthBreakpoint,
    mask: 'linear-gradient(to right, transparent , #fff 20%, #fff 80%, transparent 100%)',
    [tinyViewOverride]: {
      mask: 'linear-gradient(to right, transparent , #fff 10%, #fff 90%, transparent 100%)',
    },
  },
  'carouselTrack': {
    'gap': TRACK_GAP,
    'animation': `$scroll ${ANIMATION_SPEED}s linear infinite`,
    'display': 'flex',
    'textAlign': 'left',
    'width': ({appCount}) => `calc((${SLIDE_SIZE} + ${TRACK_GAP}) * ${appCount * 2})`,
    [tinyViewOverride]: {
      gap: 0,
      width: ({appCount}) => `calc((${SLIDE_SIZE_MIN}) * ${appCount * 2})`,
    },
  },
  'slideContainer': {
    width: SLIDE_SIZE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5em',
    [tinyViewOverride]: {
      width: SLIDE_SIZE_MIN,
    },
  },
  'slideType': {
    display: 'flex',
    gap: '0.25em',
    alignItems: 'center',
  },
  'slideImageContainer': {
    display: 'flex',
    flexDirection: 'column',
  },
  'slideImage': {
    height: '12em',
    zIndex: '3',
  },
  'slideShadow': {
    borderRadius: '50%',
    width: '90%',
    height: '30px',
    background: 'black',
    opacity: 0.5,
    filter: 'blur(5px)',
    margin: '-2em 0 0 1em',
  },
  'carouselContainer': {
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    padding: '1em 0',
  },
  'coverImage': {
    display: 'block',
    width: '100%',
    borderRadius: '1em',
  },
})

interface IHomeCommunityCarousel {
  pending: boolean
  apps: IBrowseApp[] | undefined
  appCount: number
}

const HomeCommunityCarousel: React.FC<IHomeCommunityCarousel> = ({pending, apps, appCount}) => {
  const classes = useStyles({appCount})

  const appRow = apps?.map(app => (
    <ProjectCard
      key={app.uuid}
      app={app}
      showAgency
      showAccountName={false}
      pageName='home'
    />
  ))

  return (
    <div className={classes.carouselContainer}>
      <div className={classes.carousel}>
        {pending
          ? <Loader />
          : (
            <div className={classes.carouselTrack}>
              {appRow}
              {appRow}
            </div>
          )
      }
      </div>
    </div>
  )
}

export {HomeCommunityCarousel}
