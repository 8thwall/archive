---
sidebar_position: 4
---
# PlayCanvas Hand Tracking Events

Hand Tracking events can be listened to as `this.app.on(event, handler, this)`.

**xr:handloading**: Fires when loading begins for additional hand AR resources.

`xr:handloading : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

**xr:handscanning**: Fires when all hand AR resources have been loaded and scanning has begun.

`xr:handscanning: {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

**xr:handfound**: Fires when a hand is first found.

`xr:handfound : {id, transform, attachmentPoints, vertices, normals, handKind}`

**xr:handupdated**: Fires when a hand is subsequently found.

`xr:handupdated : {id, transform, attachmentPoints, vertices, normals, handKind}`

**xr:handlost**: Fires when a hand is no longer being tracked.

`xr:handlost : {id}`

## Example {#example}

```javascript
  let mesh = null

  // Fires when loading begins for additional face AR resources.
  this.app.on('xr:handloading', ({maxDetections, pointsPerDetection, indices, uvs}) => {
    const node = new pc.GraphNode();
    const material = this.material.resource;
    mesh = pc.createMesh(
      this.app.graphicsDevice,
      new Array(pointsPerDetection * 3).fill(0.0),  // setting filler vertex positions
      {
        uvs: uvs.map((uv) => [uv.u, uv.v]).flat(),
        indices: indices.map((i) => [i.a, i.b, i.c]).flat()
      }
    );

    const meshInstance = new pc.MeshInstance(node, mesh, material);
    const model = new pc.Model();
    model.graph = node;
    model.meshInstances.push(meshInstance);
    this.entity.model.model = model;
  }, {})

  // Fires when a hand is subsequently found.
  this.app.on('xr:handupdated', ({id, transform, attachmentPoints, vertices, normals, handKind}) => {
    const {position, rotation, scale, scaledDepth, scaledHeight, scaledWidth} = transform

    this.entity.setPosition(position.x, position.y, position.z);
    this.entity.setLocalScale(scale, scale, scale)
    this.entity.setRotation(rotation.x, rotation.y, rotation.z, rotation.w)

    // Set mesh vertices in local space
    mesh.setPositions(vertices.map((vertexPos) => [vertexPos.x, vertexPos.y, vertexPos.z]).flat())
    // Set vertex normals
    mesh.setNormals(normals.map((normal) => [normal.x, normal.y, normal.z]).flat())
    mesh.update()
  }, {})
```
