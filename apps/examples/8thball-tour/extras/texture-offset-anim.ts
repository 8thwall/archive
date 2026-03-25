// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const FROM_MILLI = 1 / 1000

ecs.registerComponent({
  name: 'texture-offset-anim',
  data: {
    hasMaterial: ecs.boolean,
  },
  stateMachine: ({world, eid, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const mat = ecs.Material.get(world, eid)

        if (mat) {
          dataAttribute.set(eid, {hasMaterial: true})
        }
      })
      .onTick(() => {
        const {hasMaterial} = dataAttribute.get(eid)

        if (hasMaterial) {
          const {offsetY} = ecs.Material.get(world, eid)
          const animationMultiplier = 0.1
          const deltaOffset = animationMultiplier * world.time.delta * FROM_MILLI

          ecs.Material.set(world, eid, {offsetY: offsetY + deltaOffset})
        }
      })
  },

})
