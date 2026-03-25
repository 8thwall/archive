import * as ecs from '@8thwall/ecs'
import type {ScreenTouchMoveEvent} from '@8thwall/ecs'

import {addCleanup, doCleanup} from '../helpers/cleanup'
import {getGlobalConfig} from './GlobalConfig'

type Listener = (e: any) => void

ecs.registerComponent({
  name: 'CameraNav',
  schema: {
    factor: ecs.f32,
  },
  add: (world, component) => {
    const {eid} = component
    const {xSize, zSize} = getGlobalConfig(world)

    const xLimit = xSize + 10
    const zLimit = zSize + 10

    const handleMove: Listener = (e: {data: ScreenTouchMoveEvent}) => {
      const position = ecs.Position.cursor(world, eid)
      const {factor} = component.schema

      // Adjust movement to account for 45-degree angle
      const dx = e.data.change.x * factor
      const dy = e.data.change.y * factor

      const cos45 = Math.cos(Math.PI / 4)
      const sin45 = Math.sin(Math.PI / 4)

      // Apply 45-degree rotation to the movement, swap x and z movements, and invert left-to-right movement
      position.x -= (dy * cos45 + dx * sin45)
      position.z -= (dy * sin45 - dx * cos45)

      // Clamp the position to the defined limits
      position.x = Math.max(-xLimit, Math.min(xLimit, position.x))
      position.z = Math.max(-zLimit, Math.min(zLimit, position.z))
    }

    world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_MOVE, handleMove)

    const cleanup = () => {
      world.events.removeListener(world.events.globalId, ecs.input.SCREEN_TOUCH_MOVE, handleMove)
    }
    addCleanup(component, cleanup)
  },
  remove: (world, component) => {
    doCleanup(component)
  },
})
