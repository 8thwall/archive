import {describe, it, assert} from '@nia/bzl/js/chai-js'

import {branch, methods} from './route'

describe('branch', () => {
  it('should route to the correct handler', () => {
    const getRoute = branch({
      '': () => 1,
      'foo': () => 2,
    })

    assert.equal(getRoute('/', 'GET', {}), 1)
    assert.equal(getRoute('/foo', 'GET', {}), 2)
  })
  it('should work with slashes in nested branches', () => {
    const getRoute = branch({
      '': () => 1,
      'foo': branch({
        'bar': () => 2,
        'baz': () => 3,
      }),
    })

    assert.equal(getRoute('/', 'GET', {}), 1)
    assert.equal(getRoute('/foo/bar', 'GET', {}), 2)
    assert.equal(getRoute('/foo/baz', 'GET', {}), 3)
    assert.equal(getRoute('/foo/baz/foo', 'GET', {}), 3)
  })
  it('should fill params with values from path', () => {
    const getRoute = branch({
      '{param1}': branch({
        '{param2}': () => 1,
      }),
    })

    const params = {}
    assert.equal(getRoute('/value1/value2', 'GET', params), 1)
    assert.deepEqual(params, {param1: 'value1', param2: 'value2'})
  })
  it('should prefer non-wildcard routes to follow', () => {
    const getRoute = branch({
      '': () => 1,
      'bar': () => 2,
      '{param1}': () => 3,
    })

    assert.equal(getRoute('/', 'GET', {}), 1)
    assert.equal(getRoute('/bar', 'GET', {}), 2)
    assert.equal(getRoute('/baz', 'GET', {}), 3)
  })
  it('should return null if not specified', () => {
    const getRoute = branch({
      'foo': branch({
        'bar': () => 1,
      }),
    })

    assert.equal(getRoute('/', 'GET', {}), null)
    assert.equal(getRoute('/baz', 'GET', {}), null)
    assert.equal(getRoute('/foo/baz', 'GET', {}), null)
    assert.equal(getRoute('//', 'GET', {}), null)
    assert.equal(getRoute('//foo', 'GET', {}), null)
    assert.equal(getRoute('//foo/bar', 'GET', {}), null)
    assert.equal(getRoute('/foo//bar', 'GET', {}), null)
  })
  it('should throw an error if multiple wildcard paths are specified', () => {
    let threw = false
    try {
      branch({
        '{param1}': () => 1,
        '{param2}': () => 2,
      })
    } catch (err) {
      threw = true
    }
    assert.equal(threw, true)
  })
})

describe('methods', () => {
  it('should route to the correct handler', () => {
    const getRoute = methods({
      GET: 1,
      POST: 2,
      PUT: 3,
      PATCH: 4,
      DELETE: 5,
    })

    assert.equal(getRoute('', 'GET'), 1)
    assert.equal(getRoute('', 'POST'), 2)
    assert.equal(getRoute('', 'PUT'), 3)
    assert.equal(getRoute('', 'PATCH'), 4)
    assert.equal(getRoute('', 'DELETE'), 5)
  })
  it('should return null if the path is non-empty string', () => {
    const getRoute = methods({
      GET: 1,
    })

    assert.equal(getRoute('/', 'GET'), null)
    assert.equal(getRoute('/blah', 'GET'), null)
  })
  it('should return null if the path is not fully consumed by the routing', () => {
    const getRoute = branch({
      'foo': methods({
        GET: 1,
      }),
    })

    assert.equal(getRoute('/foo', 'GET', {}), 1)
    assert.equal(getRoute('/foo/', 'GET', {}), null)
    assert.equal(getRoute('/foo/bar', 'GET', {}), null)
  })
  it('should return null if not specified', () => {
    const getRoute = methods({
      GET: 1,
    })

    assert.equal(getRoute('', 'POST'), null)
  })
})
