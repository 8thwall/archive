---
sidebar_position: 3
---

# PlayCanvas Gesichtseffekte Ereignisse

Face Effects-Ereignisse können als `this.app.on(event, handler, this)` abgehört werden.

**xr:faceloading**: Wird ausgelöst, wenn der Ladevorgang für zusätzliche Face-AR-Ressourcen beginnt.

`xr:faceloading : {maxDetections, pointsPerDetection, indices, uvs}`

**xr:facescanning**: Wird ausgelöst, wenn alle Gesichts-AR-Ressourcen geladen wurden und das Scannen begonnen hat.

`xr:facescanning: {maxDetections, pointsPerDetection, indices, uvs}`

**xr:facefound**: Wird ausgelöst, wenn ein Gesicht zum ersten Mal gefunden wird.

`xr:facefound : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**xr:faceupdated**: Wird ausgelöst, wenn ein Gesicht nachträglich gefunden wird.

xr:faceupdated : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}\\`

**xr:facelost**: Wird ausgelöst, wenn ein Gesicht nicht mehr verfolgt wird.

`xr:facelost : {id}`

**xr:mouthopened**:  Wird ausgelöst, wenn sich der Mund eines verfolgten Gesichts öffnet.

`xr:mouthopened : {id}`

**xr:mouthclosed**: Wird ausgelöst, wenn sich der Mund eines verfolgten Gesichts schließt.

`xr:mouthclosed : {id}`

**xr:lefteyeopened**: Wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts öffnet.

`xr:lefteyeopened : {id}`

**xr:lefteyeclosed**: Wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts schließt.

`xr:lefteyeclosed : {id}`

**xr:righteyeopened**: Wird ausgelöst, wenn das rechte Auge eines verfolgten Gesichts geöffnet wird

`xr:righteyeopened : {id}`

**xr:righteyeclosed**: Wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts schließt.

`xr:righteyeclosed : {id}`

**xr:lefteyebrowraised**: Wird ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts gegenüber der ursprünglichen Position beim Auffinden des Gesichts angehoben wird.

`xr:lefteyebrowraised : {id}`

**xr:lefteyebrowlowered**: Wird ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts in ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.

`xr:lefteyebrowlowered : {id}`

**xr:righteyebrowraised**: Wird ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts gegenüber der Position beim Auffinden des Gesichts angehoben wird.

`xr:righteyebrowraised : {id}`

**xr:righteyebrowlowered**: Wird ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts in ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.

`xr:righteyebrowlowered : {id}`

**xr:lefteyewinked**: Wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das rechte Auge offen bleibt.

`xr:lefteyewinked : {id}`

**xr:righteyewinked**: Wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das linke Auge offen bleibt.

`xr:righteyewinked : {id}`

**xr:blinked**: Wird ausgelöst, wenn die Augen eines verfolgten Gesichts blinzeln.

`xr:blinked : {id}`

**xr:interpupillarydistance**: Wird ausgelöst, wenn der Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen eines verfolgten Gesichts zum ersten Mal erkannt wird.

`xr:interpupillarydistance : {id, interpupillaryDistance}`

## Beispiel {#example}

```javascript
  let mesh = null
  
  // Wird ausgelöst, wenn das Laden zusätzlicher AR-Ressourcen für Flächen beginnt.
  this.app.on('xr:faceloading', ({maxDetections, pointsPerDetection, indices, uvs}) => {
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
  
  // Wird ausgelöst, wenn ein Gesicht nachträglich gefunden wird.
  this.app.on('xr:faceupdated', ({id, transform, attachmentPoints, vertices, normals}) => {
    const {position, rotation, scale, scaledDepth, scaledHeight, scaledWidth} = transform
    
    this.entity.setPosition(position.x, position.y, position.z);
    this.entity.setLocalScale(scale, scale, scale)
    this.entity.setRotation(rotation.x, rotation.y, rotation.z, rotation.w)

    // Mesh-Eckpunkte im lokalen Raum setzen
    mesh.setPositions(vertices.map((vertexPos) => [vertexPos.x, vertexPos.y, vertexPos.z]).flat())
    // Vertex-Normalen setzen
    mesh.setNormals(normals.map((normal) => [normal.x, normal.y, normal.z]).flat())
    mesh.update()
  }, {})
```
