import type {IServerUrls} from './server-urls-api'

const createServerUrlsMock = (): IServerUrls => ({
  CONSOLE_HOST: '<mock>',
  DEV_APPS_HOST: '<mock>',
  PUBLIC_APPS_HOST: '<mock>',
  PUBLIC_API_DOMAIN: '<mock>',
  STUDIO_API_URL: '<mock>',
  STUDIO_API_PREFIX: '<mock>',
  PUBLIC_SCANIVERSE_API: '<mock>',
  SCANIVERSE_URL: '<mock>',
  VPS_URL: '<mock>',
  D2D_URL: '<mock>',
  COVERAGE_URL: '<mock>',
  NIANTIC_AUTH_HOST: '<mock>',
  GAR_HOST: '<mock>',
  NIANTIC_SENTRY_HOST: '<mock>',
  LIGHTSHIP_CONSOLE_HOST: '<mock>',
  RELEASES_API_HOST: '<mock>',
  ASSET_CONVERTER_API_URL: '<mock>',
  NAE_SIGNING_API_URL: '<mock>',
  ARCADE_CONSOLE_HOST: '<mock>',
  AUTOMERGE_STORAGE_API_URL: '<mock>',
  ASSETS_API_URL: '<mock>',
})

export {
  createServerUrlsMock,
}
