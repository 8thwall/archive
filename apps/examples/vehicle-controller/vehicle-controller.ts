import * as ecs from '@8thwall/ecs'

const vehicleController = ecs.registerComponent({
  name: 'vehicleController',
  // Define configurable properties for the car
  schema: {
    speed: ecs.f32,
    rotationSpeed: ecs.f32,
    particleSystem: ecs.eid,  // Reference to the particle system entity
  },
  // Set default values for schema properties
  schemaDefaults: {
    speed: 140.0,
    rotationSpeed: 3.0,
  },
  // Define internal data used by the component
  data: {
    currentAngle: ecs.f32,
    currentState: ecs.string,
  },
  // State machine to manage car's states
  stateMachine: ({world, eid, dataAttribute, schemaAttribute}) => {
    // Helper function to update and log car state
    const updateCarState = (newState) => {
      dataAttribute.set(eid, {currentState: newState})
      console.log(`Car state changed to: ${newState}`)

      // Update particle system based on the new state
      const schema = schemaAttribute.cursor(eid)
      if (schema.particleSystem) {
        ecs.ParticleEmitter.set(world, schema.particleSystem, {
          stopped: newState === 'idle',
        })
      }
    }

    // Define 'idle' state - initial state when the car is not moving
    const idle = ecs.defineState('idle').initial()
      .onEvent('start_moving', 'moving')
      .onEnter(() => updateCarState('idle'))

    // Define 'moving' state - when the car is in motion
    ecs.defineState('moving')
      .onEvent('stop_moving', 'idle')
      .onEnter(() => updateCarState('moving'))

    // Initialize car data
    dataAttribute.set(eid, {currentAngle: 0, currentState: 'idle'})
  },
  // Tick function runs every frame to update car movement
  tick: (world, component) => {
    const {eid, data} = component
    const schema = vehicleController.get(world, eid)
    const delta = world.time.delta / 1000

    let appliedForce = 0
    let rotation = 0

    // Determine if the car is moving based on input
    if (world.input.getAction('forward') || world.input.getAction('backward')) {
      appliedForce = world.input.getAction('forward') ? schema.speed : -schema.speed
      world.events.dispatch(eid, 'start_moving')
    } else {
      world.events.dispatch(eid, 'stop_moving')
    }

    if (appliedForce !== 0) {
      // Apply steering rotation based on input
      if (world.input.getAction('left')) {
        rotation = schema.rotationSpeed * delta
      } else if (world.input.getAction('right')) {
        rotation = -schema.rotationSpeed * delta
      }

      // Update the current angle of the car
      data.currentAngle += rotation

      // Calculate and apply quaternion rotation to the car
      const halfAngle = data.currentAngle / 2
      const s = Math.sin(halfAngle)
      const c = Math.cos(halfAngle)
      world.setQuaternion(eid, 0, s, 0, c)

      // Calculate movement forces based on current angle and speed
      const forwardX = Math.sin(data.currentAngle) * appliedForce
      const forwardZ = Math.cos(data.currentAngle) * appliedForce

      // Apply movement forces to the car
      ecs.physics.applyForce(world, eid, -forwardX, 0, -forwardZ)
    }
  },
})

export {vehicleController}
