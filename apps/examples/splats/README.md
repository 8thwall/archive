# Studio: Splats

This project demonstrates how to use Gaussian Splats in Studio.
There are two spaces in this project, one showcasing an AR splat portal and one showing a 3D splat physics playground.

Learn more about Splats in Studio in our [documentation](https://www.8thwall.com/docs/studio/guides/splats/).

## About Gaussian Splats

Gaussian Splats are a rendering technique that represents objects as a set of
overlapping Gaussian functions, which are used to approximate the shape and
color of an object in 3D space.

.SPZ is Scaniverse's compressed gaussian splat format. To create your own:

1. Download [Scaniverse](https://scaniverse.com/)

2. Create a splat

3. Export an .SPZ (see below)

![](https://static.8thwall.app/assets/export-0-9l6i69hi1u.png)
![](https://static.8thwall.app/assets/export-1-9u7669p025.png)
![](https://static.8thwall.app/assets/export-2-axyy6yriae.png)

To view splats outside Studio, check out the [SPZ Web Viewer](https://8th.io/spz).

## Optimization Tips

- Keep .spz files under 10MB for best mobile performance.
- Use [Scaniverse](https://scaniverse.com/) to crop larger splats if needed.

---

# Space: Physics (3D)

This space showcases Gaussian Splat rendering and physics collisions with hand-placed colliders.

![](https://static.8thwall.app/assets/splat-orbit-wivem8f09h.gif)

## Project Files

`spawner.js` Spawns spheres with physics collisions.

- spawnInterval: milliseconds between sphere creation
- sphereRadius: radius of the sphere
- sphereMass: mass of the sphere

---

# Space: Portal (AR)

This project demonstrates the implementation of a door portal effect in Studio.
The main feature is a dynamic portal that reveals or hides certain hider elements based on the camera's position.

![](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmF2d29sc2VjbGZhbnZrNXZqaDUxNTM1YWd5aGlvc2Nvd2pvN3JxbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qNHXtSM49f0ClstYNK/giphy-downsized-large.gif)

## Components

### 1. portalHiderController

Manages the visibility of hider entities based on the camera's position.

### Schema

- `camera` (ecs.eid): Reference to the camera entity
- `hiderWalls` (ecs.eid): Reference to the Hider Walls entity
- `exitHider` (ecs.eid): Reference to the Exit Hider entity

#### Functionality

1. **Position Tracking**: The component tracks the camera's position on each frame.
2. **Threshold Check**: It checks if the camera's Z-position is below a certain threshold (-0.1 by default).
3. **Dynamic Visibility**:
   - When the camera is beyond the threshold:
     - The Hider Walls are hidden
     - The Exit Hider is shown
   - When the camera is before the threshold:
     - The Hider Walls are shown
     - The Exit Hider is hidden

## Project Setup

### Portal System Entity

This Parent entity is what the portalHiderController component is attached to and where the ecs entities Camera, Hider Walls and Exit Hider are set.

Children of this entity include Hider Walls and Exit Hider.

### Hider Walls Entity

![](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHJhM2dudXRkYTI1YmlzczBoZmtiZ3dua24ya3Bud2IyZzI1eXV4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Bd4UvhGe4C40CqHA8j/giphy.gif)

This entity consists of two main parts:

1. **Surrounding Walls**: Encapsulates the camera within a confined space, representing the "real world" environment.

2. **Portal Frame**: Shapes the portal opening. In this project, it's composed of planes forming the outline of the portal opening.

### Exit Hider Entity

![](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGhvdm9lZHJnY2Fsb2x3ODQ5OHV4dWt1b3Btdjk2aXd3MDJraG1icyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QpaP0TcvS4TRCyGpIX/giphy.gif)

This entity includes a hider material shape that:

- Faces the opposite direction of the Portal Frame. 180 degrees rotated.
- Matches the exact shape of the portal opening
- Allows the "real world" to be visible when looking back from inside the portal environment
- Note: Hider materials are rendered on a single side so you may need to rotate the camera from the front facing side to see this entity rendering. It may also be helpful to hide the Hider Walls to better see this entity.

## Customization

### Portal Shape

![Custom Portal Shape](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExamJmNHgxamJqMHJudTZrbjAwcXc0M3NyYTE3cWd5b2JzbDR2NnQ0YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pxQ5y8OVQinqBLYjK4/giphy.gif)

To customize the portal's appearance:

1. Modify the Portal Frame within the Portal Frame entity. The image above shows a circular opening as an example.

2. Update the Exit Hider entity to match the new shape exactly, ensuring visual consistency. It may be helpful to hide/show objects in herarchy when setting this up.

3. Experiment with different forms to create unique portal experiences, but always maintain alignment between the Portal Frame and Exit Hider for a convincing effect.

---

## Attribution

[Door](https://sketchfab.com/zian_0912) 3D model By Zian
