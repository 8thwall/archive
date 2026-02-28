// @sublibrary(:dom-core-lib)
import {DOMStringMap} from './dom-string-map'
import type {DOMString} from './strings'

interface HTMLOrSVGElement {
  readonly dataset: DOMStringMap

  nonce: DOMString

  autofocus: boolean

  tabIndex: number

  focus(options?: any): void

  blur(): void
}

const mixinHTMLOrSVGElement = <T extends HTMLOrSVGElement>(proto: T) => {
  Object.defineProperties(proto, {
    dataset: {
      get: function dataset() {
        if (!this._dataset) {
          Object.defineProperty(this, '_dataset', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: new DOMStringMap({}),
          })
        }
        return this._dataset
      },
    },
    nonce: {
      get: function nonce() {
        return this.getAttribute('nonce') || ''
      },
      set: function nonce(value: DOMString) {
        this.setAttribute('nonce', value)
      },
    },
    autofocus: {
      get: function autofocus() {
        return this.hasAttribute('autofocus')
      },
      set: function autofocus(value: boolean) {
        if (value) {
          this.setAttribute('autofocus', '')
        } else {
          this.removeAttribute('autofocus')
        }
      },
    },
    tabIndex: {
      get: function tabIndex() {
        return Number(this.getAttribute('tabindex')) || 0
      },
      set: function tabIndex(value: number) {
        this.setAttribute('tabindex', String(value))
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    focus: {value: (options?: any): void => {}},
    blur: {value: (): void => {}},
  })
}

export {HTMLOrSVGElement, mixinHTMLOrSVGElement}
