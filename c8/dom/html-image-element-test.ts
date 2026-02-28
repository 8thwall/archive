// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @attr[](data = "fetch-test-worker")

import path from 'path'

import {describe, it, assert, afterEach} from '@nia/bzl/js/chai-js'
import {createDom, type Dom} from './dom'
import type {HTMLImageElement} from './html-image-element'

const runfilesDir = process.env.RUNFILES_DIR || ''
const fetchWorkerPath = path.join(runfilesDir!, '_main/c8/dom/fetch-test-worker.js')

// eslint-disable-next-line max-len
const SAMPLE_IMAGE_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAG0lEQVR4nGKJ2122i+Mc42E+8Q9vjgACAAD//yuFBq00geKlAAAAAElFTkSuQmCC'

describe('HTMLImageElement', () => {
  let dom: Dom

  afterEach(async () => {
    await dom.dispose()
  })

  it('should fetch when src is set', async () => {
    dom = await createDom({width: 640, height: 480, url: 'about:blank', fetchWorkerPath})
    const {document} = dom.getCurrentWindow()

    const img = document.createElement('img')

    await new Promise<void>((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject

      img.src = SAMPLE_IMAGE_URL
    })
  })

  it('should fetch is src attribute is set', async () => {
    dom = await createDom({width: 640, height: 480, url: 'about:blank', fetchWorkerPath})
    const {document} = dom.getCurrentWindow()

    const img = document.createElement('img')

    return new Promise<void>((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject

      img.setAttribute('src', SAMPLE_IMAGE_URL)
    })
  })

  it('should fetch if html is inserted', async () => {
    dom = await createDom({width: 640, height: 480, url: 'about:blank', fetchWorkerPath})
    const {document} = dom.getCurrentWindow()

    const container = document.createElement('div')
    document.body.appendChild(container)
    container.innerHTML = `<img src="${SAMPLE_IMAGE_URL}" />`

    const img = container.children[0] as HTMLImageElement

    assert.exists(img)

    if (img.complete) {
      return
    }

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
    })

    assert.isTrue(img.complete)
  })
})
