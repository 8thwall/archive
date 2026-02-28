# XR8.AFrame

A-Frame (<https://aframe.io>) is a web framework designed for building virtual reality experiences.
By adding 8th Wall Web to your A-Frame project, you can now easily build **augmented reality**
experiences for the web.

## Adding 8th Wall Web to A-Frame {#adding-8th-wall-web-to-a-frame}

#### Cloud Editor {#cloud-editor}

1. Simply add a "meta" tag in head.html to include the "8-Frame" library in your project. If you are cloning from any of 8th Wall's A-Frame based templates or self-hosted projects, it will already be there.  Also, there is no need to manually add your AppKey.

`<meta name="8thwall:renderer" content="aframe:1.4.1">`

#### Self Hosted {#self-hosted}

8th Wall Web can be added to your A-Frame project in a few easy steps:

1. Include a slightly modified version of A-Frame (referred to as "8-Frame") which fixes some polish concerns:

`<script src="//cdn.8thwall.com/web/aframe/8frame-1.4.1.min.js"></script>`

2. Add the following script tag to the HEAD of your page. Replace the X's with your app key:

`<script src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>`

## Configuring the Camera: `xrconfig` {#configuring-the-camera}

To configure the camera feed, add the `xrconfig` component to your `a-scene`:

`<a-scene xrconfig>`

#### xrconfig Attributes (all optional) {#xrconfig-attributes}

Component | Type | Default | Description
--------- | ---- | ------- | -----------
cameraDirection | `String` | `'back'` | Desired camera to use. Choose from: `back` or `front`. Use `cameraDirection: front;` with `mirroredDisplay: true;` for selfie mode. Note that world tracking is only supported with `cameraDirection: back;`.`
allowedDevices | `String` | `'mobile-and-headsets'` | Supported device classes. Choose from: `'mobile-and-headsets'` , `'mobile'` or `'any'`. Use `'any'` to enable laptop or desktop-type devices with built-in or attached webcams. Note that world tracking is only supported on `'mobile-and-headsets'` or `mobile`.
mirroredDisplay | `Boolean` | `false` | If true, flip left and right in the output geometry and reverse the direction of the camera feed. Use `'mirroredDisplay: true;'` with `'cameraDirection: front;'` for selfie mode. Should not be enabled if World Tracking (SLAM) is enabled.
disableXrTablet | `Boolean` | `false` | Disable the tablet visible in immersive sessions.
xrTabletStartsMinimized | `Boolean` | `false` | The tablet will start minimized.
disableDefaultEnvironment | `Boolean` | `false` | Disable the default "void space" background.
disableDesktopCameraControls | `Boolean` | `false` | Disable WASD and mouse look for camera.
disableDesktopTouchEmulation | `Boolean` | `false` | Disable desktop fake touches.
disableXrTouchEmulation | `Boolean` | `false` | Don’t emit touch events based on controller raycasts with the scene.
disableCameraReparenting | `Boolean` | `false` | Disable camera -> controller object move
defaultEnvironmentFloorScale | `Number` | `1` | Shrink or grow the floor texture.
defaultEnvironmentFloorTexture | Asset | | Specify an alternative texture asset or URL for the tiled floor.
defaultEnvironmentFloorColor | Hex Color | `#1A1C2A` | Set the floor color.
defaultEnvironmentFogIntensity | `Number` | `1` | Increase or decrease fog density.
defaultEnvironmentSkyTopColor | Hex Color | `#BDC0D6` | Set the color of the sky directly above the user.
defaultEnvironmentSkyBottomColor | Hex Color | `#1A1C2A` | Set the color of the sky at the horizon.
defaultEnvironmentSkyGradientStrength | `Number` | `1` | Control how sharply the sky gradient transitions.

Notes:

* `cameraDirection`: When using `xrweb` to provide world tracking (SLAM), only the `back` camera is
supported. If you are using the `front` camera, you must disable world tracking by setting
`disableWorldTracking: true` on `xrweb`.

## World Tracking, Image Targets, and/or Lightship VPS: `xrweb` {#world-tracking-image-targets-andor-lightship-vps}

If you want World Tracking Image Targets, or Lightship VPS, add the `xrweb` component to your `a-scene`:

`<a-scene xrconfig xrweb>`

#### xrweb Attributes (all optional) {#xrweb-attributes}

Component | Type | Default | Description
--------- | ---- | ------- | -----------
scale | `String` | `'responsive'` | Either `'responsive'` or `'absolute'`. `'responsive'` will return values so that the camera on frame 1 is at the origin defined via [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix). `'absolute'` will return the camera, image targets, etc in meters. The default is `'responsive'`. When using `'absolute'` the x-position, z-position, and rotation of the starting pose will respect the parameters set in [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix) once scale has been estimated. The y-position will depend on the camera's physical height from the ground plane.
disableWorldTracking | `Boolean` | `false` | If true, turn off SLAM tracking for efficiency.
enableVps | `Boolean` | `false` | If true, look for Project Locations and a mesh. The mesh that is returned has no relation to Project Locations and will be returned even if no Project Locations are configured. Enabling VPS overrides settings for `scale` and `disableWorldTracking`.
projectWayspots | `Array` | `[]` | Comma separated strings of Project Location names to exclusively localize against. If unset or an empty string is passed, we will localize all nearby Project Locations.

Notes:

* `xrweb` and `xrface` cannot be used at the same time.
* `xrweb` and `xrlayers` can be used at the same time. You must use `xrconfig` when doing so.
  * Best practice is to always use `xrconfig`; however, if you use `xrweb` without `xrface` or
  `xrlayers` or `xrconfig`, then `xrconfig` will be added automatically. When that happens all
  attributes which were set on `xrweb` will be passed along to `xrconfig`.
* `cameraDirection`: World tracking (SLAM) is only supported on the `back` camera. If you are using
  the `front` camera, you must disable world tracking by setting `disableWorldTracking: true`.
* World tracking (SLAM) is only supported on mobile devices.

## Sky Effects: `xrlayers` and `xrlayerscene` {#sky-effects-xrlayers-and-xrlayerscene}

If you want Sky Effects:

1. Add the `xrlayers` component to your `a-scene`
2. Add the `xrlayerscene` component to an `a-entity` and add content you want to be in the sky under that `a-entity`.

```html
<a-scene xrconfig xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Add your Sky Effects content here. -->
  </a-entity>
</a-scene>
```

#### xrlayers Attributes {#xrlayers-attributes}

None

Notes:

* `xrlayers` and `xrface` cannot be used at the same time.
* `xrlayers` and `xrweb` can be used at the same time. You must use `xrconfig` when doing so.
  * Best practice is to always use `xrconfig`; however, if you use `xrlayers` without `xrface` or `xrweb` or `xrconfig`, then `xrconfig` will be added automatically. When that happens all attributes which were set on `xrweb` will be passed along to `xrconfig`.

#### xrlayerscene Attributes {#xrlayerscene-attributes}

Component | Type | Default | Description
--------- | ---- | ------- | -----------
name | `String` | `''` | The layer name. Should correspond to a layer from [`XR8.LayersController`](../layerscontroller/layerscontroller.md). Only supported layer at this time is `sky`.
invertLayerMask | `Boolean` | `false` | If true, content you place in your scene will occlude non-sky areas. If false, content you place in your scene will occlude sky areas.
edgeSmoothness | `Number` | `0` | Amount to smooth the edges of the layer. Valid values between 0-1.

## Face Effects: `xrface` {#face-effects}

If you want Face Effects tracking, add the `xrface` component to your `a-scene`:

`<a-scene xrconfig xrface>`

#### xrface Attributes {#xrface-attributes}

Component | Type | Default | Description
--------- | ---- | ------- | -----------
meshGeometry | `Array` | `['face']` | Comma separated strings that configures which portions of the face mesh will have returned triangle indices. Can be any combination of `'face'`, `'eyes'`, `'iris'` and/or `'mouth'`.
maxDetections [Optional] | `Number` | `1` | The maximum number of faces to detect. The available choices are 1, 2, or 3.
uvType [Optional] | `String` | `[XR8.FaceController.UvType.STANDARD]` | Specifies which uvs are returned in the facescanning and faceloading event. Options are: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`
enableEars [Optional] | `Boolean` | `false` | If true, runs ear detection simultaneosly with Face Effects and returns ear attachment points.


Notes:

* `xrface` and `xrweb` cannot be used at the same time.
* `xrface` and `xrlayers` cannot be used at the same time.
* Best practice is to always use `xrconfig`; however, if you use `xrface` without `xrconfig` then `xrconfig` will be added automatically. When that happens all attributes which were set on `xrface` will be passed along to `xrconfig`.

## Hand Tracking: `xrhand` {#hand-tracking}

If you want Hand Tracking, add the `xrhand` component to your `a-scene`:

`<a-scene xrconfig xrhand>`

#### xrhand Attributes {#xrhand-attributes}

Component | Type | Default | Description
--------- | ---- | ------- | -----------
enableWrists [Optional] | `Boolean` | `false` | If true, runs wrist detection simultaneosly with Hand Tracking and returns wrist attachment points.

None

Notes:

* `xrhand` and `xrweb` cannot be used at the same time.
* `xrhand` and `xrlayers` cannot be used at the same time.
* `xrhand` and `xrface` cannot be used at the same time.

## Functions {#functions}

Function | Description
-------- | -----------
[xrconfigComponent](xrconfigcomponent.md) | Creates an A-Frame component for configuring the camera which can be registered with `AFRAME.registerComponent()`. Generally won't need to be called directly.
[xrwebComponent](xrwebcomponent.md) | Creates an A-Frame component for World Tracking and/or Image Target tracking which can be registered with `AFRAME.registerComponent()`. Generally won't need to be called directly.
[xrlayersComponent](xrlayerscomponent.md) | Creates an A-Frame component for Layers tracking which can be registered with `AFRAME.registerComponent()`. Generally won't need to be called directly.
[xrfaceComponent](xrfacecomponent.md) | Creates an A-Frame component for Face Effects tracking which can be registered with `AFRAME.registerComponent()`. Generally won't need to be called directly.
[xrlayersceneComponent](xrlayerscenecomponent.md) | Creates an A-Frame component for a Layer scene which can be registered with `AFRAME.registerComponent()`. Generally won't need to be called directly.

#### Example - SLAM enabled (default) {#example---slam-enabled-default}

```html
<a-scene xrconfig xrweb>
```

#### Example - SLAM disabled (image tracking only) {#example---slam-disabled-image-tracking-only}

```html
<a-scene xrconfig xrweb="disableWorldTracking: true">
```

#### Example - Enable VPS {#example---enable-vps}

```html
<a-scene xrconfig xrweb="enableVps: true; projectWayspots=location1,location2,location3">
```

#### Example - Front camera (image tracking only) {#example---front-camera-image-tracking-only}

```html
<a-scene xrconfig="cameraDirection: front" xrweb="disableWorldTracking: true">
```

#### Example - Front camera Sky Effects {#example---front-camera-sky-effects}

```html
<a-scene xrconfig="cameraDirection: front" xrlayers>
```

#### Example - Sky + SLAM {#example---sky--slam}

```html
<a-scene xrconfig xrweb xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Add your Sky Effects content here. -->
  </a-entity>
</a-scene>
```

#### Example - Face Effects {#example---face-effects}

```html
<a-scene xrconfig xrface>
```

#### Example - Face Effects with Ears {#example---face-effects-ears}

```html
<a-scene xrconfig xrface="enableEars:true">
```

#### Example - Hand Tracking {#example---hand-tracking}

```html
<a-scene xrconfig xrhand>
```
