# Studio: Splash Screen

This project demonstrates how to create a tap-to-begin system with a loading screen, using state machines to manage transitions between asset loading, onboarding, and experience readiness. It includes a splash screen that automatically transitions to your main content after user interaction.

## Overview

The project uses Spaces (similar to Scenes in Unity) to organize content:

- **Splash Screen Space**: Contains the loading UI and tap-to-begin interface
- **Default Space**: Where you should place your main content

> **Important**: Always place your content in the "Default" space by using the spaces dropdown in the editor. Do not place content in the Splash Screen space or change the "Entry Space" in the project settings, as this will prevent the splash screen from appearing.

## Components

### splash-screen

This component manages the loading and onboarding process, displaying a progress bar during asset loading and a "Tap to Begin" message once loading is complete. It transitions through three states: loading, onboarding, and experience-ready.

#### Functionality

When the splash-screen component is active:

1. Displays a loading progress indicator showing the percentage of assets loaded
2. Monitors asset loading progress using `ecs.assets.getStatistics()`
3. Shows an onboarding message ("Tap to Begin") after assets finish loading
4. Waits for user interaction (touch or click) to transition to the experience-ready state
5. Automatically loads the specified space (Default by default) to show your content

#### Schema

- **progressText**: `ecs.eid` - Reference to the progress text UI element
- **messageText**: `ecs.eid` - Reference to the onboarding message UI element
- **beginMessage**: `ecs.string` - Message displayed when onboarding is ready to begin (default: "Tap to begin")
- **startingSpaceName**: `ecs.string` - The name of the Space that contains your content (default: "Default")

#### Code Highlight

```ts
ecs.registerComponent({
  name: 'splash-screen',
  schema: {
    progressText: ecs.eid,  // Entity ID for the UI element showing progress
    messageText: ecs.eid,  // Entity ID for the UI element displaying messages
    beginMessage: ecs.string,  // Message displayed when onboarding is ready to begin
    startingSpaceName: ecs.string,  // The name of the Space that has your content
  },
  schemaDefaults: {
    beginMessage: 'Tap to begin',  // Default message to display at the start of onboarding
    startingSpaceName: 'Default',
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
        const {startingSpaceName} = schemaAttribute.get(eid)

        world.spaces.loadSpace(`${startingSpaceName}`)
      })
  },
})
```

## Usage Instructions

1. The project starts in the Splash Screen space, showing loading progress
2. After assets load, users will see the "Tap to Begin" message
3. When the user taps/clicks, the system automatically transitions to the Default space
4. Your content in the Default space will now be visible and interactive

## Working with Spaces

To add your content to this project:

1. Use the Spaces dropdown in the editor and select "Default"
2. Add your 3D models, UI elements, and interactions to this space
3. The splash screen will automatically transition to your content after user interaction

## Additional Features

- The loading screen dynamically updates progress as assets load
- Onboarding is interactive, requiring user input to proceed
- The system automatically switches spaces to load your content
- No custom event listener setup required - the space system handles transitions
