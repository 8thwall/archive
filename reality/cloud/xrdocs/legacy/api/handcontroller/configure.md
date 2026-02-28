---
sidebar_position: 1
sidebar_label: configure()
---
# XR8.HandController.configure()

`XR8.HandController.configure({ nearClip, farClip, coordinates })`

## Description {#description}

Configures what processing is performed by HandController.

## Parameters {#parameters}

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
nearClip [Optional] | `Number` | `0.01` | The distance from the camera of the near clip plane, i.e. the closest distance to the camera at which scene objects are visible.
farClip [Optional] | `Number` | `1000` | The distance from the camera of the far clip plane, i.e. the farthest distance to the camera at which scene objects are visible.
maxDetections [Optional] | `Number` | `1` | The maximum number of hands to detect. The only available option is 1.
enableWrists [Optional] | `Boolean` | `false` | If true, runs wrist detection simultaneosly with Hand Tracking and returns wrist attachment points.
coordinates [Optional] | `Coordinates` | | The camera configuration.

The `Coordinates` object has the following properties:

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
origin [Optional] | `{position: {x, y, z}, rotation: {w, x, y, z}}` | `{position: {x: 0, y: 0, z: 0}, rotation: {w: 1, x: 0, y: 0, z: 0}}` | The position and rotation of the camera.
scale [Optional] | `Number` | `1` | Scale of the scene.
axes [Optional] | `String` | `'RIGHT_HANDED'` | Can be either `'LEFT_HANDED'` or `'RIGHT_HANDED'`.
mirroredDisplay [Optional] | `Boolean` | `False` | If true, flip left and right in the output.

**IMPORTANT:** [`XR8.HandController`](./handcontroller.md) cannot be used at the same time as [`XR8.XrController`](../xrcontroller/xrcontroller.md).

## Returns {#returns}

None

## Example {#example}

```javascript
  XR8.HandController.configure({
    coordinates: {mirroredDisplay: false},
  })
```
