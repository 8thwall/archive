import * as ecs from '@8thwall/ecs'

// Store event handlers in closures outside the component
const basketCounterHandlers = new Map()
const animationFinishedHandlers = new Map()

ecs.registerComponent({
  name: 'basket-counter',
  schema: {
    scoreDisplay: ecs.eid,         // UI entity to show the score
    requireBallTag: ecs.boolean,   // Whether to only count entities with 'basketball' tag
    hasScoreDisplay: ecs.boolean,  // Whether score display is set
    confetti1: ecs.eid,            // First confetti model entity in scene
    confetti2: ecs.eid,            // Second confetti model entity in scene
    confetti3: ecs.eid,            // Third confetti model entity in scene
    confetti4: ecs.eid,            // Fourth confetti model entity in scene
    scorePlane1: ecs.eid,          // First plane to scale up/down on score
    scorePlane2: ecs.eid,          // Second plane to scale up/down on score
    scorePlane3: ecs.eid,          // Third plane to scale up/down on score
    playEffects: ecs.boolean,      // Whether to play visual effects on score
    plane1ScaleFactor: ecs.f32,    // Scale factor for the first plane
    plane2ScaleFactor: ecs.f32,    // Scale factor for the second plane
    plane3ScaleFactor: ecs.f32,    // Scale factor for the third plane
  },
  schemaDefaults: {
    requireBallTag: true,
    hasScoreDisplay: false,
    playEffects: true,
    plane1ScaleFactor: 2.0,  // Default scale for first plane
    plane2ScaleFactor: 4.0,  // Larger scale for second plane
    plane3ScaleFactor: 4.0,  // Larger scale for third plane
  },
  data: {
    score: ecs.i32,
  },
  add: (world, component) => {
    const {eid, dataAttribute, schemaAttribute} = component

    // Initialize the score
    const data = dataAttribute.cursor(eid)
    data.score = 0

    // Function to play a confetti animation once - define this first
    function playConfettiAnimation(confettiEntity) {
      if (!confettiEntity || !ecs.GltfModel.has(world, confettiEntity)) {
        return  // Skip if entity is not set or doesn't have a GltfModel
      }

      // First, remove any existing animation finished listener
      if (animationFinishedHandlers.has(confettiEntity)) {
        const handler = animationFinishedHandlers.get(confettiEntity)
        world.events.removeListener(confettiEntity, ecs.events.GLTF_ANIMATION_FINISHED, handler)
      }

      // Create a new handler to reset animation to first frame when it finishes
      const animationFinishedHandler = () => {
        // Reset to first frame and pause
        ecs.GltfModel.mutate(world, confettiEntity, (cursor) => {
          cursor.time = 0
          cursor.paused = true
          return false
        })
      }

      // Store the handler for cleanup later
      animationFinishedHandlers.set(confettiEntity, animationFinishedHandler)

      // Add the animation finished listener
      world.events.addListener(confettiEntity, ecs.events.GLTF_ANIMATION_FINISHED, animationFinishedHandler)

      // Reset animation to beginning and play
      ecs.GltfModel.mutate(world, confettiEntity, (cursor) => {
        cursor.time = 0
        cursor.paused = false
        cursor.loop = false
        cursor.animationClip = '*'  // Play all animations
        return false
      })
    }

    // Function to animate the score plane with scale effect
    function animateScorePlane(planeEntity, scaleFactor, delayMs = 0) {
      if (!planeEntity) {
        return  // Skip if plane entity is not set
      }

      // First remove any existing scale animation
      if (ecs.ScaleAnimation.has(world, planeEntity)) {
        ecs.ScaleAnimation.remove(world, planeEntity)
      }

      // Apply delay if specified
      setTimeout(() => {
        // Scale up quickly
        ecs.ScaleAnimation.set(world, planeEntity, {
          autoFrom: true,  // Start from current scale
          toX: scaleFactor,
          toY: scaleFactor,
          toZ: scaleFactor,
          duration: 400,  // Quick scale up (400ms)
          loop: false,
          easeOut: true,
          easingFunction: 'Elastic',
        })

        // Scale back down after scaling up
        setTimeout(() => {
          try {
            ecs.ScaleAnimation.set(world, planeEntity, {
              autoFrom: true,  // Start from current scale
              toX: 0.0001,     // Scale down to almost 0
              toY: 0.0001,
              toZ: 0.0001,
              duration: 500,   // Slower scale down (500ms)
              loop: false,
              easeIn: true,
              easingFunction: 'Quadratic',
            })
          } catch (e) {
            console.log('Error scaling down plane:', e)
          }
        }, 700)  // Start scaling down after scale up is mostly done
      }, delayMs)
    }

    // Function to play visual effects when a basket is scored
    function playScoreEffects(schema) {
      // Play confetti animations if entities are provided
      playConfettiAnimation(schema.confetti1)
      playConfettiAnimation(schema.confetti2)
      playConfettiAnimation(schema.confetti3)
      playConfettiAnimation(schema.confetti4)

      // Animate score planes with staggered timing and different scale factors
      animateScorePlane(schema.scorePlane1, schema.plane1ScaleFactor, 0)    // First plane immediately
      animateScorePlane(schema.scorePlane2, schema.plane2ScaleFactor, 150)  // Second plane after 150ms
      animateScorePlane(schema.scorePlane3, schema.plane3ScaleFactor, 300)  // Third plane after 300ms
    }

    // Create collision handler
    const collisionHandler = (event) => {
      // Get fresh data cursor for this entity
      const dataCursor = dataAttribute.cursor(event.currentTarget)
      const schemaCursor = schemaAttribute.cursor(event.currentTarget)

      // If we're only counting basketballs, check if this entity has the 'basketball' tag
      if (schemaCursor.requireBallTag) {
        // We need to identify basketballs somehow - we can check for certain components
        // Assuming basketballs have a specific material color (r:255, g:140, b:0)
        if (ecs.Material.has(world, event.target)) {
          const material = ecs.Material.get(world, event.target)
          const isBasketball = material.r === 255 && material.g === 140 && material.b === 0

          if (!isBasketball) {
            return  // Not a basketball, don't count it
          }
        } else {
          return  // No material component, not a basketball
        }
      }

      // Increment the score
      dataCursor.score += 1
      console.log(`Basket made! Score: ${dataCursor.score}`)

      // Update UI if a score display is set
      if (schemaCursor.hasScoreDisplay && schemaCursor.scoreDisplay) {
        try {
          // Try to use the UI component
          ecs.Ui.set(world, schemaCursor.scoreDisplay, {
            text: `Score: ${dataCursor.score}`,
          })
          console.log(`Updated score UI for entity: ${schemaCursor.scoreDisplay}`)
        } catch (e) {
          console.log('Error updating score display:', e)
        }
      }

      // Play visual effects if enabled
      if (schemaCursor.playEffects) {
        playScoreEffects(schemaCursor)
      }

      // Optional: Dispatch a 'score' event that other components could listen for
      world.events.dispatch(event.currentTarget, 'basket-scored', {
        score: dataCursor.score,
        basketball: event.target,
      })
    }

    // Store handler in the map using eid as key
    basketCounterHandlers.set(eid, collisionHandler)

    // Add collision event listener
    world.events.addListener(eid, ecs.physics.COLLISION_START_EVENT, collisionHandler)

    // Log initial setup
    console.log('Basketball counter initialized with entity ID:', eid)
  },

  // Modify the remove function to safely handle null/undefined confetti entities
  remove: (world, component) => {
    const {eid, schema} = component

    // Get the handler from our map
    const handler = basketCounterHandlers.get(eid)

    // Remove the event listener if handler exists
    if (handler) {
      world.events.removeListener(eid, ecs.physics.COLLISION_START_EVENT, handler)
      // Clean up the map entry
      basketCounterHandlers.delete(eid)
    }

    // Clean up animation listeners for all possible confetti models
    // Only include entities that exist (not null or undefined)
    const confettiEntities = []
    if (schema && schema.confetti1) confettiEntities.push(schema.confetti1)
    if (schema && schema.confetti2) confettiEntities.push(schema.confetti2)
    if (schema && schema.confetti3) confettiEntities.push(schema.confetti3)
    if (schema && schema.confetti4) confettiEntities.push(schema.confetti4)

    confettiEntities.forEach((entity) => {
      if (entity) {
        const animHandler = animationFinishedHandlers.get(entity)
        if (animHandler) {
          world.events.removeListener(entity, ecs.events.GLTF_ANIMATION_FINISHED, animHandler)
          animationFinishedHandlers.delete(entity)
        }
      }
    })

    console.log('Basketball counter cleaned up')
  },
})
