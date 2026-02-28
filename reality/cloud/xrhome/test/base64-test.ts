import {assert} from 'chai'

import {encode, decode} from '../src/shared/base64'

describe('Base64 Package Test', () => {
  it('should be able to encode empty object', () => {
    assert.isOk(encode({}))
  })

  it('should be able to encode decode utf8 string', () => {
    const s = '"Lorem 😂😃✌️🤔 ipsum"'
    assert.equal(decode(encode({s})).s, s)
  })

  it('should be able to encode decode string with script tag', () => {
    const s = '<script>console.log("Hello World")</script>'
    assert.equal(decode(encode({s})).s, s)
  })
})
