import React from 'react'
import {createUseStyles} from 'react-jss'

import ProjectCardMobile from './project-card-mobile'
import ProjectCard from './project-card'
import {
  mobileViewOverride,
  tabletViewOverride,
  centeredSectionMaxWidth,
} from '../../../static/arcade/arcade-settings'
import ScreenType from '../../common/screen-types'
import useScreenType from '../../common/use-screen-type'

const useStyles = createUseStyles({
  cardContainer: {
    'display': 'grid',
    'gap': '2.5rem',
    'gridTemplateColumns': 'repeat(3, minmax(0px, 1fr))',
    'width': centeredSectionMaxWidth,
    'maxWidth': 'calc(100% - 5rem)',
    'margin': '2.5rem auto',

    '&::-webkit-scrollbar': {
      display: 'none',
    },
    [tabletViewOverride]: {
      'gap': '1rem',
    },
    [mobileViewOverride]: {display: 'contents'},
  },
})

interface IProjectsContainer {
  apps: any
}

const ProjectsContainer: React.FC<IProjectsContainer> = ({apps}) => {
  const classes = useStyles()
  const screenType = useScreenType()

  let projectCards
  if (screenType === ScreenType.Mobile) {
    projectCards = apps.map((a, i) => (
      <ProjectCardMobile
        key={a.uuid}
        app={a}
        lazyLoading={i !== 0}
      />
    ))
  } else {
    projectCards = apps.map(a => (
      <ProjectCard key={a.uuid} app={a} />
    ))
  }

  return (
    <div className={classes.cardContainer}>
      {projectCards}
    </div>
  )
}

export {ProjectsContainer}
