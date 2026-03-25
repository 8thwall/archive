import {ValueEaseAndTween} from '../../../helpers/EaseAndTween'
import {ColliderData} from '../../../components/collider-data'
import * as ecs from '@8thwall/ecs'
import {Projectile} from '../../../components/projectile/projectile'
import {PlanterEntity} from './planter-pot'
import {AudioBankManager} from '../../../components/audio/audio-bank'

/**
 * @type {Map<BigInteger,PlanterTargetEntity>}
 */
const entities = new Map()
class AcornFallingIntoVase {
  /**
   * @param {*} world
   *
   * @param {BigInteger} acordEntityId
   * @param {[number, number, number]} start
   * @param {[number, number, number]} end
   * @param {PlanterEntity} parent
   */
  constructor(world, acordEntityId, start, end, parent) {
    this.world = world
    this.acordEntityId = acordEntityId
    const {scene} = world
    this.scene = scene

    /**
     * @type {PlanterEntity} parent
     */
    this.parent = parent

    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
      new THREE.Vector3(...end),
    ])

    Projectile.remove(world, acordEntityId)

    ecs.Collider.remove(world, acordEntityId)

    this.startTime = null
    this.duration = 250
    this.clock = new THREE.Clock()
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime() * 1000

    if (elapsedTime > this.duration) {
      this.done()
      return
    }

    const t = elapsedTime / this.duration
    const point = this.curve.getPointAt(t)
    this.world.setPosition(this.acordEntityId, point.x, point.y, point.z)
  }

  done() {
    this.world.deleteEntity(this.acordEntityId)
    this.world.events.dispatch(
      this.parent.entityId,
      PlanterEntity.Events.Sprout,
      {}
    )
  }
}

class TargetFalling {
  /**
   * @param {*} world
   * @param {*} entityId
   * @param {PlanterTargetEntity} parent
   */
  constructor(world, entityId, parent) {
    /**
     * @type {PlanterTargetEntity}
     */
    this.parent = parent

    this.world = world
    this.entityId = entityId

    this.duration = 500  // duration in milliseconds
    const fps = 60  // frames per second
    this.interval = 1000 / fps  // interval in milliseconds

    /**
     * @type {ValueEaseAndTween}
     */
    this.tween = new ValueEaseAndTween({
      max: this.duration / this.interval,
      function: ValueEaseAndTween.EaseInOutExpo,
      start: 0,
      end: 2,
      onUpdate: (y) => {
        const pos = ecs.Position.get(world, entityId)
        world.setPosition(entityId, pos.x, pos.y - y, pos.z)
      },
      onDone: () => {},
    })
    /**
     * @type {import("three").Clock}
     */
    this.animClock = new THREE.Clock()
    this.animClock.start()
    /**
     * @type {import("three").Clock}
     */
    this.durationClock = new THREE.Clock()
    this.durationClock.start()
  }

  update() {
    const time = this.durationClock.getElapsedTime() * 1000
    if (time > this.duration) {
      this.parent.targetFalling = null
      return
    }

    const delta = this.animClock.getElapsedTime() * 1000
    if (delta > this.interval) {
      if (this.tween.isAlive()) {
        this.tween.update()
      }
      this.animClock.stop()
      this.animClock.start()
    }
  }
}

export class PlanterTargetEntity {
  /**
   *
   * @param {*} world
   * @param {*} colliderEntityId
   * @param {*} modelEntityId
   * @param {PlanterEntity} parent
   */
  constructor(world, colliderEntityId, modelEntityId, parent) {
    this.disposed = false
    this.world = world
    entities.set(colliderEntityId, this)

    /**
     * @type {PlanterEntity} parent
     */
    this.parent = parent

    /**
     * @type {BigInteger} entityId
     */
    this.colliderEntityId = colliderEntityId

    const parentObject = world.three.entityToObject.get(modelEntityId)

    const properties = JSON.parse(
      JSON.stringify(ecs.Collider.get(world, colliderEntityId))
    )
    ecs.Collider.remove(world, colliderEntityId)
    ecs.Collider.set(world, colliderEntityId, {
      ...properties,
      eventOnly: false,
    })

    /**
     * @type {import("three").Object3D} parentObject
     */
    this.parentObject = parentObject
    this.parentObject.visible = true

    ecs.Position.reset(world, modelEntityId)

    /**
     * @type {AcornFallingIntoVase|null}
     */
    this.acornFalling = null

    /**
     * @type {TargetFalling|null}
     */
    this.targetFalling = null

    this.hit = false
    const collisionListener = (event) => {
      if (this.acornFalling || this.hit) return

      const colliderData = ColliderData.get(world, event.data.other)
      if (!colliderData) return
      const {name, type} = colliderData

      if (name == 'Acorn') {
        this.hit = true
        this.clear()
        const collidingObject = world.three.entityToObject.get(event.data.other)
        const worldPosition = new THREE.Vector3()
        collidingObject.getWorldPosition(worldPosition)

        const parentObject = world.three.entityToObject.get(this.parent.entityId)
        const targetPosition = new THREE.Vector3()
        parentObject.getWorldPosition(targetPosition)

        this.acornFalling = new AcornFallingIntoVase(
          world,
          event.data.other,
          [worldPosition.x, worldPosition.y, worldPosition.z],
          [targetPosition.x, targetPosition.y, targetPosition.z],
          this.parent
        )
        this.targetFalling = new TargetFalling(world, modelEntityId, this)

        AudioBankManager.getAudioBank('main')
          .getClip('acornHit')
          .play(this.colliderEntityId)

        setTimeout(() => {
          this.dispose()
        }, 2000)
      }
    }

    this.clear = () => {
      world.events.removeListener(
        colliderEntityId,
        ecs.physics.COLLISION_START_EVENT,
        collisionListener
      )
    }
    world.events.addListener(
      colliderEntityId,
      ecs.physics.COLLISION_START_EVENT,
      collisionListener
    )
  }

  update() {
    if (this.acornFalling) this.acornFalling.update()
    if (this.targetFalling) this.targetFalling.update()
  }

  dispose() {
    if (this.disposed) return
    this.clear()
    entities.delete(this.colliderEntityId)
    this.disposed = true
    this.parentObject.visible = false
    const {world, colliderEntityId} = this
    const properties = JSON.parse(
      JSON.stringify(ecs.Collider.get(world, colliderEntityId))
    )
    ecs.Collider.remove(world, colliderEntityId)
    ecs.Collider.set(world, colliderEntityId, {
      ...properties,
      eventOnly: true,
    })
  }
}

const PlanterTarget = ecs.registerComponent({
  name: 'PlanterTarget',
  schema: {},
  schemaDefaults: {},
  add: (world, component) => {},
  remove: (world, component) => {
    entities.delete(component.eid)
  },
  tick: (world, component) => {
    const entity = entities.get(component.eid)
    if (!entity) return
    entity.update()
  },
})

export {PlanterTarget}
