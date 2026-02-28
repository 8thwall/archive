---
sidebar_position: 2
sidebar_label: pipelineModule()
---
# XR8.HandController.pipelineModule()

`XR8.HandController.pipelineModule()`

## Description {#description}

Creates a camera pipeline module that, when installed, receives callbacks on when the camera has started, camera proessing events, and other state changes. These are used to calculate the camera's position.

## Parameters {#parameters}

None

## Returns {#returns}

Return value is an object made available to [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) as:

`processCpuResult.handcontroller: { rotation, position, intrinsics, cameraFeedTexture }`

Property  | Type | Description
--------- | ---- | -----------
rotation | `{w, x, y, z}` | The orientation (quaternion) of the camera in the scene.
position | `{x, y, z}` | The position of the camera in the scene.
intrinsics | `[Number]` | A 16 dimensional column-major 4x4 projection matrix that gives the scene camera the same field of view as the rendered camera feed.
cameraFeedTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | The texture containing camera feed data.

## Dispatched Events {#dispatched-events}

**handloading**: Fires when loading begins for additional hand AR resources.

`handloading.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

Property  | Type | Description
--------- | ---- | -----------
maxDetections | `Number` | The maximum number of hands that can be simultaneously processed.
pointsPerDetection | `Number` | Number of vertices that will be extracted per hand.
rightIndices | `[{a, b, c}]` | Indexes into the vertices array that form the triangles of the hand mesh.
leftIndices | `[{a, b, c}]` | Indexes into the vertices array that form the triangles of the hand mesh.

**handscanning**: Fires when all hand AR resources have been loaded and scanning has begun.

`handscanning.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

Property  | Type | Description
--------- | ---- | -----------
maxDetections | `Number` | The maximum number of hands that can be simultaneously processed.
pointsPerDetection | `Number` | Number of vertices that will be extracted per hand.
rightIndices | `[{a, b, c}]` | Indexes into the vertices array that form the triangles of the hand mesh.
leftIndices | `[{a, b, c}]` | Indexes into the vertices array that form the triangles of the hand mesh.

**handfound**: Fires when a hand is first found.

`handfound.detail : {id, transform, vertices, normals, attachmentPoints}`

Property  | Type | Description
--------- | ---- | -----------
id | `Number` | A numerical id of the located hand.
transform | `{position, rotation, scale}` | Transform information of the located hand.
vertices | `[{x, y, z}]` | Position of hand points, relative to transform.
normals | `[{x, y, z}]` | Normal direction of vertices, relative to transform.
handKind | `Number` | A numerical representation of the handedness of the located hand. Valid values are 0 (unspecified), 1 (left), and 2 (right).
attachmentPoints | `{name, position: {x,y,z}}` | See [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) for list of available attachment points. `position` is relative to the transform.

`transform` is an object with the following properties:

Property  | Type | Description
--------- | ---- | -----------
position | `{x, y, z}` | The 3d position of the located hand.
rotation | `{w, x, y, z}` | The 3d local orientation of the located hand.
scale | `Number` | A scale factor that should be applied to objects attached to this hand.

`attachmentPoints` is an object with the following properties:

Property  | Type | Description
--------- | ---- | -----------
name | `String` | The name of the attachment point. See [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) for list of available attachment points.
position | `{x, y, z}` | The 3d position of the attachment point on the located hand.
rotation | `{w, x, y, z}` | The rotation quaternion that rotates positive-Y vector to the attachment point bone vector.
innerPoint | `{x, y, z}` | The inner point of an attachment point. (ex. hand palm side)
outerPoint | `{x, y, z}` | The outer point of an attachment point. (ex. hand backside)
radius | `Number` | The radius of finger attachment points.
minorRadius | `Number` | The shortest radius from hand surface to the wrist attachment point.
majorRadius | `Number` | The longest radius from hand surface to the wrist attachment point.

**handupdated**: Fires when a hand is subsequently found.

`handupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

Property  | Type | Description
--------- | ---- | -----------
id | `Number` | A numerical id of the located hand.
transform | `{position, rotation, scale}` | Transform information of the located hand.
vertices | `[{x, y, z}]` | Position of hand points, relative to transform.
normals | `[{x, y, z}]` | Normal direction of vertices, relative to transform.
handKind | `Number` | A numerical representation of the handedness of the located hand. Valid values are 0 (unspecified), 1 (left), and 2 (right).
attachmentPoints | `{name, position: {x,y,z}}` | See [`XR8.HandController.AttachmentPoints`](attachmentpoints.md) for list of available attachment points. `position` is relative to the transform.

`transform` is an object with the following properties:

Property  | Type | Description
--------- | ---- | -----------
position | `{x, y, z}` | The 3d position of the located hand.
rotation | `{w, x, y, z}` | The 3d local orientation of the located hand.
scale | `Number` | A scale factor that should be applied to objects attached to this hand.

**handlost**: Fires when a hand is no longer being tracked.

`handlost.detail : { id }`

Property  | Type | Description
--------- | ---- | -----------
id | `Number` | A numerical id of the located hand.


## Example - adding pipeline module {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.HandController.pipelineModule())
```
