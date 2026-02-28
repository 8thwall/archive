// @attr(target = "node")
// @attr(esnext = 1)

import {
  describe, it, assert,
} from '@nia/bzl/js/chai-js'
import {cookieToString} from '@nia/reality/app/nae/packager/cookie-utils'
import type {DevCookie} from '@nia/reality/shared/nae/nae-types'

describe('cookieToString', () => {
  it('should return empty string when cookie is undefined', () => {
    const result = cookieToString(undefined)
    assert.equal(result, '')
  })

  it('should return empty string when cookie is null', () => {
    const result = cookieToString(null as any)
    assert.equal(result, '')
  })

  it('should handle empty token', () => {
    const cookie: DevCookie = {
      name: 'empty',
      token: '',
      options: {
        httpOnly: true,
        signed: false,
        expires: new Date('2024-12-31T23:59:59.000Z'),
        domain: 'test.com',
        path: '/',
        secure: false,
        sameSite: 'strict',
      },
    }

    const result = cookieToString(cookie)
    const expected = 'empty=; httpOnly=true; signed=false; ' +
      'expires=Tue, 31 Dec 2024 23:59:59 GMT; domain=test.com; path=/; ' +
      'secure=false; sameSite=strict'
    assert.equal(result, expected)
  })

  it('should handle basic cookie with name and token only', () => {
    const cookie: DevCookie = {
      name: 'session',
      token: 'abc123',
      options: {
        httpOnly: false,
        signed: false,
        expires: new Date('2024-12-31T23:59:59.000Z'),
        domain: '',
        path: '',
        secure: false,
        sameSite: 'lax',
      },
    }

    const result = cookieToString(cookie)
    const expected = 'session=abc123; httpOnly=false; signed=false; ' +
      'expires=Tue, 31 Dec 2024 23:59:59 GMT; domain=; path=; secure=false; sameSite=lax'
    assert.equal(result, expected)
  })

  it('should handle cookie with simple string options', () => {
    const cookie: DevCookie = {
      name: 'auth',
      token: 'xyz789',
      options: {
        httpOnly: true,
        signed: false,
        expires: new Date('2024-12-31T23:59:59.000Z'),
        domain: 'example.com',
        path: '/api',
        secure: true,
        sameSite: 'strict',
      },
    }

    const result = cookieToString(cookie)
    const expected = 'auth=xyz789; httpOnly=true; signed=false; ' +
      'expires=Tue, 31 Dec 2024 23:59:59 GMT; domain=example.com; path=/api; ' +
      'secure=true; sameSite=strict'
    assert.equal(result, expected)
  })

  it('should handle cookie with Date expires option', () => {
    const expiresDate = new Date('2024-12-31T23:59:59.000Z')
    const cookie: DevCookie = {
      name: 'temp',
      token: 'temp123',
      options: {
        httpOnly: false,
        signed: true,
        expires: expiresDate,
        domain: 'test.com',
        path: '/',
        secure: true,
        sameSite: 'lax',
      },
    }

    const result = cookieToString(cookie)
    const expected = 'temp=temp123; httpOnly=false; signed=true; ' +
      'expires=Tue, 31 Dec 2024 23:59:59 GMT; domain=test.com; path=/; secure=true; sameSite=lax'
    assert.equal(result, expected)
  })

  it('should handle special characters in cookie name and token', () => {
    const cookie: DevCookie = {
      name: 'special-cookie_name',
      token: 'token%20with%20spaces',
      options: {
        httpOnly: false,
        signed: false,
        expires: new Date('2024-12-31T23:59:59.000Z'),
        domain: 'test.com',
        path: '/special/path',
        secure: true,
        sameSite: 'lax',
      },
    }

    const result = cookieToString(cookie)
    const expected = 'special-cookie_name=token%20with%20spaces; httpOnly=false; signed=false; ' +
      'expires=Tue, 31 Dec 2024 23:59:59 GMT; domain=test.com; path=/special/path; ' +
      'secure=true; sameSite=lax'
    assert.equal(result, expected)
  })
})
