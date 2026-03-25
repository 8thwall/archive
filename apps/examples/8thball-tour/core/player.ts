import * as ecs from '@8thwall/ecs'

function clamp(val, min, max) {
  return val < min ? min : val > max ? max : val
}

const Player = ecs.registerComponent({
  name: 'Player',
  schema: {
    force: ecs.f32,
    scale: ecs.f32,
  },
  schemaDefaults: {
    force: 10.0,
  },
  data: {
    isGrounded: ecs.boolean,
    canMove: ecs.boolean,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        dataAttribute.set(eid, {
          canMove: true,
        })
      })
      .onTick(() => {
        const {force} = schemaAttribute.get(eid)
        const movement = ecs.math.vec2.xy(0, 0)
        const hits = world.raycast(ecs.Position.get(world, eid), ecs.math.vec3.xyz(0, -1, 0), 0.1, 5)

        dataAttribute.set(eid, {
          isGrounded: hits.length > 0,
        })

        if (world.input.getAction('backward')) {
          movement.setY(movement.y + force)
        } else if (world.input.getAction('forward')) {
          movement.setY(movement.y - force)
        }

        if (world.input.getAction('right')) {
          movement.setX(movement.x + force)
        } else if (world.input.getAction('left')) {
          movement.setX(movement.x - force)
        }

        movement.normalize()

        const {canMove, isGrounded} = dataAttribute.get(eid)

        if (canMove) {
        // Old movement mode. Maybe make it optional per object? - George
        // ecs.physics.applyForce(world, eid, movement.x, 0, movement.y)
          ecs.physics.applyTorque(world, eid, movement.y, 0, -movement.x)
        }

        // if (world.input.getAction('jump')) {
        //   if (canMove && isGrounded) {
        //     ecs.physics.applyImpulse(world, eid, 0, 0.25, 0)
        //     world.events.dispatch(world.events.globalId, 'PLAYER_JUMP')
        //   }
        // }

        if (ecs.GltfModel.get(world, eid).url === 'assets/environment/space/moon.glb' && ecs.Scale.get(world, eid).x < 5) {
          ecs.Scale.mutate(world, eid, (cursor) => {
            cursor.x += 0.01
            cursor.y += 0.01
            cursor.z += 0.01
          })
        }
      })
      .listen(world.events.globalId, 'PLAYER_SHAPE_MATCHED', (e) => {
        // @ts-ignore
        const {nextAsset} = e.data

        ecs.GltfModel.set(world, eid, {
          url: nextAsset,
          collider: true,
        })

        ecs.Audio.set(world, eid, {
          url: 'assets/audio/player-shapes-matched.mp3',
          paused: false,
          positional: false,
        })
      })
      .listen(eid, ecs.events.GLTF_MODEL_LOADED, () => {
        ecs.ScaleAnimation.set(world, eid, {
          fromX: 0.001,
          fromY: 0.001,
          fromZ: 0.001,
          toX: schemaAttribute.get(eid).scale || 1,
          toY: schemaAttribute.get(eid).scale || 1,
          toZ: schemaAttribute.get(eid).scale || 1,
          duration: 2000,
          loop: false,
          easeOut: true,
          easingFunction: 'Elastic',
        })
        ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)
        if (ecs.GltfModel.get(world, eid).url === 'assets/environment/space/moon.glb') {
          ecs.Collider.set(world, eid, {
            mass: 5,
          })

          schemaAttribute.set(eid, {force: 100})
        }
      })
      .listen(world.events.globalId, 'PLAYER_DIED', () => {
        dataAttribute.set(eid, {
          canMove: false,
        })
      })
      .listen(world.events.globalId, 'PLAYER_RESPAWN', () => {
        ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)

        dataAttribute.set(eid, {
          canMove: true,
        })
      })
      .listen(world.events.globalId, 'GYRO_FRONT_TO_BACK', (e) => {
        // @ts-ignore
        const {motion} = e.data
        const {canMove} = dataAttribute.get(eid)

        if (motion && canMove) {
          ecs.physics.applyTorque(world, eid, motion / 8, 0, 0)
        }
      })
      .listen(world.events.globalId, 'GYRO_ROTATE_DEGREES', (e) => {
        // @ts-ignore
        const {motion} = e.data
        const {canMove} = dataAttribute.get(eid)

        if (motion && canMove) {
          ecs.physics.applyTorque(world, eid, 0, 0, -motion / 8)
        }
      })
  },
})

export {Player}
