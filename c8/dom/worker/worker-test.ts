// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @attr[](data = "//c8/dom/worker/scripts:worker-test-data")

import {describe, it, assert, beforeEach, afterEach} from '@nia/bzl/js/chai-js'

import {
  createDom,
  type ErrorEvent,
  type Dom,
  type Window,
  type Worker,
} from '@nia/c8/dom/dom'

describe('Worker tests', () => {
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

  it('should receive the correct message from the worker using data url', (done) => {
    const worker: Worker = new window.Worker('data:text/javascript,self.postMessage("hello");',
      {name: 'test-worker'})

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'hello')
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  it('should send the correct message to the worker and back using data url', (done) => {
    const worker: Worker = new window.Worker(`data:text/javascript,
      self.onmessage = (e) => {
        if (e.data === 'hello') {
          self.postMessage('test passed');
        }
      };`,
    {name: 'test-worker'})

    worker.postMessage('hello')

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'test passed')
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  it('should send the correct message to the worker and back using data (no self)', (done) => {
    const worker: Worker = new window.Worker(`data:text/javascript,
      onmessage = (e) => {
        if (e.data === 'hello') {
          postMessage('test passed');
        }
      };`,
    {name: 'test-worker'})

    worker.postMessage('hello')

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'test passed')
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  it('should receive the correct message from the worker using file url', (done) => {
    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-0.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {name: 'test-worker'})

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'hello')
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  it('should send the correct message to the worker and back using file url', (done) => {
    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-1.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {name: 'test-worker'})

    worker.postMessage('hello')

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'test passed')
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  it('should send the correct message to the worker and back using file (no self)', (done) => {
    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-2.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {name: 'test-worker'})

    worker.postMessage('hello')

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'test passed')
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  it('should send the correct message with transferable array to the worker and back', (done) => {
    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-3.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {name: 'test-worker'})

    const byteLength = 1024
    const uInt8Array = new Uint8Array(byteLength)
    assert.strictEqual(uInt8Array.byteLength, byteLength)

    assert.strictEqual(uInt8Array[0], 0)
    worker.postMessage(uInt8Array, [uInt8Array.buffer])

    assert.strictEqual(uInt8Array.byteLength, 0)
    assert.strictEqual(uInt8Array[0], undefined)

    worker.onmessage = (e) => {
      try {
        assert.instanceOf(e.data, Uint8Array)
        const receivedArray = e.data
        assert.strictEqual(receivedArray.byteLength, byteLength)
        assert.strictEqual(receivedArray[0], 1)
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  it('should send the correct message with transferable object to the worker and back', (done) => {
    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-3.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {name: 'test-worker'})

    const byteLength = 1024
    const uInt8Array = new Uint8Array(byteLength)
    assert.strictEqual(uInt8Array.byteLength, byteLength)

    assert.strictEqual(uInt8Array[0], 0)
    worker.postMessage(uInt8Array, {transfer: [uInt8Array.buffer]})

    assert.strictEqual(uInt8Array.byteLength, 0)
    assert.strictEqual(uInt8Array[0], undefined)

    worker.onmessage = (e) => {
      try {
        assert.instanceOf(e.data, Uint8Array)
        const receivedArray = e.data
        assert.strictEqual(receivedArray.byteLength, byteLength)
        assert.strictEqual(receivedArray[0], 1)
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  it('verify self', (done) => {
    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-4.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {name: 'test-worker'})

    worker.postMessage('Start Test', {})

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'test passed')
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  it('Check for thrown Errors after worker is loaded', (done) => {
    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-5.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {name: 'test-worker'})

    worker.onmessage = () => {
      done(new Error('Should not have received a message'))
    }

    worker.onerror = (e: ErrorEvent) => {
      assert.strictEqual(e.message, 'test passed')
      done()
    }

    worker.postMessage('Start Test')
  })

  it('should receive message from module worker', (done) => {
    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-module-script.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {type: 'module', name: 'test-worker'})

    worker.onerror = (e) => {
      done(new Error(`Test should not have thrown an error: ${e.message}`))
    }

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'test passed')
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }

    worker.postMessage('hello')
  })

  it('Test WorkerGlobalScope importScripts method', (done) => {
    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-7.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {name: 'test-worker'})

    worker.postMessage('hello')

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'test passed')
        done()
      } catch (error) {
        done(error)
      } finally {
        worker.terminate()
      }
    }
  })

  it('Test DedicatedWorkerGlobalScope self.close', (done) => {
    const TEST_URL =
      `file://${process.env.TEST_SRCDIR}/_main/c8/dom/worker/scripts/worker-test-8.js`
    const worker: Worker = new window.Worker(TEST_URL,
      {name: 'test-worker'})

    worker.postMessage('hello')
    worker.postMessage('hello2')  // Should not be received

    worker.onmessage = (e) => {
      try {
        assert.strictEqual(e.data, 'test passed')
        done()
      } catch (error) {
        done(error)
      }
    }

    // NOTE: Lack of worker.terminate(), since the worker will close itself
  })
})
