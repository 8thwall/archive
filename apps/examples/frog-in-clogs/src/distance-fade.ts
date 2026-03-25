import * as ecs from '@8thwall/ecs'

const distanceFade = ecs.registerComponent({
  name: 'distance-fade',
  schema: {
    // Reference to the camera entity to track distance from
    camera: ecs.eid,
    // Distance at which entity starts to fade in (units from center)
    fadeInDistance: ecs.f32,
    // Distance at which entity is fully visible (units from center)
    fullyVisibleDistance: ecs.f32,
  },
  schemaDefaults: {
    fadeInDistance: 240,  // Start fading in at 240 units
    fullyVisibleDistance: 245,  // Fully visible at 245 units
  },
  data: {
    // Store references to all materials that need opacity control
    cachedMaterials: ecs.string,  // JSON string of material references (workaround for array storage)
    // Track initialization state
    isInitialized: ecs.boolean,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute, defineState}) => {
    const {THREE} = window as any
    
    // Helper function to recursively find and cache all materials in the GLB
    const cacheMaterials = () => {
      const object = world.three.entityToObject.get(eid)
      if (!object) {
        console.warn('[distance-fade] No Three.js object found for entity', eid)
        return []
      }

      const materials: any[] = []
      object.traverse((node: any) => {
        if (node.isMesh && node.material) {
          // Handle both single materials and multi-material meshes
          const mats = Array.isArray(node.material) ? node.material : [node.material]
          mats.forEach((mat: any) => {
            // Clone the material to avoid affecting other entities sharing the same material
            const clonedMat = mat.clone()
            // Enable transparency for opacity control
            clonedMat.transparent = true
            node.material = Array.isArray(node.material) 
              ? node.material.map((m: any) => m === mat ? clonedMat : m)
              : clonedMat
            materials.push(clonedMat)
          })
        }
      })
      
      console.log(`[distance-fade] Cached ${materials.length} materials for opacity control`)
      return materials
    }

    // Helper function to update opacity of all cached materials
    const updateOpacity = (opacity: number) => {
      const data = dataAttribute.get(eid)
      if (!data.cachedMaterials || data.cachedMaterials === '') {
        return
      }

      // In a real implementation with proper array storage, we'd iterate through materials directly
      // For now, we'll traverse the object tree each time (less efficient but functional)
      const object = world.three.entityToObject.get(eid)
      if (!object) return

      object.traverse((node: any) => {
        if (node.isMesh && node.material) {
          const mats = Array.isArray(node.material) ? node.material : [node.material]
          mats.forEach((mat: any) => {
            if (mat.transparent) {
              mat.opacity = opacity
              mat.needsUpdate = true
            }
          })
        }
      })
    }

    // Helper function to calculate distance from center (0,0,0)
    const calculateDistanceFromCenter = (cameraEid: ecs.Eid): number => {
      const cameraPos = ecs.Position?.get?.(world, cameraEid)
      if (!cameraPos) {
        console.warn('[distance-fade] Camera position not found')
        return 0
      }

      // Calculate 2D distance from center (ignoring Y axis for more predictable behavior)
      const dx = cameraPos.x
      const dz = cameraPos.z
      return Math.sqrt(dx * dx + dz * dz)
    }

    // State: waiting - Wait for GLTF model to load
    defineState('waiting')
      .initial()
      .listen(eid, ecs.events.GLTF_MODEL_LOADED, () => {
        console.log('[distance-fade] GLTF model loaded, transitioning to setup')
        world.events.dispatch(eid, 'model-ready')
      })
      .onEvent('model-ready', 'setup')

    // State: setup - Cache materials and prepare for fading
    defineState('setup')
      .onEnter(() => {
        console.log('[distance-fade] Setting up material caching')
        const materials = cacheMaterials()
        
        if (materials.length === 0) {
          console.warn('[distance-fade] No materials found to cache')
          return
        }

        // Store a flag indicating materials are cached (we can't store the array directly in data)
        dataAttribute.set(eid, {
          cachedMaterials: 'cached',  // Simple flag to indicate setup is complete
          isInitialized: true,
        })

        // Start fully transparent (invisible)
        updateOpacity(0)
        
        console.log('[distance-fade] Setup complete, transitioning to active state')
        world.events.dispatch(eid, 'setup-complete')
      })
      .onEvent('setup-complete', 'active')

    // State: active - Monitor camera distance and update opacity
    defineState('active')
      .onTick(() => {
        const {camera, fadeInDistance, fullyVisibleDistance} = schemaAttribute.get(eid)
        const data = dataAttribute.get(eid)

        if (!data.isInitialized || !camera) {
          return
        }

        // Calculate current distance from center
        const distance = calculateDistanceFromCenter(camera)

        // Calculate opacity based on distance thresholds
        let targetOpacity = 0

        if (distance <= fadeInDistance) {
          // Below fade-in threshold - fully invisible
          targetOpacity = 0
        } else if (distance >= fullyVisibleDistance) {
          // Above fully-visible threshold - fully visible
          targetOpacity = 1
        } else {
          // Between thresholds - calculate smooth fade using linear interpolation
          const fadeRange = fullyVisibleDistance - fadeInDistance
          const fadeProgress = (distance - fadeInDistance) / fadeRange
          targetOpacity = Math.max(0, Math.min(1, fadeProgress))  // Clamp to [0, 1]
        }

        // Update opacity of all materials
        updateOpacity(targetOpacity)

        // Optional: Log when opacity changes significantly (for debugging)
        // const opacityChanged = Math.abs(targetOpacity - (data.lastOpacity || 0)) > 0.01
        // if (opacityChanged) {
        //   console.log(`[distance-fade] Distance: ${distance.toFixed(2)}, Opacity: ${targetOpacity.toFixed(2)}`)
        // }
      })
  },
})

export {distanceFade}