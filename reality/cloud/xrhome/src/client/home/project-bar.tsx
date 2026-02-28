import React from 'react'
import {Link} from 'react-router-dom'

import {deriveAppCoverImageUrl} from '../../shared/app-utils'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../shared/app-constants'
import icons from '../apps/icons'
import {gray1, mobileViewOverride} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  projectBarContainer: {
    'display': 'flex',
    'height': '100%',
    'alignItems': 'center',
    'paddingRight': '8px',
    '&:hover': {
      backgroundColor: theme.listItemHoverBg,
      borderRadius: '8px',
    },
  },
  mainBar: {
    display: 'flex',
    height: '100%',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '20px',
    color: theme.fgMain,
    alignItems: 'center',
  },
  coverImage: {
    width: '160px',
    aspectRatio: '16/9',
    marginRight: '1rem',
    borderRadius: '8px',
    [mobileViewOverride]: {
      width: '100px',
    },
  },
  appTitle: {
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    lineHeight: '20px',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    overflow: 'hidden',
  },
  appIcons: {
    display: 'flex',
    marginLeft: 'auto',
    columnGap: '0.7em',
  },
  appClone: {
    backgroundColor: gray1,
    height: '1.125rem',
    borderRadius: '0.125rem',
  },
  appTryout: {
    height: '1.125rem',
  },
}))

const ProjectBar = ({app}) => {
  const classes = useStyles()
  const projectURL = `/${app.Account.shortName}/${app.appName}`

  return (
    <Link
      to={projectURL}
      target='_blank'
      className={classes.projectBarContainer}
      a8={`click;warm-start;click-sample-projects-${projectURL}`}
    >
      <div className={classes.mainBar}>
        <img
          className={classes.coverImage}
          src={deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[400])}
          alt={app.appTitle || app.appName}
        />
        <div className={classes.appTitle}>
          {app.appTitle}
        </div>
      </div>
      <div className={classes.appIcons}>
        <img
          className={classes.appClone}
          src={icons.projectClone}
          alt='Clone'
          title='Code Available'
        />
        <img
          className={classes.appTryout}
          src={icons.projectTryOut}
          alt='Try it out'
          title='Try it out Available'
        />
      </div>
    </Link>
  )
}

export {
  ProjectBar,
}
