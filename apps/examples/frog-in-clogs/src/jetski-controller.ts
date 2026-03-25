import * as ecs from '@8thwall/ecs'

// Helper to compute the wave height at (x, z)
function getWaveHeight(
  x: number,
  z: number,
  t: number,
  rippleHeight: number,
  rippleFreq: number,
  rippleSpeed: number,
  rippleMod: number
) {
  const fract = (v: number) => v - Math.floor(v)
  const hash = (vx: number, vz: number) => fract(Math.sin(vx * 127.1 + vz * 311.7) * 43758.5453123)
  let ripple = 0
  ripple += Math.sin((x + hash(x, z) * rippleMod) * rippleFreq + t)
  ripple +=
    0.6 *
    Math.sin(
      (z * 0.7 + hash(z, x) * rippleMod * 1.1) * rippleFreq * 1.4 + t * 1.15
    )
  ripple += 0.3 * Math.sin((x * 1.8 - z * 1.3 + t * 0.33) * rippleFreq * 0.6)
  return ripple * rippleHeight
}

// Smooth easing function for jump arc
function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

// Jump curve with naturally soft landing
function jumpArc(t: number): number {
  // Use a combination of sine and parabola for natural motion with soft landing
  if (t < 0.6) {
    // First 60% - normal parabolic rise and initial fall
    return 4 * t * (1 - t)
  } else {
    // Last 40% - transition to sine curve for gentle landing
    // Map t from [0.6, 1] to [0, 1] for the sine calculation
    const landingProgress = (t - 0.6) / 0.4
    // Start from where the parabola was at t=0.6 and ease down to 0
    const parabolicAt60 = 4 * 0.6 * (1 - 0.6)  // = 0.96
    return parabolicAt60 * Math.cos(landingProgress * Math.PI / 2)
  }
}

// Quaternion multiply [x,y,z,w] ⨉ [x,y,z,w]
function quatMultiply(a: number[], b: number[]) {
  const [ax, ay, az, aw] = a
  const [bx, by, bz, bw] = b
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ]
}

// Build a quaternion from pitch and roll angles only (no yaw component)
function quatFromPitchRoll(pitch: number, roll: number) {
  const ph = pitch / 2
  const rh = roll / 2

  // X rotation (pitch)
  const pitchQuat: number[] = [Math.sin(ph), 0, 0, Math.cos(ph)]
  // Z rotation (roll)
  const rollQuat: number[] = [0, 0, Math.sin(rh), Math.cos(rh)]

  // Apply pitch then roll (local space)
  return quatMultiply(rollQuat, pitchQuat)
}

// Pure Y-axis rotation quaternion
function quatFromYRotation(angleRad: number) {
  const half = angleRad / 2
  return [0, Math.sin(half), 0, Math.cos(half)]
}

// Pure Z-axis rotation quaternion (roll)
function quatFromZRotation(angleRad: number) {
  const half = angleRad / 2
  return [0, 0, Math.sin(half), Math.cos(half)]
}

// Convert quaternion to Euler angles for debugging
function quatToEuler(quat: number[]) {
  const [x, y, z, w] = quat
  
  // Roll (x-axis rotation)
  const sinr_cosp = 2 * (w * x + y * z)
  const cosr_cosp = 1 - 2 * (x * x + y * y)
  const roll = Math.atan2(sinr_cosp, cosr_cosp)
  
  // Pitch (y-axis rotation)
  const sinp = 2 * (w * y - z * x)
  const pitch = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp)
  
  // Yaw (z-axis rotation)
  const siny_cosp = 2 * (w * z + x * y)
  const cosy_cosp = 1 - 2 * (y * y + z * z)
  const yaw = Math.atan2(siny_cosp, cosy_cosp)
  
  return { roll: roll * 180 / Math.PI, pitch: pitch * 180 / Math.PI, yaw: yaw * 180 / Math.PI }
}

const jetskiController = ecs.registerComponent({
  name: 'Jetski Controller',
  schema: {
    speed: ecs.f32,
    rotationSpeed: ecs.f32,
    jumpPower: ecs.f32,
    drift: ecs.f32,
    particleSystem: ecs.eid,
    jetski: ecs.eid,
    jetskiHandles: ecs.eid,
    ocean: ecs.eid,
    camera: ecs.eid,
    verticalOffset: ecs.f32,
    waveInfluence: ecs.f32,
    waveTiltInfluence: ecs.f32,  // How much the jetski tilts with waves
    tiltSmoothing: ecs.f32,  // Smoothing for pitch/roll transitions
    rearKickIntensity: ecs.f32,  // How much the rear kicks out when turning
    steeringTiltInfluence: ecs.f32,  // How much the jetski tilts when steering while moving
    // Starting position for reset
    startX: ecs.f32,
    startY: ecs.f32,
    startZ: ecs.f32,
    startAngle: ecs.f32,
    // Gamepad settings
    gamepadEnabled: ecs.boolean,  // Enable/disable gamepad input
    gamepadIndex: ecs.i32,  // Which gamepad to use (0-3)
    steeringSensitivity: ecs.f32,  // Left stick X sensitivity for steering
    steeringDeadzone: ecs.f32,  // Deadzone for steering axis to prevent drift
    // Right stick camera control
    cameraRightStickSensitivity: ecs.f32,  // Right stick sensitivity for camera orbit
    cameraDeadzone: ecs.f32,  // Deadzone for camera axes to prevent drift
    // Boost meter UI
    boostMeterBar: ecs.eid,  // Entity ID for the boost meter UI bar
    maxBoost: ecs.f32,  // Maximum boost amount
    boostDepletionRate: ecs.f32,  // Boost units depleted per second
  },
  schemaDefaults: {
    speed: 10.0,
    rotationSpeed: 3.0,
    jumpPower: 5.0,
    drift: 0.85,
    verticalOffset: 0,
    waveInfluence: 0.15,
    waveTiltInfluence: 0.35,  // Moderate tilt with waves
    tiltSmoothing: 0.25,  // Smooth tilt transitions
    rearKickIntensity: 2.5,  // Moderate rear kick for realistic feel
    steeringTiltInfluence: 0.25,  // Moderate steering tilt (about 14 degrees max)
    // Starting position defaults
    startX: 0,
    startY: 0,
    startZ: 0,
    startAngle: 0,
    // Gamepad defaults
    gamepadEnabled: true,
    gamepadIndex: 0,  // Use first gamepad by default
    steeringSensitivity: 1.0,  // Full sensitivity for precise control
    steeringDeadzone: 0.1,  // 10% deadzone to prevent stick drift
    // Camera defaults
    cameraRightStickSensitivity: 1.0,  // Full sensitivity for camera control
    cameraDeadzone: 0.1,  // 10% deadzone for camera axes
    // Boost defaults
    maxBoost: 50,  // 50 boost units (5 seconds at 10 per second)
    boostDepletionRate: 10,  // 10 units per second
  },
  data: {
    // Movement
    currentAngle: ecs.f32,
    velocityX: ecs.f32,
    velocityZ: ecs.f32,

    // Rear kick physics
    lateralKickVelocityX: ecs.f32,  // Lateral velocity from rear kick
    lateralKickVelocityZ: ecs.f32,  // Lateral velocity from rear kick

    // Jump state
    jumpState: ecs.string,  // 'none', 'jumping', 'landing'
    jumpStartTime: ecs.f32,
    jumpStartY: ecs.f32,
    jumpTargetY: ecs.f32,  // Target wave height for landing
    jumpDuration: ecs.f32,  // Total jump duration

    // Input tracking
    jumpInputPressed: ecs.boolean,
    lastJumpTime: ecs.f32,

    // Boost tracking
    boostInputPressed: ecs.boolean,
    isBoostActive: ecs.boolean,
    originalParticlesPerShot: ecs.f32,  // Store original particles per shot value
    originalParticleResourceUrl: ecs.string,  // Store original particle resource URL
    currentBoost: ecs.f32,  // Current boost amount available

    // Camera FOV tracking
    targetFov: ecs.f32,  // Target FOV for lerping
    currentFov: ecs.f32,  // Current FOV for smooth transitions
    fovState: ecs.string,  // 'normal', 'boosting', 'boost_exit', 'ramping_down'
    boostExitStartTime: ecs.f32,  // Time when boost exit started for ramping

    // Wave tracking
    lastY: ecs.f32,  // Last frame's Y position for smoothing
    lastPitch: ecs.f32,  // Last frame's pitch for smoothing
    lastRoll: ecs.f32,  // Last frame's roll for smoothing
    steeringRoll: ecs.f32,  // Separate steering-based roll tilt
    landingTransitionFrames: ecs.i32,  // Frames since landing for smooth transition

    // Handle rotation
    currentHandleRotation: ecs.f32,  // Current Y-axis rotation of handles
    targetHandleRotation: ecs.f32,   // Target Y-axis rotation of handles

    // Gamepad input tracking
    gamepadConnected: ecs.boolean,  // Whether a gamepad is currently connected
    leftStickX: ecs.f32,  // Raw left stick X value (-1 to 1)
    processedSteerInput: ecs.f32,  // Processed steering input after deadzone and sensitivity
    // Right stick camera input tracking
    rightStickX: ecs.f32,  // Raw right stick X value (-1 to 1)
    rightStickY: ecs.f32,  // Raw right stick Y value (-1 to 1)
    processedCameraYawInput: ecs.f32,  // Processed camera yaw input after deadzone and sensitivity
    processedCameraPitchInput: ecs.f32,  // Processed camera pitch input after deadzone and sensitivity

    // State machine
    currentState: ecs.string,
    // Controls enabled/disabled state
    controlsEnabled: ecs.boolean,
  },
  stateMachine: ({world, eid, dataAttribute, schemaAttribute}) => {
    const schema = schemaAttribute.cursor(eid)

    const updateJetskiState = (newState) => {
      const currentData = dataAttribute.cursor(eid)
      currentData.currentState = newState
      console.log(`Jetski state: ${newState}`)

      if (schema.particleSystem) {
        ecs.ParticleEmitter.set(world, schema.particleSystem, {
          stopped: newState === 'idle',
        })
      }
    }

    ecs.defineState('idle').initial()
      .onEvent('start_moving', 'moving')
      .onEvent('jump', 'jumping')
      .onEnter(() => updateJetskiState('idle'))

    ecs.defineState('moving')
      .onEvent('stop_moving', 'idle')
      .onEvent('jump', 'jumping')
      .onEnter(() => updateJetskiState('moving'))

    ecs.defineState('jumping')
      .onEvent('land', 'idle')
      .onEvent('land_moving', 'moving')
      .onEnter(() => {
        updateJetskiState('jumping')
        const currentData = dataAttribute.cursor(eid)
        const pos = ecs.Position?.get?.(world, eid)

        if (pos) {
          // Calculate current wave height for smooth jump start
          const rippleHeight = 1
          const rippleFreq = 0.15
          const rippleSpeed = 0.001
          const rippleMod = 0
          const uTimeMs = world.time.elapsed * 0.8
          const t = uTimeMs * rippleSpeed

          const waveHeight = getWaveHeight(
            pos.x, pos.z, t,
            rippleHeight, rippleFreq, rippleSpeed, rippleMod
          ) + (schema.verticalOffset || 0)

          // Set jump parameters
          currentData.jumpState = 'jumping'
          currentData.jumpStartTime = world.time.elapsed
          currentData.jumpStartY = waveHeight  // Start from wave height for consistency
          currentData.jumpDuration = schema.jumpPower * 120  // 120ms per power unit
        }
      })
      .onExit(() => {
        const currentData = dataAttribute.cursor(eid)
        currentData.jumpState = 'none'
      })

    // Store initial position as starting position
    const initialPos = ecs.Position.get(world, eid)
    if (initialPos) {
      schema.startX = initialPos.x
      schema.startY = initialPos.y
      schema.startZ = initialPos.z
    }

    // Initialize data
    dataAttribute.set(eid, {
      currentAngle: schema.startAngle,
      velocityX: 0,
      velocityZ: 0,
      lateralKickVelocityX: 0,
      lateralKickVelocityZ: 0,
      jumpState: 'none',
      jumpStartTime: 0,
      jumpStartY: 0,
      jumpTargetY: 0,
      jumpDuration: 600,
      jumpInputPressed: false,
      lastJumpTime: 0,
      boostInputPressed: false,
      isBoostActive: false,
      originalParticlesPerShot: 0,
      originalParticleResourceUrl: '',
      currentBoost: schema.maxBoost,  // Start with full boost
      targetFov: 80,  // Default FOV
      currentFov: 80,  // Start at default FOV
      fovState: 'normal',
      boostExitStartTime: 0,
      lastY: 0,
      lastPitch: 0,
      lastRoll: 0,
      steeringRoll: 0,
      landingTransitionFrames: -1,
      currentHandleRotation: 0,
      targetHandleRotation: 0,
      gamepadConnected: false,
      leftStickX: 0,
      processedSteerInput: 0,
      rightStickX: 0,
      rightStickY: 0,
      processedCameraYawInput: 0,
      processedCameraPitchInput: 0,
      currentState: 'idle',
      controlsEnabled: false,  // Start with controls disabled
    })
    
    // Listen for control enable/disable events
    world.events.addListener(world.events.globalId, 'controls-disabled', () => {
      const currentData = dataAttribute.cursor(eid)
      currentData.controlsEnabled = false
      
      // Stop particle system when controls are disabled
      if (schema.particleSystem) {
        ecs.ParticleEmitter.set(world, schema.particleSystem, {
          stopped: true,
        })
      }
    })
    
    world.events.addListener(world.events.globalId, 'controls-enabled', () => {
      const currentData = dataAttribute.cursor(eid)
      currentData.controlsEnabled = true
      
      // Restart particle system when controls are enabled (unless idle)
      if (schema.particleSystem && currentData.currentState !== 'idle') {
        ecs.ParticleEmitter.set(world, schema.particleSystem, {
          stopped: false,
        })
      }
    })
    
    // Listen for game restart event
    world.events.addListener(world.events.globalId, 'game-restart', () => {
      const currentData = dataAttribute.cursor(eid)
      
      // Reset position to starting position
      world.setPosition(eid, schema.startX, schema.startY, schema.startZ)
      
      // Reset angle and rotation
      currentData.currentAngle = schema.startAngle
      const headingQuat = quatFromYRotation(schema.startAngle)
      world.setQuaternion(eid, headingQuat[0], headingQuat[1], headingQuat[2], headingQuat[3])
      
      // Reset all velocities
      currentData.velocityX = 0
      currentData.velocityZ = 0
      currentData.lateralKickVelocityX = 0
      currentData.lateralKickVelocityZ = 0
      
      // Reset jump state
      currentData.jumpState = 'none'
      currentData.jumpInputPressed = false
      
      // Reset boost state
      currentData.isBoostActive = false
      currentData.boostInputPressed = false
      currentData.currentBoost = schema.maxBoost  // Restore full boost on reset
      if (schema.particleSystem && currentData.originalParticlesPerShot > 0) {
        ecs.ParticleEmitter.set(world, schema.particleSystem, {
          particlesPerShot: currentData.originalParticlesPerShot,
          resourceUrl: currentData.originalParticleResourceUrl
        })
      }
      
      // Reset boost meter UI
      if (schema.boostMeterBar) {
        ecs.Ui.mutate(world, schema.boostMeterBar, (cursor) => {
          cursor.width = '500'
          cursor.background = '#00ff00'  // Full boost is green
          return false
        })
      }
      
      // Reset camera FOV
      currentData.targetFov = 80
      currentData.currentFov = 80
      currentData.fovState = 'normal'
      if (schema.camera) {
        ecs.Camera.set(world, schema.camera, {
          fov: 80
        })
      }
      
      // Reset tilt states
      currentData.lastPitch = 0
      currentData.lastRoll = 0
      currentData.steeringRoll = 0
      currentData.landingTransitionFrames = -1
      
      // Reset handle rotation
      currentData.currentHandleRotation = 0
      currentData.targetHandleRotation = 0
      if (schema.jetskiHandles) {
        world.setQuaternion(schema.jetskiHandles, 0, 0, 0, 1)
      }
      
      // Disable controls (they'll be re-enabled by countdown timer)
      currentData.controlsEnabled = false
      
    })
    
    // Listen for checkpoint-advanced event to refill boost
    world.events.addListener(world.events.globalId, 'checkpoint-advanced', () => {
      const currentData = dataAttribute.cursor(eid)
      
      // Add 20% of max boost
      const boostRefill = schema.maxBoost * 0.2
      currentData.currentBoost = Math.min(currentData.currentBoost + boostRefill, schema.maxBoost)
      
    })
  },
  tick: (world, component) => {
    const {eid, data} = component
    const schema = jetskiController.get(world, eid)
    const delta = world.time.delta / 1000

    const pos = ecs.Position?.get?.(world, eid)
    if (!pos) return

    let {x, y, z} = pos

    // Store last Y for smoothing
    if (data.lastY === 0) {
      data.lastY = y
    }

    // Calculate current wave height
    const rippleHeight = 1
    const rippleFreq = 0.15
    const rippleSpeed = 0.001
    const rippleMod = 0
    const uTimeMs = world.time.elapsed * 0.8
    const t = uTimeMs * rippleSpeed

    const currentWaveHeight = getWaveHeight(
      x, z, t,
      rippleHeight, rippleFreq, rippleSpeed, rippleMod
    ) + schema.verticalOffset

    // Calculate wave slopes for tilt (pitch and roll)
    let targetPitch = 0
    let targetRoll = 0

    // Only calculate tilt when not jumping
    const isJumping = data.jumpState === 'jumping' || data.jumpState === 'landing'

    // Process gamepad input if enabled
    if (schema.gamepadEnabled) {
      const connectedGamepads = world.input.getGamepads()
      data.gamepadConnected = connectedGamepads.length > schema.gamepadIndex

      if (data.gamepadConnected) {
        // Get axis values - standard gamepad layout: [leftX, leftY, rightX, rightY, ...]
        const axisValues = world.input.getAxis(schema.gamepadIndex)
        
        if (axisValues && axisValues.length >= 4) {
          // Left stick: axis 0 = X (steering only)
          data.leftStickX = axisValues[0] || 0
          
          // Right stick: axis 2 = X (camera yaw), axis 3 = Y (camera pitch)
          data.rightStickX = axisValues[2] || 0
          data.rightStickY = axisValues[3] || 0

          // Apply deadzone to prevent stick drift
          const applyDeadzone = (value: number, deadzone: number) => {
            if (Math.abs(value) < deadzone) return 0
            // Scale the remaining range from deadzone to 1.0 back to 0.0 to 1.0
            const sign = Math.sign(value)
            const scaledValue = (Math.abs(value) - deadzone) / (1.0 - deadzone)
            return sign * Math.min(scaledValue, 1.0)
          }

          // Process steering (left stick X-axis) with deadzone and sensitivity
          const steerRaw = applyDeadzone(data.leftStickX, schema.steeringDeadzone)
          data.processedSteerInput = steerRaw * schema.steeringSensitivity

          // Process camera input (right stick) with deadzone and sensitivity
          const cameraYawRaw = applyDeadzone(data.rightStickX, schema.cameraDeadzone)
          const cameraPitchRaw = applyDeadzone(data.rightStickY, schema.cameraDeadzone)
          data.processedCameraYawInput = cameraYawRaw * schema.cameraRightStickSensitivity
          data.processedCameraPitchInput = cameraPitchRaw * schema.cameraRightStickSensitivity
        }
      }
    } else {
      // Reset gamepad values when disabled
      data.gamepadConnected = false
      data.leftStickX = 0
      data.processedSteerInput = 0
      data.rightStickX = 0
      data.rightStickY = 0
      data.processedCameraYawInput = 0
      data.processedCameraPitchInput = 0
    }

    // Get input states early for steering tilt calculation
    const movingForward = world.input.getAction('forward')
    const movingBackward = world.input.getAction('backward')
    const turningLeft = world.input.getAction('left')
    const turningRight = world.input.getAction('right')
    
    // Combine keyboard and gamepad input for steering only
    const hasForwardInput = movingForward
    const hasBackwardInput = movingBackward
    const hasLeftInput = turningLeft || data.processedSteerInput < -0.1
    const hasRightInput = turningRight || data.processedSteerInput > 0.1

    if (!isJumping) {
      // Estimate surface normal via central differences for wave-based tilt
      const eps = 0.05  // Sample distance for gradient
      const y_dx =
        getWaveHeight(x + eps, z, t, rippleHeight, rippleFreq, rippleSpeed, rippleMod) -
        getWaveHeight(x - eps, z, t, rippleHeight, rippleFreq, rippleSpeed, rippleMod)
      const y_dz =
        getWaveHeight(x, z + eps, t, rippleHeight, rippleFreq, rippleSpeed, rippleMod) -
        getWaveHeight(x, z - eps, t, rippleHeight, rippleFreq, rippleSpeed, rippleMod)

      // Calculate pitch and roll from wave slopes
      // Pitch: rotation around X axis (forward/backward tilt)
      // Roll: rotation around Z axis (left/right tilt)
      targetPitch = (-y_dz / (2 * eps)) * schema.waveTiltInfluence
      targetRoll = (-y_dx / (2 * eps)) * schema.waveTiltInfluence

      // Clamp wave-based tilt to reasonable angles (about 20 degrees max)
      const maxTilt = 0.35
      targetPitch = Math.max(-maxTilt, Math.min(maxTilt, targetPitch))
      targetRoll = Math.max(-maxTilt, Math.min(maxTilt, targetRoll))
    }

    // Calculate steering tilt separately from wave tilt
    let targetSteeringRoll = 0
    if (!isJumping) {
      const currentSpeed = Math.sqrt(data.velocityX * data.velocityX + data.velocityZ * data.velocityZ)
      const isMoving = hasForwardInput || hasBackwardInput
      const effectiveSpeed = data.isBoostActive ? schema.speed * 2 : schema.speed
      
      if (isMoving && currentSpeed > 1) { // Only tilt when actually moving with some speed
        const speedFactor = Math.min(currentSpeed / effectiveSpeed, 1.0) // Normalize speed (0-1)
        // Reduce steering tilt during boost for more stable high-speed handling
        const boostTiltReduction = data.isBoostActive ? 0.3 : 1.0 // 30% tilt during boost
        
        if (hasLeftInput) {
          // For gamepad, use the actual stick input for proportional tilt
          const steerIntensity = data.gamepadConnected ? Math.abs(data.processedSteerInput) : 1.0
          targetSteeringRoll = -schema.steeringTiltInfluence * speedFactor * boostTiltReduction * steerIntensity // Tilt left (negative roll)
        } else if (hasRightInput) {
          // For gamepad, use the actual stick input for proportional tilt
          const steerIntensity = data.gamepadConnected ? Math.abs(data.processedSteerInput) : 1.0
          targetSteeringRoll = schema.steeringTiltInfluence * speedFactor * boostTiltReduction * steerIntensity // Tilt right (positive roll)
        }
      }
    }

    // Smooth the pitch and roll transitions (wave tilt only)
    const tiltSmooth = Math.max(0, Math.min(1, schema.tiltSmoothing))
    data.lastPitch += (targetPitch - data.lastPitch) * tiltSmooth
    data.lastRoll += (targetRoll - data.lastRoll) * tiltSmooth

    // Smooth steering tilt separately with faster response
    const steeringTiltSmooth = 0.15  // Faster response for steering tilt
    data.steeringRoll += (targetSteeringRoll - data.steeringRoll) * steeringTiltSmooth

    // Handle Y position based on jump state
    if (data.jumpState === 'jumping' || data.jumpState === 'landing') {
      const jumpElapsed = world.time.elapsed - data.jumpStartTime
      // Add extra time for landing transition to prevent sudden drops
      const totalDuration = data.jumpDuration * 1.2  // 20% extra for smooth landing
      const rawProgress = jumpElapsed / data.jumpDuration
      const extendedProgress = jumpElapsed / totalDuration

      if (rawProgress <= 1) {
        // During main jump - use smooth arc
        const jumpHeight = schema.jumpPower * 0.4

        // Use the jump arc directly - it already has soft landing built in
        const finalCurve = jumpArc(Math.min(1, rawProgress))

        // Calculate Y position
        y = data.jumpStartY + (jumpHeight * finalCurve)

        // Prepare for landing when near the end
        if (rawProgress > 0.8 && data.jumpState === 'jumping') {
          data.jumpState = 'landing'
          data.jumpTargetY = currentWaveHeight
          data.landingTransitionFrames = 0  // Start landing transition
        }
      } else if (extendedProgress < 1) {
        // Extra smooth transition to wave height after jump completes
        const transitionProgress = (rawProgress - 1) / 0.2  // Map overflow to 0-1
        const smoothTransition = easeInOutSine(Math.min(1, transitionProgress))

        // Blend from jump end position (which is jumpStartY) to current wave height
        y = data.jumpStartY + (currentWaveHeight - data.jumpStartY) * smoothTransition
        data.landingTransitionFrames++
      } else {
        // Fully landed - follow waves
        data.jumpState = 'none'
        y = currentWaveHeight

        // Trigger landing event
        const isMoving = hasForwardInput || hasBackwardInput
        world.events.dispatch(eid, isMoving ? 'land_moving' : 'land')
      }
    } else {
      // Handle landing transition for extra smooth wave following after landing
      const maxLandingFrames = 15  // About 0.25 seconds at 60fps
      const inLandingTransition = data.landingTransitionFrames >= 0 && data.landingTransitionFrames < maxLandingFrames

      if (inLandingTransition) {
        data.landingTransitionFrames++
        // More aggressive smoothing during landing transition
        const transitionProgress = Math.min(data.landingTransitionFrames / maxLandingFrames, 1.0)
        const landingSmoothing = 0.25 + (transitionProgress * 0.25)  // Start at 25%, end at 50%
        y = data.lastY + (currentWaveHeight - data.lastY) * landingSmoothing

        if (data.landingTransitionFrames >= maxLandingFrames) {
          data.landingTransitionFrames = -1  // Reset transition state
        }
      } else {
        // Normal wave following with smoothing
        const waveSmoothing = schema.waveInfluence
        y = data.lastY + (currentWaveHeight - data.lastY) * waveSmoothing
      }
    }

    // Store current Y for next frame smoothing
    data.lastY = y

    // Check if we're jumping - controls are limited during jump
    const isJumpingNow = data.jumpState !== 'none'

    // Handle movement input
    let targetVelocityX = 0
    let targetVelocityZ = 0
    let rotation = 0
    
    // Handle boost input (only if controls are enabled and moving forward)
    const boostPressed = data.controlsEnabled ? world.input.getAction('boost') : false
    const boostInputEdge = boostPressed && !data.boostInputPressed
    const boostReleaseEdge = !boostPressed && data.boostInputPressed
    data.boostInputPressed = !!boostPressed
    
    // Activate boost (only when moving forward and boost is available)
    if (boostInputEdge && !data.isBoostActive && data.controlsEnabled && hasForwardInput && data.currentBoost > 0) {
      data.isBoostActive = true
      
      // Store original particle system values if particle system exists
      if (schema.particleSystem) {
        const particleEmitter = ecs.ParticleEmitter.get(world, schema.particleSystem)
        if (particleEmitter) {
          data.originalParticlesPerShot = particleEmitter.particlesPerShot || 40
          data.originalParticleResourceUrl = particleEmitter.resourceUrl || 'src/assets/particle-mesh.glb'
          
          // Set boost particle values
          ecs.ParticleEmitter.set(world, schema.particleSystem, {
            particlesPerShot: 80,  // Double from 40 to 80
            resourceUrl: 'src/assets/particle-mesh-boost.glb'
          })
        }
      }
      
      // Set camera FOV for boost
      data.targetFov = 140
      data.fovState = 'boosting'
      
      // Dispatch boost activation event for other components (vignette, water effects, etc.)
      world.events.dispatch(world.events.globalId, 'boost-activated')
    }
    
    // Deactivate boost (can deactivate even if controls disabled, to clean up state)
    // Also deactivate if not moving forward anymore or boost depleted
    if ((boostReleaseEdge || !data.controlsEnabled || !hasForwardInput || data.currentBoost <= 0) && data.isBoostActive) {
      data.isBoostActive = false
      
      // Restore original particle system values if particle system exists
      if (schema.particleSystem && data.originalParticlesPerShot > 0) {
        ecs.ParticleEmitter.set(world, schema.particleSystem, {
          particlesPerShot: data.originalParticlesPerShot,
          resourceUrl: data.originalParticleResourceUrl
        })
      }
      
      // Set camera FOV for boost exit (quick jump to 90, then ramp down)
      data.targetFov = 90
      data.fovState = 'boost_exit'
      data.boostExitStartTime = world.time.elapsed
      
      // Dispatch boost deactivation event for other components (vignette, water effects, etc.)
      world.events.dispatch(world.events.globalId, 'boost-deactivated')
    }
    
    // Deplete boost while active
    if (data.isBoostActive && data.currentBoost > 0) {
      data.currentBoost -= schema.boostDepletionRate * delta
      
      // Clamp to 0 to prevent negative boost
      if (data.currentBoost < 0) {
        data.currentBoost = 0
      }
    }
    
    // Update boost meter UI
    if (schema.boostMeterBar) {
      // Calculate normalized boost level (0-1)
      const boostLevel = Math.max(0, Math.min(1, data.currentBoost / schema.maxBoost))
      
      // Map boost level to width range [10, 500]
      const minWidth = 10
      const maxWidth = 500
      const barWidth = minWidth + (maxWidth - minWidth) * boostLevel
      
      // Calculate color based on boost level (green -> yellow -> orange -> red)
      const getColorFromBoost = (level: number) => {
        const colorStops = [
          { r: 255, g: 0, b: 0 },     // Red (empty)
          { r: 255, g: 165, b: 0 },   // Orange
          { r: 255, g: 255, b: 0 },   // Yellow
          { r: 0, g: 255, b: 0 },     // Green (full)
        ]

        const t = Math.max(0, Math.min(1, level))
        const segmentIndex = Math.floor(t * 3)
        const segmentT = (t - segmentIndex / 3) * 3
        const fromColor = colorStops[segmentIndex]
        const toColor = colorStops[Math.min(segmentIndex + 1, colorStops.length - 1)]

        const r = fromColor.r + (toColor.r - fromColor.r) * segmentT
        const g = fromColor.g + (toColor.g - fromColor.g) * segmentT
        const b = fromColor.b + (toColor.b - fromColor.b) * segmentT

        const toHex = (c: number) => Math.round(c).toString(16).padStart(2, '0')
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`
      }
      
      const barColor = getColorFromBoost(boostLevel)
      
      ecs.Ui.mutate(world, schema.boostMeterBar, (cursor) => {
        cursor.width = `${barWidth}`
        cursor.background = barColor
        return false
      })
    }
    
    // Calculate effective speed (double if boost is active)
    const effectiveSpeed = data.isBoostActive ? schema.speed * 2 : schema.speed
    
    // Calculate effective rotation speed (reduced when boosting for less maneuverability)
    const effectiveRotationSpeed = data.isBoostActive ? 0.5 : schema.rotationSpeed

    if (!isJumpingNow && data.controlsEnabled) {
      // Only allow control when not jumping and controls are enabled
      if (hasForwardInput || hasBackwardInput) {
        const moveDirection = hasForwardInput ? 1 : -1
        
        // Calculate current speed for rear kick physics
        const currentSpeed = Math.sqrt(data.velocityX * data.velocityX + data.velocityZ * data.velocityZ)

        // Handle steering with granular control
        if (hasLeftInput) {
          // For gamepad, use the actual stick input for precise steering
          const steerIntensity = data.gamepadConnected ? Math.abs(data.processedSteerInput) : 1.0
          rotation = effectiveRotationSpeed * delta * steerIntensity
          
          // Apply rear kick physics - rear slides right when turning left
          const kickIntensity = schema.rearKickIntensity * (currentSpeed / effectiveSpeed) * delta * steerIntensity
          const kickDirectionX = Math.cos(data.currentAngle)  // Right perpendicular to forward
          const kickDirectionZ = -Math.sin(data.currentAngle)
          data.lateralKickVelocityX += kickDirectionX * kickIntensity
          data.lateralKickVelocityZ += kickDirectionZ * kickIntensity
          
        } else if (hasRightInput) {
          // For gamepad, use the actual stick input for precise steering
          const steerIntensity = data.gamepadConnected ? Math.abs(data.processedSteerInput) : 1.0
          rotation = -effectiveRotationSpeed * delta * steerIntensity
          
          // Apply rear kick physics - rear slides left when turning right
          const kickIntensity = schema.rearKickIntensity * (currentSpeed / effectiveSpeed) * delta * steerIntensity
          const kickDirectionX = -Math.cos(data.currentAngle)  // Left perpendicular to forward
          const kickDirectionZ = Math.sin(data.currentAngle)
          data.lateralKickVelocityX += kickDirectionX * kickIntensity
          data.lateralKickVelocityZ += kickDirectionZ * kickIntensity
        }

        data.currentAngle += rotation

        targetVelocityX = Math.sin(data.currentAngle) * effectiveSpeed * moveDirection
        targetVelocityZ = Math.cos(data.currentAngle) * effectiveSpeed * moveDirection

        world.events.dispatch(eid, 'start_moving')
      } else {
        world.events.dispatch(eid, 'stop_moving')
      }

      // Apply drift/momentum only when not jumping
      if (targetVelocityX === 0 && targetVelocityZ === 0) {
        const driftFactor = Math.pow(schema.drift, delta)
        data.velocityX *= driftFactor
        data.velocityZ *= driftFactor

        if (Math.abs(data.velocityX) < 0.1) data.velocityX = 0
        if (Math.abs(data.velocityZ) < 0.1) data.velocityZ = 0
      } else {
        const acceleration = 10.0
        data.velocityX += (targetVelocityX - data.velocityX) * Math.min(1, acceleration * delta)
        data.velocityZ += (targetVelocityZ - data.velocityZ) * Math.min(1, acceleration * delta)
      }

      // Apply lateral kick decay (rear kick naturally dampens over time)
      const lateralDamping = 0.92  // Kick decays quickly for realistic feel
      data.lateralKickVelocityX *= Math.pow(lateralDamping, delta)
      data.lateralKickVelocityZ *= Math.pow(lateralDamping, delta)

      // Stop very small kick velocities to avoid jitter
      if (Math.abs(data.lateralKickVelocityX) < 0.05) data.lateralKickVelocityX = 0
      if (Math.abs(data.lateralKickVelocityZ) < 0.05) data.lateralKickVelocityZ = 0
    } else if (!data.controlsEnabled) {
      // When controls are disabled (game over), gradually slow down to a stop
      const decelerationFactor = 0.95  // Gradual deceleration
      data.velocityX *= Math.pow(decelerationFactor, delta * 60)  // Normalize for frame rate
      data.velocityZ *= Math.pow(decelerationFactor, delta * 60)
      data.lateralKickVelocityX *= Math.pow(decelerationFactor, delta * 60)
      data.lateralKickVelocityZ *= Math.pow(decelerationFactor, delta * 60)
      
      // Stop very small velocities to avoid jitter
      if (Math.abs(data.velocityX) < 0.1) data.velocityX = 0
      if (Math.abs(data.velocityZ) < 0.1) data.velocityZ = 0
      if (Math.abs(data.lateralKickVelocityX) < 0.05) data.lateralKickVelocityX = 0
      if (Math.abs(data.lateralKickVelocityZ) < 0.05) data.lateralKickVelocityZ = 0
    }

    // Handle jetski handles rotation based on steering input
    // Set target rotation: -40 degrees (right), +40 degrees (left), 0 (neutral)
    const maxHandleRotation = Math.PI * 40 / 180  // Convert 40 degrees to radians
    
    if (hasLeftInput) {
      const steerIntensity = data.gamepadConnected ? Math.abs(data.processedSteerInput) : 1.0
      data.targetHandleRotation = maxHandleRotation * steerIntensity  // Proportional rotation for gamepad
    } else if (hasRightInput) {
      const steerIntensity = data.gamepadConnected ? Math.abs(data.processedSteerInput) : 1.0
      data.targetHandleRotation = -maxHandleRotation * steerIntensity  // Proportional rotation for gamepad
    } else {
      data.targetHandleRotation = 0  // Neutral position
    }

    // Smooth interpolation to target rotation (quick and smooth)
    const handleRotationSpeed = 8.0  // Adjust for desired responsiveness
    const rotationDiff = data.targetHandleRotation - data.currentHandleRotation
    data.currentHandleRotation += rotationDiff * Math.min(1, handleRotationSpeed * delta)

    // Apply rotation to jetski handles if they exist
    if (schema.jetskiHandles) {
      const handleRotationQuat = quatFromYRotation(data.currentHandleRotation)
      world.setQuaternion(
        schema.jetskiHandles,
        handleRotationQuat[0],
        handleRotationQuat[1],
        handleRotationQuat[2],
        handleRotationQuat[3]
      )
    }
    // When jumping, maintain constant velocity (no acceleration/deceleration/turning)

    // Apply movement (combine primary velocity with lateral kick)
    x += (data.velocityX + data.lateralKickVelocityX) * delta
    z += (data.velocityZ + data.lateralKickVelocityZ) * delta

    // Update position
    world.setPosition(eid, x, y, z)

    // Build final rotation with proper local space steering roll
    const headingQuat = quatFromYRotation(data.currentAngle)
    // Apply wave tilt (pitch + wave roll only)
    const waveTiltQuat = quatFromPitchRoll(data.lastPitch, data.lastRoll)
    // Apply pure steering roll as local Z-axis rotation (before heading)
    const steeringRollQuat = quatFromZRotation(data.steeringRoll)

    // Compose: steering roll → wave tilt → heading (steering roll in local space)
    let finalQuat = quatMultiply(waveTiltQuat, steeringRollQuat)
    finalQuat = quatMultiply(headingQuat, finalQuat)
    world.setQuaternion(eid, finalQuat[0], finalQuat[1], finalQuat[2], finalQuat[3])

    // Handle jump input (only if controls are enabled)
    if (data.controlsEnabled) {
      const jumpPressed = world.input.getAction('jump')
      const jumpInputEdge = jumpPressed && !data.jumpInputPressed
      data.jumpInputPressed = !!jumpPressed

      const currentTime = world.time.elapsed
      const timeSinceLastJump = currentTime - data.lastJumpTime

      if (jumpInputEdge && data.jumpState === 'none' && timeSinceLastJump > 100) {
        data.lastJumpTime = currentTime
        world.events.dispatch(eid, 'jump')
      }
    }

    // Handle camera FOV transitions
    if (schema.camera) {
      const fovLerpSpeed = 3.0  // Adjust for desired FOV transition speed
      let shouldUpdateFov = false

      if (data.fovState === 'boosting') {
        // Lerp to boost FOV (65)
        data.currentFov += (data.targetFov - data.currentFov) * Math.min(1, fovLerpSpeed * delta)
        shouldUpdateFov = true
      } else if (data.fovState === 'boost_exit') {
        // Quick lerp to 90 FOV
        data.currentFov += (data.targetFov - data.currentFov) * Math.min(1, fovLerpSpeed * 2 * delta)  // Faster transition
        shouldUpdateFov = true
        
        // Check if we've reached 90 FOV (within small tolerance)
        if (Math.abs(data.currentFov - 90) < 1) {
          data.fovState = 'ramping_down'
          data.targetFov = 80  // Start ramping down to default
        }
      } else if (data.fovState === 'ramping_down') {
        // Slow ramp down to default FOV (80)
        const rampDownSpeed = 0.5  // Much slower ramp down
        data.currentFov += (data.targetFov - data.currentFov) * Math.min(1, rampDownSpeed * delta)
        shouldUpdateFov = true
        
        // Check if we've reached default FOV
        if (Math.abs(data.currentFov - 80) < 0.5) {
          data.fovState = 'normal'
          data.currentFov = 80  // Snap to exact value
        }
      }

      // Apply FOV to camera if it changed
      if (shouldUpdateFov) {
        ecs.Camera.set(world, schema.camera, {
          fov: data.currentFov
        })
      }
    }

    // Update audio pitch based on speed
    // Calculate current speed magnitude
    const currentSpeed = Math.sqrt(data.velocityX * data.velocityX + data.velocityZ * data.velocityZ)
    
    // Normalize speed (0-1) based on effective speed
    const normalizedSpeed = Math.min(currentSpeed / effectiveSpeed, 1.0)
    
    // Lerp pitch from 0.5 (idle) to 3.0 (full speed) or 5.0 (boosting)
    const minAudioPitch = 0.5
    const maxAudioPitch = data.isBoostActive ? 3.0 : 1.0
    const targetAudioPitch = minAudioPitch + (maxAudioPitch - minAudioPitch) * normalizedSpeed
    
    // Set audio pitch
    ecs.Audio.set(world, component.eid, {
      pitch: targetAudioPitch,
    })
  },
})

export {jetskiController}
