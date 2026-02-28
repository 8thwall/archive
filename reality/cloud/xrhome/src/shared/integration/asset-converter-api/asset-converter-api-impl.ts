import {createAuthenticatedApiGateway} from '../../signed-api-gateway'

type PostUploadResponse = {
  requestId: string
  uploadUrl: string
  downloadUrl: string
  message?: string
}

const createAssetConverterApi = (gatewayUrl: string) => {
  const gateway = createAuthenticatedApiGateway(gatewayUrl)

  const postUploadRequest = async (
    reqBody: {filename: string, conversionType: string, conversionParams: Object}
  ) => gateway.fetchJson<PostUploadResponse>(
    {
      path: '/uploadUrl',
      body: JSON.stringify(reqBody),
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    }
  )

  return {
    postUploadRequest,
  }
}

export {
  createAssetConverterApi,
}
