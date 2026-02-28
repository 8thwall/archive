import accounts from './accounts/account-reducer'
import apps from './apps/apps-reducer'
import billing from './billing/billing-reducer'
import contracts from './contracts/contract-reducer'
import crm from './crm/crm-reducer'
import {reducer as crossAccountPermissions} from './cross-account-permissions/reducer'
import git from './git/git-reducer'
import {reducer as launcher} from './launcher/launcher-reducer'
import {reducer as modules} from './modules/reducer'
import navigations from './navigations/navigation-reducer'
import {reducer as projectLibrary} from './project-library/project-library-reducer'
import {reducer as recommended} from './home/recommended-content/recommended-content-reducer'
import team from './team/team-reducer'
import tokens from './tokens/token-reducer'
import usage from './usage/usage-reducer'
import user from './user/user-reducer'
import apiKeys from './api-keys/reducer'
import checkout from './checkout/checkout-reducer'
import cms from './blog/cms-reducer'
import discovery from './discovery/reducer'
import editor from './editor/editor-reducer'
import home from './home/home-reducer'
import imageTargets from './image-targets/reducer'
import invoices from './invoices/reducer'
import partners from './partners/partners-reducer'
import payments from './billing/payment-api/payout-reducer'
import publicBrowse from './browse/public-browse-reducer'
import topBar from './messages/top-bar/top-bar-reducer'
import vps from './vps/vps-reducer'
import helpCenter from './editor/product-tour/help-center-reducer'
import userNiantic from './user-niantic/user-niantic-reducer'
import assetLab from './asset-lab/asset-lab-reducer'

const FULL_STACK_REDUCERS = {
  accounts,
  apiKeys,
  apps,
  billing,
  checkout,
  cms,
  contracts,
  crm,
  crossAccountPermissions,
  discovery,
  editor,
  git,
  home,
  imageTargets,
  invoices,
  launcher,
  modules,
  navigations,
  partners,
  payments,
  projectLibrary,
  publicBrowse,
  recommended,
  team,
  tokens,
  topBar,
  usage,
  user,
  vps,
  helpCenter,
  userNiantic,
  assetLab,
} as const

export {
  FULL_STACK_REDUCERS,
}
