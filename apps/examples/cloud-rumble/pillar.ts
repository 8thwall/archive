import ecs from './helpers/runtime'

// Register the component with the ECS system
const Pillar = ecs.registerComponent({
  name: 'pillar',
  schema: {
    moveSpeed: ecs.f32,
    targetHeight: ecs.f32,
  },
  schemaDefaults: {
    moveSpeed: 0.0001,
    targetHeight: 0.0,
  },
  data: {
    currentHeight: ecs.f32,
  },

  add: (world, component) => {
    const {data} = component
    data.currentHeight = 0
    data.targetHeight = 0
  },

  tick: (world, component) => {
    const {eid} = component
    const {schema} = component  // Use the keyState and schema from the component
    const {data} = component

    if (data.currentHeight !== schema.targetHeight) {
      // console.log('moving', data.currentHeight, schema.targetHeight)
      if (data.currentHeight < schema.targetHeight) {
        data.currentHeight += schema.moveSpeed
        if (data.currentHeight > schema.targetHeight) {
          data.currentHeight = schema.targetHeight
        }
      } else {
        data.currentHeight -= schema.moveSpeed
        if (data.currentHeight < schema.targetHeight) {
          data.currentHeight = schema.targetHeight
        }
      }

      const currentPos = ecs.Position.get(world, eid)
      world.setPosition(component.eid, currentPos.x, component.data.currentHeight, currentPos.z)
    }
  },
})

export {Pillar}
