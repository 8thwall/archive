import React from 'react'

import {mobileViewOverride} from '../../static/styles/settings'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  recommendedItem: {
    'display': 'flex',
    'paddingRight': '8px',
    '&:hover': {
      backgroundColor: theme.listItemHoverBg,
      borderRadius: '4px',
    },
    'alignItems': 'center',
  },
  title: {
    display: '-webkit-box',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '20px',
    color: theme.fgMain,
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    verticalAlign: 'middle',
    alignItems: 'center',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    overflow: 'hidden',
  },
  image: {
    width: '160px',
    aspectRatio: '16/9',
    marginRight: '1rem',
    borderRadius: '8px',
    [mobileViewOverride]: {
      width: '100px',
    },
  },
}))

type IRecommendedItem = {
  a8?: string
  url: string
  image: string
  alt: string
  children?: React.ReactNode
}
const RecommendedItem: React.FC<IRecommendedItem> = ({alt, a8, url, children, image}) => {
  const classes = useStyles()

  return (
    <a
      href={url}
      target='_blank'
      rel='noreferrer'
      className={classes.recommendedItem}
      a8={a8}
    >
      <img
        className={classes.image}
        src={image}
        alt={alt}
      />
      <div className={classes.title}>
        {children}
      </div>
    </a>
  )
}

export {
  RecommendedItem,
}
