import React from 'react'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import logoPurpleSrc from '../../../img/8th-Wall-Horizontal-Logo-Purple.svg'
import logoWhiteSrc from '../../../img/8th-Wall-Horizontal-Logo-White.svg'
import {combine, bool} from '../../styles/classname-utils'
import * as classes from './header.module.scss'
import {useUserContext, IUserContext} from '../../common/user-context'
import LoggedInNavbar from './logged-in-navbar'
import LoggedOutNavbar from './logged-out-navbar'

const SCROLL_THRESHOLD = 50
// slightly bigger than half of the height diff before/after shrinking
// (100px - 72px) / 2 = 14px
// TODO(wayne): find a more promising way for setting the tolerance
const SCROLL_TOLERANCE = 15

const Header = ({isHomePage = false}) => {
  const {t} = useTranslation(['navigation'])
  const {currentUser}: IUserContext = useUserContext()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [collapseExpanded, setCollapseExpanded] = React.useState(false)

  React.useEffect(() => {
    const scrollListener = window.addEventListener('scroll', () => {
      setIsScrolled((oldIsScrolled) => {
        if (!oldIsScrolled && window.scrollY >= SCROLL_THRESHOLD + SCROLL_TOLERANCE) {
          return true
        } else if (oldIsScrolled && window.scrollY <= SCROLL_THRESHOLD - SCROLL_TOLERANCE) {
          return false
        }

        return oldIsScrolled
      })
    })
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  const onNavbarToggle = (e) => {
    const expanded = e.target.getAttribute('aria-expanded') === 'true'
    setCollapseExpanded(expanded)
  }

  const isHomePageStyling = isHomePage && !isScrolled && !collapseExpanded

  return (
    <nav
      className={combine(
        classes.customNav,
        'navbar sticky-top navbar-expand-xl bg-white navbar-light',
        bool(isScrolled, 'navbar-shrink shadow'),
        bool(isHomePageStyling, combine(classes.homePageNav, 'navbar-dark'))
      )}
      style={{
        zIndex: 11,
        ...(isHomePage && collapseExpanded ? {marginBottom: '100px'} : null),
      }}
    >
      <div className='col-3 col-xl-3 navbar-brand-container'>
        <a
          className='navbar-brand'
          href='/'
          a8='click;navigation;go-to-home'
        >
          <img
            className={combine(
              'logo float-left',
              classes.logo
            )}
            src={isHomePageStyling ? logoWhiteSrc : logoPurpleSrc}
            alt='8th Wall Logo'
          />
        </a>
      </div>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarNav'
        aria-controls='navbarNav'
        aria-expanded='false'
        aria-label='Toggle navigation'
        onClick={onNavbarToggle}
      >
        <span className='navbar-toggler-icon' />
      </button>

      <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav nav-fill w-100 mt-3 mt-lg-0'>
          {currentUser ? <LoggedInNavbar /> : <LoggedOutNavbar />}
        </ul>
      </div>
    </nav>
  )
}

export default Header
