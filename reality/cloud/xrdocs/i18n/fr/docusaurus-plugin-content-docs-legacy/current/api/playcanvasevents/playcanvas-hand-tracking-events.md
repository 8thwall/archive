---
sidebar_position: 4
---

# Événements de suivi des mains PlayCanvas

Les événements de suivi des mains peuvent être écoutés comme `this.app.on(event, handler, this)`.

**xr:handloading** : Se déclenche lorsque le chargement commence pour les ressources supplémentaires de l'AR manuel.

`xr:handloading : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

**xr:handscanning** : Se déclenche lorsque toutes les ressources AR de la main ont été chargées et que le balayage a commencé.

`xr:handscanning : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

**xr:handfound** : Se déclenche lorsqu'une main est trouvée pour la première fois.

`xr:handfound : {id, transform, attachmentPoints, vertices, normals, handKind}`

**xr:handupdated** : Se déclenche lorsqu'une main est trouvée ultérieurement.

`xr:handupdated : {id, transform, attachmentPoints, vertices, normals, handKind}`

**xr:handlost** : Se déclenche lorsqu'une main n'est plus suivie.

`xr:handlost : {id}`

## Exemple {#example}

```javascript
  let mesh = null

  // Se déclenche au début du chargement des ressources AR de face supplémentaires.
  this.app.on('xr:handloading', ({maxDetections, pointsPerDetection, indices, uvs}) => {
    const node = new pc.GraphNode() ;
    const material = this.material.resource ;
    mesh = pc.createMesh(
      this.app.graphicsDevice,
      new Array(pointsPerDetection * 3).fill(0.0), // setting filler vertex positions
      {
        uvs : uvs.map((uv) => [uv.u, uv.v]).flat(),
        indices : indices.map((i) => [i.a, i.b, i.c]).flat()
      }
    ) ;

    const meshInstance = new pc.MeshInstance(node, mesh, material) ;
    const model = new pc.Model() ;
    model.graph = node ;
    model.meshInstances.push(meshInstance) ;
    this.entity.model.model = model ;
  }, {})

  // Se déclenche lorsqu'une main est trouvée ultérieurement.
  this.app.on('xr:handupdated', ({id, transform, attachmentPoints, vertices, normals, handKind}) => {
    const {position, rotation, scale, scaledDepth, scaledHeight, scaledWidth} = transform

    this.entity.setPosition(position.x, position.y, position.z) ;
    this.entity.setLocalScale(scale, scale, scale)
    this.entity.setRotation(rotation.x, rotation.y, rotation.z, rotation.w)

    // Fixe les sommets du maillage dans l'espace local
    mesh.setPositions(vertices.map((vertexPos) => [vertexPos.x, vertexPos.y, vertexPos.z]).flat())
    // Fixe les normales des vertex
    mesh.setNormals(normals.map((normal) => [normal.x, normal.y, normal.z]).flat())
    mesh.update()
  }, {})
```
