import * as React from 'react'
import {Link, useLocation, useRouteMatch} from 'react-router-dom'
import {Dropdown} from 'semantic-ui-react'
import type {DeepReadonly} from 'ts-essentials'
import {createUseStyles} from 'react-jss'
import {TFunction, useTranslation} from 'react-i18next'

import {isCameraAccount, isUnityAccount} from '../../shared/account-utils'
import {
  MODULE_LIBRARY_PATH, PROJECT_LIBRARY_PATH, getRouteAccount, PRODUCT_PATH,
} from '../common/paths'
import rocketIcon from '../static/rocketIcon.png'
import rocketIconGray from '../static/rocketIconGray.png'
import rocketIconWhite from '../static/rocketIconWhite.svg'
import {gray3, gray5, mobileViewOverride} from '../static/styles/settings'
import {combine} from '../common/styles'
import {PREDETERMINED_PATH} from '../../shared/discovery-constants'
import {useSelector} from '../hooks'
import type {PageHeaderTheme} from './page-header/page-header-theme-provider'
import type {IExternalAccount, IAccount} from '../common/types/models'
import {useUserHasSession} from '../user/use-current-user'
import LinkOut from '../uiWidgets/link-out'

type Account = DeepReadonly<IExternalAccount | IAccount | null>

type Location = {pathname: string} | null

const HOME_ROOT = 'https://www.8thwall.com'
const isBrowser = typeof window !== 'undefined'
interface INavigationLink {
  url: string
  imageUrl?: string
  isExternal?: boolean
  isLinkOut?: boolean
  isBigItem?: boolean
  isSubItem?: boolean
  text: string
  children?: never
}

interface INavigationGroup {
  text: string
  children: INavigationLink[]
}

type INavigationItem = INavigationLink | INavigationGroup

const isGroup = (i: INavigationItem): i is INavigationGroup => !!i.children

const INDUSTRY_SOLUTIONS_PATH = 'industry-solutions'

const getIndustrySolutionsGroup = (t: TFunction): INavigationGroup => {
  const children: INavigationLink[] = [
    {
      text: t('web8_footer.link.why_webar'),
      isExternal: true,
      url: `${HOME_ROOT}/webar`,
    },
    {
      text: t('logged_out_page_header.link.industry_solutions.case_studies'),
      isExternal: true,
      url: `${HOME_ROOT}/case-studies`,
    },
    {
      text: t('logged_out_page_header.link.industries'),
      isExternal: true,
      url: `${HOME_ROOT}/${INDUSTRY_SOLUTIONS_PATH}`,
    },
    {
      text: t('page_footer.link.discover'),
      isExternal: false,
      url: `/${PREDETERMINED_PATH}`,
    },
  ]

  return {
    text: t('logged_out_page_header.heading.industry_solutions'),
    children,
  }
}

const getCommunityGroup = (t: TFunction): INavigationGroup => {
  const children: INavigationLink[] = [
    {
      text: t('logged_out_page_header.link.community.made_by_community'),
      isExternal: true,
      url: `/${PREDETERMINED_PATH}/view-all?try=true&?q=featured-game`,
    },
    {
      text: t('web8_footer.link.discord'),
      isExternal: true,
      isLinkOut: true,
      url: 'https://8th.io/discord',
    },
    {
      text: t('logged_out_page_header.link.community.game_jams'),
      isExternal: true,
      url: 'https://8th.io/gamejam',
    },
    {
      text: t('logged_out_page_header.link.community.education'),
      isExternal: true,
      url: '/community/education',
    },
    {
      text: t('logged_out_page_header.link.community.events'),
      isExternal: true,
      isLinkOut: true,
      url: 'https://events.8thwall.com/events/#/list',
    },
  ]

  return {
    text: t('web8_footer.heading.community'),
    children,
  }
}

const getProductGroup = (
  isLoggedIn: boolean, account: Account, routeMatch: boolean, t: TFunction
): INavigationGroup => {
  const children: INavigationLink[] = []

  if (isLoggedIn) {
    // Logged in state.
    const showXrLinks = routeMatch && account && isUnityAccount(account)
    children.push({
      text: t('page_footer.link.discover'),
      isExternal: false,
      url: `/${PREDETERMINED_PATH}`,
    })
    children.push({
      text: t('logged_in_page_header.link.features'),
      isExternal: true,
      url: `${HOME_ROOT}/${showXrLinks ? 'products-xr' : 'products-web'}`,
    })
    children.push({
      text: t('logged_out_page_header.link.industries'),
      isExternal: true,
      url: `${HOME_ROOT}/${INDUSTRY_SOLUTIONS_PATH}`,
    })
    children.push({
      text: t('page_footer.link.pricing'),
      isExternal: true,
      url: '/pricing',
    })

    return {
      text: t('page_footer.link.product'),
      children,
    }
  } else {
    children.push({
      text: t('logged_out_page_header.link.niantic_studio'),
      isExternal: true,
      url: `/${PRODUCT_PATH}/niantic-studio`,
    })
    children.push({
      text: t('logged_out_page_header.link.world_ar'),
      isExternal: true,
      url: `/${PRODUCT_PATH}/world-ar`,
    })
    children.push({
      text: t('logged_out_page_header.link.location_ar'),
      isExternal: true,
      url: `/${PRODUCT_PATH}/location-ar`,
    })
    children.push({
      text: t('logged_out_page_header.link.image_targets'),
      isExternal: true,
      url: `/${PRODUCT_PATH}/image-targets`,
    })
    children.push({
      text: t('logged_out_page_header.link.human_ar'),
      isExternal: true,
      url: `/${PRODUCT_PATH}/human-ar`,
    })
    children.push({
      text: t('logged_out_page_header.link.headsets'),
      isExternal: true,
      url: `/${PRODUCT_PATH}/headsets`,
    })
    children.push({
      text: t('logged_out_page_header.link.all_products'),
      isExternal: true,
      url: `/${PRODUCT_PATH}`,
    })

    return {
      text: t('page_footer.link.product'),
      children,
    }
  }
}

const getDocumentationLink = (account: Account, routeMatch: boolean, t: TFunction) => {
  const documentationLink = {
    text: t('logged_out_page_header.link.documentation'),
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
  location: Location, isSmallScreen: boolean, isLoggedIn: boolean, t: TFunction
) => {
  const pathname = location?.pathname.replace(/\/$/, '') || ''
  const projectLibraryDisabled = pathname === PROJECT_LIBRARY_PATH ||
  pathname === MODULE_LIBRARY_PATH
  const isHomePage = location?.pathname === '/'

  let projectLibraryImg

  // TODO(Brandon): Refactor how we're determining which rocket icon to use.
  if (projectLibraryDisabled) {
    projectLibraryImg = rocketIconGray
  } else if (isHomePage && !isSmallScreen && isLoggedIn) {
    projectLibraryImg = rocketIconWhite
  } else {
    projectLibraryImg = rocketIcon
  }

  return {
    text: t('web8_footer.link.project_library'),
    isExternal: false,
    url: PROJECT_LIBRARY_PATH,
    imageUrl: projectLibraryImg,
    highlight: !projectLibraryDisabled,
  }
}

const getResourcesGroup = (
  isLoggedIn: boolean, account: Account, routeMatch: boolean, location: Location,
  isSmallScreen: boolean, t: TFunction
): INavigationGroup => {
  const children = []

  if (!isLoggedIn) {
    children.push(getProjectLibraryLink(location, isSmallScreen, isLoggedIn, t))
    children.push(getDocumentationLink(account, routeMatch, t))
  }

  children.push({
    text: t('web8_footer.link.forum'),
    isExternal: true,
    isLinkOut: true,
    url: '/forum',
  })
  children.push({
    text: t('web8_footer.link.tutorials'),
    isExternal: true,
    url: `${HOME_ROOT}/tutorials`,
  })
  children.push({
    text: t('web8_footer.link.blog'),
    isExternal: false,
    url: '/blog',
  })
  if (!isLoggedIn) {
    children.push({
      text: t('logged_out_page_header.link.find_a_partner'),
      isExternal: false,
      url: '/partners',
    })
  }
  if (isLoggedIn) {
    children.push({
      text: t('web8_footer.link.discord'),
      isExternal: true,
      isLinkOut: true,
      url: 'https://8th.io/discord',
    })
    children.push({
      text: t('logged_out_page_header.link.community.game_jams'),
      isExternal: true,
      url: 'https://8th.io/gamejam',
    })
    children.push({
      text: t('logged_out_page_header.link.community.education'),
      isExternal: true,
      url: '/community/education',
    })
    children.push({
      text: t('logged_out_page_header.link.community.events'),
      isExternal: true,
      isLinkOut: true,
      url: 'https://events.8thwall.com/events/#/list',
    })
    children.push({
      text: t('logged_out_page_header.link.community.made_by_community'),
      isExternal: true,
      url: `/${PREDETERMINED_PATH}/view-all?try=true&?q=featured-game`,
    })
  }
  children.push({
    text: t('logged_out_page_header.link.all_resources'),
    isExternal: true,
    url: '/resources',
  })

  return {
    text: t('web8_footer.heading.resources'),
    children,
  }
}

const useLinks = () => {
  const {t} = useTranslation(['navigation'])
  const links: INavigationItem[] = []
  const match = useRouteMatch()
  const account = useSelector(state => getRouteAccount(state, match))
  const location = useLocation()
  const routeMatchHasAccount = location && location.pathname !== '/'
  const isLoggedIn = useUserHasSession()
  const isSmallScreen = useSelector(state => state.common?.isSmallScreen)

  if (isLoggedIn) {
    // This is a logged in user, show them more resources
    links.push(getDocumentationLink(account, routeMatchHasAccount, t))
    links.push(getProjectLibraryLink(location, isSmallScreen, isLoggedIn, t))
    links.push(getProductGroup(isLoggedIn, account, routeMatchHasAccount, t))
    links.push(getResourcesGroup(
      isLoggedIn, account, routeMatchHasAccount, location, isSmallScreen, t
    ))
  } else {
    // Not a logged in user, suggest Pricing and point to top-level pages
    links.push(getProductGroup(isLoggedIn, account, routeMatchHasAccount, t))
    links.push(getCommunityGroup(t))
    links.push(getIndustrySolutionsGroup(t))
    links.push(getResourcesGroup(
      isLoggedIn, account, routeMatchHasAccount, location, isSmallScreen, t
    ))
    links.push({
      text: t('page_footer.link.pricing'),
      isExternal: true,
      url: '/pricing',
    })
  }

  return links
}

const useStyles = createUseStyles((theme: PageHeaderTheme) => ({
  subitem: {
    'fontSize': '14px !important',
    'fontWeight': '600 !important',
    'color': gray5,
    'paddingRight': '1em',
    '&:hover': {
      color: `${gray5} !important`,
    },
  },
  bigitem: {
    'fontWeight': '700 !important',
    'color': gray5,
    '&:hover': {
      color: `${gray5} !important`,
    },
  },
  highlight: {
    color: `${theme.navHighlight} !important`,

    [mobileViewOverride]: {
      color: `${theme.fgPrimary} !important`,
    },
  },
  disabled: {
    color: gray3,
  },
  menu: {
    'zIndex': '1000 !important',
    'left': '48% !important',
    'right': '50%',
    'transform': 'translateX(-50%)',
    'padding': '1em 0 !important',
    'box-shadow': '0 0 5px #4647664d !important',
    '& a': {
      textAlign: 'left !important',
    },
  },
  item: {
    'margin': 'auto',
    'color': theme.navText,
    'flex': '1 1 auto',
    'textAlign': 'center !important',
    'verticalAlign': 'middle',
    'fontSize': '16px !important',
    'lineHeight': '21px !important',
    'whiteSpace': 'nowrap',
    '& > img': {
      verticalAlign: 'middle !important',
      height: '1em',
      margin: '0 !important',
      paddingLeft: '0.5em',
    },
    '& .menu > .item': {
      'fontWeight': '600 !important',
    },
    '&:hover > .menu': {
      '@media (hover: hover)': {
        display: 'block',
        visibility: 'visible',
      },
    },
  },

}))

// TODO(Brandon): Need to figure out how to display highlighted items
const NavigationItem = (
  {text, url, imageUrl, isExternal, isLinkOut, isSubItem, isBigItem}: INavigationLink
) => {
  const classes = useStyles()

  const content = (() => {
    if (isSubItem) {
      return <span className={classes.subitem}>{text}</span>
    } else if (isBigItem) {
      return <span className={classes.bigitem}>{text}</span>
    } else {
      return text
    }
  })()

  const img = imageUrl ? <img src={imageUrl} alt={text} /> : null
  const className = combine('item', classes.item,
    !url && classes.disabled)

  if (isExternal) {
    return isLinkOut
      ? <LinkOut url={url} className={className}>{content}{img}</LinkOut>
      : <a href={url} className={className}>{content}{img}</a>
  } else {
    return <Link to={url} className={className}>{content}{img}</Link>
  }
}

const SiteNavigations: React.FC = () => {
  const classes = useStyles()
  const links = useLinks()
  const hasHover = isBrowser && window.matchMedia('(hover: hover)').matches

  return (
    <>
      {links.map(
        link => (isGroup(link)
          ? (
            <Dropdown
              key={link.text}
              className={combine('item', classes.item)}
              text={link.text}
              icon='angle down'
              open={hasHover ? false : undefined}
            >
              <Dropdown.Menu
                className={classes.menu}
              >
                {link.children.map(childLink => (
                  <NavigationItem key={childLink.text} {...childLink} />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )
          : <NavigationItem key={link.text} {...link} />
        )
      )}
    </>
  )
}

export {SiteNavigations}
