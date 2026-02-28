# Observables BabylonJS

## Imagen Objetivo Observables {#image-target-observables}

**onXrImageLoadingObservable**: Se activa cuando comienza la carga de la imagen de detección.

`onXrImageLoadingObservable : { imageTargets: {name, type, metadata} }`

**onXrImageScanningObservable**: Se dispara cuando se han cargado todas las imágenes de detección y se ha iniciado la exploración.

`onXrImageScanningObservable : { imageTargets: {nombre, tipo, metadatos, geometría} }`

**onXrImageFoundObservable**: Se dispara cuando se encuentra por primera vez un objetivo de imagen.

`onXrImageFoundObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

**onXrImageUpdatedObservable**: Se dispara cuando un objetivo de imagen cambia de posición, rotación o escala.

`onXrImageUpdatedObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

**onXrImageLostObservable**: Se dispara cuando un objetivo de imagen ya no está siendo rastreado.

`onXrImageLostObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

## Efectos faciales Observables {#face-effects-observables}

**onFaceLoadingObservable**: Se dispara cuando comienza la carga de recursos adicionales de cara AR.

`onFaceLoadingObservable : {maxDetections, pointsPerDetection, indices, uvs}`

**onFaceScanningObservable**: Se dispara cuando se han cargado todos los recursos de face AR y ha comenzado el escaneo.

\`onFaceScanningObservable: {maxDetections, pointsPerDetection, indices, uvs}\`\`

**onFaceFoundObservable**: Se activa cuando se encuentra una cara por primera vez.

`onFaceFoundObservable : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**onFaceUpdatedObservable**: Se activa cuando se encuentra una cara.

\`onFaceUpdatedObservable : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}\`\`

**onFaceLostObservable**: Se dispara cuando una cara deja de ser rastreada.

`onFaceLostObservable : {id}`

**onMouthOpenedObservable**:  Se dispara cuando se abre la boca de una cara rastreada.

`onMouthOpenedObservable : {id}`

**onMouthClosedObservable**: Se dispara cuando se cierra la boca de una cara rastreada.

`onMouthClosedObservable : {id}`

**onLeftEyeOpenedObservable**: Se activa cuando se abre el ojo izquierdo de una cara rastreada.

`onLeftEyeOpenedObservable : {id}`

**onLeftEyeClosedObservable**: Se activa cuando se cierra el ojo izquierdo de una cara rastreada.

`onLeftEyeClosedObservable : {id}`

**onRightEyeOpenedObservable**: Se dispara cuando se abre el ojo derecho de una cara rastreada

`onRightEyeOpenedObservable : {id}`

**onRightEyeClosedObservable**: Se activa cuando se cierra el ojo derecho de una cara rastreada.

`onRightEyeClosedObservable : {id}`

**onLeftEyebrowRaisedObservable**: Se activa cuando la ceja izquierda de una cara rastreada se levanta de su posición inicial cuando se encontró la cara.

`onLeftEyebrowRaisedObservable : {id}`

**onLeftEyebrowLoweredObservable**: Se dispara cuando la ceja izquierda de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`onLeftEyebrowLoweredObservable : {id}`

**onRightEyebrowRaisedObservable**: Se activa cuando la ceja derecha de una cara rastreada se levanta de su posición cuando se encontró la cara.

`onRightEyebrowRaisedObservable : {id}`

**onRightEyebrowLoweredObservable**: Se dispara cuando la ceja derecha de una cara rastreada se baja a su posición inicial cuando se encontró la cara.

`onRightEyebrowLoweredObservable : {id}`

**onLeftEyeWinkedObservable**: Se activa cuando el ojo izquierdo de una cara rastreada se cierra y se abre en un plazo de 750 ms mientras el ojo derecho permanece abierto.

`onLeftEyeWinkedObservable : {id}`

**onRightEyeWinkedObservable**: Se activa cuando el ojo derecho de un rostro rastreado se cierra y se abre en un plazo de 750 ms mientras el ojo izquierdo permanece abierto.

`onRightEyeWinkedObservable : {id}`

**onBlinkedObservable**: Se activa cuando los ojos de una cara rastreada parpadean.

`onBlinkedObservable : {id}`

**onInterPupillaryDistanceObservable**: Se dispara cuando se detecta por primera vez la distancia en milímetros entre los centros de cada pupila de una cara rastreada.

`onInterPupillaryDistanceObservable : {id, interpupillaryDistance}`

#### Ejemplo de objetivo de imagen {#image-target-example}

```javascript
scene.onXrImageUpdatedObservable.add(e => {
  target.position.copyFrom(e.position)
  target.rotationQuaternion.copyFrom(e.rotation)
  target.scaling.set(e.scale, e.scale, e.scale)
})
```

#### Efectos faciales Ejemplo {#face-effects-example}

```javascript
// Es llamado cuando la cara es encontrada por primera vez.  Proporciona la información estática sobre la
// cara como los UVs y los índices
scene.onFaceLoadingObservable.add((event) => {
  const {indices, maxDetections, pointsPerDetection, uvs} = event

  // Babylon espera que todos los datos de vértices sean una lista plana de números
  facePoints = Array(pointsPerDetection)
  for (let i = 0; i < pointsPerDetection; i++) {
    const facePoint = BABYLON.MeshBuilder.CreateBox("box", {size: 0.02}, scene)
    facePoint.material = material
    facePoint.parent = faceMesh
    facePoints[i] = facePoint
  }
})

// esto se llama cada vez que se actualiza la cara, que es por fotograma
scene.onFaceUpdatedObservable.add((event) => {
  const {vertices, normals, transform} = event;
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
