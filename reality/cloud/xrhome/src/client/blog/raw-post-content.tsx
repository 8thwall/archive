// TODO (Tri): Stop using setDangerousInnerHTML here
import React from 'react'

import {tinyViewOverride} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  postBody: {
    'fontSize': '16px',
    'lineHeight': '24px',
    '& img,figure': {
      maxWidth: '100%',
      height: 'auto',
    },
    '& div,p': {
      fontFamily: theme.bodyFontFamily,
      fontSize: '1em',
      lineHeight: '1.5',
    },
    '& a': {
      color: theme.fgMain,
      textDecoration: 'underline',
    },
    '& blockquote': {
      'fontSize': '1.5em',
      'lineHeight': '1.8em',
      'fontWeight': 'medium',
      'textAlign': 'center',
      'color': theme.fgMuted,
      [tinyViewOverride]: {
        fontSize: '1em',
        lineHeight: '1.1',
      },
      '& p': {
        fontFamily: theme.subHeadingFontFamily,
      },
    },
    '& figcaption': {
      color: theme.fgMuted,
      textAlign: 'center',
    },
    '& h1,h2,h3,h4,h5,h6': {
      'fontFamily': `${theme.subHeadingFontFamily} !important`,
      '& *': {
        fontFamily: `${theme.subHeadingFontFamily} !important`,
      },
    },
    '& .hs-embed-wrapper': {
      maxWidth: '100%',
    },
    '& .hs-embed-content-wrapper': {
      width: '100%',
      height: 'auto',
    },
  },
}))

const RawPostContentComponent = ({html}) => {
  const styles = useStyles()
  return (
    // eslint-disable-next-line react/no-danger
    <div className={styles.postBody} dangerouslySetInnerHTML={{__html: html}} />
  )
}

export default RawPostContentComponent
