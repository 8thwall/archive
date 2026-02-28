import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Projectile Shooter',
  schema: {
    force: ecs.f32,
    radius: ecs.f32,
  },
  schemaDefaults: {
    force: 20,
    radius: 0.2,
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {THREE} = window as any
    const direction = new THREE.Vector3()
    const cameraPosition = new THREE.Vector3()
    const toCooldown = ecs.defineTrigger()

    ecs.defineState('default')
      .initial()
      .onTick(() => {
        const {force, radius} = schemaAttribute.get(eid)

        if (world.input.getAction('shoot') > 0) {
          const o3d = world.three.entityToObject.get(world.camera.getActiveEid())
          o3d.getWorldPosition(cameraPosition)
          o3d.getWorldDirection(direction)

          const spawnPosition = cameraPosition.clone().add(direction.clone().multiplyScalar(radius * 2 + 1))
          const ball = world.createEntity()

          ecs.Position.set(world, ball, {
            x: spawnPosition.x,
            y: spawnPosition.y,
            z: spawnPosition.z,
          })

          ecs.SphereGeometry.set(world, ball, {
            radius,
          })

          ecs.Material.set(world, ball, {
            r: 255,
            g: 255,
            b: 255,
            roughness: 0.9,
          })

          ecs.Collider.set(world, ball, {
            shape: ecs.physics.ColliderShape.Sphere,
            type: 1,
            mass: 8,
            radius: 0.2,
            friction: 0.8,
          })

          ecs.physics.setLinearVelocity(
            world,
            ball,
            direction.x * force,
            direction.y * force,
            direction.z * force
          )

          toCooldown.trigger()
        }
      })
      .onTrigger(toCooldown, 'cooldown')

    ecs.defineState('cooldown')
      .wait(500, 'default')
  },
})
