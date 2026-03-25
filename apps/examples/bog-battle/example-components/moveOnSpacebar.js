import * as ecs from '@8thwall/ecs'

// Register the component with the ECS system
const moveOnSpacebar = ecs.registerComponent({
  name: 'moveOnSpacebar',
  schema: {
    force: ecs.f32,  // This represents the magnitude of the force applied per key press
  },
  schemaDefaults: {
    force: 10.0,  // Default force is 10.0 units
  },
  add: (world, component) => {
    const eid = component.id

    // Define keyState as a property of the component
    component.keyState = {w: false, a: false, s: false, d: false, space: false}

    const updateKeyState = (event, isPressed) => {
      switch (event.code) {
        case 'KeyW': component.keyState.w = isPressed; break
        case 'KeyA': component.keyState.a = isPressed; break
        case 'KeyS': component.keyState.s = isPressed; break
        case 'KeyD': component.keyState.d = isPressed; break
        case 'Space': component.keyState.space = isPressed; break
        default:
          // Log unexpected key codes or handle them as needed
          console.log(`Unhandled key: ${event.code}`)
          break
      }
    }

    window.addEventListener('keydown', event => updateKeyState(event, true))
    window.addEventListener('keyup', event => updateKeyState(event, false))
  },
  tick: (world, component) => {
    const eid = component.id
    const {keyState} = component  // Use the keyState from the component
    if (keyState.w) {
      ecs.Physics.applyForce(world, eid, 0, 0, -component.schema.force)  // Forward
      console.log('Forward force applied')
    }
    if (keyState.s) {
      ecs.Physics.applyForce(world, eid, 0, 0, component.schema.force)  // Backward
      console.log('Backward force applied')
    }
    if (keyState.a) {
      ecs.Physics.applyForce(world, eid, -component.schema.force, 0, 0)  // Left
      console.log('Left force applied')
    }
    if (keyState.d) {
      ecs.Physics.applyForce(world, eid, component.schema.force, 0, 0)  // Right
      console.log('Right force applied')
    }
    if (keyState.space) {
      ecs.Physics.applyForce(world, eid, 0, component.schema.force, 0)  // Upward
      console.log('Upward force applied')
    }
  },
})

export {moveOnSpacebar}
