import {chai, chaiAsPromised} from 'bzl/js/chai-js'

import {translateString} from './translate-string'
import {clearTranslationConfig, setTranslationConfig} from './translation-config'
import {Language} from './translation-engine'
import {mockTranslationEngine} from './translation-engine-mock'

const {describe, it} = globalThis as any
const {expect} = chai

chai.use(chaiAsPromised)

describe('unregistered', () => {
  it('should throw', () => {
    clearTranslationConfig()
    expect(() => translateString('hi', Language.JA)).to.throw()
  })
})

describe('mock', () => {
  it('should modify', () => {
    setTranslationConfig({
      translationEngine: mockTranslationEngine(),
    })
    expect(translateString('hi', Language.JA)).to.eventually.equal('ja hi')
  })
})
