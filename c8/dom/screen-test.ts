// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {afterEach, assert, describe, it} from '@nia/bzl/js/chai-js'
import {type Dom, createDom} from '@nia/c8/dom/dom'

describe('Screen', () => {
  let dom: Dom

  it('should have expected properties', async () => {
    dom = await createDom({width: 640, height: 480})
    let window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
    const {screen} = window

    assert.isNumber(screen.width)
    assert.isNumber(screen.height)
    assert.isNumber(screen.availWidth)
    assert.isNumber(screen.availHeight)
    assert.isNumber(screen.colorDepth)
    assert.isNumber(screen.pixelDepth)

    assert.equal(screen.toString(), '[object Screen]')
  })

  it('screen dimensions should use internal values for width and height', async () => {
    const internalScreenWidth = 1920
    const internalScreenHeight = 1080

    dom = await createDom({
      width: 640,
      height: 480,
      context: {
        __niaScreenWidth: internalScreenWidth,
        __niaScreenHeight: internalScreenHeight,
      },
    })
    let window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
    const {screen} = window

    assert.equal(screen.width, internalScreenWidth)
    assert.equal(screen.height, internalScreenHeight)
  })

  it('screen dimensions should fallback to window width and height', async () => {
    const windowWidth = 800
    const windowHeight = 600

    dom = await createDom({width: windowWidth, height: windowHeight})
    let window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
    const {screen} = window

    assert.equal(screen.width, window.innerWidth)
    assert.equal(screen.height, window.innerHeight)
  })

  afterEach(async () => {
    await dom.dispose()
  })
})
