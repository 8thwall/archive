import * as ecs from '@8thwall/ecs'
import {SceneManager} from '../../../components/scene/scene-manager'
import {SceneIds} from '../Scenes'
import {PlanterEntity, PlanterPot} from './planter-pot'
import {PlanterTarget} from './planter-target'
import {PlantersScreenState} from './PlantersScreen'
import {SkeletonUtils} from '../../../helpers/SkeletonUtils'
import {PlanterTargetModel} from './planter-target-model'
/**
 * @type {PlanterEntity[]} entities
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

const PlanterEntities = ecs.registerComponent({
  name: 'PlanterEntities',
  schema: {
    // @asset
    plant: ecs.string,
  },
  schemaDefaults: {},
  add: (world, component) => {
    (async () => {
      const {target, plant} = component.schema
      // @ts-ignore
      const loader = new THREE.GLTFLoader()

      const {eid} = component

      try {
        const plantModel = (await loader.loadAsync(plant)).scene

        setShadowProperties(plantModel)

        const generate = () => {
          for (const potTarget of world.getChildren(eid)) {
            let pot = null
            let targetCollider = null
            let targetModel = null
            for (const child of world.getChildren(potTarget)) {
              if (PlanterPot.has(world, child)) {
                pot = child
                continue
              }
              if (PlanterTarget.has(world, child)) {
                targetCollider = child
                continue
              }
              if (PlanterTargetModel.has(world, child)) {
                targetModel = child
                continue
              }
            }

            console.log('create potter entity')
            console.log({
              pot,
              targetCollider,
              targetModel,
            })

            entities.push(
              new PlanterEntity(
                world,
                pot,
                targetCollider,
                targetModel,
                SkeletonUtils.clone(plantModel)
              )
            )
          }

          PlantersScreenState.update({
            plantersHit: 0,
            maxPlanters: entities.length,
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
            if (id == SceneIds.Planters) {
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
            if (id == SceneIds.Planters) {
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
            if (id == SceneIds.Planters) {
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

export {PlanterEntities}
