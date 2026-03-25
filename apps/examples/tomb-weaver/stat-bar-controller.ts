// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const StatBarController = ecs.registerComponent({
  name: 'stat-bar-controller',
  schema: {
    // Add data that can be configured on the component.
    maxValue: ecs.i32,
    value: ecs.i32,
    valueBar: ecs.eid,
    consumedBar: ecs.eid,
    emptyBar: ecs.eid,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    maxValue: 100,
    value: 50,
  },
  data: {
    widthScale: ecs.f32,
    lastValue: ecs.i32,
    lastMaxValue: ecs.i32,
    consumed: ecs.i32,
    consumedRender: ecs.f32,
  },
  add: (world, component) => {
    // Runs when the component is added to the world.
    const {eid, data, schema} = component
    const ui = ecs.Ui.get(world, eid)
    data.lastMaxValue = schema.maxValue
    data.lastValue = schema.value
    data.widthScale = parseInt(ui.width, 10) / 100.0
    data.consumed = 0
    data.consumedRender = 0.0
  },
  tick: (world, component) => {
    // Runs every frame.

    const {eid, data, schema} = component
    const {valueBar, consumedBar, emptyBar} = schema

    const width = Math.ceil(schema.maxValue * data.widthScale)
    ecs.Ui.set(world, eid, {width: `${width}`})

    const value = Math.min(Math.ceil(schema.value * data.widthScale), width)

    const CONSUMED_TIMER_DELAY = 400.0
    const CONSUMED_TIMER_DECAY = 0.2

    let consumed = 0

    if (value > data.lastValue || data.lastMaxValue !== schema.maxValue) {
      data.consumed = 0
      data.consumedRender = 0.0
    } else if (value < data.lastValue) {
      data.consumed = Math.max(0, data.lastValue - value)
      data.consumedRender = data.consumed + CONSUMED_TIMER_DECAY * CONSUMED_TIMER_DELAY
      consumed = data.consumed
    } else if (data.consumedRender > 0.0) {
      data.consumedRender -= CONSUMED_TIMER_DECAY * world.time.delta
      consumed = Math.max(0, Math.round(Math.min(data.consumed, data.consumedRender)))
    } else {
      data.consumed = 0
      data.consumedRender = 0.0
      consumed = 0
    }
    data.lastValue = value
    data.lastMaxValue = schema.maxValue

    const empty = width - value - consumed

    ecs.Ui.set(world, emptyBar, {width: `${empty}`})
    ecs.Ui.set(world, consumedBar, {width: `${consumed}`})
    ecs.Ui.set(world, valueBar, {width: `${value}`})
  },
  remove: (world, component) => {
    // Runs when the component is removed from the world.
  },
})

export {StatBarController}
