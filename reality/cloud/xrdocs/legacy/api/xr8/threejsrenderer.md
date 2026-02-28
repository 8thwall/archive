---
sidebar_label: ThreejsRenderer() (deprecated)
---
# XR8.ThreejsRenderer() (deprecated)

`XR8.ThreejsRenderer()`

## Description {#description}

Returns a three.js based renderer.  It is responsible for driving the scene camera, matching the camera field of view to the AR field of view, and for calling 'render' inside the camera run loop.

If using three.js, add this as a camera pipeline module to create the three.js scene, camera, renderer, and drive the scene camera based on 6DoF camera motion.

## Parameters {#parameters}

None

## Example {#example}

```javascript
window.onload = () => {
  // xr3js owns the three.js scene, camera and renderer. It is responsible for driving the scene camera,
  // matching the camera field of view to the AR field of view, and for calling 'render' inside the
  // camera run loop.
  const xr3js = XR8.ThreejsRenderer()

  // XR controller provides 6DoF camera tracking and interfaces for configuring tracking.
  const xrController = XR8.xrController()

  // ...

  // Add the xrController module, which enables 6DoF camera motion estimation.
  XR8.addCameraPipelineModule(xrController.cameraPipelineModule())

  // Add a GLRenderer which draws the camera feed to the canvas.
  XR8.addCameraPipelineModule(XR8.GLRenderer())

  // Add xr3js which creates a threejs scene, camera, and renderer, and drives the scene camera
  // based on 6DoF camera motion.
  XR8.addCameraPipelineModule(xr3js)

  // ...
}
```
