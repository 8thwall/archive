import type {RefHead} from './nae/nae-types'

const makeHostedClientUrl = (
  shortName: string, appName: string, handle: string, clientName: string
) => (
  `https://${handle}-${clientName}-${shortName}.dev.8thwall.app/${appName}/`
)

const makeHostedClientUrlWithRefHead = (
  shortName: string, appName: string, refHead: string
) => (
  `https://${refHead}-${shortName}.dev.8thwall.app/${appName}/`
)

const makeHostedDevelopmentUrl = (shortName: string, appName: string) => (
  `https://master-${shortName}.dev.8thwall.app/${appName}/`
)

const makeHostedStagingUrl = (shortName: string, appName: string) => (
  `https://${shortName}.staging.8thwall.app/${appName}/`
)

const makeHostedProductionUrl = (shortName: string, appName: string) => (
  `https://${shortName}.8thwall.app/${appName}/`
)

const makeHostedBuildUrl = (shortName: string, appName: string, buildId: string) => (
  `https://${buildId}-${shortName}.build.8thwall.app/${appName}/`
)

const withoutHttps = (url: string) => url.replace(/https:\/\//, '')

const createNaeProjectUrl = (account: string, appName: string, ref: RefHead) => {
  if (ref === 'master') {
    return makeHostedDevelopmentUrl(account, appName)
  } else if (ref === 'staging') {
    return makeHostedStagingUrl(account, appName)
  } else if (ref === 'production') {
    return makeHostedProductionUrl(account, appName)
  } else {
    return makeHostedClientUrlWithRefHead(account, appName, ref)
  }
}

export {
  makeHostedClientUrl,
  makeHostedClientUrlWithRefHead,
  makeHostedDevelopmentUrl,
  makeHostedStagingUrl,
  makeHostedProductionUrl,
  makeHostedBuildUrl,
  withoutHttps,
  createNaeProjectUrl,
}
