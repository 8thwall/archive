import * as ecs from '@8thwall/ecs'
const cleanUp = new Map()
const GunModel = ecs.registerComponent({
  name: 'GunModel',
  schema: {},
  schemaDefaults: {},
  add: (world, component) => {},
  remove: (world, component) => {
    const run = cleanUp.get(component.eid)
    if (run) {
      run()
    }
    cleanUp.delete(component.eid)
  },
})

export {GunModel}
