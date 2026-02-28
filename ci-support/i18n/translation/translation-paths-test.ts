import {chai} from 'bzl/js/chai-js'

import {outputPathForInputPath} from './translation-paths'
import {clearTranslationConfig, setTranslationConfig} from './translation-config'
import {Language} from './translation-engine'

const {describe, it} = globalThis as any
const {expect} = chai

describe('output-path-for-input-path', () => {
  it('should throw if unconfigured', () => {
    clearTranslationConfig()
    expect(() => outputPathForInputPath('ci-support/i18n/test/json/en-US/common.json', Language.JA))
      .to.throw()
  })
  it('should should handle parallel', () => {
    setTranslationConfig({
      baseDirectoryOutput: 'ci-support/i18n/test/json',
      baseDirectorySource: 'ci-support/i18n/test/json/en-US',
      localeDirectorySpecifier: '{language}-{country}'
    })
    expect(outputPathForInputPath('ci-support/i18n/test/json/en-US/common.json', Language.JA))
      .to.equal('ci-support/i18n/test/json/ja-JP/common.json')
  })
  it('should handle parallel trailing slashes', () => {
    setTranslationConfig({
      baseDirectoryOutput: 'ci-support/i18n/test/json/',
      baseDirectorySource: 'ci-support/i18n/test/json/en-US/',
      localeDirectorySpecifier: '{language}-{country}'
    })
    expect(outputPathForInputPath('ci-support/i18n/test/json/en-US/common.json', Language.JA))
      .to.equal('ci-support/i18n/test/json/ja-JP/common.json')
  })
  it('should handle staggered and nested', () => {
    setTranslationConfig({
      baseDirectoryOutput: 'ci-support/i18n/test/md/i18n/',
      baseDirectorySource: 'ci-support/i18n/test/md/docs',
      localeDirectorySpecifier: '{language}/docusaurus-plugin-content-docs/current'
    })
    expect(outputPathForInputPath('ci-support/i18n/test/md/docs/general/whatsnew.md', Language.JA))
      .to.equal(
        'ci-support/i18n/test/md/i18n/ja/docusaurus-plugin-content-docs/current/general/whatsnew.md'
      )
  })
  it('should throw if mismatched', () => {
    setTranslationConfig({
      baseDirectoryOutput: 'ci-support/i18n/test/json/',
      baseDirectorySource: 'ci-support/i18n/test/json/en-US/',
      localeDirectorySpecifier: '{language}-{country}'
    })
    expect(() => outputPathForInputPath(
      'ci-support/i18n/test/md/docs/general/whatsnew.md',
      Language.JA
    )).to.throw()
  })
})
