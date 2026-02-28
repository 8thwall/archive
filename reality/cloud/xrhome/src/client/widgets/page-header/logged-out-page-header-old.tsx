import React from 'react'
import {Button} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {createUseStyles, useTheme} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {SignUpPathEnum, getPathForSignUp} from '../../common/paths'
import useActions from '../../common/use-actions'
import userActions from '../../user/user-actions'
import NavLogo from '../nav-logo'
import {SiteNavigations} from '../site-navigations'
import LoggedOutDropdown from '../logged-out-dropdown'
import {combine, bool} from '../../common/styles'
import useSharedHeaderStyles from './use-shared-header-styles'
import {brandPurple, brandWhite, mobileViewOverride} from '../../static/styles/settings'
import {PageHeaderTheme, PageHeaderThemeProvider} from './page-header-theme-provider'

const SCROLL_THRESHOLD = 50
// slightly bigger than half of the height diff before/after shrinking
// (100px - 72px) / 2 = 14px
// TODO(wayne): find a more promising way for setting the tolerance
// And refine this when revisiting on the spacing of this logged-out header
const SCROLL_TOLERANCE = 15

const useStyles = createUseStyles((theme: PageHeaderTheme) => ({
  loginLink: {
    color: theme.loginLink,
  },
  loginLinkPurple: {
    color: brandPurple,
  },
  shrinkImage: {
    '& a > img': {
      height: '2.85rem',
      padding: '0',
      [mobileViewOverride]: {
        height: '2em',
      },
    },
  },
  shrink: {
    '& img': {
      height: '2.3rem',
      transition: 'height 400ms ease-out',
    },
  },
  shrinkHeader: {
    'padding': '16px 32px 16px 48px',
    'boxShadow': '0 5px 10px 0 #66666633',
    [mobileViewOverride]: {
      'padding': '1.35rem 2rem',
    },
  },
  noMarginRight: {
    marginRight: 0,
  },
  public: {
    'backgroundColor': brandWhite,
    'position': 'sticky',
    'top': 0,
    'left': 0,
    'right': 0,
    'zIndex': 11,
  },
  item: {
    margin: 'auto',
    flex: '1 1 auto',
    textAlign: 'center !important',
  },
  navbarDrop: {
    '& .ui.dropdown .menu > .item': {
      padding: '8px 24px !important',
    },
  },
  whiteBkg: {
    backgroundColor: brandWhite,
  },
}))

const LoggedOutPageHeaderOld = () => {
  const {t} = useTranslation(['navigation'])
  const [isScrolled, setIsScrolled] = React.useState(false)
  const theme = useTheme<PageHeaderTheme>()
  const {setShowNav} = useActions(userActions)
  const classes = useStyles()
  const sharedClasses = useSharedHeaderStyles()

  const siteNavStyle = combine(sharedClasses.siteNav, sharedClasses.hideOnMobileDisplay,
    classes.navbarDrop)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((oldIsScrolled) => {
        if (!oldIsScrolled && window.scrollY >= SCROLL_THRESHOLD + SCROLL_TOLERANCE) {
          return true
        } else if (oldIsScrolled && window.scrollY <= SCROLL_THRESHOLD - SCROLL_TOLERANCE) {
          return false
        }
        return oldIsScrolled
      })
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className={classes.public}>
      <div className={
        combine(sharedClasses.pageHeader,
          bool(isScrolled, classes.shrinkHeader),
          bool(isScrolled, classes.whiteBkg))}
      >
        <div className={combine(sharedClasses.left, bool(isScrolled, classes.shrinkImage))}>
          <NavLogo size='wide' color={isScrolled ? 'purple' : theme?.navLogo} />
          <Button
            className={sharedClasses.hamburgerButton}
            icon='bars'
            type='button'
            onClick={() => setShowNav(true)}
          />
        </div>
        <div className={sharedClasses.right}>
          <div className={combine(siteNavStyle, classes.noMarginRight)}>
            <PageHeaderThemeProvider mode={isScrolled ? 'light' : theme?.name}>
              <SiteNavigations />
            </PageHeaderThemeProvider>
            <div className={classes.item}>
              <Link
                to={getPathForSignUp(SignUpPathEnum.step1Register)}
                className={combine(
                  sharedClasses.getStartedButton,
                  bool(
                    !isScrolled && !(theme?.name === 'light'),
                    sharedClasses.getStartedButtonWhite
                  )
                )}
              >
                {t('logged_out_page_header.link.get_started')}
              </Link>
            </div>
            <div className={classes.item}>
              <Link
                to='/login'
                className={isScrolled ? classes.loginLinkPurple : classes.loginLink}
              >
                {t('logged_out_page_header.link.login')}
              </Link>
            </div>
          </div>
          <LoggedOutDropdown isScrolled={isScrolled} />
        </div>
      </div>
    </header>
  )
}

export default LoggedOutPageHeaderOld
