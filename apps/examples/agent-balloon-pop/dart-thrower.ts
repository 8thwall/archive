import * as ecs from '@8thwall/ecs'

const {THREE} = window as any

ecs.registerComponent({
  name: 'Dart Thrower',
  schema: {
    dartEntity: ecs.eid,  // Reference to the dart entity
    forceMultiplier: ecs.f32,  // Force multiplier for throwing
    resetHeight: ecs.f32,  // Y position threshold for resetting dart
    autoResetDelay: ecs.f32,  // Time in milliseconds before auto-reset
    maxShakeIntensity: ecs.f32,  // Maximum shake amplitude in world units
    minShakeFrequency: ecs.f32,  // Starting shake frequency in Hz
    maxShakeFrequency: ecs.f32,  // Maximum shake frequency in Hz
    shakeCurvePower: ecs.f32,  // Power curve for shake intensity (higher = more dramatic buildup)
  },
  schemaDefaults: {
    forceMultiplier: 15.0,
    resetHeight: -2.0,
    autoResetDelay: 3000,  // 3 seconds
    maxShakeIntensity: 0.15,  // 0.15 world units maximum shake
    minShakeFrequency: 15.0,  // Start at 15Hz
    maxShakeFrequency: 40.0,  // Build up to 40Hz
    shakeCurvePower: 3.0,  // Cubic curve for dramatic buildup
  },
  data: {
    initialPosition: ecs.f32,  // Store initial position X
    initialPositionY: ecs.f32,  // Store initial position Y
    initialPositionZ: ecs.f32,  // Store initial position Z
    initialRotationX: ecs.f32,  // Store initial rotation X
    initialRotationY: ecs.f32,  // Store initial rotation Y
    initialRotationZ: ecs.f32,  // Store initial rotation Z
    initialRotationW: ecs.f32,  // Store initial rotation W
    dartThrown: ecs.boolean,  // Track if dart has been thrown
    hasRecordedInitialPose: ecs.boolean,  // Track if initial pose is recorded
    lastInputState: ecs.boolean,  // Track previous input state to detect new presses
    autoResetTimerId: ecs.f32,  // Store the auto-reset timer ID to prevent duplicates
    hasSetAutoReset: ecs.boolean,  // Flag to prevent multiple auto-reset timers
    isCharging: ecs.boolean,  // Track if currently charging the dart
    chargeStartTime: ecs.f32,  // Time when charging started
    currentForceMultiplier: ecs.f32,  // Current calculated force multiplier
    hasRecordedOriginalColors: ecs.boolean,  // Track if original colors are recorded
    chargingBasePositionX: ecs.f32,  // Store base position during charging for shake effect
    chargingBasePositionY: ecs.f32,  // Store base position during charging for shake effect
    chargingBasePositionZ: ecs.f32,  // Store base position during charging for shake effect
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    const {THREE} = window as any
    const toThrowing = ecs.defineTrigger()
    const toResetting = ecs.defineTrigger()
    const toColorSetup = ecs.defineTrigger()
    
    // Store original material colors for all meshes in the dart GLTF model
    let originalMaterialColors = []

    // Set up touch event listeners for more reliable input detection
    world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_START, (event) => {
      console.log('Touch start event:', event);
      const data = dataAttribute.cursor(eid)
      if (!data.dartThrown && !data.isCharging) {
        // Start charging
        data.isCharging = true
        data.chargeStartTime = world.time.elapsed
        const {forceMultiplier} = schemaAttribute.get(eid)
        data.currentForceMultiplier = forceMultiplier
        
        // Store current position as base for shake effect
        const {dartEntity: dartEnt} = schemaAttribute.get(eid)
        if (dartEnt) {
          const pos = ecs.Position.get(world, dartEnt)
          data.chargingBasePositionX = pos.x
          data.chargingBasePositionY = pos.y
          data.chargingBasePositionZ = pos.z
          console.log(`Captured charging base position: ${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)}`)
        }
        
        console.log('Started charging dart via touch event...')
      }
    });

    world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_END, (event) => {
      console.log('Touch end event:', event);
      const data = dataAttribute.cursor(eid)
      if (!data.dartThrown && data.isCharging) {
        // Release and throw dart
        const {dartEntity} = schemaAttribute.get(eid)
        if (!dartEntity) {
          console.log('Error: No dart entity found!')
          return
        }

        console.log(`Releasing dart with force multiplier: ${data.currentForceMultiplier.toFixed(2)}`)

        // Get throw direction based on mouse position (dart is already oriented correctly)
        const direction = getThrowDirectionFromMouse()
        
        // Set gravity factor to 1 for realistic physics
        ecs.Collider.mutate(world, dartEntity, (cursor) => {
          cursor.gravityFactor = 1
        })

        // Apply impulse in the calculated direction with charged force
        ecs.physics.applyImpulse(
          world,
          dartEntity,
          direction.x * data.currentForceMultiplier,
          direction.y * data.currentForceMultiplier,
          direction.z * data.currentForceMultiplier
        )

        // Add slight angular velocity for realistic dart spin
        ecs.physics.setAngularVelocity(
          world,
          dartEntity,
          direction.x * 2, // Spin based on throw direction
          0,
          direction.z * 2
        )

        // Reset charging state and mark dart as thrown
        data.isCharging = false
        data.dartThrown = true
        
        // Reset dart color when thrown
        resetDartColor()
        
        // DO NOT reset position here - let physics take over immediately
        // The shake position will be handled by the physics system
        
        console.log('Dart thrown via touch event! Transitioning to throwing state.')
        toThrowing.trigger()
      }
    });

    // Helper function to record initial dart position and rotation
    const recordInitialPose = () => {
      const {dartEntity} = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)
      
      if (!dartEntity || data.hasRecordedInitialPose) return

      const pos = ecs.Position.get(world, dartEntity)
      const quat = ecs.Quaternion.get(world, dartEntity)
      
      data.initialPosition = pos.x
      data.initialPositionY = pos.y
      data.initialPositionZ = pos.z
      data.initialRotationX = quat.x
      data.initialRotationY = quat.y
      data.initialRotationZ = quat.z
      data.initialRotationW = quat.w
      data.hasRecordedInitialPose = true
    }

    // Helper function to record original colors from GLTF model
    const recordOriginalColors = () => {
      const {dartEntity} = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)
      
      if (!dartEntity || data.hasRecordedOriginalColors) return

      const dartObject = world.three.entityToObject.get(dartEntity)
      if (!dartObject) {
        console.warn('No THREE object found for dart entity')
        return
      }

      originalMaterialColors = []
      
      // Traverse all meshes in the GLTF model and store their original colors
      dartObject.traverse((node) => {
        if (node.isMesh && node.material) {
          const materials = Array.isArray(node.material) ? node.material : [node.material]
          
          materials.forEach((material, index) => {
            if (material.color) {
              // Store original color for this material
              originalMaterialColors.push({
                material: material,
                originalColor: material.color.clone()
              })
              console.log(`Recorded original color for mesh material: R=${material.color.r.toFixed(2)}, G=${material.color.g.toFixed(2)}, B=${material.color.b.toFixed(2)}`)
            }
          })
        }
      })

      data.hasRecordedOriginalColors = true
      console.log(`Recorded ${originalMaterialColors.length} material colors from dart GLTF model`)
    }

    // Helper function to update dart color based on charge progress
    const updateDartColor = (chargeProgress: number) => {
      const {dartEntity} = schemaAttribute.get(eid)
      const data = dataAttribute.get(eid)
      
      if (!dartEntity || !data.hasRecordedOriginalColors || originalMaterialColors.length === 0) return

      // Update all stored materials with red interpolation
      originalMaterialColors.forEach(({material, originalColor}) => {
        if (material && material.color) {
          // Interpolate from original color to red based on charge progress
          // chargeProgress goes from 0 to 1
          const redIntensity = Math.min(1.0, chargeProgress * 2 + 0.2) // Start showing red early
          const greenReduction = originalColor.g * (1 - chargeProgress * 0.8)
          const blueReduction = originalColor.b * (1 - chargeProgress * 0.8)

          // Set the new color with increasing red intensity
          material.color.setRGB(
            Math.max(originalColor.r, redIntensity),
            greenReduction,
            blueReduction
          )
        }
      })
    }

    // Helper function to reset dart color to original
    const resetDartColor = () => {
      const {dartEntity} = schemaAttribute.get(eid)
      const data = dataAttribute.get(eid)
      
      if (!dartEntity || !data.hasRecordedOriginalColors || originalMaterialColors.length === 0) return

      // Restore all materials to their original colors
      originalMaterialColors.forEach(({material, originalColor}) => {
        if (material && material.color) {
          material.color.copy(originalColor)
        }
      })
      
      console.log('Reset dart color to original')
    }

    // Helper function to reset dart to initial position
    const resetDart = () => {
      const {dartEntity} = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)
      
      if (!dartEntity) return

      // Reset position
      ecs.Position.set(world, dartEntity, {
        x: data.initialPosition,
        y: data.initialPositionY,
        z: data.initialPositionZ,
      })

      // Reset rotation
      ecs.Quaternion.set(world, dartEntity, {
        x: data.initialRotationX,
        y: data.initialRotationY,
        z: data.initialRotationZ,
        w: data.initialRotationW,
      })

      // Stop all motion
      ecs.physics.setLinearVelocity(world, dartEntity, 0, 0, 0)
      ecs.physics.setAngularVelocity(world, dartEntity, 0, 0, 0)

      // Set gravity factor back to 0
      ecs.Collider.mutate(world, dartEntity, (cursor) => {
        cursor.gravityFactor = 0
      })

      // Reset color to original
      resetDartColor()

      // Complete state reset - clear all charging and throwing related data
      data.dartThrown = false
      data.isCharging = false
      data.chargeStartTime = 0
      const {forceMultiplier} = schemaAttribute.get(eid)
      data.currentForceMultiplier = forceMultiplier
      data.hasSetAutoReset = false
      data.chargingBasePositionX = data.initialPosition
      data.chargingBasePositionY = data.initialPositionY
      data.chargingBasePositionZ = data.initialPositionZ
    }

    // Helper function to get balloon target distance
    // For now, we'll use a smart default that adjusts based on the throw angle
    // This provides better aiming arc calculation than a fixed distance
    const getBalloonTargetDistance = () => {
      // Use a base distance that works well for balloon positions
      // Most balloons in typical setups are around 6-10 units away
      return 8 // This can be made configurable later if needed
    }

    // Helper function to calculate throw direction from mouse position using 3D raycasting
    const getThrowDirectionFromMouse = () => {
      // Get mouse position
      const mousePos = world.input.getMousePosition()
      if (!mousePos) return new THREE.Vector3(0, 0, -1)

      // Get screen dimensions
      const canvas = world.three.renderer.domElement
      const rect = canvas.getBoundingClientRect()
      
      // Convert mouse position to normalized device coordinates (-1 to 1)
      const normalizedX = (mousePos[0] / rect.width) * 2 - 1
      const normalizedY = -((mousePos[1] / rect.height) * 2 - 1) // Flip Y for WebGL
      
      // Get camera and dart positions
      const cameraEid = world.camera.getActiveEid()
      const cameraPos = ecs.Position.get(world, cameraEid)
      const cameraQuat = ecs.Quaternion.get(world, cameraEid)
      const {dartEntity} = schemaAttribute.get(eid)
      const dartPos = ecs.Position.get(world, dartEntity)
      
      // Create camera transformation matrix to project mouse coordinates to world space
      const cameraPosition = new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z)
      const cameraRotation = new THREE.Quaternion(cameraQuat.x, cameraQuat.y, cameraQuat.z, cameraQuat.w)
      
      // Create camera forward, right, and up vectors
      const forward = new THREE.Vector3(0, 0, 1) // Corrected direction (was -1 in standard camera, but needs to be 1 here)
      const right = new THREE.Vector3(-1, 0, 0) // Corrected for proper left/right mapping
      const up = new THREE.Vector3(0, 1, 0)
      
      // Transform vectors by camera rotation
      forward.applyQuaternion(cameraRotation)
      right.applyQuaternion(cameraRotation)
      up.applyQuaternion(cameraRotation)
      
      // Get dynamic target distance based on balloon positions
      const targetDistance = getBalloonTargetDistance()
      
      // Calculate the target point by projecting from camera position
      // Use field of view considerations for proper scaling
      const fovRadians = (60 * Math.PI) / 180 // 60 degrees FOV from camera config
      const aspect = world.three.renderer.domElement.width / world.three.renderer.domElement.height
      
      // Calculate the size of the projection plane at target distance
      const planeHeight = 2 * targetDistance * Math.tan(fovRadians / 2)
      const planeWidth = planeHeight * aspect
      
      // Convert normalized coordinates to world space offset
      const worldOffsetX = normalizedX * (planeWidth / 2)
      const worldOffsetY = normalizedY * (planeHeight / 2)
      
      // Calculate target point in world space
      const targetPoint = cameraPosition.clone()
      targetPoint.add(forward.clone().multiplyScalar(targetDistance))
      targetPoint.add(right.clone().multiplyScalar(worldOffsetX))
      targetPoint.add(up.clone().multiplyScalar(worldOffsetY))
      
      // Calculate direction from dart position to target point
      const dartPosition = new THREE.Vector3(dartPos.x, dartPos.y, dartPos.z)
      const throwDirection = targetPoint.sub(dartPosition).normalize()
      
      // Add some upward trajectory for realistic dart throwing physics
      // Adjust the Y component to account for gravity - darts should arc slightly upward
      throwDirection.y += 0.1 // Small upward bias to compensate for gravity
      throwDirection.normalize()
      
      console.log('Mouse click at:', normalizedX, normalizedY)
      console.log('Target distance:', targetDistance)
      console.log('Target point:', targetPoint)
      console.log('Throw direction:', throwDirection)
      
      return throwDirection
    }

    // Helper function to calculate throw direction from mouse position using a specific dart position
    const getThrowDirectionFromMouseAtPosition = (dartX: number, dartY: number, dartZ: number) => {
      // Get mouse position
      const mousePos = world.input.getMousePosition()
      if (!mousePos) return new THREE.Vector3(0, 0, -1)

      // Get screen dimensions
      const canvas = world.three.renderer.domElement
      const rect = canvas.getBoundingClientRect()
      
      // Convert mouse position to normalized device coordinates (-1 to 1)
      const normalizedX = (mousePos[0] / rect.width) * 2 - 1
      const normalizedY = -((mousePos[1] / rect.height) * 2 - 1) // Flip Y for WebGL
      
      // Get camera positions
      const cameraEid = world.camera.getActiveEid()
      const cameraPos = ecs.Position.get(world, cameraEid)
      const cameraQuat = ecs.Quaternion.get(world, cameraEid)
      
      // Create camera transformation matrix to project mouse coordinates to world space
      const cameraPosition = new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z)
      const cameraRotation = new THREE.Quaternion(cameraQuat.x, cameraQuat.y, cameraQuat.z, cameraQuat.w)
      
      // Create camera forward, right, and up vectors
      const forward = new THREE.Vector3(0, 0, 1)
      const right = new THREE.Vector3(-1, 0, 0)
      const up = new THREE.Vector3(0, 1, 0)
      
      // Transform vectors by camera rotation
      forward.applyQuaternion(cameraRotation)
      right.applyQuaternion(cameraRotation)
      up.applyQuaternion(cameraRotation)
      
      // Get dynamic target distance based on balloon positions
      const targetDistance = getBalloonTargetDistance()
      
      // Calculate the target point by projecting from camera position
      // Use field of view considerations for proper scaling
      const fovRadians = (60 * Math.PI) / 180 // 60 degrees FOV from camera config
      const aspect = world.three.renderer.domElement.width / world.three.renderer.domElement.height
      
      // Calculate the size of the projection plane at target distance
      const planeHeight = 2 * targetDistance * Math.tan(fovRadians / 2)
      const planeWidth = planeHeight * aspect
      
      // Convert normalized coordinates to world space offset
      const worldOffsetX = normalizedX * (planeWidth / 2)
      const worldOffsetY = normalizedY * (planeHeight / 2)
      
      // Calculate target point in world space
      const targetPoint = cameraPosition.clone()
      targetPoint.add(forward.clone().multiplyScalar(targetDistance))
      targetPoint.add(right.clone().multiplyScalar(worldOffsetX))
      targetPoint.add(up.clone().multiplyScalar(worldOffsetY))
      
      // Calculate direction from specified dart position to target point
      const dartPosition = new THREE.Vector3(dartX, dartY, dartZ)
      const throwDirection = targetPoint.sub(dartPosition).normalize()
      
      // Add some upward trajectory for realistic dart throwing physics
      throwDirection.y += 0.1 // Small upward bias to compensate for gravity
      throwDirection.normalize()
      
      return throwDirection
    }

    // Helper function to orient dart based on velocity direction
    const orientDartToVelocity = () => {
      const {dartEntity} = schemaAttribute.get(eid)
      if (!dartEntity) return
      
      // Get current velocity
      const vel = ecs.physics.getLinearVelocity(world, dartEntity)
      const velocity = new THREE.Vector3(vel.x, vel.y, vel.z)
      
      // Only orient if dart is moving fast enough
      if (velocity.length() > 0.1) {
        velocity.normalize()
        
        // Create quaternion that rotates dart to face the velocity direction
        // Dart's local forward axis is (0, 0, -1) due to its model orientation
        const dartForward = new THREE.Vector3(0, 0, -1)
        const orientationQuat = new THREE.Quaternion()
        orientationQuat.setFromUnitVectors(dartForward, velocity)
        
        // Apply the orientation to the dart
        ecs.Quaternion.set(world, dartEntity, {
          x: orientationQuat.x,
          y: orientationQuat.y,
          z: orientationQuat.z,
          w: orientationQuat.w,
        })
      }
    }

    // Helper function to check if dart is moving
    const isDartMoving = () => {
      const {dartEntity} = schemaAttribute.get(eid)
      if (!dartEntity) return false
      
      const vel = ecs.physics.getLinearVelocity(world, dartEntity)
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
      return speed > 0.05 // Lowered threshold for better responsiveness
    }

    // State: Waiting for GLTF model to load
    ecs.defineState('waiting')
      .initial()
      .onEnter(() => {
        const {dartEntity} = schemaAttribute.get(eid)
        if (dartEntity) {
          // Listen for GLTF model loaded event on the dart entity
          world.events.addListener(dartEntity, ecs.events.GLTF_MODEL_LOADED, () => {
            toColorSetup.trigger()
          })
        }
      })
      .onTrigger(toColorSetup, 'setup')

    // State: Setup - record initial pose and colors after GLTF loads
    ecs.defineState('setup')
      .onEnter(() => {
        recordInitialPose()
        recordOriginalColors()
        const {forceMultiplier} = schemaAttribute.get(eid)
        dataAttribute.set(eid, {
          dartThrown: false,
          hasSetAutoReset: false,
          autoResetTimerId: -1,
          isCharging: false,
          chargeStartTime: 0,
          currentForceMultiplier: forceMultiplier,
          chargingBasePositionX: 0,
          chargingBasePositionY: 0,
          chargingBasePositionZ: 0
        })
        // Move to ready state after setup is complete
        world.events.dispatch(eid, 'setup_complete')
      })
      .onEvent('setup_complete', 'ready')

    // State: Ready - waiting for user input
    ecs.defineState('ready')
      .onEnter(() => {
        // Ensure clean state when entering ready (in case of any lingering state)
        const data = dataAttribute.cursor(eid)
        const {forceMultiplier} = schemaAttribute.get(eid)
        if (!data.dartThrown) {
          data.isCharging = false
          data.chargeStartTime = 0
          data.currentForceMultiplier = forceMultiplier
        }
      })
      .onTick(() => {
        const data = dataAttribute.cursor(eid)
        const currentTime = world.time.elapsed
        
        // Update charge level if currently charging
        if (data.isCharging && !data.dartThrown) {
          const chargeTime = currentTime - data.chargeStartTime
          const maxChargeTime = 2500 // 2.5 seconds in milliseconds
          const chargeProgress = Math.min(chargeTime / maxChargeTime, 1) // 0 to 1
          
          // Use schema forceMultiplier as base, add charge bonus (more stable physics)
          const {forceMultiplier} = schemaAttribute.get(eid)
          const chargeBonus = forceMultiplier * 3.0 // Add up to 3x more force when fully charged (4x total)
          data.currentForceMultiplier = forceMultiplier + (chargeBonus * chargeProgress)
          
          // Update dart color based on charge progress
          updateDartColor(chargeProgress)
          
          // Add shake effect that increases with charge progress
          const {dartEntity, maxShakeIntensity, minShakeFrequency, maxShakeFrequency, shakeCurvePower} = schemaAttribute.get(eid)
          if (dartEntity) {
            // Shake intensity and frequency reach maximum and stay there
            const shakeIntensity = Math.pow(chargeProgress, shakeCurvePower) * maxShakeIntensity
            const shakeFrequency = minShakeFrequency + (chargeProgress * (maxShakeFrequency - minShakeFrequency))
            
            // Always use current time for dynamic animation (never gets static)
            const timeInSeconds = currentTime / 1000
            const shakeX = Math.sin(timeInSeconds * shakeFrequency) * shakeIntensity
            const shakeY = Math.sin(timeInSeconds * shakeFrequency * 1.3 + 1.2) * shakeIntensity * 0.8
            const shakeZ = Math.sin(timeInSeconds * shakeFrequency * 0.9 + 2.4) * shakeIntensity * 0.6
            
            // Apply shake offset to base position
            ecs.Position.set(world, dartEntity, {
              x: data.chargingBasePositionX + shakeX,
              y: data.chargingBasePositionY + shakeY,
              z: data.chargingBasePositionZ + shakeZ,
            })
            
            // Update dart orientation based on mouse position (using base position for calculations)
            const direction = getThrowDirectionFromMouseAtPosition(
              data.chargingBasePositionX,
              data.chargingBasePositionY,
              data.chargingBasePositionZ
            )
            
            // Orient dart to face the calculated direction
            const dartForward = new THREE.Vector3(0, 0, -1)
            const orientationQuat = new THREE.Quaternion()
            orientationQuat.setFromUnitVectors(dartForward, direction)
            
            // Apply the orientation to the dart
            ecs.Quaternion.set(world, dartEntity, {
              x: orientationQuat.x,
              y: orientationQuat.y,
              z: orientationQuat.z,
              w: orientationQuat.w,
            })
          }
          
          // Optional: Log charge progress for debugging (every 500ms)
          if (Math.floor(chargeTime / 500) !== Math.floor((chargeTime - world.time.delta) / 500)) {
            console.log(`Charging... Force: ${data.currentForceMultiplier.toFixed(1)} (${(chargeProgress * 100).toFixed(1)}%)`)
          }
        } else {
          // Continuously update dart orientation based on mouse position while ready (not charging)
          if (!data.dartThrown) {
            const {dartEntity} = schemaAttribute.get(eid)
            if (dartEntity) {
              // Get throw direction based on current mouse position
              const direction = getThrowDirectionFromMouse()
              
              // Orient dart to face the calculated direction
              // Create quaternion that rotates dart to face the throw direction
              // Dart's local forward axis is (0, 0, -1) due to its model orientation
              const dartForward = new THREE.Vector3(0, 0, -1)
              const orientationQuat = new THREE.Quaternion()
              orientationQuat.setFromUnitVectors(dartForward, direction)
              
              // Apply the orientation to the dart
              ecs.Quaternion.set(world, dartEntity, {
                x: orientationQuat.x,
                y: orientationQuat.y,
                z: orientationQuat.z,
                w: orientationQuat.w,
              })
            }
          }
        }
      })
      .onTrigger(toThrowing, 'throwing')

    // State: Throwing - dart is in flight
    ecs.defineState('throwing')
      .onEnter(() => {
        console.log('Dart thrown!')
        // Clear any existing auto-reset flags and charging state
        const data = dataAttribute.cursor(eid)
        data.hasSetAutoReset = false
        data.isCharging = false
        data.chargeStartTime = 0
        const {forceMultiplier} = schemaAttribute.get(eid)
        data.currentForceMultiplier = forceMultiplier
        
        // Orient dart based on its initial velocity for realistic flight
        setTimeout(() => {
          orientDartToVelocity()
        }, 50) // Small delay to let physics settle
      })
      .onTick(() => {
        const {dartEntity, resetHeight} = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid)
        if (!dartEntity) return

        // Continuously orient dart to its velocity during flight for realistic motion
        orientDartToVelocity()

        // Check if dart is out of bounds (below reset height)
        const dartPos = ecs.Position.get(world, dartEntity)
        if (dartPos.y < resetHeight) {
          console.log('Dart fell below reset height, resetting...')
          toResetting.trigger()
          return
        }

        // Check if dart has stopped moving and set auto-reset timer (only once)
        if (!isDartMoving() && !data.hasSetAutoReset) {
          console.log('Dart stopped moving, auto-resetting in 3 seconds...')
          data.hasSetAutoReset = true
          const {autoResetDelay} = schemaAttribute.get(eid)
          const timerId = world.time.setTimeout(() => {
            // Only reset if we're still in throwing state and timer hasn't been cleared
            const currentData = dataAttribute.get(eid)
            if (currentData.hasSetAutoReset && currentData.autoResetTimerId === timerId) {
              toResetting.trigger()
            }
          }, autoResetDelay)
          data.autoResetTimerId = timerId
        }
      })
      .onTrigger(toResetting, 'resetting')

    // State: Resetting - returning dart to initial position
    ecs.defineState('resetting')
      .onEnter(() => {
        console.log('Resetting dart to initial position')
        // Clear any pending auto-reset timer
        const data = dataAttribute.cursor(eid)
        if (data.autoResetTimerId >= 0) {
          world.time.clearTimeout(data.autoResetTimerId)
          data.autoResetTimerId = -1
        }
        data.hasSetAutoReset = false
        
        // Clear charging state completely
        data.isCharging = false
        data.chargeStartTime = 0
        const {forceMultiplier} = schemaAttribute.get(eid)
        data.currentForceMultiplier = forceMultiplier
        
        resetDart()
      })
      .wait(500, 'ready') // Brief delay before returning to ready state
  },
})