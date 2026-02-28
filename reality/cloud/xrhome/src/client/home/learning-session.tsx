import React from 'react'

import {mobileViewOverride} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  tutorialTitle: {
    display: '-webkit-box',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '20px',
    color: theme.fgMain,
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    overflow: 'hidden',
  },
  coverImage: {
    width: '160px',
    height: '90px',
    aspectRatio: '16/9',
    marginRight: '1rem',
    borderRadius: '8px',
    [mobileViewOverride]: {
      width: '100px',
      height: '60px',
    },
  },
  mainBar: {
    'display': 'flex',
    'paddingRight': '8px',
    '&:hover': {
      backgroundColor: theme.listItemHoverBg,
      borderRadius: '8px',
    },
    'alignItems': 'center',
  },
}))

const LearningSession = ({id, title, coverImage}) => {
  const classes = useStyles()
  const tutorialURL = `https://www.youtube.com/watch?v=${id}`
  return (
    <a
      href={tutorialURL}
      target='_blank'
      rel='noreferrer'
      a8={`click;warm-start;click-tutorials-${title}`}
      className={classes.mainBar}
    >
      <img
        className={classes.coverImage}
        src={coverImage}
        alt={title}
      />
      <div className={classes.tutorialTitle}>
        {title}
      </div>

    </a>

  )
}

export {
  LearningSession,
}
