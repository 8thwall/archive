import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library

// Ground Controller Component - Handles control of ground objects movement
ecs.registerComponent({
  name: 'groundController',
  schema: {
    groundMoveSpeed: ecs.f32,  // Ground Movement Speed as a 32-bit floating point number
    leftBound: ecs.f32,  // The initial Left Bound x value as a 32-bit floating point number
  },
  schemaDefaults: {
    groundMoveSpeed: 12,
    leftBound: -42,
  },
  data: {
    gameActive: ecs.boolean,  // Flag for whether the game is in the active state
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('paused')  // creating the paused state
    // listening for restart on world.events.globalId to transition to moving state
      .onEvent('restart', 'moving', {target: world.events.globalId})
      .onEnter(() => {
        dataAttribute.cursor(eid).gameActive = false
      })
    ecs.defineState('moving').initial()  // creating the initial state
      // listening for gameOver on world.events.globalId to transition to paused state
      .onEvent('gameOver', 'paused', {target: world.events.globalId})
      .onEnter(() => {
        dataAttribute.cursor(eid).gameActive = true
      })
  },
  add: (world, component) => {
    component.dataAttribute.cursor(component.eid).gameActive = true
  },
  tick: (world, component) => {
    const moveDistance = (component.schema.groundMoveSpeed * world.time.delta) / 1000
    // If the game is active on this frame...
    if (component.dataAttribute.cursor(component.eid).gameActive) {
      for (const element of world.getChildren(component.eid)) {
        const elementStartingPosition = ecs.Position.get(world, element)
        let newX = elementStartingPosition.x - moveDistance
        const yPosition = elementStartingPosition.y
        const zPosition = elementStartingPosition.z
        // Get the new x position along with the current y and z positions
        // If the ground object has passed the leftBound value
        if (newX < component.schema.leftBound) {
          newX -= component.schema.leftBound  // Reset its position to the back
        }
        // Set its final position for this frame
        world.setPosition(element, newX, yPosition, zPosition)
      }
    }
  },
})
