import React from 'react'
import {Link} from 'react-router-dom'

import {createThemedStyles} from '../../ui/theme'
import type {
  INavigationItem, INavigationLink, INavigationCategory,
} from './use-site-navigations'
import {combine} from '../../common/styles'
import LinkOut from '../../uiWidgets/link-out'
import {hexColorWithAlpha} from '../../../shared/colors'
import {Icon} from '../../ui/components/icon'
import {mobileViewOverride} from '../../static/styles/settings'
import {PageNavigationGroup} from './page-navigation-group'

const useMobileNavStyles = createThemedStyles(theme => ({
  dropdownLinksContainer: {
    display: 'none',
    [mobileViewOverride]: {
      display: 'flex',
      gap: '0.5em',
      flexDirection: 'column',
      padding: '0.75em',
    },
  },
  rootNavContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
  },
  activeDropdown: {
    background: theme.bgMuted,
    boxShadow: `0 1px 2px 0 ${hexColorWithAlpha(theme.fgMain, 0.25)} inset`,
  },
  navCategory: {
    color: theme.fgMain,
    fontFamily: theme.bodyFontFamily,
    padding: '0.75em',
    borderRadius: '0.5em',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLinksList: {
    color: theme.fgMain,
    background: hexColorWithAlpha(theme.fgMain, 0.1),
    border: `1px solid ${hexColorWithAlpha(theme.fgMain, 0.1)}`,
    backdropFilter: 'blur(50px)',
    padding: '0.5em',
    borderRadius: '0.5em',
  },
  hideNavLinksList: {
    display: 'none',
  },
}))

const MobileNavigationLink: React.FC<{navItem: INavigationLink}> = ({navItem}) => {
  const classes = useMobileNavStyles()

  const navLink = (
    <div className={classes.navCategory}>
      {navItem.text}
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

const MobileNavigationCategory: React.FC<{navItem: INavigationCategory}> = ({navItem}) => {
  const classes = useMobileNavStyles()
  const [showNavItems, setShowNavItems] = React.useState(false)

  return (
    <div className={classes.rootNavContainer}>
      <button
        type='button'
        onClick={() => setShowNavItems(!showNavItems)}
        className={combine('style-reset', classes.navCategory,
          showNavItems && classes.activeDropdown)}
      >
        {navItem.text}
        <Icon stroke='chevronDown' size={0.75} />
      </button>
      <div className={combine(classes.navLinksList, !showNavItems && classes.hideNavLinksList)}>
        {navItem.children?.map(nav => (
          <PageNavigationGroup key={nav.text} navItem={nav} />
        ))}
      </div>
    </div>
  )
}

interface IPageNavigationMobile {
  navItems: INavigationItem[]
}

const PageNavigationMobile: React.FC<IPageNavigationMobile> = ({navItems}) => {
  const classes = useMobileNavStyles()

  return (
    <div className={classes.dropdownLinksContainer}>
      {navItems.map(navItem => (navItem?.children
        ? <MobileNavigationCategory key={navItem.text} navItem={navItem as INavigationCategory} />
        : <MobileNavigationLink key={navItem.text} navItem={navItem as INavigationLink} />))}
    </div>
  )
}

export {PageNavigationMobile, useMobileNavStyles}
