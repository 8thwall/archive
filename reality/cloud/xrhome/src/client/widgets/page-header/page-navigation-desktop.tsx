import React from 'react'
import {Link} from 'react-router-dom'

import {createThemedStyles} from '../../ui/theme'
import type {INavigationItem, INavigationLink, INavigationCategory} from './use-site-navigations'
import {bool, combine} from '../../common/styles'
import LinkOut from '../../uiWidgets/link-out'
import {hexColorWithAlpha} from '../../../shared/colors'
import {mobileViewOverride} from '../../static/styles/settings'
import {Icon} from '../../ui/components/icon'
import {PageNavigationGroup} from './page-navigation-group'

const useStyles = createThemedStyles(theme => ({
  rootLinksContainer: {
    display: 'flex',
    position: 'relative',
    gap: '0.5em',
    [mobileViewOverride]: {
      display: 'none',
    },
  },
  singleGroupNavContainer: {
    position: 'relative',
  },
  navCategory: {
    'color': theme.fgMain,
    'cursor': 'pointer',
    'padding': '0.5em 1em',
    'borderRadius': '0.5em',
    'border': 'none',
    'display': 'flex',
    'gap': '0.5em',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'transition': 'background 60ms ease-in-out',
    '&:hover': {
      background: theme.bgMuted,
      boxShadow: `0 1px 2px 0 ${hexColorWithAlpha(theme.fgMain, 0.25)} inset`,
    },
  },
  activeCategory: {
    background: theme.bgMuted,
    boxShadow: `0 1px 2px 0 ${hexColorWithAlpha(theme.fgMain, 0.25)} inset`,
  },
  navLinksWrapper: {
    position: 'absolute',
    top: '100%',
    left: 0,
    minWidth: '100%',
  },
  navLinksContainer: {
    color: theme.fgMain,
    transition: 'opacity 60ms ease-in-out',
    width: '100%',
    marginTop: '0.5em',
    padding: '1.5em',
    background: hexColorWithAlpha(theme.bgMain, 0.1),
    border: `1px solid ${hexColorWithAlpha(theme.fgMain, 0.1)}`,
    borderRadius: '0.5em',
    backdropFilter: 'blur(50px)',
    display: 'flex',
    gap: '1em',
  },
  hideNavLinks: {
    display: 'none',
    height: '0',
  },
  bottomLinkContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  bottomLink: {
    'color': theme.fgMuted,
    'padding': '0.5em',
    'display': 'flex',
    'alignItems': 'center',
    'borderRadius': '7px',
    'fontFamily': 'Geist Mono, monospace',
    'gap': '0.5em',
    'whiteSpace': 'nowrap',
    'alignSelf': 'flex-start',
    '&:hover': {
      background: theme.bgMuted,
      color: theme.fgMain,
    },
  },
}))

const DesktopNavigationLink: React.FC<{navItem: INavigationLink}> = ({navItem}) => {
  const classes = useStyles()

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

interface IDesktopNavigationMenu {
  navItem: INavigationCategory
  isDropdownOpen: boolean
  handleOpenDropdown: () => void
  handleCloseDropdown: () => void
}

const DesktopNavigationMenu: React.FC<IDesktopNavigationMenu> = ({
  navItem, isDropdownOpen, handleOpenDropdown, handleCloseDropdown,
}) => {
  const classes = useStyles()
  const menuRef = React.useRef(null)
  const isSingleGroup = navItem.children.length === 1

  React.useEffect(() => {
    const handleMenuClick = (e: MouseEvent) => {
      if (!menuRef.current.contains(e.target) && isDropdownOpen) {
        handleCloseDropdown()
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleMenuClick)
    } else {
      document.removeEventListener('mousedown', handleMenuClick)
    }

    return () => document.removeEventListener('mousedown', handleMenuClick)
  })

  return (
    <div
      ref={menuRef}
      className={bool(isSingleGroup, classes.singleGroupNavContainer)}
    >
      <button
        type='button'
        className={combine('style-reset', classes.navCategory,
          isDropdownOpen && classes.activeCategory)}
        onClick={isDropdownOpen ? handleCloseDropdown : handleOpenDropdown}
      >
        {navItem.text}
        <Icon stroke='chevronDown' size={0.75} />
      </button>
      <div className={combine(classes.navLinksWrapper, !isDropdownOpen && classes.hideNavLinks)}>
        <div className={classes.navLinksContainer}>
          {navItem?.children?.map((nav, index) => (
            ((index < (navItem.children.length - 1)) || !navItem.bottomLink)
              ? (
                <PageNavigationGroup
                  key={nav.text}
                  navItem={nav}
                />
              )
              : (
                <div
                  key={nav.text}
                  className={classes.bottomLinkContainer}
                >
                  <PageNavigationGroup
                    navItem={nav}
                  />
                  <LinkOut
                    url={navItem?.bottomLink?.url}
                    className={classes.bottomLink}
                  >
                    <Icon stroke='forwardArrow' />
                    {navItem?.bottomLink?.text}
                  </LinkOut>
                </div>
              )))}
        </div>
      </div>
    </div>
  )
}

interface IPageNavigationDesktop {
  navItems: INavigationItem[]
}

const PageNavigationDesktop: React.FC<IPageNavigationDesktop> = ({navItems}) => {
  const classes = useStyles()
  const [activeLink, setActiveLink] = React.useState<INavigationItem>(null)

  return (
    <div
      className={classes.rootLinksContainer}
    >
      {navItems.map(navItem => (navItem?.children
        ? <DesktopNavigationMenu
            key={navItem.text}
            navItem={navItem as INavigationCategory}
            isDropdownOpen={navItem.text === activeLink?.text}
            handleOpenDropdown={() => setActiveLink(navItem)}
            handleCloseDropdown={() => setActiveLink(null)}
        />
        : <DesktopNavigationLink key={navItem.text} navItem={navItem as INavigationLink} />))}
    </div>
  )
}

export {PageNavigationDesktop}
