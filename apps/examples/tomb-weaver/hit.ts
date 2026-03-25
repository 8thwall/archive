import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

interface Hit {
  attack: string
  hitTarget: ecs.Eid
  target: ecs.Eid
}

export type {Hit}
