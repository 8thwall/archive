// @sublibrary(:dom-core-lib)
import type {Document} from './document'
import {HTMLElement} from './html-element'
import {throwIllegalConstructor} from './exception'
import {loadRawImageFromUrl, newBrokenImage, type RawImage} from './raw-image'
import {DOMException} from './dom-exception'
import {addAttributeChangeSteps} from './attribute-change-steps'

let inFactory = false

enum ImageRequestState {
  UNAVAILABLE,
  PARTIALLY_AVAILABLE,
  COMPLETELY_AVAILABLE,
  BROKEN,
}

interface ImageRequest {
  state: ImageRequestState
}

const currentImageRequestMap = new WeakMap<HTMLImageElement, ImageRequest>()

// This class implements a polyfill for the browser HTMLImageElement class.
class HTMLImageElement extends HTMLElement {
  constructor(ownerDocument: Document) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, 'image')
    currentImageRequestMap.set(this, {state: ImageRequestState.UNAVAILABLE})

    addAttributeChangeSteps(this, (
      element: HTMLImageElement,
      localName: string,
      oldValue: string | null,
      value: string | null,
      namespace: string | null
    ): void => {
      if (namespace !== null) {
        return
      }
      if (localName === 'src') {
        this._handleSrcChange()
      }
    })
  }

  alt: string = ''

  srcset: string = ''

  sizes: string = ''

  crossOrigin?: string | null = null

  useMap: string = ''

  isMap: boolean = false

  currentSrc: string = ''

  referrerPolicy: string = ''

  decoding: string = 'auto'

  loading: string = 'auto'

  fetchPriority: string = 'auto'

  private _decodeResolvers: {
    resolve: (value: void | PromiseLike<void>) => void
    reject: (reason?: any) => void
  }[] = []

  _image?: RawImage | null = null  // Not marked as private, as friend to CanvasRenderingContext2d.

  get src(): string {
    return this.getAttribute('src') ?? ''
  }

  set src(url: string) {
    this.setAttribute('src', url)  // Calls this._handleSrcChange() internally
  }

  // The complete getter steps are:
  // See: https://html.spec.whatwg.org/multipage/embedded-content.html#dom-img-complete
  get complete(): boolean {
    // 1. If any of the following are true:
    if (
      // both the src attribute and the srcset attribute are omitted;
      (this.getAttribute('src') === null && this.getAttribute('srcset') === null) ||

      // the srcset attribute is omitted and the src attribute's value is the empty string;
      (this.getAttribute('srcset') === null && this.getAttribute('src') === '') ||

      // the img element's current request's state is completely available and its pending request
      // is null; or
      (currentImageRequestMap.get(this)!.state ===
       ImageRequestState.COMPLETELY_AVAILABLE /* && pendingRequestIsNull */) ||

      // the img element's current request's state is broken and its pending request is null,
      (currentImageRequestMap.get(this)!.state ===
       ImageRequestState.BROKEN /* && pendingRequestIsNull */)) {
      // then return true.
      return true
    }

    // 2. Return false.
    return false
  }

  private async _handleSrcChange(): Promise<void> {
    const url = this.src

    // NOTE: This is a ultra-simplified version of image handling that doesn't match the WHATWG
    // spec. We should revisit this with a more complete implementation.
    try {
      const image = await loadRawImageFromUrl(new URL(url))

      if (this.src !== url) {
        // The src changed while loading
        return
      }

      this._image = image
    } catch (error) {
      this._image = newBrokenImage()
      currentImageRequestMap.get(this)!.state = ImageRequestState.BROKEN

      // Reject all decode promises.
      this._decodeResolvers.forEach(x => x.reject(
        new DOMException(error.message, 'EncodingError')
      ))
      this._decodeResolvers = []

      this.dispatchEvent(new Event('error'))

      return
    }

    currentImageRequestMap.get(this)!.state = ImageRequestState.COMPLETELY_AVAILABLE

    // Resolve all decode promises.
    this._decodeResolvers.forEach(x => x.resolve())
    this._decodeResolvers = []

    // Dispatch the onload event.
    this.dispatchEvent(new Event('load'))
  }

  get naturalWidth(): number {
    return this._image ? this._image.width : 0
  }

  get naturalHeight(): number {
    return this._image ? this._image.height : 0
  }

  get width(): number {
    const attr = this.getAttribute('width')
    if (attr === null) {
      return this.naturalWidth
    } else {
      return +attr
    }
  }

  set width(value: number | string) {
    this.setAttribute('width', String(Number(value)))
  }

  get height(): number {
    const attr = this.getAttribute('height')
    if (attr === null) {
      return this.naturalHeight
    } else {
      return +attr
    }
  }

  set height(value: number | string) {
    this.setAttribute('height', String(Number(value)))
  }

  decode(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const {state} = currentImageRequestMap.get(this)!
      if (state === ImageRequestState.COMPLETELY_AVAILABLE) {
        resolve()
      } else if (state === ImageRequestState.BROKEN) {
        reject(new DOMException(`Image '${this.src}' is broken`, 'EncodingError'))
      } else {
        this._decodeResolvers.push({resolve, reject})
      }
    })
  }
}

// Note(lreyna): This is a workaround to ensure that the constructor name is set correctly.
// When webpack mode is production, the constructor is being renamed to
// 'html_image_element_HTMLImageElement' and the name is not set to 'HTMLImageElement'.
// This is in spite of many specific TerserOptions being set in 'bzl/js/webpack-build.ts'.
// This only happens to a couple of classes, but will affect the `constructor.name` checks
// that headless-gl does when loading a texture.
// Try: bazel test --angle --config=release //c8/dom/rendering:texture-loading-test
Object.defineProperty(HTMLImageElement.prototype.constructor, 'name', {
  value: 'HTMLImageElement',
})

const createHTMLImageElement = (ownerDocument: Document): HTMLImageElement => {
  inFactory = true
  try {
    return new HTMLImageElement(ownerDocument)
  } finally {
    inFactory = false
  }
}

const currentImageRequest = (
  image: HTMLImageElement
): ImageRequest => currentImageRequestMap.get(image)!

// When an img element's current request's state is completely available and the user agent can
// decode the media data without errors, then the img element is said to be fully decodable.
// See: https://html.spec.whatwg.org/multipage/images.html#img-good
// [IMPLIED CURRENTLY]: Image is fully decodable if it is completely available.
const isFullyDecodable = (image: HTMLImageElement): boolean => (
  currentImageRequest(image).state === ImageRequestState.COMPLETELY_AVAILABLE
)

export {
  HTMLImageElement,
  createHTMLImageElement,
  currentImageRequest,
  ImageRequestState,
  isFullyDecodable,
}
