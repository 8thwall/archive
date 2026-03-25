import * as ecs from '@8thwall/ecs'

let ecsPaused = false

const setPaused = (world: ecs.World, paused: boolean) => {
  if (ecsPaused !== paused) {
    ecsPaused = paused
    if (paused) {
      world.setTickMode('partial')
    } else {
      world.setTickMode('full')
    }
  }
}

const togglePaused = (world: ecs.World) => {
  setPaused(world, !ecsPaused)
}

const ApplicationControl = {
  setPaused,
  togglePaused,
}

export {ApplicationControl}
