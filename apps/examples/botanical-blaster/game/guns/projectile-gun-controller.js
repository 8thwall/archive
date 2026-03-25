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
const ProjectileGunController = ecs.registerComponent({
  name: 'ProjectileGunController',
  schema: {
    // @asset
    bulletAsset: ecs.string,
    colliderDataType: ecs.string,
    colliderDataName: ecs.string,
    force: ecs.f32,
    mass: ecs.f32,
    singleShot: ecs.boolean,
    spreadShot: ecs.boolean,
    // @group start projectileScale:vector3
    projectileScaleX: ecs.f32,
    projectileScaleY: ecs.f32,
    projectileScaleZ: ecs.f32,
    // @group end
  },
  schemaDefaults: {
    force: 5,
    mass: 0.025,
    projectileScaleX: 1,
    projectileScaleY: 1,
    projectileScaleZ: 1,
  },
  add: (world, component) => {
    const {
      // gunAsset,
      bulletAsset,
      colliderDataType,
      colliderDataName,
      singleShot,
      spreadShot,
      force,
      mass,
      projectileScaleX,
      projectileScaleY,
      projectileScaleZ,
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
      try {
        // @ts-ignore
        const loader = new THREE.GLTFLoader()

        /**
         * @type {import("three").Mesh} projectile
         */
        const projectile = (await loader.loadAsync(bulletAsset)).scene
        projectile.scale.set(
          projectileScaleX,
          projectileScaleY,
          projectileScaleZ
        )

        /**
         * @type {import("three").Vector3Tuple} size
         */
        let size = null
        projectile.traverse((object) => {
          if (size) return
          if (!(object instanceof THREE.Mesh)) return
          if (object.geometry) {
            object.geometry
            object.geometry.computeBoundingBox()
            /**
             * @type {import("three").Box3}  boundingBox
             */
            const {boundingBox} = object.geometry
            size = boundingBox
              .getSize(new THREE.Vector3())
              .multiply(projectile.scale)
              .toArray()
          }
        })

        /**
         *
         * @param {MessageEvent<FireGunEvent>} param
         */
        const fireListener = ({data}) => {
          if (!projectileSpawnerEID) {
            console.warn('Tried fireing gun without a projectile spawner set')
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

          const direction = new THREE.Vector3()
            .subVectors(spawnerObjectPosition, directionObjectPosition)
            .normalize()

          const spreadAngle = 30 * (Math.PI / 180)
          const createDirectionVector = (angle) => {
            const quaternion = new THREE.Quaternion()
            quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle)
            return direction.clone().applyQuaternion(quaternion).toArray()
          }
          const createEvent = (direction) => {
            const projectileClone = projectile.clone(true)
            const lookAtMatrix = new THREE.Matrix4()
            lookAtMatrix.lookAt(
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3().fromArray(direction),
              new THREE.Vector3(0, 1, 0)
            )
            projectileClone.quaternion.setFromRotationMatrix(lookAtMatrix)

            return new SpawnProjectileEvent(
              direction,
              colliderDataType,
              colliderDataName,
              force,
              mass,
              size,
              projectileClone,
              false,
              true
            )
          }

          if (singleShot) {
            world.events.dispatch(
              projectileSpawnerEID,
              ProjectileSpawnerEvents.Spawn,
              createEvent(direction.toArray())
            )
          }
          if (spreadShot) {
            world.events.dispatch(
              projectileSpawnerEID,
              ProjectileSpawnerEvents.Spawn,
              createEvent(createDirectionVector(-spreadAngle))
            )

            world.events.dispatch(
              projectileSpawnerEID,
              ProjectileSpawnerEvents.Spawn,
              createEvent(direction.toArray())
            )

            world.events.dispatch(
              projectileSpawnerEID,
              ProjectileSpawnerEvents.Spawn,
              createEvent(createDirectionVector(spreadAngle))
            )
          }

          AudioBankManager.getAudioBank('main')
            .getClip('acornGunSoot')
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
      } catch (error) {
        console.warn('error in projectile gun controller')
        console.error(error)
      }
    })()
  },
  remove: (world, component) => {
    const run = cleanUp.get(component.eid)
    run()
    cleanUp.delete(component.eid)
  },
})

export {ProjectileGunController}
