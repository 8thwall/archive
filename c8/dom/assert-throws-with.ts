// @attr(testonly = 1)

import {assert} from '@nia/bzl/js/chai-js'

const assertThrowsWith = (
  fn: () => void,
  expectedInstance: Function | null,
  expectedMessage?: string,
  message?: string
) => {
  try {
    fn()
    assert.fail('Function succeeded', 'Expected an error to be thrown', message)
  } catch (error) {
    if (expectedInstance) {
      assert.instanceOf(error, expectedInstance, message)
    }
    if (expectedInstance) {
      assert.strictEqual(error.message, expectedMessage, message)
    }
  }
}

export {
  assertThrowsWith,
}
