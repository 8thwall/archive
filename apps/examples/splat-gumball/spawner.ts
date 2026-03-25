import * as ecs from '@8thwall/ecs'

const {THREE} = window as any
const direction = new THREE.Vector3()
const spawnPosition = new THREE.Vector3()

// Array of available GLB models
const glbModels = [
  require('./assets/blue.glb'),
  require('./assets/dark-red.glb'),
  require('./assets/green.glb'),
  require('./assets/orange.glb'),
  require('./assets/pink.glb'),
  require('./assets/purple.glb'),
  require('./assets/white.glb'),
  require('./assets/yellow.glb'),
]

// Function to get a random GLB model
const getRandomGlbModel = () => {
  const randomIndex = Math.floor(Math.random() * glbModels.length)
  return glbModels[randomIndex]
}

let canShoot = true

// Spawner Component
ecs.registerComponent({
  name: 'spawner',
  schema: {
    force: ecs.f32,
    radius: ecs.f32,
    spawnX1: ecs.f32,
    spawnYMin: ecs.f32,
    spawnYMax: ecs.f32,
    spawnZMin: ecs.f32,
    spawnZMax: ecs.f32,
    modelCount: ecs.i32,
    removalTimeMin: ecs.f32,  // Minimum time before removal
    removalTimeMax: ecs.f32,  // Maximum time before removal
    shootCooldown: ecs.f32,  // Cooldown time for shooting
    shadowEnabled: ecs.boolean,  // Toggle for shadows
  },
  schemaDefaults: {
    force: 20,
    radius: 0.4,
    spawnX1: -3,
    spawnYMin: 10,
    spawnYMax: 20,
    spawnZMin: -3,
    spawnZMax: 3,
    modelCount: 50,
    removalTimeMin: 15000,  // 15 seconds
    removalTimeMax: 20000,  // 20 seconds
    shootCooldown: 2000,  // 2 seconds cooldown
    shadowEnabled: true,  // Enable shadows by default
  },
  data: {
    wasShooting: ecs.boolean,
  },
  add: (world, component) => {
    world.events.addListener(component.eid, ecs.input.SCREEN_TOUCH_START, () => {
      if (canShoot) {
        canShoot = false
        setTimeout(() => {
          canShoot = true
        }, component.schema.shootCooldown)

        console.log('something')  // Logs on touch to verify event firing

        // Shooting logic goes here
        for (let i = 0; i < component.schema.modelCount; i++) {
          const spawnZ = Math.random() * (component.schema.spawnZMax - component.schema.spawnZMin) + component.schema.spawnZMin
          const spawnY = Math.random() * (component.schema.spawnYMax - component.schema.spawnYMin) + component.schema.spawnYMin
          spawnPosition.set(component.schema.spawnX1, spawnY, spawnZ)
          const projectile = world.createEntity()

          // Initialize projectile
          ecs.Position.set(world, projectile, {
            x: spawnPosition.x,
            y: spawnPosition.y,
            z: spawnPosition.z,
          })
          ecs.GltfModel.set(world, projectile, {
            url: getRandomGlbModel(),
            loop: false,
            paused: false,
          })

          if (component.schema.shadowEnabled) {
            ecs.Shadow.set(world, projectile, {
              receiveShadow: true,
              castShadow: true,
            })
          }

          ecs.Collider.set(world, projectile, {
            shape: ecs.physics.ColliderShape.Sphere,
            mass: 8,
            radius: component.schema.radius,
            rollingFriction: 0.9,
            friction: 0.8,
          })

          ecs.physics.setLinearVelocity(
            world,
            projectile,
            direction.x * component.schema.force,
            direction.y * component.schema.force,
            direction.z * component.schema.force
          )

          // Schedule removal using a timer
          const removalTime = Math.random() * (component.schema.removalTimeMax - component.schema.removalTimeMin) + component.schema.removalTimeMin
          setTimeout(() => {
            ecs.ScaleAnimation.set(world, projectile, {
              autoFrom: true,
              loop: false,
              toX: 0,
              toY: 0,
              toZ: 0,
              duration: 1200,
              easingFunction: 'Exponential',
              easeOut: true,
            })
            setTimeout(() => {
              world.deleteEntity(projectile)
            }, 1200)
          }, removalTime)
        }
      }
    })
  },
  remove: (world, component) => {
    world.events.removeListener(component.eid, ecs.input.SCREEN_TOUCH_START, () => {
      console.log('Listener removed')  // Just to verify
    })
  },
})
