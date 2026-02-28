import React from 'react'
import {Link} from 'react-router-dom'

import {tinyViewOverride} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  link: {
    textDecoration: 'none',
  },
  text: {
    'color': theme.fgMain,
    'fontSize': '24px',
    'fontWeight': '900',
    '&>span': {
      'fontFamily': theme.headingFontFamily,
      'verticalAlign': 'baseline',
    },
    'marginBottom': '2rem !important',
    [tinyViewOverride]: {
      'fontSize': '18px',
    },
  },
  blog: {
    color: theme.fgMain,
    fontWeight: '300',
  },
}))

const BlogTitle = () => {
  const styles = useStyles()

  return (
    <Link className={styles.link} to='/blog'>
      <h1 className={`main ${styles.text}`}>
        <span>8th Wall</span> <span className={styles.blog}>Blog</span>
      </h1>
    </Link>
  )
}

export {BlogTitle}
