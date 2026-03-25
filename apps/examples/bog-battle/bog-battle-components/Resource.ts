import * as ecs from '@8thwall/ecs'

import {addResources} from './ResourceManager'

const Resource = ecs.registerComponent({
  name: 'Resource',
  schema: {
    amount: ecs.i32,
    // @condition true=false
    x: ecs.f32,
    // @condition true=false
    y: ecs.f32,
    // @condition true=false
    z: ecs.f32,
    // @condition true=false
    selectionScale: ecs.f32,
    // @asset
    model: ecs.string,
    // @condition true=false
    shouldAnimate: ecs.boolean,
  },
  schemaDefaults: {
    amount: 2,
    shouldAnimate: false,
  },
  add: (world, component) => {
    console.log(`Added resource ${component.eid}`)
    ecs.GltfModel.set(world, component.eid, {url: component.schema.model})

    world.events.addListener(component.eid, ecs.input.SCREEN_TOUCH_START, (e) => {
      const resource = Resource.cursor(world, e.target)
      addResources(resource.amount, world)

      resource.shouldAnimate = true
      resource.selectionScale = ecs.Scale.get(world, e.target).x
      // resource.y = 0.1

      setTimeout(() => {
        world.deleteEntity(e.target)
      }, 400)
    })
  },
  tick: (world, component) => {
    if (component.schema.shouldAnimate) {
      component.schema.y += 0.05
      component.schema.selectionScale *= 1.04
      ecs.Scale.set(world, component.eid, {
        x: component.schema.selectionScale,
        y: component.schema.selectionScale,
        z: component.schema.selectionScale,
      })
      ecs.Position.set(world, component.eid, {
        x: component.schema.x,
        y: component.schema.y,
        z: component.schema.z,
      })
    }
  },
})

export {Resource}
