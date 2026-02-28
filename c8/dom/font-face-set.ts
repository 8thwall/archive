// @sublibrary(:dom-core-lib)
import type {FontFace} from './font-face'

class FontFaceSet {
  private _storage: Set<FontFace>

  constructor() {
    this._storage = new Set()
  }

  add(fontFace: FontFace): void {
    this._storage.add(fontFace)
  }
}

export {FontFaceSet}
