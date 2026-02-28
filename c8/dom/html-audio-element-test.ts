// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(tags = ["manual"])
// @attr(esnext = 1)

// @attr[](data = "//c8/dom/audio:audio-element-test-htmls")
// @attr[](data = "//c8/dom/audio:audio-test-files")
// @attr[](data = "//c8/dom/audio:test-utils.js")

import {describe, it, assert, afterEach} from '@nia/bzl/js/chai-js'

import {
  createDom,
  Dom,
  type Window,
} from '@nia/c8/dom/dom'

import type {HTMLAudioElement} from '@nia/c8/dom/html-audio-element'
import {AudioContext} from '@nia/c8/dom/audio/audio-context'

describe('Audio Element test', () => {
  let dom: Dom
  let window: Window

  const testFiles = {
    'audio-element-test.html': 'play a 2s tone via html audio element',
    'audio-element-test-decode-play-mp3.html': 'decode and play an mp3',
    'audio-element-test-decode-play-wav.html': 'decode and play a wav',
    'audio-element-test-decode-two-mp3s.html': 'decode two mp3s at the same time (studio flow)',
    'audio-element-test-load-play.html': 'call load() after setting src',
    'audio-element-test-loop.html': 'tests ended event by playing a sound repeatedly',
    'audio-element-test-loud-sounds.html': 'play loud sounds',
    'audio-element-test-overlapping-sounds.html': 'play overlapping sounds',
    'audio-element-test-play-same-elem-twice.html': 'play a sound before previous play finishes',
    'audio-element-test-set-src-twice.html': 'change src after first src starts to load',
    'audio-element-test-two-plays.html': 'play two audio elements at the same time',
  }

  afterEach(async () => {
    await dom.dispose()
  })

  // Each of the tests in testFiles plays different sounds for a maximum of 3s. Each test is
  // allowed to run for 4s to account for loading times etc.
  for (const [file, description] of Object.entries(testFiles)) {
    it(description, async () => {  // eslint-disable-line no-loop-func
      const TEST_URL = `file://${process.env.TEST_SRCDIR}/_main/c8/dom/audio/${file}`
      dom = await createDom({width: 640, height: 480, url: TEST_URL})
      window = dom.getCurrentWindow()
      dom.onWindowChange((newWindow) => {
        window = newWindow
      })
      globalThis.Worker = window.Worker
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 3000)
      })
    }).timeout(4000)
  }

  // This test is meant to throw an error. The test file is an invalid audio file.
  it('play an invalid file', async () => {
    try {
      const fileName = 'audio-element-test-invalid-audio-file.html'
      const TEST_URL = `file://${process.env.TEST_SRCDIR}/_main/c8/dom/${fileName}`
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errorDom = new Dom({width: 640, height: 480, url: TEST_URL})
      assert.fail('Expected error')
    } catch (error) {
      assert.isOk(error, 'Error is thrown')
    }
  }).timeout(4000)

  // TODO(divya): move this test to a separate file and don't mark it as manual
  it('audio context attach a source node to each source HTMLAudioElement', async () => {
    dom = await createDom({width: 640, height: 480})
    window = dom.getCurrentWindow()
    dom.onWindowChange((newWindow) => {
      window = newWindow
    })
    globalThis.Worker = window.Worker

    const audio = window.document.createElement('audio') as HTMLAudioElement
    const context = new AudioContext()
    const source = context.createMediaElementSource(audio)
    assert.equal(audio._audioSourceNode, source)
    assert.isOk(source)
  })
})
