import ecs from '@ecs/runtime'

const OrbitComponent = ecs.registerComponent({
  name: 'orbit',
  schema: {
    radius: ecs.f32,
    duration: ecs.f32,
    // @enum vertical, elliptical, circular
    type: ecs.string,
  },
  tick: (world, component) => {
    const angle = (world.time.elapsed / component.schema.duration) * Math.PI * 2
    switch (component.schema.type) {
      case 'elliptical':
        world.setPosition(component.eid,
          Math.cos(angle) * component.schema.radius,
          0,
          (Math.sin(angle) * component.schema.radius) / 1.5)
        break
      case 'vertical':
        world.setPosition(component.eid,
          0,
          Math.cos(angle) * component.schema.radius,
          Math.sin(angle) * component.schema.radius)
        break
      case 'circular':
        world.setPosition(component.eid,
          Math.cos(angle) * component.schema.radius,
          0,
          Math.sin(angle) * component.schema.radius)
        break
      default:
        throw new Error(`Unknown orbit type: ${component.schema.type}`)
    }
  },
})

const Orbit = {
  ...OrbitComponent,
  Elliptical: 'elliptical',
  Circular: 'circular',
}

export {
  Orbit,
}
