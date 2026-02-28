import React from 'react'

import {
  isUnityAccount, isCameraAccount, isShowcaseSettingsVisible,
} from '../../shared/account-utils'
import type {IAccount} from '../common/types/models'
import {AccountPathEnum} from '../common/paths'
import type {IContainerPage} from '../widgets/container-sidebar'

const AccountDashboardPage = React.lazy(() => import('./account-dashboard-page'))
const AccountUpgradePage = React.lazy(() => import('./account-billing-page'))
const AccountTeamPage = React.lazy(() => import('./account-team-page'))
const AccountProfilePage = React.lazy(() => import('./account-profile-page'))
const NewAppPage = React.lazy(() => import('../apps/new-app-page'))
const DuplicateAppPage = React.lazy(() => import('../apps/duplicate-app-page'))
const AssetLabPage = React.lazy(() => import('../asset-lab/asset-lab-page'))

export interface IAccountContainerPage extends IContainerPage {
  path: AccountPathEnum | ''
  availableOn?(account: IAccount): boolean
}

export const accountPages: IAccountContainerPage[] = [
  {
    name: 'my_projects_page.account_config.workspace',
    icon: 'cubes',
    path: AccountPathEnum.workspace,
    routePath: `${AccountPathEnum.workspace}/:accountWorkspaceTab?`,
    routeComponent: AccountDashboardPage,
  },
  {
    name: 'my_projects_page.account_config.asset_lab',
    icon: 'lab',
    path: AccountPathEnum.assetLab,
    hideSidebar: true,
    routeComponent: AssetLabPage,
  },
  {
    name: 'my_projects_page.account_config.team',
    icon: 'group',
    path: AccountPathEnum.team,
    routeComponent: AccountTeamPage,
    availableOn: account => !isCameraAccount(account),
  },
  {
    name: 'my_projects_page.account_config.public_profile',
    icon: 'newspaper',
    path: AccountPathEnum.publicProfile,
    routeComponent: AccountProfilePage,
    availableOn: isShowcaseSettingsVisible,
  },
  {
    name: 'my_projects_page.account_config.account',
    icon: 'setting',
    path: AccountPathEnum.account,
    routeComponent: AccountUpgradePage,
    availableOn: account => !isUnityAccount(account),
  },
  {
    name: 'my_projects_page.account_config.new_project',
    icon: 'plus',
    path: AccountPathEnum.createProject,
    hideInSidebar: true,
    routeComponent: NewAppPage,
  },
  {
    name: 'my_projects_page.account_config.duplicate_project',
    icon: 'plus',
    path: AccountPathEnum.duplicateProject,
    hideInSidebar: true,
    routeComponent: DuplicateAppPage,
  },
]

export default accountPages.map(({path}) => path)
