// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, assert, before, after} from '@nia/bzl/js/chai-js'
import {
  createDom,
  type Dom,
  type Window,
} from '@nia/c8/dom/dom'
import {Document} from './document'

describe('ResizeObserver API', () => {
  let dom: Dom
  let window: Window
  const doc = new Document()

  before(async () => {
    dom = await createDom({width: 640, height: 480})
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
  })

  after(async () => {
    await dom.dispose()
  })

  it('should exist on the window object', () => {
    assert.property(window, 'ResizeObserver')
    assert.isDefined(window.ResizeObserver)
    assert.isFunction(window.ResizeObserver)
  })

  it('should be instantiable', () => {
    const resizeObserver = new window.ResizeObserver(() => {})
    assert.instanceOf(resizeObserver, window.ResizeObserver)
  })

  it('should be able to observe/unobserve an element', () => {
    const resizeObserver = new window.ResizeObserver(() => {})
    const element = doc.createElement('div')
    assert.property(resizeObserver, 'observe')
    assert.isFunction(resizeObserver.observe)
    resizeObserver.observe(element)
    resizeObserver.unobserve(element)
  })

  it('should not crash when unobserving an untracked element', () => {
    const resizeObserver = new window.ResizeObserver(() => {})
    const element = doc.createElement('div')
    assert.property(resizeObserver, 'unobserve')
    assert.isFunction(resizeObserver.unobserve)
    resizeObserver.unobserve(element)
  })

  it('should have disconnect method', () => {
    const resizeObserver = new window.ResizeObserver(() => {})
    assert.property(resizeObserver, 'disconnect')
    assert.isFunction(resizeObserver.disconnect)
    resizeObserver.disconnect()
  })
})
