import {createAuthenticatedApiGateway} from '../../signed-api-gateway'
import type {
  GenerateCsrRequest,
  GenerateCsrResponse,
  UploadToAppStoreConnectRequest,
} from '../../nae/nae-types'

const createNaeSigningApi = (gatewayUrl: string) => {
  const gateway = createAuthenticatedApiGateway(gatewayUrl)

  const generateCsr = async (
    reqBody: GenerateCsrRequest
  ) => gateway.fetchJson<GenerateCsrResponse>(
    {
      path: '/v1/apple-signing/generate-csr',
      body: reqBody,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    }
  )

  const uploadSigningFiles = async (
    reqBody: Buffer,
    contentType: string
  ) => gateway.fetchText(
    {
      path: '/v1/apple-signing/upload-signing-files',
      body: reqBody,
      method: 'POST',
      headers: {'Content-Type': contentType},
    }
  )

  const uploadToAppStoreConnect = async (
    reqBody: UploadToAppStoreConnectRequest
  ) => gateway.fetchText(
    {
      path: '/v1/apple-signing/upload-to-app-store-connect',
      body: reqBody,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    }
  )

  return {
    generateCsr,
    uploadSigningFiles,
    uploadToAppStoreConnect,
  }
}

export {
  createNaeSigningApi,
}
