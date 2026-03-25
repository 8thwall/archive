import * as ecs from '@8thwall/ecs'
import {ColliderData} from '../collider-data'
import {Projectile} from './projectile'
import {ProjectileTrailComponent} from './projectile-trail'
export const ProjectileSpawnerEvents = {
  Spawn: 'spawn',
}

export class SpawnProjectileEvent {
  /**
   * @param {[number,number,number]} direction
   * @param {string} colliderDataType
   * @param {string} colliderDataName
   * @param {number} force
   * @param {number} mass
   * @param {[number,number,number]} size
   * @param {import("three").Mesh} object
   * @param {boolean} ghost
   * @param {boolean} trail
   */
  constructor(
    direction,
    colliderDataType,
    colliderDataName,
    force,
    mass,
    size,
    object,
    ghost,
    trail
  ) {
    /**
     * @type {[number,number,number]}
     */
    this.direction = direction

    /**
     * @type {number}
     */
    this.force = force
    /**
     * @type {number}
     */
    this.mass = mass

    /**
     * @type {string}
     */
    this.colliderDataType = colliderDataType

    /**
     * @type {string}
     */
    this.colliderDataName = colliderDataName

    /**
     * @type {[number,number,number]} size
     */
    this.size = size

    /**
     * @type {import("three").Mesh} object
     */
    this.object = object

    /**
     * @type {boolean} ghost
     */
    this.eventOnly = ghost
    /**
     * @type {boolean} ghost
     */
    this.trail = trail
  }

  addComponents(world, eid) {}
}

/**
 * @type {Map<BigInteger,Function>} cleanUp
 */
const cleanUp = new Map()

const ProjectileSpawner = ecs.registerComponent({
  name: 'ProjectileSpawner',
  schema: {},
  schemaDefaults: {},
  add: (world, component) => {
    const {eid} = component

    const spawnListener = ({data}) => {
      /**
       * @type {SpawnProjectileEvent}
       */
      const event = data
      const projectileId = world.createEntity()
      const spawnerObject = world.three.entityToObject.get(eid)
      const worldPosition = new THREE.Vector3()
      // Get the world position of the object
      spawnerObject.getWorldPosition(worldPosition)
      world.setPosition(
        projectileId,
        worldPosition.x,
        worldPosition.y,
        worldPosition.z
      )
      const projectileObject = world.three.entityToObject.get(projectileId)
      projectileObject.add(event.object)

      const linearDamping = 0.1
      const speed = event.force
      const mass = 0.025

      ecs.Collider.set(world, projectileId, {
        shape: ecs.ColliderShape.Box,
        width: event.size[0],
        height: event.size[1],
        depth: event.size[2],
        mass,
        eventOnly: event.eventOnly,
        friction: 0.5,
        restitution: 0.5,
        linearDamping,
        angularDamping: 0,
        rollingFriction: 0.1,
        spinningFriction: 0.1,
      })
      ColliderData.set(world, projectileId, {
        type: event.colliderDataType,
        name: event.colliderDataName,
      })

      Projectile.set(world, projectileId, {
        lifeTime: 5_000,
        forceTime: 100,
        speed,
        mass,
        directionX: event.direction[0],
        directionY: event.direction[1],
        directionZ: event.direction[2],
      })

      if (event.trail) {
        ProjectileTrailComponent.set(world, projectileId, {})
      }
      event.addComponents(world, projectileId)
    }

    world.events.addListener(eid, ProjectileSpawnerEvents.Spawn, spawnListener)

    cleanUp.set(eid, () => {
      world.events.removeListener(
        eid,
        ProjectileSpawnerEvents.Spawn,
        spawnListener
      )
    })
  },
  remove: (world, component) => {
    const run = cleanUp.get(component.eid)
    run()
    cleanUp.delete(component.eid)
  },
})

export {ProjectileSpawner}
