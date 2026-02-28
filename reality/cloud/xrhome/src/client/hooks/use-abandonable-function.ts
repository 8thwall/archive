import {useEffect, useRef} from 'react'

type UseAbandonableFunction =
  <F extends (...args: any[]) => Promise<any>>(func: F) => (...args: Parameters<F>) => ReturnType<F>

/**
 * Wraps a function so that it never returns/promise is never resolved when component unmounts.
 *
 * Sample usage:
 *
 * const lintAndFormat = wrapAbandonable(eslint.lintAndFormat)
 * lintAndFormat(input).then((res) => doStuffWithIfStillMounted(res))
 *
 * @param func The function to wrap.
 */
const useAbandonableFunction: UseAbandonableFunction = (func) => {
  const state = useRef({
    tick: 0,
  })

  useEffect(() => () => {
    state.current.tick++
  }, [])

  // NOTE(pawel) It is not clear whether a change in deps should early cause return
  // and not execute func. The answer to this question determines whether expectedTick
  // is captured in this scope or in the promise scope below. For now deps are disabled,
  // the function always runs and its result is abandoned on component unmount.
  const expectedTick = state.current.tick

  return (...args) => new Promise((resolve, reject) => {
    Promise.resolve(func(...args)).then((result) => {
      if (expectedTick === state.current.tick) {
        resolve(result)
      }
    }).catch((err) => {
      if (expectedTick === state.current.tick) {
        reject(err)
      } else {
        // We probably shouldn't silently swallow the error.
        // eslint-disable-next-line no-console
        console.error(err)
      }
    })
  }) as ReturnType<typeof func>
}

export {
  useAbandonableFunction,
}
