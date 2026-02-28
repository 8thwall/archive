import type {RawActions} from './types/actions'

const wrapDeprecatedActions = <T extends RawActions>(
  rawActions: T, makeMessage: (key: string) => string
) => {
  const warnedActions = new Set<string>()
  return Object.keys(rawActions).reduce((o, key) => {
    o[key] = (...args: any) => {
      if (!warnedActions.has(key)) {
        // eslint-disable-next-line no-console
        console.error(makeMessage(key))
        warnedActions.add(key)
      }
      return rawActions[key](...args)
    }
    return o
  }, {})
}

export {wrapDeprecatedActions}
