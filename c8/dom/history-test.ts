// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, assert, beforeEach, afterEach} from '@nia/bzl/js/chai-js'
import {createDom, Dom, type Window} from '@nia/c8/dom/dom'

describe('History tests', () => {
  let dom: Dom
  let window: Window

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

  it('should be available on window', async () => {
    // Test that history exists.
    assert.isOk(window.history, 'window.history should exist')

    // Test that accessing properties does not throw.
    assert.isNumber(window.history.length, 'history.length should be a number')
    assert.ok(['auto', 'manual'].includes(window.history.scrollRestoration),
      'history.scrollRestoration should be auto or manual')
    assert.doesNotThrow(() => window.history.state, 'accessing history.state should not throw')

    // Test that methods exist and calling them doesn't crash.
    assert.isFunction(window.history.back, 'history.back should be a function')
    assert.isFunction(window.history.forward, 'history.forward should be a function')
    assert.isFunction(window.history.go, 'history.go should be a function')
    assert.isFunction(window.history.pushState, 'history.pushState should be a function')
    assert.isFunction(window.history.replaceState, 'history.replaceState should be a function')
  })

  it('should not crash', async () => {
    assert.equal(window.history.length, 1, 'history.length should be 1')
    assert.equal(window.history.state, null, 'history.state should be null')

    // Test that they don't crash.
    window.history.back()
    window.history.forward()
    window.history.go(0)
    window.history.pushState({test: true}, 'Test Title', '/test')
    window.history.replaceState({test: 'replace'}, 'Replace Title', '/replace')
  })
})
