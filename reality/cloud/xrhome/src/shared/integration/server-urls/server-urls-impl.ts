/* eslint-disable max-len */
import type {Environment} from '../../data-realm'
import type {IServerUrls} from './server-urls-api'

const getServerUrlsForEnv = (env: Pick<Environment, 'deploymentStage'>): IServerUrls => {
  const VPS_PROD_URL =
  '<REMOVED_BEFORE_OPEN_SOURCING>'
  const VPS_STAGING_URL =
  '<REMOVED_BEFORE_OPEN_SOURCING>'
  // const VPS_DEV_URL =
  //   '<REMOVED_BEFORE_OPEN_SOURCING>'

  const D2D_PROD_URL =
  '<REMOVED_BEFORE_OPEN_SOURCING>'
  const D2D_STAGING_URL =
  '<REMOVED_BEFORE_OPEN_SOURCING>'
  // const D2D_DEV_URL =
  //     '<REMOVED_BEFORE_OPEN_SOURCING>'

  const COVERAGE_PROD_URL =
  '<REMOVED_BEFORE_OPEN_SOURCING>'
  const COVERAGE_STAGING_URL =
  '<REMOVED_BEFORE_OPEN_SOURCING>'

  const domainConfig = {
    production: {
      CONSOLE_HOST: 'https://www.8thwall.com',
      DEV_APPS_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      PUBLIC_APPS_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      PUBLIC_API_DOMAIN: '<REMOVED_BEFORE_OPEN_SOURCING>',
      STUDIO_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      PUBLIC_SCANIVERSE_API: '<REMOVED_BEFORE_OPEN_SOURCING>',
      SCANIVERSE_URL: 'https://scaniverse.com',
      STUDIO_API_PREFIX: '/prod/',
      VPS_URL: VPS_PROD_URL,
      D2D_URL: D2D_PROD_URL,
      COVERAGE_URL: COVERAGE_PROD_URL,
      NIANTIC_AUTH_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      GAR_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      NIANTIC_SENTRY_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      LIGHTSHIP_CONSOLE_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      RELEASES_API_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      ASSET_CONVERTER_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      NAE_SIGNING_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      ARCADE_CONSOLE_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      AUTOMERGE_STORAGE_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      ASSETS_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
    },
    releaseCandidate: {
      CONSOLE_HOST: process.env.CONSOLE_ORIGIN || 'https://www-rc.8thwall.com',
      DEV_APPS_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      PUBLIC_APPS_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      PUBLIC_API_DOMAIN: '<REMOVED_BEFORE_OPEN_SOURCING>',
      PUBLIC_SCANIVERSE_API: '<REMOVED_BEFORE_OPEN_SOURCING>',
      SCANIVERSE_URL: '<REMOVED_BEFORE_OPEN_SOURCING>',
      STUDIO_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      STUDIO_API_PREFIX: '/prod/',
      VPS_URL: VPS_PROD_URL,
      D2D_URL: D2D_PROD_URL,
      COVERAGE_URL: COVERAGE_PROD_URL,
      NIANTIC_AUTH_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      GAR_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      NIANTIC_SENTRY_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      LIGHTSHIP_CONSOLE_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      RELEASES_API_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      ASSET_CONVERTER_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      NAE_SIGNING_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      ARCADE_CONSOLE_HOST: process.env.ARCADE_CONSOLE_ORIGIN || 'https://www-rc.nianticarcade.com',
      AUTOMERGE_STORAGE_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      ASSETS_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
    },
    localDevelopment: {
      CONSOLE_HOST: process.env.XRHOME_CONSOLE_HOST || 'https://console.local.8thwall.com:3001',
      DEV_APPS_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      PUBLIC_APPS_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      PUBLIC_API_DOMAIN: '<REMOVED_BEFORE_OPEN_SOURCING>',
      STUDIO_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      PUBLIC_SCANIVERSE_API: '<REMOVED_BEFORE_OPEN_SOURCING>',
      SCANIVERSE_URL: '<REMOVED_BEFORE_OPEN_SOURCING>',
      STUDIO_API_PREFIX: '/dev/',
      VPS_URL: VPS_STAGING_URL,
      D2D_URL: D2D_STAGING_URL,
      COVERAGE_URL: COVERAGE_STAGING_URL,
      NIANTIC_AUTH_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      GAR_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      NIANTIC_SENTRY_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      LIGHTSHIP_CONSOLE_HOST: process.env.LIGHTSHIP_CONSOLE_HOST || '<REMOVED_BEFORE_OPEN_SOURCING>',
      RELEASES_API_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      ASSET_CONVERTER_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      NAE_SIGNING_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      ARCADE_CONSOLE_HOST: process.env.ARCADE_CONSOLE_HOST || '<REMOVED_BEFORE_OPEN_SOURCING>',
      AUTOMERGE_STORAGE_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      // NOTE(christoph): Since assets are not split by environment, we use the same assets
      // API URL for all environments, but there is a test environment accessible with:
      // ASSETS_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      ASSETS_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
    },
    remoteDevelopment: {
      CONSOLE_HOST: 'https://www-cd.qa.8thwall.com',
      DEV_APPS_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      PUBLIC_APPS_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      PUBLIC_API_DOMAIN: '<REMOVED_BEFORE_OPEN_SOURCING>',
      STUDIO_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      STUDIO_API_PREFIX: '/dev/',
      PUBLIC_SCANIVERSE_API: '<REMOVED_BEFORE_OPEN_SOURCING>',
      SCANIVERSE_URL: '<REMOVED_BEFORE_OPEN_SOURCING>',
      VPS_URL: VPS_STAGING_URL,
      D2D_URL: D2D_STAGING_URL,
      COVERAGE_URL: COVERAGE_STAGING_URL,
      NIANTIC_AUTH_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      GAR_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      NIANTIC_SENTRY_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      LIGHTSHIP_CONSOLE_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      RELEASES_API_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      ASSET_CONVERTER_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      NAE_SIGNING_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      ARCADE_CONSOLE_HOST: '<REMOVED_BEFORE_OPEN_SOURCING>',
      AUTOMERGE_STORAGE_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
      ASSETS_API_URL: '<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com',
    },
  }

  switch (env.deploymentStage) {
    case 'prod':
      return domainConfig.production
    case 'staging':
      return domainConfig.releaseCandidate
    case 'dev':
      return domainConfig.remoteDevelopment
    case 'local':
      return domainConfig.localDevelopment
    default:
      throw new Error(`Invalid deployment stage: ${env.deploymentStage}`)
  }
}

export {
  getServerUrlsForEnv,
}
