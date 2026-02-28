import type {IApp} from '../common/types/models'

const deriveLegacyHostedUrl = (app: IApp, shortName: string) => {
  if (!app.hostedFilename || !shortName) {
    return undefined
  }

  let root: string

  if (BuildIf.LOCAL_DEV) {
    root = 'https://apps.8thwallcom.test:3030'
  } else if (BuildIf.ALL_QA) {
    root = 'https://apps-dev.8thwall.com'
  } else if (typeof window !== 'undefined' &&
    (window.location.host.includes('staging') || window.location.host.includes('www-rc'))) {
    root = 'https://apps-rc.8thwall.com'
  } else {
    root = 'https://apps.8thwall.com'
  }

  return `${root}/${shortName}/${app.appName}`
}

export {
  deriveLegacyHostedUrl,
}
