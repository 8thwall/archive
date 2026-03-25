// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const StatBars = ecs.registerComponent({
  name: 'stat-bars',
  schema: {
    // Possibly 0.
    health: ecs.eid,
    stamina: ecs.eid,
  },
})

export {StatBars}
