import {createAuthenticatedApiGateway} from '../../signed-api-gateway'

type GetUploadUrlResponse = {
  uploadUrl: string
  versionId: string
  message?: string
}

type GetDownloadUrlResponse = {
  downloadUrl: string
  message?: string
}

const createAutomergeStorage = (gatewayUrl: string) => {
  const gateway = createAuthenticatedApiGateway(gatewayUrl)

  const getUploadUrl = async (repoId: string) => gateway.fetch<GetUploadUrlResponse>(
    {path: `/upload/${repoId}`, method: 'GET'}
  )

  const getDownloadUrl = async (
    repoId: string, versionId: string
  ) => gateway.fetch<GetDownloadUrlResponse>(
    {path: `/download/${repoId}/${versionId}`, method: 'GET'}
  )

  return {
    getUploadUrl,
    getDownloadUrl,
  }
}

export {
  createAutomergeStorage,
}
