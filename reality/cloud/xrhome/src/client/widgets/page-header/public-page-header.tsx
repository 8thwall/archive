import React from 'react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {SignUpPathEnum, getPathForSignUp} from '../../common/paths'
import NavLogo from './page-navigation-logo'
import {useHeaderStyles} from './use-header-styles'
import {PrimaryButton} from '../../ui/components/primary-button'
import {Icon} from '../../ui/components/icon'
import {SecondaryButton} from '../../ui/components/secondary-button'
import {combine} from '../../common/styles'
import {usePublicPageHeaderNavigations} from './use-site-navigations'
import {PageNavigationMobile} from './page-navigation-mobile'
import {PageNavigationDesktop} from './page-navigation-desktop'
import {useUserHasSession} from '../../user/use-current-user'
import {DevDropdownMenu} from '../page-sidebar/dev-dropdown-menu'
import {ProfileDropDownMenu} from '../page-sidebar/profile-dropdown-menu'

const PublicPageHeader = () => {
  const {t} = useTranslation(['navigation'])
  const [showNav, setShowNav] = React.useState(false)
  const headerClasses = useHeaderStyles()
  const navItems = usePublicPageHeaderNavigations()
  const isLoggedIn = useUserHasSession()

  return (
    <header className={combine(headerClasses.header, !showNav && headerClasses.hideLinks)}>
      <div className={headerClasses.headerContainer}>
        <div className={headerClasses.logoButtonGroup}>
          <NavLogo className={headerClasses.logoSquare} />
          <div
            className={headerClasses.hamburgerButton}
          >
            <SecondaryButton onClick={() => setShowNav(!showNav)}>
              <Icon stroke='hamburgerMenu' color='main' />
            </SecondaryButton>
          </div>
        </div>
        <PageNavigationDesktop navItems={navItems} />
        <div className={combine(headerClasses.linksGroup,
          isLoggedIn && headerClasses.loggedInLinksGroup)}
        >
          <PageNavigationMobile navItems={navItems} />
          <div className={combine(headerClasses.buttonGroup,
            isLoggedIn && headerClasses.publicMobileButtonGroup)}
          >
            {!isLoggedIn &&
              <>
                <Link
                  className={headerClasses.button}
                  to='/login'
                >
                  <SecondaryButton spacing='full'>
                    {t('logged_out_page_header.link.login')}
                  </SecondaryButton>
                </Link>
                <Link
                  className={headerClasses.button}
                  to={getPathForSignUp(SignUpPathEnum.step1Register)}
                >
                  <PrimaryButton spacing='full'>
                    <Icon stroke='forwardArrow' inline />
                    {t('logged_out_page_header.link.get_started')}
                  </PrimaryButton>
                </Link>
              </>
            }
            {isLoggedIn &&
              <>
                {BuildIf.ALL_QA &&
                  <div className={headerClasses.button}>
                    <DevDropdownMenu
                      placement='bottom'
                      trigger={(
                        <SecondaryButton spacing='full'>
                          {/* eslint-disable-next-line local-rules/hardcoded-copy */}
                          <Icon inline stroke='beaker' />
                          Dev Options
                        </SecondaryButton>
                      )}
                    />
                  </div>
                }
                <ProfileDropDownMenu placement='bottom' size={40} />
              </>
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export {PublicPageHeader}
