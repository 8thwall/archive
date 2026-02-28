// @sublibrary(:dom-core-lib)
/* eslint-disable max-classes-per-file */
import type {EventInit} from './dom-events'
import type {PermissionState} from './permission-status'

// https://w3c.github.io/deviceorientation/#deviceorientation
interface DeviceOrientationEventInit extends EventInit {
  alpha?: number
  beta?: number
  gamma?: number
  absolute: boolean
}

// Note: On Desktop Browsers, this Event is defined. However, "requestPermission" is not defined.
class DeviceOrientationEvent extends Event {
  constructor(type: string, eventInitDict?: DeviceOrientationEventInit) {
    super(type, eventInitDict)
    this.alpha = eventInitDict?.alpha
    this.beta = eventInitDict?.beta
    this.gamma = eventInitDict?.gamma
    this.absolute = eventInitDict?.absolute ?? false
  }

  readonly alpha?: number

  readonly beta?: number

  readonly gamma?: number

  readonly absolute: boolean

  static readonly requestPermission?: (absolute: boolean) => Promise<PermissionState> = undefined
}

// https://w3c.github.io/deviceorientation/#device-motion-event-api
interface DeviceMotionEventAccelerationInit {
  x?: number
  y?: number
  z?: number
}

interface DeviceMotionEventRotationRateInit {
  alpha?: number
  beta?: number
  gamma?: number
}

interface DeviceMotionEventInit extends EventInit {
  acceleration: DeviceMotionEventAccelerationInit
  accelerationIncludingGravity: DeviceMotionEventAccelerationInit
  rotationRate: DeviceMotionEventRotationRateInit
  interval: number
}

class DeviceMotionEvent extends Event {
  constructor(type: string, eventInitDict?: DeviceMotionEventInit) {
    super(type, eventInitDict)
    this.acceleration = eventInitDict?.acceleration
    this.accelerationIncludingGravity = eventInitDict?.accelerationIncludingGravity
    this.rotationRate = eventInitDict?.rotationRate
    this.interval = eventInitDict?.interval ?? 0
  }

  // The acceleration of the device along the x, y, and z axes in meters per second squared.
  // This value does not include the acceleration due to gravity.
  // The magnitude should be 0 when the device is at rest.
  readonly acceleration?: DeviceMotionEventAccelerationInit

  // Same as acceleration, but including the component of gravity.
  readonly accelerationIncludingGravity?: DeviceMotionEventAccelerationInit

  // The rate of rotation of the device about all three axes in degrees per second.
  readonly rotationRate?: DeviceMotionEventRotationRateInit

  // Inveral at which data is obtained from the underlying hardware in milliseconds.
  readonly interval: number

  static readonly requestPermission?: () => Promise<PermissionState> = undefined
}

export {
  DeviceOrientationEvent,
  DeviceOrientationEventInit,
  DeviceMotionEvent,
  DeviceMotionEventInit,
  DeviceMotionEventAccelerationInit,
  DeviceMotionEventRotationRateInit,
}
