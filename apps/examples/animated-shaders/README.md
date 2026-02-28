# Studio: Animated Shaders

This project demonstrates how to create an animated shader applied to a primitive. The shader generates a dynamic, abstract visual effect on the surface of the cube by manipulating fragment and vertex shaders.

![Demo](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzZ0cmYxMWtkZ3FwdWd4cm12cjdtYmx5OHp0cnhxcmJmcDJvcmQ5ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TFlwT6nIWpAIN8dKoE/giphy.gif)

## Components

### animated-shader

This project contains three animated shader component files: animated-shader.ts, animated-shader2.ts (water effect), animated-shader3.ts (rainbow effect) These components are responsible for applying an animated shader material to a 3D shape, and updating the shape's appearance in real-time based on elapsed time.

#### Functionality

When the component is added to an entity:

1. Removes any existing material on the entity
2. Creates a custom shader material that animates over time
3. Applies the shader material to the shape
4. Updates the shader’s `time` uniform in every frame, ensuring continuous animation
5. Sets up event listeners for recentering the XR experience
