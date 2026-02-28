import React from 'react'

import {mobileViewOverride} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  blogPostContainer: {
    'display': 'flex',
    'paddingRight': '8px',
    '&:hover': {
      backgroundColor: theme.listItemHoverBg,
      borderRadius: '4px',
    },
    'alignItems': 'center',
  },
  blogTitle: {
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
  coverImage: {
    width: '160px',
    aspectRatio: '16/9',
    marginRight: '1rem',
    borderRadius: '8px',
    [mobileViewOverride]: {
      width: '100px',
    },
  },
}))

type BlogPostProps = {
  id: string
  title: string
  slug: string
  featuredImage: string
}
const BlogPost: React.FC<BlogPostProps> = ({id, title, slug, featuredImage}) => {
  const classes = useStyles()
  const blogURL = `/blog/post/${id}${slug}`

  return (
    <a
      href={blogURL}
      target='_blank'
      rel='noreferrer'
      className={classes.blogPostContainer}
      a8={`click;warm-start;click-news-${blogURL}`}
    >
      <img
        className={classes.coverImage}
        src={featuredImage}
        alt={title}
      />
      <div className={classes.blogTitle}>
        {title}
      </div>
    </a>
  )
}

export {
  BlogPost,
}
