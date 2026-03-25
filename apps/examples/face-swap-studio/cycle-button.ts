import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'cycle-button',
  schema: {
    worldContent: ecs.eid,
    faceContent: ecs.eid,
    swapButton: ecs.eid,
  },
  schemaDefaults: {
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const XR8Loaded = ecs.defineTrigger()
    const buttonReady = ecs.defineTrigger()

    const {swapButton} = schemaAttribute.get(eid)

    const handleCameraChange = () => {
      console.log('swapping')

      const camera = world.camera.getActiveEid()
      const {xrCameraType} = ecs.Camera.get(world, camera)
      const {worldContent, faceContent} = schemaAttribute.get(eid)

      if (xrCameraType === 'face') {
        ecs.Camera.mutate(world, camera, (cursor) => {
          cursor.xrCameraType = 'world'
          cursor.direction = 'back'
        })

        ecs.Hidden.set(world, faceContent)
        ecs.Hidden.remove(world, worldContent)
        console.log('Switched to: World Effects')
      } else {
        ecs.Camera.mutate(world, camera, (cursor) => {
          cursor.xrCameraType = 'face'
          cursor.direction = 'front'
        })

        ecs.Hidden.set(world, worldContent)
        ecs.Hidden.remove(world, faceContent)
        console.log('Switched to: Face Effects')
      }
    }

    ecs.defineState('loading')
      .initial()
      .onTick(() => {
        // @ts-ignore
        if (window.XR8) {
          XR8Loaded.trigger()
        }
      })
      .onTrigger(XR8Loaded, 'loaded')
    ecs.defineState('loaded')
      .onEnter(() => {
        world.time.setTimeout(() => {
          handleCameraChange()
          buttonReady.trigger()
        }, 500)
      })
      .onTrigger(buttonReady, 'started')
    ecs.defineState('started')
      .onEnter(() => {
        console.log('ready')
      })
      .listen(swapButton, ecs.input.SCREEN_TOUCH_START, handleCameraChange)
      .listen(swapButton, 'click', handleCameraChange)
  },
  add: (world, component) => {
  },
  tick: (world, component) => {
  },
  remove: (world, component) => {
  },
})
