import {
  MIN_ACCOUNT_NAME_LENGTH,
  MAX_ACCOUNT_NAME_LENGTH,
  SUPERDEV_ACCOUNTS,
  ACCOUNT_VALIDATE_ATTRIBUTES,
  PERMISSION_INVITE_ROLES,
  NUM_DEFAULT_ACCOUNT_ICONS,
  DEFAULT_ACCOUNT_ICON_HASH,
} from './account-constants'

import {
  DEV_SCANNING_BETA, PRIVATE_VPS_BETA, STUDIO_EXPANSE_DIFF_BETA, DEV_SCANNING_INTERNAL_ACCESS,
  AGENT_BETA,
} from './special-features'
import type {SpecialFeatureFlag} from './special-features'
import {EMAIL_PATTERN} from './user-constants'
import type {Account as DbAccount} from './integration/db/models'
import type {IAccount, IFullAccount} from '../client/common/types/models'
import type {AppHostingType} from '../client/common/types/db'

const WEB_ACCOUNTS = new Set([
  'WebDeveloper',
  'WebDeveloperPro',
  'WebStarter',
  'WebPlus',
  'WebAgency',
  'WebBusiness',
  'WebEnterprise',
])
const CAMERA_ACCOUNTS = new Set(['WebCamera', 'WebCameraPro'])
const UNITY_ACCOUNTS = new Set(['UnityDeveloper', 'UnityDeveloperPro'])
const WEB_EDITOR_ACCOUNTS = new Set([
  'WebStarter', 'WebPlus', 'WebAgency', 'WebBusiness', 'WebEnterprise',
])
const LIGHTSHIP_ACCOUNT_TYPE = 'Lightship'
const WEB_UPGRADE_ACCOUNTS = ['WebStarter', 'WebPlus', 'WebAgency']
const ACCOUNT_DOWNGRADE_MAP = {
  'WebDeveloper': 'WebDeveloper',
  'WebDeveloperPro': 'WebDeveloper',
  'WebEnterprise': 'WebDeveloper',
  'WebStarter': 'WebDeveloper',
  'WebPlus': 'WebDeveloper',
  'WebAgency': 'WebDeveloper',
  'WebBusiness': 'WebDeveloper',
  'WebCameraPro': 'WebCamera',
  'WebCamera': 'WebCamera',
  'UnityDeveloperPro': 'UnityDeveloper',
  'UnityDeveloper': 'UnityDeveloper',
}

type PickAccount<T extends keyof (IFullAccount | DbAccount)> = Pick<IFullAccount | DbAccount, T>

type AccountType = DbAccount['accountType']

type TypeCheck = (account: PickAccount<'accountType'> | null) => boolean

/**
 * Checks if the account is on a Basic plan.
 */
const isBasic: TypeCheck = account => account && account.accountType === 'WebDeveloper'

/**
 * Checks if the account is on a legacy Pro plan.
 */
const LEGACY_PRO_ACCOUNT_TYPES = new Set(['WebDeveloperPro', 'WebCameraPro', 'UnityDeveloperPro'])
const isLegacyPro: TypeCheck = account => (
  account && LEGACY_PRO_ACCOUNT_TYPES.has(account.accountType)
)

/**
 * Checks if the account is on a Starter plan.
*/
const isStarter: TypeCheck = account => account?.accountType === 'WebStarter'

/**
 * Checks if the account is on a Plus plan.
 */
const isPlus: TypeCheck = account => account?.accountType === 'WebPlus'

/**
 * Checks if the account is on a Pro plan. Note: in Q4 2020 Agency was renamed to Pro.
 */
const isPro: TypeCheck = account => account && account.accountType === 'WebAgency'

/**
 * Verifies that the account is a paid type (e.g. 'WebDeveloperPro', 'WebEnterprise', etc.)
 * by checking the existence of a Stripe subscription on the account.
 */
const isPaidAccountType = (
  account: PickAccount< 'subscriptionItem' | 'accountSubscriptionId'> | null
) => (
  account && (!!account.subscriptionItem || !!account.accountSubscriptionId)
)

/**
 * Checks if the account is on an Enterprise plan.
 */
const isEnterprise: TypeCheck = account => account?.accountType === 'WebEnterprise'

/**
 * Checks if the account is on a Business plan. This will not include the legacy Enterprise
 * type.
 */
const isBusiness: TypeCheck = account => account && account.accountType === 'WebBusiness'

/**
 * Return true if the accountType is one of the following:
 *   - WebDeveloper
 *   - WebStarter
 *   - WebPlus
 */
const isEntryWebAccountType = (accountType: AccountType) => (
  accountType === 'WebDeveloper' || accountType === 'WebStarter' || accountType === 'WebPlus'
)

/**
 * Return true if the accountType is one of the following:
 *   - WebStarter
 *   - WebPlus
 */
const isOldEntryWebAccountType = (accountType: AccountType) => (
  accountType === 'WebStarter' || accountType === 'WebPlus'
)

/**
 * Returns the account type that should be used after the account is downgraded.
 */
const getDowngradedAccountType = (account: PickAccount<'accountType'>) => (
  ACCOUNT_DOWNGRADE_MAP[account.accountType] || account.accountType
)

/**
 * Returns true if the given special feature is enabled on this account.
 * Primary use is for allowlisting certain features to select accounts.
 */
const isSpecialFeatureEnabled = (
  account: PickAccount<'specialFeatures'>,
  specialFeature: SpecialFeatureFlag
) => Boolean(account?.specialFeatures?.includes(specialFeature))

const isWebAccount: TypeCheck = account => account && WEB_ACCOUNTS.has(account.accountType)

const isCameraAccount: TypeCheck = account => account && CAMERA_ACCOUNTS.has(account.accountType)

const isUnityAccount: TypeCheck = account => account && UNITY_ACCOUNTS.has(account.accountType)

const isLightshipAccount: TypeCheck = account => account?.accountType === LIGHTSHIP_ACCOUNT_TYPE

/**
 * Returns true if the account has private vps access
 */
const isPrivateVpsEnabled = (account: PickAccount<'specialFeatures' | 'accountType'>) => (
  isSpecialFeatureEnabled(account, PRIVATE_VPS_BETA) ||
    isPro(account) ||
    isEnterprise(account)
)

const isStudioExpanseDiffEnabled = (account: PickAccount<'specialFeatures'>) => (
  isSpecialFeatureEnabled(account, STUDIO_EXPANSE_DIFF_BETA)
)

const isAgentBetaEnabled = (account: PickAccount<'specialFeatures'>) => (
  isSpecialFeatureEnabled(account, AGENT_BETA)
)

const getDescriptionForAccountType = (accountType: AccountType) => {
  const descriptionMap = {
    WebDeveloper: 'Basic',
    WebDeveloperPro: 'Web Developer Pro',
    WebStarter: 'Starter',
    WebPlus: 'Plus',
    WebAgency: 'Pro',
    WebBusiness: 'Business',
    WebEnterprise: 'Business',
    UnityDeveloper: 'Unity Developer',
    UnityDeveloperPro: 'Unity Developer Pro',
    WebCamera: 'AR Camera',
    WebCameraPro: 'AR Camera Pro',
  }
  return descriptionMap[accountType] || 'Basic'
}

const getAccountTypeDescription = (account: PickAccount<'accountType'>) => (
  getDescriptionForAccountType(account.accountType)
)

const getPlanTypeForAccountType = (accountType: AccountType) => {
  const descriptionMap = {
    WebDeveloper: 'Basic',
    WebDeveloperPro: 'Pro',
    WebStarter: 'Starter',
    WebPlus: 'Plus',
    WebAgency: 'Pro',
    WebBusiness: 'Business',
    WebEnterprise: 'Enterprise',
    UnityDeveloper: 'Basic',
    UnityDeveloperPro: 'Pro',
    WebCamera: 'Basic',
    WebCameraPro: 'Pro',
  }
  return descriptionMap[accountType] || 'Basic'
}

const getPlanTypeDescription = (account: PickAccount<'accountType'>) => (
  getPlanTypeForAccountType(account.accountType)
)

const getPlanExceedTeamSizeWarning = (teamSize: number, maxTeamSize: number) => (
  `Your team size exceeds the ${maxTeamSize} member limit. ` +
  `Please remove ${teamSize - maxTeamSize} member(s) from your ` +
  'team in order to join Starter Plan.'
)

const shortNameify = (phrase: string) => phrase.toLowerCase().replace(/\.com|[^a-z0-9]/g, '')

/**
 * Return true if the accountType for the given account is one of the following:
 *   - WebStarter
 *   - WebPlus
 *   - WebAgency
 *   - WebBusiness
 *   - WebEnterprise
 */
const isUpgradedWebAccount: TypeCheck = account => (
  isStarter(account) || isPlus(account) || isPro(account) ||
  isBusiness(account) || isEnterprise(account)
)

// TODO(christoph): Add types
/**
 * Return difference in rank if target accountType is higher tiered than the current accountType
 */
const compareWebAccountTypes = (oldAccount, newAccount) => {
  const accountTypes = Array.from(WEB_ACCOUNTS)
  const oldAccountType = oldAccount.accountType || oldAccount
  const newAccountType = newAccount.accountType || newAccount
  const newPlanIndex = accountTypes.indexOf(newAccountType)
  const oldPlanIndex = accountTypes.indexOf(oldAccountType)

  return newPlanIndex - oldPlanIndex
}

/**
 * Return true if the accountType for the given account is one of the following:
 *   - WebDeveloper
 *   - WebStarter
 *   - WebPlus
 */
const isEntryWebAccount: TypeCheck = account => isBasic(account) || isStarter(account) ||
 isPlus(account)

/**
 * Return true if the accountType for the given account is one of the following:
 *   - WebStarter
 *   - WebPlus
 */
const isOldEntryWebAccount: TypeCheck = account => isStarter(account) || isPlus(account)

/**
 * Returns true if the provided account name is valid.
 */
const isValidAccountName = (name: string) => (
  !!name &&
    name.length >= MIN_ACCOUNT_NAME_LENGTH &&
    name.length <= MAX_ACCOUNT_NAME_LENGTH
)

/**
 * Returns true if the account has an ENABLED status.
 */
const isEnabled = (account: PickAccount<'status'> | null) => account?.status === 'ENABLED'

/**
 * Returns true if the Cloud Editor is enabled for the account.
 */
const isEditorEnabled = isWebAccount

/**
 * Returns true if the Cloud Editor is visible for the account. Visibility does not imply that
 * the Cloud Editor is enabled.
 */
const isEditorVisible = isWebAccount

/**
 * Returns true if the account's pendingCancellation value is set to 'None'
 */
const hasPendingCancellation = (account: PickAccount<'pendingCancellation'> | null) => (
  account && account.pendingCancellation !== 'None'
)

/**
 * Returns true if the account uuid matches one of uuids of known 8th Wall accounts.
 */
const is8thWallAccountUuid = (AccountUuid: string) => !!SUPERDEV_ACCOUNTS.includes(AccountUuid)

// Verify if it's either an 8th Wall internal account or a public featureable account
const isPublicFeatureableAccount = (
  account: PickAccount<'publicFeatured' | 'uuid' | 'accountType'> | null
) => account?.publicFeatured

const NOT_IN_PROGRESS_TRIAL_STATE = new Set([
  'NONE', 'ENDED', 'UPGRADED', 'VIOLATION', 'INELIGIBLE',
])
const IN_PROGRESS_TRIAL_STATE = new Set(['ACCOUNT', 'BILLING', 'ACTIVE', 'CANCELED'])

// These accounts have extra priviledges
const FREE_TRIAL_LAUNCH_DATE = new Date('2020-05-20T11:00:00.000-07:00')

// aka is this account legacy
const isCreatedBeforeFreeTrial = (account: PickAccount<'createdAt'> | null) => (
  account && (new Date(account.createdAt) < FREE_TRIAL_LAUNCH_DATE)
)

// Only a upgraded web account can save profile and featured project fields
const isDraftFeaturedEnabled: TypeCheck = account => isWebAccount(account)

// Only a web account can publish profile and featured projects
const isPublishFeaturedEnabled = (account: PickAccount<'accountType'> | null) => (
  isWebAccount(account)
)

/**
 * Returns true if the account sums usage from all apps for billing/quotas
 */
const isTotalViewsAccount = (account: PickAccount<'createdAt' | 'accountType'> | null) => (
  isCameraAccount(account) ||
  isLegacyPro(account) ||
  isEnterprise(account) ||
  (account.accountType === 'WebDeveloper' && isCreatedBeforeFreeTrial(account))
)

// True if the account is able to self host with an app key, either with a dev token or
// allowed origins
const isSelfHostingEnabled = (
  account: PickAccount<'createdAt' | 'webOrigin' |'accountType'> | null
) => {
  if (!isWebAccount(account)) {
    return false
  }

  if (account.webOrigin) {
    return true
  }

  return isCreatedBeforeFreeTrial(account)
}

/**
 * Return true if the account is valid for creating apps with custom domains.
 */
const isCustomDomainsEnabled = (account: PickAccount<'accountType'| 'trialStatus'> | null) => {
  if (isBasic(account) || isStarter(account)) {
    return false
  }

  return isWebAccount(account)
}

// New projects are disabled for non-upgraded web accounts created after free trial.
const isNewAppAllowed = (account: PickAccount<'createdAt' | 'status' |'accountType'> | null) => {
  if (!isEnabled(account)) {
    return false
  }

  if (isCameraAccount(account)) {
    return false
  }

  if (isBasic(account) ||
    !isWebAccount(account) || isUpgradedWebAccount(account)) {
    return true
  }

  return isCreatedBeforeFreeTrial(account)
}

// List all the upgradable account plans joined by "or" by default
const listWebUpgradeAccounts =
  (joinedBy = 'or') => WEB_UPGRADE_ACCOUNTS.map(a => getPlanTypeForAccountType(a))
    .join(` ${joinedBy} `)

// True if the account should load its keys, or show a message if it doesn't have any.
const isPlatformApiVisible = isWebAccount

// True if API Keys for the account are valid to use
const isPlatformApiEnabled = (
  account: PickAccount<'apiAccessOverride' |'accountType'> | null
) => account?.apiAccessOverride || isEnterprise(account) || isPro(account)

type MaybePartnerAccount = PickAccount<'verifiedPartner' |'verifiedPremierePartner'>

const isPartner = (account: MaybePartnerAccount) => (
  account.verifiedPartner || account.verifiedPremierePartner
)

const isPremierPartner = (account: MaybePartnerAccount) => (
  account.verifiedPartner && account.verifiedPremierePartner
)

/**
 * Returns true if the Public Profile/Featured Project Settings are visible for the account.
 */
const isShowcaseSettingsVisible = isWebAccount

/**
 * Returns true if the Public Profile/Featured Project Settings are enabled for the account.
 */
const isShowcaseSettingsEnabled: TypeCheck =
  account => isBasic(account) || isUpgradedWebAccount(account)

/**
 * Returns true if the given account is allowed to share its own apps with other
 * accounts.
 */
const isAppSharingEnabled = (account: PickAccount<'accountType'> | null) => (
  isWebAccount(account) && (account?.accountType !== 'WebDeveloperPro')
)

const MAILTO_PROTOCOL = 'mailto:'
const HTTP_PROTOCOLS = ['https:', 'http:']

const EMAIL_REGEX = new RegExp(EMAIL_PATTERN)

const tryParseUrl = (urlString: string, UrlConstructor: typeof URL) => {
  try {
    return new UrlConstructor(urlString)
  } catch (err) {
    return null
  }
}

// Ensure the account URL is a valid href for an anchor, ensuring "8thwall.com" gets transformed
// to "https://8thwall.com". Account URLs (or contact URLs) can also be email addresses.

// UrlConstructor is passable to handle node versions that don't have URL defined globally.
const fixAccountUrl = (url: string, UrlConstructor = URL) => {
  if (!url || typeof url !== 'string') {
    return null
  }

  // Check if it is an email (treated as all lowercases)
  if (EMAIL_REGEX.test(url.toLowerCase())) {
    return `${MAILTO_PROTOCOL}${url.toLowerCase()}`
  }

  const parsedUrl = tryParseUrl(url, UrlConstructor)
  if (parsedUrl) {
    const protocol = parsedUrl && parsedUrl.protocol
    if (protocol === MAILTO_PROTOCOL || HTTP_PROTOCOLS.includes(protocol)) {
      return url
    }
    // We parsed the url but it is an unexpected protocol so we reject it.
    return null
  }

  const withAddedHttps = `https:${url.startsWith('//') ? '' : '//'}${url}`

  if (tryParseUrl(withAddedHttps, UrlConstructor)) {
    return withAddedHttps
  }

  return null
}

// Take a URL and attempt to make it look cleaner for display to the user

// UrlConstructor is passable to handle node versions that don't have URL defined globally.
const stripAccountUrl = (urlString: string, UrlConstructor = URL) => {
  const url = tryParseUrl(urlString, UrlConstructor)
  if (!url) {
    return urlString
  }
  if (url.protocol === MAILTO_PROTOCOL) {
    return url.pathname
  }
  if (HTTP_PROTOCOLS.includes(url.protocol)) {
    return url.hostname.replace(/^www\./, '')
  }
  return urlString
}

// Validate if an account is public, and remove the attrs for validation
const validateAndStripPublicAccount = (account: DbAccount) => {
  if (!isPublicFeatureableAccount(account)) {
    return null
  }

  // Remove attributes for validation
  ACCOUNT_VALIDATE_ATTRIBUTES.forEach((a) => {
    account[a] = undefined
  })

  return account
}

const isDefaultIcon = (iconId: string) => {
  const idRegex = new RegExp(
    `^default[0-${NUM_DEFAULT_ACCOUNT_ICONS - 1}]_${DEFAULT_ACCOUNT_ICON_HASH}$`
  )
  return idRegex.test(iconId)
}

/**
 * On the client-side, we use multiple CDN urls for the same account icon, but at different
resolutions.
 * This will take one of those CDN urls, and provide the account icon ID that
 * should be equivalent across all resolutions.
 * e.g. "https://cdn.8thwall.com/web/accounts/icons/
 * default0_2izvy6pclt6v6bbhzjlgthrv9i17hhjrjupi4o5ejvc9v91ixvv6llr9-16x16"
 *  would return "default0_2izvy6pclt6v6bbhzjlgthrv9i17hhjrjupi4o5ejvc9v91ixvv6llr9"
 * If there is no valid icon ID, returns an empty string.
*/
const getIconIdFromCdnUrl = (url: string) => {
  const iconUrl = new URL(url)

  // Validate if icon url is coming for our CDN.
  if (iconUrl.hostname !== 'cdn.8thwall.com') {
    return ''
  }

  const parts = iconUrl.pathname.split('/')
  const stripResolutionRegex = new RegExp(/-[0-9]{2,}x[0-9]{2,}$/)
  const iconId = parts[parts.length - 1].replace(stripResolutionRegex, '')
  return iconId
}

const hasDefaultIcon = (account: PickAccount<'icon'>) => {
  let iconId: string
  // Server
  if (typeof account.icon === 'string') {
    iconId = account.icon
  // Client
  } else {
    const iconWithSize = Object.values(account.icon)[0]
    iconId = getIconIdFromCdnUrl(iconWithSize)
  }

  return isDefaultIcon(iconId)
}

const requiresCustomIcon = (account: PickAccount<'icon' | 'accountType'>) => {
  if (!account.icon) {
    return true
  }

  if (isEntryWebAccount(account)) {
    return false
  }

  return hasDefaultIcon(account)
}

const canUserShareApp = (account: PickAccount<'Users'>) => (
  PERMISSION_INVITE_ROLES.includes(
    account.Users?.[0].role
  )
)

const isAccountInViolation = (account: PickAccount<'violationStatus'>) => (
  account.violationStatus === 'Violation'
)

const isCloudEditorEnabled = isWebAccount

const isCloudStudioEnabled = isWebAccount

const canClaimShortName: TypeCheck = (account: PickAccount<'accountType'>) => {
  if (account?.accountType === 'WebDeveloperPro') {
    return false
  }

  return isWebAccount(account)
}

/**
  * Returns error msg for invalid hosting types, does not accept null or UNSET hosting type
  */
const validateAppType = (
  account: PickAccount<'accountType' | 'adEnabled' | 'createdAt' | 'webOrigin' | 'specialFeatures'>,
  hostingType: AppHostingType
) => {
  const permissionErrorMsg = `Insufficient permissions for type: ${hostingType}`
  switch (hostingType) {
    case 'CLOUD_EDITOR':
      return isCloudEditorEnabled(account) ? '' : permissionErrorMsg
    case 'CLOUD_STUDIO':
      return isCloudStudioEnabled(account) ? '' : permissionErrorMsg
    case 'SELF':
      return isSelfHostingEnabled(account) ? '' : permissionErrorMsg
    case 'AD':
      return permissionErrorMsg
    default:
      return `Incorrect hosting type: ${hostingType}`
  }
}

const isScaniverseGsbEnabled = (a: PickAccount<'accountType' | 'specialFeatures'>) => (
  isWebAccount(a) || isLightshipAccount(a) || isSpecialFeatureEnabled(a, DEV_SCANNING_BETA)
)

const INTERNAL_ACCESS_ENVS = ['dev', 'staging']
const isScaniverseGsbInternalAccessEnabled = (
  a: PickAccount<'accountType' | 'specialFeatures'>,
  envDeploymentStg: string
) => (
  (BuildIf.SCANIVERSE_INTERNAL_ACCESS_20250204 &&
    INTERNAL_ACCESS_ENVS.includes(envDeploymentStg)) ||
  isSpecialFeatureEnabled(a, DEV_SCANNING_INTERNAL_ACCESS)
)

// NOTE(christoph): VPS stores resources by account ID. For lightship accounts that have been
// migrated from Firestore, the developerId column is the original developerId for the user.
// For 8th Wall Web accounts, the account UUID is used instead.
// NOTE(jamesliu): With the introduction of workspaces in the Lightship portal, newly created
// accounts do not have a developerId associated and the account UUID should be used instead
// like 8th Wall accounts.
// const getVpsIdForAccount = (account: DbAccount): string => {
const getVpsIdForAccount = (account: DbAccount | IAccount): string => {
  if (isLightshipAccount(account)) {
    return account.developerId || account.uuid
  } else {
    return account.uuid
  }
}

const isOnboardingRequired = (account: IAccount) => {
  if (!isWebAccount(account)) {
    return false
  }

  return (isBasic(account) && !account.stripeId) ||
    account.status === 'ACTIVATING' ||
    account.shortNameChangeRequired ||
    (!isBusiness(account) && !isPro(account) && !isEnterprise(account) && !account.publicFeatured)
}

const shouldRedirectToSignUp = (accounts: IAccount[]) => {
  const activatingAccount = accounts.find(a => a.status === 'ACTIVATING')
  const onlyTrialAccount = !!activatingAccount && accounts.length === 1
  return onlyTrialAccount
}

export {
  ACCOUNT_DOWNGRADE_MAP,
  IN_PROGRESS_TRIAL_STATE,
  NOT_IN_PROGRESS_TRIAL_STATE,
  LIGHTSHIP_ACCOUNT_TYPE,
  WEB_EDITOR_ACCOUNTS,
  WEB_ACCOUNTS,
  INTERNAL_ACCESS_ENVS,
  canUserShareApp,
  canClaimShortName,
  compareWebAccountTypes,
  fixAccountUrl,
  getAccountTypeDescription,
  getDescriptionForAccountType,
  getDowngradedAccountType,
  getPlanExceedTeamSizeWarning,
  getPlanTypeDescription,
  getPlanTypeForAccountType,
  hasPendingCancellation,
  is8thWallAccountUuid,
  isAccountInViolation,
  isAppSharingEnabled,
  isBasic,
  isBusiness,
  isCameraAccount,
  isCreatedBeforeFreeTrial,
  isCustomDomainsEnabled,
  isDraftFeaturedEnabled,
  isEditorEnabled,
  isEditorVisible,
  isEnabled,
  isEnterprise,
  isEntryWebAccount,
  isEntryWebAccountType,
  isOldEntryWebAccount,
  isOldEntryWebAccountType,
  isLegacyPro,
  isNewAppAllowed,
  isPaidAccountType,
  isPartner,
  isPlatformApiEnabled,
  isPlatformApiVisible,
  isPlus,
  isPremierPartner,
  isPro,
  isPublicFeatureableAccount,
  isPublishFeaturedEnabled,
  isSelfHostingEnabled,
  isShowcaseSettingsEnabled,
  isShowcaseSettingsVisible,
  isStarter,
  isTotalViewsAccount,
  isUnityAccount,
  isLightshipAccount,
  isUpgradedWebAccount,
  isValidAccountName,
  isWebAccount,
  listWebUpgradeAccounts,
  requiresCustomIcon,
  isDefaultIcon,
  getIconIdFromCdnUrl,
  shortNameify,
  stripAccountUrl,
  validateAndStripPublicAccount,
  isSpecialFeatureEnabled,
  isCloudEditorEnabled,
  isCloudStudioEnabled,
  validateAppType,
  isScaniverseGsbEnabled,
  isScaniverseGsbInternalAccessEnabled,
  isPrivateVpsEnabled,
  getVpsIdForAccount,
  isOnboardingRequired,
  shouldRedirectToSignUp,
  isStudioExpanseDiffEnabled,
  isAgentBetaEnabled,
}

export type {
  PickAccount,
}
