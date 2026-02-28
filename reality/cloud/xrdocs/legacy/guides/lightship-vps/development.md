---
sidebar_label: Development
sidebar_position: 4
---

# Developing VPS Experiences

## Enabling Lightship VPS {#enabling-lightship-vps}

To enable VPS in your WebAR project, you'll need to set `enableVPS` to `true`.

For A-Frame projects, set `enableVps: true` on the `xrweb` component on the `<a-scene>`

For Non-AFrame projects, set `enableVps: true` in the call to `XR8.XrController.configure()` prior
to engine start.

#### Example - AFrame {#example---aframe}

```html
<a-scene
  coaching-overlay
  landing-page
  xrextras-loading
  xrextras-runtime-error
  ...
  xrweb="enableVps: true;">
```

#### Example - Non-AFrame {#example---non-aframe}

```javascript
XR8.XrController.configure({enableVps: true})
// Then, start the 8th Wall engine
```

## Developing Bespoke VPS Experiences

Bespoke VPS scenes are designed for a single Location and utilize a reference mesh from the Geospatial Browser to align AR content.

Part 1: Add Location to scene

1. Open the Geospatial Browser (map icon 🗺 on the left)
2. Find a VPS-activated Location (or [nominate/activate your own](https://www.8thwall.com/docs/web/#scanning-wayspots))
3. Add the Location to the project
 
![](https://static.8thwall.app/assets/geospatial-browser-jmcd7ic3ob.png)

Part 2: Use Location GLB as reference for custom AR animation

4. Download the reference GLB from the right side of the row.
5. Use this in your 3D modeling software (Blender, Maya, A-Frame, etc) to position AR content relative to the mesh origin.

![](https://i.giphy.com/media/dOFnRHGzZghGjecdeq/giphy.gif)

*IMPORTANT*: The origin of this 3D model is the origin of the Location. DO NOT RESET THE ORIGIN OR YOUR CONTENT WILL NOT BE ALIGNED.

*OPTIONALLY*: If the mesh downloaded from the Geospatial Browser is not high enough quality to use for a baked animation, physics, or occluder material,
you might consider taking a scan using a third-party application like Scaniverse and aligning that high-quality mesh with the one downloaded from the
Geospatial Browser.

6. Import animation GLB into Cloud Editor and add to scene
7. Add the named-location component to your asset's `<a-entity>`. The 'name' attribute refers to the Project Location's `name` from the Geospatial Browser.

Ta-da! 🪄 Your animation should appear aligned to the Location in the real world.

Part 3: Adding occlusion and shadows

1. In your scene, add `<a-entity named-location="name: LOCATIONNAME"><a-entity>`
2. Add three `<a-entity>` inside this element as its children. These will be your occluder mesh, shadow mesh and VPS animation.
3. In the first `<a-entity>`, add `xrextras-hider-material` and `gltf-model="#vps-mesh"`. "`#vps-mesh`" should refer
to a version of your reference GLB that has had its textures removed and geometry decimated.
4. In the second `<a-entity>`, add `shadow-shader`, `gltf-model="#vps-mesh"`, and `shadow="cast: false"`. 
The shadow shader applies a shadow material to the reference mesh with a polygon offset to prevent Z-fighting. 
You can choose whether you want the vps-mesh to cast a shadow on the real world with `shadow="cast: true"`.
5. In the third `<a-entity>`, add `gltf-model="#vps-anim"`, `reflections="type: realtime"`, `play-vps-animation` and `shadow="receive:false"`. 
`play-vps-animation` waits until the `vps-coaching-overlay` has disappeared before playing the VPS animation.

### *Remote Desktop Development Setup* 

![](https://i.giphy.com/media/cBr0UnA7jjqAzAOGTi/giphy.gif)

It is often helpful to use the A-Frame inspector to position content remotely on your desktop. 
To set up this project's scene for remote desktop development, disable the following components 
by adding a letter to the beginning (i.e. "Znamed-location"):

- `xrweb` -> `Zxrweb`
- `xrextras-loading` -> `Zxrextras-loading`
- `named-location` -> `Znamed-location`
- `xrextras-hider-material` -> `Zxrextras-hider-material`

Now you can open the [A-Frame Inspector](https://aframe.io/docs/1.3.0/introduction/visual-inspector-and-dev-tools.html)
(Mac: ctrl + opt + i, PC: ctrl + alt + i) and position content relative to the VPS mesh imported from the Geospatial Browser.
Remember: this is an *inspector*. You will need to copy the transform values back into your code.

Optionally, you can temporarily reposition the `<a-entity named-location>` to the center of the scene
to assist with iteration speed. NOTE: reset `<a-entity named-location>` to `position="0 0 0"` to ensure VPS
content is aligned correctly.

### *Remote Mobile Development Setup* 

![](https://i.giphy.com/media/ZVQCdOhIHx10Dsrxnf/giphy.gif)

It is often helpful to use the A-Frame inspector to simulate VPS remotely on your mobile device. 
To set up this project's scene for remote mobile development, disable the following components 
by adding a letter to the beginning (i.e. "Znamed-location"):

- `named-location` -> `Znamed-location`
- `xrextras-hider-material` -> `Zxrextras-hider-material`

Next, you'll need to disable VPS and enable absolute scale. This will ensure the reference mesh
is sized correctly for accurate simulation:

`xrweb="enableVps: false; scale: absolute;"`

You should temporarily reposition the `<a-entity named-location>` to the center of the scene
to assist with iteration speed. Try to align the base of your reference mesh with `y="0"` (the ground).
NOTE: Before deploying your VPS project, reset `<a-entity named-location>` to `position="0 0 0"` 
to ensure VPS content is aligned correctly.

## Developing Procedural VPS Experiences

Procedural VPS scenes are designed to use any detected Location (as opposed to specific Project Locations). Once detected, the Location's mesh 
is available to you to generate procedurally-generated VPS experiences.

There are two procedural-related events emitted by the 8th Wall engine:
- [xrmeshfound](https://www.8thwall.com/docs/web/#xrmeshfound): emitted when a mesh is first found either after start or after a recenter()
- [xrmeshlost](https://www.8thwall.com/docs/web/#xrmeshlost): emitted when recenter() is called.

After a mesh is detected, the 8th Wall engine will continue to track against that mesh until recenter() is called.