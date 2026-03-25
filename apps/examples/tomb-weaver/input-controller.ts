// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

enum Action {
  MoveUp = 'up',
  MoveRight = 'right',
  MoveDown = 'down',
  MoveLeft = 'left',
  Attack = 'attack',
  Shield = 'shield',
}

interface ActionEvent {
  action: Action,
  value: number,
}

const inputController = ecs.registerComponent({
  name: 'input-controller',
  schema: {
    // Add data that can be configured on the component.
    target: ecs.eid,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
  },
  data: {
    // Add data that cannot be configured outside of the component.
    up: ecs.boolean,
    right: ecs.boolean,
    down: ecs.boolean,
    left: ecs.boolean,
    attack: ecs.boolean,
    shield: ecs.boolean,
  },
  add: (world, component) => {
    // Runs when the component is added to the world.
  },
  tick: (world, component) => {
    // Runs every frame.
    const {schema, data} = component

    const dispatchActionEvent = (
      target: ecs.Eid,
      name: string,
      event: ActionEvent
    ) => world.events.dispatch(target, name, event)

    Object.entries(Action).forEach(([action, name]) => {
      const value = world.input.getAction(name)
      if (!data[name] && value !== 0) {
        dispatchActionEvent(schema.target, 'actionStart', {
          action: name,
          value,
        })
        data[name] = true
      } else if (data[name] && value === 0) {
        dispatchActionEvent(schema.target, 'actionEnd', {
          action: name,
          value,
        })
        data[name] = false
      }
    })
  },
  remove: (world, component) => {
    // Runs when the component is removed from the world.
  },
})

export {inputController, Action, ActionEvent}
