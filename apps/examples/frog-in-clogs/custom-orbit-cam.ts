import * as ecs from '@8thwall/ecs'
import { jetskiController } from './jetski-controller'

const degreesToRadians = (degrees: number): number => degrees * (Math.PI / 180)

const INERTIA_TIMER = 200
const MOVING_TIMER = 30
const MAX_SPEED_FACTOR = 0.01

const capSpeed = (speed: number, maxSpeed: number) => Math.sign(speed) *
  Math.min(Math.abs(speed), maxSpeed * MAX_SPEED_FACTOR)

const UP_VECTOR = ecs.math.vec3.from({x: 0, y: 1, z: 0})
const tempCameraPos = ecs.math.vec3.zero()
const tempPivotPoint = ecs.math.vec3.zero()
const tempMatrix = ecs.math.mat4.i()
const tempCameraRotation = ecs.math.quat.zero()
const tempFocusDirection = ecs.math.vec3.zero()

ecs.registerComponent({
  name: 'custom-orbit-cam',
  schema: {
    speed: ecs.f32,
    maxAngularSpeed: ecs.f32,
    maxZoomSpeed: ecs.f32,
    distanceMin: ecs.f32,
    distanceMax: ecs.f32,
    pitchAngleMin: ecs.f32,
    pitchAngleMax: ecs.f32,
    constrainYaw: ecs.boolean,
    // @condition constrainYaw=true
    yawAngleMin: ecs.f32,
    // @condition constrainYaw=true
    yawAngleMax: ecs.f32,
    inertiaFactor: ecs.f32,
    focusEntity: ecs.eid,
    invertedX: ecs.boolean,
    invertedY: ecs.boolean,
    invertedZoom: ecs.boolean,
    controllerSupport: ecs.boolean,
    // @condition controllerSupport=true
    horizontalSensitivity: ecs.f32,
    // @condition controllerSupport=true
    verticalSensitivity: ecs.f32,
    // Gamepad right stick support
    gamepadCameraSupport: ecs.boolean,  // Enable right stick camera control
    gamepadIndex: ecs.i32,              // Which gamepad to use (0-3)
    cameraRightStickSensitivity: ecs.f32, // Right stick sensitivity for camera orbit
    cameraDeadzone: ecs.f32,            // Deadzone for camera axes to prevent drift
    startYaw: ecs.f32,              // degrees
    startPitch: ecs.f32,            // degrees
    startDistance: ecs.f32,         // units
    orientWithEntity: ecs.boolean,  // NEW: Orient camera with entity facing direction
    // @condition orientWithEntity=true
    laziness: ecs.f32,  // 0 = rigid follow, 1 = very lazy/slow response
    enableTilt: ecs.boolean,        // Enable z-axis tilt when steering while moving
    // @condition enableTilt=true
    maxTiltAngle: ecs.f32,          // Maximum tilt angle in degrees
    // @condition enableTilt=true
    tiltSpeed: ecs.f32,             // How fast the camera tilts (0-1, higher = faster)
    specialIndicatorEntity: ecs.eid,  // Reference to the special indicator entity (frog)
  },
  schemaDefaults: {
    speed: 5,
    maxAngularSpeed: 10,
    maxZoomSpeed: 10,
    distanceMin: 5,
    distanceMax: 20,
    pitchAngleMin: -90,
    pitchAngleMax: 90,
    constrainYaw: false,
    yawAngleMin: -180,
    yawAngleMax: 180,
    inertiaFactor: 0.3,
    horizontalSensitivity: 1,
    verticalSensitivity: 1,
    gamepadCameraSupport: true,  // Enable gamepad camera control by default
    gamepadIndex: 0,             // Use first gamepad by default
    cameraRightStickSensitivity: 0.015, // Ultra low sensitivity - applied per frame at 60fps
    cameraDeadzone: 0.1,         // 10% deadzone for camera axes
    startYaw: 180,            // Start behind the jetski (180 degrees)
    startPitch: 0,            // default flat/horizontal
    startDistance: 10,        // default camera distance
    orientWithEntity: false,  // Disable to prevent snapping during manual control
    laziness: 0.0,            // Default to rigid following
    enableTilt: true,         // Enable tilt by default
    maxTiltAngle: 15.0,       // 15 degrees maximum tilt
    tiltSpeed: 0.8,           // Fast tilt speed for responsive feel
  },
  data: {
    pitch: ecs.f32,
    yaw: ecs.f32,
    distance: ecs.f32,
    dx: ecs.f32,
    dy: ecs.f32,
    delta: ecs.f32,
    moving: ecs.f32,
    inertia: ecs.f32,
    minPitch: ecs.f32,
    maxPitch: ecs.f32,
    curPitch: ecs.f32,
    constrainYaw: ecs.boolean,
    minYaw: ecs.f32,
    maxYaw: ecs.f32,
    curYaw: ecs.f32,
    curDistance: ecs.f32,
    isDragging: ecs.boolean,
    // Gamepad input tracking
    gamepadConnected: ecs.boolean,  // Whether a gamepad is currently connected
    rightStickX: ecs.f32,           // Raw right stick X value (-1 to 1)
    rightStickY: ecs.f32,           // Raw right stick Y value (-1 to 1)
    processedCameraYawInput: ecs.f32,   // Processed camera yaw input after deadzone and sensitivity
    processedCameraPitchInput: ecs.f32, // Processed camera pitch input after deadzone and sensitivity
    // Tilt tracking
    currentTilt: ecs.f32,     // Current z-axis tilt angle in radians
    targetTilt: ecs.f32,      // Target z-axis tilt angle in radians
    isMoving: ecs.boolean,    // Is jetski currently moving
    isSteering: ecs.boolean,  // Is jetski currently steering
    // Boost pitch tracking
    isBoostActive: ecs.boolean,     // Is jetski currently boosting
    basePitch: ecs.f32,             // Base pitch value (30 degrees in radians)
    boostPitch: ecs.f32,            // Boost pitch value (5 degrees in radians)
    pitchTransitionSpeed: ecs.f32,  // Speed of pitch transitions
    // Boost distance tracking
    effectiveStartDistance: ecs.f32, // Effective start distance (changes during boost)
    baseStartDistance: ecs.f32,      // Base start distance (10)
    boostStartDistance: ecs.f32,     // Boost start distance (2)
    // Special indicator tracking
    isSpecialIndicatorActive: ecs.boolean,  // Whether special indicator mode is active
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    if (!dataAttribute) {
      return
    }

    type DataCursor = ReturnType<typeof dataAttribute.cursor>

    let didLockPointer = false

    const getFocusEntityForwardDirection = (focusEntity: ecs.Eid): number => {
      if (!focusEntity) return 0

      // Get the entity's quaternion directly
      const quaternion = ecs.Quaternion.get(world, focusEntity)
      if (!quaternion) return 0

      // Convert quaternion to yaw angle
      // For Y-axis rotation: yaw = atan2(2*(qw*qy + qx*qz), 1 - 2*(qy*qy + qz*qz))
      const {x, y, z, w} = quaternion
      return Math.atan2(2 * (w * y + x * z), 1 - 2 * (y * y + z * z))
    }

    const getEntityRelativeYaw = (focusEntity: ecs.Eid, startYaw: number): number => {
      if (!focusEntity) return degreesToRadians(startYaw)

      // Get the entity's current Y rotation (yaw) in world space
      const entityYaw = getFocusEntityForwardDirection(focusEntity)

      // Position camera relative to entity's forward direction
      // startYaw of 0 = behind entity, 180 = in front of entity
      // We subtract startYaw because positive rotation should move clockwise from behind
      return entityYaw + Math.PI - degreesToRadians(startYaw)
    }

    const setCameraPosition = (focusEntity: ecs.Eid, data: DataCursor) => {
      if (focusEntity) {
        world.transform.getWorldPosition(focusEntity, tempPivotPoint)
      } else {
        tempPivotPoint.setXyz(0, 0, 0)
      }

      data.curPitch = data.pitch
      data.curYaw = data.yaw
      data.curDistance = data.distance

      const sinPitch = Math.sin(data.pitch)
      const cosPitch = Math.cos(data.pitch)
      const sinYaw = Math.sin(data.yaw)
      const cosYaw = Math.cos(data.yaw)

      // Position camera behind and above the focus entity
      tempCameraPos.setXyz(
        tempPivotPoint.x + data.distance * cosPitch * sinYaw,  // X offset
        tempPivotPoint.y + data.distance * sinPitch,           // Y offset (height)
        tempPivotPoint.z + data.distance * cosPitch * cosYaw   // Z offset
      )

      // Make camera look at the focus entity
      tempMatrix.makeT(tempCameraPos)
      tempMatrix.setLookAt(tempPivotPoint, UP_VECTOR)
      tempMatrix.decomposeR(tempCameraRotation)

      ecs.Position.set(world, eid, tempCameraPos)
      
      // Apply z-axis tilt if enabled
      const { enableTilt } = schemaAttribute.get(eid)
      if (enableTilt && data.currentTilt !== 0) {
        // Create a z-axis rotation quaternion manually
        const half = data.currentTilt / 2
        const tiltQuat = [0, 0, Math.sin(half), Math.cos(half)] // [x, y, z, w]
        
        // Extract the current rotation as array
        const currentQuat = [tempCameraRotation.x, tempCameraRotation.y, tempCameraRotation.z, tempCameraRotation.w]
        
        // Multiply quaternions manually: currentQuat * tiltQuat
        const [ax, ay, az, aw] = currentQuat
        const [bx, by, bz, bw] = tiltQuat
        const finalQuat = [
          aw * bx + ax * bw + ay * bz - az * by,
          aw * by - ax * bz + ay * bw + az * bx,
          aw * bz + ax * by - ay * bx + az * bw,
          aw * bw - ax * bx - ay * by - az * bz,
        ]
        
        world.setQuaternion(eid, finalQuat[0], finalQuat[1], finalQuat[2], finalQuat[3])
      } else {
        ecs.Quaternion.set(world, eid, tempCameraRotation)
      }
    }

    const updateDistance = (data: DataCursor, distanceMin: number, distanceMax: number) => {
      const newDistance = data.distance + data.delta
      const distanceClamped = Math.min(Math.max(newDistance, distanceMin), distanceMax)
      data.distance = distanceClamped
    }

    const handleOrientWithEntity = (data: DataCursor, focusEntity: ecs.Eid, orientWithEntity: boolean, startYaw: number, startPitch: number, startDistance: number, laziness: number) => {
      if (!orientWithEntity || !focusEntity) return

      let targetYaw: number
      
      // If special indicator is active, calculate yaw to face the frog instead of using entity's forward direction
      if (data.isSpecialIndicatorActive) {
        const { specialIndicatorEntity } = schemaAttribute.get(eid)
        
        if (specialIndicatorEntity) {
          // Get jetski's world position
          const jetskiPos = ecs.math.vec3.zero()
          world.transform.getWorldPosition(focusEntity, jetskiPos)
          
          // Get special indicator's world position
          const indicatorPos = ecs.math.vec3.zero()
          world.transform.getWorldPosition(specialIndicatorEntity, indicatorPos)
          
          // Calculate yaw angle to face the indicator from jetski's perspective
          const dx = indicatorPos.x - jetskiPos.x
          const dz = indicatorPos.z - jetskiPos.z
          targetYaw = Math.atan2(dx, dz) + Math.PI  // Add PI to position camera behind jetski looking at frog
          
          console.log(`[orbit-cam] Special indicator mode - camera facing frog at yaw: ${(targetYaw * 180 / Math.PI).toFixed(1)}°`)
        } else {
          // Fallback to normal behavior if special indicator entity not found
          targetYaw = getEntityRelativeYaw(focusEntity, startYaw)
        }
      } else {
        // Normal behavior: calculate target position based on entity's current rotation
        targetYaw = getEntityRelativeYaw(focusEntity, startYaw)
      }
      
      // Use current pitch (which may be adjusted for boost) instead of static startPitch
      const targetPitch = data.pitch
      const targetDistance = startDistance

      // Check if user is actively dragging to manually control camera
      const hasManualControl = data.isDragging

      if (!hasManualControl) {
        // When orientWithEntity is enabled and not manually controlled,
        // Use laziness to control how responsive the camera is

        if (laziness <= 0) {
          // 0 laziness = rigid follow (current behavior)
          data.yaw = targetYaw
          data.pitch = targetPitch
          data.distance = targetDistance
        } else {
          // Apply interpolation based on laziness value
          // Higher laziness = slower response (lower lerp speed)
          const baseLerpSpeed = 30.0  // Fast base speed for responsiveness
          const minLerpSpeed = 1.0    // Minimum speed for very lazy following

          // Calculate lerp speed: laziness 0 = instant, laziness 1 = very slow
          const lerpSpeed = baseLerpSpeed * (1.0 - laziness) + minLerpSpeed * laziness
          const lerpAmount = Math.min(lerpSpeed * world.time.delta / 1000, 1.0)

          // Calculate yaw difference with proper angle wrapping
          let yawDifference = targetYaw - data.yaw
          while (yawDifference > Math.PI) yawDifference -= 2 * Math.PI
          while (yawDifference < -Math.PI) yawDifference += 2 * Math.PI

          // Apply lazy interpolation to all axes
          data.yaw += yawDifference * lerpAmount
          data.pitch += (targetPitch - data.pitch) * lerpAmount
          data.distance += (targetDistance - data.distance) * lerpAmount
        }
      }
    }

    const handleGamepadCameraInput = (data: DataCursor) => {
      const { gamepadCameraSupport, gamepadIndex, speed, cameraRightStickSensitivity, cameraDeadzone, invertedX, invertedY } = schemaAttribute.get(eid)
      
      if (!gamepadCameraSupport) return
      
      // Check for gamepad connection
      const connectedGamepads = world.input.getGamepads()
      data.gamepadConnected = connectedGamepads.length > gamepadIndex

      if (data.gamepadConnected) {
        // Get axis values - standard gamepad layout: [leftX, leftY, rightX, rightY, ...]
        const axisValues = world.input.getAxis(gamepadIndex)
        
        if (axisValues && axisValues.length >= 4) {
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

          // Process camera input (right stick) with deadzone and sensitivity
          const cameraYawRaw = applyDeadzone(data.rightStickX, cameraDeadzone)
          const cameraPitchRaw = applyDeadzone(data.rightStickY, cameraDeadzone)
          data.processedCameraYawInput = cameraYawRaw * cameraRightStickSensitivity
          data.processedCameraPitchInput = cameraPitchRaw * cameraRightStickSensitivity

          // Check if there's actual right stick input
          const hasRightStickInput = Math.abs(data.processedCameraYawInput) > 0.01 || Math.abs(data.processedCameraPitchInput) > 0.01
          if (!hasRightStickInput) {
            // Reset dragging state when right stick is released so camera can resume following
            data.isDragging = false
            return
          }
          
          // Store previous values for comparison
          const prevPitch = data.pitch
          const prevYaw = data.yaw
          
          // Apply right stick input similar to touch drag behavior
          // Invert X by default to match typical camera controls (right stick right = turn camera right)
          data.dx = data.processedCameraYawInput * speed * (invertedX ? -1 : 1) * -1
          data.dy = data.processedCameraPitchInput * speed * (invertedY ? -1 : 1) * -1
          
          // Apply the camera movement (same logic as touch controls)
          const pitchAngle = data.pitch - data.dy
          const yawAngle = data.yaw - data.dx
          const pitchClamped = Math.min(Math.max(pitchAngle, data.minPitch), data.maxPitch)
          const yawAngleClamped = Math.min(Math.max(yawAngle, data.minYaw), data.maxYaw)
          data.pitch = pitchClamped
          data.yaw = data.constrainYaw ? yawAngleClamped : yawAngle
          
          // Mark as dragging to prevent orientWithEntity from overriding manual control
          data.isDragging = true
          
          // Set movement timers for inertia
          data.moving = MOVING_TIMER
          data.inertia = INERTIA_TIMER
          
          // Debug logging (can be removed when satisfied with sensitivity)
          // console.log(`[orbit-cam] Right stick - Yaw: ${data.processedCameraYawInput.toFixed(3)}, Pitch: ${data.processedCameraPitchInput.toFixed(3)}`)
        }
      } else {
        // Reset gamepad values when disconnected
        data.rightStickX = 0
        data.rightStickY = 0
        data.processedCameraYawInput = 0
        data.processedCameraPitchInput = 0
      }
    }

    const updateTiltBasedOnJetskiState = (data: DataCursor, focusEntity: ecs.Eid) => {
      const { enableTilt, maxTiltAngle, tiltSpeed } = schemaAttribute.get(eid)
      if (!enableTilt || !focusEntity) return

      // Check if jetski is moving by looking at input actions
      const movingForward = world.input.getAction('forward')
      const movingBackward = world.input.getAction('backward')
      let isMoving = !!(movingForward || movingBackward)

      // Check if jetski is steering (keyboard only - gamepad steering handled by jetski controller)
      const turningLeft = world.input.getAction('left')
      const turningRight = world.input.getAction('right')
      let isSteering = !!(turningLeft || turningRight)

      // Update movement and steering state
      data.isMoving = isMoving
      data.isSteering = isSteering

      // Calculate target tilt - only tilt when BOTH moving AND steering
      if (data.isMoving && data.isSteering) {
        const maxTiltRad = degreesToRadians(maxTiltAngle)
        if (turningLeft) {
          data.targetTilt = -maxTiltRad  // Tilt left (negative z-rotation)
        } else if (turningRight) {
          data.targetTilt = maxTiltRad   // Tilt right (positive z-rotation)
        }
      } else {
        // Return to neutral when not moving or not steering
        data.targetTilt = 0
      }

      // Smoothly interpolate current tilt towards target
      // Use faster speed when returning to center than when tilting away
      const tiltDiff = data.targetTilt - data.currentTilt
      const isReturningToCenter = data.targetTilt === 0 && Math.abs(data.currentTilt) > 0.001
      const speedMultiplier = isReturningToCenter ? 2.5 : 1.0  // 2.5x faster when centering
      const lerpAmount = Math.min(tiltSpeed * speedMultiplier * world.time.delta / 1000, 1.0)
      data.currentTilt += tiltDiff * lerpAmount
      
      // Clamp very small tilt values to prevent jitter when near center
      if (Math.abs(data.currentTilt) < 0.001) {
        data.currentTilt = 0
      }
    }

    const handleBoostAdjustments = (data: DataCursor, focusEntity: ecs.Eid) => {
      if (!focusEntity) return
      
      // Boost state is now updated via events in handleEnter
      // Calculate target pitch and distance based on boost state
      const targetPitch = data.isBoostActive ? data.boostPitch : data.basePitch
      const targetDistance = data.isBoostActive ? data.boostStartDistance : data.baseStartDistance
      
      // Smoothly transition pitch toward target
      const pitchDiff = targetPitch - data.pitch
      const lerpAmount = Math.min(data.pitchTransitionSpeed * world.time.delta / 1000, 1.0)
      data.pitch += pitchDiff * lerpAmount
      
      // Smoothly transition effective start distance toward target
      const distanceDiff = targetDistance - data.effectiveStartDistance
      data.effectiveStartDistance += distanceDiff * lerpAmount
      
      // Clamp pitch to valid bounds
      data.pitch = Math.min(Math.max(data.pitch, data.minPitch), data.maxPitch)
    }

    const handleMoveController = (data: DataCursor, orientWithEntity: boolean) => {
      const up = world.input.getAction('lookUp')
      const down = world.input.getAction('lookDown')
      const left = world.input.getAction('lookLeft')
      const right = world.input.getAction('lookRight')
      const {
        speed,
        maxAngularSpeed,
        maxZoomSpeed,
        distanceMin,
        distanceMax,
        horizontalSensitivity,
        verticalSensitivity,
        invertedX,
        invertedY,
        invertedZoom,
      } = schemaAttribute.get(eid)

      // Controller inputs are handled normally - orientWithEntity overrides in handleOrientWithEntity

      data.dx = capSpeed(
        (left - right) * (invertedX ? -1 : 1) * horizontalSensitivity * speed, maxAngularSpeed
      )

      data.dy = capSpeed(
        (up - down) * (invertedY ? -1 : 1) * verticalSensitivity * speed, maxAngularSpeed
      )

      const pitchAngle = data.pitch - data.dy
      const yawAngle = data.yaw - data.dx
      const pitchClamped = Math.min(Math.max(pitchAngle, data.minPitch), data.maxPitch)
      const yawAngleClamped = Math.min(Math.max(yawAngle, data.minYaw), data.maxYaw)
      data.pitch = pitchClamped
      data.yaw = data.constrainYaw ? yawAngleClamped : yawAngle
    }

    const handleEnter = () => {
      const {
        pitchAngleMax, pitchAngleMin, distanceMax, distanceMin,
        focusEntity, yawAngleMax, yawAngleMin, constrainYaw,
        controllerSupport,
        startYaw, startPitch, startDistance, orientWithEntity,
      } = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)

      const validPitchInterval = pitchAngleMin <= pitchAngleMax
      const validYawInterval = yawAngleMin <= yawAngleMax

      const minPitch = validPitchInterval
        ? degreesToRadians(Math.max(pitchAngleMin, -89.9999)) : 0
      const maxPitch = validPitchInterval ? degreesToRadians(Math.min(pitchAngleMax, 89.9999)) : 0
      const minYaw = validYawInterval ? degreesToRadians(yawAngleMin) : 0
      const maxYaw = validYawInterval ? degreesToRadians(yawAngleMax) : 0

      data.minPitch = minPitch
      data.maxPitch = maxPitch
      data.minYaw = minYaw
      data.maxYaw = maxYaw
      data.constrainYaw = constrainYaw
      data.isDragging = false
      
      // Initialize tilt data
      data.currentTilt = 0
      data.targetTilt = 0
      data.isMoving = false
      data.isSteering = false
      
      // Initialize boost pitch tracking
      data.isBoostActive = false
      data.basePitch = degreesToRadians(30)  // 30 degrees in radians
      data.boostPitch = degreesToRadians(10)  // 5 degrees in radians
      data.pitchTransitionSpeed = 5.0        // Smooth transition speed
      
      // Initialize boost distance tracking
      data.baseStartDistance = 10            // Base start distance
      data.boostStartDistance = 1            // Boost start distance
      data.effectiveStartDistance = data.baseStartDistance  // Start with base distance
      
      // Initialize special indicator tracking
      data.isSpecialIndicatorActive = false
      
      // Listen for boost events from jetski
      world.events.addListener(world.events.globalId, 'boost-activated', () => {
        const currentData = dataAttribute.cursor(eid)
        currentData.isBoostActive = true
        console.log('[orbit-cam] Boost activated via event - adjusting pitch to 5 degrees and distance to 2')
      })
      
      world.events.addListener(world.events.globalId, 'boost-deactivated', () => {
        const currentData = dataAttribute.cursor(eid)
        currentData.isBoostActive = false
        console.log('[orbit-cam] Boost deactivated via event - resetting pitch to 30 degrees and distance to 10')
      })
      
      // Listen for special indicator activated event
      world.events.addListener(world.events.globalId, 'special-indicator-activated', () => {
        const currentData = dataAttribute.cursor(eid)
        currentData.isSpecialIndicatorActive = true
        console.log('[orbit-cam] Special indicator activated - camera will now face the frog')
      })
      
      // Listen for checkpoint advanced event to deactivate special indicator mode
      world.events.addListener(world.events.globalId, 'checkpoint-advanced', (event: any) => {
        const currentData = dataAttribute.cursor(eid)
        const checkpointData = event.data
        
        // If checkpointIndex is not -1, we're back to normal checkpoint mode
        if (checkpointData && checkpointData.checkpointIndex !== -1) {
          currentData.isSpecialIndicatorActive = false
          console.log('[orbit-cam] Returning to normal camera behavior - following jetski forward direction')
        }
      })

      if (orientWithEntity && focusEntity) {
        // Set initial position based on entity's current rotation and start values
        data.yaw = getEntityRelativeYaw(focusEntity, startYaw)
        data.pitch = degreesToRadians(startPitch)
        data.distance = startDistance
      } else {
        // Use original values when not orienting with entity
        data.yaw = degreesToRadians(startYaw)
        data.pitch = degreesToRadians(startPitch)
        data.distance = startDistance
      }

      // Immediately set the camera position with the starting values
      setCameraPosition(focusEntity, data)

      if (controllerSupport) {
        world.input.setActiveMap('orbit-controls')
        world.input.enablePointerLockRequest()
        didLockPointer = true
      }
    }

    const handleTick = () => {
      const {
        speed, inertiaFactor, maxZoomSpeed, maxAngularSpeed,
        distanceMin, distanceMax, controllerSupport, focusEntity, invertedZoom,
        orientWithEntity, laziness,
      } = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)

      if (controllerSupport) {
        handleMoveController(data, orientWithEntity)
      }
      
      // Handle gamepad camera input from right stick
      handleGamepadCameraInput(data)

      if (data.inertia > 0 && inertiaFactor !== 0 && data.moving <= 0) {
        const currentInertia = Math.min(
          inertiaFactor * world.time.delta * (data.inertia / INERTIA_TIMER), 1
        )

        if (data.delta !== 0) {
          const newDistance = data.distance +
            capSpeed((data.delta / speed) * currentInertia, maxZoomSpeed)
          const distanceClamped = Math.min(Math.max(newDistance, distanceMin), distanceMax)
          data.distance = distanceClamped
        }

        if (data.dy !== 0 || data.dx !== 0) {
          const pitchAngle = data.pitch -
            capSpeed((data.dy / speed) * currentInertia, maxAngularSpeed)
          const yawAngle = data.yaw - capSpeed(
            (data.dx / speed) * currentInertia, maxAngularSpeed
          )
          const pitchClamped = Math.min(Math.max(pitchAngle, data.minPitch), data.maxPitch)
          const yawAngleClamped = Math.min(Math.max(yawAngle, data.minYaw), data.maxYaw)
          data.pitch = pitchClamped
          data.yaw = data.constrainYaw ? yawAngleClamped : yawAngle
        }

        data.inertia -= world.time.delta

        if (data.inertia <= 0) {
          data.dx = 0
          data.dy = 0
          data.delta = 0
        }
      }

      if (data.moving > 0) {
        data.moving -= world.time.delta
      }

      const zoomIn = world.input.getAction('zoomIn')
      const zoomOut = world.input.getAction('zoomOut')
      data.delta = capSpeed((zoomIn - zoomOut) * (invertedZoom ? -1 : 1) * speed, maxZoomSpeed)
      if (zoomIn || zoomOut) {
        data.moving = MOVING_TIMER
        data.inertia = INERTIA_TIMER
      }
      updateDistance(data, distanceMin, distanceMax)

      // Handle orient with entity behavior BEFORE setting camera position
      // This ensures the camera is always properly aligned when orientWithEntity is enabled
      if (orientWithEntity) {
        handleOrientWithEntity(data, focusEntity, orientWithEntity, schemaAttribute.get(eid).startYaw, schemaAttribute.get(eid).startPitch, data.effectiveStartDistance, laziness)
      }

      // Update camera tilt based on jetski movement and steering
      updateTiltBasedOnJetskiState(data, focusEntity)
      
      // Handle boost adjustments (pitch and distance)
      handleBoostAdjustments(data, focusEntity)

      setCameraPosition(focusEntity, data)
    }

    const handleExit = () => {
      if (didLockPointer) {
        world.input.disablePointerLockRequest()
      }
    }

    const handleGestureStart = (e: any) => {
      const data = dataAttribute.cursor(eid)
      data.isDragging = true
    }

    const handleGestureMove = (e: any) => {
      const gestureMoveEvent = e.data as ecs.GestureMoveEvent
      const {
        speed, maxAngularSpeed, maxZoomSpeed, distanceMin, distanceMax, invertedX, invertedY,
        invertedZoom,
      } = schemaAttribute.get(eid)

      const data = dataAttribute.cursor(eid)

      if (gestureMoveEvent.touchCount === 1) {
        const {positionChange} = gestureMoveEvent

        // note: touch controls x axis is inverted by default
        data.dx = capSpeed(positionChange.x * speed, maxAngularSpeed) *
          (invertedX ? -1 : 1) * -1
        data.dy = capSpeed(positionChange.y * speed, maxAngularSpeed) *
          (invertedY ? -1 : 1)

        const pitchAngle = data.pitch - data.dy
        const yawAngle = data.yaw - data.dx
        const pitchClamped = Math.min(Math.max(pitchAngle, data.minPitch),
          data.maxPitch)
        const yawAngleClamped = Math.min(Math.max(yawAngle, data.minYaw), data.maxYaw)
        data.pitch = pitchClamped
        data.yaw = data.constrainYaw ? yawAngleClamped : yawAngle
      } else if (gestureMoveEvent.touchCount === 2) {
        const {spreadChange} = gestureMoveEvent

        data.delta = capSpeed(spreadChange * speed, maxZoomSpeed) * (invertedZoom ? -1 : 1)
      }
      data.moving = MOVING_TIMER
      data.inertia = INERTIA_TIMER
      updateDistance(data, distanceMin, distanceMax)
    }

    const handleGestureEnd = (e: any) => {
      const data = dataAttribute.cursor(eid)
      data.isDragging = false
    }

    ecs.defineState('initial').initial()
      .onEnter(handleEnter)
      .onTick(handleTick)
      .listen(world.events.globalId, ecs.input.GESTURE_START, handleGestureStart)
      .listen(world.events.globalId, ecs.input.GESTURE_MOVE, handleGestureMove)
      .listen(world.events.globalId, ecs.input.GESTURE_END, handleGestureEnd)
      .onExit(handleExit)
  },
})
