import React from 'react'
import {createUseStyles} from 'react-jss'

import {getUpsellImageUrl, getUpsellVideoUrl} from '../common/arcade-app-utils'
import {RoundedLinkButton} from './rounded-link-button'
import {
  white, brandBlack, centeredSectionMaxWidth, mobileViewOverride, tabletViewOverride,
} from '../../static/arcade/arcade-settings'
import {hexColorWithAlpha} from '../../../shared/colors'
import backgroundGradient from '../../static/arcade/background-gradient.svg'
import {ARCADE_CDN_URL} from '../common/arcade-app-constants'

const useStyles = createUseStyles({
  upsellBanner: {
    position: 'relative',
    display: 'flex',
    gap: '2.5rem',
    borderRadius: '0.75rem',
    padding: '56px',
    width: centeredSectionMaxWidth,
    maxWidth: 'calc(100% - 5rem)',
    margin: '4rem auto',
    boxSizing: 'border-box',
    boxShadow: `1px 1px 1px 0px ${hexColorWithAlpha(white, 0.4)} inset, ` +
    `-1px -1px 0px 0.5px ${hexColorWithAlpha(white, 0.15)} inset`,
    background: `${hexColorWithAlpha(brandBlack, 0.5)}`,
    justifyContent: 'space-between',

    [tabletViewOverride]: {
      alignItems: 'center',
      flexDirection: 'column-reverse',
      padding: '1.5rem',
    },

    [mobileViewOverride]: {
      width: 'unset',
      maxWidth: '100%',
      margin: '4rem 1rem 0 1rem',
    },
  },
  heading: {
    margin: 0,
    fontSize: '2rem',
    lineHeight: '1.25em',

    [tabletViewOverride]: {
      fontSize: '1.5rem',
    },
  },
  blurb: {
    margin: 0,
    width: '90%',
    fontSize: '1.125rem',
    lineHeight: '1.5em',

    [mobileViewOverride]: {
      display: 'none',
    },
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '2em',
    justifyContent: 'space-between',
    gap: '1.5rem',

    [tabletViewOverride]: {
      gap: '1.5rem',
      alignItems: 'center',
      textAlign: 'center',
    },
  },
  upsellImage: {
    borderRadius: '20px',
    width: '448px',
    margin: 'auto',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    pointerEvents: 'none',
    overflow: 'hidden',
    flex: '0 0 448px',

    [tabletViewOverride]: {
      maxWidth: '100%',
      flex: 'unset',
    },
  },
  gradientBackground: {
    position: 'absolute',
    width: '932px',
    maxWidth: '100%',
    aspectRatio: '1.2',
    top: '-8rem',
    left: 'auto',
    right: 'auto',
    backgroundImage: `url(${backgroundGradient})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -1,
    filter: 'blur(2em)',

    [mobileViewOverride]: {
      display: 'none',
    },
  },
  createForFreeButton: {
    [mobileViewOverride]: {
      width: '100%',
    },
  },
})

const UPSELL_CONSTANTS = {
  imageUrl: `${ARCADE_CDN_URL}/web/upsell-image-m3tg8riw`,
  videoUrl: `${ARCADE_CDN_URL}/web/upsell-video-m3tg8no0`,
}

const UpsellBanner = () => {
  const classes = useStyles()

  return (
    <div className={classes.upsellBanner}>
      <div className={classes.gradientBackground} />
      <div className={classes.textContainer}>
        <h2 className={classes.heading}>Create WebXR and 3D experiences with Niantic Studio</h2>
        <p className={classes.blurb}>
          Start building your own games with Niantic Studio, a free visual interface
          and web gaming engine for creating XR experiences, web games, and more.
        </p>
        <RoundedLinkButton
          className={classes.createForFreeButton}
          text='Create for Free'
          href='https://www.8thwall.com/get-started'
          a8='click;hp-upsell;click-createforfree'
        />
      </div>
      <video
        className={classes.upsellImage}
        autoPlay
        loop
        muted
        playsInline
        draggable={false}
        preload='none'
        poster={getUpsellImageUrl(UPSELL_CONSTANTS)}
        src={getUpsellVideoUrl(UPSELL_CONSTANTS)}
      />
    </div>
  )
}

export {UpsellBanner}
