import * as ecs from '@8thwall/ecs'
import {Player} from './core/player'

// Quick and dirty respawn for the tutorial level

ecs.registerComponent({
  name: 'fell-off-map',
  schema: {
    player: ecs.eid,
  },
  schemaDefaults: {
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .listen(eid, ecs.physics.COLLISION_START_EVENT, (e) => {
        const {other} = e.data

        const playerObj = schemaAttribute.get(eid).player

        if (Player.has(world, other)) {
          if (ecs.GltfModel.get(world, playerObj).url === 'assets/environment/space/alien_converted.glb' || 'assets/environment/space/moon.glb') {
            ecs.GltfModel.set(world, playerObj, {url: 'assets/environment/space/rocket.glb'})
          }

          world.setPosition(other, 0, 3, 0)
          ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)
        }
      })
  },
})
