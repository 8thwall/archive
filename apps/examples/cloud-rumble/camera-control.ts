import ecs from './helpers/runtime'

// Register the component with the ECS system
const cameraControl = ecs.registerComponent({
  name: 'cameraControl',
  schema: {
    character: ecs.eid,
    offsetX: ecs.f32,
    offsetY: ecs.f32,
    offsetZ: ecs.f32,
    moveSpeed: ecs.f32,
  },
  schemaDefaults: {
    offsetX: 0.0,
    offsetY: 2.0,
    offsetZ: -5.0,
    moveSpeed: 0.1,
  },

  add: (world, component) => {

  },

  tick: (world, component) => {
    const {eid} = component
    const {schema} = component  // Use the keyState and schema from the component

    // Get target character's position
    const charTransform = ecs.math.mat4.i()
    world.getWorldTransform(schema.character, charTransform)
    const charTrs = {
      t: ecs.math.vec3.zero(),
      r: ecs.math.quat.zero(),
      s: ecs.math.vec3.zero(),
    }
    charTransform.decomposeTrs(charTrs)

    // Add offset to get new position
    // const newPosition = ecs.math.Vec3.zero()
    // newPosition.setXyz(
    //   charTrs.t.x() + schema.offsetX,
    //   charTrs.t.y() + schema.offsetY,
    //   charTrs.t.z() + schema.offsetZ
    // )

    const offset = ecs.math.vec3.zero()
    offset.setXyz(schema.offsetX, schema.offsetY, schema.offsetZ)

    const newPosition = charTrs.t.plus(offset)
    //const newPosition = charTrs.t + offset
    // newPosition = charTrs.t + new ecs.math.vec3(schema.offsetX,schema.offsetY, schema.offsetZ)

    // Get camera's current position
    const camTransform = ecs.math.mat4.i()
    world.getWorldTransform(eid, camTransform)

    const camTrs = {
      t: ecs.math.vec3.zero(),
      r: ecs.math.quat.zero(),
      s: ecs.math.vec3.zero(),
    }
    camTransform.decomposeTrs(camTrs)

    // Lerp to the new position
    const result = ecs.math.vec3.zero()
    result.setXyz(camTrs.t.x + schema.moveSpeed * (newPosition.x - camTrs.t.x),
      camTrs.t.y + schema.moveSpeed * (newPosition.y - camTrs.t.y),
      camTrs.t.z + schema.moveSpeed * (newPosition.z - camTrs.t.z))

    world.setPosition(eid, result.x, result.y, result.z)
  },
})

export {cameraControl}
