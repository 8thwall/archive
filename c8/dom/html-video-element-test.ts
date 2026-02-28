// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @attr[](data = "fetch-test-worker")

import path from 'path'

import {describe, it, assert, afterEach} from '@nia/bzl/js/chai-js'
import {createDom, type Dom} from './dom'
import type {HTMLVideoElement} from './html-video-element'

const runfilesDir = process.env.RUNFILES_DIR || ''
const fetchWorkerPath = path.join(runfilesDir!, '_main/c8/dom/fetch-test-worker.js')

// eslint-disable-next-line max-len
const SAMPLE_VIDEO_URL = 'https://threejs.org/examples/textures/pano.mp4'

describe('HTMLVideoElement', () => {
  let dom: Dom

  afterEach(async () => {
    await dom.dispose()
  })

  it('should fetch when src is set', async () => {
    dom = await createDom({width: 640, height: 480, url: 'about:blank', fetchWorkerPath})
    const {document} = dom.getCurrentWindow()

    const video = document.createElement('video')

    video.src = SAMPLE_VIDEO_URL

    video.addEventListener('canplaythrough', () => {
      video.play()
    })
  })

  it('should fetch if html is inserted', async () => {
    dom = await createDom({width: 640, height: 480, url: 'about:blank', fetchWorkerPath})
    const {document} = dom.getCurrentWindow()

    const container = document.createElement('div')
    document.body.appendChild(container)
    container.innerHTML = `<video src="${SAMPLE_VIDEO_URL}" />`

    const video = container.children[0] as HTMLVideoElement

    assert.exists(video)
  })
})
