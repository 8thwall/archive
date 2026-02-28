# Studio: Scavenger Hunt

## Overview

Studio: Scavenger Hunt is a location-based AR experience built with Niantic Studio. This project integrates **Lightship VPS** and **Niantic Maps** to create an interactive scavenger hunt where players navigate to 4 different VPS-activated Locations and engage in bespoke VPS experiences.

For detailed documentation, visit the [Studio Documentation](https://www.8thwall.com/docs/studio).

## Features

- **Real-World Exploration**: Players move in real life to interact with different VPS-activated locations.
- **Location-based AR Experiences**: Each location features unique 3D animations and interactions.
- **Niantic Maps for Web**: The world map visualizes specific VPS Locations, allowing users to transition between AR experiences.
- **Space Transitions**: Players can swap between the 3D world map and location-specific AR scenes.

## Project Structure

### **Assets/**

- **Animations/** - Baked physics animations for each location:
  - `california-park-anim.glb`
  - `college-ave-fountain-anim.glb`
  - `concrete-circle-anim.glb`
  - `lost-in-my-abstract-garden-anim.glb`
- **Locations/** - Reference meshes used for occlusion:
  - `california-park.glb`
  - `college-ave-fountain.glb`
  - `concrete-circle.glb`
  - `lost-in-my-abstract-garden.glb`
- **Thumbnails/** - Displayed on POI Discs within the 3D map:
  - `california-park.png`
  - `college-ave-fountain.png`
  - `concrete-circle.png`
  - `lost-in-my-abstract-garden.png`
  - `doty.png`
- **Other Assets:**
  - `doty.glb` - Avatar/character used on the map.
  - `poi-disc.glb` - 3D marker for locations.
  - `noto-sans-jp.font8` - Custom font for UI.

## **Custom Components**

### `load-space-on-click.ts`

Handles space transitions between the world map and AR locations.

### `scavenger-hunt-location.ts`

Defines the scavenger hunt location entity, including geofencing and UI elements.

- **Properties**: `threshold`, `displayName`, `spaceName`, `thumbnailImage`
- **Visuals**: Configures POI rings and spheres with customizable colors.

### `scavenger-hunt-poi.ts`

Manages POI discs, transitioning from spheres to rotating markers when the player is nearby.

- **State Machine**:
  - `sphere` (default): Displays as a small floating sphere.
  - `disc`: Expands into a rotating POI marker when within range.
  - **Triggers**: `geofence-entered`, `geofence-exited`

### `world-map.ts`

Configures the 3D world map, supporting both **GPS-based movement** and **WASD debugging controls**.

- Enables **fog effects** and **custom map themes**.
- Supports **manual movement** in debug mode.

### `world-map-camera-controls.ts`

Enables interactive camera rotation on the world map.

- Handles **touch-based rotation**.
- Applies easing for smooth transitions.

### `world-map-ui.ts`

Manages UI updates when approaching POIs.

- Displays the **location name** and **"Start AR" button** when near a VPS Location.
- Listens for `geofence-entered` and `geofence-exited` events.

## **How It Works**

1. Players navigate the world map, where POIs appear as spheres.
2. Upon approaching a POI, the sphere transforms into a rotating disc with a thumbnail image.
3. A UI overlay appears, displaying the location name and a **"Start AR" button**.
4. Clicking the button transitions the player into the location's custom VPS experience.
5. In the AR experience, animations interact with real-world objects using the VPS location mesh.

## **Development & Debugging**

- **WASD Debug Mode**: Allows desktop movement testing without GPS.
- **Simulator Support**: Test VPS locations and interactions in Niantic Studio’s built-in Simulator.
- **Logging & Event Tracking**: Uses Niantic Studio’s ECS-based event system to track player interactions.
