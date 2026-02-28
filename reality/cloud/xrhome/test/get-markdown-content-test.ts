import {describe} from 'mocha'
import {assert} from 'chai'

import {getMarkdownContent} from '../src/client/editor/get-markdown-content'

const FILE_DATA = {
  'assets/my/file.png': {content: '/assets/file-hash.png'},
  'assets/my/bundle.png': {
    content: JSON.stringify({
      type: 'bundle',
      path: '/assets/bundles/bundle-xyz/',
      main: 'file.png',
    }),
  },
}

describe('getMarkdownContent', () => {
  it('Replaces local images with static path', () => {
    const before = '![Alt Text](assets/my/file.png)'
    const after = '![Alt Text](https://static.8thwall.app/assets/file-hash.png)'
    assert.equal(getMarkdownContent(FILE_DATA, before), after)
  })

  it('Replaces local images with static path for bundle', () => {
    const before = '![Alt Text](assets/my/bundle.png)'
    const after = '![Alt Text](https://static.8thwall.app/assets/bundles/bundle-xyz/file.png)'
    assert.equal(getMarkdownContent(FILE_DATA, before), after)
  })

  it('Leaves empty URL if file is not found', () => {
    const before = '![Alt Text](assets/notreal/file.png)'
    const after = '![Alt Text]()'
    assert.equal(getMarkdownContent(FILE_DATA, before), after)
  })

  it('Leaves normal URLs alone', () => {
    const markdown = '![Alt Text](https://test.com/assets/file.png)'
    assert.equal(getMarkdownContent(FILE_DATA, markdown), markdown)
  })

  it('Leaves links alone', () => {
    const markdown = '[My link text](assets/my-link.png)'
    assert.equal(getMarkdownContent(FILE_DATA, markdown), markdown)
  })
})
