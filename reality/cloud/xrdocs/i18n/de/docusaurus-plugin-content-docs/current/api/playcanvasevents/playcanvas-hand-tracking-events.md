---
sidebar_position: 4
---

# PlayCanvas Handverfolgung Ereignisse

Handverfolgung-Ereignisse können als `this.app.on(event, handler, this)` abgehört werden.

**xr:handloading**: Wird ausgelöst, wenn der Ladevorgang für zusätzliche Hand-AR-Ressourcen beginnt.

`xr:handloading : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

**xr:handscanning**: Wird ausgelöst, wenn alle Hand-AR-Ressourcen geladen wurden und das Scannen begonnen hat.

`xr:handscanning: {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

**xr:handfound**: Wird ausgelöst, wenn eine Hand zum ersten Mal gefunden wird.

`xr:handfound : {id, transform, attachmentPoints, vertices, normals, handKind}`

**xr:handupdated**: Wird ausgelöst, wenn eine Hand nachträglich gefunden wird.

`xr:handupdated : {id, transform, attachmentPoints, vertices, normals, handKind}`

**xr:handlost**: Wird ausgelöst, wenn eine Hand nicht mehr geortet wird.

`xr:handlost : {id}`

## Beispiel {#example}

```javascript
  let mesh = null

  // Wird ausgelöst, wenn der Ladevorgang für zusätzliche Gesichtseffekt-AR-Ressourcen beginnt.
  this.app.on('xr:handloading', ({maxDetections, pointsPerDetection, indices, uvs}) => {
    const node = new pc.GraphNode();
    const material = this.material.resource;
    mesh = pc.createMesh(
      this.app.graphicsDevice,
      new Array(pointsPerDetection * 3).fill(0.0), // setting filler vertex positions
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

  // Wird ausgelöst, wenn anschließend eine Hand gefunden wird.
  this.app.on('xr:handupdated', ({id, transform, attachmentPoints, vertices, normals, handKind}) => {
    const {position, rotation, scale, scaledDepth, scaledHeight, scaledWidth} = transform

    this.entity.setPosition(position.x, position.y, position.z);
    this.entity.setLocalScale(scale, scale, scale)
    this.entity.setRotation(rotation.x, rotation.y, rotation.z, rotation.w)

    // Mesh-Eckpunkte im lokalen Raum setzen
    mesh.setPositions(vertices.map((vertexPos) => [vertexPos.x, vertexPos.y, vertexPos.z]).flat())
    // Scheitelpunktnormalen festlegen
    mesh.setNormals(normals.map((normal) => [normal.x, normal.y, normal.z]).flat())
    mesh.update()
  }, {})
```
