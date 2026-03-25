// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {saveData} from './local-storage'

ecs.registerComponent({
  name: 'GoldDebug',
  schema: {
  },
  schemaDefaults: {
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  tick: (world) => {
    if (world.input.getKeyDown('KeyP')) {
      saveData({gold: 100}, true)
      world.events.dispatch(world.events.globalId, 'DATA_CHANGED')
    }
  },
})
