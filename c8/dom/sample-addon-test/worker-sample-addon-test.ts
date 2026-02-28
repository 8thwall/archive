// @package(npm-rendering)
// @attr(target = "node")
// @dep(:sample-addon)

// @attr[](data = ":sample-addon")
// @attr[](data = ":sample-addon-worker-1")
// @attr[](data = ":sample-addon-worker-2")

import path from 'path'

import sampleAddon from '@nia/c8/dom/sample-addon-test/sample-addon'

import {describe, it, assert, beforeEach, afterEach} from '@nia/bzl/js/chai-js'

import {
  createDom,
  type Dom,
  type Window,
  type Worker,
} from '@nia/c8/dom/dom'

describe('Worker tests', () => {
  let dom: Dom
  let window: Window
  beforeEach(async () => {
    dom = await createDom({
      width: 640,
      height: 480,
    })
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
  })

  afterEach(async () => {
    await dom.dispose()
  })

  it('Should observe a destructor call', (done) => {
    const testPath = path.join(
      process.env.TEST_SRCDIR!,
      '_main/c8/dom/sample-addon-test/sample-addon-worker-1.js'
    )
    const testUrl = `file://${testPath}`
    const worker: Worker = new window.Worker(testUrl,
      {name: 'sample-addon-worker'})

    worker.postMessage('start')

    worker.onmessage = (e) => {
      try {
        const expectedValue = 42
        assert.strictEqual(e.data, expectedValue)
        worker.terminate()

        setTimeout(() => {
          assert.equal(
            sampleAddon.getNumDestructors(),
            1,
            'There should have been at one destructor called'
          )

          assert.isTrue(sampleAddon.getNumDestructors() === sampleAddon.getNumConstructors(),
            'The number of destructors should be equal to the number of constructors')

          done()
        }, 1000)
      } catch (error) {
        done(error)
      }
    }
  })

  it('Should observe multiple destructors calls', (done) => {
    const testPath = path.join(
      process.env.TEST_SRCDIR!,
      '_main/c8/dom/sample-addon-test/sample-addon-worker-2.js'
    )
    const testUrl = `file://${testPath}`
    const worker: Worker = new window.Worker(testUrl,
      {name: 'sample-addon-worker'})

    worker.postMessage('start')

    worker.onmessage = (e) => {
      try {
        const expectedValue = 697
        assert.strictEqual(e.data, expectedValue)
        worker.terminate()

        setTimeout(() => {
          assert.isTrue(sampleAddon.getNumDestructors() > 1,
            'There should have been more than one destructor called')

          assert.isTrue(sampleAddon.getNumDestructors() === sampleAddon.getNumConstructors(),
            'The number of destructors should be equal to the number of constructors')

          done()
        }, 1000)
      } catch (error) {
        done(error)
      }
    }
  })
})
