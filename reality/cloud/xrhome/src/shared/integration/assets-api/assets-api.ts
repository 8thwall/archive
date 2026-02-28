import {entry} from '../../registry'

type BundleMetadata = {
  totalRawSize: number
}

interface IAssetsApi {
  getBundleMetadata: (bundleId: string) => Promise<BundleMetadata>
  findAssetWithSha256Hash: (sha256Hash: string, extension: string) => Promise<string | undefined>
  getAssetSha256Hash: (file: string) => Promise<string>
}

const AssetsApi = entry<IAssetsApi>('assets-api')

export {AssetsApi}

export type {
  IAssetsApi,
  BundleMetadata,
}
