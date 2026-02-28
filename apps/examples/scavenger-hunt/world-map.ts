import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'World Map',
  schema: {
    // @label WASD Movement
    wasdMovement: ecs.boolean,
  },
  schemaDefaults: {
    wasdMovement: false,
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const wasdEnabled = schemaAttribute.get(eid).wasdMovement
        const gpsEnabled = ecs.Map.get(world, eid).useGps

        if (wasdEnabled && gpsEnabled) {
          console.warn('The map is currently using both GPS and WASD controls. Only one option is supported at a time.')
        }
      })
      .onTick(() => {
        const wasdEnabled = schemaAttribute.get(eid).wasdMovement

        if (wasdEnabled) {
          const forward = world.input.getKey('KeyW')
          const backward = world.input.getKey('KeyS')
          const left = world.input.getKey('KeyA')
          const right = world.input.getKey('KeyD')

          let latDirection = 0
          let lonDirection = 0

          if (forward) latDirection = -1
          if (backward) latDirection = 1
          if (left) lonDirection = -1
          if (right) lonDirection = 1

          if (latDirection !== 0 || lonDirection !== 0) {
            ecs.Map.mutate(world, eid, (cursor) => {
              cursor.latitude += latDirection * (1 / 111111) * world.time.delta * 0.1
              cursor.longitude -= lonDirection * (1 / 111111) * world.time.delta * 0.1
            })

            dataAttribute.set(eid, {
              latitude: ecs.Map.get(world, eid).latitude,
              longitude: ecs.Map.get(world, eid).longitude,
            })
          }
        }
      })
  },
})
