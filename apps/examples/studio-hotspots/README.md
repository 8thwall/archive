# Hotspots

This project demonstrates how to create "Hotspots" that show information when clicked, using built-in UI elements, animations, and a state machine for efficient event handling.

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
