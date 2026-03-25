import * as ecs from '@8thwall/ecs'

const vignetteEffect = ecs.registerComponent({
  name: 'Vignette Effect',
  schema: {
    fadeDuration: ecs.f32,
  },
  schemaDefaults: {
    fadeDuration: 0.2,
  },
  data: {
    isBoostActive: ecs.boolean,
  },
  stateMachine: ({world, eid, dataAttribute}) => {
    // Initialize data
    dataAttribute.set(eid, {
      isBoostActive: false,
    })

    // Listen for boost activation event from jetski
    world.events.addListener(world.events.globalId, 'boost-activated', () => {
      const data = dataAttribute.cursor(eid)
      if (!data.isBoostActive) {
        data.isBoostActive = true
        console.log('[vignette-effect] Boost activated, animating vignette in')
        
        const schema = vignetteEffect.get(world, eid)
        ecs.CustomPropertyAnimation.set(world, eid, {
          attribute: 'ui',
          property: 'backgroundOpacity',
          from: 0,
          to: 0.8,
          loop: false,
          duration: schema.fadeDuration * 1000,
        })
      }
    })

    // Listen for boost deactivation event from jetski
    world.events.addListener(world.events.globalId, 'boost-deactivated', () => {
      const data = dataAttribute.cursor(eid)
      if (data.isBoostActive) {
        data.isBoostActive = false
        console.log('[vignette-effect] Boost deactivated, animating vignette out')
        
        const schema = vignetteEffect.get(world, eid)
        ecs.CustomPropertyAnimation.set(world, eid, {
          attribute: 'ui',
          property: 'backgroundOpacity',
          from: 0.8,
          to: 0,
          loop: false,
          duration: schema.fadeDuration * 1000,
        })
      }
    })
    
    // Define initial state (required for state machine)
    ecs.defineState('active').initial()
  },
})

export {vignetteEffect}