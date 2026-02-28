---
sidebar_position: 3
---

# Eventos de efectos faciales de PlayCanvas

Los eventos de Face Effects pueden escucharse como `this.app.on(event, handler, this)`.

**xr:carga de caras**: Se activa cuando comienza la carga de recursos adicionales de face AR.

\`xr:faceloading : {maxDetections, pointsPerDetection, indices, uvs}\`\`

**xr:facescanning**: Se activa cuando se han cargado todos los recursos de RA de caras y ha comenzado el escaneo.

\`xr:facescanning: {maxDetections, pointsPerDetection, indices, uvs}\`\`

**xr:caraencontrada**: Se activa cuando se encuentra una cara por primera vez.

\`xr:facefound : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}\`\`

**xr:faceupdated**: Se activa cuando se encuentra una cara.

\`xr:faceupdated : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}\`\`

**xr:facelost**: Se activa cuando una cara deja de ser rastreada.

`xr:facelost : {id}`

**xr:bocaabierta**:  Se dispara cuando la boca de una cara rastreada se abre.

`xr:mouthopened : {id}`

**xr:bocacerrada**: Se dispara cuando se cierra la boca de una cara rastreada.

`xr:mouthclosed : {id}`

**xr:ojoizquierdoabierto**: Se dispara cuando se abre el ojo izquierdo de una cara rastreada.

`xr:lefteyeopened : {id}`

**xr:ojoizquierdocerrado**: Se dispara cuando se cierra el ojo izquierdo de una cara rastreada.

`xr:lefteyeclosed : {id}`

**xr:ojoderechoabierto**: Se dispara cuando se abre el ojo derecho de una cara rastreada

`xr:righteyeopened : {id}`

**xr:ojoderechocerrado**: Se dispara cuando se cierra el ojo derecho de una cara rastreada.

`xr:rightteyeclosed : {id}`

**xr:cejaizquierdaelevada**: Se activa cuando la ceja izquierda de una cara rastreada se levanta de su posición inicial cuando se encontró la cara.

`xr:lefteyebrowraised : {id}`

**xr:lefteyebrowlowered**: Se dispara cuando la ceja izquierda de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`xr:lefteyebrowlowered : {id}`

**xr:cejaderechaelevada**: Se dispara cuando la ceja derecha de una cara rastreada se levanta de su posición cuando se encontró la cara.

`xr:righteyebrowraised : {id}`

**xr:cejaderechabajada**: Se dispara cuando la ceja derecha de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`xr:righteyebrowlowered : {id}`

**xr:lefteyewinked**: Se dispara cuando el ojo izquierdo de una cara rastreada se cierra y se abre en 750 ms mientras el ojo derecho permanece abierto.

`xr:lefteyewinked : {id}`

**xr:righteyewinked**: Se dispara cuando el ojo derecho de una cara rastreada se cierra y se abre en 750 ms mientras el ojo izquierdo permanece abierto.

`xr:righteyewinked : {id}`

**xr:parpadeo**: Se dispara cuando los ojos de una cara rastreada parpadean.

`xr:blinked : {id}`

**xr:distancia interpupilar**: Se dispara cuando se detecta por primera vez la distancia en milímetros entre los centros de cada pupila de una cara rastreada.

`xr:interpupillarydistance : {id, interpupillaryDistance}`

## Ejemplo {#example}

```javascript
  let mesh = null
  
  // Se dispara cuando comienza la carga de recursos adicionales de face AR.
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
