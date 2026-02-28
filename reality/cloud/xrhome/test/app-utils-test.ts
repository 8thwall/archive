import chai from 'chai'

import {isOkAppName, sortFeaturedApps, isValidAppTagString} from '../src/shared/app-utils'
import {MAX_APP_TAG_LENGTH} from '../src/shared/app-constants'
import {AccountPathEnum} from '../src/client/common/paths'

chai.should()
const {assert} = chai

describe('App Name Validation Test', () => {
  const reservedNames = ['xrweb', 'xrweb.js', 'xrwebverify', 'v', 'token', 'verify']
  const okNames = ['reg-app-name', 'reg-app-name', 'john-titor-was-here', 'in2001',
    'fn20-f3-39afo2-a-sdf--rj', 'l--l', 'apperino', 'xxx-ultimate-app-xxx', '19crimes']
  const LONG_NAME = 'the-supercalifragilisticexpialidocious-' +
    'honorificabilitudinitatibus-app-name-that-might-cause-' +
    'pneumonoultramicroscopicsilicovolcanoconiosis'
  const invalidChars = ['`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
    '=', '+', '[', ']', '{', '}', '\\', '|', '"', '\'', ',', '.', '/', '?', '_',
    '\n', '\r', '\t', '\b', '\f', '\v', '\0', '\xFF']

  it('should not allow empty names', () => {
    assert.isFalse(isOkAppName())
    assert.isFalse(isOkAppName(''))
    assert.isFalse(isOkAppName(null))
    assert.isFalse(isOkAppName(undefined))
  })
  it('should not allow names < 4 chars or > 128 chars', () => {
    assert.isFalse(isOkAppName('bab'))
    assert.isFalse(isOkAppName(LONG_NAME))
  })
  it('should not allow uppercase letters', () => {
    assert.isFalse(isOkAppName('ByeByeCamelCase'))
  })
  it('should not allow blacklisted names', () => {
    reservedNames.map(name => assert.isFalse(isOkAppName(name)))
  })
  it('should not allow special chars', () => {
    invalidChars.map(char => assert.isFalse(isOkAppName(char.repeat(4))))
  })
  it('should not allow names to begin with hyphens or underscores \'-\'', () => {
    assert.isFalse(isOkAppName('_133t-4pp'))
    assert.isFalse(isOkAppName('-l33t-4pp'))
  })
  it('should not allow non-string', () => {
    assert.isFalse(isOkAppName([]))
    assert.isFalse(isOkAppName({}))
    assert.isFalse(isOkAppName(['insideofalist']))
    assert.isFalse(isOkAppName({'fancy-key': 'simple-value'}))
  })
  it('should not allow names that collide with account-level paths', () => {
    Object.values(AccountPathEnum).forEach((path) => {
      assert.isFalse(isOkAppName(path), `${path} should be rejected.`)
    })
  })
  it('should allow regular app names', () => {
    okNames.map(name => assert.isTrue(isOkAppName(name)))
  })
})

describe('sortFeaturedApps', () => {
  it('Sorts apps by publishedAt', () => {
    const app1 = {name: 'app1', publishedAt: new Date(3)}
    const app2 = {name: 'app2', publishedAt: new Date(2)}
    const app3 = {name: 'app3', publishedAt: new Date(1)}

    assert.deepStrictEqual(sortFeaturedApps([app3, app1, app2]), [app1, app2, app3])
  })

  it('Sorts by updatedAt if publishedAt is not present', () => {
    const app1 = {name: 'app1', updatedAt: new Date(3)}
    const app2 = {name: 'app2', updatedAt: new Date(2)}
    const app3 = {name: 'app3', updatedAt: new Date(1)}

    assert.deepStrictEqual(sortFeaturedApps([app3, app1, app2]), [app1, app2, app3])
  })

  it('Places apps with publishedAt present before apps that only have updatedAt', () => {
    const app1 = {name: 'app1', publishedAt: new Date(2)}
    const app2 = {name: 'app1', publishedAt: new Date(1)}
    const app3 = {name: 'app2', updatedAt: new Date(4)}
    const app4 = {name: 'app3', updatedAt: new Date(2)}

    assert.deepStrictEqual(sortFeaturedApps([app3, app1, app4, app2]), [app1, app2, app3, app4])
  })
})

describe('isValidAppTagString', () => {
  it('Should not allow empty string', () => {
    assert.isFalse(isValidAppTagString(''))
  })

  it('Should not allow all-space string', () => {
    assert.isFalse(isValidAppTagString('   '))
  })

  it('Should not allow leading space', () => {
    assert.isFalse(isValidAppTagString(' test'))
  })

  it('Should not allow trailing space', () => {
    assert.isFalse(isValidAppTagString('test '))
  })

  it('Should not allow string longer than MAX_APP_TAG_LENGTH', () => {
    const randomString1 = ''.padStart(MAX_APP_TAG_LENGTH, 'a')
    const randomString2 = `${randomString1}a`  // 1 char longer
    assert.isTrue(isValidAppTagString(randomString1))
    assert.isFalse(isValidAppTagString(randomString2))
  })

  it('Should be extended ASCII', () => {
    assert.isTrue(isValidAppTagString('µ'))
    assert.isFalse(isValidAppTagString('π'))
  })

  it('Should be all lowercases', () => {
    assert.isTrue(isValidAppTagString('test'))
    assert.isFalse(isValidAppTagString('Test'))
  })

  it('Should not be negative word', () => {
    assert.isTrue(isValidAppTagString('test'))
    assert.isFalse(isValidAppTagString('addict'))
  })
})
