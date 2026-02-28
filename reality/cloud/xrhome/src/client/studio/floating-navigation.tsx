import React from 'react'
import {Link} from 'react-router-dom'
import {Icon as SemanticIcon} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {createBrowserUrl} from '../../shared/studiohub/create-browser-url'
import {FloatingTray} from '../ui/components/floating-tray'
import {createThemedStyles} from '../ui/theme'
import {AppPathEnum, getPathForApp, getPathForMyProjectsPage} from '../common/paths'
import MyProjectsIcon from '../widgets/my-projects-icon'
import useCurrentApp from '../common/use-current-app'
import useCurrentAccount from '../common/use-current-account'
// eslint-disable-next-line import/no-cycle
import getPagesForApp from '../apps/app-pages'
import {combine} from '../common/styles'
import {SelectMenu} from './ui/select-menu'
import {FloatingIconButton} from '../ui/components/floating-icon-button'
import {useStudioMenuStyles} from './ui/studio-menu-styles'
import {useSceneContext} from './scene-context'
import useAppSharingInfo from '../common/use-app-sharing-info'
import {HOME_PATH} from '../desktop/desktop-paths'

const useStyles = createThemedStyles(theme => ({
  dropdownItem: {
    'whiteSpace': 'nowrap',
    'color': theme.fgMain,
    'padding': '0.75em',
    'display': 'flex',
    'alignItems': 'center',
    'lineHeight': '16px',
    '&:hover': {
      background: theme.studioBtnHoverBg,
      color: theme.fgMain,
      borderRadius: '0.5em',
    },
    '&:hover $dropdownIcon': {
      color: theme.fgMain,
    },
    '& i': {
      fontSize: '1.25em',
    },
  },
  dropdownIcon: {
    'color': theme.fgMuted,
  },
  appPageIcon: {
    marginRight: '0.5em',
  },
  iconComponent: {
    height: '1.5em',
    width: '1.5em',
    display: 'flex',
  },
}))

const FloatingNavigation: React.FC = () => {
  const app = useCurrentApp()
  const account = useCurrentAccount()
  const {t} = useTranslation(['account-pages', 'app-pages', 'cloud-studio-pages'])
  const classes = useStyles()
  const studioMenuStyles = useStudioMenuStyles()
  const ctx = useSceneContext()
  const pages = getPagesForApp(app, account)
  const filteredPages = pages.filter(
    ({disabled, hideInSidebar, path}) => !disabled && !hideInSidebar &&
            path !== AppPathEnum.studio && path !== AppPathEnum.history
  )
  const {
    isExternalApp, externalOwnerAccount, memberInviteeAccount,
  } = useAppSharingInfo(app)

  const isDesktop = Build8.PLATFORM_TARGET === 'desktop'
  return (
    <SelectMenu
      id='floating-navigation-menu'
      menuWrapperClassName={studioMenuStyles.studioMenu}
      trigger={(
        <FloatingTray nonInteractive={ctx.isDraggingGizmo}>
          <FloatingIconButton
            a8='click;studio;navigation-menu-button'
            text={t('floating_navigation.label', {ns: 'cloud-studio-pages'})}
            stroke='hamburgerMenu'
          />
        </FloatingTray>
      )}
    >
      {() => (
        <>
          <Link
            to={isDesktop ? HOME_PATH : getPathForMyProjectsPage()}
            className={classes.dropdownItem}
          >
            <span className={classes.dropdownIcon}><MyProjectsIcon /></span>
            {t('my_projects_page.account_sidebar.link.my_projects', {ns: 'account-pages'})}
          </Link>
          {filteredPages.map((page) => {
            const innerContent = (
              <>
                <span className={combine(classes.dropdownIcon, classes.appPageIcon)}>
                  {page.iconComponent
                    ? <page.iconComponent className={classes.iconComponent} />
                    : <SemanticIcon name={page.icon} />
                  }
                </span>
                {t(page.name, {ns: 'app-pages'})}
              </>
            )

            const pathForApp = getPathForApp({
              member: isExternalApp ? memberInviteeAccount : account,
              external: isExternalApp ? externalOwnerAccount : undefined,
            }, app, page.path)

            return isDesktop
              ? (
                <button
                  key={page.name}
                  type='button'
                  onClick={() => {
                    window.open(createBrowserUrl(pathForApp))
                  }}
                  className={combine('style-reset', classes.dropdownItem)}
                >
                  {innerContent}
                </button>
              )
              : (
                <Link
                  key={page.name}
                  to={pathForApp}
                  className={classes.dropdownItem}
                >
                  {innerContent}
                </Link>
              )
          })}
        </>
      )}
    </SelectMenu>
  )
}

export {
  FloatingNavigation,
}
