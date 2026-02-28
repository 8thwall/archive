import React from 'react'

import {createCustomUseStyles} from '../../common/create-custom-use-styles'
import {
  brandGray2,
  brandGray4,
  brandBlack,
  mobileViewOverride,
  tabletViewOverride,
  centeredSectionMaxWidth,
} from '../../static/arcade/arcade-settings'
import {hexColorWithAlpha} from '../../../shared/colors'
import {getAppHeroImageUrl, getAppHeroVideoUrl, getAppUrl} from '../common/arcade-app-utils'
import {PrimaryButton} from './primary-button'
import ScreenType from '../common/screen-types'
import useScreenType from '../common/use-screen-type'

const useStyles = createCustomUseStyles()({
  heroBanner: {
    'display': 'flex',
    'position': 'relative',
    'width': '100%',
    'aspectRatio': '16 / 9',
    'maxHeight': '80vh',
    'boxSizing': 'border-box',
    'overflow': 'hidden',

    [mobileViewOverride]: {
      'scrollSnapAlign': 'start',
      'width': '100%',
      'maxHeight': '100vh',
      'aspectRatio': '9 / 16',
      'justifyContent': 'center',
    },
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,1) 40%)',

    [mobileViewOverride]: {
      maskImage: 'linear-gradient(to top, rgba(0,0,0,0.05) 0%, rgba(0,0,0,1) 40%)',
    },
  },
  appMetadataContainer: {
    width: centeredSectionMaxWidth,
    maxWidth: 'calc(100% - 5rem)',
    margin: 'auto auto 4.5rem auto',
    [tabletViewOverride]: {
      margin: 'auto auto 1.5rem auto',
    },
    [mobileViewOverride]: {
      width: '100%',
      maxWidth: 'unset',
      margin: 'auto 1.5rem 4.5rem 1.5rem',
    },
  },
  appMetadata: {
    width: '320px',
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'column',
    borderRadius: '1.25rem',
    border: `1px solid ${brandGray4}`,
    justifyContent: 'space-between',
    background: hexColorWithAlpha(brandBlack, 0.75),
    padding: '2rem',
    overflow: 'hidden',
    backdropFilter: 'blur(7.5px)',
    [tabletViewOverride]: {
      padding: '1.5rem',
    },
    [mobileViewOverride]: {
      alignItems: 'center',
      width: '100%',
      padding: '1.5rem',
    },
  },
  heading: {
    display: '-webkit-box',
    marginTop: 0,
    marginBottom: '0.25rem',
    fontSize: '1.5rem',
    lineHeight: '1.4375em',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [tabletViewOverride]: {
      fontSize: '1.25rem',
      lineHeight: '1.5em',
    },
  },
  accountName: {
    fontSize: '1.125rem',
    lineHeight: '1.5em',
    marginTop: 0,
    marginBottom: '1rem',
    color: brandGray2,
    [tabletViewOverride]: {
      fontSize: '0.875rem',
    },
  },
  playButton: {
    minWidth: '10em',
    [mobileViewOverride]: {
      width: '100%',
    },
  },
})

interface IHeroBanner {
  // TODO(Brandon): Update type of apps.
  app: any
  queryParams?: Record<string, string>
}

const HeroBanner: React.FC<IHeroBanner> = ({app, queryParams}) => {
  const classes = useStyles()
  const screenType = useScreenType()

  const searchParams = new URLSearchParams(queryParams).toString()
  const appUrl = searchParams
    ? `${getAppUrl(app.Account, app)}?${searchParams}`
    : getAppUrl(app.Account, app)

  const getAppHeroImageSource = () => {
    switch (screenType) {
      case ScreenType.Mobile:
        return `${getAppHeroImageUrl(app)}-mobile`
      default:
        return getAppHeroImageUrl(app)
    }
  }

  const getAppHeroVideoSource = () => {
    switch (screenType) {
      case ScreenType.Mobile:
        return `${getAppHeroVideoUrl(app)}-mobile`
      case ScreenType.XL:
        return `${getAppHeroVideoUrl(app)}-xl`
      default:
        return getAppHeroVideoUrl(app)
    }
  }

  return (
    <div className={classes.heroBanner}>
      <video
        className={classes.video}
        autoPlay
        loop
        muted
        playsInline
        draggable={false}
        poster={getAppHeroImageSource()}
        src={getAppHeroVideoSource()}
      />
      <div className={classes.appMetadataContainer}>
        <div className={classes.appMetadata}>
          <h2 className={classes.heading}>{app.appTitle}</h2>
          <p className={classes.accountName}>{app.Account.name}</p>
          <PrimaryButton
            text='Play Now!'
            href={appUrl}
            className={classes.playButton}
            a8={`click;hp-herocard;${app.Account.shortName}-${app.appName}`}
          />
        </div>
      </div>
    </div>
  )
}

export {HeroBanner}
