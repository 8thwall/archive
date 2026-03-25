// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const Shield = ecs.registerComponent({
  name: 'shield',
  schema: {
    owner: ecs.eid,
    physicalBlock: ecs.i32,
    stability: ecs.i32,
  },
  schemaDefaults: {
    physicalBlock: 100,
    stability: 50,
  },
})

export {Shield}
