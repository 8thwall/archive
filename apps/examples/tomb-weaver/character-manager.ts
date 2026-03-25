// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

ecs.registerComponent({
  name: 'character-manager',
  schema: {
    // Add data that can be configured on the component.
    playerStart: ecs.eid,
    resetButton: ecs.eid,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  add: (world, component) => {
    // Runs when the component is added to the world.
    const {schemaAttribute, eid} = component
    const resetPlayer = () => {
      world.setTransform(component.eid,
        world.transform.getWorldTransform(schemaAttribute.get(component.eid).playerStart))
    }
    world.events.addListener(world.events.globalId, 'finishedFadeIn', () => {
      resetPlayer()
    })
    resetPlayer()
  },
  tick: (world, component) => {
    // Runs every frame.
  },
  remove: (world, component) => {
    // Runs when the component is removed from the world.
  },
})
