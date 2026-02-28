import {join} from 'path'
import type {DeepReadonly} from 'ts-essentials'

import type {
  IAccount, IApp, IExternalAccount, IFullAccount, IModule, IPublicApp,
} from './types/models'
import type {IPost, ITopic} from '../../shared/cms-models'
import type {RootState} from '../reducer'
import type {AppStatus} from './types/db'
import {isCloudStudioApp} from '../../shared/app-utils'

enum PurchaseLicensePathEnum {
  selectProjectType = 'select-project-type',
  selectLicense = 'select-license',
  thankYou = 'thank-you'
}

// Test

enum AppPathEnum {
  project = 'project',
  settings = 'settings',
  purchase = 'purchase',
  edit = 'edit',
  files = 'files',
  modules = 'modules',
  history = 'history',
  targets = 'targets',
  featureProject = 'feature-project',
  geospatialBrowser = 'geospatial-browser',
  selfHostedModules = 'project-modules',
  simulator = 'simulator',
  studio = 'studio',
  codeEditor = 'code-editor',
}

enum AccountPathEnum {
  workspace = 'workspace',
  team = 'team',
  publicProfile = 'public-profile',
  account = 'account',
  createProject = 'create-project',
  createModule = 'create-module',
  duplicateProject = 'duplicate-project',
  importModule = 'import-module',
  module = 'module',
  external = 'external',
  adManager = 'ad-manager',
  createAd = 'create-ad',
  assetLab = 'asset-lab',  // NOTE(dat): used when BuildIf.ASSET_LAB_20250402 is enabled
}

enum AccountDashboardPathEnum {
  activeProjects = '',
  modules = 'modules',
  deletedProjects = 'deleted',
  completedProjects = 'completed',
  externalProjects = 'external',
}

enum WorkspaceProfilePathEnum {
  projects = '',
  modules = 'modules',
}

enum ModulePathEnum {
  files = 'files',
  history = 'history',
  settings = 'settings'
}

enum DependencyApiEnum {
  import = 'import'
}

enum PaymentsCheckoutContainerEnum {
  root = 'checkout',
  live = '',
  test = 'test'
}

enum PaymentsCheckoutEnum {
  checkout = '',
  confirmation = 'confirmation'
}

const PROJECT_LIBRARY_PATH = '/projects'

const MODULE_LIBRARY_PATH = '/modules'

const PRODUCT_PATH = 'products'

const getRootPath = () => '/'

const getPathForMyProjectsPage = () => '/my-projects'

const getPathForLoginPage = () => '/login'

const getPathForSignUpPage = () => '/sign-up'

const getPathForProfilePage = () => '/profile'

const getPathForWorkspacesPage = () => '/workspaces'

const getPathForServiceUnavailablePage = () => '/unavailable'

type AccountOrName = Pick<IAccount, 'shortName'> | string

type AccountRootSpecifier = AccountOrName | {member: AccountOrName, external?: AccountOrName}

type AppOrName = Pick<IApp, 'appName'> | string

type HostingTypeApp = Pick<IApp, 'appName' | 'hostingType'>

type ModuleOrName = Pick<IModule, 'name'> | string

const getShortname = (account: AccountOrName) => (
  typeof account === 'string' ? account : account.shortName || ''
)

const pathForModuleDependencyApi = (action: DependencyApiEnum) => (
  appUuid: string, moduleUuid: string
) => (
  `/v1/module-dependency/${action}/${appUuid}/${moduleUuid}`
)

const pathForDependencyImport = pathForModuleDependencyApi(DependencyApiEnum.import)

const getPathForCheckoutConfirmation = (match, orderId?: string) => {
  const path = join(match.path, PaymentsCheckoutEnum.confirmation)
  return `${path}${orderId ? `?order=${orderId}` : ''}`
}

const getAccountEditPath = (account: AccountOrName) => (
  join('/workspaces/', getShortname(account))
)

const getAccountRootPath = (account: AccountRootSpecifier): string => {
  if (account === undefined) {
    throw new Error('You have to provide an account to get an account root path')
  }

  if (typeof account === 'string') {
    return join(getRootPath(), account)
  }

  if ('external' in account && !!account.external) {
    const {external, member} = account
    return join(
      getRootPath(),
      getShortname(member),
      AccountPathEnum.external,
      getShortname(external)
    )
  }

  if ('member' in account) {
    return join(getRootPath(), getShortname(account.member))
  }

  return join(getRootPath(), getShortname(account as AccountOrName))
}

const getPathForAccount = (account: AccountRootSpecifier, page: AccountPathEnum | '' = '') => {
  const pageToUse = page || AccountPathEnum.workspace
  return join(getAccountRootPath(account), pageToUse)
}

enum SignUpPathEnum {
  step1Register = 'get-started',
  step2VerifyEmail = 'verify-email',
}

/*
  public paths:
    - /awe
    - /awe/portal
  private paths:
    - /awe/workspace
    - /awe/team
    - /awe/portal/project
    - /awe/portal/settings
*/

const isPrivatePath = (path) => {
  const pathSplit = path.split('/')

  return (
    Object.values(AccountPathEnum).includes(pathSplit[2]) ||
    Object.values(AppPathEnum).includes(pathSplit[3])
  )
}

type BranchEnum = 'code' | 'master' | 'published' | ''

type ModuleBranchEnum = 'code' | 'release-notes' | ''

const getPathForAccountOnboarding = () => '/workspace-onboarding' as const

const getPathForSignUp = (step: SignUpPathEnum) => `/${step}`

const formatSlug = (slug: string) => slug.replace('/', '')

const getPathForPost = (post: IPost) => (
  `/blog/post/${post.id}${post.slug}`
)

const getPathForTopic = (topic: ITopic) => (
  `/blog/${topic.id}${topic.slug.startsWith('/') ? topic.slug : `/${topic.slug}`}`
)

const getPathForApp = (
  account: AccountRootSpecifier,
  app: AppOrName,
  page: AppPathEnum | '' = ''
) => {
  const pageToUse = page || AppPathEnum.project
  return join(
    getAccountRootPath(account),
    typeof app === 'string' ? app : app.appName || '',
    pageToUse
  )
}

const getPathForAccountDashboard = (account: AccountOrName, subPage: AccountDashboardPathEnum) => (
  join(getAccountRootPath(account), AccountPathEnum.workspace, subPage)
)

const getPathForModules = (account: AccountOrName) => (
  getPathForAccountDashboard(account, AccountDashboardPathEnum.modules)
)

const getPathForModule = (account: AccountOrName, module: ModuleOrName, page: ModulePathEnum) => (
  join(
    getAccountRootPath(account),
    AccountPathEnum.module,
    encodeURIComponent(typeof module === 'string' ? module : module.name),
    page
  )
)

const getPathForModuleFile = (account: AccountOrName, module: ModuleOrName, path: string) => (
  join(getPathForModule(account, module, ModulePathEnum.files), path)
)

const getPathForLicensePurchase = (
  account: AccountRootSpecifier,
  app: AppOrName
) => (
  join(getPathForApp(account, app, AppPathEnum.purchase), PurchaseLicensePathEnum.selectLicense)
)

const getPathPrefixForLicensePurchase = (
  account: AccountRootSpecifier,
  app: AppOrName
) => getPathForApp(
  account, app, AppPathEnum.purchase
)

const getPathForAppNoTrailing = (account: AccountRootSpecifier, app: AppOrName) => (
  join(getAccountRootPath(account), typeof app === 'string' ? app : app.appName || '')
)

const getHashForFile = (line: number, column?: number) => {
  const lineHashFragment = line ? `#L${line}` : ''
  const columnHashFragment = column ? `C${column}` : ''
  return lineHashFragment ? lineHashFragment + columnHashFragment : ''
}

const getPathForFile = (
  account: AccountRootSpecifier,
  app: HostingTypeApp,
  file: string,
  line?: number,
  column?: number
) => {
  const {appName} = app
  const hash = getHashForFile(line, column)
  if (isCloudStudioApp(app)) {
    const params = new URLSearchParams()
    if (file) {
      params.set('file', file)
    }
    return `${getPathForApp(account, appName, AppPathEnum.studio)}?${params.toString()}${hash}`
  } else {
    return join(getPathForApp(account, appName, AppPathEnum.files), file || '') + hash
  }
}

const getPathForDependency = (
  account: AccountRootSpecifier,
  app: HostingTypeApp,
  alias: string
) => {
  const {appName} = app
  if (isCloudStudioApp(app)) {
    const params = new URLSearchParams()
    params.set('module', alias)
    return `${getPathForApp(account, appName, AppPathEnum.studio)}?${params.toString()}`
  } else {
    return `${getPathForApp(account, appName, AppPathEnum.modules)}/${alias}`
  }
}

const getPublicPathForAccount = (account: AccountOrName) => (
  join(getRootPath(), typeof account === 'string' ? account : account.shortName)
)

const getPublicPathForApp = (account: AccountOrName, app: AppOrName) => (
  join(getPublicPathForAccount(account), typeof app === 'string' ? app : app.appName)
)

const getPublicPathForModule = (account: AccountOrName, module: ModuleOrName) => (
  join(
    getPublicPathForAccount(account), WorkspaceProfilePathEnum.modules,
    typeof module === 'string' ? module : module.name
  )
)

const getPublicPathForModuleImport = (account: AccountOrName, module: ModuleOrName) => (
  join(
    '/import-module/',
    getPublicPathForAccount(account),
    typeof module === 'string' ? module : module.name
  )
)

/** Generate the public browse page sub-path :branch?/:action?/:repoPath*
 *
 * Example: get path to master branch, listing folder /assets for app 8w.JsDev
 * join(getPathForApp('8w', 'JsDev', 'public'), getSubPathForBrowse('master', '/assets'))
 */
const getSubPathForBrowse = (
  branch: string, repoPath: string
): string => join(branch, repoPath)

const GeospatialBrowserActionPathList = [
  'new-wayspot',
  'create-wayspot',
  'edit-wayspot',
  'created-wayspot',
  'created-private-poi',
  'create-private-poi',
  'scan-wayspot',
  'scaniverse-scan-wayspot',
  'scaniverse-add-to-map',
  'scaniverse-create-location',
  'scaniverse-create-private-location',
  'scaniverse-check-duplicate-location',
  'scaniverse-created-location',
  'scaniverse-created-private-location',
  null,
] as const

type GeospatialBrowserActionPath = (typeof GeospatialBrowserActionPathList)[number]

const isGeospatialBrowserActionPath = (a: string) => GeospatialBrowserActionPathList.includes(a)

// Default val points to Cal Ave, Palo Alto at a queryable zoom level.
const DEFAULT_LAT = 37.42719713395148
const DEFAULT_LNG = -122.14444468820648
const DEFAULT_ZOOM = 15
const getGeospatialBrowserFullPath = (
  basePath: string,
  lat: number = DEFAULT_LAT,
  lng: number = DEFAULT_LNG,
  zoom: number = DEFAULT_ZOOM,
  nodeId: string = null,
  poiId: string = null,
  action: GeospatialBrowserActionPath = null
): string => join(
  basePath,
  [
    lat?.toString() || '',
    lng?.toString() || '',
    zoom,
    nodeId || '',
    poiId || '',
  ].join(','),
  action || ''
)

const getGeospatialBrowserPath = (
  account: AccountRootSpecifier,
  app: AppOrName,
  lat: number = DEFAULT_LAT,
  lng: number = DEFAULT_LNG,
  zoom: number = DEFAULT_ZOOM,
  nodeId: string = null,
  poiId: string = null,
  action: GeospatialBrowserActionPath = null
): string => getGeospatialBrowserFullPath(
  getPathForApp(account, app, AppPathEnum.geospatialBrowser),
  lat,
  lng,
  zoom,
  nodeId,
  poiId,
  action
)

interface GeoBrowseParam {
  latitude?: number
  longitude?: number
  zoom?: number
  nodeId?: string
  poiId?: string
}
const getGeospatialBrowseParam = ({browseInfo}): GeoBrowseParam => {
  const parsedParam: GeoBrowseParam = {
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
    zoom: DEFAULT_ZOOM,
    nodeId: null,
    poiId: null,
  }
  if (!browseInfo) {
    return parsedParam
  }

  const browseInfoPieces = browseInfo.split(',')
  if (browseInfoPieces.length > 0) {
    parsedParam.latitude = parseFloat(browseInfoPieces[0])
  }
  if (browseInfoPieces.length > 1) {
    parsedParam.longitude = parseFloat(browseInfoPieces[1])
  }
  if (browseInfoPieces.length > 2) {
    parsedParam.zoom = parseFloat(browseInfoPieces[2])
  }
  if (browseInfoPieces.length > 3) {
    // eslint-disable-next-line prefer-destructuring
    parsedParam.nodeId = browseInfoPieces[3]
  }
  if (browseInfoPieces.length > 4) {
    // eslint-disable-next-line prefer-destructuring
    parsedParam.poiId = browseInfoPieces[4]
  }
  return parsedParam
}

/// /////////////////////////////////////
// State selectors from route parameters

const getRouteExternalAccount = (state: RootState, match): IExternalAccount => {
  const memberAccountShortName = match.params.account
  const externalAccountShortName = match.params.externalAccount

  if (!externalAccountShortName) {
    return null
  }

  const uuids = state.crossAccountPermissions.byFromAccountShortname[externalAccountShortName] || []
  const permission = uuids.map(uuid => state.crossAccountPermissions.entities[uuid])
    .find(({ToAccount}) => (
      ToAccount.shortName === memberAccountShortName
    ))
  return permission?.FromAccount
}

const getRouteMemberAccount = (state: RootState, match): IFullAccount => {
  const selectedShortName = match.params.account
  return state.accounts.allAccounts.find(({shortName}) => shortName === selectedShortName)
}

const getRouteAccount = (state: RootState, match) => {
  if (match.params.externalAccount) {
    return getRouteExternalAccount(state, match)
  }

  return getRouteMemberAccount(state, match)
}

type ModuleMatch = {params: {account: string, moduleName: string}}

const getRouteModule = (state: RootState, match: ModuleMatch): IModule => {
  const {moduleName} = match.params
  const account = getRouteAccount(state, match)
  // 1. select current list of modules for this account uuid
  // 2. select all modules from that list
  // 3. find the module with that shortname
  return state.modules.byAccountUuid?.[account.uuid]?.map(
    uuid => state.modules.entities[uuid]
  ).find(({name}) => name === moduleName)
}

const getRouteApp = (state, match) => {
  const selectedAppName = match.params.routeAppName

  const routeAccount = getRouteAccount(state, match)
  const findFunction = (({appName, AccountUuid}) => (
    appName === selectedAppName && AccountUuid === routeAccount?.uuid
  ))

  const app = state.apps.find(findFunction)
  if (app) {
    return app
  }

  if (match.params.account) {
    const account = state.accounts.allAccounts.find(a => a.shortName === match.params.account)
    if (!account) {
      return null
    }

    return account.Apps.find(a => a.appName === selectedAppName)
  }
  return null
}

const getRouteFromAccount = (state: RootState, match: DuplicatePathMatch) => {
  const selectedShortName = match.params.fromAccount
  const account = state.accounts.allAccounts.find(({shortName}) => shortName === selectedShortName)
  if (account) {
    return account
  }

  // Fallback to publicBrowse if account is not found
  const accountUuid = state.publicBrowse.accountByName[selectedShortName]
  if (accountUuid) {
    return state.publicBrowse.Accounts[accountUuid]
  }
  return null
}

type DuplicatePathMatch = {params: {routeAppName: string, fromAccount: string}}

const getRouteFromApp = (state: RootState, match: DuplicatePathMatch) => {
  const {routeAppName, fromAccount} = match.params

  if (!fromAccount || !routeAppName) {
    return null
  }

  const ownAccount = state.accounts.allAccounts.find(a => a.shortName === fromAccount)

  const expectedAccountUuid = ownAccount?.uuid || state.publicBrowse.accountByName[fromAccount]

  if (!expectedAccountUuid) {
    return null
  }

  type MinimalApp = {
    appName: string
    status: AppStatus
    Account?: IPublicApp['Account']
    AccountUuid?: string
  }

  const findMatchingApp = <T extends MinimalApp>(apps: DeepReadonly<T[]>) => apps.find(app => (
    app &&
    app.appName === routeAppName &&
    app.status !== 'DELETED' &&
    (app.AccountUuid || app.Account) === expectedAccountUuid
  ))

  return (
    findMatchingApp(state.apps) ||
    (ownAccount && findMatchingApp(ownAccount.Apps)) ||
    findMatchingApp([state.publicBrowse.Apps[state.publicBrowse.appByName[routeAppName]]]) ||
    findMatchingApp(Object.values(state.publicBrowse.Apps))
  )
}

const resolveServerRoute = (path: string) => (
  Build8.PLATFORM_TARGET === 'desktop'
    ? new URL(path, 'desktop://server')
    : path
)

export {
  PurchaseLicensePathEnum,
  AppPathEnum,
  AccountPathEnum,
  ModulePathEnum,
  AccountDashboardPathEnum,
  WorkspaceProfilePathEnum,
  PaymentsCheckoutContainerEnum,
  PaymentsCheckoutEnum,
  getAccountEditPath,
  getAccountRootPath,
  getPathForAccountDashboard,
  getPathForAccountOnboarding,
  getPathForCheckoutConfirmation,
  getPathForModules,
  getPathForModuleFile,
  getRootPath,
  getPathForMyProjectsPage,
  getPathForLoginPage,
  getPathForSignUpPage,
  getPathForProfilePage,
  getPathForWorkspacesPage,
  getPathForServiceUnavailablePage,
  getPathForAccount,
  SignUpPathEnum,
  BranchEnum,
  ModuleBranchEnum,
  getPathForSignUp,
  formatSlug,
  getPathForPost,
  isPrivatePath,
  getPathForTopic,
  getPathForApp,
  getPathForModule,
  getPathForLicensePurchase,
  getPathPrefixForLicensePurchase,
  getPathForAppNoTrailing,
  getHashForFile,
  getPathForFile,
  getPathForDependency,
  getPublicPathForAccount,
  getPublicPathForApp,
  getPublicPathForModule,
  getPublicPathForModuleImport,
  getSubPathForBrowse,
  GeoBrowseParam,
  getGeospatialBrowseParam,
  getGeospatialBrowserPath,
  getGeospatialBrowserFullPath,
  getRouteAccount,
  getRouteMemberAccount,
  getRouteExternalAccount,
  getRouteApp,
  getRouteFromAccount,
  getRouteFromApp,
  getRouteModule,
  DependencyApiEnum,
  pathForDependencyImport,
  pathForModuleDependencyApi,
  isGeospatialBrowserActionPath,
  resolveServerRoute,
  PROJECT_LIBRARY_PATH,
  MODULE_LIBRARY_PATH,
  PRODUCT_PATH,
  DEFAULT_LAT,
  DEFAULT_LNG,
  DEFAULT_ZOOM,
}

export type {
  AccountRootSpecifier,
  AccountOrName,
  AppOrName,
  GeospatialBrowserActionPath,
  ModuleMatch,
  HostingTypeApp,
}
