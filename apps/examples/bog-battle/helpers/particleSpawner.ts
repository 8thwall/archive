import * as ecs from '@8thwall/ecs'

const {THREE} = (window as any)

const CreateParticle = (world, spawnEntity, particleModel, scale, xForce, yForce, zForce) => {
  const particleEntity = world.createEntity()
  const spawnerObject = world.three.entityToObject.get(spawnEntity)
  const worldPosition = new THREE.Vector3()
  // Get the world position of the object
  spawnerObject.getWorldPosition(worldPosition)
  world.setPosition(
    particleEntity,
    worldPosition.x,
    worldPosition.y,
    worldPosition.z
  )
  // world.setParent(particleEntity, spawnEntity)
  world.setScale(particleEntity, scale, scale, scale)

  // ecs.GltfModel.set(world, particleEntity, {
  //   url: particleModel,
  // })
  ecs.SphereGeometry.set(world, particleEntity, {radius: 1})
  ecs.Material.set(world, particleEntity, {r: 109, g: 195, b: 201})
  ecs.Collider.set(world, particleEntity, {
    shape: ecs.ColliderShape.Sphere,
    radius: 0.02,
    mass: 1,
    eventOnly: true,
    friction: 0,
    restitution: 0,
    linearDamping: 0,
    angularDamping: 0,
    rollingFriction: 0,
    spinningFriction: 0,
  })
  ecs.physics.applyForce(world, particleEntity, xForce, yForce, zForce)

  return particleEntity
}
const DestroyParticles = (world, particleArray) => {
  const arrayLength = particleArray.length
  for (let i = 0; i < arrayLength; i++) {
    world.deleteEntity(particleArray[i])
  }
}
const BurstParticles = (world, spawnEntity, particleModel) => {
  const particleArray = []
  const scale = 0.2
  const yForce = 300
  const xzScaler = 200
  const xForceArray = [0, 0.95, 0.59, -0.59, -0.95]
  const zForceArray = [1, 0.31, -0.81, -0.81, 0.31]
  for (let i = 0; i < 5; i++) {
    const zForce = zForceArray[i] * xzScaler
    const xForce = xForceArray[i] * xzScaler
    particleArray.push(CreateParticle(world, spawnEntity,
      particleModel, scale, xForce, yForce, zForce))
  }
  world.time.setTimeout(() => {
    DestroyParticles(world, particleArray)
  }, 800)
}

export {BurstParticles}
