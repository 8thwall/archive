import * as ecs from '@8thwall/ecs'
import {jetskiController} from './jetski-controller'

const boxCollider = ecs.registerComponent({
  name: 'box-collider',
  schema: {
    // Auto-calculate dimensions from mesh bounding box
    autoSize: ecs.boolean,
    // Extra height to add to autoSize collider (makes it taller)
    // @condition autoSize=true
    extraHeight: ecs.f32,
    // Dimensions of the bounding box (used when autoSize is false)
    // @condition autoSize=false
    boxWidth: ecs.f32,
    // @condition autoSize=false
    boxHeight: ecs.f32,
    // @condition autoSize=false
    boxDepth: ecs.f32,
    // Position offset from entity position (used when autoSize is false)
    // @condition autoSize=false
    offsetX: ecs.f32,
    // @condition autoSize=false
    offsetY: ecs.f32,
    // @condition autoSize=false
    offsetZ: ecs.f32,
    // Whether to use rotation-aware collision detection (needed for rotating entities)
    rotationAware: ecs.boolean,
    // Whether to apply velocity damping when hitting boundary
    dampVelocity: ecs.boolean,
    // Velocity damping factor when hitting boundary (0 = full stop, 1 = no damping)
    dampingFactor: ecs.f32,
    // Debug visualization (optional)
    debugVisualization: ecs.boolean,
  },
  schemaDefaults: {
    autoSize: true,
    extraHeight: 3.0,  // Add 3 units to height by default
    boxWidth: 0,
    boxHeight: 0,
    boxDepth: 0,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotationAware: false,
    dampVelocity: true,
    dampingFactor: 0.1,  // Aggressive damping to prevent bouncing
    debugVisualization: false,
  },
  data: {
    // Track jetski entity ID
    jetskiEid: ecs.eid,
    // Track if entity was colliding last frame
    wasColliding: ecs.boolean,
    // Debug visualization entity
    debugBoxEid: ecs.eid,
    // Store calculated dimensions when autoSize is true
    calculatedWidth: ecs.f32,
    calculatedHeight: ecs.f32,
    calculatedDepth: ecs.f32,
    // Store the actual center of the bounding box (may differ from entity position)
    boxCenterX: ecs.f32,
    boxCenterY: ecs.f32,
    boxCenterZ: ecs.f32,
    // Track if auto-sizing has been successfully calculated
    autoSizeCalculated: ecs.boolean,
    // Store offset from entity position to box center (for autoSize mode)
    offsetFromEntityX: ecs.f32,
    offsetFromEntityY: ecs.f32,
    offsetFromEntityZ: ecs.f32,
    // Track previous box center position for velocity calculation
    prevBoxCenterX: ecs.f32,
    prevBoxCenterY: ecs.f32,
    prevBoxCenterZ: ecs.f32,
    // Store box velocity for moving entity collision handling
    boxVelocityX: ecs.f32,
    boxVelocityY: ecs.f32,
    boxVelocityZ: ecs.f32,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute, defineState}) => {
    // Helper function to find the jetski entity with jetski-controller component
    const findJetskiEntity = (): ecs.Eid | null => {
      // Iterate through all entities to find one with jetski-controller component
      for (const entityEid of world.allEntities) {
        if (jetskiController.has(world, entityEid)) {
          console.log(`[box-collider] Found jetski entity: ${entityEid}`)
          return entityEid
        }
      }
      console.warn('[box-collider] No jetski entity found with jetski-controller component')
      return null
    }

    // Helper function to check if point is inside box and push it outside if needed
    const pushOutsideBox = (
      jetskiX: number,
      jetskiY: number,
      jetskiZ: number,
      boxCenterX: number,
      boxCenterY: number,
      boxCenterZ: number,
      halfWidth: number,
      halfHeight: number,
      halfDepth: number
    ): {x: number, y: number, z: number, colliding: boolean} => {
      // Calculate box boundaries
      const minX = boxCenterX - halfWidth
      const maxX = boxCenterX + halfWidth
      const minY = boxCenterY - halfHeight
      const maxY = boxCenterY + halfHeight
      const minZ = boxCenterZ - halfDepth
      const maxZ = boxCenterZ + halfDepth

      // Check if jetski is inside the box
      const isInside = (
        jetskiX > minX && jetskiX < maxX &&
        jetskiY > minY && jetskiY < maxY &&
        jetskiZ > minZ && jetskiZ < maxZ
      )

      if (!isInside) {
        // Jetski is outside the box - no collision
        return {x: jetskiX, y: jetskiY, z: jetskiZ, colliding: false}
      }

      // Jetski is inside - push it to the nearest face
      // Calculate distances to each face
      const distToMinX = Math.abs(jetskiX - minX)
      const distToMaxX = Math.abs(jetskiX - maxX)
      const distToMinY = Math.abs(jetskiY - minY)
      const distToMaxY = Math.abs(jetskiY - maxY)
      const distToMinZ = Math.abs(jetskiZ - minZ)
      const distToMaxZ = Math.abs(jetskiZ - maxZ)

      // Find the minimum distance (nearest face)
      const minDist = Math.min(distToMinX, distToMaxX, distToMinY, distToMaxY, distToMinZ, distToMaxZ)

      // Push to the nearest face
      let pushedX = jetskiX
      let pushedY = jetskiY
      let pushedZ = jetskiZ

      if (minDist === distToMinX) {
        pushedX = minX
      } else if (minDist === distToMaxX) {
        pushedX = maxX
      } else if (minDist === distToMinY) {
        pushedY = minY
      } else if (minDist === distToMaxY) {
        pushedY = maxY
      } else if (minDist === distToMinZ) {
        pushedZ = minZ
      } else if (minDist === distToMaxZ) {
        pushedZ = maxZ
      }

      return {x: pushedX, y: pushedY, z: pushedZ, colliding: true}
    }

    // Helper function to damp velocity when colliding with box
    // Damps velocity in the direction toward the box center (inward velocity)
    const dampInwardVelocity = (
      jetskiX: number,
      jetskiY: number,
      jetskiZ: number,
      boxCenterX: number,
      boxCenterY: number,
      boxCenterZ: number,
      velocityX: number,
      velocityY: number,
      velocityZ: number,
      dampingFactor: number
    ): {velocityX: number, velocityY: number, velocityZ: number} => {
      // Calculate direction from jetski to box center (inward direction)
      const dx = boxCenterX - jetskiX
      const dy = boxCenterY - jetskiY
      const dz = boxCenterZ - jetskiZ
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (distance < 0.001) {
        // Too close to center to determine direction reliably
        return {velocityX, velocityY, velocityZ}
      }

      // Normalize direction vector
      const dirX = dx / distance
      const dirY = dy / distance
      const dirZ = dz / distance

      // Calculate dot product of velocity with inward direction
      const inwardVelocity = velocityX * dirX + velocityY * dirY + velocityZ * dirZ

      if (inwardVelocity <= 0) {
        // Velocity is already pointing outward or parallel - no damping needed
        return {velocityX, velocityY, velocityZ}
      }

      // Damp only the inward component of velocity (velocity toward box)
      const dampedInward = inwardVelocity * dampingFactor

      // Reconstruct velocity: damped inward component + preserved tangential
      const newVelocityX = velocityX - (inwardVelocity - dampedInward) * dirX
      const newVelocityY = velocityY - (inwardVelocity - dampedInward) * dirY
      const newVelocityZ = velocityZ - (inwardVelocity - dampedInward) * dirZ

      return {
        velocityX: newVelocityX,
        velocityY: newVelocityY,
        velocityZ: newVelocityZ,
      }
    }

    // Helper function to calculate bounding box dimensions in local space
    const calculateBoundingBox = () => {
      const obj3D = world.three.entityToObject.get(eid)
      if (!obj3D) {
        console.warn('[box-collider] No Object3D found for entity')
        return null
      }

      // Import THREE from the global scope
      const THREE = (window as any).THREE
      if (!THREE) {
        console.error('[box-collider] THREE.js not available')
        return null
      }

      // Calculate bounding box in world space first
      obj3D.updateMatrixWorld(true)
      const worldBox = new THREE.Box3()
      
      obj3D.traverse((node: any) => {
        if (node.isMesh && node.geometry) {
          if (!node.geometry.boundingBox) {
            node.geometry.computeBoundingBox()
          }
          
          if (node.geometry.boundingBox) {
            const geometryBox = node.geometry.boundingBox.clone()
            geometryBox.applyMatrix4(node.matrixWorld)
            worldBox.union(geometryBox)
          }
        }
      })
      
      if (worldBox.isEmpty() || !isFinite(worldBox.min.x) || !isFinite(worldBox.max.x)) {
        console.warn('[box-collider] Bounding box is empty or invalid, model may not be loaded yet')
        return null
      }

      // Get world space center and size
      const worldCenter = new THREE.Vector3()
      worldBox.getCenter(worldCenter)
      
      // Get the 8 corners of the bounding box in world space
      const corners = [
        new THREE.Vector3(worldBox.min.x, worldBox.min.y, worldBox.min.z),
        new THREE.Vector3(worldBox.max.x, worldBox.min.y, worldBox.min.z),
        new THREE.Vector3(worldBox.min.x, worldBox.max.y, worldBox.min.z),
        new THREE.Vector3(worldBox.max.x, worldBox.max.y, worldBox.min.z),
        new THREE.Vector3(worldBox.min.x, worldBox.min.y, worldBox.max.z),
        new THREE.Vector3(worldBox.max.x, worldBox.min.y, worldBox.max.z),
        new THREE.Vector3(worldBox.min.x, worldBox.max.y, worldBox.max.z),
        new THREE.Vector3(worldBox.max.x, worldBox.max.y, worldBox.max.z),
      ]
      
      // Transform corners to local space
      const entityPos = ecs.Position.get(world, eid)
      const entityWorldPos = new THREE.Vector3(entityPos?.x || 0, entityPos?.y || 0, entityPos?.z || 0)
      const inverseQuat = obj3D.quaternion.clone().invert()
      
      const localCorners = corners.map(corner => {
        const relative = corner.clone().sub(entityWorldPos)
        return relative.applyQuaternion(inverseQuat)
      })
      
      // Calculate local space bounding box from transformed corners
      const localBox = new THREE.Box3()
      localCorners.forEach(corner => localBox.expandByPoint(corner))
      
      const localSize = new THREE.Vector3()
      localBox.getSize(localSize)
      
      const localCenter = new THREE.Vector3()
      localBox.getCenter(localCenter)

      console.log(`[box-collider] Calculated bounding box:`)
      console.log(`  Local dimensions: ${localSize.x.toFixed(2)} x ${localSize.y.toFixed(2)} x ${localSize.z.toFixed(2)}`)
      console.log(`  Local center offset: (${localCenter.x.toFixed(2)}, ${localCenter.y.toFixed(2)}, ${localCenter.z.toFixed(2)})`)
      console.log(`  World center: (${worldCenter.x.toFixed(2)}, ${worldCenter.y.toFixed(2)}, ${worldCenter.z.toFixed(2)})`)

      return {
        width: localSize.x,
        height: localSize.y,
        depth: localSize.z,
        centerX: worldCenter.x,
        centerY: worldCenter.y,
        centerZ: worldCenter.z,
      }
    }

    // Helper function to create debug visualization box
    const createDebugBox = () => {
      const data = dataAttribute.cursor(eid)
      
      if (data.debugBoxEid) {
        // Debug box already exists
        return
      }

      // Use calculated dimensions
      const width = data.calculatedWidth
      const height = data.calculatedHeight
      const depth = data.calculatedDepth

      // Don't create debug box if dimensions are not valid yet
      if (width <= 0 || height <= 0 || depth <= 0) {
        return
      }

      // Create a wireframe box to visualize the bounding box
      const debugBox = world.createEntity()
      
      // Position at the actual bounding box center
      ecs.Position.set(world, debugBox, {x: data.boxCenterX, y: data.boxCenterY, z: data.boxCenterZ})

      // IMPORTANT: Set scale to (1,1,1) so box dimensions aren't affected by parent scale
      ecs.Scale.set(world, debugBox, {x: 1, y: 1, z: 1})

      // Set the box geometry to match the bounding box dimensions
      ecs.BoxGeometry.set(world, debugBox, {
        width,
        height,
        depth,
      })

      // Set material to semi-transparent red wireframe
      ecs.Material.set(world, debugBox, {
        r: 255,
        g: 0,
        b: 0,
        opacity: 0.3,
        wireframe: true,
      })

      // Store debug box entity ID
      data.debugBoxEid = debugBox

      console.log(`[box-collider] Debug box created at (${data.boxCenterX.toFixed(2)}, ${data.boxCenterY.toFixed(2)}, ${data.boxCenterZ.toFixed(2)})`)
      console.log(`[box-collider] Debug box dimensions: ${width.toFixed(2)} x ${height.toFixed(2)} x ${depth.toFixed(2)}`)
      console.log(`[box-collider] Collision bounds: X[${(data.boxCenterX - width/2).toFixed(2)}, ${(data.boxCenterX + width/2).toFixed(2)}], Y[${(data.boxCenterY - height/2).toFixed(2)}, ${(data.boxCenterY + height/2).toFixed(2)}], Z[${(data.boxCenterZ - depth/2).toFixed(2)}, ${(data.boxCenterZ + depth/2).toFixed(2)}]`)
    }

    // Helper function to remove debug visualization box
    const removeDebugBox = () => {
      const data = dataAttribute.cursor(eid)
      
      if (data.debugBoxEid && data.debugBoxEid !== BigInt(0)) {
        world.deleteEntity(data.debugBoxEid)
        data.debugBoxEid = BigInt(0)
        console.log('[box-collider] Debug visualization box removed')
      }
    }

    // Helper function to update debug box position and rotation
    const updateDebugBoxPosition = () => {
      const data = dataAttribute.get(eid)
      
      if (!data.debugBoxEid || data.debugBoxEid === BigInt(0)) {
        return
      }

      // Update debug box position to match the bounding box center
      ecs.Position.set(world, data.debugBoxEid, {x: data.boxCenterX, y: data.boxCenterY, z: data.boxCenterZ})
      
      // Update debug box rotation to match the entity's rotation
      // Read from ECS Quaternion component (not Three.js object)
      const quat = ecs.Quaternion.get(world, eid)
      if (quat) {
        ecs.Quaternion.set(world, data.debugBoxEid, {
          x: quat.x,
          y: quat.y,
          z: quat.z,
          w: quat.w
        })
      }
    }

    // State: active - Continuously monitor and enforce box boundary
    defineState('active')
      .initial()
      .onEnter(() => {
        // Find the jetski entity
        const jetskiEid = findJetskiEntity()
        const data = dataAttribute.cursor(eid)
        data.jetskiEid = jetskiEid || BigInt(0)
        data.wasColliding = false
        data.autoSizeCalculated = false
        // Initialize velocity tracking
        data.prevBoxCenterX = 0
        data.prevBoxCenterY = 0
        data.prevBoxCenterZ = 0
        data.boxVelocityX = 0
        data.boxVelocityY = 0
        data.boxVelocityZ = 0

        if (!jetskiEid) {
          console.error('[box-collider] Failed to find jetski entity on initialization')
          return
        }

        console.log(`[box-collider] Initialized, monitoring jetski entity: ${jetskiEid}`)

        // Initialize dimensions based on autoSize setting
        const schema = schemaAttribute.get(eid)
        const pos = ecs.Position.get(world, eid)
        if (schema.autoSize) {
          // Start with zero dimensions - will be calculated in onTick
          data.calculatedWidth = 0
          data.calculatedHeight = 0
          data.calculatedDepth = 0
          // Initialize center to entity position (will be updated when box is calculated)
          data.boxCenterX = pos?.x || 0
          data.boxCenterY = pos?.y || 0
          data.boxCenterZ = pos?.z || 0
          // Initialize offset to zero (will be calculated when bounding box is computed)
          data.offsetFromEntityX = 0
          data.offsetFromEntityY = 0
          data.offsetFromEntityZ = 0
          console.log(`[box-collider] AutoSize enabled - will calculate dimensions from mesh`)
        } else {
          // Use manual dimensions from schema with offset
          data.calculatedWidth = schema.boxWidth
          data.calculatedHeight = schema.boxHeight
          data.calculatedDepth = schema.boxDepth
          
          // Apply rotation to offset if rotation-aware mode is enabled
          const quat = ecs.Quaternion.get(world, eid)
          
          if (schema.rotationAware && quat) {
            // Import THREE from the global scope
            const THREE = (window as any).THREE
            if (THREE) {
              // Create a vector for the offset in local space
              const offsetVector = new THREE.Vector3(schema.offsetX, schema.offsetY, schema.offsetZ)
              
              // Create a THREE quaternion from ECS quaternion
              const threeQuat = new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w)
              
              // Apply the entity's rotation to the offset vector
              offsetVector.applyQuaternion(threeQuat)
              
              // Update box center with rotated offset
              data.boxCenterX = (pos?.x || 0) + offsetVector.x
              data.boxCenterY = (pos?.y || 0) + offsetVector.y
              data.boxCenterZ = (pos?.z || 0) + offsetVector.z
            } else {
              // Fallback if THREE is not available
              data.boxCenterX = (pos?.x || 0) + schema.offsetX
              data.boxCenterY = (pos?.y || 0) + schema.offsetY
              data.boxCenterZ = (pos?.z || 0) + schema.offsetZ
            }
          } else {
            // No rotation - use offsets in world space
            data.boxCenterX = (pos?.x || 0) + schema.offsetX
            data.boxCenterY = (pos?.y || 0) + schema.offsetY
            data.boxCenterZ = (pos?.z || 0) + schema.offsetZ
          }
          
          data.autoSizeCalculated = true
          console.log(`[box-collider] Using manual dimensions: ${schema.boxWidth} x ${schema.boxHeight} x ${schema.boxDepth}`)
          console.log(`[box-collider] With offset: (${schema.offsetX.toFixed(2)}, ${schema.offsetY.toFixed(2)}, ${schema.offsetZ.toFixed(2)})`)
        }
      })
      .onTick(() => {
        const {autoSize, extraHeight, boxWidth, boxHeight, boxDepth, offsetX, offsetY, offsetZ, rotationAware, dampVelocity, dampingFactor, debugVisualization} = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid)
        
        // Calculate delta time once at the start
        const delta = world.time.delta / 1000

        // Try to auto-calculate dimensions if enabled and not yet calculated
        if (autoSize && !data.autoSizeCalculated) {
          const bounds = calculateBoundingBox()
          if (bounds) {
            data.calculatedWidth = bounds.width
            // Add extra height both above AND below (2x total)
            data.calculatedHeight = bounds.height + (2 * extraHeight)
            data.calculatedDepth = bounds.depth
            data.boxCenterX = bounds.centerX
            // Center remains at original position since we extend equally in both directions
            data.boxCenterY = bounds.centerY
            data.boxCenterZ = bounds.centerZ
            
            // Calculate and store the offset from entity position to bounding box center
            const pos = ecs.Position.get(world, eid)
            data.offsetFromEntityX = bounds.centerX - (pos?.x || 0)
            data.offsetFromEntityY = bounds.centerY - (pos?.y || 0)
            data.offsetFromEntityZ = bounds.centerZ - (pos?.z || 0)
            
            data.autoSizeCalculated = true
            console.log(`[box-collider] Auto-calculated dimensions: ${bounds.width.toFixed(2)} x ${bounds.height.toFixed(2)} x ${bounds.depth.toFixed(2)}`)
            console.log(`[box-collider] Added extra height: ${extraHeight.toFixed(2)} above + ${extraHeight.toFixed(2)} below (total height: ${data.calculatedHeight.toFixed(2)})`)
            console.log(`[box-collider] Using bounding box center: (${bounds.centerX.toFixed(2)}, ${bounds.centerY.toFixed(2)}, ${bounds.centerZ.toFixed(2)})`)
            console.log(`[box-collider] Offset from entity: (${data.offsetFromEntityX.toFixed(2)}, ${data.offsetFromEntityY.toFixed(2)}, ${data.offsetFromEntityZ.toFixed(2)})`)
          } else {
            // Model not loaded yet - skip collision detection this frame
            return
          }
        } else if (!autoSize) {
          // Manual mode - update box center every frame to follow entity position with offset
          const pos = ecs.Position.get(world, eid)
          if (!data.autoSizeCalculated) {
            data.calculatedWidth = boxWidth
            data.calculatedHeight = boxHeight
            data.calculatedDepth = boxDepth
            data.autoSizeCalculated = true
            console.log(`[box-collider] Manual mode dimensions: ${boxWidth} x ${boxHeight} x ${boxDepth}`)
            console.log(`[box-collider] With offset: (${offsetX.toFixed(2)}, ${offsetY.toFixed(2)}, ${offsetZ.toFixed(2)})`)
          }
          // Update center position every frame (entity might move or offset might change)
          // Apply rotation to offset if rotation-aware mode is enabled
          const quat = ecs.Quaternion.get(world, eid)
          
          if (rotationAware && quat) {
            // Import THREE from the global scope
            const THREE = (window as any).THREE
            if (THREE) {
              // Create a vector for the offset in local space
              const offsetVector = new THREE.Vector3(offsetX, offsetY, offsetZ)
              
              // Create a THREE quaternion from ECS quaternion
              const threeQuat = new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w)
              
              // Apply the entity's rotation to the offset vector
              offsetVector.applyQuaternion(threeQuat)
              
              // Update box center with rotated offset
              data.boxCenterX = (pos?.x || 0) + offsetVector.x
              data.boxCenterY = (pos?.y || 0) + offsetVector.y
              data.boxCenterZ = (pos?.z || 0) + offsetVector.z
            } else {
              // Fallback if THREE is not available
              data.boxCenterX = (pos?.x || 0) + offsetX
              data.boxCenterY = (pos?.y || 0) + offsetY
              data.boxCenterZ = (pos?.z || 0) + offsetZ
            }
          } else {
            // No rotation - use offsets in world space
            data.boxCenterX = (pos?.x || 0) + offsetX
            data.boxCenterY = (pos?.y || 0) + offsetY
            data.boxCenterZ = (pos?.z || 0) + offsetZ
          }
        } else if (autoSize && data.autoSizeCalculated) {
          // AutoSize mode - update box center every frame to follow entity position and rotation
          const pos = ecs.Position.get(world, eid)
          const quat = ecs.Quaternion.get(world, eid)
          
          if (quat) {
            // Import THREE from the global scope
            const THREE = (window as any).THREE
            if (THREE) {
              // Create a vector for the offset in local space
              const offsetVector = new THREE.Vector3(
                data.offsetFromEntityX,
                data.offsetFromEntityY,
                data.offsetFromEntityZ
              )
              
              // Create a THREE quaternion from ECS quaternion
              const threeQuat = new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w)
              
              // Apply the entity's rotation to the offset vector
              offsetVector.applyQuaternion(threeQuat)
              
              // Update box center with rotated offset
              data.boxCenterX = (pos?.x || 0) + offsetVector.x
              data.boxCenterY = (pos?.y || 0) + offsetVector.y
              data.boxCenterZ = (pos?.z || 0) + offsetVector.z
            } else {
              // Fallback if THREE is not available
              data.boxCenterX = (pos?.x || 0) + data.offsetFromEntityX
              data.boxCenterY = (pos?.y || 0) + data.offsetFromEntityY
              data.boxCenterZ = (pos?.z || 0) + data.offsetFromEntityZ
            }
          } else {
            // Fallback if no quaternion
            data.boxCenterX = (pos?.x || 0) + data.offsetFromEntityX
            data.boxCenterY = (pos?.y || 0) + data.offsetFromEntityY
            data.boxCenterZ = (pos?.z || 0) + data.offsetFromEntityZ
          }
        }

        // Get dimensions to use (either auto-calculated or manual)
        const actualWidth = data.calculatedWidth
        const actualHeight = data.calculatedHeight
        const actualDepth = data.calculatedDepth

        // Skip if dimensions are not valid yet
        if (actualWidth <= 0 || actualHeight <= 0 || actualDepth <= 0) {
          return
        }

        // Update debug visualization if enabled
        if (debugVisualization) {
          if (!data.debugBoxEid || data.debugBoxEid === BigInt(0)) {
            createDebugBox()
          }
          updateDebugBoxPosition()
        } else {
          // Remove debug box if visualization is disabled
          if (data.debugBoxEid && data.debugBoxEid !== BigInt(0)) {
            removeDebugBox()
          }
        }

        // CRITICAL: Calculate box velocity RIGHT BEFORE collision detection
        // This ensures we capture the most recent position changes from components like CurveAnimator
        if (delta > 0 && data.prevBoxCenterX !== 0) {
          data.boxVelocityX = (data.boxCenterX - data.prevBoxCenterX) / delta
          data.boxVelocityY = (data.boxCenterY - data.prevBoxCenterY) / delta
          data.boxVelocityZ = (data.boxCenterZ - data.prevBoxCenterZ) / delta
        } else {
          // First frame or invalid delta - no velocity
          data.boxVelocityX = 0
          data.boxVelocityY = 0
          data.boxVelocityZ = 0
        }
        
        // Store current center for next frame's velocity calculation
        data.prevBoxCenterX = data.boxCenterX
        data.prevBoxCenterY = data.boxCenterY
        data.prevBoxCenterZ = data.boxCenterZ
        
        // Ensure we have a jetski entity to monitor
        if (!data.jetskiEid || data.jetskiEid === BigInt(0)) {
          // Try to find it again
          data.jetskiEid = findJetskiEntity() || BigInt(0)
          if (!data.jetskiEid || data.jetskiEid === BigInt(0)) {
            return  // Still no jetski found, skip this frame
          }
        }

        // Get jetski's current position
        const jetskiPos = ecs.Position.get(world, data.jetskiEid)
        if (!jetskiPos) {
          console.warn('[box-collider] No Position component on jetski entity')
          return
        }

        // Use the actual bounding box center (not entity position)
        const boxCenterX = data.boxCenterX
        const boxCenterY = data.boxCenterY
        const boxCenterZ = data.boxCenterZ

        // Calculate half-dimensions for AABB
        const halfWidth = actualWidth / 2
        const halfHeight = actualHeight / 2
        const halfDepth = actualDepth / 2

        // Transform jetski position into box's local space for rotation-aware collision
        let pushResult
        const quat = ecs.Quaternion.get(world, eid)
        
        // Use local-space collision only if rotationAware is enabled
        if (rotationAware && quat) {
          const THREE = (window as any).THREE
          if (THREE) {
            // Transform jetski position to local space (relative to BOX CENTER, not entity)
            const worldJetskiPos = new THREE.Vector3(jetskiPos.x, jetskiPos.y, jetskiPos.z)
            const boxCenterPos = new THREE.Vector3(boxCenterX, boxCenterY, boxCenterZ)
            const localJetskiPos = worldJetskiPos.clone().sub(boxCenterPos)
            
            // Create THREE quaternion from ECS quaternion and invert it
            const threeQuat = new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w)
            const inverseQuaternion = threeQuat.clone().invert()
            localJetskiPos.applyQuaternion(inverseQuaternion)
            
            // Box center in local space is always at origin (0,0,0)
            const localBoxCenter = new THREE.Vector3(0, 0, 0)
            
            // Check collision in local space
            const localPushResult = pushOutsideBox(
              localJetskiPos.x, localJetskiPos.y, localJetskiPos.z,
              localBoxCenter.x, localBoxCenter.y, localBoxCenter.z,
              halfWidth, halfHeight, halfDepth
            )
            
            if (localPushResult.colliding) {
              // Transform pushed position back to world space
              const localPushedPos = new THREE.Vector3(
                localPushResult.x,
                localPushResult.y,
                localPushResult.z
              )
              
              // Apply rotation to get back to world space
              localPushedPos.applyQuaternion(threeQuat)
              
              // Add box center position to get final world position
              localPushedPos.add(boxCenterPos)
              
              pushResult = {
                x: localPushedPos.x,
                y: localPushedPos.y,
                z: localPushedPos.z,
                colliding: true
              }
            } else {
              pushResult = {x: jetskiPos.x, y: jetskiPos.y, z: jetskiPos.z, colliding: false}
            }
          } else {
            // Fallback to world space collision
            pushResult = pushOutsideBox(
              jetskiPos.x, jetskiPos.y, jetskiPos.z,
              boxCenterX, boxCenterY, boxCenterZ,
              halfWidth, halfHeight, halfDepth
            )
          }
        } else {
          // Non-rotation-aware mode - use world space collision
          pushResult = pushOutsideBox(
            jetskiPos.x, jetskiPos.y, jetskiPos.z,
            boxCenterX, boxCenterY, boxCenterZ,
            halfWidth, halfHeight, halfDepth
          )
        }

        // Check if there's a collision
        if (pushResult.colliding) {
          // Log collision every frame for debugging
          console.log(`[box-collider] COLLISION DETECTED!`)
          console.log(`  Jetski world pos: (${jetskiPos.x.toFixed(2)}, ${jetskiPos.y.toFixed(2)}, ${jetskiPos.z.toFixed(2)})`)
          console.log(`  Box center: (${boxCenterX.toFixed(2)}, ${boxCenterY.toFixed(2)}, ${boxCenterZ.toFixed(2)})`)
          console.log(`  Box half-dims: ${halfWidth.toFixed(2)} x ${halfHeight.toFixed(2)} x ${halfDepth.toFixed(2)}`)
          console.log(`  Push result: (${pushResult.x.toFixed(2)}, ${pushResult.y.toFixed(2)}, ${pushResult.z.toFixed(2)})`)
          
          if (!data.wasColliding) {
            console.log(`[box-collider] === NEW COLLISION STARTED ===`)
            data.wasColliding = true
          }

          // Update jetski position to pushed value
          // Note: Box has already moved to current position, pushResult is based on current box location
          // We transfer velocity through the velocity damping below, not position adjustment
          world.setPosition(data.jetskiEid, pushResult.x, pushResult.y, pushResult.z)

          // Damp velocity if enabled and jetski has jetski controller
          if (dampVelocity && jetskiController.has(world, data.jetskiEid)) {
            const jetskiData = jetskiController.get(world, data.jetskiEid) as any
            const jetskiCursor = jetskiController.cursor(world, data.jetskiEid) as any

            // Calculate relative velocity (jetski velocity minus box velocity)
            const relativeVelocityX = jetskiData.velocityX - data.boxVelocityX
            const relativeVelocityZ = jetskiData.velocityZ - data.boxVelocityZ

            // Damp inward velocity components using relative velocity
            const dampedVelocity = dampInwardVelocity(
              pushResult.x,
              pushResult.y,
              pushResult.z,
              boxCenterX,
              boxCenterY,
              boxCenterZ,
              relativeVelocityX,
              0,  // No Y velocity in jetski controller
              relativeVelocityZ,
              dampingFactor
            )

            // CRITICAL: Set jetski velocity to box velocity plus damped relative velocity
            // This makes the jetski "stick" to the moving box
            jetskiCursor.velocityX = data.boxVelocityX + dampedVelocity.velocityX
            jetskiCursor.velocityZ = data.boxVelocityZ + dampedVelocity.velocityZ

            // For lateral kick, we want to preserve some of it but also damp inward components
            const dampedKick = dampInwardVelocity(
              pushResult.x,
              pushResult.y,
              pushResult.z,
              boxCenterX,
              boxCenterY,
              boxCenterZ,
              jetskiData.lateralKickVelocityX,
              0,
              jetskiData.lateralKickVelocityZ,
              dampingFactor
            )

            jetskiCursor.lateralKickVelocityX = dampedKick.velocityX
            jetskiCursor.lateralKickVelocityZ = dampedKick.velocityZ
          }
        } else {
          // Debug: Log when jetski is near but not colliding
          const distToCenter = Math.sqrt(
            Math.pow(jetskiPos.x - boxCenterX, 2) +
            Math.pow(jetskiPos.y - boxCenterY, 2) +
            Math.pow(jetskiPos.z - boxCenterZ, 2)
          )
          
          if (distToCenter < actualWidth) {
            console.log(`[box-collider] Jetski near box but NO collision detected`)
            console.log(`  Distance to center: ${distToCenter.toFixed(2)}`)
            console.log(`  Jetski pos: (${jetskiPos.x.toFixed(2)}, ${jetskiPos.y.toFixed(2)}, ${jetskiPos.z.toFixed(2)})`)
            console.log(`  Box center: (${boxCenterX.toFixed(2)}, ${boxCenterY.toFixed(2)}, ${boxCenterZ.toFixed(2)})`)
          }
          
          // No collision
          if (data.wasColliding) {
            console.log('[box-collider] Jetski no longer colliding with box')
            data.wasColliding = false
          }
        }
      })
  },
})

export {boxCollider}