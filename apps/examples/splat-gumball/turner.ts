import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

// Turn Model Component
ecs.registerComponent({
  name: 'turnModel',
  schema: {
    clickCooldown: ecs.f32,  // Cooldown time for clicks
  },
  schemaDefaults: {
    clickCooldown: 1000,  // 1 second cooldown
  },
  data: {
    turnModel: ecs.eid,  // Reference to the turn model entity
  },
  add: (world, component) => {
    let canClick = true

    // Create the initial turn model when the scene starts
    const turnModel = world.createEntity()
    component.data.turnModel = turnModel

    // Set the turn model at a fixed position
    ecs.Position.set(world, turnModel, {
      x: -0.226,
      y: 1.58,
      z: 0.131,
    })

    // Add the GLTF model
    ecs.GltfModel.set(world, turnModel, {
      url: require('./assets/turn.glb'),
      loop: false,
      paused: false,
    })

    world.events.addListener(component.eid, ecs.input.SCREEN_TOUCH_START, () => {
      if (canClick) {
        canClick = false
        setTimeout(() => {
          canClick = true
        }, component.schema.clickCooldown)

        // Create a new turn model before removing the current one to avoid any gap
        const newTurnModel = world.createEntity()

        // Set the new turn model at a fixed position
        ecs.Position.set(world, newTurnModel, {
          x: -0.226,
          y: 1.58,
          z: 0.131,
        })

        // Add the GLTF model to the new turn model
        ecs.GltfModel.set(world, newTurnModel, {
          url: require('./assets/turn.glb'),
          loop: false,
          paused: false,
        })

        // Add the GLTF animation component to play "Rotate"
        ecs.GltfModel.mutate(world, newTurnModel, (cursor) => {
          cursor.animationClip = 'Rotate'
          cursor.loop = false
          cursor.paused = false
          cursor.timeScale = 1.4
        })

        // Remove the current turn model after a short delay to allow the new model to be visible first
        setTimeout(() => {
          if (component.data.turnModel) {
            world.deleteEntity(component.data.turnModel)
          }
          // Update reference to the new turn model
          component.data.turnModel = newTurnModel
        }, 200)  // Short delay to ensure the new model is visible first
      }
    })
  },
  remove: (world, component) => {
    // Properly delete the turn model if it exists
    if (component.data.turnModel) {
      world.deleteEntity(component.data.turnModel)
    }
  },
})
