import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Render First',
  schema: {
    renderOrder: ecs.f32,
  },
  schemaDefaults: {
    renderOrder: 999,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {THREE} = window as any

    // Helper function to set renderOrder and disable depth test on all meshes
    const setRenderOrderRecursive = (object: any, renderOrder: number) => {
      if (!object) return

      // Set renderOrder on the parent object itself
      object.renderOrder = renderOrder

      object.traverse((node: any) => {
        // Set renderOrder on all nodes, not just meshes
        node.renderOrder = renderOrder
        
        if (node.isMesh) {
          // Disable depth testing so object renders on top regardless of position
          if (node.material) {
            const materials = Array.isArray(node.material) ? node.material : [node.material]
            materials.forEach((mat: any) => {
              mat.depthTest = false
              mat.depthWrite = false
              mat.transparent = true  // CRITICAL: Must be transparent to render in same pass as ocean
              mat.needsUpdate = true  // Flag material for update
            })
          }
          
        }
      })
    }

    // Helper function to apply renderOrder to the entity's Three.js object
    const applyRenderOrder = () => {
      const {renderOrder} = schemaAttribute.get(eid)
      const object = world.three.entityToObject.get(eid)

      if (!object) {
        return false
      }

      setRenderOrderRecursive(object, renderOrder)
      return true
    }

    let frameCount = 0
    let applyAttempts = 0
    const MAX_ATTEMPTS = 10

    // STATE: waiting - Initial state, waits a few frames before applying
    ecs.defineState('waiting')
      .initial()
      .onEnter(() => {
        frameCount = 0
      })
      .onTick(() => {
        frameCount++
        // Wait 3 frames to ensure everything is loaded
        if (frameCount >= 3) {
          const object = world.three.entityToObject.get(eid)
          if (object) {
            world.events.dispatch(eid, 'object-ready')
          } else {
          }
        }
      })
      .listen(eid, ecs.events.GLTF_MODEL_LOADED, () => {
        // Reset frame count on GLTF load
        frameCount = 0
      })
      .onEvent('object-ready', 'setup')

    // STATE: setup - Apply renderOrder to all meshes in the object tree
    ecs.defineState('setup')
      .onEnter(() => {
        applyAttempts = 0
      })
      .onTick(() => {
        applyAttempts++
        const success = applyRenderOrder()
        
        if (success && applyAttempts >= 3) {
          // Apply for 3 frames to ensure it sticks
          world.events.dispatch(eid, 'setup-complete')
        } else if (applyAttempts >= MAX_ATTEMPTS) {
          console.error('[render-first] Max attempts reached, transitioning to monitoring anyway')
          world.events.dispatch(eid, 'setup-complete')
        }
      })
      .onEvent('setup-complete', 'monitoring')

    // STATE: monitoring - Continuously verify and reapply if needed
    ecs.defineState('monitoring')
      .onEnter(() => {
        console.log('[render-first] Entering monitoring state - will aggressively maintain settings every frame')
      })
      .onTick(() => {
        // AGGRESSIVELY reapply ALL settings every single frame
        // This ensures no other component can override our settings
        const {renderOrder} = schemaAttribute.get(eid)
        const object = world.three.entityToObject.get(eid)
        
        if (object) {
          // Set renderOrder on parent
          object.renderOrder = renderOrder
          
          // Traverse and enforce settings on all nodes and materials
          object.traverse((node: any) => {
            node.renderOrder = renderOrder
            
            if (node.isMesh && node.material) {
              const materials = Array.isArray(node.material) ? node.material : [node.material]
              materials.forEach((mat: any) => {
                // Continuously enforce these settings
                mat.depthTest = false
                mat.depthWrite = false
                mat.transparent = true
              })
            }
          })
        }
      })
  },
})