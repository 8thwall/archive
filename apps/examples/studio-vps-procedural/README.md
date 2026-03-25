# Studio: VPS Procedural Mesh

This example project demonstrates how to work with VPS (Visual Positioning System) meshes in Niantic Studio, helping developers understand how VPS locations work through real-time visualization and mesh detection.

![](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTdtb3BqcTQ4M2NjZDlpZm8zbmcxNTNtdjBjcTQ4eG1nbnYwem9hYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pXewTCmyyMPU8vFaXN/giphy-downsized-large.gif)

## Overview + Features

Learn how to integrate VPS locations in your projects:
- Add and detect VPS-activated locations
- Handle VPS mesh and location events
- Understand mesh positioning and tracking
- Visualize meshes with interactive shader

## VPS Location Events

The project uses key events to handle different stages of VPS location detection and tracking:

### Location Events:
- `reality.locationscanning`: Fires when scanning for available VPS locations
- `reality.locationfound`: Fires when a VPS location is first detected
- `reality.locationupdated`: Fires when a location's position or rotation changes
- `reality.locationlost`: Fires when tracking of a location is lost

### Mesh Events:
- `reality.meshfound`: Fires when a VPS mesh is first detected, providing mesh geometry and positioning data
- `reality.meshlost`: Fires when mesh tracking is lost or reset

These events allow you to:
- Know when VPS locations are detected
- Track changes in location position and orientation
- Handle mesh geometry for visualization or interaction
- Respond to tracking status changes

## Setup

1. Add VPS Location:
   - Open Geospatial Browser (map icon in topleft of Viewport)
   - Select and add a VPS-activated location ('add location')

2. Enable VPS (default setting for this sample project):
   - Select Camera in Scene Hierarchy
   - Set Camera Type to "World"
   - Check "Enable VPS" in settings

3. Add Shader Component to VPS Entity
   - New Component --> colrful-vps-mesh-shader

## Testing in Simulator

1. Press Build to save changes 
2. Press Play to open Simulator
3. Select your Project Location from environment options
4. Use Manual Events to trigger "Mesh Found"
5. Colorful Wireframe Mesh shade will appear
6. Navigate using:
   - WASD: Movement controls
   - Mouse: Camera control

## Visualization Component

This project includes a visualization component to help understand VPS meshes. You can add your VPS mesh to 
your project via the geospatial browser and then add this component to it. 

New Component --> colrful-vps-mesh-shader

### colorful-vps-mesh-shader

A component that provides visual feedback for VPS meshes.

#### Schema:
- wireframeColor: Controls the color of the mesh wireframe
- animationSpeed: Determines the speed of the wave animation
- opacity: Sets the transparency of the shader effect
- waveScale: Controls the scale of the wave pattern

#### Data:
- time: Tracks the animation time for wave effects

You can test in real-time via a mobile device by scanning the QR code when clicking "connected device" at a public wayspot or via a test scan. 

For detailed information about VPS development in Studio, please refer to the [official documentation](https://www.8thwall.com/docs/studio/guides/xr/vps/).