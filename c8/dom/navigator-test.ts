// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, assert, afterEach, beforeEach} from '@nia/bzl/js/chai-js'

import {
  createDom,
  Dom,
  type Window,
} from '@nia/c8/dom/dom'

describe('Navigator test', () => {
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

  it('check default navigator language', () => {
    // The expected language on test runners should be 'en-US' since __niaSystemLocale is not set.
    const {language} = window.navigator
    assert.strictEqual(language, 'en-US')
  })

  it('check setting navigator language', async () => {
    // Must dispose the current dom to create a new one with a different context.
    // This is due to the fetch worker implementation
    await dom.dispose()

    dom = await createDom({
      width: 640,
      height: 480,
      context: {
        __niaSystemLocale: 'de-DE',
      },
    })
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })

    const {language} = window.navigator
    assert.strictEqual(language, 'de-DE')
  })

  it('check default navigator userAgent', () => {
    const {userAgent} = window.navigator
    assert.strictEqual(userAgent, 'Mozilla/5.0 AppleWebKit/537.36 Chrome/127.0.0.0 Safari/537.36')
  })

  it('check setting navigator language', async () => {
    // Must dispose the current dom to create a new one with a different context.
    // This is due to the fetch worker implementation
    await dom.dispose()

    const expectedUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'

    dom = await createDom({
      width: 640,
      height: 480,
      context: {
        __niaUserAgent: expectedUserAgent,
      },
    })
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })

    const {userAgent} = window.navigator
    assert.strictEqual(userAgent, expectedUserAgent)
  })

  it('can call vibrate()', () => {
    // These should be false since the vibration API is not implemented in the test environment.
    assert.isFalse(window.navigator.vibrate([0]))
    assert.isFalse(window.navigator.vibrate(0))
    assert.isFalse(window.navigator.vibrate(1000))
    assert.isFalse(window.navigator.vibrate([1000]))
    assert.isFalse(window.navigator.vibrate([1000, 500, 1000]))
  })

  // TODO: Add more navigator tests
})
