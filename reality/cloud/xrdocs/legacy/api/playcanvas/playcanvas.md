# XR8.PlayCanvas

PlayCanvas (<https://www.playcanvas.com/>) is an open-source 3D game engine/interactive 3D
application engine alongside a proprietary cloud-hosted creation platform that allows for
simultaneous editing from multiple computers via a browser-based interface.

## Description {#description}

Provides an integration that interfaces with the PlayCanvas environment and lifecycle to drive the
PlayCanvas camera to do virtual overlays.

## Functions {#functions}

Function | Description
-------- | -----------
[run](run.md) | Opens the camera with the specified Pipeline Modules and starts running in a PlayCanvas scene.
[runXr (deprecated)](runxr.md) | Opens the camera and starts running World Tracking and/or Image Tracking in a PlayCanvas scene.
[runFaceEffects (deprecated)](runfaceeffects.md) | Opens the camera and starts running Face Effects in a PlayCanvas scene.
[stop](stop.md) | Remove the modules added in [run](run.md) and stop the camera.
[stopXr (deprecated)](stopxr.md) | Remove the modules added in [runXr](runxr.md) and stop the camera.
[stopFaceEffects (deprecated)](stopfaceeffects.md) | Remove the modules added in [runFaceEffects](runfaceeffects.md) and stop the camera.
