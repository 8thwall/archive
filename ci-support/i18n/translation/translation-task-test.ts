import {chai, chaiAsPromised} from 'bzl/js/chai-js'

import {setTranslationConfig} from './translation-config'
import {Language} from './translation-engine'
import {mockTranslationEngine} from './translation-engine-mock'
import { runTranslationTask } from './translation-task'

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

describe('translate-json', () => {
  it('should translate test values', () => {
    setTranslationConfig({
      baseDirectoryOutput: 'ci-support/i18n/test/json',
      baseDirectorySource: 'ci-support/i18n/test/json/en-US',
      contentType: 'json',
      localeDirectorySpecifier: '{language}-{country}',
      translationEngine: mockTranslationEngine(),
    })
    expect(runTranslationTask({
      path: 'ci-support/i18n/test/json/en-US/common.json',
      content: TEST_VALUES,
      language: Language.JA,
    })).to.eventually.deep.equal({
      path: 'ci-support/i18n/test/json/ja-JP/common.json',
      content: TRANSLATED_TEST_VALUES,
    })
  })
})
