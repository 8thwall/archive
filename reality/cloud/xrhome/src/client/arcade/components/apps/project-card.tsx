import React from 'react'
import {createUseStyles} from 'react-jss'

import {
  white,
  brandGray3,
} from '../../../static/arcade/arcade-settings'
import {
  getAppDisplayName,
  getAppCoverImageUrl,
  getAppPreviewVideoUrl,
  getAppUrl,
} from '../../common/arcade-app-utils'
import AsyncImage from '../../common/async-image'
import {combine} from '../../../common/styles'
import LinkOut from '../../../uiWidgets/link-out'

const useStyles = createUseStyles({
  projectCard: {
    'position': 'relative',
    'borderRadius': '0.75rem 0.75rem 0 0',
    'paddingTop': '56.25%',
    'transition': 'all 0.3s ease-out',
    'overflow': 'hidden',

    '&:hover': {
      'transform': 'scale(1.05)',
    },
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: '0.75rem',
    objectFit: 'cover',
    overflow: 'hidden',
  },
  appMetadata: {
    pointerEvents: 'none',
    paddingTop: '0.75rem',
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
  },
  appTitle: {
    color: white,
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: '1.25rem',
  },
  appAccountName: {
    color: brandGray3,
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 'normal',
  },
  hidden: {
    opacity: 0,
    transition: 'all 0.3s ease-in',
  },
})

interface IProjectCard {
  // TODO(Brandon): Update typing for what is contained in app.
  app: any
  lazyLoading?: boolean
}

const ProjectCard: React.FC<IProjectCard> = ({
  app, lazyLoading = false,
}) => {
  const classes = useStyles()
  const [onHover, setOnHover] = React.useState(false)
  const [isVideoLoaded, setVideoLoaded] = React.useState(false)
  const hideImage = onHover && isVideoLoaded
  const renderVideo = onHover
  const hideVideo = !onHover || !isVideoLoaded

  return (
    <div
      className={classes.projectCard}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <LinkOut
        url={getAppUrl(app.Account, app)}
        aria-label={getAppDisplayName(app)}
        a8={`click;hp-appcard;${app.Account.shortName}-${app.appName}`}
      >
        <AsyncImage
          className={combine(classes.coverImage, hideImage ? classes.hidden : '')}
          draggable={false}
          src={getAppCoverImageUrl(app)}
          alt={getAppDisplayName(app)}
          {...(lazyLoading ? {loading: 'lazy'} : {})}
        />
        {renderVideo &&  // Only render video when hovering for performance reasons
          <video
            className={combine(classes.coverImage, hideVideo ? classes.hidden : '')}
            autoPlay
            loop
            muted
            playsInline
            draggable={false}
            src={getAppPreviewVideoUrl(app)}
            onLoadedData={() => setVideoLoaded(true)}
          />
        }
      </LinkOut>
      <div className={classes.appMetadata}>
        <div className={classes.appTitle}>{app.appTitle}</div>
        <div className={classes.appAccountName}>{app.Account.name}</div>
      </div>
    </div>
  )
}

export default ProjectCard
