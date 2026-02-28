// @sublibrary(:dom-core-lib)
import type {HTMLElement} from './html-element'
import {isConnected} from './node-internal'

// CSSOM View Extensions to the Element Interface.
// See: https://www.w3.org/TR/cssom-view-1/#extension-to-the-element-interface
interface CssomElement {
  // [NOT IMPLEMENTED]
  // getClientRects: (): DOMRect[]
  // getBoundingClientRect: (): DOMRect
  // scrollIntoView: (arg?: boolean | ScrollIntoViewOptions) => void
  // scroll: (options?: ScrollToOptions) => void
  // scroll: (x: number, y: number) => void
  // scrollTo: (options?: ScrollToOptions) => void
  // scrollTo: (x: number, y: number) => void
  // scrollBy: (options?: ScrollToOptions) => void
  // scrollBy: (x: number, y: number) => void
  // scrollTop: number
  // scrollLeft: number
  // readonly scrollWidth: number
  // readonly scrollHeight: number
  // readonly clientTop: number
  // readonly clientLeft: number
  readonly clientWidth: number
  readonly clientHeight: number
}

const mixinCssomElement = <T extends CssomElement>(proto: T) => {
  Object.defineProperties(proto, {
    'clientWidth': {
      enumerable: true,
      configurable: false,
      get() {
        const el = this as HTMLElement
        // If the element has no associated CSS layout box or if the CSS layout box is inline,
        // return zero.
        // [NOT IMPLEMENTED]
        if (!isConnected(el)) {
          // Simple implementation: if the element is not in the document, return 0.
          return 0
        }

        // If the element is the root element and the element’s node document is not in quirks mode,
        // or if the element is the HTML body element and the element’s node document is in quirks
        // mode, return the viewport width excluding the size of a rendered scroll bar (if any).
        // [NOT IMPLEMENTED]

        // Return the width of the padding edge excluding the width of any rendered scrollbar
        // between the padding edge and the border edge, ignoring any transforms that apply to the
        // element and its ancestors.
        // [NOT IMPLEMENTED]
        // Simple implementation: return the style width (assume px) or width of the element.
        const widthStyle = (el?.style as any)?.width ?? el?.style?.getPropertyPriority('width')
        const styleWidth = parseInt(widthStyle, 10)
        if (Number.isFinite(styleWidth)) {
          return styleWidth
        } else {
          return (el as any)?.width ?? 0
        }
      },
    },
    'clientHeight': {
      enumerable: true,
      configurable: false,
      get() {
        const el = this as HTMLElement
        // If the element has no associated CSS layout box or if the CSS layout box is inline,
        // return zero.
        // [NOT IMPLEMENTED]
        if (!isConnected(el)) {
          // Simple implementation: if the element is not in the document, return 0.
          return 0
        }

        // If the element is the root element and the element’s node document is not in quirks mode,
        // or if the element is the HTML body element and the element’s node document is in quirks
        // mode, return the viewport height excluding the size of a rendered scroll bar (if any).
        // [NOT IMPLEMENTED]

        // Return the height of the padding edge excluding the height of any rendered scrollbar
        // between the padding edge and the border edge, ignoring any transforms that apply to the
        // element and its ancestors.
        // [NOT IMPLEMENTED]
        // Simple implementation: return the style height (assume px) or height of the element.
        const heightStyle = (el?.style as any)?.height ?? el?.style?.getPropertyPriority('height')
        const styleHeight = parseInt(heightStyle, 10)
        if (Number.isFinite(styleHeight)) {
          return styleHeight
        } else {
          return (el as any)?.height ?? 0
        }
      },
    },
  })
}

export {mixinCssomElement, CssomElement}
