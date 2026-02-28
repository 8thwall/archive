---
sidebar_position: 4
---

# Eventos de seguimiento de manos de PlayCanvas

Los eventos de Hand Tracking se pueden escuchar como `this.app.on(event, handler, this)`.

**xr:handloading**: Se dispara cuando comienza la carga para obtener recursos adicionales de AR manual.

\`xr:handloading : {maxDetections, pointsPerDetection, rightIndices, leftIndices}\`\`

**xr:handscanning**: Se activa cuando se han cargado todos los recursos hand AR y ha comenzado la exploración.

\`xr:handscanning: {maxDetections, pointsPerDetection, rightIndices, leftIndices}\`\`

**xr:manoencontrada**: Se activa cuando se encuentra una mano por primera vez.

\`xr:handfound : {id, transform, attachmentPoints, vertices, normals, handKind}\`\`

**xr:manoactualizada**: Se activa cuando se encuentra una mano.

\`xr:handupdated : {id, transform, attachmentPoints, vertices, normals, handKind}\`\`

**xr:handlost**: Se dispara cuando una mano deja de ser rastreada.

`xr:handlost : {id}`

## Ejemplo {#example}

```javascript
  let mesh = null

  // Se dispara cuando comienza la carga de recursos adicionales de face AR.
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

  // Fires when a hand is subsequently found.
  this.app.on('xr:handupdated', ({id, transform, attachmentPoints, vertices, normals, handKind}) => {
    const {position, rotation, scale, scaledDepth, scaledHeight, scaledWidth} = transform

    this.entity.setPosition(position.x, position.y, position.z);
    this.entity.setLocalScale(scale, scale, scale)
    this.entity.setRotation(rotation.x, rotation.y, rotation.z, rotation.w)

    // Establece los vértices de la malla en el espacio local
    mesh.setPositions(vertices.map((vertexPos) => [vertexPos.x, vertexPos.y, vertexPos.z]).flat())
    // Establece las normales de los vértices
    mesh.setNormals(normals.map((normal) => [normal.x, normal.y, normal.z]).flat())
    mesh.update()
  }, {})
```
