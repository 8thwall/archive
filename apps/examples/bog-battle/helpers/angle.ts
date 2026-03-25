import * as ecs from '@8thwall/ecs'
import type {World} from '@8thwall/ecs'

const {quat, vec3} = ecs.math

const setYAngle = (world: World, eid: BigInt, angle: number) => {
  const a = angle / 2
  const sin = Math.sin(a)
  const cos = Math.cos(a)

  const baseX = 0 * sin
  const baseY = 1 * sin
  const baseZ = 0 * sin
  const baseW = cos

  const mag = Math.sqrt(
    baseX ** 2 +
    baseY ** 2 +
    baseZ ** 2 +
    baseW ** 2
  )

  world.setQuaternion(eid,
    baseX / mag,
    baseY / mag,
    baseZ / mag,
    baseW / mag)
}

const setXAngle = (world: World, eid: BigInt, angle: number) => {
  const a = angle / 2
  const sin = Math.sin(a)
  const cos = Math.cos(a)

  const baseX = 1 * sin
  const baseY = 0 * sin
  const baseZ = 0 * sin
  const baseW = cos

  const mag = Math.sqrt(
    baseX ** 2 +
    baseY ** 2 +
    baseZ ** 2 +
    baseW ** 2
  )

  world.setQuaternion(eid,
    baseX / mag,
    baseY / mag,
    baseZ / mag,
    baseW / mag)
}

const setZAngle = (world: World, eid: BigInt, angle: number) => {
  const a = angle / 2
  const sin = Math.sin(a)
  const cos = Math.cos(a)

  const baseX = 0 * sin
  const baseY = 0 * sin
  const baseZ = 1 * sin
  const baseW = cos

  const mag = Math.sqrt(
    baseX ** 2 +
    baseY ** 2 +
    baseZ ** 2 +
    baseW ** 2
  )

  world.setQuaternion(eid,
    baseX / mag,
    baseY / mag,
    baseZ / mag,
    baseW / mag)
}

const setXYZAngle = (world: World, eid: BigInt, xAngle: number, yAngle: number, zAngle: number) => {
  // Convert angles from degrees to radians
  const xRad = xAngle * (Math.PI / 180)
  const yRad = yAngle * (Math.PI / 180)
  const zRad = zAngle * (Math.PI / 180)

  // Compute sin and cos for half angles
  const cx = Math.cos(xRad / 2)
  const cy = Math.cos(yRad / 2)
  const cz = Math.cos(zRad / 2)
  const sx = Math.sin(xRad / 2)
  const sy = Math.sin(yRad / 2)
  const sz = Math.sin(zRad / 2)

  // Calculate the quaternion components
  const qw = cx * cy * cz + sx * sy * sz
  const qx = sx * cy * cz - cx * sy * sz
  const qy = cx * sy * cz + sx * cy * sz
  const qz = cx * cy * sz - sx * sy * cz

  // Normalize the quaternion
  const mag = Math.sqrt(qx * qx + qy * qy + qz * qz + qw * qw)

  // Set the quaternion to the entity
  world.setQuaternion(eid, qx / mag, qy / mag, qz / mag, qw / mag)
}

const quaternion90 = quat.pitchYawRollDegrees(vec3.xyz(-90, 0, 0))

const rotateEntity90 = (world: World, eid: BigInt) => {
  world.setQuaternion(eid, quaternion90.x, quaternion90.y, quaternion90.z, quaternion90.w)
}

export {
  setYAngle,
  setXAngle,
  setZAngle,
  setXYZAngle,
  rotateEntity90,
}
