import * as ecs from '@8thwall/ecs'

const {Scale} = ecs
const {vec3} = ecs.math

const v = vec3.zero()

const Health = ecs.registerComponent({
  name: 'health',
  schema: {
    health: ecs.i32,
  },
  schemaDefaults: {
    health: 5,
  },
  add: (world, component) => {
    console.log(`Health added with EID: ${component.eid}`)
    // world.events.addListener(world.events.globalId, 'stateChanged', (e) => {
    //   console.log('Receieved', 'stateChanged', 'on', e.target, 'event:', e)
    // })
    const startingHealth = component.schema.health
    const startingScale = Scale.get(world, component.eid).x
    const endingScale = startingScale * 0.2

    world.events.addListener(component.eid, 'reduceHealth', (e) => {
      if (component.schema.health > 0) {
        component.schema.health -= 1
      }

      const newScale =
        (component.schema.health / startingHealth) * (startingScale - endingScale) + endingScale
      Scale.set(world, component.eid, v.makeOne().setScale(newScale))

      const childScale = startingScale / newScale

      for (const childEid of world.getChildren(component.eid)) {
        Scale.set(world, childEid, v.makeOne().setScale(childScale))
      }

      console.log(`Health reduced to ${component.schema.health}`)
      if (component.schema.health === 0) {
        world.deleteEntity(component.eid)
        world.events.dispatch(world.events.globalId, 'zeroHP', {})
      }
    })
  },
  remove: (world, component) => {
    console.log(`health removed with EID: ${component.eid}`)
  },
})

export {Health}
