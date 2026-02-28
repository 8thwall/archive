// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

/* eslint-disable dot-notation */
import {homedir} from 'os'
import {join} from 'path'
import {existsSync, promises as fs} from 'fs'

import {describe, it, assert, beforeEach, afterEach} from '@nia/bzl/js/chai-js'
import {
  createDom,
  type StorageEvent,
  type Dom,
  type Window,
} from '@nia/c8/dom/dom'

const pathForTesting = join(homedir(), 'Library', 'Caches', 'Native-Browse', 'storage-test')

describe('Storage tests', () => {
  let dom: Dom
  let window: Window
  beforeEach(async () => {
    // clear relics if they exist
    if (existsSync(pathForTesting)) {
      await fs.rm(pathForTesting, {recursive: true, force: true})
    }

    // setup
    dom = await createDom({width: 640, height: 480, internalStoragePath: pathForTesting})
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
    window.localStorage.clear()
  })

  afterEach(async () => {
    await dom.dispose()
  })

  it('test setting and getting value in localStorage', (done) => {
    const {localStorage} = window
    localStorage.setItem('test', 'test')
    assert.strictEqual(localStorage.getItem('test'), 'test')

    // @ts-ignore
    localStorage['test'] = 'test2'
    // @ts-ignore
    assert.strictEqual(localStorage['test'], 'test2')

    localStorage.removeItem('test')
    assert.strictEqual(localStorage.getItem('test'), null)

    done()
  })

  it('test listening to storage event', (done) => {
    const {localStorage} = window

    window.addEventListener('storage', (event: StorageEvent) => {
      assert.strictEqual(event.key, 'test')
      assert.strictEqual(event.oldValue, '')
      assert.strictEqual(event.newValue, 'test')
      done()
    })

    localStorage.setItem('test', 'test')
    assert.strictEqual(localStorage.getItem('test'), 'test')
  })

  it('test if offline file has data provided for local storage', async () => {
    const {localStorage} = window

    localStorage.setItem('test3', 'test3')
    assert.strictEqual(localStorage.getItem('test3'), 'test3')

    const newDom = await createDom({width: 640, height: 480, internalStoragePath: pathForTesting})
    let testWindow = dom.getCurrentWindow()
    newDom.onWindowChange((newWindow) => {
      testWindow = newWindow
    })

    const {localStorage: testLocalStorage} = testWindow

    assert.strictEqual(testLocalStorage.getItem('test3'), 'test3')
    await newDom.dispose()
  })

  it('test setting and getting value in session storage', () => {
    const {sessionStorage} = window
    sessionStorage.setItem('test4', 'test4')
    assert.strictEqual(sessionStorage.getItem('test4'), 'test4')

    // @ts-ignore
    sessionStorage['test4'] = 'test4'
    // @ts-ignore
    assert.strictEqual(sessionStorage['test4'], 'test4')

    sessionStorage.removeItem('test4')
    assert.strictEqual(sessionStorage.getItem('test4'), null)
  })

  it('test listening to storage event from session storage', (done) => {
    const {sessionStorage} = window

    window.addEventListener('storage', (event: StorageEvent) => {
      assert.strictEqual(event.key, 'test5')
      assert.strictEqual(event.oldValue, '')
      assert.strictEqual(event.newValue, 'test5')
      done()
    })

    sessionStorage.setItem('test5', 'test5')
    assert.strictEqual(sessionStorage.getItem('test5'), 'test5')
  })

  it('test if offline file does not have data stored for session storage', async () => {
    const {sessionStorage} = window

    sessionStorage.setItem('test6', 'test6')
    assert.strictEqual(sessionStorage.getItem('test6'), 'test6')

    const newDom = await createDom({width: 640, height: 480, internalStoragePath: pathForTesting})
    let testWindow = newDom.getCurrentWindow()
    newDom.onWindowChange((newWindow) => {
      testWindow = newWindow
    })

    const {sessionStorage: testSessionStorage} = testWindow

    assert.strictEqual(testSessionStorage.getItem('test6'), null)
    await newDom.dispose()
  })

  it('test local storage will fallback to session storage if path is not provided.', async () => {
    const newDom = await createDom({width: 640, height: 480})
    let testWindow = newDom.getCurrentWindow()
    newDom.onWindowChange((newWindow) => {
      testWindow = newWindow
    })
    const {localStorage} = testWindow

    localStorage.setItem('test7', 'test7')
    assert.strictEqual(localStorage.getItem('test7'), 'test7')

    const anotherDom = await createDom({width: 640, height: 480})
    let anotherTestWindow = anotherDom.getCurrentWindow()
    anotherDom.onWindowChange((newWindow) => {
      anotherTestWindow = newWindow
    })

    const {localStorage: testLocalStorage} = anotherTestWindow

    assert.strictEqual(testLocalStorage.getItem('test7'), null)
    await newDom.dispose()
    await anotherDom.dispose()
  })
})
