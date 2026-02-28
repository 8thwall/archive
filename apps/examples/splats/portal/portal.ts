import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Portal',
  schema: {
    camera: ecs.eid,      // Reference to the camera entity
    hiderWalls: ecs.eid,  // Reference to the Hider Walls entity
    exitHider: ecs.eid,   // Reference to the Exit Hider entity
  },
  data: {
    isValid: ecs.boolean,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const {camera, hiderWalls, exitHider} = schemaAttribute.get(eid)

        dataAttribute.set(eid, {
          isValid: !!(camera && hiderWalls && exitHider),
        })

        if (!dataAttribute.get(eid).isValid) {
          console.error('camera, hiderWalls, or portalHider entity not set in Portal component.')
        }
      })
      .onTick(() => {
        if (dataAttribute.get(eid).isValid) {
          const {camera, hiderWalls, exitHider} = schemaAttribute.get(eid)
          const cameraPosition = ecs.Position.get(world, camera)
          const threshold = -0.1  // Adjust the threshold as needed

          if (cameraPosition.z < threshold) {
            ecs.Hidden.set(world, hiderWalls)     // Hide the Hider Walls
            ecs.Hidden.remove(world, exitHider)   // Show the Exit Hider
          } else {
            ecs.Hidden.remove(world, hiderWalls)  // Show the Hider Walls
            ecs.Hidden.set(world, exitHider)      // Hide the Exit Hider
          }
        }
      })
  },
})
