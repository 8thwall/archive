// @visibility(//visibility:public)

const DEV_DOMAIN = '.dev.8thwall.app'
const STAGING_DOMAIN = '.staging.8thwall.app'

const verifyCookieDomain = (cookieDomain: string, urlHostname: string) => {
  // Check if the cookie domain matches the URL's hostname or vice versa.
  // - Staging Cookies' domain will include the entire url hostname (includes project workspace)
  // - Dev Cookies' domain will only include part of the url hostname (sans project workspace)
  // If the URL is https://example.dev.8thwall.app, the cookie domain will be '.dev.8thwall.app'
  // If the URL is https://example.staging.8thwall.app, the cookie domain will be
  // '.example.staging.8thwall.app'
  if (cookieDomain.endsWith(DEV_DOMAIN)) {
    if (!urlHostname.endsWith(cookieDomain)) {
      throw new Error(`Cookie dev domain does not match URL: ${urlHostname} vs ${cookieDomain}`)
    }
  } else if (cookieDomain.endsWith(STAGING_DOMAIN)) {
    if (!cookieDomain.endsWith(urlHostname)) {
      throw new Error(`Cookie staging domain does not match URL: ${urlHostname} vs ${cookieDomain}`)
    }
  } else {
    throw new Error(`Cookie domain is not 8thWall in origin: ${cookieDomain}.`)
  }
}

export {verifyCookieDomain}
