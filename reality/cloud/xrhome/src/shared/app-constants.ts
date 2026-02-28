const NUM_DEFAULT_COVER_IMAGES = 5
const MAX_APP_TITLE_LENGTH = 100
const MIN_APP_DESCRIPTION_LENGTH = 10
const MAX_APP_DESCRIPTION_LENGTH = 150
const MIN_COVER_IMAGE_HEIGHT = 630
const MIN_COVER_IMAGE_WIDTH = 1200
// TODO(alvin): Should the max sizes be the same as the min?
const MAX_COVER_IMAGE_HEIGHT = 630
const MAX_COVER_IMAGE_WIDTH = 1200
const MAX_CLIENT_NAME_LENGTH = 20
const MIN_FEATURED_IMAGE_HEIGHT = 960
const MIN_FEATURED_IMAGE_WIDTH = 540
const MAX_FEATURED_IMAGE_SIZE = 15000000  // 15MB.
const BYTES_PER_MB = 1000000

// MAX_ASSET_FILE_UPLOAD_IN_BYTES should be kept in sync with
// "client_max_body_size" from reality/cloud/xrhome/.ebextensions/httpsredirect.config
const MEGA = 2 ** 20
const MAX_ASSET_FILE_UPLOAD_IN_BYTES = 100 * MEGA
const MAX_TEXT_FILE_UPLOAD_IN_BYTES = 2 * MEGA
const MAX_BUNDLE_SIZE_IN_BYTES = 100 * MEGA
const MAX_HCAP_SIZE_IN_BYTES = 500 * MEGA

const MAX_BUNDLE_FILE_COUNT = 250

const MAX_APP_TAG_TECH_COUNT = 2
const MAX_APP_TAG_INDUSTRY_COUNT = 2
const MAX_APP_TAG_FREEFORM = 6
const MAX_APP_TAG_COUNT = 10
const MAX_APP_TAG_LENGTH = 30
const MAX_APP_FEATURED_IMAGE_COUNT = 5
const RECENT_APPS_RETURN_LIMIT = 3

// Keep these two in sync so our editor-browse can correctly serve
// paths that the repo files can have
const FILE_NAME_ALLOWED_REGEX = /[^a-zA-Z0-9-_.]/g
const FILE_NAME_WITH_PATH_ALLOWED_CHARS = '[a-zA-Z0-9-_./]'

const COVER_IMAGE_PREVIEW_SIZES = {
  1200: [1200, 630],
  600: [600, 315],
  400: [400, 210],
}
const INTERNAL_APP_TITLE = 'NIANTIC_INTERNAL_API_KEY'

const BADGE_LINK = 'https://www.8thwall.com/static/download/20200604/' +
        'Powered-by-8th-Wall-Brand-Assets-2019.zip'

// Keep these attributes list short so we don't leak information to non-logged in users
const APP_PUBLIC_ATTRIBUTES = [
  'appDescription',
  'appName',
  'appTitle',
  'coverImageId',
  'repoLicenseMaster',
  'repoLicenseProd',
  'repoStatus',
  'shortLink',
  'status',
  'updatedAt',
  'uuid',
  'featuredPreviewDisabled',
  'featuredVideoUrl',
  'featuredDescriptionId',
  'publicFeatured',
  'publishedAt',
  'productionCommitHash',
  'hostingType',
  'buildSettingsSplashScreen',
]

// Stripped attrs as discovery results for performance consideration
// VERY IMPORTANT(kyle): Reindex the apps in OpenSearch whenever this array is updated.
const APP_PUBLIC_CARD_ATTRIBUTES = [
  'appName',
  'appTitle',
  'coverImageId',
  'repoStatus',
  'shortLink',
  'uuid',
  'featuredPreviewDisabled',
  'publishedAt',
  'productionCommitHash',
  'hostingType',
]

const APP_HOSTING_TYPE_NAMES = {
  UNSET: 'Unknown',
  CLOUD_EDITOR: '8th Wall Hosted',
  SELF: 'Self-Hosted',
}

// What template apps an app can see and clone from for each hosting type
const APP_HOSTING_TYPE_TEMPLATE_MAP = {
  UNSET: ['UNSET', 'CLOUD_EDITOR'],
  CLOUD_EDITOR: ['UNSET', 'CLOUD_EDITOR'],
  CLOUD_STUDIO: ['CLOUD_STUDIO'],
}

const SPLASH_SCREEN_TYPES = [
  'NONCOMMERCIAL',
  'DEMO',
  'EDUCATIONAL',
  'APP',
]

export {
  APP_PUBLIC_ATTRIBUTES,
  APP_PUBLIC_CARD_ATTRIBUTES,
  BADGE_LINK,
  NUM_DEFAULT_COVER_IMAGES,
  MAX_APP_TITLE_LENGTH,
  MIN_APP_DESCRIPTION_LENGTH,
  MAX_APP_DESCRIPTION_LENGTH,
  MIN_COVER_IMAGE_HEIGHT,
  MIN_COVER_IMAGE_WIDTH,
  MIN_FEATURED_IMAGE_HEIGHT,
  MIN_FEATURED_IMAGE_WIDTH,
  MAX_COVER_IMAGE_HEIGHT,
  MAX_COVER_IMAGE_WIDTH,
  MAX_CLIENT_NAME_LENGTH,
  MAX_ASSET_FILE_UPLOAD_IN_BYTES,
  MAX_TEXT_FILE_UPLOAD_IN_BYTES,
  MAX_BUNDLE_SIZE_IN_BYTES,
  MAX_HCAP_SIZE_IN_BYTES,
  MAX_BUNDLE_FILE_COUNT,
  MAX_APP_TAG_TECH_COUNT,
  MAX_APP_TAG_INDUSTRY_COUNT,
  MAX_APP_TAG_FREEFORM,
  MAX_APP_TAG_COUNT,
  MAX_APP_TAG_LENGTH,
  MAX_APP_FEATURED_IMAGE_COUNT,
  MAX_FEATURED_IMAGE_SIZE,
  MEGA,
  BYTES_PER_MB,
  FILE_NAME_ALLOWED_REGEX,
  FILE_NAME_WITH_PATH_ALLOWED_CHARS,
  COVER_IMAGE_PREVIEW_SIZES,
  APP_HOSTING_TYPE_NAMES,
  APP_HOSTING_TYPE_TEMPLATE_MAP,
  SPLASH_SCREEN_TYPES,
  INTERNAL_APP_TITLE,
  RECENT_APPS_RETURN_LIMIT,
}
