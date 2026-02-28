// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {
  describe, it, beforeEach, afterEach,
  assert, chai, chaiAsPromised,
} from '@nia/bzl/js/chai-js'

import {
  createDom,
  type Dom,
  type Window,
} from '@nia/c8/dom/dom'

chai.use(chaiAsPromised)

describe('DOM Event tests', () => {
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

  // Note: There is a new window between tests, so removing event listeners is not necessary.
  it('should be able to add event listener', () => {
    let eventReceivedCount = 0
    window.addEventListener('test-event', (event: Event) => {
      assert.strictEqual(event.type, 'test-event')
      eventReceivedCount++
    })
    window.dispatchEvent(new Event('test-event'))
    assert.strictEqual(eventReceivedCount, 1)
  })

  it('should be able to add different event listeners', () => {
    let eventReceivedCount = 0
    window.addEventListener('test-event', (event: Event) => {
      assert.strictEqual(event.type, 'test-event')
      eventReceivedCount++
    })
    window.dispatchEvent(new Event('test-event'))

    window.addEventListener('test-event-2', (event: Event) => {
      assert.strictEqual(event.type, 'test-event-2')
      eventReceivedCount++
    })
    window.dispatchEvent(new Event('test-event-2'))

    assert.strictEqual(eventReceivedCount, 2)
  })

  it('should be able to add different event listeners of same type', () => {
    let eventReceivedCount = 0
    window.addEventListener('test-event', (event: Event) => {
      assert.strictEqual(event.type, 'test-event')
      eventReceivedCount++
    })
    window.addEventListener('test-event', (event: Event) => {
      assert.strictEqual(event.type, 'test-event')
      eventReceivedCount++
    })
    window.dispatchEvent(new Event('test-event'))

    assert.strictEqual(eventReceivedCount, 2)
  })

  it('should be able to add / removing different event listeners of same type', () => {
    let eventReceivedCount = 0

    const onTestEvent = (event: Event) => {
      assert.strictEqual(event.type, 'test-event')
      eventReceivedCount++
    }

    const onTestEvent2 = (event: Event) => {
      assert.strictEqual(event.type, 'test-event')
      eventReceivedCount++
    }

    window.addEventListener('test-event', onTestEvent)
    window.addEventListener('test-event', onTestEvent2)
    window.dispatchEvent(new Event('test-event'))

    assert.strictEqual(eventReceivedCount, 2)

    window.removeEventListener('test-event', onTestEvent)
    window.dispatchEvent(new Event('test-event'))

    assert.strictEqual(eventReceivedCount, 3)

    window.removeEventListener('test-event', onTestEvent2)
    window.dispatchEvent(new Event('test-event'))

    assert.strictEqual(eventReceivedCount, 3)
  })
})
