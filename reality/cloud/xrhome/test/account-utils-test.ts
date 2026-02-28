import chai from 'chai'

import {
  fixAccountUrl as fixAccountUrlRaw,
  stripAccountUrl as stripAccountUrlRaw,
  isLightshipAccount,
  isSpecialFeatureEnabled,
  validateAppType,
} from '../src/shared/account-utils'
import type {SpecialFeatureFlag} from '../src/shared/special-features'

chai.should()
const {assert} = chai

const fixAccountUrl = url => fixAccountUrlRaw(url, URL)
const stripAccountUrl = url => stripAccountUrlRaw(url, URL)

describe('fixAccountUrl', () => {
  it('Accepts valid URLs', () => {
    assert.equal(fixAccountUrl('https://8thwall.com'), 'https://8thwall.com')
    assert.equal(fixAccountUrl('https://8thwall.com/path?q=1'), 'https://8thwall.com/path?q=1')
    assert.equal(fixAccountUrl('http://8thwall.com'), 'http://8thwall.com')
    assert.equal(fixAccountUrl('//8thwall.com'), 'https://8thwall.com')
    assert.equal(fixAccountUrl('http://test'), 'http://test')
    assert.equal(fixAccountUrl('mailto:contact@8thwall.com'), 'mailto:contact@8thwall.com')
  })

  it('Adds mailto: to email addresses', () => {
    assert.equal(fixAccountUrl('contact@8thwall.com'), 'mailto:contact@8thwall.com')
  })

  it('Adds https if missing a protocol', () => {
    assert.equal(fixAccountUrl('8thwall.com'), 'https://8thwall.com')
  })

  it('Disallows other protocols', () => {
    assert.equal(fixAccountUrl('ftp://8thwall.com'), null)
    assert.equal(fixAccountUrl('file:///8thwall/8thwall.png'), null)
  })

  it('Returns null for missing URLs', () => {
    assert.equal(fixAccountUrl(undefined), null)
    assert.equal(fixAccountUrl(null), null)
    assert.equal(fixAccountUrl(''), null)
  })
})

describe('stripAccountUrl', () => {
  it('Only displays the domain of an HTTP URL', () => {
    assert.equal(stripAccountUrl('https://8thwall.com'), '8thwall.com')
    assert.equal(stripAccountUrl('https://8thwall.com/'), '8thwall.com')
    assert.equal(stripAccountUrl('https://8thwall.com/path'), '8thwall.com')
    assert.equal(stripAccountUrl('https://8thwall.com/path?q=1'), '8thwall.com')
    assert.equal(stripAccountUrl('https://8thwall.com/#hash'), '8thwall.com')
    assert.equal(stripAccountUrl('https://8thwall.com:3000'), '8thwall.com')
  })

  it('Removes the leading www of an HTTP URL', () => {
    assert.equal(stripAccountUrl('https://www.8thwall.com/path'), '8thwall.com')
  })

  it('Displays just the email address for mailto: addresses', () => {
    assert.equal(stripAccountUrl('mailto:contact@8thwall.com'), 'contact@8thwall.com')
  })

  it('Leaves invalid text as-is', () => {
    assert.equal(stripAccountUrl('this-is-not-valid'), 'this-is-not-valid')
  })
})

describe('isLightshipAccount', () => {
  it('Returns true for a lightship account', () => {
    assert.isTrue(isLightshipAccount({accountType: 'Lightship'}))
  })
  it('Returns false for a non-lightship account', () => {
    assert.isFalse(isLightshipAccount({accountType: 'NotLightship'}))
  })
  it('Returns false for falsy inputs', () => {
    assert.isFalse(isLightshipAccount(false))
    assert.isFalse(isLightshipAccount(null))
    assert.isFalse(isLightshipAccount(undefined))
  })
})

describe('isSpecialFeatureEnabled', () => {
  it('Returns true when a specialFeature is present', () => {
    assert.isTrue(isSpecialFeatureEnabled({specialFeatures: ['testFeature']}, 'testFeature'))
  })
  it('Returns false when a specialFeature is not present', () => {
    assert.isFalse(isSpecialFeatureEnabled(
      {specialFeatures: ['testFeature']},
      'notPresentFeature'
    ))
  })
  it('Returns false for null, empty features, undefined account', () => {
    assert.isFalse(isSpecialFeatureEnabled({specialFeatures: []}, 'notPresentFeature'))
    assert.isFalse(isSpecialFeatureEnabled({specialFeatures: undefined}, 'notPresentFeature'))
    assert.isFalse(isSpecialFeatureEnabled({specialFeatures: null}, 'notPresentFeature'))
    assert.isFalse(isSpecialFeatureEnabled(undefined, 'notPresentFeature'))
  })
})

describe('validateAppType', () => {
  const basicAccount = {
    accountType: 'WebDeveloper',
    adEnabled: false,
    webOrigin: false,
    createdAt: new Date(),
    specialFeatures: [],
  }
  const enterpriseAccount = {
    accountType: 'WebEnterprise',
    adEnabled: false,
    webOrigin: false,
    createdAt: new Date(),
    specialFeatures: [],
  }
  const cloudStudioBetaAccount = {
    accountType: 'WebEnterprise',
    adEnabled: false,
    webOrigin: false,
    createdAt: new Date(),
    specialFeatures: ['cloudStudioBeta'] as SpecialFeatureFlag[],
  }
  const selfHostedAccount = {
    accountType: 'WebDeveloper',
    adEnabled: false,
    webOrigin: true,
    createdAt: new Date('2020-05-18T11:00:00.000-07:00'),
    specialFeatures: [],
  }
  const adAccount = {
    accountType: 'WebEnterprise',
    adEnabled: true,
    webOrigin: false,
    createdAt: new Date(),
    specialFeatures: [],
  }

  it('Returns empty string for valid hosting types', () => {
    assert.equal(validateAppType(basicAccount, 'CLOUD_STUDIO'), '')
    assert.equal(validateAppType(enterpriseAccount, 'CLOUD_STUDIO'), '')
    assert.equal(validateAppType(enterpriseAccount, 'CLOUD_EDITOR'), '')
    assert.equal(validateAppType(selfHostedAccount, 'SELF'), '')
    assert.equal(validateAppType(cloudStudioBetaAccount, 'CLOUD_STUDIO'), '')
    assert.equal(validateAppType(basicAccount, 'CLOUD_EDITOR'), '')
  })

  it('Returns error message for insufficient permission', () => {
    assert.equal(
      validateAppType(adAccount, 'AD'),
      'Insufficient permissions for type: AD'
    )
    assert.equal(
      validateAppType(enterpriseAccount, 'AD'),
      'Insufficient permissions for type: AD'
    )
  })

  it('Returns error message for invalid hosting types', () => {
    assert.equal(
      validateAppType(enterpriseAccount, 'UNSET'),
      'Incorrect hosting type: UNSET'
    )
    assert.equal(
      validateAppType(enterpriseAccount, 'INVALID_TYPE'),
      'Incorrect hosting type: INVALID_TYPE'
    )
  })

  it('Returns error message for falsy hosting type input', () => {
    assert.equal(validateAppType(basicAccount, ''), 'Incorrect hosting type: ')
    assert.equal(validateAppType(basicAccount, null), 'Incorrect hosting type: null')
    assert.equal(validateAppType(basicAccount, undefined), 'Incorrect hosting type: undefined')
  })
})
