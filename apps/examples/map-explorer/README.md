# Studio: Map Explorer

## Overview

Studio: Map Explorer is a location-based AR experience built with Niantic Studio. This project integrates Lightship VPS and Niantic Maps for Web, allowing users to navigate to VPS-activated Locations and launch procedural VPS AR experiences.

For detailed documentation, visit the [Niantic Studio Documentation](https://www.8thwall.com/docs/studio/).

## Features

- **Real-World Exploration:** Players explore a map-based interface that displays VPS Locations.
- **Location-based AR Experiences:** When users approach a VPS Location, they can initiate a procedural AR scene.
- **Niantic Maps for Web:** Displays a stylized 3D map that highlights VPS locations.
- **Space Transitions:** Players can swap between the 3D world map and location-specific AR scenes.

## Project Structure

### Assets/

- **doty.glb** - The avatar/character used on the map.
- **noto-sans-jp.font8** - Custom font used in the UI.
- **poi-disc.glb** - 3D markers representing VPS locations on the map.

## Custom Components

### `load-space-on-click.ts`

Handles space transitions between the world map and AR locations.

### **vps-shader.ts**

Applies a rainbow wireframe effect on detected VPS meshes.

- **Properties:**

  - `wireframeColor`: Base color of the wireframe effect.
  - `animationSpeed`: Speed at which colors wave and shift.
  - `opacity`: Transparency level of the wireframe.
  - `waveScale`: Scale of the animated waves.

- **Functionality:**
  - Listens for `reality.meshfound` and applies a dynamic shader.
  - Creates a mesh material that reacts to time-based animation.
  - Hides the effect when the VPS mesh is lost.

### `world-map-camera-controls.ts`

Enables interactive camera rotation on the world map.

- Handles **touch-based rotation**.
- Applies easing for smooth transitions.

### `world-map-location.ts`

Defines the procedural location entity, including geofencing and UI elements.

- **Properties**: `threshold`, `displayName`, `spaceName`, `thumbnailImage`
- **Visuals**: Configures POI rings and spheres with customizable colors.

### `world-map-ui.ts`

Manages UI updates when approaching POIs.

- Displays the **location name** and **"Start AR" button** when near a VPS Location.
- Listens for `geofence-entered` and `geofence-exited` events.

### `world-map.ts`

Configures the 3D world map, supporting both **GPS-based movement** and **WASD debugging controls**.

- Enables **fog effects** and **custom map themes**.
- Supports **manual movement** in debug mode.

## How It Works

1. The user navigates the 3D world map where VPS locations are represented by spheres.
2. As they approach a VPS Location, the sphere transitions into a rotating disc with a thumbnail image.
3. A UI overlay appears, showing the location name and a "Start AR" button.
4. Clicking the button loads the corresponding VPS procedural AR experience.
5. In the AR experience, a rainbow wireframe effect is overlayed on the detected VPS location mesh.

## Development & Debugging

- **WASD Debug Mode:** Allows manual movement testing without GPS.
- **Simulator Support:** Test VPS interactions in Niantic Studio’s built-in Simulator.
- **Logging & Event Tracking:** Uses Niantic Studio’s ECS-based event system for debugging.
