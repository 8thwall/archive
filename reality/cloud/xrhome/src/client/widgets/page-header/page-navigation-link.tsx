import React from 'react'
import {Link} from 'react-router-dom'

import {createThemedStyles} from '../../ui/theme'
import type {INavigationLink} from './use-site-navigations'
import LinkOut from '../../uiWidgets/link-out'
import {mobileViewOverride} from '../../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  navLinkContainer: {
    'display': 'flex',
    'flexDirection': 'column',
    'padding': '0.625em',
    'borderRadius': '7px',
    '&:hover': {
      background: theme.bgMuted,
    },
  },
  navLinkIcon: {
    border: `1px solid ${theme.fgMain}`,
    padding: '0.5em',
    borderRadius: '7px',
  },
  navText: {
    fontFamily: 'Geist Mono, monospace',
    color: theme.fgMain,
    whiteSpace: 'nowrap',
  },
  navDescription: {
    color: theme.fgMuted,
    fontSize: '0.825em',
    whiteSpace: 'nowrap',
    [mobileViewOverride]: {
      display: 'none',
    },
  },
}))

interface IPageNavigationLink {
  navItem: INavigationLink
}

const PageNavigationLink: React.FC<IPageNavigationLink> = ({navItem}) => {
  const classes = useStyles()

  const navLink = (
    <div className={classes.navLinkContainer}>
      <div className={classes.navText}>{navItem.text}</div>
      {navItem?.description &&
        <div className={classes.navDescription}>{navItem.description}</div>}
    </div>
  )

  if (navItem.isExternal) {
    return navItem.isLinkOut
      ? <LinkOut url={navItem.url}>{navLink}</LinkOut>
      : <a href={navItem.url}>{navLink}</a>
  } else {
    return <Link to={navItem.url}>{navLink}</Link>
  }
}

export {PageNavigationLink}
