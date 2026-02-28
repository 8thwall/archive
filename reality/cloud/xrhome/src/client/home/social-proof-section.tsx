import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import microsoftLogo from '../static/logos/microsoft-logo.png'
import netflixLogo from '../static/logos/netflix-logo.png'
import mcDonaldsLogo from '../static/logos/mcdonalds-logo.png'
import xBoxLogo from '../static/logos/xbox-logo.png'
import mitRealityHacksLogo from '../static/logos/mit-reality-hacks-logo.png'
import burberryLogo from '../static/logos/burberry-logo.png'
import {combine} from '../common/styles'
import {
  mobileViewOverride, tinyViewOverride, bodySanSerif, brandBlack,
} from '../static/styles/settings'

const useStyles = createUseStyles({
  socialProofSection: {
    padding: '2em',
    fontSize: '16px',
  },
  socialHeader: {
    color: brandBlack,
    fontFamily: bodySanSerif,
    fontSize: '1.25em',
    textAlign: 'center',
    marginBottom: '1.5em',
    [tinyViewOverride]: {
      fontSize: '1.125em',
      marginBottom: '1em',
    },
  },
  logos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, auto)',
    gridTemplateRows: '1fr',
    verticalAlign: 'middle',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0 4em',
    [mobileViewOverride]: {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: 'repeat(3, auto)',
      gap: '1rem 7rem',
    },
    [tinyViewOverride]: {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: 'repeat(2, auto)',
      gap: '1em 2em',
    },
  },
  logo: {
    'objectFit': 'contain',
    'maxWidth': '9.15rem',
    'opacity': '0.6',
    'filter': 'invert(1)',
    '& img': {
      maxHeight: '6em',
      [tinyViewOverride]: {
        maxHeight: '5em',
      },
    },
  },
  hideOnMobile: {
    [mobileViewOverride]: {
      display: 'none',
    },
  },
  brandImage: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
  },
})

interface IPicture {
  src?: string
  alt?: string
  className?: string
  imgClass?: string
}

const Picture: React.FunctionComponent<IPicture> = (
  {imgClass, src, alt, className, ...rest}
) => {
  const classes = useStyles()
  return (
    <div className={className}>
      <img
        className={combine(classes.brandImage, imgClass)}
        src={src}
        alt={alt}
        draggable={false}
        {...rest}
      />
    </div>
  )
}

const SocialProofSection: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])

  return (
    <div className={classes.socialProofSection}>
      <div className={classes.socialHeader}>
        {t('home_page.social_proof_section.trusted_by_devs_educators')}
      </div>
      {/* eslint-disable local-rules/hardcoded-copy */}
      <div className={classes.logos}>
        <Picture
          className={classes.logo}
          src={mcDonaldsLogo}
          alt='McDonalds Logo'
        />
        <Picture
          className={classes.logo}
          src={xBoxLogo}
          alt='XBox Logo'
        />
        <Picture
          className={classes.logo}
          src={netflixLogo}
          alt='Netflix Logo'
        />
        <Picture
          className={classes.logo}
          src={mitRealityHacksLogo}
          alt='MIT Reality Hacks Logo'
        />
        <Picture
          className={classes.logo}
          src={microsoftLogo}
          alt='Microsoft Logo'
        />
        <Picture
          className={classes.logo}
          src={burberryLogo}
          alt='Burberry Logo'
        />
      </div>
      {/* eslint-enable local-rules/hardcoded-copy */}
    </div>
  )
}

export {SocialProofSection}
