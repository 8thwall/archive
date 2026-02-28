// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import os from 'os'

import {createDom, type Window, type Dom} from '@nia/c8/dom/dom'
import {describe, it, beforeEach, assert, afterEach} from '@nia/bzl/js/chai-js'

describe('Window - Navigator tests', () => {
  let window: Window & {TOP_LEVEL_VAR?: number | undefined}
  let dom: Dom

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

  it('should have navigator apis available and giving expected answers', () => {
    assert.strictEqual(window.navigator.appCodeName, 'Mozilla')
    assert.strictEqual(window.navigator.appName, 'Netscape')
    assert.strictEqual(window.navigator.userAgent, 'Mozilla/5.0 AppleWebKit/537.36 Chrome/127.0.0.0 Safari/537.36')
    assert.strictEqual(window.navigator.product, 'Gecko')
    assert.strictEqual(window.navigator.version, '1.0.0')
    assert.strictEqual(window.navigator.platform, os.platform())
    assert.strictEqual(window.navigator.vendor, '')
    assert.strictEqual(window.navigator.vendorSub, '')
    assert.isTrue(window.navigator.cookieEnabled)
  })
})