import * as ecs from '@8thwall/ecs'

const EPSILON = 0.1

class ProjectileAgent {
  constructor(world, schema, eid) {
    this.world = world
    this.schema = {...schema}  // Copy schema values
    this.eid = eid
    this.startTime = this.world.time.elapsed
    this.startPosition = {x: schema.startX, y: schema.startY, z: schema.startZ}
    this.endPosition = {x: schema.endX, y: schema.endY, z: schema.endZ}
    this.maxHeight = schema.maxHeight
    this.duration = schema.duration / 1000

    const direction = {
      x: this.endPosition.x - this.startPosition.x,
      y: this.endPosition.y - this.startPosition.y,
      z: this.endPosition.z - this.startPosition.z,
    }
    this.distance = Math.sqrt(
      direction.x * direction.x +
      direction.y * direction.y +
      direction.z * direction.z
    )

    // Set the initial position of the projectile
    ecs.Position.set(this.world, this.eid, this.startPosition)
    ecs.SphereGeometry.set(this.world, this.eid, {radius: 0.25})
    ecs.Material.set(this.world, this.eid, {r: 224, g: 203, b: 144})
    ecs.Audio.set(world, this.eid, {
      url: '//static.8thwall.app/assets/BogCannon-ooagok032e.mp3',
      volume: 0.2,
      loop: false,
      pitch: 1.0,
      paused: false,
    })
  }

  update() {
    const elapsedTime = (this.world.time.elapsed - this.startTime) / 1000  // Convert to seconds
    const t = elapsedTime / this.duration
    const height = 4 * this.maxHeight * t * (1 - t)  // Parabolic equation

    const currentPosition = {
      x: this.startPosition.x + (this.endPosition.x - this.startPosition.x) * t,
      y: this.startPosition.y + (this.endPosition.y - this.startPosition.y) * t + height,
      z: this.startPosition.z + (this.endPosition.z - this.startPosition.z) * t,
    }

    ecs.Position.set(this.world, this.eid, currentPosition)

    // Check if the projectile has reached the end position within an epsilon distance
    const distanceToEnd = Math.sqrt(
      (currentPosition.x - this.endPosition.x) * (currentPosition.x - this.endPosition.x) +
      (currentPosition.y - this.endPosition.y) * (currentPosition.y - this.endPosition.y) +
      (currentPosition.z - this.endPosition.z) * (currentPosition.z - this.endPosition.z)
    )

    if (elapsedTime >= this.duration || distanceToEnd < EPSILON) {
      // Remove the projectile entity
      this.world.deleteEntity(this.eid)
    }
  }
}

const projectileAgents = new Map()

const Projectile = ecs.registerComponent({
  name: 'Projectile',
  schema: {
    startX: ecs.f32,
    startY: ecs.f32,
    startZ: ecs.f32,
    endX: ecs.f32,
    endY: ecs.f32,
    endZ: ecs.f32,
    maxHeight: ecs.f32,
    duration: ecs.f32,
  },
  schemaDefaults: {
    duration: 2000,
  },
  add: (world, component) => {
    console.log(`Added Projectile Component ${component.eid}`)
    const agent = new ProjectileAgent(world, component.schema, component.eid)
    projectileAgents.set(component.eid, agent)
  },
  tick: (world, component) => {
    const agent = projectileAgents.get(component.eid)
    if (agent) {
      agent.update()
    }
  },
  remove: (world, component) => {
    projectileAgents.delete(component.eid)
  },
})

export {Projectile}
