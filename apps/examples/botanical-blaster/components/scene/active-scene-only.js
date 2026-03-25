import * as ecs from '@8thwall/ecs'
import {SceneManager} from './scene-manager'

/**
 * @type {Map<BigInt, Function>}
 */
const cleanUp = new Map()

class MemoizedEntity {
  /**
   * @param {*} world
   * @param {*} entityId
   */
  constructor(world, entityId) {
    this.world = world
    this.entityId = entityId

    this._cachedCollider = null

    /**
     *@type {import("three").Vector3}
     */
    this.position = new THREE.Vector3()
    /**
     *@type {import("three").Vector3}
     */
    this.scale = new THREE.Vector3()
    /**
     *@type {import("three").Vector4}
     */
    this.quaternion = new THREE.Vector4()

    this.storeTransforms()
  }

  storeTransforms() {
    const pos = ecs.Position.get(this.world, this.entityId)
    this.position.set(pos.x, pos.y, pos.z)
    const quat = ecs.Quaternion.get(this.world, this.entityId)
    this.quaternion.set(quat.x, quat.y, quat.z, quat.w)
    const scale = ecs.Scale.get(this.world, this.entityId)
    this.scale.set(scale.x, scale.y, scale.z)
  }

  restoreTransforms() {
    this.world.setPosition(this.entityId, ...this.position.toArray())
    this.world.setQuaternion(this.entityId, ...this.quaternion.toArray())
    this.world.setScale(this.entityId, ...this.scale.toArray())
  }

  cacheCollider() {
    const {world, entityId} = this
    if (!ecs.Collider.has(world, entityId)) return

    const properties = JSON.parse(
      JSON.stringify(ecs.Collider.get(world, entityId))
    )
    ecs.Collider.remove(world, entityId)
    this._cachedCollider = properties
  }

  restoreCollider() {
    if (!this._cachedCollider) return
    const {world, entityId} = this
    ecs.Collider.set(world, entityId, this._cachedCollider)  // Ensure properties are set back
  }
}

/**
 * @type {Map<string, MemoizedEntity>}
 */
const memoizedEntities = new Map()

const ActiveSceneOnly = ecs.registerComponent({
  name: 'ActiveSceneOnly',
  schema: {
    sceneId: ecs.string,
  },
  add: (world, component) => {
    const {eid} = component
    try {
      const {sceneId} = component.schema

      const getOrAddMemoizedEntity = (entityId) => {
        if (memoizedEntities.has(entityId)) return memoizedEntities.get(entityId)
        const newEntity = new MemoizedEntity(world, entityId)
        memoizedEntities.set(entityId, newEntity)
        return newEntity
      }

      const traverse = (parent, run) => {
        for (const child of world.getChildren(parent)) {
          run(child)
          traverse(child, run)
        }
      }

      const beforeEnterSceneListener = ({detail}) => {
        if (detail.id == sceneId) {
          traverse(eid, (entity) => {
            const memoized = getOrAddMemoizedEntity(entity)
            memoized.restoreTransforms()
            memoized.restoreCollider()
          })
        } else {
          traverse(eid, (entity) => {
            const memoized = getOrAddMemoizedEntity(entity)
            memoized.storeTransforms()
            memoized.cacheCollider()
          })
        }
      }

      const enterSceneListener = ({detail}) => {
        const entityObject = world.three.entityToObject.get(eid)
        if (detail.id == sceneId) {
          entityObject.visible = true
          traverse(eid, (entity) => {
            world.events.dispatch(entity, 'active', {isActive: true})
          })
        } else {
          entityObject.visible = false
          traverse(eid, (entity) => {
            world.events.dispatch(entity, 'active', {isActive: false})
          })
        }
      }

      SceneManager.addEventListener(
        SceneManager.events.EnterScene,
        enterSceneListener
      )

      SceneManager.addEventListener(
        SceneManager.events.BeforeEnterScene,
        beforeEnterSceneListener
      )

      cleanUp.set(eid, () => {
        SceneManager.removeEventListener(
          SceneManager.events.EnterScene,
          enterSceneListener
        )

        SceneManager.removeEventListener(
          SceneManager.events.BeforeEnterScene,
          beforeEnterSceneListener
        )
      })
    } catch (error) {
      console.warn('Error for scene only component')
      console.error(error)
    }
  },
  remove: (world, component) => {
    const run = cleanUp.get(component.eid)
    if (!run) return
    run()
    cleanUp.delete(component.eid)
  },
})

export {ActiveSceneOnly}
