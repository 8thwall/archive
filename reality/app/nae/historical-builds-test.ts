// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)
// @package(npm-ecr)

import {describe, it, assert} from '@nia/bzl/js/chai-js'

// TODO(lreyna): Fix XRHome symlink errors so we can import this from the historical-builds module
import {
  naeHistoricalBuildPk,
} from '@nia/reality/shared/nae/nae-utils'

describe('naeHistoricalBuildPk', () => {
  it('does not crash with invalid input', async () => {
    assert.equal(naeHistoricalBuildPk(''), 'nae-build:app:')
  })

  it('returns a key with valid input', async () => {
    assert.equal(naeHistoricalBuildPk('42ae06a3-1234'), 'nae-build:app:42ae06a3-1234')
  })
})
