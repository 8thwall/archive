import ecs from '@ecs/runtime'

function getColliderShapeName(value: number) {
  const keys = Object.keys(ecs.physics.ColliderShape)
  const foundKey = keys.find(key => ecs.physics.ColliderShape[key] === value)
  if (foundKey) {
    return foundKey
  }
  throw new Error('Invalid ColliderShape value')
}

ecs.registerComponent({
  name: 'debug-edit-shape',
  schema: {
    delay: ecs.i32,
    shape: ecs.ui8,
    friction: ecs.f32,
    mass: ecs.f32,
    radius: ecs.f32,
    width: ecs.f32,
    height: ecs.f32,
    depth: ecs.f32,
    linearDamping: 'f32',
    angularDamping: 'f32',
    restitution: 'f32',
  },
  data: {
    startTime: ecs.i32,
    isColliderSet: ecs.boolean,
  },
  add: (world, component) => {
    if (component.data.startTime === 0) {
      component.data.startTime = world.time.elapsed
    }
  },
  tick: (world, component) => {
    if (!component.data.isColliderSet &&
      world.time.elapsed - component.data.startTime > component.schema.delay) {
      world.events.dispatch(component.eid,
        `Setting collider shape to ${getColliderShapeName(component.schema.shape)}`)
      ecs.Collider.set(world, component.eid, {
        shape: component.schema.shape,
        friction: component.schema.friction,
        mass: component.schema.mass,
        radius: component.schema.radius,
        width: component.schema.width,
        height: component.schema.height,
        depth: component.schema.depth,
        linearDamping: component.schema.linearDamping,
        angularDamping: component.schema.angularDamping,
        restitution: component.schema.restitution,
      })
      component.data.isColliderSet = true
    }
  },
})
