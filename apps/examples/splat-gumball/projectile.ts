import * as ecs from '@8thwall/ecs'

const {THREE} = window as any
const direction = new THREE.Vector3()
const cameraPosition = new THREE.Vector3()

// Array of available GLB models
const glbModels = [
  'blue.glb',
  'dark-red.glb',
  'green.glb',
  'orange.glb',
  'pink.glb',
  'purple.glb',
  'white.glb',
  'yellow.glb',
]

// Function to get a random GLB model
const getRandomGlbModel = () => {
  const randomIndex = Math.floor(Math.random() * glbModels.length)
  return glbModels[randomIndex]
}

ecs.registerComponent({
  name: 'projectile',
  schema: {
    force: ecs.f32,
    radius: ecs.f32,
  },
  schemaDefaults: {
    force: 20,
    radius: 0.2,
  },
  data: {
    wasShooting: ecs.boolean,
  },
  tick: (world, component) => {
    const actionValue = world.input.getAction('shoot')
    const isShooting = actionValue > 0

    if (!component.data.wasShooting && isShooting) {
      const o3d = world.three.entityToObject.get(world.camera.getActiveEid())
      o3d.getWorldPosition(cameraPosition)
      o3d.getWorldDirection(direction)

      const offsetDistance = 1
      const spawnPosition = cameraPosition.clone().add(direction.clone().multiplyScalar(offsetDistance))
      const projectile = world.createEntity()

      ecs.Position.set(world, projectile, {
        x: spawnPosition.x,
        y: spawnPosition.y,
        z: spawnPosition.z,
      })

      // Set a random GLB model for the projectile
      const randomGlbModel = getRandomGlbModel()
      ecs.GltfModel.set(world, projectile, {
        url: require(`./assets/${randomGlbModel}`),
        loop: false,
        paused: false,
      })

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

      world.events.addListener(projectile, ecs.physics.COLLISION_START_EVENT, (e) => {
        setTimeout(() => {
          ecs.ScaleAnimation.set(world, projectile, {
            autoFrom: true,
            loop: false,
            toX: 0,
            toY: 0,
            toZ: 0,
            duration: 1200,
            easingFunction: 'Elastic',
            easeOut: true,
          })
          setTimeout(() => {
            world.deleteEntity(projectile)
          }, 1200)
        }, 10000)
      })
    }

    component.data.wasShooting = isShooting
  },
})
