import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {
  mobileViewOverride, smallMonitorViewOverride, tinyViewOverride,
} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'
import {CreateForFreeCtaButton} from './create-for-free-cta-button'
import {combine} from '../common/styles'
import imageL1 from '../static/brandrefresh/bghero_L1.png'
import imageL2 from '../static/brandrefresh/bghero_L2.png'
import imageL3 from '../static/brandrefresh/bghero_L3.png'
import imageL4 from '../static/brandrefresh/bghero_L4.png'
import imageLight from '../static/brandrefresh/bghero_light.png'
import {DustParticles} from './dust-particles'

const useStyles = createThemedStyles(theme => ({
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '0 auto',
    color: theme.fgMain,
    position: 'relative',
    width: '100%',
    height: '75vh',
    maxWidth: '2000px',
    [smallMonitorViewOverride]: {
      maxWidth: '1700px',
    },
  },
  heroContent: {
    padding: '0 2em 4em 2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1em',
    zIndex: 9,
    position: 'absolute',
    left: '7%',
    [mobileViewOverride]: {
      left: 'unset',
      width: 'unset',
    },
    [tinyViewOverride]: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '2em 2em 0',
    },
  },
  bottomHeading: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '1em',
    [tinyViewOverride]: {
      alignItems: 'center',
    },
  },
  heading: {
    fontFamily: theme.headingFontFamily,
    fontWeight: 700,
    fontSize: '6em',
    lineHeight: '1em',
    maxWidth: '7em',
    [mobileViewOverride]: {
      fontSize: '4em',
    },
    [tinyViewOverride]: {
      fontSize: '2.25em',
      textAlign: 'center',
      maxWidth: '9em',
    },
  },
  headingArticle: {
    lineHeight: '1em',
    fontSize: '0.375em',
    [mobileViewOverride]: {
      fontSize: '0.6em',
    },
    [tinyViewOverride]: {
      fontSize: '1em',
    },
  },
  subheading: {
    fontFamily: theme.subHeadingFontFamily,
    fontWeight: 500,
    fontSize: '1.5em',
    lineHeight: 1.5,
    maxWidth: '26em',
    [tinyViewOverride]: {
      fontSize: '1em',
      textAlign: 'center',
    },
  },
  lineBreak: {
    [tinyViewOverride]: {
      display: 'none',
    },
  },
}))

const useAnimationStyles = createUseStyles({
  '@keyframes parallax': {
    'to': {
      transform: 'translateY(calc(var(--parallax-speed) * 200px))',
    },
  },
  'parallaxWrapper': {
    height: '100%',
    width: '100%',
    position: 'relative',
    display: 'grid',
    maskComposite: 'intersect',
    mask: 'linear-gradient(to right, transparent , #fff 20%, #fff 85%, transparent 100%), ' +
      'linear-gradient(to bottom, #fff 95%, transparent 100%)',
    [smallMonitorViewOverride]: {
      mask: 'linear-gradient(to right, transparent , #fff 40%, #fff 85%, transparent 100%), ' +
      'linear-gradient(to bottom, #fff 95%, transparent 100%)',
      maskComposite: 'intersect',
    },
    [mobileViewOverride]: {
      width: '100vw',
      mask: 'linear-gradient(to bottom, transparent , #fff 20%, #fff 80%, transparent 100%)',
    },
  },
  'imageLayer': {
    'position': 'absolute',
    'height': '120%',
    'width': '100%',
    'gridArea': 'stack',
    'objectFit': 'cover',
    'objectPosition': 'left 20% top 0%',
    'top': '-2em',
    '@media (max-width: 2000px)': {
      objectPosition: 'right 80% top 0%',
    },
    '@media (max-width: 1700px)': {
      objectPosition: 'right 65% top 0%',
    },
    '@media (max-width: 1500px)': {
      objectPosition: 'right 95% top 0%',
    },
    '@media (max-width: 1300px)': {
      objectPosition: 'right 80% top 0%',
    },
    [smallMonitorViewOverride]: {
      objectPosition: 'right 60% top 0%',
    },
    [mobileViewOverride]: {
      objectPosition: 'right 60% top 0%',
      top: '-3em',
    },
    [tinyViewOverride]: {
      objectPosition: 'right 50% top 0%',
      top: '-7em',
    },
  },
  'parallaxAnimation': {
    animation: '$parallax linear',
    animationTimeline: 'scroll()',
  },
  'layerChar1': {
    '--parallax-speed': 2,
    'zIndex': 7,
  },
  'layerDesk': {
    '--parallax-speed': 6,
    'zIndex': 5,
  },
  'layerLight': {
    '--parallax-speed': 8,
    'zIndex': 4,
  },
  'layerChar2': {
    '--parallax-speed': 8,
    'zIndex': 3,
  },
  'layerBg': {
    '--parallax-speed': 10,
    'zIndex': 0,
  },
  'easeLoad': {
    opacity: 0,
    transition: 'opacity 2s ease',
  },
})

const HomePageHero = () => {
  const classes = useStyles()
  const animationClasses = useAnimationStyles()
  const {t} = useTranslation('public-featured-pages')
  const heroRef = React.useRef<HTMLElement>(null)

  const textHeading = (
    <div className={classes.heroContent}>
      <div className={classes.heading}>
        <Trans
          ns='public-featured-pages'
          i18nKey='home_page.hero_banner.heading'
          components={{
            1: <span className={classes.headingArticle} />,
            2: <br className={classes.lineBreak} />,
          }}
        />
      </div>
      <div className={classes.bottomHeading}>
        <CreateForFreeCtaButton />
        <div className={classes.subheading}>
          {t('home_page.hero_banner.subheading')}
        </div>
      </div>
    </div>
  )

  // Fade on Scroll
  const handleScroll = () => {
    const element = heroRef.current
    const distanceToTop = window.pageYOffset + element.getBoundingClientRect().top
    const elementHeight = element.offsetHeight
    const {scrollTop} = document.documentElement

    // scroll from bottom

    let opacity = 1

    if (scrollTop > distanceToTop) {
      opacity = 1 - (scrollTop - distanceToTop) / elementHeight
    }

    if (opacity >= 0) {
      element.style.opacity = opacity.toString()
    }
  }

  React.useEffect(() => {
    const div = heroRef.current
    if (div) {
      window.addEventListener('scroll', handleScroll)
    }

    // Cleanup function to remove the event listener
    return () => {
      if (div) {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <section className={classes.heroSection} ref={heroRef}>
      {textHeading}
      <div className={animationClasses.parallaxWrapper}>
        <DustParticles />
        <img
          alt=''
          className={combine(animationClasses.imageLayer, animationClasses.parallaxAnimation,
            animationClasses.layerBg)}
          src={imageL4}
        />
        <img
          alt=''
          className={combine(animationClasses.imageLayer, animationClasses.parallaxAnimation,
            animationClasses.layerChar2)}
          src={imageL3}
        />
        <img
          alt=''
          className={combine(animationClasses.imageLayer,
            animationClasses.layerLight)}
          src={imageLight}
        />
        <img
          alt=''
          className={combine(animationClasses.imageLayer, animationClasses.parallaxAnimation,
            animationClasses.layerDesk)}
          src={imageL2}
        />
        <img
          alt=''
          className={combine(animationClasses.imageLayer, animationClasses.parallaxAnimation,
            animationClasses.layerChar1)}
          src={imageL1}
        />
      </div>
    </section>
  )
}

export {HomePageHero}
