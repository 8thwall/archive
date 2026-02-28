import React from 'react'
import {createUseStyles} from 'react-jss'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {
  brandHighlight, brandWhite, headerSanSerif, mobileViewOverride, tinyViewOverride, bodySanSerif,
  brandBlack, accessibleHighlight, csBlack,
  blueberry,
} from '../static/styles/settings'
import {useUserHasSession} from '../user/use-current-user'
import {getPathForMyProjectsPage, getPathForSignUp, SignUpPathEnum} from '../common/paths'
import {hexColorWithAlpha} from '../../shared/colors'
import cloudStudioImage from '../static/cloud_studio_desktop_view.png'
import {BokehBackground} from './bokeh-background'

const useStyles = createUseStyles({
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    margin: '0 auto',
    padding: '0 1em',
  },
  heroContainer: {
    position: 'relative',
    background: csBlack,
    borderRadius: '1em',
    color: brandWhite,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: '300px',
    [tinyViewOverride]: {
      padding: '1em',
    },
  },
  heroContent: {
    zIndex: 3,
    padding: '4em 2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1em',
    textAlign: 'center',
  },
  heading: {
    fontFamily: headerSanSerif,
    fontWeight: 900,
    fontSize: '4em',
    lineHeight: 1.446,
    [mobileViewOverride]: {
      maxWidth: '13em',
    },
    [tinyViewOverride]: {
      fontSize: '1.75em',
      maxWidth: 'unset',
    },
  },
  subheading: {
    fontFamily: bodySanSerif,
    fontWeight: 500,
    fontSize: '1.75em',
    lineHeight: 1.5,
    [tinyViewOverride]: {
      fontSize: '1.25em',
    },
  },
  ctaButton: {
    'backgroundColor': brandHighlight,
    'color': brandWhite,
    'boxShadow': `1px 1px 0px 0px ${brandHighlight}, -1px -1px 0px 0px ${accessibleHighlight}, ` +
      `5px 5px 10px 0px ${hexColorWithAlpha(brandBlack, 0.15)}`,
    'fontSize': '1.125em',
    'LightHeight': '1.625em',
    'fontWeight': 'bold',
    'width': '200px',
    'height': '56px',
    'borderRadius': '28px',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    '&:hover': {
      backgroundColor: accessibleHighlight,
      color: brandWhite,
    },
  },
  previewImage: {
    zIndex: 2,
    maxWidth: '1200px',
    marginBottom: '-13em',
    marginTop: '-8em',
    filter: `drop-shadow(2px 2px 5em ${hexColorWithAlpha(blueberry, 0.8)})`,
    [mobileViewOverride]: {
      width: '100%',
      marginTop: '-5em',
      marginBottom: '-8em',
      padding: '0 1em 0 2em',
    },
    [tinyViewOverride]: {
      marginTop: '-3em',
      marginBottom: '-5em',
      objectFit: 'cover',
      padding: 0,
      filter: `drop-shadow(2px 2px 3em ${hexColorWithAlpha(blueberry, 0.8)})`,
    },
  },
})

const HomePageHero = () => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const isLoggedIn = useUserHasSession()
  const getStartedA8Event = 'click,homepage,click-get-started-cta'
  const getStartedStringKey = 'home_page.hero.button.create_for_free'

  return (
    <section className={classes.heroSection}>
      <div className={classes.heroContainer}>
        <BokehBackground />
        <div className={classes.heroContent}>
          <div className={classes.heading}>{t('home_page.hero.heading')}</div>
          <div className={classes.subheading}>{t('home_page.hero.subheading')}</div>
          <Link
            className={classes.ctaButton}
            to={isLoggedIn
              ? getPathForMyProjectsPage()
              : getPathForSignUp(SignUpPathEnum.step1Register)
            }
            a8={!isLoggedIn ? getStartedA8Event : undefined}
          >
            {isLoggedIn
              ? t('home_page.hero.button.go_to_my_projects')
              : t(getStartedStringKey)}
          </Link>
        </div>
        <img
          className={classes.previewImage}
          // eslint-disable-next-line local-rules/hardcoded-copy
          alt='Cloud Studio Preview'
          src={cloudStudioImage}
        />
      </div>
    </section>
  )
}

export {HomePageHero}
