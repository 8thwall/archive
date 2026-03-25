// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

// Lower priority number is higher priority.
enum HitPriority {
  Shield = 1,
  Standard = 2,
}

const Hittable = ecs.registerComponent({
  name: 'hittable',
  schema: {
    // The target this hittable refers to, or itself if set to BigInt(0)
    target: ecs.eid,
    priority: ecs.ui8,
  },
  schemaDefaults: {
    priority: 2,
  },
})

export {Hittable, HitPriority}
