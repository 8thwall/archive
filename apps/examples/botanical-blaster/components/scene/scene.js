import * as ecs from '@8thwall/ecs'
import {SceneManager} from './scene-manager'

export class Scene {
  /**
   * @param {string} id
   * @param {BigInteger} entityId
   * @param {import("three").Object3D} object
   */
  constructor(id, entityId, object) {
    /**
     * @type {string} id
     */
    this.id = id
    /**
     * @type {BigInteger} entityId
     */
    this.entityId = entityId
    /**
     * @type {import("three").Object3D} object
     */
    this.object = object

    /**
     * @type {import("three").Vector3|null} object
     */
    this.target = null
    /**
     * @type {import("three").Vector3|null} object
     */
    this.position = null
  }

  hide() {
    this.object.visible = false
  }

  show() {
    this.object.visible = true
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  setTarget(x, y, z) {
    this.target = new THREE.Vector3(x, y, z)
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  setPosition(x, y, z) {
    this.position = new THREE.Vector3(x, y, z)
  }
}

/**
 * @param {*} world
 * @param {BigInteger} entityId
 */
Scene.findSceneName = (world, entityId) => {
  let entity = entityId
  while (entity) {
    if (SceneComponent.has(world, entity)) {
      return SceneComponent.get(world, entity).name
    }
    entity = world.getParent(entity)
  }
  throw new Error('Error while looking for scene. Not inside a scene object.')
}
/**
 * @param {*} world
 * @param {BigInteger} entityId
 */
Scene.findScene = (world, entityId) => {
  const sceneName = Scene.findSceneName(world, entityId)
  return SceneManager.getScene(sceneName)
}

const SceneComponent = ecs.registerComponent({
  name: 'Scene',
  schema: {
    name: ecs.string,
  },
  add: (world, component) => {
    const {name} = component.schema
    const {eid} = component
    const sceneObject = world.three.entityToObject.get(component.eid)
    SceneManager.addScene(name, new Scene(name, eid, sceneObject))
  },
  remove: (world, component) => {
    SceneManager.removeScene(component.schema)
  },
})

export {SceneComponent}
