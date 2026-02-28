import {
  isBasic, isPro, isBusiness, isEnterprise, isUpgradedWebAccount,
  isAppSharingEnabled, canUserShareApp, PickAccount,
  isWebAccount,
} from './account-utils'
import {
  NUM_DEFAULT_COVER_IMAGES,
  COVER_IMAGE_PREVIEW_SIZES,
  MAX_APP_TAG_LENGTH,
  SPLASH_SCREEN_TYPES,
} from './app-constants'
import {isNegativeWord} from './blacklist-words'
import type {IApp} from '../client/common/types/models'
import type {
  AppBuildSettingsSplashScreen, AppCommercialStatus, UserAccountRole,
} from '../client/common/types/db'
import type {App as DbApp} from './integration/db/models'
import {isBillingRole} from './roles-utils'

const INVALID_APP_NAMES = [
  'xrweb', 'xrweb.js', 'xrwebverify', 'v', 'token', 'verify', 'ipfs', 'modules', 'module',
  'workspace', 'team', 'public-profile', 'account', 'create-project', 'duplicate-project',
  'create-module', 'external', 'shared', 'xrlayers', 'xrconfig', 'import-module', 'ad-manager',
  'create-ad', 'asset-lab',
] as readonly string[]

const appNamePattern = '^[a-z0-9]{1}[a-z0-9-]{3,127}$'
const appNameRegex = new RegExp(appNamePattern)

/* An acceptable app name should only be 4-128 chars long,
   and consist of only lowercase, numbers, '_', or '-' */
const isOkAppName = (appName: string) => typeof appName === 'string' &&
  appNameRegex.test(appName) &&
  !INVALID_APP_NAMES.includes(appName)

type PickApp<T extends keyof (IApp | DbApp)> = Pick<IApp | DbApp, T>

type CommercialCheck =(app: PickApp<'isCommercial' | 'commercialStatus' | 'status'>) => boolean
type StatusCheck =(app: PickApp<'status'>) => boolean

/**
 * Determines whether an app is non-commercial.
 */
const isNonCommercial: CommercialCheck = app => !app.isCommercial && !app.commercialStatus

/**
 * Determines whether the app is commercial.
 */
const isCommercial: CommercialCheck = app => app.isCommercial || !!app.commercialStatus

/**
 * Determines whether the app has a develop license. If this is true, then `isCommercial`
 * will always return true as well.
 */
const hasDevelopLicense: CommercialCheck = app => app.commercialStatus === 'DEVELOP'

/**
 * Determines whether the app is on a launch license. If this is true, then `isCommercial`
 * will always return true as well.
 */
const hasLaunchLicense: CommercialCheck = app => app.commercialStatus === 'LAUNCH'

const isArchived: CommercialCheck = app => (['COMPLETE', 'CANCELED'].includes(app.commercialStatus))

const isActive: CommercialCheck = app => (app.status !== 'DELETED' && !isArchived(app))

const isDeleted: StatusCheck = app => (app.status === 'DELETED')

const isLegacyDevelop: CommercialCheck = app => app.isCommercial && hasDevelopLicense(app)

const isUnpaidCommercial: CommercialCheck = app => app.isCommercial && !app.commercialStatus

const isPaidCommercial: CommercialCheck = app => app.isCommercial && hasLaunchLicense(app)

const isActiveCommercialApp: CommercialCheck = app => isPaidCommercial(app) || isLegacyDevelop(app)

const isInternalApp = app => app.hostingType === 'INTERNAL'

/**
 *
 * Retrieves the very next commercial status
 * that the current STATUS corresponds to.
 */
const getStatusUpgrade = (status: AppCommercialStatus) => {
  switch (status) {
    case null:
    case 'DEMO':
      return 'DEVELOP'
    case 'DEVELOP':
      return 'LAUNCH'
    default:
      return null
  }
}

const getAppStatusUpgrade = (app: PickApp<'isCommercial' | 'commercialStatus' | 'status'>) => {
  const isUpgradeableNonCommercialApp = isNonCommercial(app)
  const isUpgradeableArchived = isArchived(app)
  const isUnpaidCommercialApp = app?.isCommercial && !app?.commercialStatus
  const isLegacyDevelopApp = app?.isCommercial && app?.commercialStatus === 'DEVELOP'
  const canUpgradeToLaunch = isUpgradeableNonCommercialApp ||
    isUnpaidCommercialApp || isLegacyDevelopApp || isUpgradeableArchived
  return canUpgradeToLaunch ? 'LAUNCH' : null
}

/**
 * Determines whether the provided app can be upgraded to a new license.
 */
const canUpgradeApp = (account: PickAccount<'accountType'>, app: PickApp<'commercialStatus'>) => (
  (isPro(account) || isBusiness(account)) &&
  !!getStatusUpgrade(app.commercialStatus)
)

// TODO(wayne): Define a more accurate regex for filtering tag string
/* eslint-disable-next-line no-control-regex */
const isASCII = (str: string) => /^[\x00-\xFF]*$/.test(str)  // extended ASCII

const isValidAppTagString = (tagString: string) => (
  tagString.trim().length > 0 &&  // not an empty/all-space string
  tagString.trim().length === tagString.length &&  // with leading or trailing spaces
  tagString.length <= MAX_APP_TAG_LENGTH &&  // less than max length
  isASCII(tagString) &&  // is extended ASCII
  tagString === tagString.toLowerCase() &&  // is all lowercase
  !isNegativeWord(tagString)
)

type Tag = {readonly name: string}

const isValidAppTag = (tag: Tag) => {
  if (typeof tag?.name !== 'string') {
    return false
  }

  return isValidAppTagString(tag.name)
}

const isValidAppTags = (tags: readonly Tag[]) => tags.every(tag => isValidAppTag(tag))

const canUpgradeAppToUnpaidCommercial = (
  account: PickAccount<'accountType'>,
  app: PickApp<'isCommercial' | 'commercialStatus' | 'status'>
) => isNonCommercial(app) && isUpgradedWebAccount(account)

const canUpgradeAppToPaidCommercial = (
  account: PickAccount<'accountType' | 'pendingCancellation'>,
  app: PickApp<'isCommercial' | 'commercialStatus' | 'status'>,
  userRole: UserAccountRole
) => (isWebAccount(account) && isBillingRole(userRole) && !isPaidCommercial(app))

const canChangeAppType = (app: PickApp<'violationStatus' | 'status' | 'commercialStatus'>) => (
  app.violationStatus !== 'Violation' &&
  app.status === 'ENABLED' &&
  !['LAUNCH', 'CANCELED', 'COMPLETE'].includes(app.commercialStatus)
)

type RepoCheck = (app: PickApp<'repoStatus'>) => boolean

const appHasPrivateRepo: RepoCheck = app => app.repoStatus === 'PRIVATE'
const appHasPublicRepo: RepoCheck = app => app.repoStatus === 'PUBLIC'
const appHasRepo: RepoCheck = app => appHasPrivateRepo(app) || appHasPublicRepo(app)

type CoverImageApp = Partial<PickApp<'createdAt' | 'coverImageId'>>

const deriveAppCoverImageUrl = (app: CoverImageApp, size = COVER_IMAGE_PREVIEW_SIZES[1200]) => {
  const width = size[0]
  const height = size[1]
  if (app && app.coverImageId) {
    return `https://cdn.8thwall.com/apps/cover/${app.coverImageId}-preview-${width}x${height}`
  }

  // Calculate the default image that should be used.
  const defaultImageId = getDefaultCoverImageIdForApp(app)
  return `https://cdn.8thwall.com/apps/cover/${defaultImageId}-preview-${width}x${height}`
}

const getDefaultCoverImageIdForApp = (app: CoverImageApp) => {
  if (!app || !app.createdAt) {
    return 'default0'
  }
  const createdTime = new Date(app.createdAt).getTime()
  const defaultImageIndex = createdTime % NUM_DEFAULT_COVER_IMAGES
  return `default${defaultImageIndex}`
}

const getRandomDefaultAppCoverImage = (size = COVER_IMAGE_PREVIEW_SIZES[1200]) => {
  const defaultImageIndex = Math.floor(Math.random() * NUM_DEFAULT_COVER_IMAGES)
  const coverImageId = `default${defaultImageIndex}`
  const width = size[0]
  const height = size[1]
  return {
    url:
      `https://cdn.8thwall.com/apps/cover/default${defaultImageIndex}-preview-${width}x${height}`,
    coverImageId,
  }
}

const hasDefaultAppCoverImage = (app: CoverImageApp) => [...Array(NUM_DEFAULT_COVER_IMAGES).keys()]
  .reduce((o, num) => o.add(`default${num}`), new Set())
  .has(app.coverImageId)

const isBasicInfoCompleted = (app: PickApp<'appTitle'>) => (
  [app.appTitle].every(Boolean)
)

const getDisplayNameForApp = (app: PickApp<'appTitle' | 'appName'>) => app.appTitle || app.appName

const getDisplayDescForApp = (app: DbApp) => app.appDescription ||
  `${getDisplayNameForApp(app)} by ${app.Account?.name}`

type CommercialProjectType = AppBuildSettingsSplashScreen | 'COMMERCIAL'

const getLicenseType = (
  app: PickApp<'isCommercial' | 'buildSettingsSplashScreen'>
): CommercialProjectType => {
  if (app.isCommercial) {
    return 'COMMERCIAL'
  }

  return SPLASH_SCREEN_TYPES.includes(app.buildSettingsSplashScreen)
    ? app.buildSettingsSplashScreen
    : 'NONCOMMERCIAL'
}

const getLicenseTypePretty = (app: PickApp<'isCommercial' | 'buildSettingsSplashScreen'>) => {
  if (app.isCommercial) {
    return 'Commercial'
  }

  switch (app.buildSettingsSplashScreen) {
    case 'EDUCATIONAL':
      return 'Educational Use'
    case 'APP':
      return 'Web App'
    case 'NONCOMMERCIAL':
      return 'Non-Commercial'
    case 'DEMO':
    default:
      return 'Demo Use'
  }
}

const getAppTypePretty = (app: PickApp<'hasRecurringLicense'>) => (
  app.hasRecurringLicense ? 'Integration' : 'Campaign'
)

type CommercialAttributes = {
  isCommercial: boolean
  commercialStatus?: AppCommercialStatus
  buildSettingsSplashScreen?: AppBuildSettingsSplashScreen
}

const getAttributesForAppType = (
  appType: CommercialProjectType, account: PickAccount<'accountType'>
): CommercialAttributes => {
  switch (appType) {
    case 'COMMERCIAL':
      return {
        isCommercial: true,
        ...(isEnterprise(account) &&
          {commercialStatus: 'LAUNCH'}
        ),
      }
    case 'EDUCATIONAL':
      return {
        buildSettingsSplashScreen: 'EDUCATIONAL', isCommercial: false,
      }
    case 'APP':
      return {
        buildSettingsSplashScreen: 'APP', isCommercial: false,
      }
    case 'NONCOMMERCIAL':
      return {
        buildSettingsSplashScreen: 'NONCOMMERCIAL', isCommercial: false,
      }
    case 'DEMO':
    default:
      return {
        buildSettingsSplashScreen: 'DEMO', isCommercial: false,
      }
  }
}

// TODO(christoph): Add types
const getUpcomingInvoiceForApp = (app, upcomingAppLicenseInvoices) => (
  app?.subscriptionId &&
  upcomingAppLicenseInvoices?.find(i => i.subscription === app.subscriptionId)
)

// Sorted DESC by publishedAt first if it exists. Otherwise by updatedAt
const sortFeaturedApps = <T extends Partial<PickApp<'publishedAt' | 'updatedAt'>>>(
  apps: readonly T[]
): T[] => (
    apps.slice(0).sort((a1, a2) => {
      if (a1.publishedAt && a2.publishedAt) {
        return a2.publishedAt < a1.publishedAt ? -1 : 1
      } else if (a1.publishedAt) {
        return -1
      } else if (a2.publishedAt) {
        return 1
      } else {
        return a2.updatedAt < a1.updatedAt ? -1 : 1
      }
    })
  )

type HostingCheck = (app: PickApp<'hostingType'>) => boolean

// Before the hostingType column was introduced, we didn't keep track of hosting type.
// Apps created before this column was added are UNSET, which means we aren't 100% certain
// whether they are self or cloud hosted and so can be both and we allow full set of features.
// This is why UNSET apps are _both_ CLOUD_EDITOR and SELF.
const is8thWallHosted: HostingCheck = app => (
  ['UNSET', 'CLOUD_EDITOR', 'AD', 'CLOUD_STUDIO'].includes(app.hostingType)
)

const isCloudEditorApp: HostingCheck = app => ['CLOUD_EDITOR', 'UNSET'].includes(app.hostingType)

const isCloudStudioApp: HostingCheck = app => app.hostingType === 'CLOUD_STUDIO'

const isSelfHosted: HostingCheck = app => ['UNSET', 'SELF'].includes(app.hostingType)

const canSelfHostWithModules: HostingCheck = app => app.hostingType === 'SELF'

const isAppLicenseType = (app: PickApp<'buildSettingsSplashScreen'>) => (
  app.buildSettingsSplashScreen === 'APP'
)

type ProjectUrlOptions = {
  protocol?: boolean
}

const generateProjectUrl = (
  app: PickApp<'appName'>,
  account: PickAccount<'shortName'>,
  options: ProjectUrlOptions = {}
) => {
  const {protocol = true} = options
  // eslint-disable-next-line no-restricted-globals
  const {host} = location
  return `${protocol ? 'https://' : ''}${host}/${account.shortName}/${app.appName}`
}

// Check if the app is an ad.
const isAdApp: HostingCheck = app => app?.hostingType === 'AD'

// Check if the app is either of a Basic plan account or with an App license type
const isEntryWebApp = (
  account: PickAccount<'accountType'>,
  app: PickApp<'buildSettingsSplashScreen'>
) => (isBasic(account) || isAppLicenseType(app))

const isAppShareable = (
  app: PickApp<'hostingType' | 'violationStatus'>,
  account: PickAccount<'Users' | 'accountType' | 'trialStatus'>
) => {
  if (!canUserShareApp(account)) {
    return false
  }

  if (!isAppSharingEnabled(account)) {
    return false
  }

  if (isAdApp(app)) {
    return false
  }

  return app.violationStatus === 'None'
}

const isAppInViolation = (app: PickApp<'violationStatus'>) => app.violationStatus === 'Violation'

// Check if the app could be displayed in Workspace
const isDashboardVisible = (
  app: PickApp<'hostingType' | 'status' | 'isCommercial' | 'commercialStatus'>
) => !isAdApp(app) && isActive(app)

// Internal apps should have read-only permissions.
const getAppD2dScope = (app: PickApp<'hostingType'>) => (app.hostingType === 'INTERNAL'
  ? {}
  : {read: true, update: true})

// NOTE(christoph): This section is intended to cover the case of apps that previously had
// cloud editor access but the plan has been cancelled and can no longer access the editor, but
// still want to be able to browse their code.
const dashboardShowsCodeBrowse = (app: PickApp<'hostingType' | 'repoStatus'>) => (
  isCloudEditorApp(app) && appHasRepo(app)
)

export {
  INVALID_APP_NAMES,
  appHasPrivateRepo,
  appHasPublicRepo,
  appHasRepo,
  appNamePattern,
  canChangeAppType,
  canSelfHostWithModules,
  canUpgradeApp,
  canUpgradeAppToPaidCommercial,
  canUpgradeAppToUnpaidCommercial,
  dashboardShowsCodeBrowse,
  deriveAppCoverImageUrl,
  generateProjectUrl,
  getAppD2dScope,
  getAppStatusUpgrade,
  getAppTypePretty,
  getAttributesForAppType,
  getDefaultCoverImageIdForApp,
  getDisplayDescForApp,
  getDisplayNameForApp,
  getLicenseType,
  getLicenseTypePretty,
  getRandomDefaultAppCoverImage,
  getStatusUpgrade,
  getUpcomingInvoiceForApp,
  hasDefaultAppCoverImage,
  hasDevelopLicense,
  hasLaunchLicense,
  is8thWallHosted,
  isCloudStudioApp,
  isActive,
  isActiveCommercialApp,
  isAppLicenseType,
  isAppShareable,
  isAppInViolation,
  isAdApp,
  isDashboardVisible,
  isArchived,
  isBasicInfoCompleted,
  isCloudEditorApp,
  isCommercial,
  isDeleted,
  isEntryWebApp,
  isLegacyDevelop,
  isNonCommercial,
  isOkAppName,
  isPaidCommercial,
  isSelfHosted,
  isUnpaidCommercial,
  isValidAppTag,
  isValidAppTagString,
  isValidAppTags,
  isInternalApp,
  sortFeaturedApps,
}

export type {
  CommercialProjectType,
}
