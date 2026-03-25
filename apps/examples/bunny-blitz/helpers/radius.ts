const clampPositionToRadius = (x, z, radius) => {
  const distance = Math.sqrt(x * x + z * z)
  if (distance > radius) {
    const angle = Math.atan2(z, x)
    x = radius * Math.cos(angle)
    z = radius * Math.sin(angle)
  }
  return {x, z}
}

const randomPointInRadius = (radius) => {
  // Generate a random angle between 0 and 2π
  const angle = Math.random() * 2 * Math.PI

  // Generate a random radius between 0 and the maximum radius, adjusted for uniform distribution
  const randomRadius = Math.sqrt(Math.random()) * radius

  // Calculate new target positions based on the random angle and radius
  const x = randomRadius * Math.cos(angle)
  const z = randomRadius * Math.sin(angle)

  return {x, z}
}

export {clampPositionToRadius, randomPointInRadius}
