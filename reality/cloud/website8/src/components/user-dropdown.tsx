import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import {bool, combine} from '../styles/classname-utils'
import * as headerStyles from './layouts/header.module.scss'
import ProfileIcon from './profile-icon'
import {MOBILE_VIEW_OVERRIDE} from '../styles/constants'
import {UserAttributes} from '../common/user-config'

const useStyles = createUseStyles({
  dropdown: {
    'minWidth': '11em',
    'position': 'relative',
    '&:hover': {
      cursor: 'pointer',
    },
    '& .show': {
      display: 'block !important',
    },
    '& .dropdown-menu': {
      top: '2em !important',
    },
  },
  profileContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    [MOBILE_VIEW_OVERRIDE]: {
      margin: 0,
    },
  },
  profileIcon: {
    height: '2.25em',
    width: '2.25em',
    overflow: 'hidden',
    borderRadius: '50%',
    marginRight: '0.5em',
    [MOBILE_VIEW_OVERRIDE]: {
      margin: 0,
    },
  },
  profileName: {
    display: 'inline',
    marginRight: '10px',
    pointerEvents: 'none',
  },
})

interface IUserDropdown {
  user: UserAttributes
  signOut: Function
}

const UserDropdown: React.FunctionComponent<IUserDropdown> = ({user, signOut}) => {
  const {t} = useTranslation(['navigation'])
  const classes = useStyles()
  const dropdownRef = React.useRef(null)
  const [show, setShow] = React.useState(false)

  const toggleDropdown = () => {
    setShow(!show)
  }

  React.useEffect(() => {
    const listener = (event) => {
      if (dropdownRef !== null && !event.target.contains(dropdownRef.current)) {
        toggleDropdown()
      }
    }
    if (show) {
      document.addEventListener('click', listener)
    }
    return () => {
      document.removeEventListener('click', listener)
    }
  }, [show])

  if (!user) {
    return null
  }

  return (
    <span className={classes.dropdown}>
      <span
        role='button'
        onClick={toggleDropdown}
        onKeyDown={toggleDropdown}
        tabIndex={0}
        className={classes.profileContainer}
      >
        <div className={classes.profileIcon}>
          <ProfileIcon user={user} size={36} />
        </div>
        <div className={classes.profileName}>
          {user.givenName}&nbsp;{user.familyName}
        </div> <i aria-hidden='true' className='fas fa-caret-down' />
      </span>
      <ul
        ref={dropdownRef}
        className={combine(
          bool(show, 'show'),
          'dropdown-menu',
          'justify-content-center',
          headerStyles.dropdownMenuContent
        )}
        aria-labelledby='dropMenu'
      >
        <a
          className={combine(headerStyles.dropdownItem, 'dropdown-item')}
          href='/workspaces'
        ><li className='menu-item'>{t('user_dropdown.link.workspaces')}</li>
        </a>
        <a
          className={combine(headerStyles.dropdownItem, 'dropdown-item')}
          href='/profile'
        ><li className='menu-item'>{t('user_dropdown.link.profile')}</li>
        </a>
        <button
          className={combine(headerStyles.dropdownItem, 'dropdown-item')}
          type='button'
          onClick={() => signOut()}
        ><li className='menu-item sign-out'>{t('user_dropdown.link.sign_out')}</li>
        </button>
      </ul>
    </span>
  )
}

export default UserDropdown
