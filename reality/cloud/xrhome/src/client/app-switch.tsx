import * as React from 'react'
import {Switch, Route, Redirect, useLocation} from 'react-router-dom'

import {Loader} from './ui/components/loader'
import {FILE_NAME_WITH_PATH_ALLOWED_CHARS} from '../shared/app-constants'
import {PaymentsCheckoutContainerEnum, isPrivatePath} from './common/paths'
import {SignUpPathEnum, getPathForAccountOnboarding} from './common/paths'
import {
  withAccountsLoaded,
  withUserLoaded,
  withLoginLoaded,
} from './common/with-state-loaded'
import {ExternalRedirect} from './common/external-redirect'
import {registerRoute} from './user'

import './static/styles/account-deep-link.scss'
import './static/styles/code-editor.scss'
// These Pages are being serverside rendered which doesn't work with React.lazy load. That's why we
// are not lazy loading them here.
import PublicBrowsePage from './browse/public-browse-page'
import HomePage from './home/home-page'
import HomePageOld from './home/home-page-old'
import WorkspaceProfilePage from './browse/workspace-profile-page'
import BlogPortalPage from './blog/portal-page'
import BlogPostPage from './blog/post-page'
import DiscoveryPage from './discovery/discovery-page'
import ProjectLibraryPage from './project-library/project-library-page'
import ProjectLibraryPageOld from './project-library/project-library-page-old'
import {useContentGroup} from './hooks/use-content-group'
import {WorkspaceContainer} from './workspace-container'
import {FREEFORM_PATH, PREDETERMINED_PATH} from '../shared/discovery-constants'
import ModulePublicBrowsePage from './browse/module-public-browse-page'
import ModuleLibraryPage from './project-library/module-library-page'
import {useUserConfirmed, useUserHasSession} from './user/use-current-user'
import {isSpecialFeatureEnabled} from '../shared/account-utils'
import {CLOUD_STUDIO_BETA} from '../shared/special-features'
import {useSelector} from './hooks'
import {ContentGroups} from '../shared/content-groups'
import {CMS_PATHS} from '../shared/cms-constants'
import {withPageTheme, withExteriorPageTheme} from './ui/theme-provider'

const EmailVerificationSignUpPage = React
  .lazy(() => import('./user/sign-up/email-verification-sign-up-page'))
const RegisterOrJoinPage = React.lazy(
  () => import('./user/register-or-join-page')
)
const NianticIdSignUpPage = React.lazy(() => import('./user/sign-up/niantic-id-sign-up-page'))

const MyProjectsPage = React.lazy(() => import('./home/my-projects-page'))
const ProfilePage = React.lazy(() => import('./user/profile-page'))

const ServiceUnavailablePage = React.lazy(() => import('./home/service-unavailable-page'))

const DesktopLoginPage = React.lazy(() => import('./user/desktop-login-page'))
const LoginPage = React.lazy(() => (import('./user/niantic-id-login-page')))
const NianticIdLoginPage = React.lazy(() => import('./user/niantic-id-login-page'))
const WayfarerLoginPage = React.lazy(() => import('./user/wayfarer-login-page'))
const LogoutPage = React.lazy(() => import('./user/logout-page'))
const ForgotPage = React.lazy(() => import('./user/forgot-page'))
const SetNewPasswordPage = React.lazy(() => import('./user/set-new-password-page'))
const SsoPage = React.lazy(() => import('./user/sso-page'))

const DownloadPage = React.lazy(() => import('./home/download-page'))
const NotFoundPage = React.lazy(() => import('./home/not-found-page'))

const AccountsPage = React.lazy(() => import('./accounts/accounts-page'))
const NewAppPage = React.lazy(() => import('./apps/new-app-page'))
const DuplicateAppPage = React.lazy(() => import('./apps/duplicate-app-page'))
const ModuleImportPage = React.lazy(() => import('./modules/module-import-page'))
const PartnersPage = React.lazy(() => import('./partners/partners-page'))
const LinkPage = React.lazy(() => import('./hmd-link/hmd-link-page'))
const PaymentsCheckoutContainer = React.lazy(() => import('./checkout/payments-checkout-container'))
const IdentityTestPage = React.lazy(() => import('./identity/identity-test-page'))
const CloudStudioPage = React.lazy(() => import('./studio/cloud-studio-page'))
const ScaniverseMapContainer = React.lazy(() => import('./scaniverse/scaniverse-map-container'))
const PricingPage = React.lazy(() => import('./pricing/pricing-page'))
const OldPricingPage = React.lazy(() => import('./pricing/pricing-page-old'))
const DpaPage = React.lazy(() => import('./legal/dpa-page'))
const CopyrightDisputePolicyPage = React.lazy(
  () => import('./legal/copyright-dispute-policy-page')
)
const GuidelinesPage = React.lazy(() => import('./legal/guidelines-page'))
const PrivacyPage = React.lazy(() => import('./legal/privacy-page'))
const TomsPage = React.lazy(() => import('./legal/toms-page'))
const TermsPage = React.lazy(() => import('./legal/terms-page'))
const OpenSourceLicensesPage = React.lazy(() => import('./legal/open-source-licenses-page'))

const AccountOnboardingPage = React.lazy(
  () => import('./accounts/onboarding/account-onboarding-page')
)

const CmsPage = React.lazy(() => import('./widgets/cms-page'))

interface PageInfo {
  key?: string
  path: `/${string}` | `/${string}`[]
  component: React.ComponentType<any>
  exact?: boolean
  contentGroup?: string
}

type WorkspacePageParams = {
  account: string
}

type PublicBrowsePageParams = {
  branch?: string
  repoPath?: string
}

const filteredPages = (pages: PageInfo[]): PageInfo[] => pages.filter(Boolean)

const loggedOutPages = filteredPages([
  {
    path: '/forgot',
    component: withExteriorPageTheme(ForgotPage),
  },
  {
    path: '/set-new-password',
    component: withExteriorPageTheme(SetNewPasswordPage),
  },
])

const confirmedPages = filteredPages([
  {
    path: '/my-projects',
    component: MyProjectsPage,
  },
  {
    path: '/sso',
    component: withUserLoaded(SsoPage),
  },
  {
    path: '/profile',
    component: withUserLoaded(ProfilePage),
  },
  {
    path: '/create-project',
    component: withAccountsLoaded(NewAppPage),
  },
  {
    path: getPathForAccountOnboarding(),
    component: withPageTheme(AccountOnboardingPage, 'brand8dark'),
  },
  {
    path: '/workspaces/:routeAccountName?',
    component: AccountsPage,
  },
  {
    path: '/duplicate-project/:fromAccount/:routeAppName',
    component: withAccountsLoaded(DuplicateAppPage),
  },
  {
    path: '/scaniverse-developer/map/:browseInfo?',
    component: withAccountsLoaded(ScaniverseMapContainer),
    exact: false,
  },
  {
    path: '/import-module/:fromAccount/:moduleName',
    component: ModuleImportPage,
  },
])

const workspacePage: PageInfo = {
  path: '/:account/:appNameOrPage?',
  component: withAccountsLoaded(WorkspaceContainer),
  exact: false,
}

const alwaysPages = filteredPages([
  {
    path: '/',
    component: BuildIf.BRANDING_REFRESH_HOMEPAGE_20251006
      ? withPageTheme(HomePage, 'brand8dark')
      : HomePageOld,
  },
  {
    path: '/desktop-login',
    component: withPageTheme(DesktopLoginPage, 'brand8dark'),
  },
  {
    path: '/login',
    component: withExteriorPageTheme(LoginPage),
  },
  BuildIf.EXPERIMENTAL && {path: '/login-identity-test', component: NianticIdLoginPage},
  {
    path: '/projects',
    component: withExteriorPageTheme(
      BuildIf.PROJECT_LIBRARY_REVAMP_20250929
        ? ProjectLibraryPage
        : ProjectLibraryPageOld
    ),
  },
  {
    path: '/modules',
    component: withExteriorPageTheme(ModuleLibraryPage),
  },
  {
    path: `/${PaymentsCheckoutContainerEnum.root}`,
    component: PaymentsCheckoutContainer,
    exact: false,
  },
  {
    path: '/unavailable',
    component: ServiceUnavailablePage,
  },
  // This 3-step flow can be used by both existing user and new unconfirmed users
  {
    path: `/${SignUpPathEnum.step1Register}`,
    component: withExteriorPageTheme(NianticIdSignUpPage),
  },
  {
    path: '/blog',
    component: withExteriorPageTheme(BlogPortalPage),
  },
  {
    path: '/blog/post/:postId/:postSlug?',
    component: withExteriorPageTheme(BlogPostPage),
  },
  {
    path: '/blog/:topicId/:topicSlug',
    component: withExteriorPageTheme(BlogPortalPage),
  },
  {
    path: '/partners',
    component: withExteriorPageTheme(PartnersPage),
  },
  {
    path: '/link',
    component: LinkPage,
  },
  {
    path: `/${FREEFORM_PATH}`,
    component: withExteriorPageTheme(DiscoveryPage),
  },
  {
    path: `/${PREDETERMINED_PATH}/:keyword?`,
    component: withExteriorPageTheme(DiscoveryPage),
  },
  {
    path: '/logout',
    component: LogoutPage,
  },
  {
    path: '/login/wayfarer',
    component: WayfarerLoginPage,
  },
  // TODO(Brandon): Remove this when we're done testing identity ui.
  BuildIf.MATURE && {
    path: '/identity-test',
    component: IdentityTestPage,
  },
  {
    path: registerRoute,
    component: withExteriorPageTheme(RegisterOrJoinPage),
  },
  {
    path: '/pricing',
    component: BuildIf.BRANDING_REFRESH_PRICING_20251008
      ? withPageTheme(PricingPage, 'brand8dark')
      : OldPricingPage,
  },
  {
    path: '/download',
    component: withPageTheme(DownloadPage, 'brand8dark'),
  },
  {
    path: '/custom',
    component: () => <ExternalRedirect url='https://8th.io/update' />,
  },
  BuildIf.CMS_EMBEDDED_20250911 && {
    path: CMS_PATHS.flatMap(p => [`/${p}`, `/${p}/`, `/${p}/*`]) as `/${string}`[],
    component: CmsPage,
  },
])

const cloudStudioPage = filteredPages([
  {
    path: '/cloud-studio',
    component: CloudStudioPage,
  },
])

const loggedInPages = filteredPages([
  {
    path: `/${SignUpPathEnum.step2VerifyEmail}`,
    component: EmailVerificationSignUpPage,
  },
])

const toHomeRedirect = (page: PageInfo): PageInfo => (
  {...page, component: () => <Redirect to='/' />}
)
const publicPages = filteredPages([
  {
    path: '/dpa',
    component: withExteriorPageTheme(DpaPage),
  },
  {
    path: '/copyright-dispute-policy',
    component: withExteriorPageTheme(CopyrightDisputePolicyPage),
  },
  {
    path: '/guidelines',
    component: withExteriorPageTheme(GuidelinesPage),
  },
  {
    path: '/privacy',
    component: withExteriorPageTheme(PrivacyPage),
  },
  {
    path: '/toms',
    component: withExteriorPageTheme(TomsPage),
  },
  {
    path: '/terms',
    component: withExteriorPageTheme(TermsPage),
  },
  {
    path: '/open-source-licenses',
    component: withExteriorPageTheme(OpenSourceLicensesPage),
  },
  {
    path:
    `/:account/modules/:moduleName/:branch?/:repoPath(${FILE_NAME_WITH_PATH_ALLOWED_CHARS}{0,})?`,
    component: withExteriorPageTheme(ModulePublicBrowsePage),
    contentGroup: ContentGroups.FEATURED_MODULES,
  },
  {
    path:
    '/:account/modules',
    component: withExteriorPageTheme(WorkspaceProfilePage),
    contentGroup: ContentGroups.PUBLIC_PROFILES,
  },
  {
    path: '/:account',
    component: withExteriorPageTheme(WorkspaceProfilePage),
    contentGroup: ContentGroups.PUBLIC_PROFILES,
  },
  {
    path:
    `/:account/:routeAppName/:branch?/:repoPath(${FILE_NAME_WITH_PATH_ALLOWED_CHARS}{0,})?`,
    component: withExteriorPageTheme(PublicBrowsePage),
    contentGroup: ContentGroups.FEATURED_PROJECTS,
  },
])

const needsConfirmationRedirect: PageInfo = {
  key: 'confirmation-redirect',
  path: '/',
  component: () => <Redirect to={registerRoute} />,
}

const notFoundPage: PageInfo = {
  key: '404',
  path: '/',
  component: withExteriorPageTheme(NotFoundPage),
  exact: false,
}

const AppSwitch: React.FC = () => {
  const userConfirmed = useUserConfirmed()
  const isLoggedIn = useUserHasSession()

  const studioPlaygroundVisible = useSelector(s => (
    BuildIf.STUDIO_PLAYGROUND_20240508 ||
    s.accounts.allAccounts.some(
      account => isSpecialFeatureEnabled(account, CLOUD_STUDIO_BETA)
    )))

  const getVisiblePages = (latestPath: string): PageInfo[] => (
    [
      isLoggedIn ? loggedOutPages.map(toHomeRedirect) : loggedOutPages,
      isLoggedIn && loggedInPages,
      alwaysPages,
      isLoggedIn && userConfirmed === false && needsConfirmationRedirect,
      studioPlaygroundVisible && cloudStudioPage,
      userConfirmed && confirmedPages,
      isPrivatePath(latestPath) ? (userConfirmed && workspacePage) : publicPages,
      notFoundPage,
    ].flat().filter(Boolean)
  )

  useContentGroup(getVisiblePages)

  const location = useLocation()

  return (
    <React.Suspense fallback={<Loader />}>
      <Switch>{getVisiblePages(location.pathname).map(({key, path, exact, ...rest}: PageInfo) => (
        <Route
          key={key || (Array.isArray(path) ? path.join(',') : path)}
          path={path}
          exact={exact !== false}
          {...rest}
        />
      ))}
      </Switch>
    </React.Suspense>
  )
}

export default withLoginLoaded(AppSwitch)

export type {
  PageInfo,
  WorkspacePageParams,
  PublicBrowsePageParams,
}
