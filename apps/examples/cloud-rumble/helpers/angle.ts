const setYAngle = (world, eid, angle: number) => {
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

export {
  setYAngle,
}
