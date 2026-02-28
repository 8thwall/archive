type Dispatch = <T>(t: T) => T
type BaseRawAction = (...rest: any) => (dispatch: Dispatch, getState: () => any) => any
type Dispatchify<T extends BaseRawAction> = (...rest: Parameters<T>) => ReturnType<ReturnType<T>>
type DispatchifiedActions<T extends Record<string, BaseRawAction>> = {
  [K in keyof T]: Dispatchify<T[K]>
}

export {
  BaseRawAction,         // eslint-disable-line no-undef
  Dispatch,              // eslint-disable-line no-undef
  DispatchifiedActions,  // eslint-disable-line no-undef
  Dispatchify,           // eslint-disable-line no-undef
}
