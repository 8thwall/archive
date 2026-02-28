// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {
  describe, it, assert,
} from '@nia/bzl/js/chai-js'

import {verifyCookieDomain} from '@nia/c8/html-shell/verify-cookie-domain'

describe('verifyCookieDomain', () => {
  it('should pass when cookie domain matches dev domain', () => {
    const cookieDomain = '.dev.8thwall.app'
    const urlHostname = 'example.dev.8thwall.app'
    assert.doesNotThrow(() => verifyCookieDomain(cookieDomain, urlHostname))
  })

  it('should pass when cookie domain matches staging domain', () => {
    const cookieDomain = '.studiobeta.staging.8thwall.app'
    const urlHostname = 'studiobeta.staging.8thwall.app'
    assert.doesNotThrow(() => verifyCookieDomain(cookieDomain, urlHostname))
  })

  it('should throw an error when cookie domain does not match dev domain', () => {
    const cookieDomain = '.dev.8thwall.app'
    const urlHostname = 'example.staging.8thwall.app'
    assert.throws(
      () => verifyCookieDomain(cookieDomain, urlHostname),
      Error,
      /^Cookie dev domain does not match URL/
    )
  })

  it('should pass when cookie domain matches staging domain', () => {
    const cookieDomain = '.example.staging.8thwall.app'
    const urlHostname = 'example.staging.8thwall.app'
    assert.doesNotThrow(() => verifyCookieDomain(cookieDomain, urlHostname))
  })

  it('should throw an error when cookie domain does not match staging domain', () => {
    const cookieDomain = '.example.staging.8thwall.app'
    const urlHostname = 'other.staging.8thwall.app'
    assert.throws(
      () => verifyCookieDomain(cookieDomain, urlHostname),
      Error,
      /^Cookie staging domain does not match URL/
    )
  })

  it('should throw an error when cookie domain is not 8thWall in origin', () => {
    const cookieDomain = '.example.otherdomain.com'
    const urlHostname = 'example.otherdomain.com'
    assert.throws(
      () => verifyCookieDomain(cookieDomain, urlHostname),
      Error,
      /^Cookie domain is not 8thWall in origin/
    )
  })

  it('should throw an error when cookieDomain is an empty string', () => {
    const cookieDomain = ''
    const urlHostname = 'example.dev.8thwall.app'
    assert.throws(
      () => verifyCookieDomain(cookieDomain, urlHostname),
      Error,
      /^Cookie domain is not 8thWall in origin/
    )
  })

  it('should throw an error when urlHostname is an empty string', () => {
    const cookieDomain = '.dev.8thwall.app'
    const urlHostname = ''
    assert.throws(
      () => verifyCookieDomain(cookieDomain, urlHostname),
      Error,
      /^Cookie dev domain does not match URL/
    )
  })

  it('should throw an error when both cookieDomain and urlHostname are empty strings', () => {
    const cookieDomain = ''
    const urlHostname = ''
    assert.throws(
      () => verifyCookieDomain(cookieDomain, urlHostname),
      Error,
      /^Cookie domain is not 8thWall in origin/
    )
  })

  it('should throw an error when cookieDomain contains only spaces', () => {
    const cookieDomain = '   '
    const urlHostname = 'example.dev.8thwall.app'
    assert.throws(
      () => verifyCookieDomain(cookieDomain, urlHostname),
      Error,
      /^Cookie domain is not 8thWall in origin/
    )
  })

  it('should throw an error when domains are matching garbage', () => {
    const cookieDomain = 'malicious8thwallmalicious'
    const urlHostname = 'malicious8thwallmalicious'
    assert.throws(
      () => verifyCookieDomain(cookieDomain, urlHostname),
      Error,
      /^Cookie domain is not 8thWall in origin/
    )
  })

  it('should throw an error when urlHostname contains only spaces', () => {
    const cookieDomain = '.dev.8thwall.app'
    const urlHostname = '   '
    assert.throws(
      () => verifyCookieDomain(cookieDomain, urlHostname),
      Error,
      /^Cookie dev domain does not match URL/
    )
  })
})
