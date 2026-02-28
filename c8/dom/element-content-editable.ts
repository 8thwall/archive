// @sublibrary(:dom-core-lib)
import type {DOMString} from './strings'

interface ElementContentEditable {
  contentEditable: DOMString

  enterKeyHint: DOMString

  readonly isContentEditable: boolean

  inputMode: DOMString
}

const mixinElementContentEditable = <T extends ElementContentEditable>(proto: T) => {
  Object.defineProperties(proto, {
    contentEditable: {value: 'inherit', writable: true, enumerable: true},
    enterKeyHint: {value: '', writable: true, enumerable: true},
    isContentEditable: {value: false, writable: false, enumerable: true},
    inputMode: {value: '', writable: true, enumerable: true},
  })
}

export {ElementContentEditable, mixinElementContentEditable}
