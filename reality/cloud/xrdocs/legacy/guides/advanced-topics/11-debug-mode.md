---
id: debug-mode
---
# Debug Mode

Debug Mode is an advanced Cloud Editor feature that provides logging, performance information, and
enhanced visualizations directly on your device.

Note: Debug mode is currently not displayed when previewing experiences on head mounted devices.

#### To activate Debug Mode {#to-activate-debug-mode}

1. At the top of the Cloud Editor window, click the **Preview** button.
2. Below the QR code, toggle **Debug Mode** on.
3. Scan the QR code to preview your WebAR project with debug information superimposed over the page:

![debug1](/images/debug-mode-preview.jpg)

If you already have a device connected in the Cloud Editor console you can enable/disable Debug Mode
at any time by pressing the “Debug Mode” toggle when you have the device tab selected.

![debug2](/images/debug-mode-console.jpg)

Debug Mode Stats:

Depending on the renderer your project is using Debug Mode will display some of the following information:

![debug3](/images/debug-mode-stats.jpg)

<u>Stats Panel</u> (tap to minimize)

* fps - frames per second, framerate.
* Tris - number of triangles rendered per frame.\*
* Draw Calls - number of draw calls each frame. A draw call is a call to the graphics API to draw objects (e.g. draw a triangle).\*
* Textures - number of textures in the scene.\*
* Tex(max) - the maximum dimension of the largest texture in the scene.\*
* Shaders - number of GLSL shaders in the scene.\*
* Geometries - number of geometries in the scene.\*
* Points - number of points in the scene. Only displayed when the scene has more than 0.\*
* Entities - number of A-Frame entities in the scene.\*
* ImgTargets - number of active 8th Wall image targets in the scene.
* Models - total size in MB of all `<a-asset-items>` (only preloaded 3D models) in `<a-assets>`.\*

<u>Version Panel</u>

* Engine Version - version of the 8th Wall AR engine the experience is running.
* Renderer Version - version of renderer the experience is running.\*

<u>Tools Panel</u>

* Console - displays live console logs.
* Actions - options to reset the XR camera (XR8.recenter()), show detected surface\*, and display A-Frame inspector\*.
* Camera - displays XR camera position and rotation.
* Minimize - minimizes the tools panel.

[*] available in Cloud Editor projects using A-Frame
