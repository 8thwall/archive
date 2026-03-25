import * as ecs from '@8thwall/ecs'

class ProjectileTrail {
  /**
   * @param {*} world
   * @param {BigInteger} entityId
   */
  constructor(world, entityId) {
    this.world = world
    this.entityId = entityId

    /**
     * @type {import("three").Vector3} worldPosition
     */
    this.worldPosition = new THREE.Vector3()

    /**
     * @type {import("three").Object3D} worldObject
     */
    this.worldObject = world.three.entityToObject.get(entityId)

    // Initialize empty geometry
    this.geometry = new THREE.BufferGeometry()

    // Create colors array
    this.colors = new Float32Array(0)

    /**
     * @type {import("three").Vector3[]} points
     */
    this.points = []

    this.material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      transparent: true,
    })

    // Create tube mesh and add to the world object
    this.tube = new THREE.Mesh(this.geometry, this.material)
    this.world.scene.add(this.tube)

    this.maxPointLength = 10

    this.clock = new THREE.Clock()
    this.clock.start()

    this.started = false
    this.disposed = false
  }

  start() {
    this.syncWorldPosition()
    this.points = [
      this.worldPosition.clone(),
      this.worldPosition.clone(),
      this.worldPosition.clone(),
    ]
    this.setPath()
    this.started = true
  }

  syncWorldPosition() {
    this.worldObject.getWorldPosition(this.worldPosition)
  }

  updateColors() {
    for (let i = 0; i < this.colors.length / 4; i++) {
      const alpha = 1 - i / (this.colors.length / 4)
      this.colors[i * 4 + 0] = 1.0  // Red
      this.colors[i * 4 + 1] = 1.0  // Green
      this.colors[i * 4 + 2] = 1.0  // Blue
      this.colors[i * 4 + 3] = alpha  // Alpha
    }
  }

  setPath() {
    // Create colors array
    this.path = new THREE.CatmullRomCurve3([...this.points])

    // Dispose of old geometry
    if (this.geometry) {
      this.geometry.dispose()
    }

    this.geometry = new THREE.TubeGeometry(this.path, 20, 0.1, 8, true)
    this.colors = new Float32Array(this.geometry.attributes.position.count * 4)

    this.updateColors()
    this.geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(this.colors, 4)
    )
  }

  update() {
    if (this.disposed || !this.started) return
    this.syncWorldPosition()
    const time = this.clock.getElapsedTime()
    if (time > 0.25) {
      this.points.unshift(this.worldPosition.clone())
    } else {
      this.points[0] = this.worldPosition.clone()
    }
    if (this.points.length > this.maxPointLength) {
      this.points.pop()
    }
    this.setPath()
    this.tube.geometry.dispose()
    this.tube.geometry = this.geometry
  }

  dispose() {
    this.disposed = true
    this.world.scene.remove(this.tube)
    this.tube.geometry.dispose()
    this.tube.material.dispose()
    if (this.geometry) {
      this.geometry.dispose()
    }
  }
}

/**
 * @type {Map<BigInteger, ProjectileTrail>} entities
 */
const entities = new Map()

const ProjectileTrailComponent = ecs.registerComponent({
  name: 'ProjectileTrail',
  schema: {},
  schemaDefaults: {},
  data: {start: ecs.f64},
  add: (world, component) => {
    const {eid} = component
    const trail = new ProjectileTrail(world, eid)
    entities.set(eid, trail)
    setTimeout(() => {
      trail.start()
    }, 25)
  },
  remove: (world, component) => {
    const trail = entities.get(component.eid)
    if (!trail) return
    trail.dispose()
    entities.delete(component.eid)
  },

  tick: (world, component) => {
    const trail = entities.get(component.eid)
    if (!trail) return
    trail.update()
  },
})

export {ProjectileTrailComponent}
