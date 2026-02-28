// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @attr[](data = "dom-test.html")
// @attr[](data = "fetch-test-worker")

import {
  describe, it, beforeEach, afterEach,
  assert, chai, chaiAsPromised,
} from '@nia/bzl/js/chai-js'

import {
  createDom,
  type Dom,
  type Document,
  type Window,
  type HTMLCanvasElement,
} from '@nia/c8/dom/dom'

chai.use(chaiAsPromised)

describe('DOM tests', () => {
  let dom: Dom
  let window: Window
  let document: Document
  beforeEach(async () => {
    dom = await createDom({width: 640, height: 480})
    window = dom.getCurrentWindow()
    document = window.document
    dom.onWindowChange((newWindow) => {
      window = newWindow
      document = window.document
    })
  })

  afterEach(async () => {
    await dom.dispose()
  })

  it('should have expected prototype chain', () => {
    const body = document.createElement('body')

    assert.instanceOf(body, window.HTMLBodyElement)
    assert.instanceOf(body, window.HTMLElement)
    assert.instanceOf(body, window.Element)
    assert.instanceOf(body, window.Node)

    const div = document.createElement('div')

    assert.instanceOf(div, window.HTMLDivElement)
    assert.instanceOf(div, window.HTMLElement)
    assert.instanceOf(div, window.Element)
    assert.instanceOf(div, window.Node)
  })

  it('should have XMLHttpRequest', () => {
    const xhr = new window.XMLHttpRequest()
    assert.instanceOf(xhr, window.XMLHttpRequest)
    assert.instanceOf(xhr, window.EventTarget)
  })

  it('should find element via querySelector', () => {
    const body = document.body!
    const div = document.createElement('div')
    const span1 = document.createElement('span')
    const span2 = document.createElement('span')
    const span3 = document.createElement('span')
    const em = document.createElement('em')

    span1.id = 'span-1'
    span2.id = 'span-2'
    span3.id = 'span-3'

    span2.className = 'coolSpan funSpan yeahSpan'
    span3.className = 'neatSpan funSpan'

    body.appendChild(div)
    div.appendChild(span1)
    div.appendChild(span2)
    div.appendChild(span3)
    span1.appendChild(em)

    // Query by tagName.
    assert.strictEqual(document.querySelector('span'), span1)
    assert.deepEqual([...document.querySelectorAll('span')], [span1, span2, span3])

    // Query by id on the body.
    assert.strictEqual(body.querySelector('#span-1'), span1)
    assert.deepEqual([...body.querySelectorAll('#span-3')], [span3])

    // Query by class on the document.
    assert.strictEqual(document.querySelector('.coolSpan'), span2)
    assert.strictEqual(document.querySelector('.funSpan'), span2)
  })

  it('window should have expected properties', () => {
    assert.instanceOf(window, window.Window)
    assert.strictEqual(window, window.window)
  })

  it('document should have expected properties', () => {
    const doc2 = new window.Document()
    assert.instanceOf(doc2, window.Document)

    assert.instanceOf(document, window.Document)
    assert.strictEqual(document, window.document)
  })

  it('should render to webgl context in HTMLCanvasElement', () => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')!

    assert.strictEqual(gl.canvas, canvas)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const pixels = new Uint8Array(4)
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

    assert.deepEqual(pixels, new Uint8Array([0, 0, 0, 255]))
  })

  it('should render to webgl2 context in HTMLCanvasElement', () => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')!

    assert.strictEqual(gl.canvas, canvas)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const pixels = new Uint8Array(4)
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

    assert.deepEqual(pixels, new Uint8Array([0, 0, 0, 255]))
  })

  it('should work with Text nodes', () => {
    const text = document.createTextNode('Hello, world!')
    const div = document.createElement('div')

    div.appendChild(text)

    assert.strictEqual(div.textContent, 'Hello, world!')
  })

  it('should render to webgl context in OffscreenContext', () => {
    const offscreenCanvas = new window.OffscreenCanvas(300, 150)
    const offscreenGl = offscreenCanvas.getContext('webgl')!

    assert.strictEqual(offscreenGl.canvas, offscreenCanvas)

    offscreenGl.clearColor(1.0, 1.0, 1.0, 1.0)
    offscreenGl.clear(offscreenGl.COLOR_BUFFER_BIT)

    const pixels = new Uint8Array(4)
    offscreenGl.readPixels(0, 0, 1, 1, offscreenGl.RGBA, offscreenGl.UNSIGNED_BYTE, pixels)

    assert.deepEqual(pixels, new Uint8Array([255, 255, 255, 255]))
  })

  it('should render to webgl2 context in OffscreenContext', () => {
    const offscreenCanvas = new window.OffscreenCanvas(300, 150)
    const offscreenGl = offscreenCanvas.getContext('webgl2')!

    assert.strictEqual(offscreenGl.canvas, offscreenCanvas)

    offscreenGl.clearColor(1.0, 1.0, 1.0, 1.0)
    offscreenGl.clear(offscreenGl.COLOR_BUFFER_BIT)

    const pixels = new Uint8Array(4)
    offscreenGl.readPixels(0, 0, 1, 1, offscreenGl.RGBA, offscreenGl.UNSIGNED_BYTE, pixels)

    assert.deepEqual(pixels, new Uint8Array([255, 255, 255, 255]))
  })

  it('should render to 2d context in HTMLCanvasElement', () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const pixels = ctx.getImageData(0, 0, 1, 1).data

    assert.deepEqual(pixels, new Uint8ClampedArray([255, 0, 0, 255]))
  })

  it('should update HTMLMetaElement name attribute', () => {
    const meta = document.createElement('meta')
    assert.strictEqual(meta.name, '')
    meta.name = 'description'
    assert.strictEqual(meta.name, 'description')
    assert.strictEqual(meta.getAttribute('name'), 'description')
  })

  it('should set HTMLCanvasElement height and width attributes', () => {
    const canvas = document.createElement('canvas')

    // default canvas size
    assert.strictEqual(canvas.width, 300)
    assert.strictEqual(canvas.height, 150)

    canvas.setAttribute('width', '123')
    canvas.setAttribute('height', '456')

    assert.strictEqual(canvas.width, 123)
    assert.strictEqual(canvas.height, 456)

    canvas.width = 789
    canvas.height = 321

    assert.strictEqual(canvas.getAttribute('width'), '789')
    assert.strictEqual(canvas.getAttribute('height'), '321')

    // invalid values should result in setting back to default size
    canvas.setAttribute('width', 'asdf50')
    canvas.setAttribute('height', 'jkl10')

    assert.strictEqual(canvas.width, 300)
    assert.strictEqual(canvas.height, 150)

    // negative values should result in using default size
    canvas.setAttribute('width', '-30')
    canvas.setAttribute('height', '-50')

    assert.strictEqual(canvas.width, 300)
    assert.strictEqual(canvas.height, 150)
  })

  it('should set and get HTMLAudioElement attributes', () => {
    const audio = document.createElement('audio')

    assert.strictEqual(null, audio.getAttribute('preload'))
    audio.preload = 'auto'
    assert.strictEqual(audio.preload, audio.getAttribute('preload'))
    audio.setAttribute('preload', 'metadata')
    assert.strictEqual('metadata', audio.getAttribute('preload'))
    audio.setAttribute('preload', 'blah')
    assert.strictEqual('auto', audio.preload)
    audio.setAttribute('preload', 'none')
    assert.strictEqual(audio.getAttribute('preload'), 'none')

    audio.loop = true
    assert.strictEqual(audio.getAttribute('loop'), '')
    audio.loop = false
    assert.strictEqual(audio.getAttribute('loop'), null)

    audio.muted = true
    assert.strictEqual(audio.getAttribute('muted'), '')
    audio.muted = false
    assert.strictEqual(audio.getAttribute('muted'), null)

    assert.strictEqual(audio.src, '')
    audio.setAttribute('src', 'https://example.com/audio.mp3')
    assert.strictEqual(audio.src, 'https://example.com/audio.mp3')
  })

  it('should render to 2d context in OffscreenContext', () => {
    const offscreenCanvas = new window.OffscreenCanvas(300, 150)
    const offscreenCtx = offscreenCanvas.getContext('2d')!

    offscreenCtx.fillStyle = 'blue'
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)

    const pixels = offscreenCtx.getImageData(0, 0, 1, 1).data

    assert.deepEqual(pixels, new Uint8ClampedArray([0, 0, 255, 255]))
  })

  it('should support Image constructor', async () => {
    const img = new window.Image()
    assert.instanceOf(img, window.HTMLImageElement)
    assert.instanceOf(img, window.Image)
    assert.strictEqual(img.width, 0)
    assert.strictEqual(img.naturalWidth, 0)
    assert.strictEqual(img.getAttribute('width'), null)
    assert.strictEqual(img.height, 0)
    assert.strictEqual(img.naturalHeight, 0)
    assert.strictEqual(img.getAttribute('height'), null)

    const img2 = new window.Image(100, 200)
    assert.strictEqual(img2.width, 100)
    assert.strictEqual(img2.getAttribute('width'), '100')
    assert.strictEqual(img2.height, 200)
    assert.strictEqual(img2.getAttribute('height'), '200')

    const img3 = new window.Image()
    img3.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAA' +
      'AABGdBTUEAALGPC/xhBQAAAB5JREFUCNdjaq+f+r+/e8Z/EM307/8fhv///4LwfwDXsxHYR9/5eQA' +
      'AAABJRU5ErkJggg=='

    const loadPromise = new Promise<void>((resolve) => {
      const loadHandler = () => {
        img3.removeEventListener('load', loadHandler)
        resolve()
      }
      img3.addEventListener('load', loadHandler)
    })

    await loadPromise

    assert.strictEqual(img3.width, 3)
    assert.strictEqual(img3.naturalWidth, 3)
    assert.strictEqual(img3.getAttribute('width'), null)
    assert.strictEqual(img3.height, 2)
    assert.strictEqual(img3.naturalHeight, 2)
    assert.strictEqual(img3.getAttribute('height'), null)
    img3.width = 100
    img3.height = 200
    assert.strictEqual(img3.width, 100)
    assert.strictEqual(img3.naturalWidth, 3)
    assert.strictEqual(img3.height, 200)
    assert.strictEqual(img3.naturalHeight, 2)
  })

  it('should handle broken images', async () => {
    const img = new window.Image()
    img.src = 'file://broken.jpg'

    const loadPromise = new Promise<void>((resolve, reject) => {
      const loadHandler = () => {
        img.removeEventListener('load', loadHandler)
        resolve()
      }
      const errorHandler = () => {
        reject(new Error('Image is expected to be broken'))
      }
      img.addEventListener('load', loadHandler)
      img.addEventListener('error', errorHandler)
    })

    await assert.isRejected(loadPromise, 'Image is expected to be broken')
    await assert.isRejected(img.decode(), 'Image \'file://broken.jpg\' is broken')
  })

  it('should handle broken image with decode() first', async () => {
    const img = new window.Image()
    img.src = 'file://broken.jpg'

    await assert.isRejected(img.decode())
  })

  it('should handle broken image URL', async () => {
    const img = new window.Image()
    img.src = 'this-is-not-a-valid-url'

    await assert.isRejected(img.decode(), 'Image \'this-is-not-a-valid-url\' is broken')
  })

  it('should fetch page when location changes', async () => {
    const context = {} as {testDOMContentLoaded?: () => void}

    // Recreate the window, with a parent-context callback at the global scope
    await dom.dispose()
    dom = await createDom({width: 640, height: 480, context})
    window = dom.getCurrentWindow()
    document = window.document

    const windowChanged = new Promise<void>((resolve) => {
      dom.onWindowChange((newWindow) => {
        window = newWindow
        document = window.document
        resolve()
      })
    })

    assert.strictEqual(document.children.length, 1)
    assert.strictEqual(window.location.href, 'about:blank')

    const TEST_URL = `file://${process.env.TEST_SRCDIR}/_main/c8/dom/dom-test.html`

    window.location.href = TEST_URL

    await windowChanged

    const windowLoaded = new Promise<void>((resolve) => {
      window.onload = () => resolve()
    })

    await windowLoaded

    assert.strictEqual(window.location.href, TEST_URL)
    assert.strictEqual(document.children.length, 1)

    const root = document.children[0]
    assert.strictEqual(document.documentElement, root)

    assert.instanceOf(root, window.HTMLHtmlElement)
    assert.strictEqual(root.children.length, 2)
    assert.instanceOf(root.children[0], window.HTMLHeadElement)
    assert.instanceOf(root.children[1], window.HTMLBodyElement)
    assert.strictEqual(root.children[0].children[6].localName, 'script')

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    assert.strictEqual(canvas.width, 100)
    assert.strictEqual(canvas.height, 200)

    const paragraphs = document.querySelectorAll('main > p')

    assert.strictEqual(paragraphs[2].textContent,
      'This paragraph was added using JavaScript.')

    assert.strictEqual(document.title, 'My Sample Page')
  })

  it('should test HTMLScriptElement', () => {
    const script = document.createElement('script')

    assert.isNull(script.getAttribute('async'))
    assert.isNull(script.getAttribute('defer'))
    assert.isTrue(script.async)
    assert.isFalse(script.defer)

    script.src = 'https://example.com/script.js'
    script.async = false
    script.defer = true

    assert.strictEqual(script.src, 'https://example.com/script.js')
    assert.isFalse(script.async)
    assert.isTrue(script.defer)
    assert.isNull(script.getAttribute('async'))
    assert.strictEqual(script.getAttribute('defer'), '')

    script.crossOrigin = 'anonymous'
    script.integrity = 'sha256-abc123'
    script.noModule = true
    script.referrerPolicy = 'origin-when-cross-origin'

    assert.strictEqual(script.crossOrigin, 'anonymous')
    assert.strictEqual(script.integrity, 'sha256-abc123')
    assert.isTrue(script.noModule)
    assert.strictEqual(script.referrerPolicy, 'origin-when-cross-origin')

    // Test text property and compare to textContent.
    script.text = 'console.log("Hello, world!")'
    assert.strictEqual(script.textContent, 'console.log("Hello, world!")')
    assert.strictEqual(script.text, 'console.log("Hello, world!")')
  })

  it('should execute event handler based on IDL attribute', () => {
    const button = document.createElement('button')
    const windowAny = window as any
    windowAny.clicked = false
    windowAny.clickTarget = null
    button.onclick = function onclick() {
      windowAny.clicked = true
      windowAny.clickTarget = this
    }
    button.dispatchEvent(new window.MouseEvent('click'))
    assert.isTrue(windowAny.clicked)
    assert.strictEqual(windowAny.clickTarget, button)
  })

  it('should execute event handler based on content attribute', () => {
    const button = document.createElement('button')
    const windowAny = window as any
    windowAny.clicked = false
    windowAny.clickTarget = null
    button.setAttribute('onclick', 'window.clicked = true; window.clickTarget = this')
    button.dispatchEvent(new window.MouseEvent('click'))
    assert.isTrue(windowAny.clicked)
    assert.strictEqual(windowAny.clickTarget, button)
  })

  it('should execute Window handlers on HTMLBodyElement attributes', () => {
    const body = document.body!
    const windowAny = window as any
    windowAny.loadTarget = null
    body.onload = function onload() {
      windowAny.loadTarget = this
    }
    window.dispatchEvent(new window.Event('load'))
    assert.strictEqual(windowAny.loadTarget, window)
  })

  it('should execute event handlers in the correct order, spec example 1', () => {
    // This is an example from the HTML spec.
    // See: https://html.spec.whatwg.org/#activate-an-event-handler
    const button = document.createElement('test')
    const windowAny = window as any
    windowAny.result = ''

    button.addEventListener('click', () => { windowAny.result += 'ONE' }, false)
    button.setAttribute('onclick', 'result += \'-NOT_CALLED\'')  // listener is registered here
    button.addEventListener('click', () => { windowAny.result += '-THREE' }, false)
    button.onclick = function onclick() { windowAny.result += '-TWO' }
    button.addEventListener('click', () => { windowAny.result += '-FOUR' }, false)

    button.dispatchEvent(new window.MouseEvent('click'))
    assert.strictEqual(windowAny.result, 'ONE-TWO-THREE-FOUR')
  })

  it('should execute event handlers in the correct order, spec example 2', () => {
    // This is an example from the HTML spec.
    // See: https://html.spec.whatwg.org/#activate-an-event-handler
    const button = document.createElement('test')
    const windowAny = window as any
    windowAny.result = ''

    button.addEventListener('click', () => { windowAny.result += 'ONE' }, false)
    button.setAttribute('onclick', 'result += \'-NOT_CALLED\'')  // handler is activated here
    button.addEventListener('click', () => { windowAny.result += '-TWO' }, false)
    button.onclick = null  // but deactivated here
    button.addEventListener('click', () => { windowAny.result += '-THREE' }, false)
    button.onclick = function onclick() { windowAny.result += '-FOUR' }  // and re-activated here
    button.addEventListener('click', () => { windowAny.result += '-FIVE' }, false)

    button.dispatchEvent(new window.MouseEvent('click'))
    assert.strictEqual(windowAny.result, 'ONE-TWO-THREE-FOUR-FIVE')
  })

  it('should not bubble events by default', () => {
    const button = document.createElement('button')
    document.body!.appendChild(button)

    const seenEvents: string[] = []

    window.addEventListener('click', () => { seenEvents.push('window') })
    document.addEventListener('click', () => { seenEvents.push('document') })
    button.addEventListener('click', () => { seenEvents.push('button') })

    button.dispatchEvent(new window.MouseEvent('click'))

    assert.deepEqual(seenEvents, ['button'])
  })

  it('should bubble events from the child to the window', () => {
    const button = document.createElement('button')
    document.body!.appendChild(button)

    const seenEvents: string[] = []

    window.addEventListener('click', () => { seenEvents.push('window') })
    document.addEventListener('click', () => { seenEvents.push('document') })
    button.addEventListener('click', () => { seenEvents.push('button') })

    button.dispatchEvent(new window.MouseEvent('click', {bubbles: true}))

    assert.deepEqual(seenEvents, ['button', 'document', 'window'])

    // Clear the seen events and try again with click() which should dispatch and bubble an event.
    seenEvents.length = 0

    button.click()

    assert.deepEqual(seenEvents, ['button', 'document', 'window'])
  })

  it('should not bubble events out of an unattached child', () => {
    const button = document.createElement('button')

    const seenEvents: string[] = []

    window.addEventListener('click', () => { seenEvents.push('window') })
    document.addEventListener('click', () => { seenEvents.push('document') })
    button.addEventListener('click', () => { seenEvents.push('button') })

    button.dispatchEvent(new window.MouseEvent('click', {bubbles: true}))

    assert.deepEqual(seenEvents, ['button'])
  })

  it('should have named property access for HTMLElements on the Window', () => {
    const windowAny = window as any
    const div = document.createElement('div')
    div.id = 'foo'
    assert.isUndefined(windowAny.foo)

    document.body!.appendChild(div)
    assert.strictEqual(windowAny.foo, div)

    div.id = 'bar'
    assert.isUndefined(windowAny.foo)
    assert.strictEqual(windowAny.bar, div)

    // Shadow the named property.
    windowAny.bar = 'hi there'
    assert.strictEqual(windowAny.bar, 'hi there')

    // Unshadow the named property.
    delete windowAny.bar
    assert.strictEqual(windowAny.bar, div)

    // Test that the global property is re-attached when the id changes.
    div.id = 'baz'
    assert.strictEqual(windowAny.baz, div)

    // Name shouldn't work for 'div'.
    div.setAttribute('name', 'cool')
    assert.isUndefined(windowAny.cool)

    // Name should work for 'form'
    const form = document.createElement('form')
    form.setAttribute('name', 'cool')
    document.body!.appendChild(form)
    assert.strictEqual(windowAny.cool, form)

    // If two elements have the same id, we return an HTMLCollection.
    form.id = 'baz'
    assert.instanceOf(windowAny.baz, window.HTMLCollection)
    assert.deepEqual(Array.from(windowAny.baz), [div, form])
  })
})
