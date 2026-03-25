import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'splash-screen',
  schema: {
    progressText: ecs.eid,  // Entity ID for the UI element showing progress
    messageText: ecs.eid,  // Entity ID for the UI element displaying messages
    beginMessage: ecs.string,  // Message displayed when onboarding is ready to begin
  },
  schemaDefaults: {
    beginMessage: 'Click to start Shooting!',  // Default message to display at the start of onboarding
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    // Trigger to transition from 'loading' to 'onboarding'
    const toOnboarding = ecs.defineTrigger()

    // Define the 'loading' state
    ecs.defineState('loading')
      .initial()  // Set as the initial state
      .onTick(() => {
        const {pending, complete} = ecs.assets.getStatistics()  // Retrieve asset loading stats
        const progress = complete / (pending + complete)  // Calculate progress as a ratio

        if (progress >= 1) {
          toOnboarding.trigger()  // Transition to 'onboarding' when all assets are loaded
        }

        const {progressText} = schemaAttribute.get(eid)  // Retrieve the progress text element

        if (progressText) {
          // Update the progress text with the calculated progress percentage
          ecs.Ui.mutate(world, progressText, (cursor) => {
            cursor.text = `${Number.isNaN(progress) ? 0 : Math.floor(progress * 100)}%`
          })
        }
      })
      .onTrigger(toOnboarding, 'onboarding')  // Transition to 'onboarding' state on trigger

    // Define the 'onboarding' state
    ecs.defineState('onboarding')
      .onEnter(() => {
        const {progressText, messageText, beginMessage} = schemaAttribute.get(eid)

        if (progressText) {
          ecs.Hidden.set(world, progressText)  // Hide the progress text element
        }

        if (messageText) {
          // Set the onboarding message text to the value of `beginMessage`
          ecs.Ui.mutate(world, messageText, (cursor) => {
            cursor.text = `${beginMessage}`
          })
        }
      })
      // Transition to 'experience-ready' on screen touch
      .onEvent(ecs.input.SCREEN_TOUCH_START, 'experience-ready')
      // Transition to 'experience-ready' on click
      .onEvent('click', 'experience-ready')

    // Define the 'experience-ready' state
    ecs.defineState('experience-ready')
      .onEnter(() => {
        ecs.Hidden.set(world, eid)  // Hide the entire start-screen component
        // Dispatch a global event signaling that the experience is ready
        world.events.dispatch(world.events.globalId, 'experience-ready')
      })
  },
  add: (world, component) => {
  },
  tick: (world, component) => {
  },
  remove: (world, component) => {
  },
})
