import * as ecs from '@8thwall/ecs'
import {jetskiController} from './jetski-controller'

const boundaryEnforcer = ecs.registerComponent({
  name: 'boundary-enforcer',
  schema: {
    // Radius in units from center (0,0,0) that entities are allowed to move within
    boundaryRadius: ecs.f32,
    // Whether to apply velocity damping when hitting boundary (reduces bounce-back)
    dampVelocity: ecs.boolean,
    // Velocity damping factor when hitting boundary (0 = full stop, 1 = no damping)
    dampingFactor: ecs.f32,
  },
  schemaDefaults: {
    boundaryRadius: 250,
    dampVelocity: true,
    dampingFactor: 0.1,  // Aggressive damping to prevent bouncing
  },
  data: {
    lastValidX: ecs.f32,  // Store last valid position for fallback
    lastValidZ: ecs.f32,
    wasOutside: ecs.boolean,  // Track if we were outside boundary last frame
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute, defineState}) => {
    // Helper function to calculate 2D distance from center
    const getDistanceFromCenter = (x: number, z: number): number => {
      return Math.sqrt(x * x + z * z)
    }

    // Helper function to clamp position to boundary circle
    const clampToBoundary = (x: number, z: number, radius: number): {x: number, z: number} => {
      const distance = getDistanceFromCenter(x, z)
      
      if (distance <= radius) {
        // Within boundary - no clamping needed
        return {x, z}
      }
      
      // Outside boundary - project position onto boundary circle
      const scale = radius / distance
      return {
        x: x * scale,
        z: z * scale,
      }
    }

    // Helper function to stop outward velocity when at boundary
    const dampOutwardVelocity = (
      x: number,
      z: number,
      velocityX: number,
      velocityZ: number,
      dampingFactor: number
    ): {velocityX: number, velocityZ: number} => {
      // Calculate direction from center to current position
      const distance = getDistanceFromCenter(x, z)
      if (distance < 0.001) {
        // Too close to center to determine direction reliably
        return {velocityX, velocityZ}
      }
      
      const dirX = x / distance
      const dirZ = z / distance
      
      // Calculate dot product of velocity with outward direction
      const outwardVelocity = velocityX * dirX + velocityZ * dirZ
      
      if (outwardVelocity <= 0) {
        // Velocity is already pointing inward or parallel - no damping needed
        return {velocityX, velocityZ}
      }
      
      // Damp only the outward component of velocity
      // Preserve tangential (parallel to boundary) velocity for sliding along edge
      const tangentX = -dirZ  // Perpendicular to outward direction
      const tangentZ = dirX
      const tangentialVelocity = velocityX * tangentX + velocityZ * tangentZ
      
      // Reconstruct velocity: strongly damped outward + full tangential
      const dampedOutward = outwardVelocity * dampingFactor
      const newVelocityX = dampedOutward * dirX + tangentialVelocity * tangentX
      const newVelocityZ = dampedOutward * dirZ + tangentialVelocity * tangentZ
      
      return {
        velocityX: newVelocityX,
        velocityZ: newVelocityZ,
      }
    }

    // State: active - Continuously monitor and enforce boundary
    defineState('active')
      .initial()
      .onEnter(() => {
        // Initialize last valid position to current position
        const pos = ecs.Position?.get?.(world, eid)
        if (pos) {
          dataAttribute.set(eid, {
            lastValidX: pos.x,
            lastValidZ: pos.z,
            wasOutside: false,
          })
          console.log(`[boundary-enforcer] Initialized with position (${pos.x.toFixed(2)}, ${pos.z.toFixed(2)})`)
        }
      })
      .onTick(() => {
        const {boundaryRadius, dampVelocity, dampingFactor} = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid)
        
        // Get current position
        const pos = ecs.Position?.get?.(world, eid)
        if (!pos) {
          console.warn('[boundary-enforcer] No Position component found on entity')
          return
        }
        
        const {x, y, z} = pos
        
        // Calculate distance from center (ignoring Y axis)
        const distanceFromCenter = getDistanceFromCenter(x, z)
        
        // Check if entity is outside boundary
        if (distanceFromCenter > boundaryRadius) {
          // Entity is outside boundary - clamp position
          const clampedPos = clampToBoundary(x, z, boundaryRadius)
          
          // Log boundary violation
          if (!data.wasOutside) {
            console.log(`[boundary-enforcer] Entity exceeded boundary! Distance: ${distanceFromCenter.toFixed(2)} > ${boundaryRadius}`)
            data.wasOutside = true
          }
          
          // Update position to clamped value
          world.setPosition(eid, clampedPos.x, y, clampedPos.z)
          
          // Damp velocity if enabled and entity has jetski controller
          if (dampVelocity && jetskiController.has(world, eid)) {
            const jetskiData = jetskiController.get(world, eid) as any
            
            // Damp outward velocity components
            const dampedVelocity = dampOutwardVelocity(
              clampedPos.x,
              clampedPos.z,
              jetskiData.velocityX,
              jetskiData.velocityZ,
              dampingFactor
            )
            
            // Update jetski velocities using cursor for direct write access
            const jetskiCursor = jetskiController.cursor(world, eid) as any
            jetskiCursor.velocityX = dampedVelocity.velocityX
            jetskiCursor.velocityZ = dampedVelocity.velocityZ
            
            // Also damp lateral kick velocities (rear kick physics)
            const dampedKick = dampOutwardVelocity(
              clampedPos.x,
              clampedPos.z,
              jetskiData.lateralKickVelocityX,
              jetskiData.lateralKickVelocityZ,
              dampingFactor
            )
            
            jetskiCursor.lateralKickVelocityX = dampedKick.velocityX
            jetskiCursor.lateralKickVelocityZ = dampedKick.velocityZ
          }
          
          // Store clamped position as last valid position
          data.lastValidX = clampedPos.x
          data.lastValidZ = clampedPos.z
        } else {
          // Entity is within boundary - update last valid position
          data.lastValidX = x
          data.lastValidZ = z
          
          // Reset outside flag if entity has moved back inside
          if (data.wasOutside) {
            console.log(`[boundary-enforcer] Entity returned within boundary at distance ${distanceFromCenter.toFixed(2)}`)
            data.wasOutside = false
          }
        }
      })
  },
})

export {boundaryEnforcer}