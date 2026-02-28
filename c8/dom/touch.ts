// @sublibrary(:dom-core-lib)
type TouchType = 'direct' | 'stylus'

interface TouchInit {
  identifier: number
  target: EventTarget
  screenX?: number
  screenY?: number
  clientX?: number
  clientY?: number
  pageX?: number
  pageY?: number
  radiusX?: number
  radiusY?: number
  rotationAngle?: number
  force?: number
  altitudeAngle?: number
  azimuthAngle?: number
  touchType?: TouchType
}

class Touch {
  constructor(touchInitDict: TouchInit) {
    this.identifier = touchInitDict.identifier
    this.target = touchInitDict.target
    this.screenX = touchInitDict.screenX ?? 0
    this.screenY = touchInitDict.screenY ?? 0
    this.clientX = touchInitDict.clientX ?? 0
    this.clientY = touchInitDict.clientY ?? 0
    this.pageX = touchInitDict.pageX ?? 0
    this.pageY = touchInitDict.pageY ?? 0
    this.radiusX = touchInitDict.radiusX ?? 0
    this.radiusY = touchInitDict.radiusY ?? 0
    this.rotationAngle = touchInitDict.rotationAngle ?? 0
    this.force = touchInitDict.force ?? 0
    this.altitudeAngle = touchInitDict.altitudeAngle ?? 0
    this.azimuthAngle = touchInitDict.azimuthAngle ?? 0
    this.touchType = touchInitDict.touchType || 'direct'
  }

  readonly identifier: number

  readonly target: EventTarget

  readonly screenX: number

  readonly screenY: number

  readonly clientX: number

  readonly clientY: number

  readonly pageX: number

  readonly pageY: number

  readonly radiusX: number

  readonly radiusY: number

  readonly rotationAngle: number

  readonly force: number

  readonly altitudeAngle: number

  readonly azimuthAngle: number

  readonly touchType: string
}

export {Touch, TouchInit, TouchType}
