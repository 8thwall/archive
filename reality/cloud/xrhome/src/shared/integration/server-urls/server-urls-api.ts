import {entry} from '../../registry'

interface IServerUrls {
  CONSOLE_HOST: string
  DEV_APPS_HOST: string
  PUBLIC_APPS_HOST: string
  PUBLIC_API_DOMAIN: string
  STUDIO_API_URL: string
  STUDIO_API_PREFIX: string
  PUBLIC_SCANIVERSE_API: string
  SCANIVERSE_URL: string
  VPS_URL: string
  D2D_URL: string
  COVERAGE_URL: string
  NIANTIC_AUTH_HOST: string
  GAR_HOST: string
  NIANTIC_SENTRY_HOST: string
  LIGHTSHIP_CONSOLE_HOST: string
  RELEASES_API_HOST: string
  ASSET_CONVERTER_API_URL: string
  NAE_SIGNING_API_URL: string
  ARCADE_CONSOLE_HOST: string
  AUTOMERGE_STORAGE_API_URL: string
  ASSETS_API_URL: string
}

const ServerUrls = entry<IServerUrls>('service-domains')

export {
  ServerUrls,
}

export type {
  IServerUrls,
}
