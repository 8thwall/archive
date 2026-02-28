import React from 'react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {bool, combine} from '../../common/styles'
import {createThemedStyles} from '../../ui/theme'
import {mango, mobileViewOverride} from '../../static/styles/settings'
import {hexColorWithAlpha} from '../../../shared/colors'
import {DevDropdownMenu} from './dev-dropdown-menu'
import {SidebarNavButton} from './sidebar-nav-button'
import {useLoggedInSidebarNavigations, INavigationLink} from '../page-header/use-site-navigations'
import LinkOut from '../../uiWidgets/link-out'
import {useSidebarNavigations} from './use-sidebar-navigations'
import {ProfileDropDownMenu} from './profile-dropdown-menu'

const useStyles = createThemedStyles(theme => ({
  sidebarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 7,
    height: '100vh',
    justifyContent: 'space-between',
    padding: '5em 0 2em ',
    top: 0,
    pointerEvents: 'none',
    [mobileViewOverride]: {
      position: 'static',
      top: '100%',
      width: '100%',
      height: '100%',
      padding: 0,
      pointerEvents: 'auto',
      alignItems: 'stretch',
      overflowY: 'scroll',
    },
  },
  logo: {
    padding: '1.5rem',
    borderLeft: '4px solid transparent',
  },
  devBorder: {
    borderLeft: `4px dashed ${mango} !important`,
  },
  spacer: {
    height: '3em',
    width: '100%',
  },
  mainTrayGroup: {
    position: 'sticky',
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    [mobileViewOverride]: {
      gap: 0,
    },
  },
  buttonTray: {
    background: theme.bgMuted,
    border: `1px solid ${hexColorWithAlpha(theme.fgMain, 0.05)}`,
    padding: '0.625em 0',
    borderRadius: '7px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.825em',
    pointerEvents: 'auto',
    alignItems: 'center',
    [mobileViewOverride]: {
      'borderRadius': 0,
      'borderWidth': '0 0 1px 0',
      'borderColor': hexColorWithAlpha(theme.fgMain, 0.2),
      'background': 'none',
      'padding': '1em 0',
      'alignItems': 'stretch',
      '&:last-child': {
        border: 'none',
      },
    },
  },
  hide: {
    [mobileViewOverride]: {
      display: 'none',
    },
  },
}))

interface ISideBar {
  showNav: boolean
}

const LoggedInSideBar: React.FC<ISideBar> = ({showNav}) => {
  const {t} = useTranslation(['account-pages', 'navigation'])
  const classes = useStyles()
  const links = useLoggedInSidebarNavigations()
  const sideNavItems = useSidebarNavigations()

  return (
    <div
      className={combine(
        classes.sidebarContainer,
        bool(!showNav, classes.hide)
      )}
    >
      <div className={classes.mainTrayGroup}>
        <div className={combine(classes.buttonTray, bool(BuildIf.LOCAL_DEV, classes.devBorder))}>
          {sideNavItems?.map(navItem => (
            <Link to={navItem.url} key={navItem.text} a8={navItem?.a8}>
              <SidebarNavButton
                text={navItem.text}
                iconStroke={navItem.iconStroke}
                disabled={navItem?.isDisabled}
              />
            </Link>
          ))}
        </div>
        <div className={combine(classes.buttonTray, bool(BuildIf.LOCAL_DEV, classes.devBorder))}>
          {links.map((link: INavigationLink) => (
            link?.isExternal
              ? (
                <LinkOut key={link.text} url={link?.url} a8={link?.a8}>
                  <SidebarNavButton
                    text={link.text}
                    iconStroke={link?.iconStroke}
                    isExternal
                  />
                </LinkOut>
              )
              : (
                <Link key={link.text} to={link?.url} a8={link?.a8}>
                  <SidebarNavButton
                    text={link.text}
                    iconStroke={link?.iconStroke}
                  />
                </Link>
              )
          ))}
        </div>
      </div>
      <div className={combine(classes.buttonTray, bool(BuildIf.LOCAL_DEV, classes.devBorder))}>
        {/* TODO(kim): Fix to remove provider when adding button functionality */}
        <div className={classes.hide}>
          <SidebarNavButton
            text={t('my_projects_page.account_config.resource_center')}
            iconStroke='questionMark'
            disabled
          />
        </div>
        {BuildIf.ALL_QA &&
          <DevDropdownMenu
            trigger={(
              <SidebarNavButton
                iconStroke='beaker'
                  // eslint-disable-next-line local-rules/hardcoded-copy
                text='Dev Options'
              />
            )}
            placement='bottom-start'
          />
          }
        <ProfileDropDownMenu size={32} />
      </div>
    </div>
  )
}

export {LoggedInSideBar}
