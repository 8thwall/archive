# Space 1 & 2: Splash Screen

This space demonstrates how to create a tap-to-begin system with a loading screen, using state machines to manage transitions between asset loading, onboarding, and experience readiness. It includes a splash screen that automatically transitions to your main content after user interaction.

## Overview

The project uses Spaces (similar to Scenes in Unity) to organize content:

- **Splash Screen**: Contains the loading UI and tap-to-begin interface
- **Splash Screen Scene**: Where you should place your main content

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

---

# Space 3: Hotspots

This space demonstrates how to create "Hotspots" that show information when clicked, using built-in UI elements, animations, and a state machine for efficient event handling.

## Components

### hotspot

This component turns an entity into a clickable hotspot.

#### Functionality

When the hotspot component is added to an entity:

- It uses a state machine to manage event listeners, ensuring automatic cleanup and efficient handling.
- When the entity is clicked, it dispatches a global event `hotspot_activated`, passing the entity ID and its associated message.
- Based on the `hotspot_activated` event, the hotspot entity:
  - Animates its rotation.
  - Updates its color to the highlighted state.
- If another hotspot is activated, the previously active hotspot returns to its default state.

#### Schema

- `message`: ecs.string - The message displayed when the hotspot is activated. (default: "Placeholder")
- `speed`: ecs.i32 - The rotation animation speed in milliseconds. (default: 5000)
- `highlightedSpeed`: ecs.i32 - The rotation speed when highlighted. (default: 1500)
- `r`: ecs.f32 - Default red color value. (default: 174)
- `g`: ecs.f32 - Default green color value. (default: 0)
- `b`: ecs.f32 - Default blue color value. (default: 255)
- `highlightedR`: ecs.f32 - Highlighted red color value. (default: 255)
- `highlightedG`: ecs.f32 - Highlighted green color value. (default: 0)
- `highlightedB`: ecs.f32 - Highlighted blue color value. (default: 255)

## Updates in `hotspot`

The `hotspot` component uses a state machine to manage event listeners, providing the following benefits:

- **Automatic Event Listener Cleanup:** The state machine ensures that event listeners are properly cleaned up, reducing potential memory leaks.
- **Improved Readability:** Centralized state definitions make it easier to understand how the component reacts to events.
- **Enhanced Maintainability:** Adding or modifying behaviors is more straightforward with state-based logic.

### Key Changes

- **State Management:**
  - An `idle` state is defined as the initial state.
  - Handles `ecs.input.SCREEN_TOUCH_START` to dispatch the `hotspot_activated` event.
  - Listens for the global `hotspot_activated` event to update the hotspot's appearance.
- **Rotation and Color Handling:** Adjusts animation speed and material colors based on whether the hotspot is active or idle.

---

# Space 4: Button

This space demonstrates how to create a 3D label in your scene that redirects users to another website when clicked, using built-in UI elements.

## Components

### call-to-action

This component takes the user to another webpage when the entity it's attached to is clicked.

#### Functionality

When the call-to-action component is added to an entity:

1. It attaches a click event listener to the entity.
2. When the entity is clicked, the browser opens the specified link.

#### Schema

- link: ecs.string - The URL to which the user will be redirected. (default: "https://www.8thwall.com/get-started").

---

# Space 5: Animated Shaders

This space demonstrates how to create an animated shader applied to a primitive. The shader generates a dynamic, abstract visual effect on the surface of the cube by manipulating fragment and vertex shaders.

![Demo](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTM0YW9saWFyc2M3amxvdnR0Ym00enh4bWdsOTViZ2NueHV2eXAxZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/irVhFxrbhIKc4PvdPq/giphy-downsized-large.gif)

## Components

### animated-shader

This component is responsible for applying an animated shader material to a 3D cube, and updating the cube's appearance in real-time based on elapsed time.

#### Functionality

When the component is added to an entity:

1. Removes any existing material on the entity
2. Creates a custom shader material that animates over time
3. Applies the shader material to a 3D cube
4. Updates the shader’s `time` uniform in every frame, ensuring continuous animation
5. Sets up event listeners for recentering the XR experience
