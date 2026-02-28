// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @attr[](data = "//c8/dom:fetch-test-worker")
// @attr[](data = "//c8/dom/rendering:texture-loading-test-data")

import path from 'path'

import {describe, it, assert} from '@nia/bzl/js/chai-js'

import {
  createDom,
} from '@nia/c8/dom/dom'

const runfilesDir = process.env.RUNFILES_DIR || ''
const fetchWorkerPath = path.join(runfilesDir!, '_main/c8/dom/fetch-test-worker.js')

describe('Texture Loading Tests', () => {
  // There have been problems where NAE compiled in release mode will minify class names,
  // this tends to break some WebGL2 Texture load calls that check the `constructor.name` of
  // different DOM classes to source data from.
  it('should be able to load a texture and read pixels using three.js', async () => {
    // Expecting no errors to be thrown when processing the html file.
    const TEST_FILE_NAME = 'texture-loading-test-source.html'
    const TEST_URL = `file://${process.env.TEST_SRCDIR}/_main/c8/dom/rendering/${TEST_FILE_NAME}`

    assert.doesNotThrow(async () => {
      const dom = await createDom({width: 640, height: 480, url: TEST_URL, fetchWorkerPath})
      await dom.dispose()
    })
  })
})
