# Studio: VPS Bespoke (Location Specific Animations)

This example project demonstrates a bespoke VPS experience using a VPS location. The project showcases how to create location-specific animations with mesh occlusion effects.

![](https://i.giphy.com/media/L05xhp8eZbRYMpr94Y/giphy.gif)

## Overview + Features

This project demonstrates:
- Location-specific VPS animation
- Mesh occlusion 

## Project Elements

### Location
- Uses any VPS-activated location (California Park Sign in this example)
- Includes hider-mesh for occlusion
- Custom animated floating objects

### Animation Workflow
This project showcases how to create location-aware animations using 3D modeling software (like Blender):
- Import your VPS mesh into Blender (Or other 3D software) Make sure to NOT change pivot point of mesh
- Use the mesh as reference/collision for your animations
- Create any type of animation (physics simulations, keyframe animations, particle effects, etc.)
- Bake your animations
- Export .glb/.glTF file format for use in Studio

![](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXdlbXVoZnBzbzkwOTBmZjB4N2VzYWIwNGdsYThmeTcwcGdkcDlhbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UUPNFBiqLBvZs4vFRm/giphy.gif)

## Setup

1. Add VPS Location:
   - Open Geospatial Browser (map icon in Viewport)
   - Select your desired VPS-activated location
   - Add to your project


2. Setup Hider Material:
   - Select your VPS location in the hierarchy
   - In the Inspector, find and click "Download GLB"
   - Add the downloaded .glb as a child of the VPS location in your scene
   - Set the material type on the mesh to "hider"
   - This mesh will now occlude animated elements behind real-world mesh


3. Enable VPS (Default settings in this sample project):
   - Select Camera in Scene Hierarchy
   - Set Camera Type to "World"
   - Check "Enable VPS" in settings

## Testing in Simulator

1. Press Play to open Simulator
2. Select your VPS Location from simulator options
3. Click "Location Found" event in the Manual Events panel to start the animation
4. Navigate using:
   - WASD: Movement controls
   - Mouse: Camera control

For detailed information about VPS development in Studio, please refer to the [official documentation](https://www.8thwall.com/docs/studio/guides/xr/vps/).