// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, assert, beforeEach, afterEach} from '@nia/bzl/js/chai-js'

import {
  createDom,
  type Dom,
  type Window,
} from '@nia/c8/dom/dom'

// eslint-disable-next-line max-len
const SAMPLE_IMAGE_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAG0lEQVR4nGKJ2122i+Mc42E+8Q9vjgACAAD//yuFBq00geKlAAAAAElFTkSuQmCC'

describe('ImageBitmap tests', () => {
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

  // NOTE(lreyna): createImageBitmap is not implemented in `window-or-worker-context.ts`
  // Turn the test back on when it is implemented
  it.skip('should be able to create an ImageBitmap with an HTMLImageElement', async () => {
    const img = window.document.createElement('img')
    img.src = SAMPLE_IMAGE_URL

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
    })

    const imageBitmap = await window.createImageBitmap(img)
    assert.strictEqual(imageBitmap.width, img.naturalWidth)
    assert.strictEqual(imageBitmap.height, img.naturalHeight)

    imageBitmap.close()
  })

  it.skip('should throw InvalidStateError with HTMLImageElement that was not loaded', async () => {
    const img = window.document.createElement('img')

    try {
      await window.createImageBitmap(img)
      assert.fail('Expected InvalidStateError to be thrown')
    } catch (err) {
      assert.instanceOf(err, window.DOMException)
      assert.strictEqual(err.message, 'InvalidStateError')
    }
  })
})
