// createState.js
/**
 * @template T
 * @param {T} initialState - The initial state.
 * @returns {{
 *   getState: () => T;
 *   setState: (newState: Partial<T>) => void;
 *   subscribe: (listener: (state: T) => void) => () => void;
 * }}
 */
export const createState = (initialState) => {
  let state = initialState
  const listeners = []

  const setState = (newState) => {
    state = {...state, ...newState}
    listeners.forEach(listener => listener(state))
  }

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  return {getState, setState, subscribe}
}
