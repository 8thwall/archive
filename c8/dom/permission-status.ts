// @sublibrary(:dom-core-lib)
class PermissionStatus extends EventTarget {
  state: PermissionState

  name: string

  onchange: ((this: PermissionStatus, ev: Event) => any) | null
}

type PermissionState = 'granted' | 'denied' | 'prompt'

export {
  PermissionStatus,
  PermissionState,
}
