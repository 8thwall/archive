import * as ecs from '@8thwall/ecs'
import {Scene} from './scene'

const worldMatrix = ecs.math.mat4.i()
const worldTrs = {
  t: ecs.math.vec3.zero(),
  r: ecs.math.quat.zero(),
  s: ecs.math.vec3.zero(),
}

const ScenePositionComponent = ecs.registerComponent({
  name: 'ScenePosition',
  schema: {},
  schemaDefaults: {},
  add: (world, component) => {
    const {eid} = component
    const scene = Scene.findScene(world, eid)
    world.getWorldTransform(eid, worldMatrix)
    worldMatrix.decomposeTrs(worldTrs)
    scene.setPosition(worldTrs.t.x, worldTrs.t.y, worldTrs.t.z)
  },
  remove: (world, component) => {},
})

export {ScenePositionComponent}
