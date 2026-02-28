// @sublibrary(:dom-core-lib)
import {DOMString} from './strings'

class DOMStringMap {
  // eslint-disable-next-line no-restricted-globals
  [name: string]: DOMString | undefined

  constructor(data: Record<DOMString, DOMString>) {
    Object.assign(this, data)
  }
}

export {DOMStringMap}
