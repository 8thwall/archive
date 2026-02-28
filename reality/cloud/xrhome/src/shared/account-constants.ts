import type {DeepReadonly} from 'ts-essentials'

import type {UserAccountRole} from '../client/common/types/db'
import {MILLISECONDS_PER_DAY} from './time-utils'

const MIN_SHORTNAME_LENGTH = 3
const MAX_SHORTNAME_LENGTH = 20
const MIN_ACCOUNT_NAME_LENGTH = 3
const MAX_ACCOUNT_NAME_LENGTH = 30
const MAX_ACCOUNT_SHORT_NAME_CHANGES = 2
const NUM_DEFAULT_ACCOUNT_ICONS = 6

// These fields are updated directly
const ACCOUNT_UPDATABLE_FIELDS = [
  'icon',
  'name',
  'url',
  'status',
  'googleMapsPlaceId',
  'bio',
  'contactUrl',
  'publicFeatured',
  'twitterHandle',
  'linkedInHandle',
  'youtubeHandle',
]

// Can be updated with an empty string
const ACCOUNT_EMPTIABLE_FIELDS = [
  'twitterHandle',
  'linkedInHandle',
  'youtubeHandle',
]
// Applies to Starter and Plus Accounts Only
const ACCOUNT_EMPTIABLE_FIELDS_ENTRY = [
  'icon',
  'url',
  'googleMapsPlaceId',
  'bio',
  'contactUrl',
  'twitterHandle',
  'linkedInHandle',
  'youtubeHandle',
]

const ACCOUNT_PROFILE_REQUIRED_FIELDS = [
  'icon',
  'name',
  'url',
  'googleMapsPlaceId',
  'bio',
  'contactUrl',
]

const ACCOUNT_PROFILE_UPDATABLE_FIELDS = [
  ...ACCOUNT_PROFILE_REQUIRED_FIELDS,
  ...ACCOUNT_EMPTIABLE_FIELDS,
]

const BILLING_ROLES: UserAccountRole[] = ['OWNER', 'BILLMANAGER', 'ADMIN']

const PROFILE_ROLES: UserAccountRole[] = ['OWNER', 'ADMIN']

const BASE_ACCOUNT_TYPES = ['WebDeveloper', 'UnityDeveloper', 'WebCamera']

// These AccountUuids are allowed access to all channels, otherwise release+beta only.
// These accounts also have access to features on prod enabled only for 8th Wall accounts.
const SUPERDEV_ACCOUNTS = [
  'eeb93d6a-8672-4627-97d3-f2ee9b9585bd',  // 8th Wall Web
  '14dfb355-6906-40c3-aab0-7fdcf1b10d05',  // 8th Wall XR
  '5f853779-a91d-4c71-b90b-13d3f114fa85',  // 8th Wall Public
  '702e04a2-118c-4ea2-a6d8-d6eb5b4adedf',  // 8th Wall Public XR
  '4046db08-7e69-47d3-be85-16fcc08997d2',  // 8th Wall Web Templates
  '292c45a2-35ed-49f7-bc26-697feb20c848',  // AWE Portal Hunt
  'ce975fcb-e447-4ac5-899f-de7a9be85151',  // 8th Wall Basic
  'e6033471-4465-4a1d-b3a0-ce97eac12614',  // Niantic Research
  '188caa08-7a6f-40ef-a599-e893c6291484',  // Threshold (Niantic Studio)
  'a4148281-6893-4c77-9b0a-736166e517fd',  // Lightship Team (Niantic Studio) (prod)
  '37eb554f-0235-436f-857c-4fdc9e17e5fd',  // Lightship Team (Niantic Studio) (dev)
  // TODO(wayne): Remove these following public featured accounts
  // that are temporarily for the check badge in the public profile page
  '80b1ac3a-3043-453b-af15-ac5c2ab7cb0e',  // 8th Wall Playground
  '87822e0d-9f35-41ed-aefb-abf07cc547bf',  // Face Effects Playground
]

// Apps in these accounts are meant to be cloned from in the template picker.
const LIBRARY_ACCOUNTS = [
  '5f853779-a91d-4c71-b90b-13d3f114fa85',  // 8th Wall Public
  '80b1ac3a-3043-453b-af15-ac5c2ab7cb0e',  // 8th Wall Playground
  '87822e0d-9f35-41ed-aefb-abf07cc547bf',  // Face Effects Playground
]

const LIBRARY_TAGS = [
  'community',
]

const EIGHTH_WALL_WEB_ACCOUNT = 'eeb93d6a-8672-4627-97d3-f2ee9b9585bd'  // 8th Wall Web

const ACCOUNT_MIN_ICON_WIDTH = 400
const ACCOUNT_MIN_ICON_HEIGHT = 400

const ACCOUNT_PUBLIC_ATTRIBUTES = [
  'bio',
  'contactUrl',
  'googleMapsPlaceId',
  'icon',
  'linkedInHandle',
  'name',
  'publicFeatured',
  'shortName',
  'status',
  'twitterHandle',
  'updatedAt',
  'url',
  'uuid',
  'verifiedPartner',
  'verifiedPremierePartner',
  'youtubeHandle',
]

// Stripped attrs as discovery results for performance consideration
const ACCOUNT_PUBLIC_CARD_ATTRIBUTES = [
  'icon',
  'name',
  'publicFeatured',
  'shortName',
  'url',
  'uuid',
  'verifiedPartner',
  'verifiedPremierePartner',
]

// Attrs for validating public featured accounts
const ACCOUNT_VALIDATE_ATTRIBUTES = [
  'accountType',
]

const STARTER_TIER_MAX_TEAM_SIZE = 3
const STARTER_TIER_MAX_ADDITIONS = 'two'
const PLUS_TIER_MAX_TEAM_SIZE = 6
const PLUS_TIER_MAX_ADDITIONS = 'five'

const ACCOUNT_TYPE_TO_MAX_TEAM_SIZE = {
  'WebStarter': STARTER_TIER_MAX_TEAM_SIZE,
  'WebPlus': PLUS_TIER_MAX_TEAM_SIZE,
}

const ACCOUNT_TYPE_TO_MAX_ADDITIONS = {
  'WebStarter': STARTER_TIER_MAX_ADDITIONS,
  'WebPlus': PLUS_TIER_MAX_ADDITIONS,
}

const VALID_ACCOUNT_HANDLE_PATTERN = /^[a-z0-9]+$/

// NOTE(kyle): Unique hash is included in S3 object ID's to prevent caching issues in our CDN.
const DEFAULT_ACCOUNT_ICON_HASH = '2izvy6pclt6v6bbhzjlgthrv9i17hhjrjupi4o5ejvc9v91ixvv6llr9'

const MANAGE_TEAM_ROLES: DeepReadonly<Array<UserAccountRole>> = ['OWNER', 'ADMIN']
const PERMISSION_INVITE_ROLES: DeepReadonly<Array<UserAccountRole>> = ['OWNER', 'ADMIN']
const PERMISSION_INVITE_DURATION_MS = 7 * MILLISECONDS_PER_DAY
const PERMISSION_ACCOUNT_PUBLIC_FIELDS = [
  'uuid', 'name', 'shortName', 'icon', 'accountType', 'webOrigin', 'specialFeatures',
]

type AccountType = 'WebCamera' | 'WebCameraPro' | 'WebDeveloper' | 'WebDeveloperPro' |
  'WebStarter' | 'WebPlus' | 'WebEnterprise' | 'WebAgency' | 'WebBusiness' |
  'UnityDeveloper' | 'UnityDeveloperPro' | 'Lightship' | 'WebXR' | 'WebXRPro'

enum AccountTypes {
  WEB_CAMERA = 'WebCamera',
  WEB_CAMERA_PRO = 'WebCameraPro',
  WEB_DEVELOPER = 'WebDeveloper',
  WEB_DEVELOPER_PRO = 'WebDeveloperPro',
  WEB_STARTER = 'WebStarter',
  WEB_PLUS = 'WebPlus',
  WEB_ENTERPRISE = 'WebEnterprise',
  WEB_AGENCY = 'WebAgency',
  WEB_BUSINESS = 'WebBusiness',
  UNITY_DEVELOPER = 'UnityDeveloper',
  UNITY_DEVELOPER_PRO = 'UnityDeveloperPro',
  LIGHTSHIP_DEVELOPER = 'Lightship',
}

enum AccountPendingCancelType {
  NONE = 'None',
  IMMEDIATE = 'Immediate',
  END_OF_CYCLE = 'EndOfCycle',
}

export {
  AccountType,
  AccountTypes,
  AccountPendingCancelType,
  MIN_SHORTNAME_LENGTH,
  MAX_SHORTNAME_LENGTH,
  MIN_ACCOUNT_NAME_LENGTH,
  MAX_ACCOUNT_NAME_LENGTH,
  MAX_ACCOUNT_SHORT_NAME_CHANGES,
  NUM_DEFAULT_ACCOUNT_ICONS,
  ACCOUNT_UPDATABLE_FIELDS,
  ACCOUNT_EMPTIABLE_FIELDS,
  ACCOUNT_EMPTIABLE_FIELDS_ENTRY,
  VALID_ACCOUNT_HANDLE_PATTERN,
  ACCOUNT_PROFILE_REQUIRED_FIELDS,
  ACCOUNT_PROFILE_UPDATABLE_FIELDS,
  ACCOUNT_PUBLIC_ATTRIBUTES,
  ACCOUNT_PUBLIC_CARD_ATTRIBUTES,
  ACCOUNT_VALIDATE_ATTRIBUTES,
  BASE_ACCOUNT_TYPES,
  BILLING_ROLES,
  PROFILE_ROLES,
  SUPERDEV_ACCOUNTS,
  EIGHTH_WALL_WEB_ACCOUNT,
  ACCOUNT_MIN_ICON_WIDTH,
  ACCOUNT_MIN_ICON_HEIGHT,
  LIBRARY_ACCOUNTS,
  LIBRARY_TAGS,
  STARTER_TIER_MAX_TEAM_SIZE,
  STARTER_TIER_MAX_ADDITIONS,
  PLUS_TIER_MAX_TEAM_SIZE,
  PLUS_TIER_MAX_ADDITIONS,
  ACCOUNT_TYPE_TO_MAX_ADDITIONS,
  ACCOUNT_TYPE_TO_MAX_TEAM_SIZE,
  DEFAULT_ACCOUNT_ICON_HASH,
  PERMISSION_INVITE_ROLES,
  MANAGE_TEAM_ROLES,
  PERMISSION_INVITE_DURATION_MS,
  PERMISSION_ACCOUNT_PUBLIC_FIELDS,
}
