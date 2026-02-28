---
sidebar_label: runFaceEffects() (deprecated)
---
# XR8.PlayCanvas.runFaceEffects() (deprecated)

`XR8.PlayCanvas.runFaceEffects( {pcCamera, pcApp}, [extraModules], config )`

## Description {#description}

Opens the camera and starts running XR World Tracking and/or Image Targets in a PlayCanvas scene.

## Parameters {#parameters}

Parameter | Description
--------- | -----------
pcCamera  | The PlayCanvas scene camera to drive with AR.
pcApp     | The PlayCanvas app, typically `this.app`.
extraModules [Optional] | An optional array of extra pipeline modules to install.
config | Configuration parameters to pass to [`XR8.run()`](/legacy/api/xr8/run)

`config` is an object with the following properties:

Property | Type | Default | Description
-------- | ---- | ------- | -----------
canvas | [`HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/legacy/api/HTMLCanvasElement) |  | The HTML Canvas that the camera feed will be drawn to. Typically this is 'application-canvas'.
webgl2 [Optional] | `Boolean` | `false` | If true, use WebGL2 if available, otherwise fallback to WebGL1.  If false, always use WebGL1.
ownRunLoop [Optional] | `Boolean` | `false` | If true, XR should use it's own run loop.  If false, you will provide your own run loop and be responsible for calling [`XR8.runPreRender()`](/legacy/api/xr8/runprerender) and [`XR8.runPostRender()`](/legacy/api/xr8/runpostrender) yourself [Advanced Users only]
cameraConfig: {direction} [Optional] | `Object` | `{direction: XR8.XrConfig.camera().BACK}` | Desired camera to use. Supported values for `direction` are `XR8.XrConfig.camera().BACK` or `XR8.XrConfig.camera().FRONT`
glContextConfig [Optional] | `WebGLContextAttributes` | `null` | The attributes to configure the WebGL canvas context.
allowedDevices [Optional] | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE` | Specify the class of devices that the pipeline should run on.  If the current device is not in that class, running will fail prior  prior to opening the camera. If allowedDevices is `XR8.XrConfig.device().ANY`, always open the camera. Note that world tracking can only be used with `XR8.XrConfig.device().MOBILE`.

## Returns {#returns}

None
