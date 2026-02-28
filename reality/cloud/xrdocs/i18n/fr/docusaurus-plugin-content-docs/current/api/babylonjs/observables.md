# Observables BabylonJS

## Image Cible Observables {#image-target-observables}

**onXrImageLoadingObservable**: Se déclenche lorsque le chargement de l'image de détection commence.

`onXrImageLoadingObservable : { imageTargets: {name, type, metadata} }`

**onXrImageScanningObservable**: Se déclenche lorsque toutes les images de détection ont été chargées et que le scan a commencé.

`onXrImageScanningObservable : { imageTargets: {name, type, metadata, geometry} }`

**onXrImageFoundObservable**: Se déclenche lorsqu'une image cible est trouvée pour la première fois.

`onXrImageFoundObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

**onXrImageUpdatedObservable**: Se déclenche lorsqu'une image cible change de position, de rotation ou d'échelle.

`onXrImageUpdatedObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

**onXrImageLostObservable**: Se déclenche lorsqu'une image cible n'est plus suivie.

`onXrImageLostObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

## Effets sur le visage Observables {#face-effects-observables}

**onFaceLoadingObservable** : Se déclenche lorsque le chargement commence pour des ressources AR supplémentaires.

`onFaceLoadingObservable : {maxDetections, pointsPerDetection, indices, uvs}`

**onFaceScanningObservable**: Se déclenche lorsque toutes les ressources AR des visages ont été chargées et que le scan a commencé.

`onFaceScanningObservable : {maxDetections, pointsPerDetection, indices, uvs}`

**onFaceFoundObservable** : Se déclenche lorsqu'un visage est trouvé pour la première fois.

`onFaceFoundObservable : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**onFaceUpdatedObservable**: Se déclenche lorsqu'un visage est trouvé ultérieurement.

`onFaceUpdatedObservable : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**onFaceLostObservable** : Se déclenche lorsqu'un visage n'est plus suivi.

`onFaceLostObservable : {id}`

**onMouthOpenedObservable**:  Se déclenche lorsque la bouche d'un visage suivi s'ouvre.

`onMouthOpenedObservable : {id}`

**onMouthClosedObservable**: Se déclenche lorsque la bouche d'un visage suivi se ferme.

`onMouthClosedObservable : {id}`

**onLeftEyeOpenedObservable**: Se déclenche lorsque l'œil gauche d'un visage suivi s'ouvre.

`onLeftEyeOpenedObservable : {id}`

**onLeftEyeClosedObservable**: Se déclenche lorsque l'œil gauche d'un visage suivi se ferme.

`onLeftEyeClosedObservable : {id}`

**onRightEyeOpenedObservable**: Se déclenche lorsque l'oeil droit d'un visage suivi s'ouvre

`onRightEyeOpenedObservable : {id}`

**onRightEyeClosedObservable**: Se déclenche lorsque l'œil droit d'un visage suivi se ferme.

`onRightEyeClosedObservable : {id}`

**onLeftEyebrowRaisedObservable**: Se déclenche lorsque le sourcil gauche d'un visage suivi est relevé par rapport à sa position initiale lorsque le visage a été trouvé.

`onLeftEyebrowRaisedObservable : {id}`

**onLeftEyebrowLoweredObservable**: Se déclenche lorsque le sourcil gauche d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.

`onLeftEyebrowLoweredObservable : {id}`

**onRightEyebrowRaisedObservable**: Se déclenche lorsque le sourcil droit d'un visage suivi est relevé par rapport à sa position lors de la recherche du visage.

`onRightEyebrowRaisedObservable : {id}`

**onRightEyebrowLoweredObservable**: Se déclenche lorsque le sourcil droit d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.

`onRightEyebrowLoweredObservable : {id}`

**onLeftEyeWinkedObservable**: Se déclenche lorsque l'œil gauche d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil droit reste ouvert.

`onLeftEyeWinkedObservable : {id}`

**onRightEyeWinkedObservable**: Se déclenche lorsque l'œil droit d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil gauche reste ouvert.

`onRightEyeWinkedObservable : {id}`

**onBlinkedObservable** : Se déclenche lorsque les yeux d'un visage suivi clignent.

`onBlinkedObservable : {id}`

**onInterPupillaryDistanceObservable**: Se déclenche lorsque la distance en millimètres entre les centres de chaque pupille d'un visage suivi est détectée pour la première fois.

`onInterPupillaryDistanceObservable : {id, interpupillaryDistance}`


#### Exemple d’image cible {#image-target-example}

```javascript
scene.onXrImageUpdatedObservable.add(e => {
  target.position.copyFrom(e.position)
  target.rotationQuaternion.copyFrom(e.rotation)
  target.scaling.set(e.scale, e.scale, e.scale)
})
```

#### Exemple d'effets de visage {#face-effects-example}

```javascript
// Ceci est appelé lorsque le visage est trouvé pour la première fois.  Il fournit des informations statiques sur la
// face, telles que les UV et les indices
scene.onFaceLoadingObservable.add((event) => {
  const {indices, maxDetections, pointsPerDetection, uvs} = event

  // Babylon s'attend à ce que toutes les données de vertex soient une liste plate de nombres
  facePoints = Array(pointsPerDetection)
  for (let i = 0 ; i     const facePoint = BABYLON.MeshBuilder.CreateBox("box", {size: 0.02}, scene)
    facePoint.material = material
    facePoint.parent = faceMesh
    facePoints[i] = facePoint
  }
})

// ceci est appelé à chaque fois que le visage est mis à jour, ce qui se fait par image
scene.onFaceUpdatedObservable.add((event) => {
  const {vertices, normals, transform} = event ;
  const {scale, position, rotation} = transform

  vertices.map((v, i) => {
    facePoints[i].position.x = v.x
    facePoints[i].position.y = v.y
    facePoints[i].position.z = v.z
  })

  faceMesh.scalingDeterminant = scale
  faceMesh.position = position
  faceMesh.rotationQuaternion = rotation
})
```
