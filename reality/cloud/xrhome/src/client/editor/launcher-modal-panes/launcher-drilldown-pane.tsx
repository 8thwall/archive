import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'

import {
  bodySanSerif, headerSanSerif, brandPurple, brandWhite, gray2, gray3, brandHighlight,
  mobileViewOverride, tinyViewOverride, gray4, brandBlack, almostBlack,
  accessibleHighlight,
  brandPurpleDark,
  darkBlue,
} from '../../static/styles/settings'
import {useTheme} from '../../user/use-theme'
import {
  deriveAppCoverImageUrl,
  appHasRepo,
} from '../../../shared/app-utils'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../../shared/app-constants'
import Embed8 from '../../widgets/embed8'
import TempUrlPopover from '../../widgets/temp-url-popover'
import appActions from '../../apps/apps-actions'
import useCurrentApp from '../../common/use-current-app'
import useCurrentAccount from '../../common/use-current-account'
import useActions from '../../common/use-actions'
import type {IApp, ILauncherDrillDownApp} from '../../common/types/models'
import {useSelector} from '../../hooks'
import icons from '../../apps/icons'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import launcherActions from '../../launcher/launcher-actions'
import {useMountedRef} from '../../hooks/use-mounted'
import {FreeformMarkdownPreview} from '../../widgets/freeform-markdown-preview'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'
import {Loader} from '../../ui/components/loader'
/*
NOTE (Brandon): After discussing with Wayne and Kim, this is a one-off solution to an ongoing
project regarding breakpoints and associated views. Need to reconsider how we approach custom
break points.
*/
const mediumViewOverride = '@media (max-width: 991px)'

const useStyles = createCustomUseStyles<{themeName: 'light' | 'dark'}>()({
  container: {
    'fontFamily': bodySanSerif,
    'fontWeight': '400',
    'padding': '1.7em 0.6em 1.8em 2.3em',
    'display': 'flex',
    'flexDirection': 'column',
    'height': '100%',
    'position': 'relative',

    '& h1': {
      fontFamily: headerSanSerif,
      fontWeight: '700',
    },
  },
  breadCrumbContainer: {
    display: 'flex',
    width: '100%',
    height: '18px',
    fontSize: '12px',
    gap: '0.5em',

    [mobileViewOverride]: {
      paddingRight: '54px',
    },
    [tinyViewOverride]: {
      paddingRight: '38px',
    },
  },
  previousCrumb: {
    'color': ({themeName}) => (themeName === 'dark' ? gray3 : gray4),
    'cursor': 'pointer',
    'whiteSpace': 'nowrap',
    '&:hover': {
      color: ({themeName}) => (themeName === 'dark' ? brandWhite : brandBlack),
    },
  },
  separator: {
    transform: 'rotate(270deg)',
    alignSelf: 'center',
    height: '10px',
  },
  activeCrumb: {
    color: ({themeName}) => (themeName === 'dark' ? brandWhite : brandBlack),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  metaDataContainer: {
    'display': 'flex',
    'flexDirection': 'row',
    'alignItems': 'flex-end',
    'margin': '2.2em 0',
    'columnGap': '1.7em',
    'rowGap': '1em',
    [mediumViewOverride]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    [mobileViewOverride]: {
      paddingRight: '54px',
    },
    [tinyViewOverride]: {
      paddingRight: '38px',
    },
  },
  projectImage: {
    width: '44%',
    height: '100%',
    maxWidth: '400px',
    borderRadius: '0.5em',
    [mediumViewOverride]: {
      width: '100%',
      maxWidth: '551px',
    },
  },
  appInfo: {
    width: '100%',
  },
  btnsContainer: {
    display: 'flex',
    gap: '1.1em',
    fontSize: '14px',
  },
  embedBtn: {
    'height': '2.3em',
    'display': 'inline-flex',
    'justifyContent': 'center',
    'borderRadius': '0.5em',
    'padding': '0 0.5em',
    'width': '55%',
    'maxWidth': '10em',
    'backgroundColor': ({themeName}) => (themeName === 'dark' ? darkBlue : brandWhite),
    'border': ({themeName}) => (themeName === 'dark'
      ? `solid 1px ${brandWhite}`
      : `solid 1px ${brandPurple}`),
    '& .embed8-link': {
      'color': ({themeName}) => (themeName === 'dark' ? brandWhite : brandPurple),
      'display': 'inline-flex',
      'flexDirection': 'row-reverse',
      'alignItems': 'center',
      'padding': '0 1em',
      'whiteSpace': 'nowrap',
      'fontSize': '14px',
    },
    '&:hover': {
      'backgroundColor': ({themeName}) => (
        themeName === 'dark' ? `${gray4}59` : `${brandHighlight}0d`
      ),
      '& .embed8-link-icon': {
        opacity: '1',
      },
    },
  },
  cloneProjectBtn: {
    'fontFamily': bodySanSerif,
    'height': '2.3em',
    'backgroundColor': ({themeName}) => (themeName === 'dark' ? brandHighlight : brandPurple),
    'border': 'none',
    'color': brandWhite,
    'borderRadius': '0.5em',
    'cursor': 'pointer',
    'width': '55%',
    'maxWidth': '10em',
    '&:hover': {
      'backgroundColor': ({themeName}) => (themeName === 'dark' ? brandPurple : brandPurpleDark),
      'color': ({themeName}) => (themeName === 'dark' ? brandWhite : `${brandPurple}80`),
    },
  },
  mainAppInfo: {
    'overflowY': 'auto',
    'paddingRight': '4em',

    'scrollbarWidth': 'thin',
    'scrollbarColor': `${gray4} ${brandBlack}`,
    '&::-webkit-scrollbar': {
      width: '8px',
      marginRight: '0.5em',
    },
    '&::-webkit-scrollbar-thumb': {
      'background': gray4,
      'borderRadius': '4px',
      '&:hover': {
        background: gray4,
      },
    },
    '&::-webkit-scrollbar-track': {
      background: ({themeName}) => (themeName === 'dark' ? brandBlack : gray2),
      borderRadius: '4px',
    },

    '& div': {
      border: 'none',
      padding: '1em 0',
    },
  },
  loader: {
    'color': ({themeName}) => (themeName === 'dark'
      ? `${brandWhite}e6 !important`
      : `${almostBlack} !important`),
    '&::before': {
      borderColor: ({themeName}) => (themeName === 'dark'
        ? `${brandWhite}26 !important`
        : `${almostBlack}1a !important`),
    },
    '&::after': {
      borderTopColor: ({themeName}) => (themeName === 'dark'
        ? `${brandWhite} !important`
        : `${gray3} !important`),
    },
    'align-self': 'center',
    'margin-right': '1rem !important',
  },
  markdown: {
    '& a': {
      color: (({themeName}) => (themeName === 'dark' ? accessibleHighlight : brandPurple)),
    },
    '& img': {
      maxWidth: '100%',
    },
  },
})

interface IProjectDrillDown {
  app: IApp | ILauncherDrillDownApp
  closeDrillDown: () => void
  previousPaneName: string
}

const ProjectDrillDown = ({app, closeDrillDown, previousPaneName}: IProjectDrillDown) => {
  const themeName = useTheme()
  const classes = useStyles({themeName})
  const {t} = useTranslation(['cloud-editor-pages'])
  const currentApp = useCurrentApp()
  const currentAccount = useCurrentAccount()
  const {cloneIntoApp} = useActions(appActions)
  const {fetchAppReadMe} = useActions(launcherActions)
  const appName = app.appTitle || app.appName
  const isAppFromSameAccount = useSelector(state => !!state.apps.find(a => a.uuid === app.uuid))
  const [isLoading, setIsLoading] = useState(true)
  const markDownContent = useSelector(state => state.launcher.appReadMesByAppUuid[app.uuid])
  const [isCloning, setIsCloning] = useState(false)

  const mountedRef = useMountedRef()

  useAbandonableEffect(async (executor) => {
    setIsLoading(true)
    const branch = isAppFromSameAccount ? 'master' : 'production'
    await executor(
      fetchAppReadMe(
        app.uuid, app.productionCommitHash, branch, isAppFromSameAccount
      )
    )
    setIsLoading(false)
  }, [])

  const cloneProject = async () => {
    setIsCloning(true)
    try {
      const fromProjectSpecifier = isAppFromSameAccount
        ? `${currentAccount.shortName}.${app.appName}`
        : `${app.Account.shortName}.${app.appName}`

      const deployment = isAppFromSameAccount ? undefined : 'published'

      await cloneIntoApp({
        appUuid: currentApp.uuid,
        fromAppUuid: app.uuid,
        fromProjectSpecifier,
        // Clones from 'master' if app is from same account or an Ad.
        deployment,
      })
    } finally {
      if (mountedRef.current) {
        setIsCloning(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className={classes.container}>
        {/* eslint-disable-next-line local-rules/ui-component-styling */}
        <Loader className={classes.loader} />
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <div className={classes.breadCrumbContainer}>
        <span
          className={classes.previousCrumb}
          role='button'
          tabIndex={0}
          onClick={() => closeDrillDown()}
          onKeyDown={() => closeDrillDown()}
        >
          {previousPaneName}
        </span>
        <img
          className={classes.separator}
          src={icons.chevron}
          alt='separator'
        />
        <span className={classes.activeCrumb}>{appName}</span>
      </div>
      <section className={classes.metaDataContainer}>
        <img
          className={classes.projectImage}
          src={deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[600])}
          alt={appName}
        />
        <div className={classes.appInfo}>
          <h1>{appName}</h1>
          <div className={classes.btnsContainer}>
            {!app.featuredPreviewDisabled &&
            app.productionCommitHash &&
            app.shortLink &&
              <div className={classes.embedBtn}>
                <Embed8
                  shortLink={app.shortLink}
                  renderPopover={props => <TempUrlPopover {...props} />}
                  iconColor={themeName === 'dark' ? 'light' : 'dark'}
                >{t('editor_page.project_picker_modal.drill_down_page.button.launch')}
                </Embed8>
              </div>}
            {appHasRepo(app) &&
              <button
                a8='click;template-picker;clone-project-button'
                className={classes.cloneProjectBtn}
                onClick={cloneProject}
                type='button'
                disabled={isCloning}
              >{t('editor_page.project_picker_modal.drill_down_page.button.clone_project')}
              </button>
            }
          </div>
        </div>
      </section>
      <div className={classes.mainAppInfo}>
        {app.appDescription}
        {!!markDownContent &&
          <FreeformMarkdownPreview className={classes.markdown}>
            {markDownContent}
          </FreeformMarkdownPreview>}
      </div>
    </div>

  )
}

export default ProjectDrillDown
