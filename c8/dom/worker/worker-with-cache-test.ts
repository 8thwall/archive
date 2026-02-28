// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @attr[](data = "//c8/dom/worker/scripts:worker-test-with-cache-data")

import {describe, it, assert, beforeEach, afterEach} from '@nia/bzl/js/chai-js'

import {
  createDom,
  type Dom,
  type Window,
  type Worker,
} from '@nia/c8/dom/dom'

describe('Worker tests with Cache', () => {
  let dom: Dom
  let window: Window

  beforeEach(async () => {
    dom = await createDom({
      width: 640,
      height: 480,
      internalStoragePath: `file://${process.env.TEST_SRCDIR}`,
    })
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
  })

  afterEach(async () => {
    await dom.dispose()
  })

  it('Check that internal cache path exists', (done) => {
    const TEST_URL =
        `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-with-cache-0.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {name: 'test-worker'})

    worker.postMessage('Start Test')

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'test passed')
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  // TODO(lreyna): Use better proxy to test the HttpCache object
})
