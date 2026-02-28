import React, {FC} from 'react'
import {Link, useLocation, useRouteMatch, Route} from 'react-router-dom'
import {join} from 'path'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {getPathForMyProjectsPage} from '../common/paths'
import {bool, combine} from '../common/styles'
import NavLogo from './nav-logo'
import useActions from '../common/use-actions'
import userActions from '../user/user-actions'
import AccountSidebarAccordions from './account-sidebar-accordions'
import {useSelector} from '../hooks'
import MyProjectsIcon from './my-projects-icon'
import {UiThemeProvider} from '../ui/theme'
import {ResourceCenter} from './resource-center'
import QuestionMarkIcon from './question-mark-icon'
import {brandBlack, gray5, mango, mobileViewOverride} from '../static/styles/settings'
import type {WorkspacePageParams} from '../app-switch'

type AccountSidebarParams = WorkspacePageParams & {
  page?: string
}

const useStyles = createUseStyles({
  logo: {
    padding: '1.5rem',
    borderLeft: '4px solid transparent',
  },
  resourceCenter: {
    position: 'fixed',
    bottom: '0em',
    left: '0em',
    width: '16rem',
    background: brandBlack,
    borderTop: `1px solid ${gray5}`,
    [mobileViewOverride]: {
      display: 'none',
    },
  },
  resourceCenterButton: {
    width: '100%',
  },
  devBorder: {
    borderLeft: `4px dashed ${mango}`,
  },
  spacer: {
    height: '3em',
    width: '100%',
  },
})

const AccountSidebar: FC = () => {
  const {t} = useTranslation('account-pages')
  const location = useLocation()
  const match = useRouteMatch()
  const showNav = useSelector(state => state.common.showNav)
  const {setShowNav} = useActions(userActions)
  const classes = useStyles()

  const entryPath = getPathForMyProjectsPage()
  return (
    <Route path={join(match.path, ':page?')}>
      {showNav &&
        <button
          type='button'
          className='style-reset sidebar-dismiss'
          onClick={() => setShowNav(false)}
        >
          {t('my_projects_page.account_sidebar.button.dismiss_sidebar')}
        </button>
      }
      <div
        className={combine(
          'sidebar',
          'wide',
          bool(BuildIf.LOCAL_DEV, 'dev'),
          bool(showNav, 'show-nav')
        )}
      >
        <NavLogo
          className={classes.logo}
          size='wide'
          color='white'
          a8='click;cloud-editor-navigation;home-button'
        />
        <Link
          to={entryPath}
          className={
            combine('item', bool(location.pathname === entryPath, 'active'))
          }
        >
          <MyProjectsIcon />
          {t('my_projects_page.account_sidebar.link.my_projects')}
        </Link>
        <AccountSidebarAccordions />
        <div className={classes.spacer} />
        <div className={combine(classes.resourceCenter, BuildIf.LOCAL_DEV && classes.devBorder)}>
          <UiThemeProvider mode='dark'>
            <ResourceCenter mode='account'>
              {onClick => (
                <button
                  type='button'
                  className={combine('style-reset item', classes.resourceCenterButton)}
                  onClick={onClick}
                >
                  <QuestionMarkIcon />
                  {t('my_projects_page.account_config.resource_center')}
                </button>
              )}
            </ResourceCenter>
          </UiThemeProvider>
        </div>
      </div>
    </Route>
  )
}

export default AccountSidebar

export type {
  AccountSidebarParams,
}
