import * as ecs from '@8thwall/ecs'
import {jetskiController} from './jetski-controller'

const {THREE} = window as any

ecs.registerComponent({
  name: 'Random Scale Animator',
  schema: {
    minScale: ecs.f32,  // Minimum scale value
    maxScale: ecs.f32,  // Maximum scale value
    animationSpeed: ecs.f32,  // Speed of scale transitions
    smoothness: ecs.f32,  // Smoothness factor (lerp amount per frame)
    jetskiEntity: ecs.eid,  // Reference to jetski entity for velocity tracking
  },
  schemaDefaults: {
    minScale: 0.8,
    maxScale: 1.2,
    animationSpeed: 1.0,
    smoothness: 0.1,
  },
  data: {
    targetScaleX: ecs.f32,  // Target scale X
    targetScaleY: ecs.f32,  // Target scale Y
    targetScaleZ: ecs.f32,  // Target scale Z (from random animation)
    currentScaleX: ecs.f32,  // Current interpolated scale X
    currentScaleY: ecs.f32,  // Current interpolated scale Y
    currentScaleZ: ecs.f32,  // Current interpolated scale Z (from random animation)
    currentVelocityZ: ecs.f32,  // Current Z-axis scale based on velocity (0-2)
    isInitialized: ecs.boolean,  // Track if initial values are set
    lastJetskiX: ecs.f32,  // Last jetski X position for velocity calculation
    lastJetskiZ: ecs.f32,  // Last jetski Z position for velocity calculation
    isVisible: ecs.boolean,  // Track current visibility state
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    // Listen for boost events from jetski
    world.events.addListener(world.events.globalId, 'boost-activated', () => {
      const data = dataAttribute.cursor(eid)
      if (!data.isVisible) {
        data.isVisible = true
        // Restore scale values when showing
        const scale = ecs.Scale.get(world, eid)
        if (scale.x === 0) {
          data.currentScaleX = 1.0
          data.currentScaleY = 1.0
        }
        console.log('[Random Scale] Shown - boosting via event!')
      }
    })
    
    world.events.addListener(world.events.globalId, 'boost-deactivated', () => {
      const data = dataAttribute.cursor(eid)
      if (data.isVisible) {
        data.isVisible = false
        console.log('[Random Scale] Hidden - boost ended via event')
      }
    })
    
    // Helper function to generate random scale value
    const getRandomScale = (min: number, max: number) => {
      return min + Math.random() * (max - min)
    }

    // Helper function to pick new random target scales
    const pickNewTargets = () => {
      const {minScale, maxScale} = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)
      
      data.targetScaleX = getRandomScale(minScale, maxScale)
      data.targetScaleY = getRandomScale(minScale, maxScale)
      data.targetScaleZ = getRandomScale(minScale, maxScale)
      
      // console.log(`New scale targets: X=${data.targetScaleX.toFixed(2)}, Y=${data.targetScaleY.toFixed(2)}, Z=${data.targetScaleZ.toFixed(2)}`)
    }

    // Helper function to check if current scale is close to target
    const isCloseToTarget = (threshold: number = 0.02) => {
      const data = dataAttribute.get(eid)
      
      const diffX = Math.abs(data.currentScaleX - data.targetScaleX)
      const diffY = Math.abs(data.currentScaleY - data.targetScaleY)
      const diffZ = Math.abs(data.currentScaleZ - data.targetScaleZ)
      
      return diffX < threshold && diffY < threshold && diffZ < threshold
    }

    // State: Animating - continuously animate scale
    ecs.defineState('animating')
      .initial()
      .onEnter(() => {
        const data = dataAttribute.cursor(eid)
        const {jetskiEntity} = schemaAttribute.get(eid)
        
        // Initialize with current scale if not already initialized
        if (!data.isInitialized) {
          const scale = ecs.Scale.get(world, eid)
          data.currentScaleX = scale.x
          data.currentScaleY = scale.y
          data.currentScaleZ = scale.z
          data.isInitialized = true
          data.isVisible = false
          
          // Hide entity initially by setting scale to 0
          ecs.Scale.set(world, eid, {x: 0, y: 0, z: 0})
          
          // Initialize jetski position tracking
          if (jetskiEntity && jetskiController.has(world, jetskiEntity)) {
            const jetskiPos = ecs.Position?.get?.(world, jetskiEntity)
            if (jetskiPos) {
              data.lastJetskiX = jetskiPos.x
              data.lastJetskiZ = jetskiPos.z
            }
          }
          
          // Pick initial random targets
          pickNewTargets()
        }
      })
      .onTick(() => {
        const {smoothness, animationSpeed, jetskiEntity} = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid)
        
        // Adjust smoothness based on animation speed
        const adjustedSmoothness = smoothness * animationSpeed
        
        // Smoothly interpolate current scale towards target (X and Y only for random animation)
        data.currentScaleX = THREE.MathUtils.lerp(data.currentScaleX, data.targetScaleX, adjustedSmoothness)
        data.currentScaleY = THREE.MathUtils.lerp(data.currentScaleY, data.targetScaleY, adjustedSmoothness)
        data.currentScaleZ = THREE.MathUtils.lerp(data.currentScaleZ, data.targetScaleZ, adjustedSmoothness)
        
        // Calculate velocity-based Z-axis scale (0-2 based on speed)
        let velocityBasedScaleZ = data.currentScaleZ  // Default to random animation value
        
        if (jetskiEntity && jetskiEntity !== BigInt(0) && jetskiController.has(world, jetskiEntity)) {
          const jetskiPos = ecs.Position?.get?.(world, jetskiEntity)
          const jetskiSchema = jetskiController.get(world, jetskiEntity)
          
          if (jetskiPos) {
            // Initialize position tracking if needed
            if (data.lastJetskiX === 0 && data.lastJetskiZ === 0) {
              data.lastJetskiX = jetskiPos.x
              data.lastJetskiZ = jetskiPos.z
            }
            
            // Handle visibility based on boost state (now controlled by events)
            if (!data.isVisible) {
              // Not boosting - hide entity by setting all scales to 0
              velocityBasedScaleZ = 0
              // Force all scales to 0 when not boosting
              data.currentScaleX = 0
              data.currentScaleY = 0
              data.currentVelocityZ = 0
            } else {
              // Boosting - show entity and calculate velocity-based scale
              const deltaX = jetskiPos.x - data.lastJetskiX
              const deltaZ = jetskiPos.z - data.lastJetskiZ
              const deltaTime = Math.max(world.time.delta / 1000, 0.001)
              const currentSpeed = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ) / deltaTime
              
              // Map speed to 0-2 scale
              const baseSpeed = jetskiSchema.speed || 10.0
              const maxSpeed = baseSpeed * 2  // Boost doubles speed
              
              // Normalize to 0-1 range, then scale to 0-2
              const normalizedSpeed = Math.min(currentSpeed / maxSpeed, 1.0)
              velocityBasedScaleZ = normalizedSpeed * 2.0
              
              // Debug log
              console.log(`[Random Scale] Boosting! Speed: ${currentSpeed.toFixed(2)}, Z-Scale: ${velocityBasedScaleZ.toFixed(2)}`)
            }
            
            // Store current position for next frame
            data.lastJetskiX = jetskiPos.x
            data.lastJetskiZ = jetskiPos.z
          }
        }
        
        // Fast and snappy velocity-based Z scale (higher value = faster/snappier)
        const velocitySmoothing = 0.5  // Increased from 0.15 for fast, snappy response
        data.currentVelocityZ = THREE.MathUtils.lerp(data.currentVelocityZ, velocityBasedScaleZ, velocitySmoothing)
        
        // Apply the interpolated scale to the entity
        // When hidden, all scales are 0
        // When visible: X and Y use random animation, Z uses velocity-based scaling
        if (jetskiEntity && jetskiEntity !== BigInt(0)) {
          // Using jetski velocity mode
          ecs.Scale.set(world, eid, {
            x: data.isVisible ? data.currentScaleX : 0,
            y: data.isVisible ? data.currentScaleY : 0,
            z: data.currentVelocityZ,
          })
        } else {
          // Default random animation mode (no jetski tracking)
          ecs.Scale.set(world, eid, {
            x: data.currentScaleX,
            y: data.currentScaleY,
            z: data.currentScaleZ,
          })
        }
        
        // Check if we've reached the target, pick new random targets
        if (isCloseToTarget()) {
          pickNewTargets()
        }
      })
  },
})