import {chai, chaiAsPromised} from 'bzl/js/chai-js'

import {translateMd} from './translate-md'
import {setTranslationConfig} from './translation-config'
import {Language} from './translation-engine'
import {mockTranslationEngine} from './translation-engine-mock'

const {describe, it} = globalThis as any
const {expect} = chai

chai.use(chaiAsPromised)

const TEST_MARKDOWN = `### Markdown content.

This is
some markdown.

With a list:
- 1
- 2
- 3
- 4
`

const TRANSLATED_NO_CHUNKING = `ja ### Markdown content.

This is
some markdown.

With a list:
- 1
- 2
- 3
- 4
`

describe('translate-markdown', () => {
  it('should translate no chunking', () => {
    setTranslationConfig({
      translationEngine: mockTranslationEngine(),
    })
    expect(translateMd(TEST_MARKDOWN, Language.JA)).to.eventually.equal(TRANSLATED_NO_CHUNKING)
  })
})
