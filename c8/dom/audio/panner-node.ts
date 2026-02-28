// @sublibrary(:audio-lib)
import {AudioNode} from './audio-node'

import {vec3} from '@nia/c8/ecs/src/runtime/math/math'
import type {MediaElementAudioSourceNode} from './media-element-audio-source-node'

type PanningModel = 'equalpower' | 'HRTF'
type DistanceModel = 'linear' | 'inverse' | 'exponential'

interface PannerGain {
  left: number
  right: number
  azimuthLeft: boolean
}

class PannerNode extends AudioNode {
  private _panningModel: PanningModel = 'equalpower'

  private _distanceModel: DistanceModel = 'inverse'

  private _refDistance = 1

  private _maxDistance = 10000

  private _rolloffFactor = 1

  private _coneInnerAngle = 360

  private _coneOuterAngle = 0

  private _coneOuterGain = 0

  private _positionX = 0

  private _positionY = 0

  private _positionZ = 0

  private _orientationX = 1

  private _orientationY = 0

  private _orientationZ = 0

  // not part of spec
  sourceNode: MediaElementAudioSourceNode = null

  get panningModel() {
    return this._panningModel
  }

  set panningModel(panningModel: PanningModel) {
    this._panningModel = panningModel
  }

  get distanceModel() {
    return this._distanceModel
  }

  set distanceModel(distanceModel: DistanceModel) {
    this._distanceModel = distanceModel
  }

  get refDistance() {
    return this._refDistance
  }

  set refDistance(distance: number) {
    this._refDistance = distance
  }

  get maxDistance() {
    return this._maxDistance
  }

  set maxDistance(distance: number) {
    this._maxDistance = distance
  }

  get rolloffFactor() {
    return this._rolloffFactor
  }

  set rolloffFactor(rolloffFactor: number) {
    this._rolloffFactor = rolloffFactor
  }

  get coneInnerAngle() {
    return this._coneInnerAngle
  }

  set coneInnerAngle(angle: number) {
    this._coneInnerAngle = angle
  }

  get coneOuterAngle() {
    return this._coneOuterAngle
  }

  set coneOuterAngle(angle: number) {
    this._coneOuterAngle = angle
  }

  get coneOuterGain() {
    return this._coneOuterGain
  }

  set coneOuterGain(angle: number) {
    this._coneOuterGain = angle
  }

  setOrientation(x: number, y: number, z: number) {
    if (x === this._orientationX && y === this._orientationY && z === this._orientationZ) {
      return
    }
    this._orientationX = x
    this._orientationY = y
    this._orientationZ = z

    if (this.sourceNode) {
      this.sourceNode.updateGains(true)
    }
  }

  setPosition(x: number, y: number, z: number) {
    if (x === this._positionX && y === this._positionY && z === this._positionZ) {
      return
    }
    this._positionX = x
    this._positionY = y
    this._positionZ = z

    if (this.sourceNode) {
      this.sourceNode.updateGains()
    }
  }

  // https://webaudio.github.io/web-audio-api/#azimuth-elevation
  computeAzimuth = () => {
    let azimuth = 0

    // Let |context| be a BaseAudioContext and let |panner| be a
    // PannerNode created in |context|.
    // Calculate the source-listener vector.
    const listener = this._context._listener
    const sourcePosition = vec3.xyz(this._positionX, this._positionY, this._positionZ)
    const listenerPosition =
        vec3.xyz(listener._positionX, listener._positionY, listener._positionZ)

    const sourceListener = sourcePosition.minus(listenerPosition).normalize()
    if (sourceListener.length() === 0) {
      // Handle degenerate case if source and listener are at the same point.
      return azimuth
    }

    // Align axes.
    const listenerForward = vec3.xyz(listener._forwardX, listener._forwardY, listener._forwardZ)
    const listenerUp = vec3.xyz(listener._upX, listener._upY, listener._upZ)
    const listenerRight = listenerForward.cross(listenerUp)
    if (listenerRight.length() === 0) {
      // Handle the case where listener’s 'up' and 'forward' vectors are linearly
      // dependent, in which case 'right' cannot be determined
      return azimuth
    }

    // Determine a unit vector orthogonal to listener’s right, forward
    const listenerRightNorm = listenerRight.normalize()
    const listenerForwardNorm = listenerForward.normalize()
    const up = listenerRightNorm.cross(listenerForwardNorm)
    const upProjection = sourceListener.dot(up)
    const projectedSource = sourceListener.minus(up.scale(upProjection)).normalize()
    azimuth = (180 * Math.acos(projectedSource.dot(listenerRightNorm))) / Math.PI

    // Source in front or behind the listener.
    const frontBack = projectedSource.dot(listenerForwardNorm)
    if (frontBack < 0) {
      azimuth = 360 - azimuth
    }

    // Make azimuth relative to "forward" and not "right" listener vector.
    if ((azimuth >= 0) && (azimuth <= 270)) {
      azimuth = 90 - azimuth
    } else { azimuth = 450 - azimuth }

    return azimuth
  }

  // https://webaudio.github.io/web-audio-api/#Spatialization-equal-power-panning
  computeStereoPanningGain = () => {
    let azimuth = this.computeAzimuth()

    // First, clamp azimuth to allowed range of [-180, 180].
    azimuth = Math.max(-180, azimuth)
    azimuth = Math.min(180, azimuth)

    // Then wrap to range [-90, 90].
    if (azimuth < -90) {
      azimuth = -180 - azimuth
    } else if (azimuth > 90) {
      azimuth = 180 - azimuth
    }

    // calculate normalized input x (assume input is stereo)
    let x = 0
    if (azimuth <= 0) {  // -90 -> 0
      // Transform the azimuth value from [-90, 0] degrees into the range [-90, 90].
      x = (azimuth + 90) / 90
    } else {  // 0 -> 90
      // Transform the azimuth value from [0, 90] degrees into the range [-90, 90].
      x = azimuth / 90
    }

    // For stereo input, the output is calculated as:
    const gainL = Math.cos((x * Math.PI) / 2)
    const gainR = Math.sin((x * Math.PI) / 2)

    const result: PannerGain = {left: gainL, right: gainR, azimuthLeft: azimuth <= 0}
    return result
  }

  // https://webaudio.github.io/web-audio-api/#Spatialization-distance-effects
  computeDistanceGain = () => {
    const listener = this._context._listener

    // TODO(divya): reuse from computeazimuth?
    const pannerPosition = vec3.xyz(this._positionX, this._positionY, this._positionZ)
    const listenerPosition =
    vec3.xyz(listener._positionX, listener._positionY, listener._positionZ)

    const distance = pannerPosition.minus(listenerPosition).length()
    const distanceGain = 1
    if (this.distanceModel === 'inverse') {
      return this.inverseDistanceGain(distance)
    } else if (this.distanceModel === 'linear') {
      return this.linearDistanceGain(distance)
    } else if (this.distanceModel === 'exponential') {
      return this.exponentialDistanceGain(distance)
    }

    return distanceGain
  }

  /**
   * Calculates the distance gain using the inverse distance model according to:
   *  https://webaudio.github.io/web-audio-api/#enumdef-distancemodeltype
   * Formula:
   *   distanceGain = d_ref / (d_ref + f * (max(d, d_ref) - d_ref))
   */
  inverseDistanceGain = (distance: number) => {
    if (this.refDistance === 0) {
      return 0  // Special case: If reference distance is 0, gain is 0.
    }

    const clampedDistance = Math.max(distance, this.refDistance)
    return this.refDistance /
      (this.refDistance + this.rolloffFactor * (clampedDistance - this.refDistance))
  }

  /**
   * Calculates the distance gain using the linear distance model according to:
   * Formula:
   *   distanceGain = 1 - f * (max[min(d, d'_max), d'_ref] - d'_ref) / (d'_max - d'_ref)
   * where:
   *   d'_ref = min(d_ref, d_max)
   *   d'_max = max(d_ref, d_max)
   */
  linearDistanceGain = (distance: number) => {
    const dPrimeRef = Math.min(this.refDistance, this.maxDistance)
    const dPrimeMax = Math.max(this.refDistance, this.maxDistance)

    // Clamp the distance to the interval [d'_ref, d'_max]
    const clampedDistance = Math.max(dPrimeRef, Math.min(distance, dPrimeMax))

    // Special case: if d'_ref == d'_max, the gain is 1 - f
    if (dPrimeRef === dPrimeMax) {
      return 1 - this.rolloffFactor  // Using rolloffFactor as f
    }

    // Calculate the linear distance gain
    return 1 - this.rolloffFactor *
        ((Math.max(Math.min(clampedDistance, dPrimeMax), dPrimeRef) - dPrimeRef) /
        (dPrimeMax - dPrimeRef))
  }

  /**
  * Calculates the distance gain using the exponential distance model according to:
  * Formula:
  *   distanceGain = (max(d, d_ref) / d_ref) ^ -f
  * where:
  *   d is clamped to the interval [d_ref, ∞)
  */
  exponentialDistanceGain = (distance: number) => {
    if (this.refDistance === 0) {
      return 0  // Special case: If reference distance is 0, gain is 0.
    }

    // Clamp the distance to the interval [d_ref, ∞)
    const clampedDistance = Math.max(distance, this.refDistance)

    // Calculate the exponential distance gain
    return (clampedDistance / this.refDistance) ** -this.rolloffFactor
  }

  // https://webaudio.github.io/web-audio-api/#Spatialization-sound-cones
  computeConeGain = () => {
    const listener = this._context._listener
    const sourceOrientation =
        vec3.xyz(this._orientationX, this._orientationY, this._orientationZ)

    // no cone specified - unity gain
    if (sourceOrientation.length() === 0 ||
        ((this.coneInnerAngle === 360) && (this.coneOuterAngle === 0))) return 1

    // Normalized source-listener vector
    const sourcePosition = vec3.xyz(this._positionX, this._positionY, this._positionZ)
    const listenerPosition =
      vec3.xyz(listener._positionX, listener._positionY, listener._positionZ)
    const sourceToListener = sourcePosition.minus(listenerPosition).normalize()
    const normalizedSourceOrientation = sourceOrientation.normalize()

    // Angle between the source orientation vector and the source-listener vector
    const angle = (180 * Math.acos(sourceToListener.dot(normalizedSourceOrientation))) / Math.PI

    // First, clamp azimuth to allowed range of [-180, 180].
    let wrappedAngle = angle
    wrappedAngle = Math.max(-180, wrappedAngle)
    wrappedAngle = Math.min(180, wrappedAngle)

    // Then wrap to range [-90, 90].
    if (wrappedAngle < -90) {
      wrappedAngle = -180 - wrappedAngle
    } else if (wrappedAngle > 90) {
      wrappedAngle = 180 - wrappedAngle
    }

    const absAngle = Math.abs(wrappedAngle)

    // Divide by 2 here since API is entire angle (not half-angle)
    const absInnerAngle = Math.abs(this.coneInnerAngle) / 2
    const absOuterAngle = Math.abs(this.coneOuterAngle) / 2

    let gain = 1
    if (absAngle <= absInnerAngle) {
      // No attenuation
      gain = 1
    } else if (absAngle >= absOuterAngle) {
      // Max attenuation
      gain = this.coneOuterGain
    } else {
      // Between inner and outer cones
      // inner -> outer, x goes from 0 -> 1
      const x = (absAngle - absInnerAngle) / (absOuterAngle - absInnerAngle)
      gain = (1 - x) + this.coneOuterGain * x
    }
    return gain
  }
}

export {
  PannerNode,
}
export type{
  PanningModel,
  DistanceModel,
  PannerGain,
}
