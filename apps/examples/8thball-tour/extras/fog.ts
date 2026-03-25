// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const {THREE} = window as any

ecs.registerComponent({
  name: 'fog',
  schema: {
    // Add data that can be configured on the component.
    // @group start Color:color
    fogRed: ecs.f32,
    fogGreen: ecs.f32,
    fogBlue: ecs.f32,
    // @group end
    near: ecs.f32,
    far: ecs.f32,
  },
  schemaDefaults: {
    fogRed: 10,
    fogGreen: 115,
    fogBlue: 230,
    near: 60,
    far: 100,
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const {fogRed, fogGreen, fogBlue, near, far} = schemaAttribute.get(eid)
        const col = new THREE.Color(fogRed, fogGreen, fogBlue)
        world.three.scene.fog = new THREE.Fog(col, near, far)
      })
  },

  add: (world, eid) => {
  },
  tick: (world, component) => {
    // Runs every frame.
  },
  remove: (world, component) => {
    // Runs when the component is removed from the world.
  },
})
