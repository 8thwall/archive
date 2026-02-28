import {assert} from 'chai'

import {getMonogram} from '../src/shared/profile/user-monogram'

describe('User Monogram Test', () => {
  describe('When the string starts with an uppercase letter', () => {
    it('should return the first letter', () => {
      assert.equal(getMonogram('Alvin'), 'A')
      assert.equal(getMonogram('Alvin Portillo'), 'A')
      assert.equal(getMonogram('Portillo Alvin'), 'P')
    })
  })

  describe('When the string starts with a lowercase letter', () => {
    it('should return the first letter in uppercase', () => {
      assert.equal(getMonogram('mickey mouse'), 'M')
      assert.equal(getMonogram('donald duck'), 'D')
    })
  })

  describe('When an emoji is at the beginning of the string', () => {
    it('should return null', () => {
      assert.isNull(getMonogram('🏝️'))
    })
  })

  describe('When an empty string is given', () => {
    it('should return null', () => {
      assert.isNull(getMonogram(''))
    })
  })

  describe('When a null string is given', () => {
    it('should return null', () => {
      assert.isNull(getMonogram(null))
    })
  })
})
