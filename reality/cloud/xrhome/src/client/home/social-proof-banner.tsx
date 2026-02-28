import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'

import netflixLogo from '../static/brandrefreshlogos/netflix-logo.png'
import mcDonaldsLogo from '../static/brandrefreshlogos/mcdonalds-logo.png'
import xBoxLogo from '../static/brandrefreshlogos/xbox-logo.png'
import pubgLogo from '../static/brandrefreshlogos/pubg-logo.png'
import legoLogo from '../static/brandrefreshlogos/lego-logo.png'
import redBullLogo from '../static/brandrefreshlogos/red-bull-logo.png'
import {combine} from '../common/styles'
import {mobileViewOverride, tinyViewOverride} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'
import {SecondaryButton} from '../ui/components/secondary-button'

const useStyles = createThemedStyles(theme => ({
  socialProofSection: {
    background: theme.bgMuted,
    padding: '4em 2em',
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    gap: '2em',
    [tinyViewOverride]: {
      padding: '1.5em 1em',
    },
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5em',
    maxWidth: '960px',
    alignItems: 'center',
  },
  heading: {
    color: theme.fgMain,
    fontFamily: theme.headingFontFamily,
    fontSize: '2em',
    textAlign: 'center',
    fontWeight: 700,
    [tinyViewOverride]: {
      fontSize: '1.25em',
    },
  },
  description: {
    fontFamily: theme.subHeadingFontFamily,
    color: theme.fgMuted,
    [tinyViewOverride]: {
      fontSize: '0.825em',
    },
  },
  logos: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    textAlign: 'center',
    gap: '1em',
  },
  logo: {
    'minWidth': '7em',
    'padding': '1em',
    'border': `1px solid ${theme.fgMuted}`,
    'background': theme.bgMuted,
    'borderRadius': '8px',
    'display': 'flex',
    'alignItems': 'center',
    '& img': {
      maxHeight: '2.5em',
      [mobileViewOverride]: {
        maxHeight: '2em',
      },
    },
    [mobileViewOverride]: {
      minWidth: '6em',
    },
  },
  logoLong: {
    '& img': {
      maxHeight: '2em',
      [mobileViewOverride]: {
        maxHeight: '1.5em',
      },
    },
  },
  brandImage: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
  },
}))

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

const SocialProofBanner: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])

  return (
    <div className={classes.socialProofSection}>
      <div className={classes.headingContainer}>
        <div className={classes.heading}>
          {t('home_page.social_proof_banner.heading')}
        </div>
        <div className={classes.description}>
          {t('home_page.social_proof_banner.description')}
        </div>
        <Link to='/custom' a8='click;homepage;contact-sales'>
          <SecondaryButton spacing='wide'>
            {t('home_page.social_proof_banner.cta.contact_sales')}
          </SecondaryButton>
        </Link>
      </div>
      {/* eslint-disable local-rules/hardcoded-copy */}
      <div className={classes.logos}>
        <Picture
          className={combine(classes.logo, classes.logoLong)}
          src={netflixLogo}
          alt='Netflix Logo'
        />
        <Picture
          className={combine(classes.logo, classes.logoLong)}
          src={xBoxLogo}
          alt='XBox Logo'
        />
        <Picture
          className={classes.logo}
          src={legoLogo}
          alt='Lego Logo'
        />
        <Picture
          className={classes.logo}
          src={mcDonaldsLogo}
          alt='McDonalds Logo'
        />
        <Picture
          className={classes.logo}
          src={pubgLogo}
          alt='PubG Logo'
        />
        <Picture
          className={combine(classes.logo, classes.logoLong)}
          src={redBullLogo}
          alt='Red Bull Logo'
        />
      </div>
      {/* eslint-enable local-rules/hardcoded-copy */}
    </div>
  )
}

export {SocialProofBanner}
