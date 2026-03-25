import * as ecs from '@8thwall/ecs'

const {Quaternion} = ecs
const {quat} = ecs.math

const q = quat.zero()

const setYAngle = (world, eid, angle: number) => {
  Quaternion.set(world, eid, q.makeYRadians(angle))
}

export {
  setYAngle,
}
