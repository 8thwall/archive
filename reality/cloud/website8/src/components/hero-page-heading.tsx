import React, {FC} from 'react'
import {createUseStyles} from 'react-jss'
import {Link} from 'gatsby'

import Button8 from './button8'
import {bool, combine} from '../styles/classname-utils'
import {moonlight} from '../styles/brand-colors'
import {
  MOBILE_VIEW_OVERRIDE, TABLET_VIEW_OVERRIDE,
} from '../styles/constants'

const URL_PATTERN = /^https?:\/\//i

const useStyles = createUseStyles({
  headingContainer: {
    'backgroundImage': props => (
      props.heroSrc ? `url(${props.heroSrc})` : 'none'
    ),
    'backgroundPosition': 'center center',
    'backgroundSize': 'cover',
    'backgroundRepeat': 'no-repeat',
    'height': '600px',
    'backgroundColor': moonlight,
    'display': 'flex',
    'justifyContent': ({videoSrc}) => (videoSrc ? 'center' : 'start'),
    'alignItems': 'center',
    'padding': '3rem',
    [TABLET_VIEW_OVERRIDE]: {
      height: props => (
        props.videoSrc ? 'fit-content' : '600px'
      ),
      flexDirection: ({videoSrc}) => (videoSrc ? 'column' : 'row'),
    },
    [MOBILE_VIEW_OVERRIDE]: {
      padding: '2rem 1.5rem',
      height: props => (
        props.videoSrc ? 'fit-content' : '480px'
      ),
    },
  },
  titlesContainer: {
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: ({titleWidth}) => titleWidth,
    marginRight: ({videoSrc}) => (videoSrc ? '1rem' : 'inherit'),
    marginLeft: ({videoSrc}) => (videoSrc ? 'inherit' : '10%'),
    [TABLET_VIEW_OVERRIDE]: {
      margin: ({videoSrc}) => (videoSrc ? '0 0 1rem !important' : '0 !important'),
      maxWidth: '100% !important',
    },
    [MOBILE_VIEW_OVERRIDE]: {
      marginRight: 0,
      marginLeft: 0,
    },
  },
  title: {
    maxWidth: ({titleWidth}) => titleWidth,
    [TABLET_VIEW_OVERRIDE]: {
      maxWidth: '35rem !important',
    },
    [MOBILE_VIEW_OVERRIDE]: {
      maxWidth: '20rem !important',
    },
  },
  ctasContainer: {
    display: 'inline-block',
    marginBottom: '1rem',
  },
  ctaButton: {
    '&:not(:first-child)': {
      marginLeft: '1rem',
    },
  },
  awardsContainer: {
    'display': 'inline-block',
    'marginBottom': '1rem',
    '& img': {
      maxWidth: '15rem',
    },
  },
  awardImg: {
    'height': '4.5rem',
    '&:not(:first-child)': {
      marginLeft: '1rem',
    },
  },
  headingVideo: {
    'maxWidth': '50rem',
    'maxHeight': '90%',
    'margin': 0,
    '& iframe': {
      borderRadius: '10px',
    },
    [TABLET_VIEW_OVERRIDE]: {
      maxWidth: '100%',
    },
  },
})

interface ICta {
  to: string
  title: string
  linkOut?: boolean
  secondary?: boolean
}

interface IAward {
  src: string
  alt: string
}

interface IHeroPageHeading {
  className?: string
  heroSrc?: string
  title: string
  subTitle?: string
  titleWidth?: string
  ctas?: ICta[]
  awards?: IAward[]
  videoSrc?: string
}

const HeroPageHeading: FC<IHeroPageHeading> = ({
  className = '', heroSrc, title, subTitle, titleWidth = '48rem', ctas = [], awards = [], videoSrc,
}) => {
  const classes = useStyles({heroSrc, videoSrc, titleWidth})
  const ctaButton = cta => (URL_PATTERN.test(cta.to)
    ? (
      <a
        className={classes.ctaButton}
        href={cta.to}
        target={cta.linkOut ? '_blank' : '_self'}
        rel='noopener noreferrer'
      >
        <Button8
          key={cta.title}
          secondary={cta.secondary}
        >
          {cta.title}
        </Button8>
      </a>
    ) : (
      <Link
        className={classes.ctaButton}
        to={cta.to}
      >
        <Button8
          key={cta.title}
          secondary={cta.secondary}
        >
          {cta.title}
        </Button8>
      </Link>
    ))

  const ctaButtons = (
    <div className={classes.ctasContainer}>
      {ctas.map(cta => ctaButton(cta))}
    </div>
  )

  return (
    <section className={combine(classes.headingContainer, className)}>
      <div className={classes.titlesContainer}>
        <h1 className={combine(classes.title, 'h1-xl')}>{title}</h1>
        {subTitle &&
          <h3 className={combine('h3-xl font8-medium text-white', bool(!videoSrc, classes.title))}>
            {subTitle}
          </h3>
        }
        {ctas.length > 0 && ctaButtons}
        {awards.length > 0 &&
          <div className={classes.awardsContainer}>
            {awards.map(award => (
              <img
                className={classes.awardImg}
                key={award.alt}
                src={award.src}
                alt={award.alt}
              />
            ))}
          </div>
        }
      </div>

      {videoSrc &&
        <div
          className={combine('embed-responsive', 'embed-responsive-16by9', classes.headingVideo)}
        >
          <iframe
            title={title}
            className='embed-responsive-item'
            src={videoSrc}
            webkitallowfullscreen='true'
            mozallowfullscreen='true'
            allowFullScreen
          />
        </div>
      }
    </section>
  )
}

export default HeroPageHeading
