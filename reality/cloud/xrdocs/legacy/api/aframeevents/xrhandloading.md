# xrhandloading

## Description {#description}

This event is emitted by [`xrhand`](/legacy/api/aframe/#hand-tracking) when when loading begins for additional hand AR resources.

`xrhandloading.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

Property  | Description
--------- | -----------
maxDetections | The maximum number of hands that can be simultaneously processed.
pointsPerDetection | Number of vertices that will be extracted per hand.
rightIndices: [{a, b, c}] | Indexes into the vertices array that form the triangles of the hand mesh.
leftIndices: [{a, b, c}] | Indexes into the vertices array that form the triangles of the hand mesh.

## Example {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection} = detail
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection}))
}
this.el.sceneEl.addEventListener('xrhandloading', initMesh)
```
