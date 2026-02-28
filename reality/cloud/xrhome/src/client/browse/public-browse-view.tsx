import * as React from 'react'
import {join} from 'path'
import {useParams, useHistory, Redirect, Link} from 'react-router-dom'
import {Trans, useTranslation} from 'react-i18next'

import {useSelector} from '../hooks'
import {
  getPublicPathForApp, getPathForAppNoTrailing,
  getPathForAccount, AccountPathEnum, getPublicPathForAccount,
} from '../common/paths'
import {is8thWallAccountUuid} from '../../shared/account-utils'
import {EIGHTH_WALL_WEB_ACCOUNT} from '../../shared/account-constants'
import navigationActions from '../navigations/navigation-actions'
import {
  gray2, tinyViewOverride,
  centeredSectionMargin, centeredSectionMaxWidth, mobileViewOverride,
} from '../static/styles/settings'
import FeaturedVideoDisplay from './featured-video-display'
import FeaturedDescriptionDisplay from './featured-description-display'
import FileBrowseView from './file-browse-view'
import useActions from '../common/use-actions'
import {combine} from '../common/styles'
import {PREDETERMINED_PATH, KEYWORD_SEARCH_PARAM} from '../../shared/discovery-constants'

import FeaturedImageCarousel from './featured-image-carousel'
import BrowseLink from './widgets/browse-link'
import FileBrowseContext from './file-browse-context'
import ProjectLibrary from './project-library'
import PublicBrowseAppInfo from './public-browse-app-info'
import {appHasPublicRepo, isCloudStudioApp} from '../../shared/app-utils'
import ReportPageCta from './widgets/report-page-cta'
import usePageStyles from '../styles/page-styles'
import type {PublicBrowsePageParams} from '../app-switch'
import userActions from '../user/user-actions'
import {useStringConsumedUrlParamEffect} from '../hooks/use-consumed-url-param-effect'
import {createThemedStyles} from '../ui/theme'

const MAX_OTHER_WORK_PROJECT_COUNT = 6

interface IPublicBrowseView {
  appUuid: string
  accountUuid: string
  featuredDescriptionText: string
}

const useStyles = createThemedStyles(theme => ({
  otherWorkView: {
    margin: '2em auto !important',
    width: '100%',
  },

  branchSelect: {
    margin: '1.5em 0',
  },

  codeView: {
    marginBottom: '2em',
  },

  childLink: {
    'padding': '0.25em 0',
    'color': `${theme.linkBtnFg} !important`,
    '&:hover': {
      color: `${theme.badgePurpleColor} !important`,
    },
    '& + &': {
      marginLeft: '1.25em',
    },
  },

  activeLink: {
    borderBottom: `4px solid ${theme.badgePurpleColor} !important`,
  },

  tagView: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '2em',
    marginBottom: '3.3em',
  },
  tag: {
    'width': 'fit-content',
    'height': '24px',
    'marginTop': '0.25em',
    'marginBottom': '0.25em',
    'marginRight': '0.5em',
    'padding': '4px 8px',
    'borderWidth': '0',
    'borderRadius': '2px',
    'backgroundColor': theme.badgeGrayPastelBgColor,
    'color': theme.badgeGrayPastelFgColor,
    'textAlign': 'center',
    'whiteSpace': 'nowrap',
    'fontSize': '0.875em',
    '&:last-child': {
      marginRight: '0',
    },
    [tinyViewOverride]: {
      fontSize: '1em',
    },
  },
  tagHover: {
    'cursor': 'pointer',
    '&:hover': {
      'backgroundColor': theme.badgeGrayColor,
      'color': theme.fgMain,
    },
  },
  otherWorkHeader: {
    flexBasis: '320px',
    borderTop: `1px solid ${gray2}`,
    paddingTop: '1.2rem',
  },
  libraryGrid: {
    'width': `calc(100% - ${centeredSectionMargin})`,
    'maxWidth': centeredSectionMaxWidth,
    'display': 'grid',
    'gridTemplateColumns': '1fr 1fr 1fr',
    'gap': '2em 0.75em',
    'margin': '0 auto',
    'padding': '2em 0',
    [mobileViewOverride]: {
      'display': 'flex',
      'width': '100%',
      'maxWidth': '100%',
      'overflowX': 'scroll',
      'padding': '2em 0 2em 2rem',
      'scrollbarWidth': 'none',
      'msOverflowStyle': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      '&:after': {
        content: '""',
        width: '0',
        height: '1em',
        paddingRight: '2rem',
      },
      '& > div': {
        minWidth: '300px',
      },
    },
    [tinyViewOverride]: {
      'display': 'flex',
      'gap': '0.75em 0',
      'width': '100%',
      'max-width': '100%',
      'flexDirection': 'column',
      'maxWidth': '37rem',
      'margin': 'auto',
      'padding': '2em 2em 0 2em',
      '& > div': {
        minWidth: '100%',
      },
    },
  },
}))

const PublicBrowseView: React.FC<IPublicBrowseView> = ({
  appUuid, accountUuid, featuredDescriptionText,
}) => {
  const account = useSelector(state => state.publicBrowse.Accounts[accountUuid])
  const app = useSelector(state => state.publicBrowse.Apps[appUuid])
  const hasOverView =
    !is8thWallAccountUuid(accountUuid) || accountUuid === EIGHTH_WALL_WEB_ACCOUNT
  const showOverview = hasOverView && (featuredDescriptionText?.length > 0 ||
    app.FeaturedAppImages?.length > 0)
  const defaultBranch = hasOverView ? '' : 'code'
  const {branch = defaultBranch, repoPath = ''} = useParams<PublicBrowsePageParams>()
  const history = useHistory()
  const routeRepoPath = `/${repoPath}`
  const onlyAccount = useSelector(
    state => state.accounts.allAccounts.length === 1 && state.accounts.allAccounts[0]
  )

  const {pushCheckpoint} = useActions(navigationActions)

  const showBrowseCode = appHasPublicRepo(app) && app.productionCommitHash

  const publicBrowseApps = useSelector(state => state.publicBrowse.Apps)
  const desktopRedirect = useSelector(state => state.common.desktopDuplicateProjectReturnUrl)

  const {setDesktopDuplicateProjectReturnUrl} = useActions(userActions)
  useStringConsumedUrlParamEffect('desktopRedirect', (value) => {
    setDesktopDuplicateProjectReturnUrl(value)
  })

  const apps =
    account?.Apps?.map(
      uuid => publicBrowseApps[uuid]
    ) || []

  const onCloneClick = () => {
    if (desktopRedirect && isCloudStudioApp(app)) {
      const url = new URL(desktopRedirect)
      url.searchParams.set('accountShortName', account.shortName)
      url.searchParams.set('appName', app.appName)
      window.location.href = url.toString()
      return
    }
    const appPath = getPathForAppNoTrailing(account, app)
    const accountPath = onlyAccount
      ? getPathForAccount(onlyAccount.shortName, AccountPathEnum.duplicateProject)
      : `/${AccountPathEnum.duplicateProject}`
    const duplicateAppPath = join(accountPath, appPath)
    pushCheckpoint(getPublicPathForApp(account, app))
    history.push(duplicateAppPath)
  }

  const onTagClick = (tagName: string) => {
    const searchParams = new URLSearchParams()
    searchParams.set(KEYWORD_SEARCH_PARAM, tagName)
    history.push(`/${PREDETERMINED_PATH}/view-all?${searchParams}`)
  }

  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const pageStyles = usePageStyles()

  // Known branches.
  if (!['master', 'published', 'code', ''].includes(branch)) {
    return <Redirect to={getPublicPathForApp(account, app)} />
  }

  if (!appHasPublicRepo(app) && branch !== '') {
    return <Redirect to={getPublicPathForApp(account, app)} />
  }

  if (['master', 'published'].includes(branch)) {
    const redirectPath = `${getPublicPathForApp(account, app)}/code${routeRepoPath}`
    return <Redirect to={redirectPath} />
  }

  const browseLinks = (
    <>
      {showOverview && (
        <BrowseLink
          branch=''
          path='/'
          className={combine(branch === '' && classes.activeLink, classes.childLink)}
        >{t('featured_app_page.heading.overview')}
        </BrowseLink>
      )}
      {showBrowseCode &&
        <BrowseLink
          branch='code'
          path='/'
          className={combine(branch === 'code' && classes.activeLink, classes.childLink)}
        >
          {'Code </>'}
        </BrowseLink>
      }
    </>
  )

  return (
    <FileBrowseContext.Provider
      value={{
        appOrModuleUuid: app.uuid,
        rootName: app.appName,
        commitHash: app.productionCommitHash,
        path: routeRepoPath,
        branch,
        routePrefix: getPublicPathForApp(account, app),
      }}
    >
      <div className={pageStyles.sectionProfile}>
        <PublicBrowseAppInfo
          app={app}
          account={account}
          onCloneClick={onCloneClick}
        />
      </div>
      <div className={pageStyles.sectionProfile}>
        <div className={classes.branchSelect}>
          {browseLinks}
        </div>
      </div>
      {!branch
        ? (
          <>
            <div className={pageStyles.sectionProfile}>
              <FeaturedVideoDisplay featuredVideoUrl={app.featuredVideoUrl} />
              {featuredDescriptionText &&
                <FeaturedDescriptionDisplay
                  featuredDescriptionText={featuredDescriptionText}
                />
              }
            </div>
            {/*
              FeaturedImageCarousel is not wrapped in "section centered" because it is full
             bleed on mobile, so it can't have padding around it.
            */}
            {!!app.FeaturedAppImages?.length &&
              <FeaturedImageCarousel
                featuredImages={app.FeaturedAppImages}
              />
            }
          </>
        )
        : (
          <div className={combine(classes.codeView, pageStyles.sectionProfile)}>
            <FileBrowseView />
          </div>
        )
      }
      {app.AppTags?.length > 0 &&
        <div className={combine(classes.tagView, pageStyles.sectionProfile)}>
          {app.AppTags.map(tag => (
            <button
              type='button'
              className={combine(classes.tag, classes.tagHover)}
              key={tag.name}
              onClick={() => onTagClick(tag.name)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      }
      {!is8thWallAccountUuid(accountUuid) &&
        <ReportPageCta
          left='calc(max(4rem, (100% - 70em)/2))'
          className={pageStyles.sectionProfile}
          pageName='project'
        />
      }
      {!!apps.length &&
        <div className={classes.otherWorkView}>
          <p className={combine(classes.otherWorkHeader, pageStyles.sectionProfile)}>
            <Trans
              ns='public-featured-pages-copy'
              i18nKey='featured_app_page.other_work_by'
              values={{accountName: account.name}}
            >
              Other Work by{' '}
              <b>
                <Link to={getPublicPathForAccount(account)}>{account.name}</Link>
              </b>
            </Trans>
          </p>
          <ProjectLibrary
            className={classes.libraryGrid}
            account={account}
            apps={apps}
            pageName='public-project'
            limit={MAX_OTHER_WORK_PROJECT_COUNT}
            sortByLatest
          />
        </div>
      }
    </FileBrowseContext.Provider>
  )
}

export default PublicBrowseView
