import type {IAccount, IApp} from '../../common/types/models'
import type {App as DbApp} from '../../../shared/integration/db/models'
import {APP_ROOT_DOMAIN} from './arcade-app-constants'

type PickApp<T extends keyof (IApp | DbApp)> = Pick<IApp | DbApp, T>

interface IAppExtended extends IApp {
  coverImageUrl: string
  previewVideoUrl: string
}

interface IUpsell {
  imageUrl: string
  videoUrl: string
}

const getAppDisplayName = (app: PickApp<'appTitle' | 'appName'>) => app.appTitle || app.appName

const getAppUrl = (account: IAccount, app: IApp) => (
  `https://${account.shortName}.${APP_ROOT_DOMAIN}/${app.appName}`
)

const getAppHeroImageUrl = (app: IAppExtended) => app.coverImageUrl

const getAppHeroVideoUrl = (app: IAppExtended) => app.previewVideoUrl

const getAppCoverImageUrl = (app: IAppExtended) => app.coverImageUrl

const getAppPreviewVideoUrl = (app: IAppExtended) => app.previewVideoUrl

const getUpsellImageUrl = (upsell: IUpsell) => upsell.imageUrl

const getUpsellVideoUrl = (upsell: IUpsell) => upsell.videoUrl

export {
  getAppDisplayName,
  getAppUrl,
  getAppHeroImageUrl,
  getAppHeroVideoUrl,
  getAppCoverImageUrl,
  getAppPreviewVideoUrl,
  getUpsellImageUrl,
  getUpsellVideoUrl,
}
