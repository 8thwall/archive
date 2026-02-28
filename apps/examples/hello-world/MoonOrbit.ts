import * as ecs from '@8thwall/ecs'

// Register a new component called 'Moon'
ecs.registerComponent({
  name: 'Moon Orbit',
  schema: {
    // Define the schema for the component
    distance: ecs.f32,
    duration: ecs.f32,
  },
  schemaDefaults: {
    // Define the default values for the schema (empty in this case)
    distance: 3,
    duration: 10000,
  },
  data: {
    // Define the initial data for the component (empty in this case)
  },
  add: (world, component) => {
    // Create a pivot entity
    const pivot = world.createEntity()
    // Get the position of the current component (Earth) entity
    const {x, y, z} = ecs.Position.get(world, component.eid)
    const {distance, duration} = component.schema
    // Set the position of the pivot entity to the position of the current component (Earth) entity
    world.setPosition(pivot, x, y, z)

    // Add a rotation animation to the pivot entity to give rotation to its children
    ecs.RotateAnimation.set(world, pivot, {
      loop: true,
      fromX: 0,
      fromY: 0,
      fromZ: 0,
      toX: 0,
      toY: 360,
      toZ: 0,
      shortestPath: false,
      duration,
    })

    // Create the moon entity
    const moon = world.createEntity()
    // Set the pivot entity as the parent of the moon entity
    world.setParent(moon, pivot)
    // Set the position of the moon entity relative to the pivot
    world.setPosition(moon, distance, 0, 0)

    // Add a GLTF model to the moon entity
    ecs.GltfModel.set(world, moon, {
      url: 'assets/Moon.glb',
    })
  },
  tick: (world, component) => {
    // Define the behavior of the component on each tick (empty in this case)
  },
  remove: (world, component) => {
    // Define the behavior of the component when it is removed (empty in this case)
  },
})
