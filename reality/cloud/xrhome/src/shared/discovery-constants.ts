/* eslint-disable max-len */
import type {Keyword, TechType} from './discovery-types'

const SERVE_DOCUMENTS_PROD_URL = 'https://<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com/live'
const SERVE_DOCUMENTS_DEV_URL = 'https://<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com/live'

const DISCOVERY_HERO_DIMENSIONS = {
  large: [1950, 400],
  medium: [1170, 240],
  small: [780, 160],
} as const

const INDUSTRY_CARD_DIMENSIONS = {
  large: [1200, 675],
  medium: [500, 280],
  small: [250, 140],
} as const

// Note(Brandon): All translation keys below are assumed to be under the public-featured-pages.json
const VIEW_ALL_KEYWORD: Keyword = {
  name: 'view all',
  slug: 'view-all',
  heroId: 'exploreAll_<REMOVED_BEFORE_OPEN_SOURCING>',
  industryId: 'exploreAll_<REMOVED_BEFORE_OPEN_SOURCING>',
  descriptionTranslationKey: 'discovery_page.keyword.view_all.description',
  nameTranslationKey: 'discovery_page.keyword.view_all.name',
  pageTitleTranslationKey: 'discovery_page.keyword.view_all.page_title',
}

const KEYWORDS: Keyword[] = [
  {
    name: 'entertainment',
    heroId: 'entertainment_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'entertainment_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.entertainment.description',
    isDropdown: true,
    carouselPriority: 1,
    nameTranslationKey: 'discovery_page.keyword.entertainment.name',
    pageTitleTranslationKey: 'discovery_page.keyword.entertainment.page_title',
  },
  {
    name: 'automotive',
    heroId: 'automotive_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'automotive_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.automotive.description',
    isDropdown: true,
    carouselPriority: 6,
    nameTranslationKey: 'discovery_page.keyword.automotive.name',
    pageTitleTranslationKey: 'discovery_page.keyword.automotive.page_title',
  },
  {
    name: 'business',
    heroId: 'business_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'business_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.business.description',
    isDropdown: true,
    carouselPriority: 11,
    nameTranslationKey: 'discovery_page.keyword.business.name',
    pageTitleTranslationKey: 'discovery_page.keyword.business.page_title',
  },
  {
    name: 'cpg / fmcg',
    slug: 'cpg-fmcg',
    heroId: 'cpg_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'cpg_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.cpg_fmcg.description',
    isDropdown: true,
    carouselPriority: 4,
    nameTranslationKey: 'discovery_page.keyword.cpg_fmcg.name',
    pageTitleTranslationKey: 'discovery_page.keyword.cpg_fmcg.page_title',
  },
  {
    name: 'food & beverage',
    slug: 'food-beverage',
    heroId: 'foodAndBeverage_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'foodAndBeverage_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.food_beverage.description',
    isDropdown: true,
    carouselPriority: 2,
    nameTranslationKey: 'discovery_page.keyword.food_beverage.name',
    pageTitleTranslationKey: 'discovery_page.keyword.food_beverage.page_title',
  },
  {
    name: 'fashion',
    heroId: 'fashion_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'fashion_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.fashion.description',
    isDropdown: true,
    carouselPriority: 3,
    nameTranslationKey: 'discovery_page.keyword.fashion.name',
    pageTitleTranslationKey: 'discovery_page.keyword.fashion.page_title',
  },
  {
    name: 'arts & culture',
    slug: 'arts-culture',
    heroId: 'artsAndCulture_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'artsAndCulture_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.arts_culture.description',
    carouselPriority: 10,
    nameTranslationKey: 'discovery_page.keyword.arts_culture.name',
    pageTitleTranslationKey: 'discovery_page.keyword.arts_culture.page_title',
  },
  {
    name: 'beauty & wellness',
    slug: 'beauty-wellness',
    heroId: 'beautyAndWellness_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'beautyAndWellness_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.beauty_wellness.description',
    carouselPriority: 8,
    nameTranslationKey: 'discovery_page.keyword.beauty_wellness.name',
    pageTitleTranslationKey: 'discovery_page.keyword.beauty_wellness.page_title',
  },
  {
    name: 'education',
    heroId: 'education_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'education_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.education.description',
    carouselPriority: 12,
    nameTranslationKey: 'discovery_page.keyword.education.name',
    pageTitleTranslationKey: 'discovery_page.keyword.education.page_title',
  },
  {
    name: 'music',
    heroId: 'music_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'music_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.music.description',
    carouselPriority: 7,
    nameTranslationKey: 'discovery_page.keyword.music.name',
    pageTitleTranslationKey: 'discovery_page.keyword.music.page_title',
  },
  {
    name: 'games & toys',
    slug: 'games-toys',
    heroId: 'gamesAndToys_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'gamesAndToys_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.games_toys.description',
    carouselPriority: 5,
    nameTranslationKey: 'discovery_page.keyword.games_toys.name',
    pageTitleTranslationKey: 'discovery_page.keyword.games_toys.page_title',
  },
  {
    name: 'film & television',
    slug: 'film-television',
    heroId: 'filmAndTelevision_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'filmAndTelevision_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.film_television.description',
    nameTranslationKey: 'discovery_page.keyword.film_television.name',
    pageTitleTranslationKey: 'discovery_page.keyword.film_television.page_title',
  },
  {
    name: 'beer, wine, & spirits',
    slug: 'beer-wine-spirits',
    heroId: 'beerAndWine_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'beerAndWine_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.beer_wine_spirits.description',
    nameTranslationKey: 'discovery_page.keyword.beer_wine_spirits.name',
    pageTitleTranslationKey: 'discovery_page.keyword.beer_wine_spirits.page_title',
  },
  {
    name: 'finance',
    heroId: 'finance_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'finance_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.finance.description',
    carouselPriority: 13,
    nameTranslationKey: 'discovery_page.keyword.finance.name',
    pageTitleTranslationKey: 'discovery_page.keyword.finance.page_title',
  },
  {
    name: 'sports',
    heroId: 'sports_<REMOVED_BEFORE_OPEN_SOURCING>',
    industryId: 'sports_<REMOVED_BEFORE_OPEN_SOURCING>',
    descriptionTranslationKey: 'discovery_page.keyword.sports.description',
    carouselPriority: 9,
    nameTranslationKey: 'discovery_page.keyword.sports.name',
    pageTitleTranslationKey: 'discovery_page.keyword.sports.page_title',
  },
  VIEW_ALL_KEYWORD,
]

const ALL_KEYWORD: Keyword = {
  name: 'home',
  heroId: 'exploreAll_<REMOVED_BEFORE_OPEN_SOURCING>',
  industryId: 'exploreAll_<REMOVED_BEFORE_OPEN_SOURCING>',
  descriptionTranslationKey: 'discovery_page.keyword.all.description',
  nameTranslationKey: 'discovery_page.keyword.all.name',
  pageTitleTranslationKey: 'discovery_page.keyword.all.page_title',
}

const APPS_PATH_PREFIX = 'discover'

const TECHNOLOGIES: TechType[] = [
  {
    name: 'world effects',
  },
  {
    name: 'vps',
    displayName: 'VPS',
  },
  {
    name: 'image target',
  },
  {
    name: 'face effects',
  },
  {
    name: 'hand tracking',
  },
  {
    name: 'sky effects',
  },
  {
    name: 'shared ar',
    displayName: 'Shared AR',
  },
  {
    name: 'holograms',
  },
  {
    name: 'avatars',
  },
]

const KEYWORD_SEARCH_PARAM = 'q'
const TRY_IT_OUT_SEARCH_PARAM = 'try'
const FREEFORM_PATH = 'search'
const PREDETERMINED_PATH = 'discover'
const DISCOVERY_PAGE_SIZE = 100

const KEYWORD_PATHS_SET = KEYWORDS.reduce((acc, k) => {
  acc.add(k.slug || k.name)
  return acc
}, new Set())

const DEFAULT_FEATURED_EXCLUDES = {
  superDev: true,  // 8th Wall apps
  appLicense: ['APP'],
  basicAccount: true,  // Exclude Basic accounts
}

export {
  APPS_PATH_PREFIX,
  KEYWORDS,
  ALL_KEYWORD,
  VIEW_ALL_KEYWORD,
  TECHNOLOGIES,
  KEYWORD_SEARCH_PARAM,
  TRY_IT_OUT_SEARCH_PARAM,
  SERVE_DOCUMENTS_DEV_URL,
  SERVE_DOCUMENTS_PROD_URL,
  FREEFORM_PATH,
  PREDETERMINED_PATH,
  DISCOVERY_HERO_DIMENSIONS,
  KEYWORD_PATHS_SET,
  INDUSTRY_CARD_DIMENSIONS,
  DISCOVERY_PAGE_SIZE,
  DEFAULT_FEATURED_EXCLUDES,
}
