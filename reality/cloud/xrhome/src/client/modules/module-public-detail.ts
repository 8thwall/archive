import type {IFeaturedAppImage, IPublicAccount, IPublicModule} from '../common/types/models'
import type {VersionInfo} from '../../shared/module/module-target-api'

type ModulePublicDetail = {
  module: IPublicModule
  account: IPublicAccount
  recentVersion: VersionInfo
  featuredImages?: IFeaturedAppImage[]
}

export type {ModulePublicDetail}
