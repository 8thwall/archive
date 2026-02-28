---
sidebar_position: 3
---

# Événements PlayCanvas Face Effects

Les événements d'effets de visage peuvent être écoutés comme `this.app.on(event, handler, this)`.

**xr:faceloading**: Se déclenche lorsque le chargement commence pour des ressources supplémentaires de face AR.

`xr:faceloading : {maxDetections, pointsPerDetection, indices, uvs}`

**xr:facescanning**: Se déclenche lorsque toutes les ressources AR des visages ont été chargées et que le scan a commencé.

`xr:facescanning : {maxDetections, pointsPerDetection, indices, uvs}`

**xr:facefound**: Se déclenche lorsqu'un visage est trouvé pour la première fois.

`xr:facefound : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**xr:faceupdated**: Se déclenche lorsqu'un visage est trouvé ultérieurement.

`xr:faceupdated : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**xr:facelost**: Se déclenche lorsqu'un visage n'est plus suivi.

`xr:facelost : {id}`

**xr:mouthopened**:  Se déclenche lorsque la bouche d'un visage suivi s'ouvre.

`xr:mouthopened : {id}`

**xr:mouthclosed**: Se déclenche lorsque la bouche d'un visage suivi se ferme.

`xr:mouthclosed : {id}`

**xr:lefteyeopened** : Se déclenche lorsque l'œil gauche d'un visage suivi s'ouvre.

`xr:lefteyeopened : {id}`

**xr:lefteyeclosed** : Se déclenche lorsque l'œil gauche d'un visage suivi se ferme.

`xr:leftteyeclosed : {id}`

**xr:righteyeopened**: Se déclenche lorsque l'œil droit d'un visage suivi s'ouvre

`xr:righteyeopened : {id}`

**xr:righteyeclosed**: Se déclenche lorsque l'œil droit d'un visage suivi se ferme.

`xr:righteyeclosed : {id}`

**xr:lefteyebrowraised** : Se déclenche lorsque le sourcil gauche d'un visage suivi est relevé par rapport à sa position initiale lorsque le visage a été trouvé.

`xr:sourcils gauches levés : {id}`

**xr:lefteyebrowlowered** : Se déclenche lorsque le sourcil gauche d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.

`xr:lefteyebrowlowered : {id}`

**xr:righteyebrowraised**: Se déclenche lorsque le sourcil droit d'un visage suivi est relevé par rapport à sa position lors de la recherche du visage.

`xr:righteyebrowraised : {id}`

**xr:righteyebrowlowered**: Se déclenche lorsque le sourcil droit d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.

`xr:righteyebrowlowered : {id}`

**xr:lefteyewinked** : Se déclenche lorsque l'œil gauche d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil droit reste ouvert.

`xr:lefteyewinked : {id}`

**xr:righteyewinked**: Se déclenche lorsque l'œil droit d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil gauche reste ouvert.

`xr:righteyewinked : {id}`

**xr:blinked**: Se déclenche lorsque les yeux d'un visage suivi clignotent.

`xr:blinked : {id}`

**xr:interpupillarydistance**: Se déclenche lorsque la distance en millimètres entre les centres de chaque pupille d'un visage suivi est détectée pour la première fois.

`xr:interpupillarydistance : {id, interpupillaryDistance}`

## Exemple {#example}

```javascript
  let mesh = null

  // Se déclenche lorsque le chargement commence pour les ressources supplémentaires de face AR.
  this.app.on('xr:faceloading', ({maxDetections, pointsPerDetection, indices, uvs}) => {
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

  // Se déclenche lorsqu'une face est trouvée ultérieurement.
  this.app.on('xr:faceupdated', ({id, transform, attachmentPoints, vertices, normals}) => {
    const {position, rotation, scale, scaledDepth, scaledHeight, scaledWidth} = transform

    this.entity.setPosition(position.x, position.y, position.z) ;
    this.entity.setLocalScale(scale, scale, scale)
    this.entity.setRotation(rotation.x, rotation.y, rotation.z, rotation.w)

    // Définit les vertices du maillage dans l'espace local
    mesh.setPositions(vertices.map((vertexPos) => [vertexPos.x, vertexPos.y, vertexPos.z]).flat())
    // Fixe les normales des vertex
    mesh.setNormals(normals.map((normal) => [normal.x, normal.y, normal.z]).flat())
    mesh.update()
  }, {})
```
