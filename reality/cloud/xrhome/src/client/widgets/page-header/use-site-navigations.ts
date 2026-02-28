import {useLocation, useRouteMatch} from 'react-router-dom'
import type {DeepReadonly} from 'ts-essentials'
import {TFunction, useTranslation} from 'react-i18next'

import {isCameraAccount, isUnityAccount} from '../../../shared/account-utils'
import {
  MODULE_LIBRARY_PATH, PROJECT_LIBRARY_PATH, getRouteAccount, PRODUCT_PATH,
} from '../../common/paths'
import {PREDETERMINED_PATH} from '../../../shared/discovery-constants'
import {useSelector} from '../../hooks'
import type {IExternalAccount, IAccount} from '../../common/types/models'
import {useUserHasSession} from '../../user/use-current-user'
import type {IconStroke} from '../../ui/components/icon'

type Account = DeepReadonly<IExternalAccount | IAccount | null>

type Location = {pathname: string} | null

const HOME_ROOT = 'https://www.8thwall.com'
interface INavigationLink {
  url: string
  iconStroke?: IconStroke
  isExternal?: boolean
  isLinkOut?: boolean
  isBigItem?: boolean
  isSubItem?: boolean
  text: string
  children?: never
  description?: string
  a8?: string
  isDisabled?: boolean
}

interface INavigationGroup {
  text: string
  children: INavigationLink[]
  hideCategory?: boolean
}

interface INavigationCategory {
  text: string
  children: INavigationGroup[]
  bottomLink?: INavigationLink
}

type INavigationItem = INavigationLink | INavigationCategory

const INDUSTRY_SOLUTIONS_PATH = 'industry-solutions'

const getBusinessGroup = (t: TFunction): INavigationCategory => {
  const children: INavigationLink[] = [
    {
      text: t('site_navigations.link.solutions'),
      description: t('site_navigations.description.solutions'),
      isExternal: true,
      url: `${HOME_ROOT}/${INDUSTRY_SOLUTIONS_PATH}`,
    }, {
      text: t('site_navigations.link.case_studies'),
      description: t('site_navigations.description.case_studies'),
      isExternal: true,
      url: `${HOME_ROOT}/case-studies`,
    }, {
      text: t('site_navigations.link.find_a_partner'),
      description: t('site_navigations.description.find_a_partner'),
      isExternal: true,
      url: `${HOME_ROOT}/partners`,
    },
  ]

  return {
    text: t('site_navigations.link.business'),
    children: [
      {
        text: t('site_navigations.link.business'),
        hideCategory: true,
        children,
      },
    ],
    bottomLink: {
      text: t('site_navigations.link.contact_sales'),
      isExternal: true,
      url: '/custom',
    },
  }
}

const getCommunityGroup = (t: TFunction): INavigationCategory => {
  const children: INavigationGroup[] = [
    {
      text: t('site_navigations.group.connect'),
      children: [
        {
          text: t('site_navigations.link.discord'),
          description: t('site_navigations.description.discord'),
          isExternal: true,
          isLinkOut: true,
          url: 'https://8th.io/discord',
        }, {
          text: t('site_navigations.link.game_jams'),
          description: t('site_navigations.description.game_jams'),
          isExternal: true,
          url: 'https://8th.io/gamejam',
        }, {
          text: t('site_navigations.link.events'),
          description: t('site_navigations.description.events'),
          isExternal: true,
          isLinkOut: true,
          url: 'https://events.8thwall.com/events/#/list',
        },
      ],
    },
    {
      text: t('site_navigations.group.learn'),
      children: [
        {
          text: t('site_navigations.link.education'),
          description: t('site_navigations.description.education'),
          isExternal: true,
          url: '/community/education',
        }, {
          text: t('site_navigations.link.made_by_community'),
          isExternal: true,
          url: `/${PREDETERMINED_PATH}/view-all?try=true&?q=featured-game`,
        },
      ],
    },
  ]

  return {
    text: t('site_navigations.link.community'),
    children,
    bottomLink: {
      text: t('site_navigations.link.all_resources'),
      isExternal: true,
      url: '/custom',
    },
  }
}

const getProductGroup = (
  isLoggedIn: boolean, account: Account, routeMatch: boolean, t: TFunction
): INavigationCategory => {
  const children: INavigationGroup[] = [
    {
      text: t('site_navigations.group.build'),
      children: [{
        text: t('site_navigations.link.game_engine'),
        description: t('site_navigations.description.game_engine'),
        isExternal: true,
        url: 'https://8th.io/game-engine',
      }, {
        text: t('site_navigations.link.ar_toolkit'),
        description: t('site_navigations.description.ar_toolkit'),
        isExternal: true,
        url: 'https://8th.io/ar-tooling',
      }, {
        text: t('site_navigations.link.ai'),
        description: t('site_navigations.description.ai'),
        isExternal: true,
        url: 'https://8th.io/ai-tools',
      }, {
        text: t('site_navigations.link.download'),
        description: t('site_navigations.description.product_download'),
        isExternal: false,
        url: '/download',
      }],
    },
    {
      text: t('site_navigations.group.export'),
      children: [{
        text: t('site_navigations.link.ios'),
        isExternal: true,
        url: 'https://8th.io/export-ios',
        description: t('site_navigations.description.export_ios'),
      }, {
        text: t('site_navigations.link.android'),
        isExternal: true,
        url: 'https://8th.io/export-android',
        description: t('site_navigations.description.export_android'),
      }, {
        text: t('site_navigations.link.web'),
        isExternal: true,
        url: 'https://8th.io/export-web',
        description: t('site_navigations.description.export_web'),
      }],
    },
  ]

  return {
    text: t('site_navigations.link.product'),
    children,
    bottomLink: {
      text: t('site_navigations.link.all_features'),
      isExternal: true,
      url: `/${PRODUCT_PATH}`,
    },
  }
}

const getDocumentationLink = (account: Account, routeMatch: boolean, t: TFunction) => {
  const documentationLink = {
    text: t('site_navigations.link.documentation'),
    description: t('site_navigations.description.documentation'),
    isExternal: true,
    url: null,
  }
  if (!account || !routeMatch) {
    documentationLink.url = `${HOME_ROOT}/docs`
  } else if (isUnityAccount(account)) {
    documentationLink.url = `${HOME_ROOT}/docs/xr`
  } else if (isCameraAccount(account)) {
    documentationLink.url = `${HOME_ROOT}/docs/camera`
  } else {
    documentationLink.url = `${HOME_ROOT}/docs/web`
  }
  return documentationLink
}

const getProjectLibraryLink = (
  location: Location, isLoggedIn: boolean, t: TFunction
) => {
  const pathname = location?.pathname.replace(/\/$/, '') || ''
  const projectLibraryDisabled = pathname === PROJECT_LIBRARY_PATH ||
  pathname === MODULE_LIBRARY_PATH

  return {
    text: t('site_navigations.link.templates'),
    description: t('site_navigations.description.templates'),
    isExternal: false,
    url: PROJECT_LIBRARY_PATH,
    highlight: !projectLibraryDisabled,
  }
}

const getResourcesGroup = (
  isLoggedIn: boolean, account: Account, routeMatch: boolean, location: Location, t: TFunction
): INavigationCategory => {
  const children: INavigationGroup[] = [{
    text: 'resource_column_1',
    hideCategory: true,
    children: [
      getProjectLibraryLink(location, isLoggedIn, t),
      {
        text: t('site_navigations.link.tutorials'),
        description: t('site_navigations.description.forum'),
        isExternal: true,
        url: `${HOME_ROOT}/tutorials`,
      },
      {
        text: t('site_navigations.link.forum'),
        description: t('site_navigations.description.forum'),
        isExternal: true,
        isLinkOut: true,
        url: '/forum',
      },
      {
        text: t('site_navigations.link.blog'),
        description: t('site_navigations.description.blog'),
        isExternal: false,
        url: '/blog',
      },
    ],
  }, {
    text: 'resource_column_2',
    hideCategory: true,
    children: [
      getDocumentationLink(account, routeMatch, t),
      {
        text: t('site_navigations.link.download'),
        description: t('site_navigations.description.resources_download'),
        isExternal: false,
        url: '/download',
      },
    ],
  }]

  return {
    text: t('site_navigations.link.resources'),
    children,
    bottomLink: {
      text: t('site_navigations.link.all_community_resources'),
      isExternal: true,
      url: '/community',
    },
  }
}

const useLoggedInSidebarNavigations = (): INavigationLink[] => {
  const {t} = useTranslation(['navigation'])
  const match = useRouteMatch()
  const location = useLocation()
  const account = useSelector(state => getRouteAccount(state, match))
  const routeMatchHasAccount = location && location.pathname !== '/'
  const isLoggedIn = useUserHasSession()

  return [
    {
      ...getProjectLibraryLink(location, isLoggedIn, t),
      iconStroke: 'templates',
    },
    {
      text: t('site_navigations.link.tutorials'),
      isExternal: true,
      url: `${HOME_ROOT}/tutorials`,
      iconStroke: 'tutorials',
    },
    {
      ...getDocumentationLink(account, routeMatchHasAccount, t),
      iconStroke: 'documentation',
    },
    {
      text: t('site_navigations.link.forum'),
      isExternal: true,
      isLinkOut: true,
      url: '/forum',
      iconStroke: 'forum',
    },
    {
      text: t('site_navigations.link.community'),
      isLinkOut: true,
      url: '/community',
      // TODO(kim): temporary icon stroke. replace with real one.
      iconStroke: 'smiley',
    },
    {
      text: t('site_navigations.link.discord'),
      isExternal: true,
      isLinkOut: true,
      url: 'https://8th.io/discord',
      // TODO(kim): temporary icon stroke. replace with real one.
      iconStroke: 'lightning',
    },
  ]
}

const usePublicPageHeaderNavigations = (): INavigationItem[] => {
  const {t} = useTranslation(['navigation'])
  const match = useRouteMatch()
  const location = useLocation()
  const account = useSelector(state => getRouteAccount(state, match))
  const routeMatchHasAccount = location && location.pathname !== '/'
  const isLoggedIn = useUserHasSession()

  return [
    getProductGroup(isLoggedIn, account, routeMatchHasAccount, t),
    getCommunityGroup(t),
    getBusinessGroup(t),
    getResourcesGroup(isLoggedIn, account, routeMatchHasAccount, location, t),
    {
      text: t('site_navigations.link.pricing'),
      isExternal: true,
      url: '/pricing',
    },
  ]
}

export {
  usePublicPageHeaderNavigations,
  useLoggedInSidebarNavigations,
}

export type {
  INavigationItem,
  INavigationLink,
  INavigationGroup,
  INavigationCategory,
}
