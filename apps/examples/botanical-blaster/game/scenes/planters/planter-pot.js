import {AudioBankManager} from '../../../components/audio/audio-bank'
import {ValueEaseAndTween} from '../../../helpers/EaseAndTween'
import * as ecs from '@8thwall/ecs'
import {PlantersScreenState} from './PlantersScreen'
import {PlanterTargetEntity} from './planter-target'

/**
 * @type {Map<BigInteger,PlanterEntity>}
 */
const entities = new Map()

export class PlanterEntity {
  /**
   *
   * @param {*} world
   * @param {BigInteger} entityId
   * @param {BigInteger} targetColliderEntityId
   * @param {BigInteger} targetModelEntityId
   * @param {*} plantModel
   */
  constructor(
    world,
    entityId,
    targetColliderEntityId,
    targetModelEntityId,
    plantModel
  ) {
    this.world = world

    entities.set(entityId, this)
    /**
     * @type {import("three").Object3D} planterParent
     */
    const planterParent = world.three.entityToObject.get(entityId)

    const worldPosition = new THREE.Vector3()
    planterParent.getWorldPosition(worldPosition)

    /**
     * @type {BigInteger} entityId
     */
    this.entityId = entityId
    /**
     * @type {boolean} sprouted
     */
    this.sprouted = false

    /**
     * @type {PlanterTargetEntity}
     */
    this.target = new PlanterTargetEntity(
      world,
      targetColliderEntityId,
      targetModelEntityId,
      this
    )
    /**
     * @type {import("three").Object3D} planterParent
     */
    this.plantModel = plantModel

    /**
     * @type {PlantGrowing|null}
     */
    this.plantGrowing = null

    world.events.addListener(entityId, PlanterEntity.Events.Sprout, () => {
      if (this.sprouted) return
      planterParent.add(plantModel)
      this.sprouted = true
      plantModel.scale.set(0, 0, 0)

      this.plantGrowing = new PlantGrowing(plantModel, this)
      PlantersScreenState.update({
        ...PlantersScreenState.state,
        plantersHit: PlantersScreenState.state.plantersHit + 1,
      })

      AudioBankManager.getAudioBank('main')
        .getClip('acornPlantGrow')
        .play(this.entityId)
    })
  }

  update() {
    if (this.plantGrowing) {
      this.plantGrowing.update()
    }
  }

  dispose() {
    entities.delete(this.entityId)
    this.plantModel.removeFromParent()
    this.target.dispose()
  }
}

class PlantGrowing {
  /**
   * @param {import("three").Object3D} object
   * @param {PlanterEntity} parent
   */
  constructor(object, parent) {
    /**
     * @type {PlanterEntity}
     */
    this.parent = parent
    /**
     * @type {import("three").Object3D}
     */
    this.object = object

    this.duration = 1000  // duration in milliseconds
    const fps = 60  // frames per second
    this.interval = 1000 / fps  // interval in milliseconds

    /**
     * @type {ValueEaseAndTween}
     */
    this.tween = new ValueEaseAndTween({
      max: this.duration / this.interval,
      function: ValueEaseAndTween.EaseOutElastic,
      start: 0,
      end: 3,
      onUpdate: (scale) => {
        object.scale.set(scale, scale, scale)
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
      this.parent.plantGrowing = null
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

PlanterEntity.Events = Object.freeze({
  Sprout: 'planter-entity-sprout',
})

const PlanterPot = ecs.registerComponent({
  name: 'PlanterPot',
  schema: {},
  schemaDefaults: {},
  add: () => {},
  remove: (world, component) => {
    entities.delete(component.eid)
  },
  tick: (world, component) => {
    try {
      const entity = entities.get(component.eid)
      if (!entity) return
      entity.update()
    } catch (error) {
      console.warn('error in planter pot')
      console.error(error)
    }
  },
})

export {PlanterPot}
