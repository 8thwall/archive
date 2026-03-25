// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'

import {BlightEnemyController} from './enemy/blight-enemy-controller'

const CameraTarget = ecs.registerComponent({
  name: 'camera-target',
  schema: {
    // Add data that can be configured on the component.
    player: ecs.eid,
    completed: ecs.boolean,
    enemy1: ecs.eid,
    enemy2: ecs.eid,
    enemy3: ecs.eid,
    enemy4: ecs.eid,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('starting').initial()
      .listen(eid, ecs.physics.COLLISION_START_EVENT, (event: any) => {
        if (event.data.other === schemaAttribute.get(eid).player) {
          world.events.dispatch(
            world.events.globalId, 'attemptEnterRoom',
            {lockDoors: !schemaAttribute.get(eid).completed, targetId: eid}
          )
          const {enemy1, enemy2, enemy3, enemy4} = schemaAttribute.get(eid)
          world.events.dispatch(enemy1, 'activate')
          world.events.dispatch(enemy2, 'activate')
          world.events.dispatch(enemy3, 'activate')
          world.events.dispatch(enemy4, 'activate')
        }
      })
      .listen(eid, ecs.physics.COLLISION_END_EVENT, (event: any) => {
        if (event.data.other === schemaAttribute.get(eid).player) {
          world.events.dispatch(world.events.globalId, 'exitRoom', {targetId: eid})
        }
      })
      .listen(world.events.globalId, 'resetGame', () => {
        const schema = schemaAttribute.cursor(eid)
        schema.completed = false
      })
      .onTick(() => {
        const {enemy1, enemy2, enemy3, enemy4} = schemaAttribute.get(eid)
        let stillAlive = false
        if (BlightEnemyController.has(world, enemy1)) {
          if (!BlightEnemyController.get(world, enemy1).isDead) {
            stillAlive = true
          }
        } if (BlightEnemyController.has(world, enemy2)) {
          if (!BlightEnemyController.get(world, enemy2).isDead) {
            stillAlive = true
          }
        } if (BlightEnemyController.has(world, enemy3)) {
          if (!BlightEnemyController.get(world, enemy3).isDead) {
            stillAlive = true
          }
        } if (BlightEnemyController.has(world, enemy4)) {
          if (!BlightEnemyController.get(world, enemy4).isDead) {
            stillAlive = true
          }
        }

        if (!stillAlive) {
          const schema = schemaAttribute.cursor(eid)
          schema.completed = true
          world.events.dispatch(world.events.globalId, 'roomCompleted', {targetId: eid})
          world.events.dispatch(world.events.globalId, 'exitRoom', {targetId: eid})
        }
      })
  },
})

export {
  CameraTarget,
}
