import * as ecs from '@8thwall/ecs'
import {WorldMapLocation} from './world-map-location'

ecs.registerComponent({
  name: 'World Map',
  schema: {
    // @label WASD Movement
    wasdMovement: ecs.boolean,
    // @label Distance Threshold
    threshold: ecs.f32,
    // @group start Ring Color:color
    ringR: ecs.f32,
    ringG: ecs.f32,
    ringB: ecs.f32,
    // @group end
    // @group start Sphere Color:color
    sphereR: ecs.f32,
    sphereG: ecs.f32,
    sphereB: ecs.f32,
    // @group end
  },
  schemaDefaults: {
    wasdMovement: false,
    threshold: 0.5,
    ringR: 255,
    ringG: 255,
    ringB: 255,
    sphereR: 255,
    sphereG: 255,
    sphereB: 255,
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const wasdEnabled = schemaAttribute.get(eid).wasdMovement
        // @ts-ignore
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
            // @ts-ignore
            ecs.Map.mutate(world, eid, (cursor) => {
              cursor.latitude += latDirection * (1 / 111111) * world.time.delta * 0.1
              cursor.longitude -= lonDirection * (1 / 111111) * world.time.delta * 0.1
            })

            dataAttribute.set(eid, {
              // @ts-ignore
              latitude: ecs.Map.get(world, eid).latitude,
              // @ts-ignore
              longitude: ecs.Map.get(world, eid).longitude,
            })
          }
        }
      })
      .listen(eid, 'locationSpawned', (e) => {
        const {threshold, sphereR, sphereG, sphereB, ringR, ringG, ringB} = schemaAttribute.get(eid)
        const content = world.createEntity()

        // @ts-ignore
        world.setParent(content, e.data.mapPoint)

        ecs.Position.set(world, content, {
          x: 0,
          y: 0.5,
          z: 0,
        })

        world.time.setTimeout(() => {
          WorldMapLocation.set(world, content, {
            threshold,
            // @ts-ignore
            displayName: `${e.data.title}`,
            // @ts-ignore
            thumbnailImage: `${e.data.imageUrl}`,
            ringR,
            ringG,
            ringB,
            sphereR,
            sphereG,
            sphereB,
          })
        }, 10)
      })
  },
})
