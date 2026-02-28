import {useEffect, useRef, useState} from 'react'

type LegacySetState<U> =
  (update: Partial<U> | ((prevState: U) => Partial<U>), cb?: () => void) => void

type UseLegacyState = <T>(initialState: T) => [T, LegacySetState<T>]

// Explicit type guard because typescript isn't convinced by an inline typeof === 'function' check.
const isFunction = (thing): thing is Function => typeof thing === 'function'

/**
 * Just like useState() except that [, setState] accepts a callback just like class.based setState()
 * Also merge the new state into the previous state.
 * @param initialState
 */
const useLegacyState: UseLegacyState = (initialState) => {
  const [storedState, setStoredState] = useState(initialState)

  const deferredCallbacks = useRef([])

  const setState: LegacySetState<typeof initialState> = (update, cb) => {
    setStoredState((latestState) => {
      if (cb) {
        deferredCallbacks.current.push(cb)
      }
      if (isFunction(update)) {
        return {...latestState, ...update(latestState)}
      } else {
        return {...latestState, ...update}
      }
    })
  }

  useEffect(() => {
    const cbs = deferredCallbacks.current
    deferredCallbacks.current = []
    cbs.forEach(cb => cb())
  })

  // Returns the state at the time of render.
  return [storedState, setState]
}

export {
  useLegacyState,
}

export type {
  LegacySetState,
}
