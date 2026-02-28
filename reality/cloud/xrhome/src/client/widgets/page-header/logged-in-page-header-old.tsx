import React from 'react'
import {Button} from 'semantic-ui-react'
import {createUseStyles, useTheme} from 'react-jss'

import ProfileDropdown from '../profile-dropdown'
import userActions from '../../user/user-actions'
import useActions from '../../common/use-actions'
import NavLogo from '../nav-logo'
import {SiteNavigations} from '../site-navigations'
import useSharedHeaderStyles from './use-shared-header-styles'
import {combine} from '../../common/styles'
import type {ThemeProps} from './page-header-theme-provider'

const useStyles = createUseStyles({
  navbarDrop: {
    '& .ui.dropdown .menu > .item': {
      padding: '8px 24px !important',
    },
  },
})

const LoggedInPageHeaderOld = () => {
  const {setShowNav} = useActions(userActions)
  const classes = useStyles()
  const sharedClasses = useSharedHeaderStyles()
  const theme: Record<ThemeProps, any> = useTheme()
  const siteNavStyle = combine(sharedClasses.siteNav, sharedClasses.hideOnMobileDisplay,
    classes.navbarDrop)

  return (
    <header className={sharedClasses.pageHeader}>
      <div className={sharedClasses.left}>
        <NavLogo size='wide' color={theme.navLogo} />
        <Button
          className={sharedClasses.hamburgerButton}
          icon='bars'
          type='button'
          onClick={() => setShowNav(true)}
        />
      </div>
      <div className={sharedClasses.right}>
        <div className={siteNavStyle}>
          <SiteNavigations />
        </div>
        <ProfileDropdown />
      </div>
    </header>
  )
}

export default LoggedInPageHeaderOld
