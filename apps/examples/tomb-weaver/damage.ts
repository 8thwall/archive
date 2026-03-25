// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const Damage = ecs.registerComponent({
  name: 'damage',
  schema: {
    physical: ecs.i32,
    stamina: ecs.i32,
    blocked: ecs.boolean,
    blockBroken: ecs.boolean,
  },
  schemaDefaults: {
    // Physical damage amount.
    physical: 0,
    stamina: 0,
    blocked: false,
    blockBroken: false,
  },
})

export {Damage}
