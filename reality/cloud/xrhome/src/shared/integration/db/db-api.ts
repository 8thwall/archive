/* eslint-disable camelcase */
import type {Sequelize} from 'sequelize'

import {entry} from '../../registry'
import type {
  AccountContractAgreement, AccountShortName, Account, App, User_App_Pref,
  Contract, ContractItem, ContractTemplate, ContractTier, ImageTarget, Invite, NaeInfo,
  NaePackagerBuild, NaePackagerChannel, NaePackagerVersionState,
  PolicyViolation, PwaInfo, ScheduledSubscription, User_Account, ApiKey, AppTag, AppTagMap,
  FeaturedAppImage, Module, DiscoveryApp, ModuleUser, CrossAccountPermission, DependencySet,
  ModuleTagMap, AdSubmission, AppEngagementMetric, User, UserLoginMethods, PlayerUser,
  AssetRequest, AssetGeneration, WayspotAnchor, CreditGrant, CreditBalanceTransaction,
  CreditServicePricing, AiModel, Feature, AccountFeatureMap, AppFeatureMap,
  Transaction, FeatureTransactionMap, CreditGrantTransactionMap, ReferralCode, ReferralCodeReward,
  ReferralCodeRedemption,
} from './models'
import type {
  PolicyViolationOwnerStatus, PolicyViolationStatus,
} from '../../policy-violation-constants'

interface IDb {
  sequelize: Sequelize
  Account: typeof Account
  AccountContractAgreement: typeof AccountContractAgreement
  AccountShortName: typeof AccountShortName
  App: typeof App
  AppFeatureMap: typeof AppFeatureMap
  AdSubmission: typeof AdSubmission
  Contract: typeof Contract
  ContractItem: typeof ContractItem
  ContractTemplate: typeof ContractTemplate
  ContractTier: typeof ContractTier
  ImageTarget: typeof ImageTarget
  Invite: typeof Invite
  NaeInfo: typeof NaeInfo
  NaePackagerBuild: typeof NaePackagerBuild
  NaePackagerChannel: typeof NaePackagerChannel
  NaePackagerVersionState: typeof NaePackagerVersionState
  PolicyViolation: typeof PolicyViolation &
  {Status: typeof PolicyViolationStatus, OwnerStatus: typeof PolicyViolationOwnerStatus}
  PwaInfo: typeof PwaInfo
  ScheduledSubscription: typeof ScheduledSubscription
  User_Account: typeof User_Account
  User_App_Pref: typeof User_App_Pref
  ApiKey: typeof ApiKey
  AppTag: typeof AppTag
  AppTagMap: typeof AppTagMap
  FeaturedAppImage: typeof FeaturedAppImage
  Module: typeof Module
  ModuleUser: typeof ModuleUser
  DiscoveryApp: typeof DiscoveryApp
  CrossAccountPermission: typeof CrossAccountPermission
  DependencySet: typeof DependencySet
  ModuleTagMap: typeof ModuleTagMap
  AppEngagementMetric: typeof AppEngagementMetric
  User: typeof User
  UserLoginMethod: typeof UserLoginMethods
  PlayerUser: typeof PlayerUser
  AssetRequest: typeof AssetRequest
  AssetGeneration: typeof AssetGeneration
  WayspotAnchor: typeof WayspotAnchor
  CreditGrant: typeof CreditGrant
  CreditBalanceTransaction: typeof CreditBalanceTransaction
  CreditServicePricing: typeof CreditServicePricing
  AiModel: typeof AiModel
  Feature: typeof Feature
  AccountFeatureMap: typeof AccountFeatureMap
  Transaction: typeof Transaction
  FeatureTransactionMap: typeof FeatureTransactionMap
  CreditGrantTransactionMap: typeof CreditGrantTransactionMap
  ReferralCode: typeof ReferralCode
  ReferralCodeReward: typeof ReferralCodeReward
  ReferralCodeRedemption: typeof ReferralCodeRedemption
}

const Db = entry<IDb>('db')

const db = Db.use

export {
  db,
  Db,
  IDb,
}
