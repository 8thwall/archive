import * as ecs from '@8thwall/ecs'
import {
  ProjectileSpawner,
  ProjectileSpawnerEvents,
  SpawnProjectileEvent,
} from '../../components/projectile/projectile-spawner'
import {ProjectileDirectionPoint} from '../../components/projectile/projectile-direction-point'
import {FireGunEvent, GunControllerEvents} from './gun-base-controller'
import {AudioBankManager} from '../../components/audio/audio-bank'

const cleanUp = new Map()
const WaterGunController = ecs.registerComponent({
  name: 'WaterGunController',
  schema: {
    bulletAsset: ecs.string,
    bulletAmount: ecs.f32,
    force: ecs.f32,
    mass: ecs.f32,
    colliderDataType: ecs.string,
    colliderDataName: ecs.string,
  },
  schemaDefaults: {
    force: 5,
    mass: 0.025,
    bulletAmount: 6,
  },
  add: (world, component) => {
    const {
      bulletAsset,
      colliderDataType,
      colliderDataName,
      bulletAmount,
      force,
      mass,
    } = component.schema

    let projectileSpawnerEID = null
    for (const child of world.getChildren(component.eid)) {
      if (ProjectileSpawner.has(world, child)) {
        projectileSpawnerEID = child
      }
    }
    let projectileDirectionEID = null
    for (const child of world.getChildren(component.eid)) {
      if (ProjectileDirectionPoint.has(world, child)) {
        projectileDirectionEID = child
      }
    }
    const {eid} = component;

    (async () => {
      // @ts-ignore
      const loader = new THREE.GLTFLoader()
      const projectilGLB = (await loader.loadAsync(bulletAsset)).scene

      /**
       * @type {[number,number,number][]} scales
       */
      const scales = [
        [1.25, 1.25, 1.25],
        [1, 1, 1],
        [0.75, 0.75, 0.75],
        [0.5, 0.5, 0.5],
        [0.25, 0.25, 0.25],
      ]
      /**
       * @type {Map<string, import("three").Mesh>} scales
       */
      const clones = new Map()
      /**
       * @type {Map<string, [number, number, number]>} scales
       */
      const sizes = new Map()
      /**
       *
       * @param {[number,number,number]} scale
       */
      const getScaleKey = scale => `${scale[0]}-${scale[1]}-${scale[2]}`

      for (const scale of scales) {
        const scaleKey = getScaleKey(scale)
        /**
         * @type {import("three").Mesh} newClone
         */
        const newClone = projectilGLB.clone(true)
        newClone.scale.set(...scale)
        clones.set(scaleKey, newClone)
        /**
         * @type {[number, number, number]} size
         */
        let size = null
        newClone.traverse((object) => {
          if (size) return
          if (!(object instanceof THREE.Mesh)) return
          if (object.geometry) {
            object.geometry.computeBoundingBox()
            const {boundingBox} = object.geometry
            size = boundingBox.getSize(new THREE.Vector3()).toArray()
          }
        })
        sizes.set(scaleKey, size)
      }

      /**
       *
       * @param {MessageEvent<FireGunEvent>} param
       */
      const fireListener = ({data}) => {
        if (!projectileSpawnerEID) {
          console.warn('Tried firing gun without a projectile spawner set')
          return
        }
        const spawnerObject = world.three.entityToObject.get(projectileSpawnerEID)
        const spawnerObjectPosition = new THREE.Vector3()
        // Get the world position of the object
        spawnerObject.getWorldPosition(spawnerObjectPosition)

        const directionObject = world.three.entityToObject.get(
          projectileDirectionEID
        )

        const directionObjectPosition = new THREE.Vector3()
        // Get the world position of the object
        directionObject.getWorldPosition(directionObjectPosition)

        const originalDirection = new THREE.Vector3()
          .subVectors(spawnerObjectPosition, directionObjectPosition)
          .normalize()

        const spreadAngle = 5 * (Math.PI / 180)  // Adjust spread angle as needed

        const createDirectionVector = (index, total) => {
          const angle = (index / total) * 2 * Math.PI
          const x = Math.cos(angle) * spreadAngle
          const y = Math.sin(angle) * spreadAngle
          const quaternion = new THREE.Quaternion()
          quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 0, -1),  // original forward vector
            originalDirection.clone().normalize()
          )

          const spreadQuaternion = new THREE.Quaternion()
          spreadQuaternion.setFromEuler(new THREE.Euler(x, y, 0, 'XYZ'))

          const finalQuaternion = quaternion.multiply(spreadQuaternion)
          const direction = new THREE.Vector3(0, 0, -1)
            .applyQuaternion(finalQuaternion)
            .toArray()
          return direction
        }

        const createEvent = (direction, scale) => new SpawnProjectileEvent(
          direction,
          colliderDataType,
          colliderDataName,
          force,
          mass,
          sizes.get(getScaleKey(scale)),
          clones.get(getScaleKey(scale)).clone(true),
          true,
          false
        )

        const orderedScales = [scales[0], ...scales.slice(1).reverse()]  // Place larger bullet in the center
        const halfBulletAmount = Math.floor(bulletAmount / 2)

        for (let i = 0; i < bulletAmount; i++) {
          const scaleIndex = i < halfBulletAmount ? i : bulletAmount - 1 - i
          world.events.dispatch(
            projectileSpawnerEID,
            ProjectileSpawnerEvents.Spawn,
            createEvent(
              createDirectionVector(i, bulletAmount),
              orderedScales[scaleIndex]
            )
          )
        }

        AudioBankManager.getAudioBank('main')
          .getClip('waterGunShoot')
          .play(eid)
      }

      world.events.addListener(eid, GunControllerEvents.Fire, fireListener)
      cleanUp.set(component.eid, () => {
        world.events.removeListener(
          eid,
          GunControllerEvents.Fire,
          fireListener
        )
      })
    })()
  },
  remove: (world, component) => {
    const run = cleanUp.get(component.eid)
    run()
    cleanUp.delete(component.eid)
  },
})

export {WaterGunController}
