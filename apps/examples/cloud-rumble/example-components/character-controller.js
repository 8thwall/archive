import ecs from '../helpers/runtime'



// Register the component with the ECS system
const characterController = ecs.registerComponent({
  name: 'characterController',
  schema: {
    force: ecs.f32,  // This represents the magnitude of the force applied per key press
    jumpForce: ecs.f32,  // Separate force magnitude for the space bar
  },
  schemaDefaults: {
    force: 25.0,  // Default force is 10.0 units
    jumpForce: 400.0,  // Default jump force is 15.0 units
  },
  add: (world, component) => {
    const eid = component.eid

    // Extend keyState to include last press timestamp for space
    component.keyState = {w: false, a: false, s: false, d: false, space: false, lastSpacePress: 0, canApplySpaceForce: false}

    const updateKeyState = (event, isPressed) => {
      switch (event.code) {
        case 'KeyW': component.keyState.w = isPressed; break
        case 'KeyA': component.keyState.a = isPressed; break
        case 'KeyS': component.keyState.s = isPressed; break
        case 'KeyD': component.keyState.d = isPressed; break
        case 'Space':
          if (isPressed) {
            const now = Date.now()
            if (now - component.keyState.lastSpacePress >= 1500) {  // Check if 1 second has passed
              component.keyState.space = true
              component.keyState.lastSpacePress = now
              component.keyState.canApplySpaceForce = true
            }
          } else {
            component.keyState.space = false
          }
          break
        default:
          console.log(`Unhandled key: ${event.code}`)
          break
      }
    }

    window.addEventListener('keydown', event => updateKeyState(event, true))
    window.addEventListener('keyup', event => updateKeyState(event, false))
  },
  tick: (world, component) => {
    const eid = component.eid
    const {keyState, schema} = component  // Use the keyState and schema from the component
    if (keyState.w) {
      ecs.physics.applyForce(world, eid, 0, 0, -schema.force)  // Forward
      console.log('Forward force applied')
    }
    if (keyState.s) {
      ecs.physics.applyForce(world, eid, 0, 0, schema.force)  // Backward
      console.log('Backward force applied')
    }
    if (keyState.a) {
      ecs.physics.applyForce(world, eid, -schema.force, 0, 0)  // Left
      console.log('Left force applied')
    }
    if (keyState.d) {
      ecs.physics.applyForce(world, eid, schema.force, 0, 0)  // Right
      console.log('Right force applied')
    }
    if (keyState.space && keyState.canApplySpaceForce) {
      ecs.physics.applyForce(world, eid, 0, schema.jumpForce, 0)  // Upward
      console.log('Upward force applied')
      component.keyState.canApplySpaceForce = false  // Prevent further force until next valid press
    }
  },
})

export {characterController}
