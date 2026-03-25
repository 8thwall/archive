import * as ecs from '@8thwall/ecs'

const spawnPoints: ecs.Eid[] = []
const mat4 = ecs.math.mat4.i()

const LevelManager = ecs.registerComponent({
  name: 'level-manager',
  schema: {
    player: ecs.eid,
    initialSpawn: ecs.eid,
    camera: ecs.eid,
    spawn01: ecs.eid,
    spawn02: ecs.eid,
    spawn03: ecs.eid,
    spawn04: ecs.eid,
    spawn05: ecs.eid,
    xBound: ecs.f32,
    yBound: ecs.f32,
    zBound: ecs.f32,
    sky: ecs.f32,
  },
  schemaDefaults: {
    xBound: 20,
    yBound: 20,
    zBound: 20,
    sky: 100,
  },
  data: {
    currentSpawnPoint: ecs.eid,
  },
  add: (world, component) => {
    const {schema} = component
    if (schema.spawn01) {
      spawnPoints.push(schema.spawn01)
    }
    if (schema.spawn02) {
      spawnPoints.push(schema.spawn02)
    }
    if (schema.spawn03) {
      spawnPoints.push(schema.spawn03)
    }
    if (schema.spawn04) {
      spawnPoints.push(schema.spawn04)
    }
    if (schema.spawn05) {
      spawnPoints.push(schema.spawn05)
    }
    component.data.currentSpawnPoint = component.schema.initialSpawn
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('LEVEL_PLAY').initial()
      .listen(world.events.globalId, 'LEVEL_START', ((e) => {
        // set the first spawn point
        world.getWorldTransform(schemaAttribute.get(eid).initialSpawn, mat4)
        world.setTransform(schemaAttribute.get(eid).player, mat4)
        world.camera.setActiveEid(schemaAttribute.get(eid).camera)
        console.log('Moving player to initial spawn')
        dataAttribute.set(eid, {currentSpawnPoint: schemaAttribute.get(eid).initialSpawn})
      }))
      .listen(world.events.globalId, 'PLAYER_SHAPE_MATCHED', ((e) => {
        // progress to the next spawn point
        console.log('Player shapped matched!')
        const {currentSpawnPoint} = dataAttribute.get(eid)
        const intialSpawnPoint = schemaAttribute.get(eid).initialSpawn
        const index = currentSpawnPoint === intialSpawnPoint ? 0
          : spawnPoints.indexOf(currentSpawnPoint) + 1

        if (spawnPoints.length <= index) {
          // game over you win
          world.events.dispatch(world.events.globalId, 'LEVEL_FINISHED')
          return
        }

        // update the new spawnpoint / checkpoint
        dataAttribute.set(eid, {currentSpawnPoint: spawnPoints[index]})
      }))
      .listen(world.events.globalId, 'PLAYER_RESPAWN', ((e) => {
        // respawn the player
        console.log('Respawning player')
        ecs.physics.setLinearVelocity(world, schemaAttribute.get(eid).player, 0, 0, 0)
        const pos = world.transform.getWorldPosition(dataAttribute.get(eid).currentSpawnPoint)
        world.transform.setWorldPosition(schemaAttribute.get(eid).player, pos)
      }))
  },
  tick: (world, component) => {
    const {xBound, yBound, zBound, player, sky} = component.schema
    const obj = ecs.Position.get(world, player)
    if (Math.abs(obj.x) > xBound || obj.y < -yBound || obj.y > sky || Math.abs(obj.z) > zBound) {
      world.events.dispatch(world.events.globalId, 'PLAYER_RESPAWN')
    }
  },
  remove: (world, component) => {
    while (spawnPoints.length) {
      spawnPoints.pop()
    }
  },
})

export {LevelManager}
