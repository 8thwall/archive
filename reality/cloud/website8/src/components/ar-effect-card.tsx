import React from 'react'
import {createUseStyles} from 'react-jss'
import {Link} from 'gatsby'

import {gray2, gray1, brandHighlight, brandWhite, brandPurple} from '../styles/brand-colors'
import {combine} from '../styles/classname-utils'

const useStyles = createUseStyles({
  effectCard: {
    backgroundColor: brandWhite,
    maxWidth: '19rem',
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5em',
    margin: '1.5em 0.5em',
    borderRadius: '0.5em',
    boxShadow: `0 0 25px ${gray2}`,
    textAlign: 'center',
  },
  effectImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '1.5em',
    border: `1px solid ${gray1}`,
  },
  effectButton: {
    'width': '100%',
    'border': `1px solid ${brandHighlight}`,
    'borderRadius': '2.5em',
    'padding': '0.8em',
    'transition': 'color 200ms, background-color 200ms',
    '&:hover': {
      textDecoration: 'none',
      borderColor: brandPurple,
      color: brandWhite,
      backgroundColor: brandPurple,
    },
  },
})

interface IExploreEffectCard {
  videoSrc: string,
  posterSrc: string,
  cardText: string,
  linkText: string,
  link: string,
  a8: string,
}

const AREffectCard: React.FunctionComponent<IExploreEffectCard> = (
  {videoSrc, posterSrc, cardText, linkText, link, a8}
) => {
  const classes = useStyles()

  return (
    <div className={classes.effectCard}>
      <video
        className={classes.effectImage}
        autoPlay
        loop
        muted
        playsInline
        src={videoSrc}
        poster={posterSrc}
      />

      <p className='noto-sans-jp font8-bold my-4'>{cardText}</p>
      <Link
        className={combine(classes.effectButton, 'font8-semibold text8-md')}
        to={link}
        a8={a8}
      >
        {linkText}
      </Link>
    </div>
  )
}

export default AREffectCard
