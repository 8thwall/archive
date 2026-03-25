// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

ecs.registerComponent({
  name: 'start-menu',
  schema: {
    // Add data that can be configured on the component.
    enabled: ecs.boolean,
    startButton: ecs.eid,
    startScreen: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('initial').initial().onEnter(
      () => {
        const schema = schemaAttribute.get(eid)
        const {enabled, startScreen} = schema
        if (enabled) {
          ecs.Position.set(world, startScreen, {x: 0, y: 0, z: 4})
        }
      }
      // @ts-ignore
    ).listen(schemaAttribute.get(eid).startButton, ecs.input.UI_CLICK, () => {
      ecs.Disabled.set(world, schemaAttribute.get(eid).startScreen, {})
    })
  },
})
