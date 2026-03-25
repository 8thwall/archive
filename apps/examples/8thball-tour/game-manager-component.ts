import * as ecs from '@8thwall/ecs'

const spawnPoints: ecs.Eid[] = []
const mat4 = ecs.math.mat4.i()
function playSound(world, soundUrl, volume = 0.7) {
  console.log('Playing sound:', soundUrl)

  const soundEntity = world.createEntity()

  ecs.Audio.set(world, soundEntity, {
    url: soundUrl,
    volume,
    loop: false,
  })

  world.time.setTimeout(() => {
    world.deleteEntity(soundEntity)
  }, 5000)
}
const PlayerManager = ecs.registerComponent({
  name: 'PlayerManager',
  schema: {
    player: ecs.eid,
    spawn01: ecs.eid,
    spawn02: ecs.eid,
    spawn03: ecs.eid,
    spawn04: ecs.eid,
    spawn05: ecs.eid,
    xBound: ecs.f32,
    yBound: ecs.f32,
    zBound: ecs.f32,
  },
  data: {
    currentSpawnPoint: ecs.eid,
  },
  add: (world, component) => {
    const {schema} = component
    spawnPoints.push(schema.spawn01)
    spawnPoints.push(schema.spawn02)
    spawnPoints.push(schema.spawn03)
    spawnPoints.push(schema.spawn04)
    spawnPoints.push(schema.spawn05)

    world.events.addListener(world.events.globalId, 'LEVEL_START', () => {
      const sound = world.createEntity()
      ecs.Audio.set(world, sound, {
        url: 'assets/audio/level-start.mp3',
        paused: false,
        positional: false,
      })

      // Cleanup after 5 seconds
      world.time.setTimeout(() => {
        world.deleteEntity(sound)
      }, 5000)
    })

    world.events.addListener(world.events.globalId, 'LEVEL_FINISHED', () => {
      const sound = world.createEntity()
      ecs.Audio.set(world, sound, {
        url: 'assets/audio/level-finished.mp3',
        paused: false,
        positional: false,
      })

      world.time.setTimeout(() => {
        world.deleteEntity(sound)
      }, 5000)
    })

    world.events.addListener(world.events.globalId, 'PLAYER_SHAPE_MATCHED', () => {
      const sound = world.createEntity()
      ecs.Audio.set(world, sound, {
        url: 'assets/audio/player-shape-matched.mp3',
        paused: false,
        positional: false,
      })

      world.time.setTimeout(() => {
        world.deleteEntity(sound)
      }, 5000)
    })

    world.events.addListener(world.events.globalId, 'PLAYER_RESPAWN', () => {
      const sound = world.createEntity()
      ecs.Audio.set(world, sound, {
        url: 'assets/audio/player-respawn.mp3',
        paused: false,
        positional: false,
      })

      world.time.setTimeout(() => {
        world.deleteEntity(sound)
      }, 5000)
    })

    world.events.addListener(world.events.globalId, 'PLAYER_JUMP', () => {
      const sound = world.createEntity()
      ecs.Audio.set(world, sound, {
        url: 'assets/audio/player-jump.mp3',
        paused: false,
        positional: false,
      })

      world.time.setTimeout(() => {
        world.deleteEntity(sound)
      }, 5000)
    })

    world.events.addListener(world.events.globalId, 'PLAYER_DIED', () => {
      const sound = world.createEntity()
      ecs.Audio.set(world, sound, {
        url: 'assets/audio/player-died.mp3',
        paused: false,
        positional: false,
      })

      world.time.setTimeout(() => {
        world.deleteEntity(sound)
      }, 5000)
    })

    // Trigger level start sound after a short delay
    world.time.setTimeout(() => {
      world.events.dispatch(world.events.globalId, 'LEVEL_START')
    }, 500)
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('LEVEL_PLAY')
      .listen(world.events.globalId, 'LEVEL_START', ((e) => {
        // set the first spawn point
        world.getWorldTransform(spawnPoints[0], mat4)
        world.setTransform(schemaAttribute.get(eid).player, mat4)
        dataAttribute.set(eid, {currentSpawnPoint: spawnPoints[0]})
      }))
      .listen(world.events.globalId, 'PLAYER_SHAPE_MATCHED', ((e) => {
        // progress to the next spawn point
        const index = spawnPoints.lastIndexOf(dataAttribute.get(eid).currentSpawnPoint) + 1
        if (spawnPoints.length <= index) {
          // game over you win
          world.events.dispatch(world.events.globalId, 'LEVEL_FINISHED')
          return
        }
        // update the new spawnpoint / checkpoint
        world.getWorldTransform(spawnPoints[index], mat4)
        world.setTransform(schemaAttribute.get(eid).player, mat4)
      }))
      .listen(world.events.globalId, 'PLAYER_RESPAWN', ((e) => {
        // respawn the player
        world.getWorldTransform(dataAttribute.get(eid).currentSpawnPoint, mat4)
        world.setTransform(schemaAttribute.get(eid).player, mat4)
      }))
  },
  tick: (world, component) => {
    const {xBound, yBound, zBound} = component.schema
    const obj = ecs.Position.get(world, component.eid)
    if (Math.abs(obj.x) > xBound || Math.abs(obj.y) > yBound || Math.abs(obj.z) > zBound) {
      world.events.dispatch(world.events.globalId, 'PLAYER_RESPAWN')
    }
  },
  remove: (world, component) => {
    while (spawnPoints.length) {
      spawnPoints.pop()
    }
  },
})

export {PlayerManager}
