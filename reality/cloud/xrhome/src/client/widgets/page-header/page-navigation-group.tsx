import React from 'react'

import {createThemedStyles} from '../../ui/theme'
import type {INavigationGroup} from './use-site-navigations'
import {PageNavigationLink} from './page-navigation-link'
import {mobileViewOverride} from '../../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  navGroupContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '0.5em',
  },
  navGroupLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 0.5em',
    gap: '1em',
    color: theme.fgMuted,
    fontFamily: theme.subHeadingFontFamily,
    [mobileViewOverride]: {
      display: 'none',
    },
  },
  navGroupTextGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25em',
  },
  navGroupHeading: {
    fontFamily: '',
    fontSize: '1.25em',
    fontWeight: 500,
  },
  navGroupLinkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
    [mobileViewOverride]: {
      gap: '0',
    },
  },
}))

interface IPageNavigationGroup {
  navItem: INavigationGroup
}

const PageNavigationGroup: React.FC<IPageNavigationGroup> = ({
  navItem,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.navGroupContainer}>
      {!navItem.hideCategory &&
        <div className={classes.navGroupLabel}>
          {navItem.text}
        </div>
      }
      <div className={classes.navGroupLinkList}>
        {navItem.children.map(navLink => (
          <PageNavigationLink
            key={navLink.text}
            navItem={navLink}
          />
        ))}
      </div>
    </div>
  )
}

export {PageNavigationGroup}
