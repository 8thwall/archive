import * as ecs from '@8thwall/ecs'

import {
  getSafeAreaInsets,
} from './utils'

const onResize = () => {
  const safeAreaInsets = getSafeAreaInsets()
  console.log(safeAreaInsets)
}

const GameManager = ecs.registerComponent({
  name: 'GameManager',  // Define the name of this component
  schema: {
    scoreBoardFrame: ecs.eid,
  },
  schemaDefaults: {
  },
  data: {
  },
  stateMachine: ({world, eid, dataAttribute, schemaAttribute}) => {
    ecs.defineState('loadingGame')
      .initial()
      .onEnter(() => {
        window.addEventListener('resize', onResize)
      })
      .onExit(() => {
        window.removeEventListener('resize', onResize)
      })
  },
})

export {
  GameManager,
}
