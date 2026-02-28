import * as ecs from '@8thwall/ecs'

const colors = [
  '#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#5ac8fa', '#007aff', '#AD50FF', '#ff2d90',
]

const hexToRgb = (hex) => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '')

  // Parse the r, g, b values
  let r; let g; let
    b

  // If the hex code is in shorthand format (e.g., #abc)
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  }
  // If the hex code is in full format (e.g., #aabbcc)
  else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  } else {
    throw new Error('Invalid hex code')
  }

  return {r, g, b}
}

const spawner = ecs.registerComponent({
  name: 'sphere-spawner',

  schema: {
    spawnInterval: ecs.f32,
    sphereRadius: ecs.f32,
    sphereMass: ecs.f32,
  },

  schemaDefaults: {
    spawnInterval: 150,
    sphereRadius: 0.03,
    sphereMass: 1,
  },

  data: {
    lastSpawnTime: ecs.f64,
  },

  add: (world, component) => {
    component.data.lastSpawnTime = world.time.elapsed
  },

  tick: (world, component) => {
    const currentTime = world.time.elapsed
    const {spawnInterval, sphereRadius, sphereMass} = component.schema
    const {lastSpawnTime} = component.data

    if (currentTime - lastSpawnTime >= spawnInterval) {
      // Spawn a new sphere
      const sphereEntity = world.createEntity()

      // Calculate a random x & z position within a range
      const randomX = (Math.random() * 2 - 1) * 0.05
      const randomZ = (Math.random() * 2 - 1) * 0.05

      // Set world position with random x offset
      world.setPosition(sphereEntity, randomX, 2, randomZ)

      // Add sphere geometry
      ecs.SphereGeometry.set(world, sphereEntity, {radius: sphereRadius})

      const randColor = hexToRgb(colors[Math.floor(Math.random() * colors.length)])

      // Add material
      ecs.Material.set(world, sphereEntity, {
        r: randColor.r,
        g: randColor.g,
        b: randColor.b,
        roughness: 0,
        metalness: 0,
      })

      // Configure physics collider
      ecs.Collider.set(world, sphereEntity, {
        type: 1,  // Dynamic Collider
        shape: ecs.ColliderShape.Sphere,
        radius: sphereRadius,
        mass: sphereMass,
        restitution: 0.6,
        friction: 0.3,
      })

      // Set a timeout to remove the entity after 10 seconds
      world.time.setTimeout(() => {
        world.deleteEntity(sphereEntity)
      }, 10000)

      // Update last spawn time
      component.data.lastSpawnTime = currentTime
    }
  },

  remove: (world, component) => {
    // Clean up code if needed
  },
})

export {spawner}
