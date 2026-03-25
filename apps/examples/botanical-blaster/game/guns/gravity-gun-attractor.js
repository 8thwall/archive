import * as ecs from '@8thwall/ecs'
const cleanUp = new Map()
const GravityGunAttractor = ecs.registerComponent({
  name: 'GravityGunAttractor',
  schema: {},
  schemaDefaults: {},
  add: (world, component) => {
  },
  remove: (world, component) => {
    const run = cleanUp.get(component.eid)
    run()
    cleanUp.delete(component.eid)
  },
})

export {GravityGunAttractor}
