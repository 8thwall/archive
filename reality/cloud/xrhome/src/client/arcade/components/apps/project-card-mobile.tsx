import React from 'react'
import {createUseStyles} from 'react-jss'

import {
  white,
  brandGray3,
} from '../../../static/arcade/arcade-settings'
import {
  getAppDisplayName,
  getAppUrl,
  getAppCoverImageUrl,
  getAppPreviewVideoUrl,
} from '../../common/arcade-app-utils'
import LinkOut from '../../../uiWidgets/link-out'

const useStyles = createUseStyles({
  projectCard: {
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: '9 / 16',
    scrollSnapAlign: 'start',
    scrollMarginTop: '1rem',
    margin: '1rem',
    boxSizing: 'content-box',
  },
  coverImage: {
    position: 'absolute',
    width: '100%',
    aspectRatio: '9 / 16',
    borderRadius: '0.75rem',
    objectFit: 'cover',
    overflow: 'hidden',
    maskImage: 'linear-gradient(to top, rgba(0,0,0,0.05) 0%, rgba(0,0,0,1) 40%)',
  },
  appMetadata: {
    pointerEvents: 'none',
    position: 'absolute',
    bottom: '1.5rem',
    left: '1.5rem',
    zIndex: 1,
  },
  appTitle: {
    color: white,
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: '1.5rem',
  },
  appAccountName: {
    color: brandGray3,
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: '1.25rem',
  },
})

interface IProjectCardMobile {
  // TODO(Brandon): Update typing for what is contained in app.
  app: any
  lazyLoading?: boolean
}

const ProjectCardMobile: React.FC<IProjectCardMobile> = ({app, lazyLoading = false}) => {
  const classes = useStyles()

  return (
    <div
      className={classes.projectCard}
    >
      <LinkOut
        url={getAppUrl(app.Account, app)}
        aria-label={getAppDisplayName(app)}
      >
        <video
          className={classes.coverImage}
          autoPlay
          loop
          muted
          playsInline
          draggable={false}
          preload={lazyLoading ? 'none' : 'eager'}
          poster={`${getAppCoverImageUrl(app)}-mobile`}
          src={`${getAppPreviewVideoUrl(app)}-mobile`}
        />
      </LinkOut>
      <div className={classes.appMetadata}>
        <div className={classes.appTitle}>{app.appTitle}</div>
        <div className={classes.appAccountName}>{app.Account.name}</div>
      </div>
    </div>
  )
}

export default ProjectCardMobile
