// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @attr[](data = "dom-test.html")
// @attr[](data = "fetch-test-worker")

import {Dom, createDom, type Window} from '@nia/c8/dom/dom'
import {describe, it, beforeEach, afterEach, assert} from '@nia/bzl/js/chai-js'

describe('DOM window tests', () => {
  let dom: Dom
  let window: Window & {TOP_LEVEL_VAR?: number | undefined}

  beforeEach(async () => {
    dom = await createDom({width: 640, height: 480})
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
  })

  afterEach(async () => {
    await dom.dispose()
  })

  it('should create window proxy', async () => {
    const TEST_URL = `file://${process.env.TEST_SRCDIR}/_main/c8/dom/dom-test.html`
    assert.strictEqual(window.document.documentElement?.outerHTML,
      '<html><head></head><body></body></html>')

    window.TOP_LEVEL_VAR = 1

    assert.strictEqual(window.TOP_LEVEL_VAR, 1)

    await dom.navigate(TEST_URL)

    assert.isUndefined(window.TOP_LEVEL_VAR)

    assert.isAbove(window.document.getElementsByTagName('*').length, 18)
  })

  it('should create window proxy again', async () => {
    assert.isUndefined(window.TOP_LEVEL_VAR)

    const TEST_URL = `file://${process.env.TEST_SRCDIR}/_main/c8/dom/dom-test.html`
    assert.strictEqual(window.document.documentElement?.outerHTML,
      '<html><head></head><body></body></html>')

    await dom.navigate(TEST_URL)

    assert.isAbove(window.document.getElementsByTagName('*').length, 18)
  })
})
