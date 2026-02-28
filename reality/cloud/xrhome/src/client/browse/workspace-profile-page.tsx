import * as React from 'react'
import {useParams, Redirect, useRouteMatch, Link, useLocation} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {join} from 'path'

import {Loader} from '../ui/components/loader'
import {
  fixAccountUrl, stripAccountUrl, is8thWallAccountUuid, isPremierPartner, isPartner,
} from '../../shared/account-utils'
import ErrorMessage from '../home/error-message'
import Page from '../widgets/page'
import Title from '../widgets/title'
import ResponsiveImage from '../common/responsive-image'
import useActions from '../common/use-actions'
import {Icon} from '../ui/components/icon'
import usePageStyles from '../styles/page-styles'
import useProfilePageStyles from './workspace-profile-page-styles'
import {
  getPathForAccount, getAccountRootPath, WorkspaceProfilePathEnum, getPathForLoginPage,
  getPathForMyProjectsPage,
} from '../common/paths'
import {CheckedCertificateIcon} from './public-icons'
import NotFoundPage from '../home/not-found-page'
import {getPageTitleForAccountBrowse} from '../../shared/page-titles'
import PremierLabel from '../partners/premier-label'
import publicBrowseActions from './public-browse-actions'
import ProjectLibrary from './project-library'
import ReportPageCta from './widgets/report-page-cta'
import {
  brandHighlight, centeredSectionMargin, centeredSectionMaxWidth,
  mobileViewOverride, tinyViewOverride,
} from '../static/styles/settings'
import blankProfilePage from '../static/blankProfilePage.svg'
import {useSelector} from '../hooks'
import {LIBRARY_ACCOUNTS} from '../../shared/account-constants'
import {KEYWORDS} from '../../shared/discovery-constants'
import IndustryCarousel from '../discovery/industry-carousel'
import {combine} from '../common/styles'
import ModuleLibrary from './module-library'
import moduleActions from '../modules/actions'
import {useUserHasSession} from '../user/use-current-user'
import {SocialLinkOut} from '../accounts/social-link-out'
import {SocialLinkType} from '../accounts/socials-name-parser'
import {SecondaryButton} from '../ui/components/secondary-button'
import {createThemedStyles} from '../ui/theme'

type WorkspaceTabDefinition = {
  path: WorkspaceProfilePathEnum
  name: string
  element: React.ReactElement
}

const useStyles = createThemedStyles(theme => ({
  blankProfilePage: {
    'width': '100%',
    'margin': '10em 0',
    'textAlign': 'center',
    '& p': {
      color: theme.fgMuted,
    },
  },
  reportCta: {
    marginTop: '1em',
    left: 'calc(max(4rem, (100% - 70em)/2))',
  },
  featuredWork: {
    fontWeight: 700,
    fontSize: '1.25em',
  },
  tabbedLibraryView: {
    width: '100%',
    margin: '0em !important',
    marginBottom: '4em !important',
  },
  libraryGrid: {
    'display': 'grid',
    'margin': '0 auto',
    'gridTemplateColumns': '1fr 1fr 1fr',
    'gap': '2em 0.75em',
    [mobileViewOverride]: {
      gridTemplateColumns: '1fr 1fr',
    },
    [tinyViewOverride]: {
      gridTemplateColumns: '1fr',
      gap: '0.75em 0',
      maxWidth: '380px',
    },
  },
  locationIcon: {
    'whiteSpace': 'nowrap',
    'display': 'flex',
    'gap': '0.25rem',
    '& > svg': {
      minWidth: '12px',
      minHeight: '16px',
      width: '12px',
    },
  },
  tabRow: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: `calc(${centeredSectionMaxWidth} + 2 * ${centeredSectionMargin})`,
    padding: ['2rem', centeredSectionMargin, '0.5rem'],
    margin: '0 auto',
    overflow: 'auto',
    marginBottom: '1rem',
  },
  tab: {
    'whiteSpace': 'nowrap',
    'borderBottom': '3px solid transparent',
    'padding': '0.25rem 0',
    'fontSize': '16px',
    'fontWeight': 'bold',
    '&:link, &:visited': {
      color: `var(--tab-color, ${theme.fgMuted})`,
    },
    '&:hover': {
      color: theme.fgMain,
    },
    '&:not(:last-child)': {
      marginRight: '4rem',
      [tinyViewOverride]: {
        marginRight: '2rem',
      },
    },
  },
  activeTab: {
    'borderBottomColor': brandHighlight,
    '--tab-color': theme.fgMain,
  },
}))

interface RouteParams {
  account: string
}

const WorkspaceProfilePage: React.FC = () => {
  const classes = useStyles()
  const profilePageStyles = useProfilePageStyles()
  const pageStyles = usePageStyles()
  const location = useLocation()
  const {t} = useTranslation(['public-featured-pages'])
  const {getPublicAccount, getAccountAddress} = useActions(publicBrowseActions)
  const {listPublicModulesForAccount} = useActions(moduleActions)
  const {account: accountName} = useParams<RouteParams>()
  const accountPath = getPathForAccount(accountName)
  const accountUuid = useSelector(state => state.publicBrowse.accountByName[accountName])
  const account = useSelector(state => state.publicBrowse.Accounts[accountUuid])
  const ownAccount = useSelector(
    state => state.accounts.allAccounts.find(e => e.shortName === accountName)
  )
  const isLoggedIn = useUserHasSession()
  const isAccountLoaded = useSelector(state => state.accounts.accountLoaded)
  const publicBrowseApps = useSelector(state => state.publicBrowse.Apps)
  const apps = account?.Apps?.map(uuid => publicBrowseApps[uuid]) || []

  React.useEffect(() => {
    if (accountUuid) {
      listPublicModulesForAccount(accountUuid)
    }
  }, [accountUuid])

  //   TODO(Dale): switch to moduleByName
  const modules = useSelector(s => (
    accountUuid && s.modules?.publicByAccountUuid[accountUuid]
      ?.map(i => s.modules.publicEntities[i])
      ?.filter(m => !m.archived)
  )) || []

  const isPreLoaded = !!publicBrowseApps && !!account
  const [isPublicLoaded, setIsPublicLoaded] = React.useState(isPreLoaded)
  const [isAddressLoading, setIsAddressLoading] = React.useState(!account?.address)

  const match = useRouteMatch()

  React.useEffect(() => {
    if (!isPreLoaded) {
      getPublicAccount(accountName).then(() => setIsPublicLoaded(true))
    }
  }, [accountName])

  React.useEffect(() => {
    if (account?.googleMapsPlaceId && !account.address) {
      setIsAddressLoading(true)
      getAccountAddress(account).then(() => setIsAddressLoading(false))
    }
  }, [account?.googleMapsPlaceId])

  // If going to /my-projects and not logged in, redirect to login page
  if (location.pathname === '/my-projects' && !isLoggedIn) {
    return <Redirect to={`${getPathForLoginPage()}?redirectTo=${getPathForMyProjectsPage()}`} />
  }

  if (!account) {
    // If logged in and we know the account isn't featured, redirect to default page
    if (ownAccount && !ownAccount.publicFeatured) {
      return <Redirect to={accountPath} />
    }

    if (isPublicLoaded && (!isLoggedIn || isAccountLoaded)) {
      return <NotFoundPage />
    }
    return <Loader />
  } else if (LIBRARY_ACCOUNTS.includes(account.uuid)) {
    // NOTE(wayne): Redirect to the Project Library page if it's an 8th Wall public profile
    return <Redirect to='/projects' />
  }

  const showCheckBadge = isPartner(account) || is8thWallAccountUuid(account.uuid)

  const accountUrl = fixAccountUrl(account.url)
  const strippedUrl = stripAccountUrl(accountUrl)
  const baseContactUrl = fixAccountUrl(account.contactUrl)
  const accountContactUrl = baseContactUrl?.startsWith('mailto:')
    ? [
      baseContactUrl,
      '?subject=',
      encodeURIComponent(t('workspace_profile_page.reaching_out.subject')),
      '&body=',
      encodeURIComponent(t('workspace_profile_page.reaching_out.body', {accountName: account.name})),
    ].join('')
    : baseContactUrl

  const needsVerticalSeparator = accountContactUrl &&
    (account.twitterHandle || account.youtubeHandle || account.linkedInHandle)

  const renderAddressView = () => {
    if (isAddressLoading) {
      return <Loader inline size='tiny' />
    } else if (account.address) {
      return (
        <div className={classes.locationIcon}>
          <Icon stroke='location' color='gray4' />
          <p>
            {account.address}
          </p>
        </div>
      )
    } else {
      return null
    }
  }

  const projectLibraryView = apps.length > 0
    ? (
      <div className={combine(pageStyles.sectionProfile, classes.tabbedLibraryView)}>
        <ProjectLibrary
          className={classes.libraryGrid}
          account={account}
          apps={apps}
          pageName='public-profile'
          sortByLatest
        />
      </div>
    )
    : (
      <div className={classes.blankProfilePage}>
        <img alt='blank profile page' src={blankProfilePage} />
        <p>{t('workspace_profile_page.projects_coming_soon')}</p>
      </div>
    )

  const moduleLibraryView = modules.length > 0
    ? (
      <div className={combine(pageStyles.sectionProfile, classes.tabbedLibraryView)}>
        <ModuleLibrary
          className={classes.libraryGrid}
          account={account}
          modules={modules}
          pageName='module-profile'
          sortByLatest
        />
      </div>
    )
    : (
      <div className={classes.blankProfilePage}>
        <img alt='blank profile page' src={blankProfilePage} />
        <p>{t('workspace_profile_page.modules_coming_soon')}</p>
      </div>
    )

  const activeTabParam = match.path.endsWith('/modules')
    ? WorkspaceProfilePathEnum.modules
    : WorkspaceProfilePathEnum.projects

  const availableTabs: WorkspaceTabDefinition[] = []

  availableTabs.push({
    path: WorkspaceProfilePathEnum.projects,
    name: t('workspace_profile_page.tab.projects'),
    element: projectLibraryView,
  })

  availableTabs.push({
    path: WorkspaceProfilePathEnum.modules,
    name: t('workspace_profile_page.tab.modules'),
    element: moduleLibraryView,
  })

  const activeTab = availableTabs.find(e => e.path === activeTabParam)

  const onMailTo = () => window.open(`${accountContactUrl}`, '_blank', 'noopener,noreferrer')

  return (
    <Page
      className={profilePageStyles.showCase}
      centered={false}
    >
      <Title commonPrefixed>{getPageTitleForAccountBrowse(account)}</Title>
      <ErrorMessage />
      <div className={combine(pageStyles.sectionProfile, profilePageStyles.blurb)}>
        <div className={profilePageStyles.logo}>
          <ResponsiveImage width={130} alt={`${account.name} Logo`} sizeSet={account.icon} />
        </div>
        <div className={profilePageStyles.workspaceInfo}>
          <h1 className={profilePageStyles.workspaceName}>
            {account.name}
            {showCheckBadge && <CheckedCertificateIcon />}
            {isPremierPartner(account) && <PremierLabel />}
          </h1>
          <div className={profilePageStyles.locationLink}>
            {renderAddressView()}
            {accountUrl &&
              <span className='link'><Icon stroke='link' inline />
                <a
                  href={accountUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  a8={`click;public-profile;click-profile-external-url-${account.shortName}`}
                >
                  {strippedUrl}
                </a>
              </span>
            }
          </div>
          <p className={profilePageStyles.bio}>{account.bio}</p>
          <p className={profilePageStyles.linkOutsView}>
            {accountContactUrl &&
              <SecondaryButton
                a8={`click;public-profile;click-profile-contact-cta-${account.shortName}`}
                onClick={onMailTo}
              >
                <Icon
                  size={1.3}
                  inline
                  stroke='email'
                />{t('workspace_profile_page.button.contact')}
              </SecondaryButton>
            }
            {needsVerticalSeparator &&
              <span className={profilePageStyles.separator} />
            }
            {account.twitterHandle &&
              <SocialLinkOut
                type={SocialLinkType.Twitter}
                handle={account.twitterHandle}
                a8={`click;public-profile;click-profile-twitter-cta-${account.shortName}`}
              />
            }
            {account.linkedInHandle &&
              <SocialLinkOut
                type={SocialLinkType.LinkedIn}
                handle={account.linkedInHandle}
                a8={`click;public-profile;click-profile-linkedin-cta-${account.shortName}`}
              />
            }
            {account.youtubeHandle &&
              <SocialLinkOut
                type={SocialLinkType.Youtube}
                handle={account.youtubeHandle}
                a8={`click;public-profile;click-profile-youtube-cta-${account.shortName}`}
              />
            }
          </p>
        </div>
      </div>
      {availableTabs.length > 1 &&
        <section className={classes.tabRow}>
          {availableTabs.map(tab => (
            <Link
              key={tab?.path}
              to={join(getAccountRootPath(accountName), tab.path)}
              className={combine(classes.tab, activeTab === tab && classes.activeTab)}
            >
              {tab?.name}
            </Link>
          ))}
        </section>
      }
      <section className='section centered'>
        {isPublicLoaded ? activeTab?.element : <Loader inline centered />}
      </section>
      {!is8thWallAccountUuid(account.uuid) && <ReportPageCta
        className={combine(classes.reportCta, pageStyles.sectionProfile)}
        pageName='profile'
      />}
      <IndustryCarousel pageName='public-profile' keywords={KEYWORDS} showExploreMore />
    </Page>
  )
}

export default WorkspaceProfilePage
