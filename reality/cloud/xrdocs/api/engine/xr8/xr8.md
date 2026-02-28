# XR8

## Description {#description}

Entry point for 8th Wall's Javascript API

## Functions {#functions}

Function | Description
-------- | -----------
[addCameraPipelineModule](addcamerapipelinemodule.md) | Adds a module to the camera pipeline that will receive event callbacks for each stage in the camera pipeline.
[addCameraPipelineModules](addcamerapipelinemodules.md) | Add multiple camera pipeline modules. This is a convenience method that calls [addCameraPipelineModule](addcamerapipelinemodule.md) in order on each element of the input array.
[clearCameraPipelineModules](clearcamerapipelinemodules.md) | Remove all camera pipeline modules from the camera loop.
[initialize](initialize.md) | Returns a promise that is fulfilled when the AR Engine's WebAssembly is initialized.
[isInitialized](isinitialized.md) | Indicates whether or not the AR Engine's WebAssembly is initialized.
[isPaused](ispaused.md) | Indicates whether or not the XR session is paused.
[pause](pause.md) | Pause the current XR session.  While paused, the camera feed is stopped and device motion is not tracked.
[resume](resume.md) | Resume the current XR session.
[removeCameraPipelineModule](removecamerapipelinemodule.md) | Removes a module from the camera pipeline.
[removeCameraPipelineModules](removecamerapipelinemodules.md) | Remove multiple camera pipeline modules. This is a convenience method that calls [removeCameraPipelineModule](removecamerapipelinemodule.md) in order on each element of the input array.
[requiredPermissions](requiredpermissions.md) | Return a list of permissions required by the application.
run | Open the camera and start running the camera run loop.
[runPreRender](runprerender.md) | Executes all lifecycle updates that should happen before rendering.
[runPostRender](runpostrender.md) | Executes all lifecycle updates that should happen after rendering.
[stop](stop.md) | Stop the current XR session.  While stopped, the camera feed is closed and device motion is not tracked.
[version](version.md) | Get the 8th Wall Web engine version.

## Events {#events}

Event Emitted | Description
------------- | -----------
xrloaded | This event is emitted once `XR8` has loaded.

<!-- ## Modules {#modules}

Module | Description
-------- | -----------
[CameraPixelArray](../camerapixelarray/camerapixelarray.md) | Provides a camera pipeline module that gives access to camera data as a grayscale or color uint8 array.
[CanvasScreenshot](../canvasscreenshot/canvasscreenshot.md) | Provides a camera pipeline module that can generate screenshots of the current scene.
[Vps](../vps/vps.md) | Utilities to talk to Vps services.
[XrDevice](../xrdevice/xrdevice.md) | Provides information about device compatibility and characteristics.
[XrPermissions](../xrpermissions/xrpermissions.md) | Utilities for specifying permissions required by a pipeline module. -->
