---
sidebar_position: 3
---

# Eventos de efectos faciales de PlayCanvas

Los eventos de efectos faciales pueden escucharse como `this.app.on(event, handler, this)`.

**xr:faceloading**: Se dispara cuando comienza la carga de recursos AR de caras adicionales.

`xr:faceloading : {maxDetections, pointsPerDetection, indices, uvs}`

**xr:facefound**: Se activa cuando se han cargado todos los recursos de AR de caras y ha comenzado el escaneado.

`xr:facescanning: {maxDetections, pointsPerDetection, indices, uvs}`

**xr:facefound**: Se activa cuando se encuentra una cara por primera vez.

`xr:facefound : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**xr:faceupdated**: Se activa cuando se encuentra una cara.

`xr:faceupdated : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**xr:facelost**: Se activa cuando se deja de seguir una cara.

`xr:facelost : {id}`

**xr:mouthopened**:  Se dispara cuando se abre la boca de una cara rastreada.

`xr:mouthopened : {id}`

**xr:mouthclosed**: Se dispara cuando se cierra la boca de una cara rastreada.

`xr:mouthclosed : {id}`

**xr:lefteyeopened**: Se dispara cuando se abre el ojo izquierdo de una cara rastreada.

`xr:lefteyeopened : {id}`

**xr:lefteyeclosed**: Se activa cuando se cierra el ojo izquierdo de una cara rastreada.

`xr:lefteyeclosed : {id}`

**xr:righteyeopened**: Se dispara cuando se abre el ojo derecho de una cara rastreada

`xr:righteyeopened : {id}`

**xr:righteyeclosed**: Se activa cuando se cierra el ojo derecho de una cara rastreada.

`xr:righteyeclosed : {id}`

**xr:lefteyebrowraised**: Se dispara cuando la ceja izquierda de una cara rastreada se levanta respecto a su posición inicial cuando se encontró la cara.

`xr:lefteyebrowraised : {id}`

**xr:lefteyebrowlowered**: Se dispara cuando la ceja izquierda de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`xr:lefteyebrowlowered : {id}`

**xr:righteyebrowraised**: Se dispara cuando la ceja derecha de una cara rastreada se levanta respecto a su posición cuando se encontró la cara.

`xr:righteyebrowraised : {id}`

**xr:righteyebrowlowered**: Se dispara cuando la ceja derecha de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`xr:righteyebrowlowered : {id}`

**xr:lefteyewinked**: Se activa cuando el ojo izquierdo de una cara rastreada se cierra y se abre en un plazo de 750 ms, mientras que el ojo derecho permanece abierto.

`xr:lefteyewinked : {id}`

**xr:righteyewinked**: Se activa cuando el ojo derecho de una cara rastreada se cierra y se abre en un plazo de 750 ms, mientras que el ojo izquierdo permanece abierto.

`xr:rightteyewinked : {id}`

**xr:blinked**: Se dispara cuando parpadean los ojos de una cara rastreada.

`xr:blinked : {id}`

**xr:interpupillarydistance**: Se dispara cuando se detecta por primera vez la distancia en milímetros entre los centros de cada pupila de una cara rastreada.

`xr:interpupillarydistance : {id, interpupillaryDistance}`

## Ejemplo {#example}

```javascript
  let mesh = null

  // Se dispara cuando comienza la carga de recursos AR de caras adicionales.
  this.app.on('xr:faceloading', ({maxDetections, pointsPerDetection, indices, uvs}) => {
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

  // Se activa cuando se encuentra una cara.
  this.app.on('xr:faceupdated', ({id, transform, attachmentPoints, vertices, normals}) => {
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
