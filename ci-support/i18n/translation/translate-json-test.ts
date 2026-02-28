import {chai, chaiAsPromised} from 'bzl/js/chai-js'

import {translateJson} from './translate-json'
import {setTranslationConfig} from './translation-config'
import {Language} from './translation-engine'
import {mockTranslationEngine} from './translation-engine-mock'

const {describe, it} = globalThis as any
const {expect} = chai

chai.use(chaiAsPromised)

const TEST_VALUES = `{
  "step.create_account": "Create account",
  "step.setup_payment": "Setup payment",
  "join_page.heading": "Welcome to 8th Wall"
}`

const TRANSLATED_TEST_VALUES = `{
  "step.create_account": "ja Create account",
  "step.setup_payment": "ja Setup payment",
  "join_page.heading": "ja Welcome to 8th Wall"
}`

const EMPTY_VALUES = `{
}`

const TRANSLATED_EMPTY_VALUES = '{}'

describe('translate-json', () => {
  it('should translate test values', () => {
    setTranslationConfig({
      translationEngine: mockTranslationEngine(),
    })
    expect(translateJson(TEST_VALUES, Language.JA)).to.eventually.equal(TRANSLATED_TEST_VALUES)
  })

  it('should translate empty values', () => {
    setTranslationConfig({
      translationEngine: mockTranslationEngine(),
    })
    expect(translateJson(EMPTY_VALUES, Language.JA)).to.eventually.equal(TRANSLATED_EMPTY_VALUES)
  })
})
