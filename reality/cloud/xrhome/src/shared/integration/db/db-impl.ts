/* eslint-disable camelcase */
import {Sequelize, DataTypes, Options as SequelizeOptions} from 'sequelize'

import Account from '../../../../storage/schema/account'
import AccountContractAgreement from '../../../../storage/schema/accountcontractagreement'
import AccountShortName from '../../../../storage/schema/account-short-names'
import App from '../../../../storage/schema/app'
import Contract from '../../../../storage/schema/contract'
import ContractItem from '../../../../storage/schema/contractitem'
import ContractTemplate from '../../../../storage/schema/contracttemplate'
import ContractTier from '../../../../storage/schema/contracttier'
import ImageTarget from '../../../../storage/schema/imagetarget'
import Invite from '../../../../storage/schema/invite'
import NaeInfo from '../../../../storage/schema/nae-info'
import NaePackagerBuild from '../../../../storage/schema/nae-packager-build'
import NaePackagerChannel from '../../../../storage/schema/nae-packager-channel'
import NaePackagerVersionState from '../../../../storage/schema/nae-packager-version-state'
import PolicyViolation from '../../../../storage/schema/policyviolation'
import PwaInfo from '../../../../storage/schema/pwa-info'
import ScheduledSubscription from '../../../../storage/schema/scheduled-subscription'
import User_Account from '../../../../storage/schema/user-account'
import User_App_Pref from '../../../../storage/schema/user-app-prefs'
import ApiKey from '../../../../storage/schema/api-key'
import AppTag from '../../../../storage/schema/apptag'
import AppTagMap from '../../../../storage/schema/apptagmap'
import FeaturedAppImage from '../../../../storage/schema/featuredappimages'
import Module from '../../../../storage/schema/module'
import ModuleUser from '../../../../storage/schema/module-user'
import DiscoveryApp from '../../../../storage/schema/discovery-app'
import CrossAccountPermission from '../../../../storage/schema/cross-account-permission'
import DependencySet from '../../../../storage/schema/dependency-set'
import ModuleTagMap from '../../../../storage/schema/module-tag-map'
import type {IDb} from './db-api'
import AdSubmission from '../../../../storage/schema/ad-submission'
import AppEngagementMetric from '../../../../storage/schema/app-engagement-metric'
import User from '../../../../storage/schema/user'
import PlayerUser from '../../../../storage/schema/player-user'
import AssetRequest from '../../../../storage/schema/asset-request'
import AssetGeneration from '../../../../storage/schema/asset-generation'
import WayspotAnchor from '../../../../storage/schema/wayspot-anchor'
import CreditGrant from '../../../../storage/schema/credit-grant'
import Feature from '../../../../storage/schema/feature'
import Transaction from '../../../../storage/schema/transaction'
import AccountFeatureMap from '../../../../storage/schema/account-feature-map'
import FeatureTransactionMap from '../../../../storage/schema/feature-transaction-map'
import CreditGrantTransactionMap from '../../../../storage/schema/credit-grant-transaction-map'
import CreditBalanceTransaction from '../../../../storage/schema/credit-balance-transaction'
import CreditServicePricing from '../../../../storage/schema/credit-service-pricing'
import AiModel from '../../../../storage/schema/ai-model'
import ReferralCode from '../../../../storage/schema/referral-code'
import ReferralCodeReward from '../../../../storage/schema/referral-code-reward'
import ReferralCodeRedemption from '../../../../storage/schema/referral-code-redemption'
import AppFeatureMap from '../../../../storage/schema/app-feature-map'
import UserLoginMethods from '../../../../storage/schema/user-login-methods'

// We are keeping this list declarative so webpack knows what to pack
const models = [
  Account, AccountContractAgreement, AccountShortName, App, Contract, ContractItem,
  ContractTemplate, ContractTier, ImageTarget, Invite, NaeInfo, NaePackagerBuild,
  NaePackagerChannel, NaePackagerVersionState,
  PolicyViolation, PwaInfo, ScheduledSubscription, User_Account, User_App_Pref, ApiKey, AppTag,
  AppTagMap, FeaturedAppImage, Module, DiscoveryApp, ModuleUser, CrossAccountPermission,
  DependencySet, ModuleTagMap, AdSubmission, AppEngagementMetric, User, UserLoginMethods,
  PlayerUser, AssetRequest, AssetGeneration, WayspotAnchor, CreditGrant, Feature, Transaction,
  AccountFeatureMap, FeatureTransactionMap, CreditGrantTransactionMap, CreditBalanceTransaction,
  CreditServicePricing, ReferralCode, ReferralCodeReward, ReferralCodeRedemption, AiModel,
  AppFeatureMap,
]

// eslint-disable-next-line import/prefer-default-export
export const createDb = (options: SequelizeOptions, uri: string = null) => {
  const sequelize = uri ? new Sequelize(uri, options) : new Sequelize(options)

  const db: Partial<IDb> = {
    sequelize,
  }

  // If the dialect is "sqlite", the "ARRAY" type isn't supported. We add this alias so that
  // the "JSON" type is used by the schema definition instead.
  const dataTypes = options.dialect === 'sqlite'
    ? {...DataTypes, ARRAY: DataTypes.JSON}
    : DataTypes

  // Initializing the models
  models.forEach((modelInit) => {
    const model = modelInit(sequelize, dataTypes)
    db[model.name] = model
  })

  // Hook up the associations
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  return db as IDb
}
