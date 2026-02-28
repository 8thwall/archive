import ecs, {Quaternion, defineSystem, registerBehavior} from '@ecs/runtime'

const Spin = ecs.registerComponent({
  name: 'spin',
  schema: {
    x: ecs.f32,
    y: ecs.f32,
    z: ecs.f32,
    speed: ecs.f32,
  },
})

registerBehavior(defineSystem<[typeof Spin, typeof Quaternion]>(
  [Spin, Quaternion],
  (world, eid, [spin, quaternion]) => {
    const a = (world.time.elapsed * spin.speed) / 1000

    const sin = Math.sin(a)
    const cos = Math.cos(a)

    const baseX = spin.x * sin
    const baseY = spin.y * sin
    const baseZ = spin.z * sin
    const baseW = cos

    const mag = Math.sqrt(
      baseX ** 2 +
      baseY ** 2 +
      baseZ ** 2 +
      baseW ** 2
    )

    quaternion.x = baseX / mag
    quaternion.y = baseY / mag
    quaternion.z = baseZ / mag
    quaternion.w = baseW / mag

    // TODO(christoph): Think about ways to make this unnecessary
    Quaternion.dirty(world, eid)
  }
))
