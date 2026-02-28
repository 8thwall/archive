import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'World Map Camera Controls',
  schema: {
    // @min 1
    rotationSensitivity: ecs.f32,
  },
  schemaDefaults: {
    rotationSensitivity: 8.0,
  },
  data: {
    velocity: ecs.f64,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        dataAttribute.set(eid, {
          velocity: 0,
        })
      })
      .onTick(() => {
        const quat = ecs.math.quat.yDegrees(dataAttribute.get(eid).velocity)

        ecs.Quaternion.set(world, eid, {...quat})
      })
      .listen(world.events.globalId, ecs.input.SCREEN_TOUCH_MOVE, (e) => {
        dataAttribute.mutate(eid, (cursor) => {
          const {rotationSensitivity} = schemaAttribute.get(eid)
          // @ts-ignore
          cursor.velocity += e.data.change.x * world.time.delta * rotationSensitivity
        })
      })
  },
})
