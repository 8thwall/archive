import * as ecs from '@8thwall/ecs'
import {FireGunEvent, GunControllerEvents} from './gun-base-controller'
import {GunModel} from './gun-model'
const cleanUp = new Map()
/**
 * @type {Map<BigInteger,AnimatingGun>} animating
 */
const animating = new Map()

class AnimatingGun {
  /**
   * @param {*} world
   * @param {BigInteger} entityId
   * @param {BigInteger} gunModelEntityId
   * @param {number} recoilDuration
   * @param {number} recoilDistance
   * @param {number} recoilAngle
   * @param {number} bounceDuration
   * @param {number} bounceAngle
   */
  constructor(
    world,
    entityId,
    gunModelEntityId,

    recoilDuration,
    recoilDistance,
    recoilAngle,
    bounceDuration,
    bounceAngle
  ) {
    this.world = world
    /**
     * @param {BigInteger} entityId
     */
    this.entityId = entityId
    /**
     * @param {BigInteger} entityId
     */
    this.gunModelEntityId = gunModelEntityId

    this.recoilDuration = recoilDuration  // Duration of the recoil animation in seconds
    this.recoilDistance = recoilDistance  // Distance of the recoil movement
    this.recoilAngle = recoilAngle * (Math.PI / 180)  // Angle of the recoil movement

    this.bounceDuration = bounceDuration  // Duration of the bounce animation in seconds
    this.bounceAngle = -bounceAngle * (Math.PI / 180)  // Angle of the bounce movement

    this.recoiling = false
    this.bouncing = false

    /**
     * @type {import("three").Quaternion} quat
     */
    this.quat = new THREE.Quaternion()
    /**
     * @type {import("three").Euler} quat
     */
    this.euler = new THREE.Euler()

    this.clock = new THREE.Clock()
  }

  update() {
    if (!this.recoiling && !this.bouncing) return

    if (this.recoiling) {
      const elapsedTime = this.clock.getElapsedTime()
      if (elapsedTime < this.recoilDuration) {
        // Calculate recoil position
        const factor = Math.sin((elapsedTime / this.recoilDuration) * Math.PI)

        this.world.setPosition(
          this.gunModelEntityId,
          0,
          0,
          factor * this.recoilDistance
        )

        this.quat.setFromEuler(this.euler.set(0, 0, factor * this.recoilAngle))

        this.world.setQuaternion(this.gunModelEntityId, ...this.quat.toArray())
      } else {
        this.recoiling = false
        this.bouncing = true
        this.clock.stop()
        this.clock.start()
        return
      }
    }

    if (this.bouncing) {
      const elapsedTime = this.clock.getElapsedTime()
      if (elapsedTime < this.bounceDuration) {
        // Calculate recoil position
        const factor = Math.sin((elapsedTime / this.bounceDuration) * Math.PI)

        this.quat.setFromEuler(this.euler.set(0, 0, factor * this.bounceAngle))
        this.world.setQuaternion(this.gunModelEntityId, ...this.quat.toArray())
      } else {
        this.bouncing = false
        // Reset to original position

        this.world.setPosition(this.gunModelEntityId, 0, 0, 0)
        this.world.setQuaternion(this.gunModelEntityId, 0, 0, 0, 1)
        this.doneAnimating()
      }
    }
  }

  doneAnimating() {
    animating.delete(this.entityId)
  }

  fire() {
    this.clock.start()
    this.recoiling = true
    this.bouncing = false
    animating.set(this.entityId, this)
  }
}

const GunRecoilAnimation = ecs.registerComponent({
  name: 'GunRecoilAnimation',
  schema: {
    recoilDuration: ecs.f32,
    recoilDistance: ecs.f32,
    recoilAngle: ecs.f32,
    bounceDuration: ecs.f32,
    bounceAngle: ecs.f32,
  },
  schemaDefaults: {
    recoilDuration: 0.2,
    recoilDistance: 0.1,
    recoilAngle: 45,
    bounceDuration: 0.125,
    bounceAngle: 22.5,
  },
  add: (world, component) => {
    const {eid} = component
    const {
      recoilDuration,
      recoilDistance,
      recoilAngle,
      bounceDuration,
      bounceAngle,
    } = component.schema

    let gunEntityId = null
    /**
     * @param {BigInteger} eid
     */
    const traverse = (eid) => {
      if (gunEntityId) return
      if (GunModel.has(world, eid)) {
        gunEntityId = eid
        return
      }
      for (const child of world.getChildren(eid)) {
        traverse(child)
      }
    }

    traverse(eid)

    const animatedGun = new AnimatingGun(
      world,
      eid,
      gunEntityId,
      recoilDuration,
      recoilDistance,
      recoilAngle,
      bounceDuration,
      bounceAngle
    )

    const fireListener = () => {
      animatedGun.fire()
    }

    world.events.addListener(eid, GunControllerEvents.Fire, fireListener)

    cleanUp.set(component.eid, () => {
      world.events.removeListener(eid, GunControllerEvents.Fire, fireListener)
    })
  },
  remove: (world, component) => {
    const run = cleanUp.get(component.eid)
    if (!run) return
    run()
    cleanUp.delete(component.eid)
  },
  tick: (world, component) => {
    const entity = animating.get(component.eid)
    if (!entity) return
    entity.update()
  },
})

export {GunRecoilAnimation}
