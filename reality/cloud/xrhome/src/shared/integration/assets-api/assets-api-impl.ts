import {createAuthenticatedApiGateway} from '../../signed-api-gateway'
import type {BundleMetadata, IAssetsApi} from './assets-api'

const createAssetsApi = (gatewayUrl: string): IAssetsApi => {
  const gateway = createAuthenticatedApiGateway(gatewayUrl, '/live/')

  const getBundleMetadata = async (bundleId: string) => {
    const res = await gateway.fetchJson<BundleMetadata>({
      method: 'GET',
      path: `bundle/${bundleId}/totalSize`,
    })
    if (res.statusCode !== 200) {
      throw new Error(`Asset metadata error: ${res.statusCode} ${JSON.stringify(res.data)}`)
    }

    return res.data
  }

  const findAssetWithSha256Hash = async (sha256Hash: string, extension: string) => {
    const res = await gateway.fetchJson<{file: string}>({
      method: 'GET',
      path: `hash/sha256/${extension}/${sha256Hash}`,
    })
    if (res.statusCode === 404) {
      return undefined
    }
    if (res.statusCode !== 200) {
      throw new Error(`Hash lookup error: ${res.statusCode}`)
    }
    return res.data.file
  }

  const getAssetSha256Hash = async (file: string) => {
    const res = await gateway.fetchJson<{hash: string}>({
      method: 'GET',
      path: `hash/asset/sha256?${new URLSearchParams({file})}`,
    })
    if (res.statusCode !== 200) {
      throw new Error(`Asset SHA256 hash error ${res.statusCode}`)
    }

    return res.data.hash
  }

  return {
    getBundleMetadata,
    findAssetWithSha256Hash,
    getAssetSha256Hash,
  }
}

export {
  createAssetsApi,
}
