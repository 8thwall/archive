import * as React from 'react'
import {createUseStyles, useTheme} from 'react-jss'
import {Dropdown} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {brandPurple, brandWhite, gray2, gray4, mobileViewOverride} from '../static/styles/settings'
import {SiteNavigations} from './site-navigations'
import {getPathForSignUp, SignUpPathEnum} from '../common/paths'
import icons from '../apps/icons'
import {combine} from '../common/styles'
import type {PageHeaderTheme} from './page-header/page-header-theme-provider'

const useStyles = createUseStyles({
  loggedOutDropdown: {
    'display': 'none !important',
    'width': '56px',
    'height': '40px',
    'padding': '0.25em 0.75em !important',
    'borderRadius': '0.25em !important',
    'border': '1px solid transparent !important',
    'borderColor': `${gray2} !important`,
    'justifyContent': 'center',
    'marginRight': '0 !important',
    [mobileViewOverride]: {
      'display': 'flex !important',
    },
    '& > i': {
      width: '25px !important',
      height: '25px !important',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      color: gray4,
      margin: 'auto !important',
    },
    '&.dropdown .left.menu': {
      'width': '100vw',
      'top': 'calc(100% + 1em)',
      'right': '-2.1em !important',
      'padding': '0.5rem 0 !important',
      '& .item': {
        'textAlign': 'center',
        'verticalAlign': 'middle',
        'fontSize': 'calc(1rem / 3 * 4)',
        'fontWeight': '700',
        'paddingTop': '1rem !important',
        'paddingBottom': '1rem !important',
        '& > img': {
          verticalAlign: 'middle',
          height: '1em',
          margin: '0',
          padding: '0em 0.5em',
        },
      },
      '& .menu': {
        'left': '50% !important',
        'top': '100% !important',
        'transform': 'translateX(-50%)',
        'minWidth': 'fit-content',
        'width': 'fit-content',
        'margin': '0',
        '& .item': {
          fontWeight: '400',
        },
      },
    },
  },
  transparentBkg: {
    'backgroundColor': 'rgba(255, 255, 255, 0.25) !important',
    '& > i:before': {
      content: `url(${icons.navbarTogglerLight}) !important`,
      transform: 'translate(5px, 5px)',
    },
    'border': 'none !important',
  },
  lightBkg: {
    'backgroundColor': `${brandWhite} !important`,
    '& > i:before': {
      content: `url(${icons.navbarToggler}) !important`,
      transform: 'translate(5px, 5px)',
    },
    'border': '1px solid transparent !important',
    'borderColor': `${gray2} !important`,
  },
  ctaButton: {
    textAlign: 'center',
    verticalAlign: 'middle',
    fontSize: 'calc(1rem / 3 * 4)',
    fontWeight: '700',
    lineHeight: '1.5',
    color: brandWhite,
    backgroundColor: brandPurple,
    padding: 'calc(1rem / 2) calc(1rem / 3 * 8)',
    borderRadius: '8px',
  },
  logInLink: {
    display: 'block',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontSize: 'calc(1rem / 3 * 4)',
    fontWeight: '700',
    color: brandPurple,
    paddingTop: '1rem !important',
    paddingBottom: '1rem !important',
  },
})

const LoggedOutDropdown = ({isScrolled = false}) => {
  const {t} = useTranslation(['navigation'])
  const styles = useStyles()
  const theme = useTheme<PageHeaderTheme>()
  const dropdownClassName = combine(
    styles.loggedOutDropdown,
    theme?.name === 'transparent' && !isScrolled ? styles.transparentBkg : styles.lightBkg
  )

  return (
    <Dropdown
      button
      className={dropdownClassName}
      icon='bars'
      direction='left'
    >
      <Dropdown.Menu>
        <SiteNavigations />
        <Dropdown.Item>
          <Link
            to={getPathForSignUp(SignUpPathEnum.step1Register)}
            className={styles.ctaButton}
          >
            {t('logged_out_page_header.link.get_started')}
          </Link>
        </Dropdown.Item>
        <Link to='/login' className={styles.logInLink}>
          {t('logged_out_page_header.link.login')}
        </Link>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default LoggedOutDropdown
