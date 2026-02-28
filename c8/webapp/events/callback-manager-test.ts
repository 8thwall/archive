// Copyright (c) 2023 Niantic, Inc.
// Original Author: Akul Gupta (akulgupta@nianticlabs.com)
import {chai} from 'bzl/js/chai-js'

import {CallbackManager} from './callback-manager'

const {describe, it} = globalThis as any

const {expect, assert} = chai

describe('Single Callback', () => {
  const manager = CallbackManager()
  it('does not have unregistered key', () => {
    assert.strictEqual(manager.hasKey(1), false)
  })

  it('does not have unregistered callbacks', () => {
    assert.strictEqual(manager.getCallbacks(1).length, 0)
  })

  let cbHandle = -1
  it('call callback', () => {
    let value = 0
    cbHandle = manager.register(1, (num: number, num1: number) => { value = num + num1 })
    assert.strictEqual(value, 0)
    manager.runCallbacks(1, 3, 4)
    assert.strictEqual(value, 3 + 4)
  })

  it('unregister callback', () => {
    const success = manager.unregister(cbHandle)
    assert.strictEqual(success, true)
  })

  it('remove invalid callback', () => {
    const fakeCbHandle = 123
    const success = manager.unregister(fakeCbHandle)
    assert.strictEqual(success, false)
  })
})

describe('Multiple Callbacks For Same Key', () => {
  const manager = CallbackManager()

  const cbHandles: Array<number> = []
  const arr: Array<number> = []
  it('register callback', () => {
    for (let i = 0; i < 5; i++) {
      cbHandles.push(manager.register(1, (num) => { arr.push(num) }))
    }
  })

  it('call callback', () => {
    manager.runCallbacks(1, 0)
    expect(arr).to.be.eql([0, 0, 0, 0, 0])
  })

  it('unregister some callback', () => {
    assert.strictEqual(manager.unregister(cbHandles.pop()), true)
    assert.strictEqual(manager.unregister(cbHandles.pop()), true)
  })

  // Since we removed 2 callbacks, only 3 elements added to arr.
  it('call remaining callback', () => {
    arr.length = 0
    manager.runCallbacks(1, 2)
    expect(arr).to.be.eql([2, 2, 2])
  })

  it('unregister remaining callbacks', () => {
    cbHandles.forEach((handle) => {
      assert.strictEqual(manager.unregister(handle), true)
    })
  })
})

describe('Multiple Keys For Callback', () => {
  const manager = CallbackManager()

  const cbHandles: Array<number> = []
  let value = 0
  it('register callback', () => {
    for (let i = 0; i < 5; i++) {
      // eslint-disable-next-line no-loop-func
      cbHandles.push(manager.register(i, () => { value = i }))
    }
  })

  it('call callback', () => {
    for (let i = 0; i < 5; i++) {
      manager.runCallbacks(i)
      assert.strictEqual(value, i)
    }
  })

  it('unregister some callbacks', () => {
    assert.strictEqual(manager.unregister(cbHandles.pop()), true)
    assert.strictEqual(manager.unregister(cbHandles.pop()), true)
  })

  it('call remaining callback', () => {
    for (let i = 0; i < 3; i++) {
      manager.runCallbacks(i)
      assert.strictEqual(value, i)
    }
    value = -1
    // The last 2 callbacks were removed so tha value should not change
    for (let i = 3; i < 5; i++) {
      manager.runCallbacks(i)
      assert.strictEqual(value, -1)
    }
  })

  it('unregister remaining callbacks', () => {
    cbHandles.forEach((handle) => {
      assert.strictEqual(manager.unregister(handle), true)
    })
  })
})

describe('Multiple keys That Have Multiple Callback', () => {
  const manager = CallbackManager()

  const keyToCbHandles: Record<number, Array<number>> = {}
  const arr: Array<number> = []
  it('register callback', () => {
    for (let key = 0; key < 5; key++) {
      // eslint-disable-next-line no-loop-func
      keyToCbHandles[key] = []
      for (let j = 0; j < 5; j++) {
        keyToCbHandles[key].push(manager.register(key, (num) => { arr.push(num) }))
      }
    }
  })

  it('call callback', () => {
    for (let i = 0; i < 5; i++) {
      manager.runCallbacks(i, i)
      expect(arr).to.be.eql([i, i, i, i, i])
      arr.length = 0
    }
  })

  it('unregister some callbacks', () => {
    // Remove the first key
    keyToCbHandles[0].forEach((handle) => {
      assert.strictEqual(manager.unregister(handle), true)
    })
    delete keyToCbHandles[0]

    // Remove two callbacks from the remaining keys
    for (let key = 1; key < 5; key++) {
      assert.strictEqual(manager.unregister(keyToCbHandles[key].pop()), true)
      assert.strictEqual(manager.unregister(keyToCbHandles[key].pop()), true)
    }
  })

  it('call remaining callback', () => {
    // The first key has no callbacks
    for (let i = 0; i < 1; i++) {
      manager.runCallbacks(i, i)
      expect(arr).to.be.eql([])
    }

    // The remaining keys have 2 less callback results.
    for (let i = 1; i < 5; i++) {
      manager.runCallbacks(i, i)
      expect(arr).to.be.eql([i, i, i])
      arr.length = 0
    }
  })

  it('unregister remaining callbacks', () => {
    Object.values(keyToCbHandles).forEach((cbHandles) => {
      cbHandles.forEach((handle) => {
        assert.strictEqual(manager.unregister(handle), true)
      })
    })
  })
})
