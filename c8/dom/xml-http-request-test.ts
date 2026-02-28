// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @dep(//bzl/js:fetch)

import type {Response} from 'undici-types'

import {sinon, describe, it, before, assert} from '@nia/bzl/js/chai-js'

import {createXmlHttpRequestClass} from '@nia/c8/dom/xml-http-request'

import {assertThrowsWith} from './assert-throws-with'

const global = globalThis as any

class StubUrl extends URL {
  constructor(url: string) {
    super(url, 'http://localhost')
  }
}

const stubFetch = async (
  url: string
): Promise<Response> => {
  const response = sinon.createStubInstance(global.Response, {
    text: Promise.resolve(`Async HTTPS Read ${url}`),
  })
  Object.defineProperties(response, {
    ok: {get: sinon.stub().returns(true)},
    status: {get: sinon.stub().returns(200)},
  })
  return response as unknown as Response
}

const stubFetchFail = async (
  url: string
): Promise<Response> => {
  throw new Error(`Async HTTPS Error: ${url}`)
}

const stubFs = {
  promises: {
    readFile: async (path: string): Promise<string> => `Async File Read ${path}`,
  },
  readFileSync: (path: string): string => `Sync File Read ${path}`,
} as any

const stubFsFail = {
  promises: {
    readFile: async (path: string): Promise<string> => {
      throw new Error(`Async File Error: ${path}`)
    },
  },
  readFileSync: (path: string): string => { throw new Error(`Sync File Error: ${path}`) },
} as any

describe('XMLHttpRequest tests', () => {
  let XMLHttpRequest: ReturnType<typeof createXmlHttpRequestClass>
  let XMLHttpRequestFail: ReturnType<typeof createXmlHttpRequestClass>
  before(() => {
    XMLHttpRequest = createXmlHttpRequestClass(
      StubUrl,
      stubFetch,
      stubFs
    )
    XMLHttpRequestFail = createXmlHttpRequestClass(
      StubUrl,
      stubFetchFail,
      stubFsFail
    )
  })

  it('should succeed for synchronous file read', () => {
    const xhr = new XMLHttpRequest()
    assert.strictEqual(xhr.readyState, XMLHttpRequest.UNSENT)

    xhr.open('GET', 'file:///path/to/file', false)
    assert.strictEqual(xhr.readyState, XMLHttpRequest.OPENED)
    xhr.overrideMimeType('fake/mime-type')
    xhr.send()
    assert.strictEqual(xhr.readyState, XMLHttpRequest.DONE)
    assert.strictEqual(xhr.status, 0)
    assert.strictEqual(xhr.responseText, 'Sync File Read /path/to/file')
  })

  it('should fail for synchronous file read', () => {
    const xhr = new XMLHttpRequestFail()
    assert.strictEqual(xhr.readyState, XMLHttpRequest.UNSENT)

    xhr.open('GET', 'file:///path/to/file', false)
    assert.strictEqual(xhr.readyState, XMLHttpRequest.OPENED)
    xhr.overrideMimeType('fake/mime-type')
    assertThrowsWith(xhr.send.bind(xhr), null, 'Sync File Error: /path/to/file')
    assert.strictEqual(xhr.readyState, XMLHttpRequest.DONE)
    assert.strictEqual(xhr.status, 0)
    assert.strictEqual(xhr.responseText, '')
  })

  it('should succeed for asynchronous file fetch', async () => {
    const xhr = new XMLHttpRequest()
    assert.strictEqual(xhr.readyState, XMLHttpRequest.UNSENT)

    xhr.open('GET', 'file:///path/to/file', true)
    assert.strictEqual(xhr.readyState, XMLHttpRequest.OPENED)
    xhr.send()

    const readyStateChangeDone = new Promise<void>((resolve) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          resolve()
        }
      }
    })
    const loaded = new Promise<void>((resolve) => {
      xhr.onload = () => {
        resolve()
      }
    })

    await Promise.all([readyStateChangeDone, loaded])
    assert.strictEqual(xhr.readyState, XMLHttpRequest.DONE)
    assert.strictEqual(xhr.status, 0)
    assert.strictEqual(xhr.responseText, 'Async File Read /path/to/file')
  })

  it('should fail for asynchronous file fetch', async () => {
    const xhr = new XMLHttpRequestFail()
    assert.strictEqual(xhr.readyState, XMLHttpRequest.UNSENT)

    xhr.open('GET', 'file:///path/to/file', true)
    assert.strictEqual(xhr.readyState, XMLHttpRequest.OPENED)
    xhr.send()

    const readyStateChangeDone = new Promise<void>((resolve) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          resolve()
        }
      }
    })
    const erroredOut = new Promise<void>((resolve) => {
      xhr.onerror = () => {
        resolve()
      }
    })

    await Promise.all([readyStateChangeDone, erroredOut])
    assert.strictEqual(xhr.readyState, XMLHttpRequest.DONE)
    assert.strictEqual(xhr.status, 0)
    assert.strictEqual(xhr.responseText, '')
  })

  it('should succeed for asynchronous https fetch', async () => {
    const xhr = new XMLHttpRequest()
    assert.strictEqual(xhr.readyState, XMLHttpRequest.UNSENT)

    xhr.open('GET', 'https://example.com', true)
    assert.strictEqual(xhr.readyState, XMLHttpRequest.OPENED)
    xhr.send()

    const readyStateChangeDone = new Promise<void>((resolve) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          resolve()
        }
      }
    })
    const loaded = new Promise<void>((resolve) => {
      xhr.onload = () => {
        resolve()
      }
    })

    await Promise.all([readyStateChangeDone, loaded])
    assert.strictEqual(xhr.readyState, XMLHttpRequest.DONE)
    assert.strictEqual(xhr.status, 200)
    assert.strictEqual(xhr.responseText, 'Async HTTPS Read https://example.com/')
  })

  it('should fail for asynchronous https fetch', async () => {
    const xhr = new XMLHttpRequestFail()
    assert.strictEqual(xhr.readyState, XMLHttpRequest.UNSENT)

    xhr.open('GET', 'https://example.com', true)
    assert.strictEqual(xhr.readyState, XMLHttpRequest.OPENED)
    xhr.send()

    const readyStateChangeDone = new Promise<void>((resolve) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          resolve()
        }
      }
    })
    const erroredOut = new Promise<void>((resolve) => {
      xhr.onerror = () => {
        resolve()
      }
    })

    await Promise.all([readyStateChangeDone, erroredOut])
    assert.strictEqual(xhr.readyState, XMLHttpRequest.DONE)
    assert.strictEqual(xhr.status, 0)
    assert.strictEqual(xhr.responseText, '')
  })
})
