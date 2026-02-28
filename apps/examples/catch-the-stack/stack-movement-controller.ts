import * as ecs from '@8thwall/ecs'

import {GlobalGyroscopeActive} from './gyroscope-handler'
import {getIngredientSize} from './ingredient'
import {getHorizontalLimitsAtZ, isMobile} from './utils'

// How far the stack should move laterally per action.
const STEP = 0.03

// Smoothing factor (0–1) for gamma to avoid jitter.
const SMOOTHING = 0.92

const TILT_BOUNDS = 40
const X_BOUNDS = 4

const clamp = (value: number, min: number, max: number): number => Math.max(
  min, Math.min(value, max)
)

ecs.registerComponent({
  name: 'StackMovementController',
  schema: {
    camera: ecs.eid,
  },
  schemaDefaults: {
  },
  data: {
    smoothedGamma: ecs.f32,
    hasGamma: ecs.boolean,
    touchStartX: ecs.f32,
    touchCurrentX: ecs.f32,
    isDragging: ecs.boolean,
    basePositionX: ecs.f32,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    if (!dataAttribute) {
      return
    }
    const handleDeviceOrientation = (deviceOrientation: DeviceOrientationEvent) => {
      // gamma: left-to-right tilt, [-90..90]
      const rawGamma = deviceOrientation.gamma ?? 0

      // simple low-pass filter
      const data = dataAttribute.cursor(eid)
      data.smoothedGamma +=
        SMOOTHING * (rawGamma - dataAttribute.cursor(eid).smoothedGamma)

      if (rawGamma !== 0) {
        data.hasGamma = true
      }
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        const data = dataAttribute.cursor(eid)
        data.touchStartX = touch.clientX
        data.touchCurrentX = touch.clientX
        data.isDragging = true
        data.basePositionX = ecs.Position.get(world, eid).x
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        const data = dataAttribute.cursor(eid)
        if (data.isDragging) {
          data.touchCurrentX = touch.clientX
        }
      }
    }

    const handleTouchEnd = () => {
      const data = dataAttribute.cursor(eid)
      data.isDragging = false
      data.touchStartX = 0
      data.touchCurrentX = 0
    }

    ecs.defineState('inGame')
      .initial()
      .onEvent('GameOver', 'gameOver', {target: world.events.globalId})
      .onEnter(async () => {
        const data = dataAttribute.cursor(eid)
        data.smoothedGamma = 0
        data.isDragging = false
        data.touchStartX = 0
        data.touchCurrentX = 0
        data.basePositionX = 0

        if (GlobalGyroscopeActive.getGyroscopeActive()) {
          window.addEventListener('deviceorientation', handleDeviceOrientation)
        } else if (isMobile()) {
          window.addEventListener('touchstart', handleTouchStart, {passive: true})
          window.addEventListener('touchmove', handleTouchMove, {passive: true})
          window.addEventListener('touchend', handleTouchEnd, {passive: true})
        }
        
        const size = getIngredientSize()
        ecs.Scale.set(world, eid, {
          x: size,
          y: size,
          z: size,
        })
      })
      .onTick(() => {
        const {camera} = schemaAttribute.cursor(eid)
        const cameraThree = world.three.entityToObject.get(camera)?.children
          .find(object => object.isPerspectiveCamera)

        if (!cameraThree) {
          console.error('Camera object is undefined or invalid.')
          return
        }
        const {minX, maxX} = getHorizontalLimitsAtZ(
          cameraThree,
          ecs.Position.get(world, camera).z,
          ecs.Position.get(world, eid).z
        )

        const {x, y, z} = ecs.Position.get(world, eid)
        let newX = x
        
        if (GlobalGyroscopeActive.getGyroscopeActive()) {
          const data = dataAttribute.cursor(eid)
          if (!data.hasGamma) {
            return
          }

          const gamma = data.smoothedGamma
          const tilt = clamp(Math.abs(gamma) / TILT_BOUNDS, 0, 1) ** 1.25
          newX = tilt * X_BOUNDS * Math.sign(gamma)

          if (Math.abs(x) > X_BOUNDS) {
            newX = X_BOUNDS * Math.sign(x)
          }
        } else if (isMobile()) {
          const data = dataAttribute.cursor(eid)
          if (!data.isDragging) {
            return
          }

          const touchDelta = data.touchCurrentX - data.touchStartX
          // Convert screen pixels to world units (adjust sensitivity as needed)
          const worldDelta = (touchDelta / window.innerWidth) * (maxX - minX)
          newX = data.basePositionX + worldDelta
        } else {
          if (world.input.getAction('moveLeft')) {
            newX = clamp(x - STEP * world.time.delta, minX, maxX)
          }
          if (world.input.getAction('moveRight')) {
            newX = clamp(x + STEP * world.time.delta, minX, maxX)
          }
        }
        
        ecs.Position.set(world, eid, {x: clamp(newX, minX, maxX), y, z})
      })
      .onExit(() => {
        window.removeEventListener('deviceorientation', handleDeviceOrientation)
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      })

    ecs.defineState('gameOver')
      .onEvent('StartGame', 'inGame', {target: world.events.globalId})
  },
})
