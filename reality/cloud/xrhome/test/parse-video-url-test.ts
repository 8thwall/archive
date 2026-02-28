import {assert} from 'chai'

import {parseVideo} from '../src/shared/markdown-videos/parse-video-url'

describe('parseVideo', () => {
  describe('Youtube', () => {
    const expect = {type: 'youtube', id: 'XXXXXXXXXXX'}
    it('work with long link', () => {
      assert.deepEqual(parseVideo('http://www.youtube.com/watch?v=XXXXXXXXXXX'), expect)
    })

    it('work with short link', () => {
      assert.deepEqual(parseVideo('http://youtu.be/XXXXXXXXXXX'), expect)
    })

    it('work with google api link', () => {
      assert.deepEqual(parseVideo('https://youtube.googleapis.com/v/XXXXXXXXXXX'), expect)
    })
  })

  describe('Vimeo', () => {
    const expect = {type: 'vimeo', id: 'testVimeoId'}
    it('work with straight video link', () => {
      assert.deepEqual(parseVideo('http://vimeo.com/testVimeoId'), expect)
    })

    it('work with player video link', () => {
      assert.deepEqual(parseVideo('http://player.vimeo.com/testVimeoId'), expect)
    })

    it('work with relative video link', () => {
      assert.deepEqual(parseVideo('//player.vimeo.com/testVimeoId'), expect)
    })
  })
})
