---
sidebar_label: pipelineModule()
---
# XR8.XrController.pipelineModule()

`XR8.XrController.pipelineModule()`

## Description {#description}

Creates a camera pipeline module that, when installed, receives callbacks on when the camera has started, camera proessing events, and other state changes. These are used to calculate the camera's position.

## Parameters {#parameters}

None

## Returns {#returns}

Return value is an object made available to [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) as:

`processCpuResult.reality: { rotation, position, intrinsics, trackingStatus, trackingReason, worldPoints, realityTexture, lighting }`

Property  | Type | Description
--------- | ---- | -----------
rotation | `{w, x, y, z}` | The orientation (quaternion) of the camera in the scene.
position | `{x, y, z}` | The position of the camera in the scene.
intrinsics | `[Number]` | A 16 dimensional column-major 4x4 projection matrix that gives the scene camera the same field of view as the rendered camera feed.
trackingStatus | `String` | One of `'LIMITED'` or `'NORMAL'`.
trackingReason | `String` | One of `'UNSPECIFIED'` or`'INITIALIZING'`.
worldPoints | `[{id, confidence, position: {x, y, z}}]` | An array of detected points in the world at their location in the scene. Only filled if `XrController` is configured to return world points and `trackingReason != 'INITIALIZING'`.
realityTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | The texture containing camera feed data.
lighting | `{exposure, temperature}` | Exposure of the lighting in your environment. Note: `temperature` has not yet been implemented.

## Dispatched Events {#dispatched-events}

**trackingStatus**: Fires when `XrController` starts and tracking status or reason changes.

`reality.trackingstatus : { status, reason }`

Property  | Type | Description
--------- | ---- | -----------
status | `String` | One of `'LIMITED'` or `'NORMAL'`.
reason | `String` | One of `'INITIALIZING'` or `'UNDEFINED'`.

**imageloading**: Fires when detection image loading begins.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

Property  | Type | Description
--------- | ---- | -----------
name | `String` | The image's name.
type | `String` | One of `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.
metadata | `Object` | User metadata.

**imagescanning**: Fires when all detection images have been loaded and scanning has begun.

`imagescanning.detail : { imageTargets: {name, type, metadata, geometry} }`

Property  | Type | Description
--------- | ---- | -----------
name | `String` | The image's name.
type | `String` | One of `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.
metadata | `Object` | User metadata.
geometry | `Object` | Object containing geometry data. If type=FLAT: `{scaledWidth, scaledHeight}`, else if type=CYLINDRICAL or type=CONICAL: `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}`

If type = `FLAT`, geometry:

Property  | Type | Description
--------- | ---- | -----------
scaledWidth | `Number` | The width of the image in the scene, when multiplied by scale.
scaledHeight | `Number` | The height of the image in the scene, when multiplied by scale.

If type= `CYLINDRICAL` or `CONICAL`, geometry:

Property  | Type | Description
--------- | ---- | -----------
height | `Number` | Height of the curved target.
radiusTop | `Number` | Radius of the curved target at the top.
radiusBottom | `Number` | Radius of the curved target at the bottom.
arcStartRadians | `Number` | Starting angle in radians.
arcLengthRadians | `Number` | Central angle in radians.

**imagefound**: Fires when an image target is first found.

`imagefound.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

Property  | Type | Description
--------- | ---- | -----------
name | `String` | The image's name.
type | `Number` | One of `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`
position | `{x, y, z}` | The 3d position of the located image.
rotation | `{w, x, y, z}` | The 3d local orientation of the located image.
scale | `Number` | A scale factor that should be applied to object attached to this image.

If type = `FLAT`:

Property  | Type | Description
--------- | ---- | -----------
scaledWidth | `Number` | The width of the image in the scene, when multiplied by scale.
scaledHeight | `Number` | The height of the image in the scene, when multiplied by scale.

If type= `CYLINDRICAL` or `CONICAL`:

Property  | Type | Description
--------- | ---- | -----------
height | `Number` | Height of the curved target.
radiusTop | `Number` | Radius of the curved target at the top.
radiusBottom | `Number` | Radius of the curved target at the bottom.
arcStartRadians | `Number` | Starting angle in radians.
arcLengthRadians | `Number` | Central angle in radians.

**imageupdated**: Fires when an image target changes position, rotation or scale.

`imageupdated.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

Property  | Type | Description
--------- | ---- | -----------
name | `String` | The image's name.
type | `Number` | One of `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`
position | `{x, y, z}` | The 3d position of the located image.
rotation | `{w, x, y, z}` | The 3d local orientation of the located image.
scale | `Number` | A scale factor that should be applied to object attached to this image.

If type = `FLAT`:

Property  | Type | Description
--------- | ---- | -----------
scaledWidth | `Number` | The width of the image in the scene, when multiplied by scale.
scaledHeight | `Number` | The height of the image in the scene, when multiplied by scale.

If type= `CYLINDRICAL` or `CONICAL`:

Property  | Type | Description
--------- | ---- | -----------
height | `Number` | Height of the curved target.
radiusTop | `Number` | Radius of the curved target at the top.
radiusBottom | `Number` | Radius of the curved target at the bottom.
arcStartRadians | `Number` | Starting angle in radians.
arcLengthRadians | `Number` | Central angle in radians.

**imagelost**: Fires when an image target is no longer being tracked.

`imagelost.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

Property  | Type | Description
--------- | ---- | -----------
name | `String` | The image's name.
type | `Number` | One of `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`
position | `{x, y, z}` | The 3d position of the located image.
rotation | `{w, x, y, z}` | The 3d local orientation of the located image.
scale | `Number` | A scale factor that should be applied to object attached to this image.

If type = `FLAT`:

Property  | Type | Description
--------- | ---- | -----------
scaledWidth | `Number` | The width of the image in the scene, when multiplied by scale.
scaledHeight | `Number` | The height of the image in the scene, when multiplied by scale.

If type= `CYLINDRICAL` or `CONICAL`:

Property  | Type | Description
--------- | ---- | -----------
height | `Number` | Height of the curved target.
radiusTop | `Number` | Radius of the curved target at the top.
radiusBottom | `Number` | Radius of the curved target at the bottom.
arcStartRadians | `Number` | Starting angle in radians.
arcLengthRadians | `Number` | Central angle in radians.

**meshfound**: Fires when a mesh is first found either after start or after a recenter().

`xrmeshfound.detail : { id, position, rotation, geometry }`

Property  | Type | Description
--------- | ---- | -----------
id | `String` | An id for this mesh that is stable within a session
position | `{x, y, z}` | The 3d position of the located mesh.
rotation | `{w, x, y, z}` | The 3d local orientation (quaternion) of the located mesh.
geometry | `{index, attributes}` | An object containing raw mesh geometry data. Attributes contain position and color attributes.

`geometry` is an object with the following properties:

Property  | Type | Description
--------- | ---- | -----------
index | `Uint32Array` | The vertices of the mesh where 3 contiguous vertices make up a triangle.
attributes | `[{name: 'position', array: Float32Array(), itemSize: 3}, {name: 'color', array: Float32Array(), itemSize: 3}]` | The raw mesh geometry data.

**meshupdated**: Fires when a the **first** mesh we found changes position or rotation.

`meshupdated.detail : { id, position, rotation }`

Property  | Type | Description
--------- | ---- | -----------
id | `String` | An id for this mesh that is stable within a session
position | `{x, y, z}` | The 3d position of the located mesh.
rotation | `{w, x, y, z}` | The 3d local orientation (quaternion) of the located mesh.

**meshlost**: Fires when recenter is called.

`xrmeshlost.detail : { id }`

Property  | Type | Description
--------- | ---- | -----------
id | `String` | An id for this mesh that is stable within a session

**projectwayspotscanning**: Fires when all Project Locations have been loaded for scanning.

`projectwayspotscanning.detail : { wayspots: [] }`

Property  | Type | Description
--------- | ---- | -----------
wayspots | `[Object]` | An array objects containing Location information.

`wayspots` is an array of objects with the following properties:

Property  | Type | Description
--------- | ---- | -----------
id | `String` | An id for this Project Location that is stable within a session
name | `String` | Project Location name.
imageUrl | `String` | URL to a representative image for this Project Location.
title | `String` | Project Location title.
lat | `Number` | Latitude of this Project Location.
lng | `Number` | Longitude of this Project Location.

**projectwayspotfound**: Fires when a Project Location is first found.

`projectwayspotfound.detail : { name, position, rotation }`

Property  | Type | Description
--------- | ---- | -----------
name | `String` | The Project Location name.
position | `{x, y, z}` | The 3d position of the located Project Location.
rotation | `{w, x, y, z}` | The 3d local orientation (quaternion) of the located Project Location.

**projectwayspotupdated**: Fires when a Project Location changes position or rotation.

`projectwayspotupdated.detail : { name, position, rotation }`

Property  | Type | Description
--------- | ---- | -----------
name | `String` | The Project Location name.
position | `{x, y, z}` | The 3d position of the located Project Location.
rotation | `{w, x, y, z}` | The 3d local orientation (quaternion) of the located Project Location.

**projectwayspotlost**: Fires when a Project Location is no longer being tracked.

`projectwayspotlost.detail : { name, position, rotation }`

Property  | Type | Description
--------- | ---- | -----------
name | `String` | The Project Location name.
position | `{x, y, z}` | The 3d position of the located Project Location.
rotation | `{w, x, y, z}` | The 3d local orientation (quaternion) of the located Project Location.

## Example - adding pipeline module {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())
```

## Example - dispatched events {#example---dispatched-events}

```javascript
const logEvent = ({name, detail}) => {
  console.log(`Handling event ${name}, got detail, ${JSON.stringify(detail)}`)
}

XR8.addCameraPipelineModule({
  name: 'eventlogger',
  listeners: [
    {event: 'reality.imageloading', process: logEvent},
    {event: 'reality.imagescanning', process: logEvent},
    {event: 'reality.imagefound', process: logEvent},
    {event: 'reality.imageupdated', process: logEvent},
    {event: 'reality.imagelost', process: logEvent},
  ],
})
```
