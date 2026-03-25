import * as ecs from '@8thwall/ecs'
import {WateringPlantsScreen} from './WateringPlantsScreen'
import {ColliderData} from '../../../components/collider-data'
import {AudioBankManager} from '../../../components/audio/audio-bank'

/**
 * @type {Map<BigInteger,CropEntity>}
 */
const entities = new Map()

export class CropEntity {
  /**
   * @param {*} entityId
   * @param {*} world
   * @param {*} alivePlant
   * @param {*} alivePlantAnimation
   * @param {*} deadPlant
   * @param {*} deadPlantAnimation
   *
   */
  constructor(
    entityId,
    world,
    alivePlant,
    alivePlantAnimation,
    deadPlant,
    deadPlantAnimation
  ) {
    this.world = world
    this.entityId = entityId

    const entityParent = world.three.entityToObject.get(entityId)

    /**
     * @type {import("three").Object3D} plant
     */
    this.alivePlant = alivePlant
    /**
     * @type {import("three").Object3D} plantDried
     */
    this.deadPlant = deadPlant
    /**
     * @type {BigInteger} entityId
     */
    this.entityId = entityId
    /**
     * @type {boolean} watered
     */
    this.watered = false
    /**
     * @type {number} wateredAmount
     */
    this.wateredAmount = 0

    /**
     * @type {import("three").Clock}
     */
    this.clock = new THREE.Clock()

    /**
     * @type {import("three").AnimationMixer}
     */
    this.deadPlantMixer = new THREE.AnimationMixer(deadPlant)
    /**
     * @type {import("three").AnimationMixer}
     */
    this.alivePlantMixer = new THREE.AnimationMixer(alivePlant)

    this.animationTime = 1

    this.aliveClip = null
    const properties = JSON.parse(
      JSON.stringify(ecs.Collider.get(world, entityId))
    )
    ecs.Collider.remove(world, entityId)
    ecs.Collider.set(world, entityId, {
      ...properties,
      eventOnly: false,
    })

    this.watered = false

    const collisionListener = (event) => {
      if (this.watered) return
      const colliderData = ColliderData.get(world, event.data.other)
      if (!colliderData) return
      const {name, type} = colliderData

      if (name == 'Water') {
        world.deleteEntity(event.data.other)
        this.wateredAmount++
        if (this.wateredAmount >= 4) {
          this.watered = true
          const properties = JSON.parse(
            JSON.stringify(ecs.Collider.get(world, entityId))
          )
          ecs.Collider.remove(world, entityId)
          ecs.Collider.set(world, entityId, {
            ...properties,
            eventOnly: true,
          })

          entityParent.add(alivePlant)

          const action = this.alivePlantMixer.clipAction(alivePlantAnimation)
          action.play()
          this.aliveClip = action

          this.clock.start()
          this.cloneMaterials()
          entities.set(this.entityId, this)

          world.events.removeListener(
            entityId,
            ecs.physics.COLLISION_START_EVENT,
            collisionListener
          )

          WateringPlantsScreen.update({
            ...WateringPlantsScreen.state,
            plantsWatered: WateringPlantsScreen.state.plantsWatered + 1,
          })

          AudioBankManager.getAudioBank('main').getClip('plantWatered').play()
        }
      }
    }

    world.events.addListener(
      entityId,
      ecs.physics.COLLISION_START_EVENT,
      collisionListener
    )

    entityParent.add(deadPlant)
    const action = this.deadPlantMixer.clipAction(deadPlantAnimation)
    action.play()
    this.deadPlantMixer.update(0)
  }

  cloneMaterials() {
    this.alivePlant.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.userData.originalMaterial = obj.material
        obj.material = obj.material.clone()
      }
    })

    this.deadPlant.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.userData.originalMaterial = obj.material
        obj.material = obj.material.clone()
      }
    })
  }

  resetMaterials() {
    this.alivePlant.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material.dispose()
        obj.material = obj.userData.originalMaterial
      }
    })

    this.deadPlant.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material.dispose()
        obj.material = obj.userData.originalMaterial
      }
    })
  }

  update() {
    const delta = this.clock.getDelta()
    if (delta == 0) return

    const elapsed = this.clock.getElapsedTime()
    if (elapsed > this.animationTime) {
      this.aliveClip.stop()  // Stop the animation mixer

      // Set the animation clip to the last frame
      this.aliveClip.time = this.aliveClip.getClip().duration
      this.aliveClip.setEffectiveTimeScale(0)  // Freeze the animation
      this.aliveClip.paused = true

      this.alivePlantMixer.update(0)  // Update the mixer to apply the final frame

      entities.delete(this.entityId)  // Remove the entity from the map
      this.deadPlant.removeFromParent()  // Remove the dead plant
    } else {
      const factor = elapsed / this.animationTime

      this.alivePlantMixer.update(delta)  // Update the alive plant mixer
      this.deadPlantMixer.update(delta)  // Update the dead plant mixer

      const aliveOpacity = factor
      const deadOpacity = 1 - factor

      this.alivePlant.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.material.transparent = true
          obj.material.opacity = aliveOpacity
          obj.material.needsUpdate = true
        }
      })

      this.deadPlant.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.material.transparent = true
          obj.material.opacity = deadOpacity
          obj.material.needsUpdate = true
        }
      })
    }
  }

  dispose() {
    this.alivePlant.removeFromParent()
    this.deadPlant.removeFromParent()
  }
}

const CropEntityComponent = ecs.registerComponent({
  name: 'CropEntity',
  schema: {},
  schemaDefaults: {},
  add: (world, component) => {},
  remove: (world, component) => {
    entities.delete(component.eid)
  },
  tick: (world, component) => {
    const crop = entities.get(component.eid)
    if (!crop) return
    crop.update()
  },
})

export {CropEntityComponent}
