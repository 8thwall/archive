---
sidebar_position: 4
---

# Eventos de seguimiento de manos de PlayCanvas

Los eventos de seguimiento de manos pueden escucharse como `this.app.on(event, handler, this)`.

**xr:handloading**: se dispara cuando comienza la carga de recursos adicionales de AR manual.

`xr:handloading : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

**xr:handscanning**: se dispara cuando se han cargado todos los recursos de AR de manos y ha comenzado la exploración.

`xr:handscanning: {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

**xr:handfound**: se activa cuando se encuentra una mano por primera vez.

`xr:handfound : {id, transform, attachmentPoints, vertices, normals, handKind}`

**xr:handupdated**: se activa cuando se encuentra una mano.

`xr:handupdated : {id, transform, attachmentPoints, vertices, normals, handKind}`

**xr:handlost**: se dispara cuando una mano deja de ser rastreada.

`xr:handlost : {id}`

## Ejemplo {#example}

```javascript
  let malla = null

 // Se dispara cuando comienza la carga de recursos AR de caras adicionales.
   this.app.on('xr:handloading', ({maxDetections, pointsPerDetection, indices, uvs}) => {
    const node = new pc.GraphNode();
    const material = this.material.resource;
    mesh = pc.createMesh(
      this.app.graphicsDevice,
      new Array(pointsPerDetection * 3).fill(0.0),  // establecer posiciones de vértices de relleno
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

 // Se activa cuando se encuentra una mano.
  this.app.on('xr:handupdated', ({id, transform, attachmentPoints, vertices, normals, handKind}) => {
    const {position, rotation, scale, scaledDepth, scaledHeight, scaledWidth} = transformar

    this.entity.setPosition(posicion.x, posicion.y, posicion.z);
    this.entity.setLocalScale(escala, escala, escala)
    this.entity.setRotation(rotacion.x, rotacion.y, rotacion.z, rotacion.w)

 // Establece los vértices de la malla en el espacio local
    mesh.setPositions(vertices.map((vertexPos) => [vertexPos.x, vertexPos.y, vertexPos.z]).flat())
 // Establece las normales de los vértices
    mesh.setNormals(normals.map((normal) => [normal.x, normal.y, normal.z]).flat())
    mesh.update()
 }, {})
```
