import React from 'react'
import {createUseStyles} from 'react-jss'
import {Link, useRouteMatch, useHistory, Redirect, useParams} from 'react-router-dom'
import {Input} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import appsActions from '../apps/apps-actions'
import {sortByDescAccessDate} from '../apps/app-user-specific'
import {combine} from '../common/styles'
import {withAppsLoaded} from '../common/with-state-loaded'
import Page from '../widgets/page'
import {isUnityAccount, isCameraAccount, isTotalViewsAccount} from '../../shared/account-utils'
import XrAppsPage from '../apps/xrapps-page'
import {
  getPathForAccount, getPathForApp, AccountPathEnum, AppPathEnum, AccountDashboardPathEnum,
  getPathForAccountDashboard,
} from '../common/paths'
import {CameraUsage} from '../apps/cameras-page'
import {WebUsage} from '../apps/webapps-page'
import floatingBlocksImg from '../static/floatingBlocks.png'
import {isArchived, isDashboardVisible} from '../../shared/app-utils'
import ErrorMessage from '../home/error-message'
import billingActions from '../billing/billing-actions'
import {FluidCardContent} from '../widgets/fluid-card'
import CampaignUsageSection from '../apps/widgets/campaign-usage-section'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import ViolationNotice from '../home/violation-notice'
import {AccountModuleList} from './account-module-list'
import useActions from '../common/use-actions'
import {FilteredAppCards} from './dashboard/filtered-app-cards'
import {useSelector} from '../hooks'
import useCurrentAccount from '../common/use-current-account'
import type {IApp} from '../common/types/models'
import {
  brandBlack, brandHighlight, centeredSectionMargin, centeredSectionMaxWidth, gray4,
  tinyViewOverride,
} from '../static/styles/settings'
import {isModuleAuthorAllowed} from '../../shared/account-module-access'
import {isBillingRole} from '../../shared/roles-utils'
import {Icon} from '../ui/components/icon'

type WorkspaceTabDefinition = {
  path: AccountDashboardPathEnum
  name: string
  element: React.ReactElement
}

const useStyles = createUseStyles({
  tabRow: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: `calc(${centeredSectionMaxWidth} + 2 * ${centeredSectionMargin})`,
    padding: [0, centeredSectionMargin, '0.5rem'],
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
      color: `var(--tab-color, ${gray4})`,
    },
    '&:hover': {
      color: brandBlack,
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
    '--tab-color': brandBlack,
  },
  workspaceControls: {
    'display': 'flex',
    'flexDirection': 'row',
    'flexWrap': 'wrap',
    'margin': '2rem -1rem',
    'justifyContent': 'flex-end',
    'alignItems': 'center',
    '& > *': {
      margin: '1rem !important',
    },
  },
  workspaceSearch: {
    flex: '1 0 0',
    maxWidth: '20rem',
    marginRight: 'auto !important',
  },
  tinyScreenControls: {
    'flexDirection': 'column',
    'alignItems': 'stretch',
    '& > $workspaceSearch': {
      maxWidth: 'none',
      marginRight: '1rem !important',
    },
  },
  legacyButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    margin: '32px auto',
    maxWidth: '74em',
    paddingRight: '2rem',
  },
  legacyButton: {
    'display': 'flex',
    'padding': '4px 8px',
    'alignItems': 'center',
    'borderRadius': '4px',
    'background': 'var(--Gray-2, #D5D7E4)',
    'border': 'none',
    'fontSize': '12px',
    'fontWeight': '600',
    'color': brandBlack,
    '&:hover': {
      background: '#c4c6d3',
    },
    '& svg': {
      marginTop: '2px',
      color: brandBlack,
    },
  },
})

type AccountWorkspaceTabMatch = {params: {accountWorkspaceTab: string}}

const WebAccountDashboardPage: React.FC = () => {
  const {t} = useTranslation(['account-pages'])
  const history = useHistory()
  const classes = useStyles()
  const {account: fromWorkspace} = useParams<{account: string}>()
  const match = useRouteMatch<AccountWorkspaceTabMatch['params']>()

  const apps = useSelector(s => s.apps)
  const account = useCurrentAccount()
  const usage = useSelector(s => s.usage)
  const billing = useSelector(s => s.billing)
  const userRole = useSelector(s => s.team.roles.find(e => e.email === s.user.email)?.role)
  const isTinyScreen = useSelector(s => s.common.isTinyScreen)

  const {loadAccountLevelBilledUsage} = useActions(billingActions)
  const {newApp} = useActions(appsActions)

  const [appSearchValue, setAppSearchValue] = React.useState('')

  React.useEffect(() => {
    if (!userRole || !isBillingRole(userRole)) {
      return
    }

    if (account.subscriptionItem && loadAccountLevelBilledUsage) {
      loadAccountLevelBilledUsage(account)
    }
  }, [account.uuid, userRole])

  // NOTE(christoph): Using "Apps" from "account" includes deleted apps.
  // TODO(christoph): Consider alternatives to this approach
  const accountLevelApps: IApp[] = (account as any).Apps

  const hasApps = accountLevelApps?.length > 0 || apps.length > 0

  const activeTabParam = match.params.accountWorkspaceTab || AccountDashboardPathEnum.activeProjects

  let createButton: React.ReactElement
  let searchPrompt: string

  const createCamera = () => newApp({
    isWeb: true,
    isCamera: true,
  })
    .then(a => history.push(getPathForApp(account, a, AppPathEnum.edit)))

  if (activeTabParam === AccountDashboardPathEnum.modules) {
    searchPrompt = t('account_dashboard_page.search_prompt_name_only')
    createButton = (
      <Link
        className='ui button primary'
        to={{
          pathname: getPathForAccount(account, AccountPathEnum.createModule),
          state: {fromWorkspace},
        }}
      >
        {t('account_dashboard_page.link.create_new_module')}
      </Link>
    )
  } else {
    searchPrompt = t('account_dashboard_page.search_prompt_with_appkey')
    createButton = (
      <Link
        className='ui button primary'
        to={{
          pathname: getPathForAccount(account, AccountPathEnum.createProject),
          state: {
            fromWorkspace,
            isLegacyButton: false,
          },
        }}
        a8='click;xr-home;start-a-new-project-cta'
      >
        {t('account_dashboard_page.link.new_project')}
      </Link>
    )
  }

  let emptyProjectsSection

  if (!hasApps) {
    const contents = (
      <>
        <p>
          <strong>{t('account_dashboard_page.no_projects_created_yet')}</strong><br />
          {t('account_dashboard_page.click_anywhere')}
        </p>
        <img src={floatingBlocksImg} role='presentation' alt='' />
      </>
    )

    if (isCameraAccount(account)) {
      emptyProjectsSection = (
        <button
          type='button'
          className='empty-projects-section style-reset'
          onClick={createCamera}
        >
          {contents}
        </button>
      )
    } else {
      emptyProjectsSection = (
        <Link
          className='empty-projects-section'
          to={getPathForAccount(account, AccountPathEnum.createProject)}
        >
          {contents}
        </Link>
      )
    }
  }

  let totalViewsSection

  const hasTotalViews = isTotalViewsAccount(account) && !account.subscriptionItem

  if (hasTotalViews) {
    totalViewsSection = isCameraAccount(account) ? <CameraUsage /> : <WebUsage />
  }

  const onAppSearch = (e, data) => {
    setAppSearchValue(data.value)
  }

  const activeApps = apps.filter(
    a => (a.AccountUuid === account.uuid && isDashboardVisible(a) && a.hostingType !== 'INTERNAL')
  ).sort(sortByDescAccessDate)

  const externalApps = apps.filter(
    app => app.AccountUuid !== account.uuid && isDashboardVisible(app)
  ).sort(sortByDescAccessDate)

  const deletedAppsWithUsage = hasTotalViews && accountLevelApps
    ?.filter(({status}) => status === 'DELETED')
    ?.filter(({appKey}) => usage.callsByApp[appKey])

  const archivedApps = apps.filter(isArchived)

  const accountBilledUsage = billing.billedUsageByAccount[account.uuid]
  let accountLevelBilledUsageSection
  if (account.subscriptionItem && accountBilledUsage && apps.length > 0) {
    accountLevelBilledUsageSection = (
      <FluidCardContent>
        <p className='cam-section'>Usage</p>
        <CampaignUsageSection usage={accountBilledUsage} isWorkspace />
      </FluidCardContent>
    )
  }

  const availableTabs: WorkspaceTabDefinition[] = []

  if (hasApps) {
    availableTabs.push({
      path: AccountDashboardPathEnum.activeProjects,
      name: t('account_dashboard_page.tab.active_projects'),
      element: <FilteredAppCards apps={activeApps} searchValue={appSearchValue} />,
    })

    if (externalApps.length > 0) {
      availableTabs.push({
        path: AccountDashboardPathEnum.externalProjects,
        name: t('account_dashboard_page.tab.external_projects'),
        element: <FilteredAppCards
          apps={externalApps}
          searchValue={appSearchValue}
          accountFooters
        />,
      })
    }

    if (isModuleAuthorAllowed(account)) {
      availableTabs.push({
        path: AccountDashboardPathEnum.modules,
        name: t('account_dashboard_page.tab.modules'),
        element: <AccountModuleList searchValue={appSearchValue} />,
      })
    }

    if (deletedAppsWithUsage && deletedAppsWithUsage.length > 0) {
      availableTabs.push({
        path: AccountDashboardPathEnum.deletedProjects,
        name: t('account_dashboard_page.tab.deleted_projects'),
        element: (
          <>
            <p>{t('account_dashboard_page.blurb.deleted_projects')}</p>
            <FilteredAppCards
              apps={deletedAppsWithUsage}
              className='archived'
              noLink
              searchValue={appSearchValue}
            />
          </>
        ),
      })
    }

    if (archivedApps && archivedApps.length > 0) {
      availableTabs.push({
        path: AccountDashboardPathEnum.completedProjects,
        name: t('account_dashboard_page.tab.completed_projects'),
        element: <FilteredAppCards apps={archivedApps} searchValue={appSearchValue} />,
      })
    }
  }

  const activeTab = availableTabs.find(e => e.path === activeTabParam)

  if (!activeTab && activeTabParam) {
    // The URL portion for a tab is present, but it doesn't match any available tabs
    return <Redirect to={getPathForAccount(account, AccountPathEnum.workspace)} />
  }

  let assetLabButton = null
  assetLabButton = (
    <Link
      className='ui primary button basic'
      to={{
        pathname: getPathForAccount(account, AccountPathEnum.assetLab),
        state: {
          fromWorkspace,
        },
      }}
      a8='click;xr-home;asset-lab-button'
    >
      {t('account_dashboard_page.link.asset_lab')}
    </Link>
  )

  return (
    <Page className='account-page' centered={false} headerVariant='workspace'>
      <div className='section centered'>
        <WorkspaceCrumbHeading
          text={t('account_dashboard_page.heading.workspace')}
          account={account}
        />

        <ViolationNotice />

        <ErrorMessage />

        {accountLevelBilledUsageSection || totalViewsSection}

        <section
          className={combine(classes.workspaceControls, isTinyScreen && classes.tinyScreenControls)}
        >
          {isTinyScreen && (
            <>
              {assetLabButton}
              {createButton}
            </>
          )}

          {hasApps &&
            <Input
              fluid={isTinyScreen}
              className={classes.workspaceSearch}
              icon='search'
              iconPosition='left'
              placeholder={searchPrompt}
              aria-label={searchPrompt}
              value={appSearchValue}
              onChange={onAppSearch}
            />
          }

          {!isTinyScreen && (
            <>
              {assetLabButton}
              {createButton}
            </>
          )}
        </section>
      </div>

      {availableTabs.length > 1 &&
        <section className={classes.tabRow}>
          {availableTabs.map(tab => (
            <Link
              key={tab.path}
              to={getPathForAccountDashboard(account, tab.path)}
              className={combine(classes.tab, activeTab === tab && classes.activeTab)}
            >
              {tab.name}
            </Link>
          ))}
        </section>
      }
      {/* Note(Brandon): For internal weekly QA automated tests. */}
      <section id='projectsContainer' className='section centered'>
        {activeTab?.element}

        {emptyProjectsSection}
      </section>

      <div className={classes.legacyButtonContainer}>
        <Link
          to={{
            pathname: getPathForAccount(account, AccountPathEnum.createProject),
            state: {
              fromWorkspace,
              isLegacyButton: true,
            },
          }}
          className={classes.legacyButton}
        >
          <Icon stroke='code' color='black' />
          {t('account_dashboard_page.link.legacy.build_with_editor')}
        </Link>
      </div>
    </Page>
  )
}

const AccountDashboardPage: React.FC = () => {
  const account = useCurrentAccount()
  if (isUnityAccount(account)) {
    return <Page><XrAppsPage /></Page>
  } else {
    return <WebAccountDashboardPage />
  }
}

export default withAppsLoaded(AccountDashboardPage)
