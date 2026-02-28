/* eslint-disable local-rules/prefer-await */
import chai from 'chai'

import {resolveAll} from '../src/shared/async'

const {assert} = chai

const wait = (amount: number) => new Promise(resolve => setTimeout(resolve, amount * 10))

describe('resolveAll', () => {
  it('should resolve in the correct order', async () => {
    const res = await resolveAll([
      wait(3).then(() => 'a'),
      wait(1).then(() => 'b'),
      wait(2).then(() => 'c'),
    ])
    assert.deepEqual(res, ['a', 'b', 'c'])
  })
  it('should return the first error after all promises resolve', async () => {
    let finished = false
    try {
      await resolveAll([
        wait(2).then(() => { throw new Error('fail 1') }),
        wait(1).then(() => { throw new Error('fail 2') }),
        wait(3).then(() => { finished = true }),
      ])
      assert.fail('Expected error was not thrown')
    } catch (e) {
      assert.isTrue(finished)
      assert.include((e as Error).message, 'fail 1')
    }
  })
})
