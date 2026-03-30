import {DataTypes} from 'sequelize'

import Account from './account'
import AccountContractAgreement from './accountcontractagreement'
import AccountShortName from './account-short-names'
import ApiKey from './api-key'
import App from './app'
import Contract from './contract'
import ContractItem from './contractitem'
import ContractTemplate from './contracttemplate'
import ContractTier from './contracttier'
import ImageTarget from './imagetarget'
import Invite from './invite'
import PolicyViolation from './policyviolation'
import PwaInfo from './pwa-info'
import ScheduledSubscription from './scheduled-subscription'
import UserAccount from './user-account'
import UserAppPref from './user-app-prefs'
import AppTag from './apptag'
import AppTagMap from './apptagmap'
import FeaturedAppImage from './featuredappimages'
import Module from './module'
import ModuleUser from './module-user'
import DiscoveryApp from './discovery-app'
import CrossAccountPermission from './cross-account-permission'
import AdSubmission from './ad-submission'
import DependencySet from './dependency-set'
import ModuleTagMap from './module-tag-map'

const modelConstructors = [
  Account, AccountContractAgreement, AccountShortName, App, Contract, ContractItem,
  ContractTemplate, ContractTier, ImageTarget, Invite, PolicyViolation, PwaInfo,
  ScheduledSubscription, UserAccount, UserAppPref, ApiKey, AppTag, AppTagMap,
  FeaturedAppImage, Module, DiscoveryApp, ModuleUser, CrossAccountPermission,
  AdSubmission, DependencySet, ModuleTagMap,
]

const initializeModels = (sequelize) => {
  const models = {sequelize}

  // Initializing the models
  modelConstructors.forEach((modelInit) => {
    const model = modelInit(sequelize, DataTypes)
    models[model.name] = model
  })

  // Hook up the associations
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models)
    }
  })

  return models
}

export {
  initializeModels,
}
