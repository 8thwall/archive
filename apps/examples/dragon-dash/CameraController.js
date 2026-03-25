import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library

// Camera Controller Component
// Handles control of the camera and platform logic
ecs.registerComponent({
  name: 'cameraController',
  add: (world, component) => {
    world.time.setTimeout(() => {
      // Check if the current device is a desktop computer or a mobile device
      if (!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
        // If not a mobile device, emit a local event called 'isDesktop'
        world.events.dispatch(component.eid, 'isDesktop')
      }
    }, 1000)
  },
})
