const MAX_SUMMARY_LENGTH = 153
const PUBLISHED_STATE = 'PUBLISHED'
const AVERAGE_ADULT_READING_WORDS_PER_MINUTE = 275
const AVERAGE_SECONDS_SPEND_PER_IMAGE = 12
const DEFAULT_POSTS_PER_PAGE = 9
// TODO (Tri): Remove this and add load topics by demanded
const DEFAULT_MAX_TOPICS_PER_LOAD = 50

const CMS_IMAGE = 'https://cdn.8thwall.com/web/share/8th_Wall_Metadata_SocialCover-mbn6660v.png'

const BLOG_DESCRIPTION = 'News, insights and information about all things WebAR.'

const EXPLORE_TOPICS = [
  'Announcements',
  'Arts & Entertainment',
  'Automotive',
  'Banking & Finance',
  'Beauty & Wellness',
  'Corporate & B2B',
  'Fashion & Apparel',
  'Food & Beverage',
  'For Developers',
  'Games & Toys',
  'Non-Profit',
  'Sports & Fitness',
]

const POPULAR_TOPICS = [
  'Announcements',
  'Arts & Entertainment',
  'Fashion & Apparel',
  'Food & Beverage',
  'For Developers',
]

/**
 * NOTE: Any paths added here MUST be in the set of "reserved8thWallPages".
 * If you intend to use a path that is not currently reserved, follow these steps:
 *   1. Verify no other account has a `shortName` associated with your path.
 *   2. Create a new MR to reserve the path.
 *   3. Create a new MR to add the path as a CMS path.
 */
const PROD_CMS_PATHS = [
  'industry-solutions',
  'products',
  'courses',
  'community',
  'case-studies',
  'contact-us-games',
  'tutorials',
] as const
const CD_CMS_PATHS = [...PROD_CMS_PATHS] as const
const DEV_CMS_PATHS = [...CD_CMS_PATHS, 'learn'] as const
const CMS_PATHS = (() => {
  if (BuildIf.ALL_QA) {
    return DEV_CMS_PATHS
  } else if (BuildIf.MATURE) {
    return CD_CMS_PATHS
  } else {
    return PROD_CMS_PATHS
  }
})()

export {
  PUBLISHED_STATE,
  DEFAULT_POSTS_PER_PAGE,
  EXPLORE_TOPICS,
  POPULAR_TOPICS,
  MAX_SUMMARY_LENGTH,
  AVERAGE_ADULT_READING_WORDS_PER_MINUTE,
  AVERAGE_SECONDS_SPEND_PER_IMAGE,
  DEFAULT_MAX_TOPICS_PER_LOAD,
  CMS_IMAGE,
  BLOG_DESCRIPTION,
  CMS_PATHS,
}
