# BabylonJS Observables

## Image Target Observables {#image-target-observables}

**onXrImageLoadingObservable**: Se activa cuando comienza la carga de la imagen de detección.

`onXrImageLoadingObservable : { imageTargets: {name, type, metadata} }`

**onXrImageScanningObservable**: Se activa cuando se han cargado todas las imágenes de detección y ha comenzado el escaneado.

`onXrImageScanningObservable : { imageTargets: {name, type, metadata, geometry} }`

**onXrImageFoundObservable**: Se activa cuando se encuentra por primera vez un objetivo de imagen.

`onXrImageFoundObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

**onXrImageUpdatedObservable**: Se activa cuando un objetivo de imagen cambia de posición, rotación o escala.

`onXrImageUpdatedObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

**onXrImageLostObservable**: Se activa cuando un objetivo de imagen deja de ser rastreado.

`onXrImageLostObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

## Efectos faciales observables {#face-effects-observables}

**onFaceLoadingObservable**: Se activa cuando comienza la carga de recursos adicionales de AR de caras.

`onFaceLoadingObservable : {maxDetections, pointsPerDetection, indices, uvs}`

**onFaceScanningObservable**: Se activa cuando se han cargado todos los recursos de AR facial y ha comenzado la exploración.

`onEscaneoCaraObservable: {maxDetections, pointsPerDetection, indices, uvs}`

**onFaceFoundObservable**: Se activa cuando se encuentra una cara por primera vez.

`onFaceFoundObservable : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**onFaceUpdatedObservable**: Se activa cuando se encuentra una cara.

`onFaceUpdatedObservable : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**onFaceLostObservable**: Se activa cuando se deja de seguir una cara.

`onFaceLostObservable : {id}`

**onMouthOpenedObservable**:  Se activa cuando se abre la boca de una cara rastreada.

`onMouthOpenedObservable : {id}`

**onMouthClosedObservable**: Se activa cuando se cierra la boca de una cara rastreada.

`onMouthClosedObservable : {id}`

**onLeftEyeOpenedObservable**: Se activa cuando se abre el ojo izquierdo de una cara rastreada.

`onLeftEyeOpenedObservable : {id}`

**onLeftEyeClosedObservable**: Se activa cuando se cierra el ojo izquierdo de una cara rastreada.

`onLeftEyeClosedObservable : {id}`

**onRightEyeOpenedObservable**: Se activa cuando se abre el ojo derecho de una cara rastreada

`onRightEyeOpenedObservable : {id}`

**onRightEyeClosedObservable**: Se activa cuando se cierra el ojo derecho de una cara rastreada.

`onRightEyeClosedObservable : {id}`

**onLeftEyebrowRaisedObservable**: Se activa cuando la ceja izquierda de una cara rastreada se levanta de su posición inicial al encontrar la cara.

`onLeftEyebrowRaisedObservable : {id}`

**onLeftEyebrowLoweredObservable**: Se activa cuando la ceja izquierda de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`onLeftEyebrowLoweredObservable : {id}`

**onRightEyebrowRaisedObservable**: Se activa cuando la ceja derecha de una cara rastreada se levanta respecto a su posición cuando se encontró la cara.

`onRightEyebrowRaisedObservable : {id}`

**onRightEyebrowLoweredObservable**: Se activa cuando la ceja derecha de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`onRightEyebrowLoweredObservable : {id}`

**onLeftEyeWinkedObservable**: Se activa cuando el ojo izquierdo de una cara rastreada se cierra y se abre en un plazo de 750 ms, mientras que el ojo derecho permanece abierto.

`onLeftEyeWinkedObservable : {id}`

**onRightEyeWinkedObservable**: Se activa cuando el ojo derecho de una cara rastreada se cierra y se abre en un plazo de 750 ms, mientras que el ojo izquierdo permanece abierto.

`onRightEyeWinkedObservable : {id}`

**onBlinkedObservable**: Se activa cuando los ojos de una cara rastreada parpadean.

`onBlinkedObservable : {id}`

**onInterPupillaryDistanceObservable**: Se activa cuando se detecta por primera vez la distancia en milímetros entre los centros de cada pupila de una cara rastreada.

`onInterPupillaryDistanceObservable : {id, interpupillaryDistance}`


#### Ejemplo de objetivo de imagen {#image-target-example}

```javascript
scene.onXrImageUpdatedObservable.add(e => {
  target.position.copyFrom(e.position)
  target.rotationQuaternion.copyFrom(e.rotation)
  target.scaling.set(e.scale, e.scale, e.scale)
})
```

#### Ejemplo de efectos faciales {#face-effects-example}

```javascript
// se llama cuando se encuentra la cara por primera vez.  Proporciona la información estática sobre la
// cara, como las UV y los índices
scene.onFaceLoadingObservable.add((event) => {
  const {indices, maxDetections, pointsPerDetection, uvs} = event

 // Babylon espera que todos los datos de vértices sean una lista plana de números
  facePoints = Array(pointsPerDetection)
  for (let i = 0; i < pointsPerDetection; i++) {
    const facePoint = BABYLON.MeshBuilder.CreateBox("caja", {size: 0.02}, escena)
    facePoint.material = material
    facePoint.parent = faceMesh
    facePoints[i] = facePoint
 }
})

// Se llama cada vez que se actualiza la cara, lo que ocurre por fotograma
scene.onFaceUpdatedObservable.add((event) => {
  const {vertices, normals, transform} = event;
  const {scale, position, rotation} = transform

  vertices.map((v, i) => {
    facePoints[i].position.x = v.x
    facePoints[i].position.y = v.y
    facePoints[i].position.z = v.z
 })

  faceMesh.scalingDeterminant = escala
  faceMesh.position = position
  faceMesh.rotationQuaternion = rotación
})
```
