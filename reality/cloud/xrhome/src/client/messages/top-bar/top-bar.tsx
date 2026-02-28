/* eslint-disable quote-props */
import React from 'react'
import {Icon} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {Link} from 'react-router-dom'

import {combine} from '../../common/styles'
import type {TopBarState} from './top-bar-reducer'
import {brandPurple, brandWhite, skyBlue} from '../../static/styles/settings'
import {connect} from '../../common/connect'

const useStyles = createUseStyles({
  '@keyframes slideDown': {
    from: {transform: 'translateY(-100%)'},
    to: {transform: 'none'},
  },
  bar: {
    transition: '0.75s',
    textAlign: 'center',
    '&.blue': {
      backgroundColor: skyBlue,
    },
    '&.purple': {
      backgroundColor: brandPurple,
      color: brandWhite,
    },
    animation: '$slideDown 2s',
    padding: '1em',
  },
  summary: {
    fontWeight: 'bold',
  },
  text: {},
  buttonLink: {
    backgroundColor: brandWhite,
    color: brandPurple,
    padding: '0.25em 1em',
    borderRadius: '0.25em',
    marginLeft: '0.5em',
  },
  link: {
    textDecoration: 'underline',
    fontWeight: 'bold',
    '&:hover': {
      textDecoration: 'none',
    },
  },
})

/**
 * Currently does not support Button that run a specific action
 * TODO(dat): Need closeable implementation
 */
const TopBar: React.FunctionComponent<TopBarState> = ({
  isShown: isShow, icon, summary, text, linkText, linkTo, linkIsButton, color, closeable,
}) => {
  const classes = useStyles()
  if (!isShow || !linkText) {
    return null
  }

  return (
    <div className={combine(classes.bar, color)}>
      {icon && <Icon name={icon} />}
      <span className={classes.summary}>{summary && summary}</span>&nbsp;
      <span className={classes.text}>{text && text}</span>&nbsp;
      { linkText && (
        <Link
          to={linkTo}
          className={linkIsButton
            ? classes.buttonLink
            : classes.link}
        >{linkText}
        </Link>
      )}
    </div>
  )
}

export default connect(state => ({
  ...state.topBar,
}), null)(TopBar)
