import ecs from '@ecs/runtime'

const RandomizeChildren = ecs.registerComponent({
  name: 'debug-randomize-children',
  schema: {
    scale: ecs.f32,
    rate: ecs.f32,
  },
  schemaDefaults: {
    scale: 1,
    rate: 100,
  },
  tick: (world, component) => {
    if (Math.random() < 1 / component.schema.rate) {
      const children = [...world.getChildren(component.eid)]
      const randomChild = children[Math.floor(Math.random() * children.length)]
      if (randomChild) {
        ecs.Position.set(world, randomChild, {
          x: (Math.random() * 2 - 1) * component.schema.scale,
          y: (Math.random() * 2 - 1) * component.schema.scale,
          z: (Math.random() * 2 - 1) * component.schema.scale,
        })
      }
    }
  },
})

export {
  RandomizeChildren,
}
