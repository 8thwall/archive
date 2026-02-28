import React from 'react'
import {
  FloatingPortal, useFloating, offset, shift, flip,
  useClick, useDismiss, useRole, useInteractions, Placement,
} from '@floating-ui/react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'

import useActions from '../../common/use-actions'
import {createThemedStyles} from '../../ui/theme'
import {useCurrentUser, useUserHasSession} from '../../user/use-current-user'
import {hexColorWithAlpha} from '../../../shared/colors'
import {combine} from '../../common/styles'
import {LoggedInProfileIcon} from '../logged-in-profile-icon'
import userActions from '../../user/user-actions'
import {getPathForProfilePage} from '../../common/paths'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'
import {mobileViewOverride} from '../../static/styles/settings'
import {useMobileNavStyles} from '../page-header/page-navigation-mobile'

const useStyles = createThemedStyles(theme => ({
  menuContainer: {
    fontFamily: theme.subHeadingFontFamily,
    position: 'absolute',
    color: theme.fgMain,
    background: hexColorWithAlpha(theme.bgMain, 0.5),
    border: `1px solid ${hexColorWithAlpha(theme.fgMain, 0.1)}`,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(20px)',
    zIndex: 10,
    overflow: 'hidden',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.75)',
  },
  userInfoContainer: {
    padding: '0.5em 1em',
    color: theme.fgMuted,
    [mobileViewOverride]: {
      padding: 0,
    },
  },
  mobileUserInfoContainer: {
    fontFamily: theme.subHeadingFontFamily,
    display: 'flex',
    gap: '0.5em',
    alignItems: 'center',
    padding: '0 0.75em',
  },
  button: {
    'padding': '0.5em 1em',
    'cursor': 'pointer',
    'color': theme.fgMain,
    '&:hover': {
      color: theme.fgMain,
      background: theme.bgMuted,
    },
  },
  profileIcon: {
    'position': 'relative',
    'borderRadius': '8px',
    'border': `1px solid ${hexColorWithAlpha(theme.fgMain, 0.5)}`,
    'overflow': 'hidden',
    'cursor': 'pointer',
    '&:hover': {
      '&::after': {
        content: '""',
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: theme.bgMain,
        opacity: '20%',
      },
    },
  },
  mobileMenuContainer: {
    display: 'none',
    padding: '1.5em 0 0',
    flexDirection: 'column',
    borderTop: `1px solid ${hexColorWithAlpha(theme.fgMain, 0.5)}`,
    [mobileViewOverride]: {
      display: 'flex',
    },
  },
  dropdown: {
    [mobileViewOverride]: {
      display: 'none',
    },
  },
}))

const useProfileIconStyles = createCustomUseStyles<{size: number}>()(() => ({
  profileIcon: {
    height: props => `${props.size}px`,
    width: props => `${props.size}px`,
  },
}))

interface IProfileDropDownMenu {
  placement?: Placement
  size?: number
}

const ProfileDropDownMenu: React.FC<IProfileDropDownMenu> = ({
  placement = 'bottom-start', size,
}) => {
  const classes = useStyles()
  const mobileNavClasses = useMobileNavStyles()
  const profileIconClasses = useProfileIconStyles({size})
  const {t} = useTranslation('navigation')
  const {signOut} = useActions(userActions)

  /* eslint-disable camelcase */
  const {given_name, family_name, email, loggedInUser} = useCurrentUser()
  const userGivenName = loggedInUser?.givenName || given_name
  const userFamilyName = loggedInUser?.familyName || family_name
  const userEmail = loggedInUser?.primaryContactEmail || email
  /* eslint-enable camelcase */

  const isLoggedIn = useUserHasSession()

  const [popupOpen, setPopupOpen] = React.useState(false)
  const {refs, floatingStyles, context} = useFloating({
    open: popupOpen,
    onOpenChange: setPopupOpen,
    placement,
    middleware: [
      offset({
        crossAxis: 14,
        mainAxis: 7,
      }),
      shift(),
      flip(),
    ],
  })
  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const {getReferenceProps, getFloatingProps} = useInteractions([
    click,
    dismiss,
    role,
  ])

  if (!isLoggedIn) {
    return null
  }

  const userInfo = (
    <div className={classes.userInfoContainer}>
      <div className='truncate'>{userGivenName} {userFamilyName}</div>
      <div className='truncate'>{userEmail}</div>
    </div>
  )

  const userMenu = (
    <div
      ref={refs.setFloating}
      className={classes.menuContainer}
      style={{...floatingStyles}}
      {...getFloatingProps()}
    >
      {userInfo}
      <Link
        to={getPathForProfilePage()}
        className={classes.button}
      >
        {t('profile_dropdown.link.profile')}
      </Link>
      <button
        type='button'
        className={combine('style-reset', classes.button)}
        onClick={() => signOut()}
      >
        {t('profile_dropdown.link.logout')}
      </button>
    </div>
  )

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={combine(classes.profileIcon, profileIconClasses.profileIcon, classes.dropdown)}
      >
        <LoggedInProfileIcon size={size} />
      </div>
      <FloatingPortal>
        {popupOpen && userMenu}
      </FloatingPortal>
      <div className={classes.mobileMenuContainer}>
        <div className={classes.mobileUserInfoContainer}>
          <div className={combine(classes.profileIcon, profileIconClasses.profileIcon)}>
            <LoggedInProfileIcon size={size} />
          </div>
          {userInfo}
        </div>
        <Link
          to={getPathForProfilePage()}
          className={mobileNavClasses.navCategory}
        >
          {t('profile_dropdown.link.profile')}
        </Link>
        <button
          type='button'
          className={combine('style-reset', mobileNavClasses.navCategory)}
          onClick={() => signOut()}
        >
          {t('profile_dropdown.link.logout')}
        </button>
      </div>
    </>
  )
}

export {ProfileDropDownMenu}
