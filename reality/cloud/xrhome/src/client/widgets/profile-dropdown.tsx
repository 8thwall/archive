import * as React from 'react'
import {Dropdown} from 'semantic-ui-react'
import * as jsonwebtoken from 'jsonwebtoken'
import {Link} from 'react-router-dom'
import format from 'date-fns/format'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'

import userActions from '../user/user-actions'
import userSessionActions from '../user/user-session-actions'
import {SiteNavigations} from './site-navigations'
import {getPathForWorkspacesPage, getPathForProfilePage, getPathForAccount} from '../common/paths'
import ProfileDropdownTrigger from './profile-dropdown-trigger'
import type {PageHeaderTheme} from './page-header/page-header-theme-provider'
import {useSelector} from '../hooks'
import useActions from '../common/use-actions'
import {useCurrentUser, useUserHasSession} from '../user/use-current-user'
import {combine} from '../common/styles'

const getDebugJwtMessage = (jwt: string) => {
  const decoded = jsonwebtoken.decode(jwt)
  if (typeof decoded === 'string') {
    return '<invalid>'
  }
  // eslint-disable-next-line local-rules/hardcoded-copy
  return `jwt expires on ${format(decoded.exp * 1000, 'MM/dd/yy h:m:s')}`
}

const useStyles = createUseStyles((theme: PageHeaderTheme) => ({
  textColor: {
    color: theme.navText,
  },
  profileDropdownMenu: {
    zIndex: '1000 !important',
  },
  profileDropdownContainer: {
    display: 'flex !important',
    alignItems: 'center',
  },
}))

const ProfileDropdown: React.FC = () => {
  const {t} = useTranslation(['navigation'])
  const classes = useStyles()

  // TODO(Brandon): Once we've fully committed to using the new identity data, remove cognito
  // user info (given_name/family_name/email) and use loggedInUser.
  /* eslint-disable camelcase */
  const {confirmed, jwt, given_name, family_name, email, loggedInUser} = useCurrentUser()
  const userGivenName = loggedInUser?.givenName || given_name
  const userFamilyName = loggedInUser?.familyName || family_name
  const userEmail = loggedInUser?.primaryContactEmail || email
  /* eslint-enable camelcase */

  const accounts = useSelector(s => s.accounts.allAccounts)
  const isSmallScreen = useSelector(s => s.common.isSmallScreen)
  const isLoggedIn = useUserHasSession()

  const {signOut} = useActions(userActions)
  const dispatch = useDispatch()
  const {refreshJwt} = useActions(userSessionActions)

  const clearToS = () => {
    dispatch({type: 'SHOW_TOS', showToS: true})
  }

  if (!isLoggedIn) {
    return null
  }

  const trigger = (
    <ProfileDropdownTrigger
      givenName={userGivenName}
      familyName={userFamilyName}
    />
  )

  const sortedAccounts = accounts.slice(0).sort(
    (a1, a2) => a1.name.localeCompare(a2.name)
  )

  return (
    <Dropdown
      // Note(Brandon): For internal weekly QA automated tests.
      id='profileDropdown'
      trigger={trigger}
      direction='left'
      className={combine(
        classes.textColor, 'item', 'profile-dropdown', isSmallScreen && 'small-screen',
        classes.profileDropdownContainer
      )}
    >
      <Dropdown.Menu className={classes.profileDropdownMenu}>
        <Dropdown.Item disabled>
          <div className='truncate'>{userGivenName} {userFamilyName}</div>
          <div className='truncate'>{userEmail}</div>
        </Dropdown.Item>
        {isSmallScreen &&
          <>
            <SiteNavigations />
            <Dropdown.Divider />
          </>
        }
        {confirmed &&
          <>
            <Dropdown.Item as={Link} to={getPathForWorkspacesPage()}>
              {t('profile_dropdown.link.manage_workspaces')}
            </Dropdown.Item>
            {sortedAccounts.map(a => (
              <Dropdown.Item key={a.uuid} className='workspace' as={Link} to={getPathForAccount(a)}>
                {a.name}
              </Dropdown.Item>
            ))}
            <Dropdown.Item as={Link} to={getPathForProfilePage()}>
              {t('profile_dropdown.link.profile')}
            </Dropdown.Item>
          </>
        }

        <Dropdown.Item onClick={signOut}>{t('profile_dropdown.link.logout')}</Dropdown.Item>

        {BuildIf.LOCAL_DEV &&
          <>
            <Dropdown.Divider />
            <Dropdown.Item onClick={clearToS}>Show TOS</Dropdown.Item>

            <Dropdown.Divider />
            {jwt &&
              <>
                <Dropdown.Item disabled>
                  {getDebugJwtMessage(jwt)}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => refreshJwt()}>Refresh Jwt</Dropdown.Item>
              </>
            }
          </>
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ProfileDropdown
