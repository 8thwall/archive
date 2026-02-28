import {useTranslation} from 'react-i18next'
import type {TFunction} from 'i18next'

import {isCameraAccount, isUnityAccount} from '../../../shared/account-utils'
import type {INavigationLink} from '../page-header/use-site-navigations'
import {AccountPathEnum, getPathForAccount} from '../../common/paths'
import useCurrentAccount from '../../common/use-current-account'
import {getPathForMyProjectsPage} from '../../common/paths'
import type {IAccount} from '../../common/types/models'
import {useCurrentRouteApp} from '../../common/use-current-app'
import {getAppNavigations} from './get-app-navigations'

const getAccountNavigations = (account: IAccount, t: TFunction): INavigationLink[] => [
  {
    text: t('site_navigations.link.workspace'),
    url: getPathForAccount(account, AccountPathEnum.workspace),
    iconStroke: 'home',
  },
  !isCameraAccount(account) && {
    text: t('site_navigations.link.team'),
    url: getPathForAccount(account, AccountPathEnum.team),
    iconStroke: 'team',
  },
  !isCameraAccount(account) && {
    text: t('site_navigations.link.public_profile'),
    url: getPathForAccount(account, AccountPathEnum.publicProfile),
    // TODO(kim): Replace with proper icon
    iconStroke: 'lightning',
  },
  !isUnityAccount(account) && {
    text: t('site_navigations.link.account'),
    url: getPathForAccount(account, AccountPathEnum.account),
    iconStroke: 'settings',
  },
]

const useSidebarNavigations = (): INavigationLink[] => {
  const {t} = useTranslation(['navigation'])
  const account = useCurrentAccount()
  const app = useCurrentRouteApp()

  const homePage: INavigationLink = {
    text: t('site_navigations.link.home'),
    iconStroke: 'home',
    url: getPathForMyProjectsPage(),
  }

  if (app) {
    return getAppNavigations(account, app, t)
  } else
  if (account) {
    return getAccountNavigations(account, t)
  } else {
    return [
      homePage,
    ]
  }
}

export {useSidebarNavigations}
