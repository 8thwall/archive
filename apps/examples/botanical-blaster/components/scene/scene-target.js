import * as ecs from '@8thwall/ecs'
import {Scene} from './scene'

const worldMatrix = ecs.math.mat4.i()
const trs = {
  t: ecs.math.vec3.zero(),
  r: ecs.math.quat.zero(),
  s: ecs.math.vec3.zero(),
}

const SceneTargetComponent = ecs.registerComponent({
  name: 'SceneTarget',
  schema: {},
  schemaDefaults: {},
  add: (world, component) => {
    const {eid} = component
    const scene = Scene.findScene(world, eid)
    world.getWorldTransform(eid, worldMatrix)
    worldMatrix.decomposeTrs(trs)
    scene.setTarget(trs.t.x, trs.t.y, trs.t.z)
  },
  remove: (world, component) => {},
})

export {SceneTargetComponent}
