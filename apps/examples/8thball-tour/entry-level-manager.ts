// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

ecs.registerComponent({
  name: 'entry-level-manager',
  schema: {
    collider: ecs.eid,
    player: ecs.eid,
    // @asset
    acceptedAsset: ecs.string,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {collider, player, acceptedAsset} = schemaAttribute.get(eid)
    ecs.defineState('default').initial()
      .listen(collider, ecs.physics.COLLISION_START_EVENT, (e) => {
        const {url} = ecs.GltfModel.get(world, e.data.other)
        if (e.data.other === player) {
          if (!acceptedAsset || acceptedAsset === url) {
            world.events.dispatch(world.events.globalId, 'LEVEL_FINISHED')
          }
        }
      })
  },
})
