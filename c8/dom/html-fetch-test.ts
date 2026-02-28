// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @attr[](data = "fetch-test-worker")
// @attr[](data = "html-fetch-test.html")
// @attr[](data = "html-fetch-test-0.js")
// @attr[](data = "html-fetch-test-1.js")
// @attr[](data = "html-fetch-test-2.js")
// @attr[](data = "html-fetch-test-3.js")
// @attr[](data = "html-fetch-test-4.js")
// @attr[](data = "html-fetch-test-5.js")
// @attr[](data = "html-fetch-test-6.js")
// @attr[](data = "html-fetch-test-7.js")
// @attr[](data = "html-fetch-test-8.js")
// @attr[](data = "html-fetch-test-9.js")
// @attr[](data = "html-fetch-test-missing-html-tag.html")

import path from 'path'

import type {Request} from 'undici-types'

import {describe, it, assert, afterEach} from '@nia/bzl/js/chai-js'
import {
  createDom,
  type Dom,
} from '@nia/c8/dom/dom'

import type {WorkerLogs} from './fetch-worker-helper'

const runfilesDir = process.env.RUNFILES_DIR || ''
const fetchWorkerPath = path.join(runfilesDir!, '_main/c8/dom/fetch-test-worker.js')

describe('html-fetch tests', () => {
  let dom: Dom

  afterEach(async () => {
    await dom.dispose()
  })

  it('should fetch html and execute scripts in order', async () => {
    const context: any = {orderResult: ''}

    const async0Promise = new Promise<void>((resolve) => {
      context.asyncDone0 = resolve
    })
    const async1Promise = new Promise<void>((resolve) => {
      context.asyncDone1 = resolve
    })
    const loadPromise = new Promise<void>((resolve) => {
      context.loadDone = resolve
    })

    const TEST_URL = `file://${process.env.TEST_SRCDIR}/_main/c8/dom/html-fetch-test.html`
    dom = await createDom({width: 640, height: 480, url: TEST_URL, fetchWorkerPath, context})
    const window = dom.getCurrentWindow()
    const {document} = window

    assert.strictEqual(document.children.length, 1)

    const root = document.children[0]
    assert.strictEqual(document.documentElement, root)

    assert.instanceOf(root, window.HTMLHtmlElement)
    assert.strictEqual(root.children.length, 2)
    assert.instanceOf(root.children[0], window.HTMLHeadElement)
    assert.instanceOf(root.children[1], window.HTMLBodyElement)

    assert.strictEqual(document.head, root.children[0])
    assert.strictEqual(document.body, root.children[1])

    assert.strictEqual(document.head, document.querySelector('head'))
    assert.strictEqual(document.body, document.querySelector('body'))

    assert.strictEqual(document.title, 'My Sample Page')

    await Promise.all([async0Promise, async1Promise, loadPromise])

    assert.strictEqual((window as any).orderResult, '0-1-2-3-4-5-6-7-7a-8-9-10-11-DONE')
  })

  it('should fetch html and execute scripts in order (no root htmlElement)', async () => {
    const context: any = {orderResult: ''}

    const async0Promise = new Promise<void>((resolve) => {
      context.asyncDone0 = resolve
    })
    const async1Promise = new Promise<void>((resolve) => {
      context.asyncDone1 = resolve
    })
    const loadPromise = new Promise<void>((resolve) => {
      context.loadDone = resolve
    })

    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/html-fetch-test-missing-html-tag.html`
    dom = await createDom({width: 640, height: 480, url: TEST_URL, fetchWorkerPath, context})
    const window = dom.getCurrentWindow()
    const {document} = window

    assert.strictEqual(document.children.length, 1)

    const root = document.children[0]
    assert.strictEqual(document.documentElement, root)

    assert.instanceOf(root, window.HTMLHtmlElement)
    assert.strictEqual(root.children.length, 2)
    assert.instanceOf(root.children[0], window.HTMLHeadElement)
    assert.instanceOf(root.children[1], window.HTMLBodyElement)

    assert.strictEqual(document.head, root.children[0])
    assert.strictEqual(document.body, root.children[1])

    assert.strictEqual(document.head, document.querySelector('head'))
    assert.strictEqual(document.body, document.querySelector('body'))

    assert.strictEqual(document.title, 'My Sample Page')

    await Promise.all([async0Promise, async1Promise, loadPromise])

    assert.strictEqual((window as any).orderResult, '0-1-2-3-4-5-6-7-7a-8-9-10-11-DONE')
  })

  describe('when fetching from a script', () => {
    // File & Data URLs have specific behavior in our fetch implementation. We need to test with
    // non-file / non-data URLs.
    const TEST_URL = 'https://www.example.com/'

    it('should fetch relative URLs and request objects', async () => {
      dom = await createDom({width: 640, height: 480, url: TEST_URL, fetchWorkerPath})
      const {fetchWorker} = dom.getCurrentContext()
      const {callCount, requestsLog} = await new Promise<WorkerLogs>(resolve => setTimeout(() => {
        fetchWorker.postMessage({type: 'test', testCase: 'relative-urls-and-requests'})
        fetchWorker.on('message', (msg: WorkerLogs) => {
          const {testCase} = msg
          if (testCase === 'relative-urls-and-requests') {
            resolve(msg)
          }
        })
      }, 100))

      assert.equal(callCount, 3)

      // Verify that both the requests sent to the built-in fetch are correct.
      // For example, the URL for the HTML is "https://www.example.com/" and the URL for the
      // the relative content fetched in the HTML is "/some-path".
      // From the fetch function, we should expect the following URLs as arguments:
      // 1. https://www.example.com/
      // 2. https://www.example.com/some-path
      const requestInfo1 = requestsLog[0].href
      assert.equal(requestInfo1, TEST_URL)

      const requestInfo2 = requestsLog[1].href
      assert.equal(requestInfo2, `${TEST_URL}some-path`)
    })

    it('should retain any request props for request objects', async () => {
      dom = await createDom({width: 640, height: 480, url: TEST_URL, fetchWorkerPath})
      const {fetchWorker} = dom.getCurrentContext()
      const {callCount, requestsLog} = await new Promise<WorkerLogs>(resolve => setTimeout(() => {
        fetchWorker.postMessage({type: 'test', testCase: 'request-props'})
        fetchWorker.on('message', (msg: WorkerLogs) => {
          const {testCase} = msg
          if (testCase === 'request-props') {
            resolve(msg)
          }
        })
      }, 100))

      assert.equal(callCount, 3)

      const requestInfo1 = requestsLog[0].href
      assert.equal(requestInfo1, TEST_URL)

      const requestInfo3 = requestsLog[2].input as Request
      assert.equal(requestInfo3.url, 'https://www.example2.com/')
      assert.equal(requestInfo3.mode, 'cors')
    })
  })
})
