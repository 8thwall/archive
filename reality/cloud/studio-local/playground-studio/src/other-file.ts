/* eslint-disable no-console */

// import myModule from 'my-alias'
import * as ecs from '@8thwall/ecs'

import myJsonFile from './my-json-file.json'

// test asset-loader
import myImage from './assets/images/black_logo.png'

// // console.log({myModule})
console.log({ecs})
console.log(myJsonFile.config.array)
console.log({myImage})

let tickCounter = 0

ecs.registerComponent({
  name: 'cliptoggle4',
  schema: {period: ecs.f32},
  tick: (world, component) => {
    tickCounter++
    const model = ecs.GltfModel.get(world, component.eid)
    if (tickCounter % 50 === 0 && model.url.includes('wol')) {
      // eslint-disable-next-line no-bitwise
      if ((world.time.elapsed >> 11) % 2 && model.animationClip !== 'wol_idle_001') {
        ecs.GltfModel.set(world, component.eid, {animationClip: 'wol_idle_001'})
      } else if (model.animationClip !== 'wol_celebration_001') {
        ecs.GltfModel.set(world, component.eid, {animationClip: 'wol_celebration_001'})
      }
    }

    Array.from(world.getChildren(component.eid)).forEach((child: any) => {
      ecs.Scale.set(world, child, {x: 1, y: 1, z: 1})
    })
  },
})
