import * as ecs from '@8thwall/ecs'
import {BalloonFloater} from './balloon-floater'

ecs.registerComponent({
  name: 'Balloon Popper',
  schema: {
    prizeEntity: ecs.eid,  // Reference to the prize entity that should fall
    balloonObj: ecs.eid,
    popSound: ecs.string,  // Optional audio asset reference for pop sound
  },
  schemaDefaults: {
    popSound: '',  // Default to empty string (no sound)
  },
  data: {
    isPopped: ecs.boolean,  // Track if balloon has already been popped
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    // Helper function to check if colliding entity is a dart
    const isDartEntity = (colliderEid: ecs.Eid) => {
      // Check if the colliding entity has dart characteristics by checking its collider properties
      // or by checking if it has dynamic physics (which darts should have when thrown)
      if (ecs.Collider.has(world, colliderEid)) {
        const collider = ecs.Collider.get(world, colliderEid)
        // Darts should have mass > 0 when thrown and gravity factor of 1 when in flight
        if (collider.mass > 0) {
          return true
        }
      }
      
      // Also check parent entities (dart tip, fins are children of main dart)
      const parentEid = world.getParent(colliderEid)
      if (parentEid && ecs.Collider.has(world, parentEid)) {
        const parentCollider = ecs.Collider.get(world, parentEid)
        if (parentCollider.mass > 0) {
          return true
        }
      }
      
      return false
    }

    // Helper function to handle balloon pop (direct hit on balloon)
    const popBalloon = () => {
      const {prizeEntity, balloonObj, popSound} = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)
      
      // Prevent multiple pops
      if (data.isPopped) return
      data.isPopped = true
      
      console.log('Balloon popped!')

      // Hide the balloon (original behavior)
      world.getEntity(balloonObj).hide()
      
      // Make the prize entity fall by giving it gravity
      if (prizeEntity && ecs.Collider.has(world, prizeEntity)) {
        ecs.Collider.mutate(world, prizeEntity, (cursor) => {
          cursor.gravityFactor = 1.0  // Enable gravity
          cursor.mass = 1.0  // Give it mass so it becomes dynamic
          cursor.restitution = 0.6  // Add some bounce
          cursor.friction = 0.8  // Add friction for realistic behavior
        })
      } else if (prizeEntity) {
        // If prize doesn't have a collider, add one
        ecs.Collider.set(world, prizeEntity, {
          mass: 1.0,
          gravityFactor: 1.0,
          restitution: 0.6,
          friction: 0.8,
        })
      }
      
      // Play pop sound if provided
      if (popSound && popSound.trim() !== '') {
        // Create a temporary audio entity for the pop sound
        const audioEntity = world.createEntity()
        ecs.Position.set(world, audioEntity, ecs.Position.get(world, eid))
        ecs.Audio.set(world, audioEntity, {
          url: popSound,
          volume: 0.7,
          loop: false,
          paused: false,
          positional: true,
        })
        
        // Remove the audio entity after the sound finishes
        world.events.addListener(audioEntity, ecs.events.AUDIO_END, () => {
          world.deleteEntity(audioEntity)
        })
      }
      
      // Dispatch a custom event that other components can listen to
      world.events.dispatch(world.events.globalId, 'balloon-popped', {
        balloonEid: eid,
        prizeEid: prizeEntity,
      })
    }

    // Helper function to handle prize hit (balloon floats away)
    const handlePrizeHit = () => {
      const {prizeEntity, balloonObj, popSound} = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)
      
      // Prevent multiple triggers
      if (data.isPopped) return
      data.isPopped = true
      
      console.log('Prize hit! Balloon animating straight up!')

      // Animate balloon straight up from current position immediately
      if (balloonObj && ecs.Position.has(world, balloonObj)) {
        const currentPos = ecs.Position.get(world, balloonObj)
        const startPosition = {
          x: currentPos.x,
          y: currentPos.y,
          z: currentPos.z
        }
        
        console.log('Starting balloon animation from position:', startPosition)
        
        // Remove any existing physics components that might interfere
        if (BalloonFloater.has(world, balloonObj)) {
          BalloonFloater.remove(world, balloonObj)
        }
        
        // Remove physics collider to prevent interference
        if (ecs.Collider.has(world, balloonObj)) {
          ecs.Collider.remove(world, balloonObj)
        }
        
        // Set up animation parameters
        const startY = startPosition.y
        const targetY = startY + 20
        const animationDuration = 3000 // 3 seconds
        const startTime = Date.now()
        
        console.log(`Animating balloon from Y=${startY} to Y=${targetY}`)
        
        // Create animation loop
        const animateBalloonUp = () => {
          if (!ecs.Position.has(world, balloonObj)) {
            console.log('Balloon entity destroyed during animation')
            return
          }
          
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / animationDuration, 1)
          
          // Use easeOut for smooth deceleration
          const easeOut = 1 - Math.pow(1 - progress, 2)
          const currentY = startY + (20 * easeOut)
          
          // Set balloon position (keeping X and Z from start position)
          ecs.Position.set(world, balloonObj, {
            x: startPosition.x,
            y: currentY,
            z: startPosition.z
          })
          
          console.log(`Animation progress: ${(progress * 100).toFixed(1)}%, Y position: ${currentY.toFixed(2)}`)
          
          // Continue animation until complete
          if (progress < 1) {
            setTimeout(animateBalloonUp, 16) // ~60fps
          } else {
            console.log('Balloon animation complete! Final Y position:', currentY)
            setTimeout(() => {
              try {
                console.log('Hiding balloon after animation complete')
                world.getEntity(balloonObj).hide()
              } catch (e) {
                console.log('Could not hide balloon entity:', e)
              }
            }, 500)
          }
        }
        
        // Start animation immediately
        animateBalloonUp()
      }
      
      // Make the prize entity fall by giving it gravity
      if (prizeEntity && ecs.Collider.has(world, prizeEntity)) {
        ecs.Collider.mutate(world, prizeEntity, (cursor) => {
          cursor.gravityFactor = 1.0  // Enable gravity
          cursor.mass = 1.0  // Give it mass so it becomes dynamic
          cursor.restitution = 0.6  // Add some bounce
          cursor.friction = 0.8  // Add friction for realistic behavior
        })
      } else if (prizeEntity) {
        // If prize doesn't have a collider, add one
        ecs.Collider.set(world, prizeEntity, {
          mass: 1.0,
          gravityFactor: 1.0,
          restitution: 0.6,
          friction: 0.8,
        })
      }
      
      // Play pop sound if provided
      if (popSound && popSound.trim() !== '') {
        // Create a temporary audio entity for the pop sound
        const audioEntity = world.createEntity()
        ecs.Position.set(world, audioEntity, ecs.Position.get(world, eid))
        ecs.Audio.set(world, audioEntity, {
          url: popSound,
          volume: 0.7,
          loop: false,
          paused: false,
          positional: true,
        })
        
        // Remove the audio entity after the sound finishes
        world.events.addListener(audioEntity, ecs.events.AUDIO_END, () => {
          world.deleteEntity(audioEntity)
        })
      }
      
      // Dispatch a custom event that other components can listen to
      world.events.dispatch(world.events.globalId, 'balloon-popped', {
        balloonEid: eid,
        prizeEid: prizeEntity,
      })
    }

    // Helper function for balloon collision (balloon pops and hides)
    const handleBalloonCollisionStart = (event: any) => {
      const data = dataAttribute.get(eid)
      
      console.log('Collision detected on balloon entity')
      console.log('Collision event:', event)
      console.log('Collision data:', event.data)
      
      // Don't process if already popped
      if (data.isPopped) {
        console.log('Balloon already popped, ignoring collision')
        return
      }
      
      // Check if the collision is with a dart entity
      const colliderEid = event.data?.other
      if (!colliderEid) {
        console.log('No collider entity found in event')
        return
      }
      
      console.log('Checking if collider entity is dart:', colliderEid)
      console.log('Collider has Collider component:', ecs.Collider.has(world, colliderEid))
      
      if (ecs.Collider.has(world, colliderEid)) {
        const collider = ecs.Collider.get(world, colliderEid)
        console.log('Collider properties:', {
          mass: collider.mass,
          gravityFactor: collider.gravityFactor
        })
      }
      
      if (isDartEntity(colliderEid)) {
        console.log('Dart hit balloon directly!')
        popBalloon()
      } else {
        console.log('Collision was not with a dart entity')
      }
    }

    // Helper function for prize collision (balloon floats away)
    const handlePrizeCollisionStart = (event: any) => {
      const data = dataAttribute.get(eid)
      
      console.log('Collision detected on prize entity')
      console.log('Collision event:', event)
      console.log('Collision data:', event.data)
      
      // Don't process if already popped
      if (data.isPopped) {
        console.log('Balloon already popped, ignoring collision')
        return
      }
      
      // Check if the collision is with a dart entity
      const colliderEid = event.data?.other
      if (!colliderEid) {
        console.log('No collider entity found in event')
        return
      }
      
      console.log('Checking if collider entity is dart:', colliderEid)
      console.log('Collider has Collider component:', ecs.Collider.has(world, colliderEid))
      
      if (ecs.Collider.has(world, colliderEid)) {
        const collider = ecs.Collider.get(world, colliderEid)
        console.log('Collider properties:', {
          mass: collider.mass,
          gravityFactor: collider.gravityFactor
        })
      }
      
      if (isDartEntity(colliderEid)) {
        console.log('Dart hit prize!')
        handlePrizeHit()
      } else {
        console.log('Collision was not with a dart entity')
      }
    }

    // State: Active - waiting for collision with dart on balloon OR prize entity
    ecs.defineState('active')
      .initial()
      .onEnter(() => {
        // Initialize as not popped
        dataAttribute.set(eid, {isPopped: false})
        console.log('Balloon ready to be popped via balloon or prize collision')
        
        // Set up collision listener on the prize entity
        const {prizeEntity} = schemaAttribute.get(eid)
        if (prizeEntity) {
          world.events.addListener(prizeEntity, ecs.physics.COLLISION_START_EVENT, handlePrizeCollisionStart)
        }
      })
      .onExit(() => {
        // Clean up listeners when exiting state
        const {prizeEntity} = schemaAttribute.get(eid)
        if (prizeEntity) {
          world.events.removeListener(prizeEntity, ecs.physics.COLLISION_START_EVENT, handlePrizeCollisionStart)
        }
      })
      // Also listen for collisions on the balloon entity itself
      .listen(eid, ecs.physics.COLLISION_START_EVENT, handleBalloonCollisionStart)

    // State: Popped - balloon has been popped
    ecs.defineState('popped')
      .onEnter(() => {
        console.log('Balloon is now popped')
      })
  },
  add: (world, component) => {
    // Ensure the balloon entity has a collider for collision detection
    if (!ecs.Collider.has(world, component.eid)) {
      // Add a static collider that only detects events (doesn't affect physics)
      ecs.Collider.set(world, component.eid, {
        mass: 0,  // Static collider
        eventOnly: true,  // Only for collision detection, not physics
      })
    }

    // Ensure the prize entity has a collider for collision detection
    const {prizeEntity} = component.schema
    if (prizeEntity && !ecs.Collider.has(world, prizeEntity)) {
      // Add a static collider that only detects events (doesn't affect physics initially)
      ecs.Collider.set(world, prizeEntity, {
        mass: 0,  // Static collider initially
        eventOnly: true,  // Only for collision detection, not physics
        gravityFactor: 0,  // No gravity initially
      })
    }
  },
})
