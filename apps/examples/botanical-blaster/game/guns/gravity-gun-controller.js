import * as ecs from '@8thwall/ecs'
import {CameraManager} from '../../components/controls/camera-controls'
import {GravityGunAffected} from './gravity-gun-affected'
import {GravityGunAttractor} from './gravity-gun-attractor'
import {FireGunEvent, GunControllerEvents} from './gun-base-controller'
import {GameState} from '../GameState'
import {AudioBankManager} from '../../components/audio/audio-bank'
import {GravityGunExit} from '../../game/scenes/gravityGun/gravity-gun-exit'
import {ViritualGamepadManager} from '../../components/controls/virtual-gamepad-controls'

const cleanUp = new Map()

let hasObject = false

let playShoot = () => {}

/**
 * @type {Set<GrappleAffectedEntity>} affected
 */
const grappleEntites = new Set()

class GravityGunRay {
  /**
   * @param {import("three").Scene} scene
   */
  constructor(scene) {
    this.scene = scene

    // Initial points
    this.start = new THREE.Vector3(0, 0, 0)
    this.end = new THREE.Vector3(1, 1, 1)

    // Create initial curve and tube geometry
    this.curve = new THREE.CatmullRomCurve3([this.start, this.end])
    this.tubeGeometry = new THREE.TubeGeometry(this.curve, 20, 0.1, 8, false)
    this.material = new THREE.MeshBasicMaterial({
      color: 0x4fdee8,
      opacity: 0.5,
      transparent: true,
    })

    // Create tube mesh and add to scene
    this.tube = new THREE.Mesh(this.tubeGeometry, this.material)
    this.scene.add(this.tube)
  }

  /**
   * @param {import("three").Vector3} start
   * @param {import("three").Vector3} end
   */
  update(start, end) {
    // Update points
    this.start.copy(start)
    this.end.copy(end)

    // Update curve
    this.curve.points[0] = this.start
    this.curve.points[1] = this.end

    // Update tube geometry
    this.tube.geometry.dispose()
    this.tube.geometry = new THREE.TubeGeometry(this.curve, 20, 0.1, 8, false)
  }

  dispose() {
    this.scene.remove(this.tube)
  }
}

class GrappleAffectedEntity {
  /**
   * @param {*} entityId
   * @param {*} world
   * @param {number} throwForce
   * @param {number} torqueForce
   * @param {number} forceTime
   * @param {import("three").Object3D} attractorObject
   * @param {HTMLCanvasElement} canvas
   */
  constructor(
    entityId,
    world,
    throwForce,
    torqueForce,
    forceTime,
    attractorObject,
    canvas
  ) {
    this.ray = new GravityGunRay(world.scene)
    /**
     * @type {*} entityId
     */
    this.entityId = entityId
    /**
     * @type {boolean} thrown
     */
    this.thrown = false
    /**
     * @type {number}
     */
    this.throwForce = throwForce
    /**
     * @type {number}
     */
    this.torqueForce = torqueForce
    /**
     * @type {number}
     */
    this.forceTime = forceTime
    /**
     * @type {HTMLCanvasElement} canvas
     */
    this.canvas = canvas
    this.world = world
    /**
     * @type {[number, number, number]} force
     */
    this.force = [0, 0, 0]
    /**
     * @type {[number, number, number]} force
     */
    this.torque = [0, 0, 0]
    /**
     * @type {import("three").Object3D} attractorObject
     */
    this.attractorObject = attractorObject

    /**
     * @type {import("three").Vector3} worldPosition
     */
    this.attractorWorldPosition = new THREE.Vector3()

    /**
     * @type {import("three").Vector3} worldPosition
     */
    this.attractorWorldObjectPosition = new THREE.Vector3()
    /**
     * @type {import("three").Vector3} worldPosition
     */
    this.worldPosition = new THREE.Vector3()
    /**
     * @type {import("three").Quaternion} worldPosition
     */
    this.worldRotation = new THREE.Quaternion()
    /**
     * @type {import("three").Euler} worldPosition
     */
    this.worldRotationEuler = new THREE.Euler()

    /**
     * @type {import("three").Object3D} attractorObject
     */
    this.entityObject = world.three.entityToObject.get(entityId)

    this.comingTowardsAttractor = true
    this.readyToFire = true

    const properties = JSON.parse(
      JSON.stringify(ecs.Collider.get(world, entityId))
    )
    this.colliderProperties = properties
    ecs.Collider.remove(world, entityId)

    /**
     * @param {KeyboardEvent} event
     */
    const keyUpListener = (event) => {
      if (event.code === 'Space') {
        this.throw()
      }
    }
    window.addEventListener('keyup', keyUpListener)
    ViritualGamepadManager.addEventListener(
      ViritualGamepadManager.events.ButtonDown,
      keyUpListener
    )
    this.dispose = () => {
      window.removeEventListener('keyup', keyUpListener)
      ViritualGamepadManager.removeEventListener(
        ViritualGamepadManager.events.ButtonDown,
        keyUpListener
      )
      grappleEntites.delete(this)
    }
  }

  move(speed) {
    const direction = new THREE.Vector3()
      .subVectors(this.attractorWorldObjectPosition, this.worldPosition)
      .normalize()

    const point = this.worldPosition
      .clone()
      .add(direction.multiplyScalar(speed))
    this.world.setPosition(this.entityId, point.x, point.y, point.z)
  }

  update() {
    const forward = CameraManager.getForwardDirection()
    const length = 2
    this.attractorObject.getWorldPosition(this.attractorWorldPosition)
    this.attractorWorldObjectPosition.set(
      this.attractorWorldPosition.x + forward.x * length,
      this.attractorWorldPosition.y + forward.y * length,
      this.attractorWorldPosition.z + forward.z * length
    )
    this.entityObject.getWorldPosition(this.worldPosition)

    if (this.thrown) {
      ecs.physics.applyForce(this.world, this.entityId, ...this.force)
      ecs.physics.applyTorque(this.world, this.entityId, ...this.torque)
      return
    }

    this.worldRotationEuler.y += 0.05

    this.worldRotation.setFromEuler(this.worldRotationEuler)
    this.world.setQuaternion(
      this.entityId,
      this.worldRotation.x,
      this.worldRotation.y,
      this.worldRotation.z,
      this.worldRotation.w
    )

    this.ray.update(
      this.attractorWorldPosition,
      this.worldPosition.clone().add({x: 0, y: 0.2, z: 0})
    )
    if (this.readyToFire) {
      const distance = this.attractorWorldObjectPosition.distanceTo(
        this.worldPosition
      )
      if (distance > 0.1) {
        this.move(0.05)
      }
    }

    if (this.comingTowardsAttractor) {
      const distance = this.attractorWorldObjectPosition.distanceTo(
        this.worldPosition
      )
      if (distance < 0.1) {
        this.readyToFire = true
        this.comingTowardsAttractor = false
      } else [this.move(0.25)]
    }
  }

  throw() {
    playShoot()
    hasObject = false
    this.ray.dispose()
    this.thrown = true
    const forward = CameraManager.getForwardDirection()
    const speed = this.throwForce
    forward.multiplyScalar(speed)
    ecs.Collider.set(this.world, this.entityId, this.colliderProperties)
    this.force = forward.toArray()

    const {torqueForce} = this

    const collisionListener = (event) => {
      AudioBankManager.getAudioBank('main').getClip('rockHit').play()
      this.world.events.removeListener(
        this.entityId,
        ecs.physics.COLLISION_START_EVENT,
        collisionListener
      )
    }

    this.world.events.addListener(
      this.entityId,
      ecs.physics.COLLISION_START_EVENT,
      collisionListener
    )

    // Calculate torque vector perpendicular to the forward vector
    const torqueVector = new THREE.Vector3()
    torqueVector
      .crossVectors(forward.multiplyScalar(-1), new THREE.Vector3(0, 1, 0))
      .normalize()
      .multiplyScalar(torqueForce)

    this.torque = torqueVector.toArray()
    this.force[1] += 9.81 * 20
    setTimeout(() => {
      this.dispose()
      if (!GameState.gravityGunScreen.state.itemHit) {
        GameState.gravityGunScreen.update({
          itemHit: true,
        })
      }
    }, this.forceTime)
  }
}

const GravityGunController = ecs.registerComponent({
  name: 'GravityGunController',
  schema: {
    // freeFloating: ecs.boolean,
    throwForce: ecs.f32,
    torqueForce: ecs.f32,
    forceTime: ecs.f32,
    showRayIntersectSphere: ecs.boolean,
    rayIntersectSphereLifeTime: ecs.f32,
  },
  schemaDefaults: {
    throwForce: 250,
    torqueForce: 240,
    showRayIntersectSphere: true,
    rayIntersectSphereLifeTime: 3000,
    forceTime: 5000,
  },
  add: (world, component) => {
    playShoot = () => {
      AudioBankManager.getAudioBank('main')
        .getClip('gravityGunShoot')
        .play(eid)
    }
    const {
      throwForce,
      torqueForce,
      showRayIntersectSphere,
      rayIntersectSphereLifeTime,
      forceTime,
    } = component.schema

    const {eid} = component

    const canvas = world.three.renderer.domElement
    const {scene} = world

    let attractorEID = null
    for (const child of world.getChildren(eid)) {
      if (GravityGunAttractor.has(world, child)) {
        attractorEID = child
      }
    }
    /**
 * @type {import("three").Object3D} attractorObject
 */
    const attractorObject = world.three.entityToObject.get(attractorEID);

    (async () => {
      try {
        /**
     *
     * @param {MessageEvent<FireGunEvent>} param
     */
        const fireListener = ({data}) => {
          if (hasObject) return
          const pickedObjects = CameraManager.pickFromCenter(scene)

          if (showRayIntersectSphere) {
            // debuging
            {
              for (const picked of pickedObjects) {
                const {object} = picked
                if (object.userData.isReticle) continue

                const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32)
                const sphereMaterial = new THREE.MeshBasicMaterial({
                  color: 0x73c6d1,
                  opacity: 0.5,
                  transparent: true,
                })
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
                sphere.position.copy(picked.point)
                scene.add(sphere)
                // Remove the sphere after 3 seconds
                setTimeout(() => {
                  scene.remove(sphere)
                }, rayIntersectSphereLifeTime)
              }
            }
          }

          findObject: for (const picked of pickedObjects) {
            const {object} = picked
            let parent = object

            while (parent) {
              if (
                parent.userData.entity === true &&
            parent.userData.eid !== undefined
              ) {
                const entityId = parent.userData.eid

                if (GravityGunExit.has(world, entityId)) {
                  window.dispatchEvent(new CustomEvent('exit-gravity-scene'))
                  break findObject
                }

                if (
                  GravityGunAffected.has(world, entityId) &&
              ecs.Collider.has(world, entityId)
                ) {
                  for (const grapple of grappleEntites) {
                    if (grapple.entityId == entityId) {
                      continue findObject
                    }
                  }
                  hasObject = true
                  grappleEntites.add(
                    new GrappleAffectedEntity(
                      entityId,
                      world,
                      throwForce,
                      torqueForce,
                      forceTime,
                      attractorObject,
                      canvas
                    )
                  )

                  break findObject
                }
              }
              parent = parent.parent
            }
          }
          playShoot()
        }

        world.events.addListener(eid, GunControllerEvents.Fire, fireListener)
        cleanUp.set(eid, () => {
          world.events.removeListener(
            eid,
            GunControllerEvents.Fire,
            fireListener
          )
        })
      } catch (error) {
        console.warn('error in gravity gun')
        console.error(error)
      }
    })()
  },
  tick: (world, component) => {
    for (const entity of grappleEntites) {
      entity.update()
    }
  },
  remove: (world, component) => {
    const run = cleanUp.get(component.eid)
    run()
    cleanUp.delete(component.eid)
  },
})

export {GravityGunController}
