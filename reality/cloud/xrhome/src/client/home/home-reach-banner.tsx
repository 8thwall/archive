import React from 'react'
import {useTranslation, Trans} from 'react-i18next'

import {
  blueberry, mango,
  mint,
  mobileViewOverride, mobileWidthBreakpoint,
  tinyViewOverride,
} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'
import backgroundImage from '../static/brandrefresh/reach_banner_graphic.png'
import {combine} from '../common/styles'
import {Icon} from '../ui/components/icon'
import {brand8Black} from '../ui/colors'

const useStyles = createThemedStyles(theme => ({
  section: {
    position: 'relative',
    padding: '2.5em 2em',
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2em',
    backgroundColor: brand8Black,
    overflow: 'hidden',
    [mobileViewOverride]: {
      padding: '4em',
    },
    [tinyViewOverride]: {
      padding: '1em',
    },
  },
  container: {
    width: mobileWidthBreakpoint,
    display: 'flex',
    position: 'relative',
    [mobileViewOverride]: {
      width: '100%',
    },
    [tinyViewOverride]: {
      flexDirection: 'column',
      height: '27em',
    },
  },
  headingContainer: {
    display: 'flex',
    gap: '1.5em',
    zIndex: 2,
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  heading: {
    color: theme.fgMain,
    fontFamily: theme.headingFontFamily,
    fontWeight: 700,
    fontSize: '2em',
    lineHeight: '1em',
    [mobileViewOverride]: {
      fontSize: '1.25em',
    },
  },
  subheading: {
    fontFamily: theme.subHeadingFontFamily,
    color: theme.fgMuted,
    maxWidth: '30em',
    [mobileViewOverride]: {
      fontSize: '0.825em',
      maxWidth: '25em',
    },
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '2em',
    paddingLeft: '4em',
    zIndex: 2,
    flex: 1,
    [mobileViewOverride]: {
      paddingLeft: '2em',
    },
    [tinyViewOverride]: {
      justifyContent: 'center',
      paddingTop: '2em',
      gap: '3em',
    },
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5em',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '7px',
    background: theme.bgMuted,
    backdropFilter: 'blur(20px)',
  },
  blueberry: {
    'borderColor': blueberry,
    '& svg': {
      color: blueberry,
    },
    [mobileViewOverride]: {
      marginTop: '-2em',
    },
    [tinyViewOverride]: {
      marginTop: '2em',
    },
  },
  mint: {
    'borderColor': mint,
    'marginTop': '1.5em',
    '& svg': {
      color: mint,
    },
    [mobileViewOverride]: {
      marginTop: '0',
    },
    [tinyViewOverride]: {
      marginTop: '3.5em',
    },
  },
  mango: {
    'borderColor': mango,
    'marginTop': '2.75em',
    '& svg': {
      color: mango,
    },
    [mobileViewOverride]: {
      marginTop: '2em',
    },
    [tinyViewOverride]: {
      marginTop: '5em',
    },
  },
  backgroundImage: {
    position: 'absolute',
    right: '-20%',
    bottom: '-60%',
    [mobileViewOverride]: {
      right: '-35%',
      bottom: '-80%',
    },
    [tinyViewOverride]: {
      right: '-40%',
      width: '190%',
      bottom: '0%',
      maskImage: 'linear-gradient(0deg, black 20%, transparent)',
    },
  },
}))

const HomeReachBanner: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])

  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <div className={classes.headingContainer}>
          <div className={classes.heading}>
            <Trans
              ns='public-featured-pages'
              i18nKey='home_page.reach_banner.heading'
              components={{
                1: <br />,
              }}
            />
          </div>
          <div className={classes.subheading}>
            {t('home_page.reach_banner.subheading')}
          </div>
        </div>
        <div className={classes.iconContainer}>
          <div className={combine(classes.icon, classes.blueberry)}>
            <Icon stroke='globe' size={2} />
          </div>
          <div className={combine(classes.icon, classes.mint)}>
            <Icon stroke='androidLogo' size={2} />
          </div>
          <div className={combine(classes.icon, classes.mango)}>
            <Icon stroke='iosLogo' size={2} />
          </div>
        </div>
        <img
          alt=''
          className={classes.backgroundImage}
          src={backgroundImage}
        />
      </div>
    </div>
  )
}

export {HomeReachBanner}
