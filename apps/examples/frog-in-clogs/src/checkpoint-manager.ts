import * as ecs from '@8thwall/ecs'
import { waveHeightSync } from './wave-height-sync'
import { CurveAnimator } from './CurveAnimator'

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

// Pure Y-axis rotation quaternion
function quatFromYRotation(angleRad: number) {
  const half = angleRad / 2
  return [0, Math.sin(half), 0, Math.cos(half)]
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

// Smoothly interpolate between angles
function lerpAngle(from: number, to: number, t: number): number {
  // Handle angle wrapping
  let diff = to - from
  while (diff > Math.PI) diff -= 2 * Math.PI
  while (diff < -Math.PI) diff += 2 * Math.PI
  return from + diff * t
}

// Extract pitch and roll from quaternion
function extractPitchRoll(quat: { x: number, y: number, z: number, w: number }) {
  const { x, y, z, w } = quat

  // Roll (x-axis rotation)
  const sinr_cosp = 2 * (w * x + y * z)
  const cosr_cosp = 1 - 2 * (x * x + y * y)
  const roll = Math.atan2(sinr_cosp, cosr_cosp)

  // Pitch (y-axis rotation)
  const sinp = 2 * (w * y - z * x)
  const pitch = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp)

  return { pitch, roll }
}

const checkpointManager = ecs.registerComponent({
  name: 'Checkpoint Manager',
  schema: {
    playerEntity: ecs.eid,  // Reference to the jetski player entity
    activeCheckpointIndicator: ecs.eid,  // Reference to the ActiveCheckpointIndicator entity
    specialIndicator: ecs.eid,  // Reference to the special indicator entity (child of frog)
    frog: ecs.eid,  // Reference to the frog entity
    arrowPointer: ecs.eid,  // Reference to the arrow pointer entity that points to active checkpoint
    ocean: ecs.eid,  // Reference to the ocean entity for wave synchronization
    gemCounterText: ecs.eid,  // Reference to the UI text element that displays gem count
    pointerSmoothing: ecs.f32,  // Rotation smoothing for arrow pointer (0-1, higher = smoother/slower)
    // Array of checkpoint collider entities in order (will be referenced by entity IDs)
    checkpoint1: ecs.eid,
    checkpoint2: ecs.eid,
    checkpoint3: ecs.eid,
    checkpoint4: ecs.eid,
    checkpoint5: ecs.eid,
    checkpoint6: ecs.eid,
    checkpoint7: ecs.eid,
    checkpoint8: ecs.eid,
    // Array of checkpoint collider entities (the actual collision detectors)
    checkpointCollider1: ecs.eid,
    checkpointCollider2: ecs.eid,
    checkpointCollider3: ecs.eid,
    checkpointCollider4: ecs.eid,
    checkpointCollider5: ecs.eid,
    checkpointCollider6: ecs.eid,
    checkpointCollider7: ecs.eid,
    checkpointCollider8: ecs.eid,
  },
  schemaDefaults: {
    pointerSmoothing: 0.1,  // Default smooth rotation for pointer
  },
  data: {
    currentCheckpointIndex: ecs.i32,  // Index of the current active checkpoint
    totalCheckpoints: ecs.i32,  // Total number of checkpoints
    checkpointsCompleted: ecs.i32,  // Total checkpoints completed (for lap counting)
    gemCount: ecs.i32,  // Total gems collected (increments with each checkpoint)
    // Checkpoint detection cooldown
    lastCheckpointAdvanceTime: ecs.f32,  // Time when last checkpoint was advanced
    // Game state tracking
    gameActive: ecs.boolean,  // Whether checkpoint detection is active
    // Audio pitch enforcement timing
    audioPitchEnforcementStartTime: ecs.f32,  // Time when pitch enforcement started
    // Special indicator state
    isSpecialIndicatorActive: ecs.boolean,  // Whether the special indicator is currently active
    specialIndicatorCollisionDistance: ecs.f32,  // Distance threshold for special indicator collision (in meters)
    frogAppearanceCount: ecs.i32,  // Number of times the frog has appeared (for speed scaling)
    // Arrow pointer rotation tracking
    pointerTargetYaw: ecs.f32,  // Target Y rotation for arrow pointer
    pointerCurrentYaw: ecs.f32,  // Current Y rotation for arrow pointer
    // Distance scaling for time bonus
    minCheckpointDistance: ecs.f32,  // Minimum distance between any two checkpoints
    maxCheckpointDistance: ecs.f32,  // Maximum distance between any two checkpoints
    // Checkpoint animation tracking
    previousCheckpointIndex: ecs.i32,  // Index of the previously active checkpoint (for animation out)
    activeCheckpointAnimProgress: ecs.f32,  // Animation progress for active checkpoint (0-1)
    previousCheckpointAnimProgress: ecs.f32,  // Animation progress for previous checkpoint (0-1)
    isAnimatingCheckpoints: ecs.boolean,  // Whether checkpoint animations are in progress
  },
  stateMachine: ({ world, eid, schemaAttribute, dataAttribute }) => {
    // Helper function to get checkpoint entity by index
    const getCheckpointEntity = (index: number): ecs.Eid | null => {
      const schema = schemaAttribute.get(eid)
      switch (index) {
        case 0: return schema.checkpoint1 || null
        case 1: return schema.checkpoint2 || null
        case 2: return schema.checkpoint3 || null
        case 3: return schema.checkpoint4 || null
        case 4: return schema.checkpoint5 || null
        case 5: return schema.checkpoint6 || null
        case 6: return schema.checkpoint7 || null
        case 7: return schema.checkpoint8 || null
        default: return null
      }
    }

    // Helper function to count total configured checkpoints
    const countCheckpoints = (): number => {
      let count = 0
      for (let i = 0; i < 8; i++) {
        if (getCheckpointEntity(i)) {
          count++
        }
      }
      return count
    }

    // Helper function to get checkpoint collider entity by index
    const getCheckpointCollider = (index: number): ecs.Eid | null => {
      const schema = schemaAttribute.get(eid)
      switch (index) {
        case 0: return schema.checkpointCollider1 || null
        case 1: return schema.checkpointCollider2 || null
        case 2: return schema.checkpointCollider3 || null
        case 3: return schema.checkpointCollider4 || null
        case 4: return schema.checkpointCollider5 || null
        case 5: return schema.checkpointCollider6 || null
        case 6: return schema.checkpointCollider7 || null
        case 7: return schema.checkpointCollider8 || null
        default: return null
      }
    }

    // Note: Checkpoint colliders stay in their original scene positions
    // We check which collider was hit in the collision handler instead of moving them
    const logColliderPositions = () => {
      const data = dataAttribute.cursor(eid)
      console.log(`[checkpoint-manager] All checkpoint colliders remain in their original positions`)
      console.log(`[checkpoint-manager] Currently waiting for collision with checkpoint ${data.currentCheckpointIndex}`)

      // Log positions of all colliders for debugging
      for (let i = 0; i < data.totalCheckpoints; i++) {
        const colliderEntity = getCheckpointCollider(i)
        if (colliderEntity) {
          const pos = ecs.math.vec3.zero()
          world.transform.getWorldPosition(colliderEntity, pos)
          console.log(`[checkpoint-manager] Collider ${i} (ID: ${colliderEntity}) at (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`)
        }
      }
    }

    // Helper function to animate the active checkpoint indicator to checkpoint position
    const animateIndicatorToCheckpoint = (checkpointIndex: number) => {
      const schema = schemaAttribute.get(eid)
      const checkpointEntity = getCheckpointEntity(checkpointIndex)

      if (!checkpointEntity || !schema.activeCheckpointIndicator) {
        console.warn('[checkpoint-manager] Cannot animate indicator: missing checkpoint or indicator entity', {
          checkpointIndex,
          checkpointEntity,
          indicator: schema.activeCheckpointIndicator
        })
        return
      }

      // Get current indicator position
      const fromPos = ecs.Position.get(world, schema.activeCheckpointIndicator)
      // Get target checkpoint position
      const toPos = ecs.Position.get(world, checkpointEntity)

      if (fromPos && toPos) {
        // Animate only to X/Z position, let wave-height-sync handle Y position
        ecs.PositionAnimation.set(world, schema.activeCheckpointIndicator, {
          fromX: fromPos.x,
          fromY: fromPos.y,
          fromZ: fromPos.z,
          toX: toPos.x,
          toY: fromPos.y, // Keep current Y, don't animate vertically
          toZ: toPos.z,
          autoFrom: true,
          duration: 400, // 400ms animation duration (similar to trail-preview)
          loop: false,
          reverse: false,
          easeIn: true,
          easeOut: true,
          easingFunction: 'Cubic',
        })

        // Ensure the indicator has wave-height-sync component for bobbing
        setupWaveSync(schema.activeCheckpointIndicator)

        console.log(`[checkpoint-manager] Animating indicator to checkpoint ${checkpointIndex}`, {
          from: fromPos,
          to: { x: toPos.x, y: 'wave-synced', z: toPos.z }
        })
      }
    }

    // Helper function to setup wave synchronization on the active checkpoint indicator
    const setupWaveSync = (indicatorEid: ecs.Eid) => {
      const schema = schemaAttribute.get(eid)

      if (!schema.ocean) {
        console.warn('[checkpoint-manager] No ocean entity configured for wave sync')
        return
      }

      // Configure wave-height-sync component on the indicator
      waveHeightSync.set(world, indicatorEid, {
        ocean: schema.ocean,
        verticalOffset: 3.6, // Float 7 units above waves
        orientWithWave: false, // Don't rotate with waves, keep indicator upright
        waveInfluence: 0,
        smoothing: 0.3,
        lockYAxis: false,
      })

      console.log(`[checkpoint-manager] Wave sync configured for indicator (ocean: ${schema.ocean}, offset: 7)`)
    }

    // Helper function to calculate min and max distances between all checkpoints
    const calculateDistanceRange = () => {
      const data = dataAttribute.cursor(eid)
      let minDist = Infinity
      let maxDist = 0

      // Compare all checkpoint pairs to find min and max distances
      for (let i = 0; i < data.totalCheckpoints; i++) {
        const checkpoint1 = getCheckpointEntity(i)
        if (!checkpoint1) continue

        const pos1 = ecs.math.vec3.zero()
        world.transform.getWorldPosition(checkpoint1, pos1)

        for (let j = i + 1; j < data.totalCheckpoints; j++) {
          const checkpoint2 = getCheckpointEntity(j)
          if (!checkpoint2) continue

          const pos2 = ecs.math.vec3.zero()
          world.transform.getWorldPosition(checkpoint2, pos2)

          // Calculate 3D distance
          const dx = pos2.x - pos1.x
          const dy = pos2.y - pos1.y
          const dz = pos2.z - pos1.z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

          minDist = Math.min(minDist, distance)
          maxDist = Math.max(maxDist, distance)
        }
      }

      // Store the calculated range
      data.minCheckpointDistance = minDist === Infinity ? 0 : minDist
      data.maxCheckpointDistance = maxDist

      console.log(`[checkpoint-manager] Distance range calculated: min=${data.minCheckpointDistance.toFixed(2)}, max=${data.maxCheckpointDistance.toFixed(2)}`)
    }

    // Helper function to initialize all checkpoints to y=-12
    const initializeCheckpointPositions = () => {
      const data = dataAttribute.cursor(eid)

      for (let i = 0; i < data.totalCheckpoints; i++) {
        const checkpointEntity = getCheckpointEntity(i)
        if (checkpointEntity) {
          const currentPos = ecs.Position.get(world, checkpointEntity)
          if (currentPos) {
            ecs.Position.set(world, checkpointEntity, {
              x: currentPos.x,
              y: -12,
              z: currentPos.z
            })
          }
        }
      }

      console.log('[checkpoint-manager] Initialized all checkpoints to y=-12')
    }

    // Helper function to animate a checkpoint upward to y=0
    const animateCheckpointUp = (checkpointIndex: number) => {
      const checkpointEntity = getCheckpointEntity(checkpointIndex)
      if (!checkpointEntity) return

      const currentPos = ecs.Position.get(world, checkpointEntity)
      if (currentPos) {
        ecs.PositionAnimation.set(world, checkpointEntity, {
          fromX: currentPos.x,
          fromY: currentPos.y,
          fromZ: currentPos.z,
          toX: currentPos.x,
          toY: 0,
          toZ: currentPos.z,
          autoFrom: true,
          duration: 1000,  // 500ms animation duration
          loop: false,
          reverse: false,
          easeIn: true,
          easeOut: true,
          easingFunction: 'Cubic',
        })

        console.log(`[checkpoint-manager] Animating checkpoint ${checkpointIndex} up to y=0`)
      }
    }

    // Helper function to animate a checkpoint downward to y=-12
    const animateCheckpointDown = (checkpointIndex: number) => {
      const checkpointEntity = getCheckpointEntity(checkpointIndex)
      if (!checkpointEntity) return

      const currentPos = ecs.Position.get(world, checkpointEntity)
      if (currentPos) {
        ecs.PositionAnimation.set(world, checkpointEntity, {
          fromX: currentPos.x,
          fromY: currentPos.y,
          fromZ: currentPos.z,
          toX: currentPos.x,
          toY: -12,
          toZ: currentPos.z,
          autoFrom: true,
          duration: 1000,  // 500ms animation duration
          loop: false,
          reverse: false,
          easeIn: true,
          easeOut: true,
          easingFunction: 'Cubic',
        })

        console.log(`[checkpoint-manager] Animating checkpoint ${checkpointIndex} down to y=-12`)
      }
    }

    // Helper function to position the active checkpoint indicator (immediate, for initialization)
    const positionActiveIndicatorImmediate = (checkpointIndex: number) => {
      const schema = schemaAttribute.get(eid)
      const checkpointEntity = getCheckpointEntity(checkpointIndex)

      if (!checkpointEntity || !schema.activeCheckpointIndicator) {
        console.warn('[checkpoint-manager] Cannot position indicator: missing checkpoint or indicator entity', {
          checkpointIndex,
          checkpointEntity,
          indicator: schema.activeCheckpointIndicator
        })
        return
      }

      // Get the checkpoint's world position
      const checkpointPos = ecs.math.vec3.zero()
      world.transform.getWorldPosition(checkpointEntity, checkpointPos)

      // Position the indicator at the checkpoint X/Z coordinates
      const indicatorPos = {
        x: checkpointPos.x,
        y: checkpointPos.y, // Initial Y, wave sync will adjust
        z: checkpointPos.z
      }

      ecs.Position.set(world, schema.activeCheckpointIndicator, indicatorPos)

      // Setup wave synchronization for bobbing effect
      setupWaveSync(schema.activeCheckpointIndicator)

      console.log(`[checkpoint-manager] Active indicator positioned at checkpoint ${checkpointIndex}`, indicatorPos)
    }

    // Helper function to show/hide frog entity
    const setFrogVisibility = (visible: boolean) => {
      const schema = schemaAttribute.get(eid)

      if (!schema.frog) {
        console.warn('[checkpoint-manager] Cannot set frog visibility: missing frog entity')
        return
      }

      const frogEntity = world.getEntity(schema.frog)
      if (visible) {
        frogEntity.show()
        ecs.ParticleEmitter.set(world, schema.frog, {
          stopped: false,
        })
        // Set audio volume to 1 when frog is visible
        ecs.Audio.mutate(world, schema.frog, (cursor) => {
          cursor.volume = 1
          return false  // Indicate that changes were made
        })
      } else {
        frogEntity.hide()
        ecs.ParticleEmitter.set(world, schema.frog, {
          stopped: true,
        })
        // Set audio volume to 0 when frog is hidden
        ecs.Audio.mutate(world, schema.frog, (cursor) => {
          cursor.volume = 0
          return false  // Indicate that changes were made
        })
      }

      console.log(`[checkpoint-manager] Frog visibility set to: ${visible ? 'VISIBLE' : 'HIDDEN'}, audio volume: ${visible ? 1 : 0}`)
    }

    // Helper function to check distance-based collision with special indicator
    const checkSpecialIndicatorDistance = () => {
      const schema = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)

      if (!data.isSpecialIndicatorActive || !schema.specialIndicator || !schema.playerEntity) {
        return false
      }

      // Get player position
      const playerPos = ecs.math.vec3.zero()
      world.transform.getWorldPosition(schema.playerEntity, playerPos)

      // Get special indicator position
      const indicatorPos = ecs.math.vec3.zero()
      world.transform.getWorldPosition(schema.specialIndicator, indicatorPos)

      // Calculate distance
      const dx = indicatorPos.x - playerPos.x
      const dy = indicatorPos.y - playerPos.y
      const dz = indicatorPos.z - playerPos.z
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

      // Check if within collision threshold
      if (distance <= data.specialIndicatorCollisionDistance) {
        console.log(`[checkpoint-manager] Special indicator collision detected! Distance: ${distance.toFixed(2)}m`)
        return true
      }

      return false
    }

    // Helper function to update arrow pointer rotation to point at current checkpoint or special indicator
    const updateArrowPointer = () => {
      const schema = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)

      if (!schema.arrowPointer) return  // No pointer configured

      // Determine target entity (special indicator or regular checkpoint)
      let targetEntity: ecs.Eid | null = null

      if (data.isSpecialIndicatorActive && schema.specialIndicator) {
        targetEntity = schema.specialIndicator
      } else {
        targetEntity = getCheckpointEntity(data.currentCheckpointIndex)
      }

      if (!targetEntity) return

      // Get jetski's world position
      const jetskiWorldPos = ecs.math.vec3.zero()
      world.transform.getWorldPosition(schema.playerEntity, jetskiWorldPos)

      // Copy jetski's X and Z world position to arrow, hard code Y to 5
      world.setPosition(schema.arrowPointer, jetskiWorldPos.x, jetskiWorldPos.y + 3, jetskiWorldPos.z)

      // Get target world position
      const targetWorldPos = ecs.math.vec3.zero()
      world.transform.getWorldPosition(targetEntity, targetWorldPos)

      // Calculate target yaw angle to point at target (in world space)
      const dx = targetWorldPos.x - jetskiWorldPos.x
      const dz = targetWorldPos.z - jetskiWorldPos.z
      const targetYaw = Math.atan2(dx, dz)

      // Smoothly interpolate current yaw toward target yaw
      data.pointerCurrentYaw = lerpAngle(data.pointerCurrentYaw, targetYaw, schema.pointerSmoothing)

      // Apply pure Y-axis rotation
      const yawQuat = quatFromYRotation(data.pointerCurrentYaw)
      world.setQuaternion(schema.arrowPointer, yawQuat[0], yawQuat[1], yawQuat[2], yawQuat[3])
    }

    // Helper function to update the gem counter UI
    const updateGemCounterUI = () => {
      const schema = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)

      if (!schema.gemCounterText) {
        return  // No gem counter UI configured
      }

      // Format gem count with leading zeros (e.g., "00", "01", "02")
      const formattedCount = String(data.gemCount).padStart(2, '0')

      // Update the UI text element with the current gem count
      ecs.Ui.mutate(world, schema.gemCounterText, (cursor) => {
        cursor.text = formattedCount
        return false  // Indicate that changes were made
      })

      console.log(`[checkpoint-manager] Updated gem counter UI to ${formattedCount}`)
    }

    // Helper function to advance to a random checkpoint or special indicator
    const advanceToNextCheckpoint = () => {
      const schema = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)
      const currentTime = world.time.elapsed

      // Prevent rapid multiple advances (cooldown of 1 second)
      if (currentTime - data.lastCheckpointAdvanceTime < 1.0) {
        console.log(`[checkpoint-manager] Checkpoint advance blocked by cooldown (${(currentTime - data.lastCheckpointAdvanceTime).toFixed(2)}s since last)`)
        return
      }

      // Track if we just caught a special indicator (before we change the flag)
      const justCaughtSpecialIndicator = data.isSpecialIndicatorActive
      
      // If we were in special indicator mode, deactivate it and continue to select next checkpoint
      if (justCaughtSpecialIndicator) {
        console.log('[checkpoint-manager] Special indicator caught!')
        
        // Play audio on special indicator
        if (schema.specialIndicator) {
          ecs.Audio.mutate(world, schema.specialIndicator, (cursor) => {
            cursor.paused = false
            cursor.pitch = 1
            return false  // Indicate that changes were made
          })
          console.log('[checkpoint-manager] Playing special indicator audio')
        }
        
        data.isSpecialIndicatorActive = false
        setFrogVisibility(false)
        
        // Show the active checkpoint indicator again
        if (schema.activeCheckpointIndicator) {
          world.getEntity(schema.activeCheckpointIndicator).show()
        }
        
        // IMPORTANT: Update lastCheckpointAdvanceTime immediately to prevent multiple rapid calls
        data.lastCheckpointAdvanceTime = currentTime
        
        // Continue to regular checkpoint logic to select and activate next checkpoint
        // The gem will be awarded in the regular logic below (+1 gem, not +10)
      }

      // Check if the NEXT checkpoint will trigger a special indicator (when gemCount+1 is a multiple of 10)
      // This is used to give +5 seconds bonus for the checkpoint that triggers the frog
      const nextGemCount = data.gemCount + 1
      const willActivateSpecialIndicator = !justCaughtSpecialIndicator && (nextGemCount > 0) && (nextGemCount % 10 === 0)

      if (willActivateSpecialIndicator) {
        // This checkpoint triggers the special indicator to appear
        // First, dispatch checkpoint-advanced event with +5 second bonus to show UI
        const previousIndex = data.currentCheckpointIndex
        
        console.log(`[checkpoint-manager] Checkpoint ${previousIndex} caught - triggering special indicator!`)
        console.log(`[checkpoint-manager] Time bonus: +5 seconds (special indicator trigger)`)
        
        // Play audio on active checkpoint indicator BEFORE hiding it
        if (schema.activeCheckpointIndicator) {
          ecs.Audio.mutate(world, schema.activeCheckpointIndicator, (cursor) => {
            cursor.paused = false
            cursor.pitch = 1
            return false  // Indicate that changes were made
          })
          console.log('[checkpoint-manager] Playing active checkpoint indicator audio (special indicator trigger)')
        }
        
        // Dispatch checkpoint-advanced event to show +5 seconds UI and add time to timer
        world.events.dispatch(world.events.globalId, 'checkpoint-advanced', {
          checkpointIndex: -1,  // Special indicator mode
          previousIndex,
          checkpointsCompleted: data.checkpointsCompleted + 1,
          distance: 0,  // No distance for special indicator
          timeBonus: 5,  // Fixed +5 seconds for triggering special indicator
        })
        
        // Now activate special indicator mode
        console.log(`[checkpoint-manager] *** SPECIAL INDICATOR ACTIVATED at ${data.gemCount} gems! ***`)
        
        // Hide previous checkpoint if there was one
        if (previousIndex !== -1) {
          animateCheckpointDown(previousIndex)
        }
        
        // Set special indicator as active
        data.isSpecialIndicatorActive = true
        data.currentCheckpointIndex = -1  // No regular checkpoint active
        
        // Hide the active checkpoint indicator
        if (schema.activeCheckpointIndicator) {
          world.getEntity(schema.activeCheckpointIndicator).hide()
        }
        
        // Increment frog appearance count and update its speed
        data.frogAppearanceCount++
        
        // Calculate new duration: starts at 30, gets 10% faster each time (30, 27, 24.3, 21.87, ...)
        // 10% faster means duration is multiplied by 0.9 each time
        const newDuration = 30 * Math.pow(0.9, data.frogAppearanceCount - 1)
        
        // Update the CurveAnimator duration on the frog entity
        if (schema.frog && CurveAnimator.has(world, schema.frog)) {
          CurveAnimator.mutate(world, schema.frog, (cursor) => {
            cursor.duration = newDuration
            return false  // Indicate that changes were made
          })
          console.log(`[checkpoint-manager] Updated frog speed - Appearance #${data.frogAppearanceCount}, Duration: ${newDuration.toFixed(2)}s`)
        }
        
        // Show the frog (special indicator is a child and will show automatically)
        setFrogVisibility(true)
        
        // Update advance time and checkpoint completed count
        data.checkpointsCompleted++
        data.lastCheckpointAdvanceTime = currentTime

        console.log(`[checkpoint-manager] Player must catch the frog's special indicator! Current gems: ${data.gemCount}`)

        // Dispatch special indicator event
        world.events.dispatch(world.events.globalId, 'special-indicator-activated', {
          gemCount: data.gemCount,
        })

        return
      }

      const previousIndex = data.currentCheckpointIndex

      // Animate the previous checkpoint down to y=-12
      if (previousIndex !== -1) {
        animateCheckpointDown(previousIndex)
      }

      // Get the world position of the current (previous) checkpoint
      const previousCheckpointEntity = getCheckpointEntity(previousIndex)
      const previousPos = ecs.math.vec3.zero()
      if (previousCheckpointEntity) {
        world.transform.getWorldPosition(previousCheckpointEntity, previousPos)
      }

      // Pick a random checkpoint that's different from the current one
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * data.totalCheckpoints)
      } while (newIndex === data.currentCheckpointIndex && data.totalCheckpoints > 1)

      // Get the world position of the new checkpoint
      const newCheckpointEntity = getCheckpointEntity(newIndex)
      const newPos = ecs.math.vec3.zero()
      if (newCheckpointEntity) {
        world.transform.getWorldPosition(newCheckpointEntity, newPos)
      }

      // Calculate distance between previous and new checkpoint
      const dx = newPos.x - previousPos.x
      const dy = newPos.y - previousPos.y
      const dz = newPos.z - previousPos.z
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

      // Determine time bonus
      let timeBonus: number
      
      if (justCaughtSpecialIndicator) {
        // Catching the frog always awards +10 seconds
        timeBonus = 10
      } else if (willActivateSpecialIndicator) {
        // Checkpoint that triggers the special indicator awards +5 seconds
        timeBonus = 5
      } else {
        // Regular checkpoints: scale time bonus based on distance range (1-4 seconds)
        // Closest checkpoints get 1 second, furthest get 4 seconds
        const minDist = data.minCheckpointDistance
        const maxDist = data.maxCheckpointDistance

        timeBonus = 1 // Default minimum
        if (maxDist > minDist) {
          // Linear interpolation: map distance from [minDist, maxDist] to [1, 4]
          const normalizedDistance = (distance - minDist) / (maxDist - minDist)
          timeBonus = 1 + normalizedDistance * 3  // 3 = (4 - 1)
        }

        // Round to nearest integer for cleaner display
        timeBonus = Math.round(timeBonus)
      }

      data.currentCheckpointIndex = newIndex
      data.checkpointsCompleted++
      
      // Always increment gem count by 1 (both regular checkpoints and special indicator give +1 gem)
      data.gemCount++
      
      // Only update lastCheckpointAdvanceTime if we didn't already update it for special indicator
      if (!justCaughtSpecialIndicator) {
        data.lastCheckpointAdvanceTime = currentTime
      }

      console.log(`[checkpoint-manager] Advanced from checkpoint ${previousIndex} to random checkpoint ${data.currentCheckpointIndex}`)
      console.log(`[checkpoint-manager] Distance between checkpoints: ${distance.toFixed(2)} units`)
      console.log(`[checkpoint-manager] Time bonus awarded: ${timeBonus.toFixed(2)} seconds`)
      console.log(`[checkpoint-manager] Total checkpoints completed: ${data.checkpointsCompleted}`)
      console.log(`[checkpoint-manager] Gems collected: ${data.gemCount}`)

      // Update the gem counter UI
      updateGemCounterUI()

      // Colliders remain in original positions - just log the change
      console.log(`[checkpoint-manager] Now looking for collision with checkpoint ${data.currentCheckpointIndex}`)

      // Play audio on active checkpoint indicator (for regular checkpoints, not special indicator)
      if (!justCaughtSpecialIndicator && schema.activeCheckpointIndicator) {
        ecs.Audio.mutate(world, schema.activeCheckpointIndicator, (cursor) => {
          cursor.paused = false
          cursor.pitch = 1
          return false  // Indicate that changes were made
        })
        console.log('[checkpoint-manager] Playing active checkpoint indicator audio')
      }
      
      // Animate the new active checkpoint up to y=0
      animateCheckpointUp(data.currentCheckpointIndex)

      // Animate the indicator to the new active checkpoint
      animateIndicatorToCheckpoint(data.currentCheckpointIndex)

      // Dispatch checkpoint-advanced event for other systems (e.g., countdown timer)
      world.events.dispatch(world.events.globalId, 'checkpoint-advanced', {
        checkpointIndex: data.currentCheckpointIndex,
        previousIndex,
        checkpointsCompleted: data.checkpointsCompleted,
        distance,  // Distance between checkpoints in world units
        timeBonus,  // Time to add to timer in seconds
      })

      // Check if we completed a lap
      if (data.currentCheckpointIndex === 0 && data.checkpointsCompleted > 0) {
        const lapNumber = Math.floor(data.checkpointsCompleted / data.totalCheckpoints)
        console.log(`[checkpoint-manager] Lap ${lapNumber} completed!`)
        world.events.dispatch(world.events.globalId, 'lap-completed', {
          lapNumber,
          totalCheckpoints: data.totalCheckpoints,
          checkpointsCompleted: data.checkpointsCompleted
        })
      }
    }

    // Handle collision events from checkpoint colliders
    const handleCheckpointCollisionStart = (checkpointIndex: number) => {
      return (event: any) => {
        const collisionData = event.data
        if (!collisionData || !collisionData.other) return

        const schema = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid) // Use cursor for consistent data access

        // Ignore checkpoints if game is not active
        if (!data.gameActive) {
          console.log(`[checkpoint-manager] Checkpoint collision ignored - game not active`)
          return
        }

        // Check if the collision is with the player entity
        if (collisionData.other !== schema.playerEntity) {
          return // Not a player collision, ignore
        }

        console.log(`[checkpoint-manager] Checkpoint collider ${checkpointIndex} detected collision with player!`)

        if (checkpointIndex === data.currentCheckpointIndex) {
          console.log(`[checkpoint-manager] Player reached correct checkpoint ${checkpointIndex} via collision!`)
          advanceToNextCheckpoint()
        } else {
          console.log(`[checkpoint-manager] Player hit checkpoint collider ${checkpointIndex}, but current active is ${data.currentCheckpointIndex} (wrong checkpoint)`)
        }
      }
    }


    ecs.defineState('initialize').initial()
      .onEnter(() => {
        const schema = schemaAttribute.get(eid)

        // Validate required entities
        if (!schema.playerEntity) {
          console.error('[checkpoint-manager] No player entity configured!')
          return
        }

        if (!schema.activeCheckpointIndicator) {
          console.error('[checkpoint-manager] No active checkpoint indicator entity configured!')
          return
        }

        if (!schema.ocean) {
          console.error('[checkpoint-manager] No ocean entity configured for wave synchronization!')
          return
        }

        // Count and validate checkpoints
        const totalCheckpoints = countCheckpoints()
        if (totalCheckpoints === 0) {
          console.error('[checkpoint-manager] No checkpoints configured!')
          return
        }

        // Initialize data
        const initialQuaternion = schema.arrowPointer ? ecs.Quaternion.get(world, schema.arrowPointer) : null
        const initialYaw = initialQuaternion ? Math.atan2(2 * (initialQuaternion.w * initialQuaternion.y + initialQuaternion.x * initialQuaternion.z), 1 - 2 * (initialQuaternion.y * initialQuaternion.y + initialQuaternion.z * initialQuaternion.z)) : 0

        dataAttribute.set(eid, {
          currentCheckpointIndex: 0,
          totalCheckpoints,
          checkpointsCompleted: 0,
          gemCount: 0,  // Initialize gem count to 0
          // Cooldown state
          lastCheckpointAdvanceTime: 0,
          // Game state
          gameActive: false,  // Start inactive, will be enabled by countdown timer
          // Audio pitch enforcement timing
          audioPitchEnforcementStartTime: world.time.elapsed,  // Start enforcing pitch now
          // Arrow pointer rotation
          pointerTargetYaw: initialYaw,
          pointerCurrentYaw: initialYaw,
          // Distance range (will be calculated next)
          minCheckpointDistance: 0,
          maxCheckpointDistance: 0,
          // Checkpoint animation state
          previousCheckpointIndex: -1,
          activeCheckpointAnimProgress: 0,
          previousCheckpointAnimProgress: 0,
          isAnimatingCheckpoints: false,
          // Special indicator state
          isSpecialIndicatorActive: false,
          specialIndicatorCollisionDistance: 5.0,  // 5 meter collision radius
          frogAppearanceCount: 0,  // Initialize frog appearance counter
        })

        // Set audio pitch to 1 and unpause immediately
        if (ecs.Audio.has(world, eid)) {
          ecs.Audio.mutate(world, eid, (cursor) => {
            cursor.pitch = 1
            cursor.paused = false
            return false  // Indicate that changes were made
          })
          console.log('[checkpoint-manager] Set audio pitch=1 and paused=false on System_GameManager entity')
        }

        // Hide frog initially
        setFrogVisibility(false)
        
        // Ensure active checkpoint indicator is visible at start
        if (schema.activeCheckpointIndicator) {
          world.getEntity(schema.activeCheckpointIndicator).show()
        }
        
        // Initialize all checkpoints to y=-12
        initializeCheckpointPositions()

        // Animate the first checkpoint up to y=0
        animateCheckpointUp(0)

        // Calculate min/max distances between all checkpoints for time bonus scaling
        calculateDistanceRange()

        console.log(`[checkpoint-manager] Initialized with ${totalCheckpoints} checkpoints`)
        console.log(`[checkpoint-manager] Player entity ID: ${schema.playerEntity}`)
        console.log(`[checkpoint-manager] Active checkpoint entity ID: ${getCheckpointEntity(0)}`)

        // Position indicator at first checkpoint (immediate, no animation)
        positionActiveIndicatorImmediate(0)

        // Initialize gem counter UI
        updateGemCounterUI()

        // Log all collider positions (they stay in their original scene positions)
        logColliderPositions()

        // Validate all entities exist before setting up collision listeners
        console.log('[checkpoint-manager] Validating entities before collision setup:')
        console.log(`  - Player entity (${schema.playerEntity}): ${schema.playerEntity ? 'EXISTS' : 'MISSING'}`)

        let validColliders = 0
        for (let i = 0; i < totalCheckpoints; i++) {
          const colliderEntity = getCheckpointCollider(i)
          console.log(`  - Checkpoint collider ${i} (${colliderEntity}): ${colliderEntity ? 'EXISTS' : 'MISSING'}`)
          if (colliderEntity) validColliders++
        }

        if (validColliders === 0) {
          console.error('[checkpoint-manager] NO VALID CHECKPOINT COLLIDERS FOUND! Cannot set up collision detection.')
          return
        }

        // Set up collision listeners on each checkpoint collider
        for (let i = 0; i < totalCheckpoints; i++) {
          const colliderEntity = getCheckpointCollider(i)
          if (colliderEntity) {
            const handler = handleCheckpointCollisionStart(i)
            world.events.addListener(colliderEntity, ecs.physics.COLLISION_START_EVENT, handler)
            console.log(`[checkpoint-manager] ✓ Collision listener attached to checkpoint collider ${i} (entity: ${colliderEntity})`)
          } else {
            console.warn(`[checkpoint-manager] ✗ Skipping checkpoint collider ${i} - entity not found`)
          }
        }

        // ALSO try listening on the player entity as a backup
        const playerCollisionHandler = (event: any) => {
          console.log('[checkpoint-manager] DEBUG: Player entity collision detected!', {
            other: event.data?.other,
            playerEntity: schema.playerEntity
          })

          if (event.data?.other) {
            // Check if collision is with any checkpoint collider
            for (let i = 0; i < totalCheckpoints; i++) {
              if (getCheckpointCollider(i) === event.data.other) {
                console.log(`[checkpoint-manager] Player-side detection: collision with checkpoint collider ${i}`)
                break
              }
            }
          }
        }
        world.events.addListener(schema.playerEntity, ecs.physics.COLLISION_START_EVENT, playerCollisionHandler)

        console.log('[checkpoint-manager] Collision system initialized with hybrid approach')
        console.log(`[checkpoint-manager] - Collision listeners on ${validColliders} checkpoint colliders`)
        console.log(`[checkpoint-manager] - Backup listener on player entity (${schema.playerEntity})`)
        console.log(`[checkpoint-manager] - Distance-based fallback enabled for debugging`)
        console.log(`[checkpoint-manager] - Both collision and distance detection will be logged`)
        console.log(`[checkpoint-manager] - If no collision events fire, distance detection will serve as fallback`)

        // Listen for controls-enabled event to activate checkpoint detection
        world.events.addListener(world.events.globalId, 'controls-enabled', () => {
          const data = dataAttribute.cursor(eid)
          data.gameActive = true
          console.log('[checkpoint-manager] Checkpoint detection activated')
        })

        // Listen for countdown-complete event to deactivate checkpoint detection
        world.events.addListener(world.events.globalId, 'countdown-complete', () => {
          const data = dataAttribute.cursor(eid)
          data.gameActive = false
          console.log('[checkpoint-manager] Checkpoint detection deactivated - game over')
        })

        // Listen for game restart event
        world.events.addListener(world.events.globalId, 'game-restart', () => {
          console.log('[checkpoint-manager] Game restart - resetting checkpoint tracking')
          const data = dataAttribute.cursor(eid)

          // Reset checkpoint tracking
          data.currentCheckpointIndex = 0
          data.checkpointsCompleted = 0
          data.gemCount = 0  // Reset gem count
          data.lastCheckpointAdvanceTime = 0
          data.gameActive = false  // Will be reactivated when controls are enabled
          data.isSpecialIndicatorActive = false  // Reset special indicator state
          data.frogAppearanceCount = 0  // Reset frog appearance counter
          data.audioPitchEnforcementStartTime = world.time.elapsed  // Restart pitch enforcement timer
          
          // Reset frog speed to initial duration (30 seconds)
          if (schema.frog && CurveAnimator.has(world, schema.frog)) {
            CurveAnimator.mutate(world, schema.frog, (cursor) => {
              cursor.duration = 30
              return false
            })
            console.log('[checkpoint-manager] Reset frog duration to 30s')
          }

          // Reset audio pitch to 1 and unpause during restart
          if (ecs.Audio.has(world, eid)) {
            ecs.Audio.mutate(world, eid, (cursor) => {
              cursor.pitch = 1
              cursor.paused = false
              return false  // Indicate that changes were made
            })
            console.log('[checkpoint-manager] Reset audio pitch=1 and paused=false on System_GameManager entity during restart')
          }

          // Hide frog on restart
          setFrogVisibility(false)
          
          // Ensure active checkpoint indicator is visible on restart
          if (schema.activeCheckpointIndicator) {
            world.getEntity(schema.activeCheckpointIndicator).show()
          }
          
          // Reset all checkpoints to y=-12
         initializeCheckpointPositions()

          // Animate first checkpoint up to y=0
          animateCheckpointUp(0)

          // Position indicator at first checkpoint
          positionActiveIndicatorImmediate(0)

          // Reset gem counter UI
          updateGemCounterUI()

          console.log('[checkpoint-manager] Checkpoint tracking reset to checkpoint 0')
        })
      })
      .onTick(() => {
        const data = dataAttribute.cursor(eid)

        // Continuously enforce pitch = 1 on the audio component
        // This prevents any external changes from affecting the pitch
        if (ecs.Audio.has(world, eid)) {
          ecs.Audio.mutate(world, eid, (cursor) => {
            if (cursor.pitch !== 1) {
              console.log(`[checkpoint-manager] Correcting pitch from ${cursor.pitch} to 1`)
              cursor.pitch = 1
            }
            return false  // Always indicate changes were made to force update
          })
        }

        // Check for special indicator distance-based collision
        if (data.isSpecialIndicatorActive && data.gameActive) {
          if (checkSpecialIndicatorDistance()) {
            console.log('[checkpoint-manager] Player caught the special indicator!')
            advanceToNextCheckpoint()
          }
        }

        // Update arrow pointer to point at current checkpoint or special indicator
        updateArrowPointer()
      })
    // .onExit(() => {
    //   // Clean up collision listeners
    //   const schema = schemaAttribute.get(eid)
    //   const data = dataAttribute.cursor(eid)

    //   for (let i = 0; i < data.totalCheckpoints; i++) {
    //     const colliderEntity = getCheckpointCollider(i)
    //     if (colliderEntity) {
    //       world.events.removeListener(colliderEntity, ecs.physics.COLLISION_START_EVENT, handleCheckpointCollisionStart(i))
    //     }
    //   }
    // })
  },
})

export { checkpointManager }