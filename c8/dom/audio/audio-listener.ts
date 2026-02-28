// @sublibrary(:audio-lib)
import type {AudioContext} from './audio-context'

class AudioListener {
  // default (0, 0, 0)
  _positionX: number = 0

  _positionY: number = 0

  _positionZ: number = 0

  // default (0, 0, -1)
  _forwardX: number = 0

  _forwardY: number = 0

  _forwardZ: number = -1

  // default (0, 1, 0)
  _upX: number = 0

  _upY: number = 1

  _upZ: number = 0

  private _context: AudioContext

  setContext(context: AudioContext) {
    this._context = context
  }

  setOrientation(x: number, y: number, z: number, xUp: number, yUp: number, zUp: number) {
    if (x === this._forwardX && y === this._forwardY && z === this._forwardZ &&
        xUp === this._upX && yUp === this._upY && zUp === this._upZ) {
      return
    }
    this._forwardX = x
    this._forwardY = y
    this._forwardZ = z

    this._upX = xUp
    this._upY = yUp
    this._upZ = zUp

    this._context._sources.forEach((source) => {
      source.updateGains()
    })
  }

  setPosition(x: number, y: number, z: number) {
    if (x === this._positionX && y === this._positionY && z === this._positionZ) {
      return
    }
    this._positionX = x
    this._positionY = y
    this._positionZ = z

    this._context._sources.forEach((source) => {
      source.updateGains()
    })
  }
}

export {AudioListener}
