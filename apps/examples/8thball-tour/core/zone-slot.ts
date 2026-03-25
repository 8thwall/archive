import * as ecs from '@8thwall/ecs'
import {Player} from './player'

ecs.registerComponent({
  name: 'Slot Zone',
  schema: {
    // @asset
    acceptedAsset: ecs.string,
    // @asset
    nextAsset: ecs.string,
    collider: ecs.eid,
    scale: ecs.f32,
    player: ecs.eid,
  },
  schemaDefaults:
  {
    scale: 1.0,
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const {acceptedAsset, nextAsset} = schemaAttribute.get(eid)

        if (!acceptedAsset || acceptedAsset.length <= 0) {
          console.warn('acceptedAsset is missing from schema on Zone.')
        }

        if (!nextAsset || nextAsset.length <= 0) {
          console.warn('nextAsset is missing from schema on Zone.')
        }

        ecs.Collider.set(world, eid, {
          eventOnly: true,
        })
      })
      .listen(schemaAttribute.get(eid).collider, ecs.physics.COLLISION_START_EVENT, (e) => {
        // @ts-ignore
        const {other} = e.data
        if (Player.has(world, other)) {
          const {acceptedAsset, nextAsset} = schemaAttribute.get(eid)
          const {url} = ecs.GltfModel.get(world, other)

          if (acceptedAsset === url) {
            world.events.dispatch(world.events.globalId, 'PLAYER_SHAPE_MATCHED', ({nextAsset}))
            world.events.dispatch(world.events.globalId, 'ADD_TIMER')
            ecs.Disabled.set(world, eid)
            if (schemaAttribute.get(eid).player) {
              ecs.Scale.set(schemaAttribute.get(eid).player, schemaAttribute.scale)
            }
          }
        }
      })
  },
})
