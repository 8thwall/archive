// Copyright (c) 2023 Niantic, Inc.
// Original Author: Akul Gupta (akulgupta@nianticlabs.com)
/*
Manages callbacks for different types of events (keys). Use this class to register, call, and
unregister callbacks.
Example:
  const manager = CallbackManager()

  const IMAGE_FOUND = "imageFound"
  const IMAGE_LOST = "imageLost"

  // Register callbacks
  const a1 = manager.register(IMAGE_FOUND, () => 1)
  const a2 = manager.register(IMAGE_FOUND, () => 2)
  const b1 = manager.register(IMAGE_LOST, () => 1)

  // Get callbacks
  manager.getCallbacks(IMAGE_FOUND).map(v => v())
  manager.getCallbacks(IMAGE_LOST).map(v => v())

  // Call callbacks
  manager.runCallbacks(data1)
  manager.runCallbacks(data2)

  // Unregister
  manager.unregister(a1)
  manager.unregister(b1)
*/

type Key = string | number

type IdToCallbacks = Record<number, Function>

type KeyToCallbacks = Record<Key, IdToCallbacks>

const CallbackManager = () => {
  const keyToCallBacks_: KeyToCallbacks = {}
  const idToKey_: Record<number, Key> = {}
  let callbackId_: number = 0

  const hasKey = (key: Key) => !!keyToCallBacks_[key]

  const register = (key: Key, func: Function): number => {
    if (!hasKey(key)) {
      keyToCallBacks_[key] = {}
    }
    const callbackId = callbackId_++
    keyToCallBacks_[key][callbackId] = func
    idToKey_[callbackId] = key
    return callbackId
  }

  // @returns whether the callback was successfully unregistered
  const unregister = (id: number) => {
    const key = idToKey_[id]
    if (key == null || !hasKey(key) || !keyToCallBacks_[key][id]) {
      // eslint-disable-next-line no-console
      console.warn(`Do not have callback for id: ${id}`)
      return false
    }

    let success = delete idToKey_[id]
    success &&= delete keyToCallBacks_[key][id]
    if (!success) {
      // eslint-disable-next-line no-console
      console.error(`[internal-error] Unable to remove callback for id: ${id}`)
      return false
    }
    return true
  }

  const getCallbacks = (key: Key) => {
    if (!hasKey(key)) {
      return []
    }
    return Object.values(keyToCallBacks_[key])
  }

  // Run callbacks for a specific key, where each callback gets the same input.
  const runCallbacks = (key: Key, ...args: any[]) => {
    getCallbacks(key).forEach(cb => cb(...args))
  }

  return {
    hasKey,
    register,
    unregister,
    getCallbacks,
    runCallbacks,
  }
}

export {
  CallbackManager,
}
