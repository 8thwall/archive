import * as ecs from '@8thwall/ecs'
import {jetskiController} from './jetski-controller'

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

// Build a quaternion that applies only pitch (X) and roll (Z) from a surface "up" vector.
// No yaw component is introduced here.
function quatFromUp(nx: number, ny: number, nz: number) {
  // Derive small-angle pitch/roll that tip +Y toward (nx,ny,nz)
  const pitch = Math.atan2(-nz, ny)  // rotation around X
  const roll = Math.atan2(nx, ny)    // rotation around Z

  const ph = pitch / 2
  const rh = roll / 2

  // X rotation
  const pitchQuat: number[] = [Math.sin(ph), 0, 0, Math.cos(ph)]
  // Z rotation
  const rollQuat: number[] = [0, 0, Math.sin(rh), Math.cos(rh)]

  // Apply pitch then roll (local space)
  return quatMultiply(rollQuat, pitchQuat)
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

// Extract *pure* Y twist from a quaternion via swing–twist decomposition about the Y axis.
// This isolates heading (yaw) without contamination from pitch/roll.
function extractYTwistAngle(qx: number, qy: number, qz: number, qw: number) {
  // Project vector part onto Y axis
  const dot = qy  // (x,y,z) · (0,1,0)
  // Twist quaternion has only Y in vector part; normalize [0, dot, 0, w]
  const mag = Math.hypot(qw, dot)
  if (mag < 1e-9) return 0
  const ty = dot / mag
  const tw = qw / mag
  // Angle = 2 * atan2(y, w) for [0, y, 0, w]
  return 2 * Math.atan2(ty, tw)
}

const waveHeightSync = ecs.registerComponent({
  name: 'wave-height-sync',
  schema: {
    ocean: ecs.eid,
    verticalOffset: ecs.f32,
    orientWithWave: ecs.boolean,
    // @condition orientWithWave=true
    waveInfluence: ecs.f32,  // 0..1 influence of wave tilt
    // @condition orientWithWave=true
    smoothing: ecs.f32,  // 0..1 smoothing factor
    // @condition orientWithWave=true
    lockYAxis: ecs.boolean,  // Lock Y-axis rotation when true
  },
  schemaDefaults: {
    verticalOffset: 0,
    orientWithWave: true,
    waveInfluence: 0.2,
    smoothing: 0.3,
    lockYAxis: false,
  },
  data: {
    lastHeading: ecs.f32,  // stored pure Y twist
    lastPitch: ecs.f32,
    lastRoll: ecs.f32,
    preservedHeading: ecs.f32,  // Y rotation to preserve when lockYAxis is true
    lockWasEnabled: ecs.boolean,  // track previous lock state
    lastWaveY: ecs.f32,  // Track the last wave height to detect jumps
    wasJumping: ecs.boolean,  // Track if we were jumping in the previous frame
    landingTransitionFrames: ecs.i32,  // Count frames since landing for smooth transition
  },

  tick: (world, component) => {
    const {eid, data} = component
    const cfg = waveHeightSync.get(world, eid)
    if (!cfg.ocean) {
      console.warn('[wave-height-sync] No ocean entity set!', {eid, cfg})
      return
    }

    const pos = ecs.Position?.get?.(world, eid)
    if (!pos) {
      console.warn('[wave-height-sync] No Position component on entity', eid)
      return
    }
    const {x, y, z} = pos

    // Wave params (static defaults; wire these to a shader or config as needed)
    const rippleHeight = 1
    const rippleFreq = 0.15
    const rippleSpeed = 0.001
    const rippleMod = 0

    const uTimeMs = world.time.elapsed * 0.8
    const t = uTimeMs * rippleSpeed

    const expectedWaveY =
      getWaveHeight(x, z, t, rippleHeight, rippleFreq, rippleSpeed, rippleMod) +
      cfg.verticalOffset

    // Check if the entity has a jetski controller and is currently jumping
    let isJumping = false

    // Primary detection: Check if entity is significantly above expected wave height
    const jumpThreshold = 0.5  // Units above wave to consider as jumping
    if (y > expectedWaveY + jumpThreshold) {
      isJumping = true
    }

    // Position-based detection should be sufficient for jump detection
    // The height threshold check above handles jump detection reliably

    // Handle jumping state changes and transitions
    if (isJumping) {
      // Currently jumping - reset any landing transition state
      if (data.wasJumping === false || data.landingTransitionFrames > 0) {
        // New jump started or jump continuing - reset landing transition
        data.landingTransitionFrames = 0
      }

      // Store the last wave height for smooth landing transition
      data.lastWaveY = expectedWaveY
      data.wasJumping = true
      return  // Skip all wave height updates while jumping
    }

    // Not jumping - check if we just landed
    const justLanded = data.wasJumping && !isJumping
    if (justLanded) {
      data.landingTransitionFrames = 0  // Start landing transition
    }

    // Handle landing transition - smooth transition back to wave following
    const maxLandingFrames = 15  // Reduced to ~0.25 seconds at 60fps for faster recovery
    const inLandingTransition = data.wasJumping || (data.landingTransitionFrames >= 0 && data.landingTransitionFrames < maxLandingFrames)

    if (inLandingTransition) {
      // We're in landing transition mode
      data.landingTransitionFrames = Math.max(0, data.landingTransitionFrames || 0) + 1

      // More aggressive smoothing for quicker transition back to wave height
      const transitionProgress = Math.min(data.landingTransitionFrames / maxLandingFrames, 1.0)
      const landingSmoothing = 0.25 + (transitionProgress * 0.25)  // Start aggressive (25%), end moderate (50%)

      // Always move toward the expected wave height during landing transition
      const smoothedY = y + (expectedWaveY - y) * landingSmoothing
      world.setPosition(eid, x, smoothedY, z)

      // Update state
      data.wasJumping = false
      data.lastWaveY = smoothedY

      // Continue with normal wave orientation if enabled, but don't set position again
      if (cfg.orientWithWave) {
        // Continue to the wave orientation logic below, but skip position setting
      } else {
        return  // Skip normal wave height setting since we already set position
      }
    } else {
      // Normal wave following mode - ensure clean state
      data.wasJumping = false
      data.landingTransitionFrames = -1  // Use -1 to indicate not in transition
    }

    // Use the already calculated wave height
    const nextY = expectedWaveY

    if (cfg.orientWithWave) {
      // Read current heading as *pure Y twist* (not Euler yaw)
      const currentQuat = ecs.Quaternion?.get?.(world, eid)
      let currentHeading = data.lastHeading || 0

      if (currentQuat) {
        currentHeading = extractYTwistAngle(
          currentQuat.x,
          currentQuat.y,
          currentQuat.z,
          currentQuat.w
        )
        data.lastHeading = currentHeading
      }

      // Handle Y-axis locking
      if (cfg.lockYAxis) {
        // If lock was just enabled, capture the current heading
        if (!data.lockWasEnabled) {
          data.preservedHeading = currentHeading
          data.lockWasEnabled = true
        } else {
          // Check if another component changed the Y rotation
          // Handle angle wrapping properly
          let headingDifference = currentHeading - data.preservedHeading
          while (headingDifference > Math.PI) headingDifference -= 2 * Math.PI
          while (headingDifference < -Math.PI) headingDifference += 2 * Math.PI

          const threshold = 0.01  // Increased threshold to better ignore wave-induced drift

          if (Math.abs(headingDifference) > threshold) {
            // External component changed Y rotation, update our preserved value
            data.preservedHeading = currentHeading
          }
        }
        // Use the preserved heading (which may have been updated by external changes)
        currentHeading = data.preservedHeading
      } else {
        // Lock is disabled - reset state and allow normal behavior
        data.lockWasEnabled = false
        data.preservedHeading = currentHeading
      }

      // Estimate surface normal via central differences
      const eps = 0.02
      const y_dx =
        getWaveHeight(x + eps, z, t, rippleHeight, rippleFreq, rippleSpeed, rippleMod) -
        getWaveHeight(x - eps, z, t, rippleHeight, rippleFreq, rippleSpeed, rippleMod)
      const y_dz =
        getWaveHeight(x, z + eps, t, rippleHeight, rippleFreq, rippleSpeed, rippleMod) -
        getWaveHeight(x, z - eps, t, rippleHeight, rippleFreq, rippleSpeed, rippleMod)

      // Raw local pitch/roll from slopes (scaled by influence)
      let rawPitch = (-y_dz / (2 * eps)) * cfg.waveInfluence  // X-rotation
      let rawRoll = (-y_dx / (2 * eps)) * cfg.waveInfluence  // Z-rotation

      // Clamp extremes
      const maxAngle = 0.35  // ~20°
      rawPitch = Math.max(-maxAngle, Math.min(maxAngle, rawPitch))
      rawRoll = Math.max(-maxAngle, Math.min(maxAngle, rawRoll))

      // Smooth
      const s = Math.max(0, Math.min(1, cfg.smoothing))
      const dampedPitch = data.lastPitch + (rawPitch - data.lastPitch) * s
      const dampedRoll = data.lastRoll + (rawRoll - data.lastRoll) * s
      data.lastPitch = dampedPitch
      data.lastRoll = dampedRoll

      // Build an approximate normal from damped pitch/roll and normalize
      let nx = Math.sin(dampedRoll)
      let ny = 1
      let nz = Math.sin(dampedPitch)
      const length = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
      nx /= length; ny /= length; nz /= length

      let finalQuat: number[]

      if (cfg.lockYAxis) {
        // When Y-axis is locked, construct quaternion more directly to avoid any drift
        // Apply pitch and roll rotations while preserving exact Y rotation
        const yQuat = quatFromYRotation(currentHeading)
        const prQuat = quatFromPitchRoll(dampedPitch, dampedRoll)

        // Apply Y rotation first, then pitch/roll in world space
        finalQuat = quatMultiply(prQuat, yQuat)
      } else {
        // Normal behavior: wave tilt with preserved heading
        const waveQuat = quatFromPitchRoll(dampedPitch, dampedRoll)
        const headingQuat = quatFromYRotation(currentHeading)

        // Compose: apply heading first (local space), then tilt (no Y twist)
        finalQuat = quatMultiply(headingQuat, waveQuat)
      }

      if (Number.isFinite(nextY)) {
        // Only set position if we're not in landing transition (to avoid conflicts)
        if (!inLandingTransition) {
          world.setPosition(eid, x, nextY, z)
        }
        world.setQuaternion(eid, finalQuat[0], finalQuat[1], finalQuat[2], finalQuat[3])
        // world.setPosition / setQuaternion are the supported transform setters in Studio.
        // (Kept here for clarity on API usage.)
      } else {
        console.warn('[wave-height-sync] Non-finite nextY', {x, z, nextY})
      }
    } else if (Number.isFinite(nextY) && !inLandingTransition) {
      // Only set position if we're not in landing transition
      world.setPosition(eid, x, nextY, z)
    } else if (!Number.isFinite(nextY)) {
      console.warn('[wave-height-sync] Non-finite nextY', {x, z, nextY})
    }
  },
})

export {waveHeightSync}
