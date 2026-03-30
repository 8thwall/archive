import {describe, it, assert} from '@nia/bzl/js/chai-js'

import {standardizeHeaders, readStandardizedHeader} from './headers'

const assertJsonEquality = (actual, expected) => {
  assert.equal(JSON.stringify(actual), JSON.stringify(expected))
}

describe('standardizeHeaders', () => {
  it('rewrites headers to lowercase', () => {
    const res = standardizeHeaders({
      HEADER1: 1,
      Header2: 2,
    })

    assertJsonEquality(res, {
      header1: 1,
      header2: 2,
    })
  })
  it('uses the first value present for a given header', () => {
    const res = standardizeHeaders({
      Header: 1,
      HEADER: 2,
    })

    assertJsonEquality(res, {
      header: 1,
    })
  })
})

describe('readStandardizedHeader', () => {
  it('returns a header\'s value', () => {
    assert.equal(readStandardizedHeader({header: 1}, 'header'), 1)
  })
  it('ignores casing when finding a match', () => {
    assert.equal(readStandardizedHeader({header: 1}, 'HEADER'), 1)
  })
  it('returns the first match if multiple values match', () => {
    assert.equal(readStandardizedHeader({header: 1, HEADER: 2}, 'HEADER'), 1)
  })
})
