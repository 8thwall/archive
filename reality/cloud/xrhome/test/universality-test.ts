import {assert} from 'chai'

import {makeCognitoStorage} from '../src/client/user/cognito-storage'

describe('CognitoStorage', () => {
  describe('Constructor', () => {
    it('Should not throw error when window is undefined', () => {
      assert.doesNotThrow(makeCognitoStorage, 'makeCognitoStorage should not throw')
    })
  })
})
