import * as ecs from '@8thwall/ecs'
import {SceneIds} from '../Scenes'
import {SceneManager} from '../../../components/scene/scene-manager'
import {CropEntity, CropEntityComponent} from './crop-entity'
import {WateringPlantsScreen} from './WateringPlantsScreen'
import {SkeletonUtils} from '../../../helpers/SkeletonUtils'

/**
 * @type {CropEntity[]} entities
 */
let entities = []
let cleanUp = () => {}

const setShadowProperties = (object) => {
  object.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true
      node.receiveShadow = true
    }
  })
}
const CropEntities = ecs.registerComponent({
  name: 'CropEntities',
  schema: {
    // @asset
    plant: ecs.string,
    // @asset
    plantDried: ecs.string,
  },
  schemaDefaults: {},
  add: (world, component) => {
    const {plant, plantDried} = component.schema
    const {eid} = component;

    (async () => {
      // @ts-ignore
      const loader = new THREE.GLTFLoader()

      try {
        const models = await Promise.all([
          loader.loadAsync(plant),
          loader.loadAsync(plantDried),
        ])

        models.forEach(_ => setShadowProperties(_.scene))

        const generate = () => {
          console.log('GENEREATE CORP ENTITES')
          console.log(models)

          /**
           * @param {BigInteger} eid
           */
          const traverse = (eid) => {
            if (CropEntityComponent.has(world, eid)) {
              ecs.BoxGeometry.remove(world, eid)
              ecs.Material.remove(world, eid)
              entities.push(
                new CropEntity(
                  eid,
                  world,
                  SkeletonUtils.clone(models[0].scene),
                  models[0].animations[0],
                  SkeletonUtils.clone(models[1].scene),
                  models[1].animations[0]
                )
              )
              return
            }
            for (const child of world.getChildren(eid)) {
              traverse(child)
            }
          }

          traverse(eid)

          console.log(entities)
          WateringPlantsScreen.update({
            plantsWatered: 0,
            maxPlants: entities.length,
          })
        }

        const dispose = () => {
          if (!entities.length) return
          for (const entity of entities) {
            entity.dispose()
          }
          entities = []
        }

        SceneManager.addEventListener(
          SceneManager.events.EnterScene,
          /**
           * @param {CustomEvent} param
           */
          ({detail}) => {
            const {id} = detail
            if (id == SceneIds.WateringPlants) {
              dispose()
              generate()
            }
          }
        )
        SceneManager.addEventListener(
          SceneManager.events.ResetScene,
          /**
           * @param {CustomEvent} param
           */
          ({detail}) => {
            const {id} = detail
            if (id == SceneIds.WateringPlants) {
              dispose()
              generate()
            }
          }
        )
        SceneManager.addEventListener(
          SceneManager.events.ExitScene,
          /**
           * @param {CustomEvent} param
           */
          ({detail}) => {
            const {id} = detail
            if (id == SceneIds.WateringPlants) {
              dispose()
            }
          }
        )

        cleanUp = () => {
          dispose()
        }
      } catch (error) {
        console.error('Error loading models', error)
      }
    })()
  },
  remove: (world, component) => {
    cleanUp()
  },
})

export {CropEntities}
