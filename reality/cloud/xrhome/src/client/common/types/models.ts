/* eslint-disable camelcase */
import type {DeepReadonly} from 'ts-essentials'

import type {
  AssetGeneration,
  AssetRequest,
  Apps,
  Accounts,
  ImageTargets,
  Contracts,
  AccountContractAgreements,
  ApiKeys,
  AppTags,
  FeaturedAppImages,
  User_Accounts, User_App_Prefs,
  Modules,
  ModuleUsers,
  CrossAccountPermission,
  AdSubmission,
  PolicyViolation,
  ScheduledSubscription,
  NaeInfo,
  PwaInfo,
  Feature,
} from './db'
import type {ResponsiveAccountIcons} from '../../../shared/responsive-account-icons'
import type {IInnerHits} from '../../project-library/project-library-types'

type IAppTag = DeepReadonly<AppTags & {
  deleted?: boolean
}>

interface IFeaturedAppImage extends DeepReadonly<FeaturedAppImages> {}

type IUserAppSpecific = User_App_Prefs

interface IAppXrSessionToken {
  xrSessionToken?: {token: string, expiry: number}
}

interface IApp extends DeepReadonly<Apps & IAppXrSessionToken & {
  userSpecific?: IUserAppSpecific
  isCamera?: boolean
  coverImageUrl?: string
  smallCoverImageUrl?: string
  mediumCoverImageUrl?: string
  largeCoverImageUrl?: string
  hostedFilename?: string
  Account?: never
  masterCommitHash?: string
  AppTags?: IAppTag[]
  FeaturedAppImages?: IFeaturedAppImage[]
  AdSubmissions?: AdSubmission[]
  PolicyViolations?: PolicyViolation[]
  PwaInfo?: PwaInfo
  NaeInfos?: NaeInfo[]
}> {}

type IUserAccount = User_Accounts

type Account = Accounts
interface IFullAccount extends DeepReadonly<Omit<Accounts, 'icon'> & {
  isWeb: boolean
  isCamera: boolean
  webPublic: boolean
  is8: boolean
  maxAppCount: number
  icon: ResponsiveAccountIcons

  Accounts: IFullAccount[]
  Users: IUserAccount[]
  PolicyViolations?: PolicyViolation[]
  Features?: Feature[]
  shortNameChangeRequired: boolean
}> {}

interface AccountWithApps extends DeepReadonly<IFullAccount & {
  Apps: IApp[]
}> {}

interface ImageTarget extends Omit<ImageTargets,
  'originalImagePath' | 'imagePath'|'luminanceImagePath' | 'thumbnailImagePath' |
  'geometryTextureImagePath'
> {}

interface IImageTarget extends ImageTarget {
  originalImageSrc: string
  imageSrc: string
  thumbnailImageSrc: string
  geometryTextureImageSrc: string
  loadAutomatically: boolean
  appKey: string
}

type IAccountContractAgreement = AccountContractAgreements

interface IContract extends DeepReadonly<Contracts & {
  AccountContractAgreements: IAccountContractAgreement[]
  pdfSignedUrl?: string
}> {}

type IApiKey = ApiKeys

type IModuleUser = ModuleUsers

interface IModule extends DeepReadonly<Modules & {
  moduleUser?: IModuleUser
  Tags?: IAppTag[]
  FeaturedImages?: IFeaturedAppImage[]
  Account?: never
}> {}

interface IPublicModule extends DeepReadonly<Pick<Modules,
  'uuid' | 'status' | 'AccountUuid' | 'name' | 'repoId' | 'title' |
  'description' | 'coverImageId' | 'createdAt' | 'updatedAt' | 'publicFeatured' |
  'featuredDescriptionId' | 'featuredVideoUrl' | 'compatibility' | 'repoVisibility' | 'archived'
> & {FeaturedImages?: IFeaturedAppImage[], Tags?: IAppTag[], Account?: IPublicAccount}> {}

interface IPublicAccount extends DeepReadonly<Pick<IFullAccount,
  'bio' | 'contactUrl' | 'googleMapsPlaceId' | 'icon' | 'linkedInHandle' | 'name' |
  'publicFeatured' | 'shortName' | 'status' | 'twitterHandle' | 'updatedAt' | 'url' | 'uuid' |
  'verifiedPartner' | 'verifiedPremierePartner' | 'youtubeHandle'
>> {}

interface IPublicApp extends DeepReadonly<Pick<IApp,
  'appDescription' | 'appName' | 'appTitle' | 'coverImageId' | 'repoLicenseMaster' |
  'repoLicenseProd' | 'repoStatus' | 'shortLink' | 'status' | 'updatedAt' | 'uuid' |
  'featuredPreviewDisabled' | 'featuredVideoUrl' | 'featuredDescriptionId' | 'publicFeatured' |
  'publishedAt' | 'productionCommitHash' | 'hostingType' | 'buildSettingsSplashScreen' |
  'FeaturedAppImages' | 'AppTags'
> & {
  Account: string  // Normalized into state.publicBrowse.Accounts
}> {}

type ExternalAccountFields = 'name' | 'uuid' | 'icon' | 'shortName' | 'accountType'

interface IExternalAccount extends DeepReadonly<{
  [k in keyof IFullAccount]: k extends ExternalAccountFields ? Accounts[k] : never
}> {}

type IAccount = IExternalAccount | IFullAccount

interface IShareLinkAccount extends DeepReadonly<Pick<Accounts,
  'name' |'shortName' | 'uuid'
>> {}
interface IDiscoveryAccount extends DeepReadonly<Pick<Accounts,
  'icon' | 'name' | 'publicFeatured' | 'shortName' | 'url' | 'uuid' | 'verifiedPartner' |
  'verifiedPremierePartner'
> & {
  twitterHandle?: never
}> {}

interface IShareLinkApp extends DeepReadonly<Pick<IPublicApp,
  'coverImageId' | 'appName' | 'appTitle'
>> {}

interface IDiscoveryApp extends DeepReadonly<Pick<IPublicApp,
  'uuid' | 'productionCommitHash' | 'featuredPreviewDisabled' | 'publishedAt' | 'coverImageId' |
  'appName' | 'repoStatus' | 'appTitle' | 'shortLink' | 'hostingType'
> & {
  Account: IDiscoveryAccount
  innerHits?: IInnerHits  // For search results, nested fields are returned in innerHits
}> {}

interface ILauncherApp extends DeepReadonly<Pick<IPublicApp,
  'uuid' | 'productionCommitHash' | 'featuredPreviewDisabled' | 'publishedAt' | 'coverImageId' |
  'appName' | 'repoStatus' | 'appTitle' | 'shortLink' | 'hostingType'
> & {
  Account?: never
}> {}

interface ILauncherDrillDownApp extends DeepReadonly<Pick<IPublicApp,
  'appDescription' | 'appName' | 'appTitle' | 'coverImageId' | 'repoLicenseMaster' |
  'repoLicenseProd' | 'repoStatus' | 'shortLink' | 'status' | 'updatedAt' | 'uuid' |
  'featuredPreviewDisabled' | 'featuredVideoUrl' | 'featuredDescriptionId' | 'publicFeatured' |
  'publishedAt' | 'productionCommitHash' | 'hostingType' | 'buildSettingsSplashScreen'
> & {
  Account: {uuid: string, shortName: string, icon?: never}
}> {}

type IBrowseApp = IPublicApp | IDiscoveryApp | IApp | ILauncherApp | ILauncherDrillDownApp
type IBrowseAccount = IPublicAccount | IAccount | IDiscoveryAccount

type IBrowseModule = IPublicModule | IModule

// NOTE(christoph): When a module is open in a project, we have an IPublicModule which we need to
// also be able to use when passed to the deployment modal for modules from within
// the project editor.
type IDeployableModule = IPublicModule | IModule

interface ICrossAccountPermission extends Omit<CrossAccountPermission, 'inviteToken'> {
  ToAccount: IExternalAccount
  FromAccount: IExternalAccount
}

type IScheduledSubscription = ScheduledSubscription

interface IAssetRequest extends DeepReadonly<AssetRequest> {
  AssetGenerations: DeepReadonly<AssetGeneration>[]
}

export {
  IAppTag,
  IFeaturedAppImage,
  IUserAppSpecific,
  IApp,
  IUserAccount,
  Account,
  IAccount,
  IFullAccount,
  IShareLinkAccount,
  IImageTarget,
  IAccountContractAgreement,
  IContract,
  IApiKey,
  IModule,
  IModuleUser,
  IPublicModule,
  IPublicAccount,
  IExternalAccount,
  ICrossAccountPermission,
  AccountWithApps,
  IPublicApp,
  IAppXrSessionToken,
  IDiscoveryApp,
  IDiscoveryAccount,
  IBrowseApp,
  IBrowseAccount,
  ILauncherApp,
  IShareLinkApp,
  ILauncherDrillDownApp,
  IScheduledSubscription,
  IBrowseModule,
  IDeployableModule,
  IAssetRequest,
}
