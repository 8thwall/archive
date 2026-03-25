import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Hotspot',
  schema: {
    // @required
    uiElement: ecs.eid,
    speed: ecs.i32,
    highlightedSpeed: ecs.i32,
    // @group start Default Color:color
    r: ecs.f32,
    g: ecs.f32,
    b: ecs.f32,
    // @group end
    // @group start Highlighted Color:color
    highlightedR: ecs.f32,
    highlightedG: ecs.f32,
    highlightedB: ecs.f32,
    // @group end
  },
  schemaDefaults: {
    speed: 5000,
    highlightedSpeed: 1500,
    r: 174,
    g: 0,
    b: 255,
    highlightedR: 255,
    highlightedG: 0,
    highlightedB: 255,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('idle')
      .initial()
      .onEnter(() => {
        const {speed, r, g, b, uiElement} = schemaAttribute.get(eid)

        ecs.Material.mutate(world, eid, (cursor) => {
          cursor.r = r
          cursor.g = g
          cursor.b = b
        })

        ecs.RotateAnimation.set(world, eid, {
          loop: true,
          autoFrom: true,
          toY: 360,
          shortestPath: false,
          duration: speed,
        })

        ecs.LookAtAnimation.set(world, uiElement, {
          target: world.camera.getActiveEid(),
        })

        ecs.Hidden.set(world, uiElement, {})
      })
      .listen(eid, ecs.input.SCREEN_TOUCH_START, (e) => {
        world.events.dispatch(world.events.globalId, 'hotspot_activated', {
        // @ts-ignore
          eid: e.data.target,
        })
      })
      .listen(world.events.globalId, 'hotspot_activated', (e) => {
        const {uiElement, r, g, b, highlightedR, highlightedG, highlightedB, speed, highlightedSpeed} = schemaAttribute.get(eid)

        // @ts-ignore
        if (e.data.eid === eid) {
          ecs.RotateAnimation.mutate(world, eid, (cursor) => {
            cursor.duration = highlightedSpeed
          })

          ecs.Material.mutate(world, eid, (cursor) => {
            cursor.r = highlightedR
            cursor.g = highlightedG
            cursor.b = highlightedB
          })

          ecs.Hidden.remove(world, uiElement)
        } else {
          ecs.RotateAnimation.mutate(world, eid, (cursor) => {
            cursor.duration = speed
          })

          ecs.Material.mutate(world, eid, (cursor) => {
            cursor.r = r
            cursor.g = g
            cursor.b = b
          })

          ecs.Hidden.set(world, uiElement, {})
        }
      })
  },
})
