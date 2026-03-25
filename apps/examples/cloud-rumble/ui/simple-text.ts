// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

ecs.registerComponent({
  name: 'simple-text',
  schema: {
    text: ecs.string,
    top: ecs.string,
    bottom: ecs.string,
    left: ecs.string,
    right: ecs.string,
    height: ecs.string,
    width: ecs.string,
    color: ecs.string,
  },
  schemaDefaults: {
    text: '',
    top: '10px',
    bottom: '-1px',
    left: '-1px',
    right: '10px',
    height: '36px',
    width: '36px',
    color: '#FFFFFF',
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  add: (world, component) => {
    // Runs when the component is added to the world.
    const container = document.createElement('div')
    container.style.position = 'absolute'

    // If left is not set, use right
    if (component.schema.left === '-1px') {
      container.style.right = component.schema.right
    } else {
      container.style.left = component.schema.left
    }

    // If bottom is not set, use top
    if (component.schema.bottom === '-1px') {
      container.style.top = component.schema.top
    } else {
      container.style.bottom = component.schema.bottom
    }
    container.style.height = component.schema.height
    container.style.width = component.schema.width
    container.style.overflow = 'hidden'  // Ensures content fits within the dimensions
    container.style.color = component.schema.color
    container.innerHTML = component.schema.text

    document.body.append(container)
  },
  tick: (world, component) => {
    // Runs every frame.
  },
  remove: (world, component) => {
    // Runs when the component is removed from the world.
  },
})
