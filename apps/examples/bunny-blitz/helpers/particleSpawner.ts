import * as ecs from '@8thwall/ecs'

const {Position, Scale} = ecs
const {mat4, quat, vec3} = ecs.math

const trsMat = mat4.i()
const trs = {t: vec3.zero(), r: quat.zero(), s: vec3.zero()}
const v = vec3.zero()

const CreateParticle = (world, spawnEntity, particleModel, scale, xForce, yForce, zForce) => {
  const particleEid = world.createEntity()
  world.getWorldTransform(spawnEntity, trsMat)
  const {t: worldPosition} = trsMat.decomposeTrs(trs)
  Position.set(world, particleEid, worldPosition)

  // world.setParent(particleEntity, spawnEntity)
  Scale.set(world, particleEid, v.makeOne().setScale(scale))

  ecs.GltfModel.set(world, particleEid, {url: particleModel})
  ecs.Collider.set(world, particleEid, {
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
  ecs.physics.applyForce(world, particleEid, xForce, yForce, zForce)

  return particleEid
}
const DestroyParticles = (world, particleArray) => {
  const arrayLength = particleArray.length
  for (let i = 0; i < arrayLength; i++) {
    world.deleteEntity(particleArray[i])
  }
}
const BurstParticles = (world, spawnEntity, particleModel) => {
  const particleArray = []
  const scale = 8
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
