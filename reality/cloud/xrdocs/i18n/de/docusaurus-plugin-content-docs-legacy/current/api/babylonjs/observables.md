# BabylonJS Observables

## Bild Ziel Observables {#image-target-observables}

**onXrImageLoadingObservable**: Wird ausgelöst, wenn das Laden des Erkennungsbildes beginnt.

`onXrImageLoadingObservable : { imageTargets: {name, type, metadata} }`

**onXrImageScanningObservable**: Wird ausgelöst, wenn alle Erkennungsbilder geladen wurden und das Scannen begonnen hat.

`onXrImageScanningObservable : { imageTargets: {Name, Typ, Metadaten, Geometrie} }`

**onXrImageFoundObservable**: Wird ausgelöst, wenn ein Bildziel zum ersten Mal gefunden wird.

onXrImageFoundObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }\\`

**onXrImageUpdatedObservable**: Wird ausgelöst, wenn ein Bildziel seine Position, Drehung oder Skalierung ändert.

onXrImageUpdatedObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }\\`

**onXrImageLostObservable**: Wird ausgelöst, wenn ein Bildziel nicht mehr verfolgt wird.

onXrImageLostObservable : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }\\`

## Gesichtseffekte Observables {#face-effects-observables}

**onFaceLoadingObservable**: Wird ausgelöst, wenn der Ladevorgang für zusätzliche Face-AR-Ressourcen beginnt.

`onFaceLoadingObservable : {maxDetections, pointsPerDetection, indices, uvs}`

**onFaceScanningObservable**: Wird ausgelöst, wenn alle Gesichts-AR-Ressourcen geladen wurden und das Scannen begonnen hat.

`onFaceScanningObservable: {maxDetections, pointsPerDetection, indices, uvs}`

**onFaceFoundObservable**: Wird ausgelöst, wenn ein Gesicht zum ersten Mal gefunden wird.

`onFaceFoundObservable : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**onFaceUpdatedObservable**: Wird ausgelöst, wenn ein Gesicht nachträglich gefunden wird.

`onFaceUpdatedObservable : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}`

**onFaceLostObservable**: Wird ausgelöst, wenn ein Gesicht nicht mehr verfolgt wird.

`onFaceLostObservable : {id}`

**onMouthOpenedObservable**:  Wird ausgelöst, wenn sich der Mund eines verfolgten Gesichts öffnet.

`onMouthOpenedObservable : {id}`

**onMouthClosedObservable**: Wird ausgelöst, wenn sich der Mund eines verfolgten Gesichts schließt.

`onMouthClosedObservable : {id}`

**onLeftEyeOpenedObservable**: Wird ausgelöst, wenn das linke Auge eines verfolgten Gesichts geöffnet wird.

`onLeftEyeOpenedObservable : {id}`

**onLeftEyeClosedObservable**: Wird ausgelöst, wenn das linke Auge eines verfolgten Gesichts geschlossen wird.

`onLeftEyeClosedObservable : {id}`

**onRightEyeOpenedObservable**: Wird ausgelöst, wenn das rechte Auge eines verfolgten Gesichts geöffnet wird

`onRightEyeOpenedObservable : {id}`

**onRightEyeClosedObservable**: Wird ausgelöst, wenn das rechte Auge eines verfolgten Gesichts geschlossen wird.

`onRightEyeClosedObservable : {id}`

**onLeftEyebrowRaisedObservable**: Wird ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts gegenüber der Ausgangsposition beim Auffinden des Gesichts angehoben wird.

`onLeftEyebrowRaisedObservable : {id}`

**onLeftEyebrowLoweredObservable**: Wird ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts auf ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.

`onLeftEyebrowLoweredObservable : {id}`

**onRightEyebrowRaisedObservable**: Wird ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts von ihrer Position beim Auffinden des Gesichts angehoben wird.

`onRightEyebrowRaisedObservable : {id}`

**onRightEyebrowLoweredObservable**: Wird ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts auf ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.

`onRightEyebrowLoweredObservable : {id}`

**onLeftEyeWinkedObservable**: Wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das rechte Auge offen bleibt.

`onLeftEyeWinkedObservable : {id}`

**onRightEyeWinkedObservable**: Wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das linke Auge offen bleibt.

`onRightEyeWinkedObservable : {id}`

**onBlinkedObservable**: Wird ausgelöst, wenn die Augen eines verfolgten Gesichts blinzeln.

`onBlinkedObservable : {id}`

**beiInterPupillaryDistanceObservable**: Wird ausgelöst, wenn der Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen eines verfolgten Gesichts zum ersten Mal erkannt wird.

`onInterPupillaryDistanceObservable : {id, interpupillaryDistance}`

#### Bildziel Beispiel {#image-target-example}

```javascript
scene.onXrImageUpdatedObservable.add(e => {
  target.position.copyFrom(e.position)
  target.rotationQuaternion.copyFrom(e.rotation)
  target.scaling.set(e.scale, e.scale, e.scale)
})
```

#### Gesichtseffekte Beispiel {#face-effects-example}

```javascript
// Dies wird aufgerufen, wenn das Gesicht zum ersten Mal gefunden wird.  Es liefert die statischen Informationen über das
// Gesicht wie die UVs und Indizes
scene.onFaceLoadingObservable.add((event) => {
  const {indices, maxDetections, pointsPerDetection, uvs} = event

  // Babylon erwartet, dass alle Vertex-Daten eine flache Liste von Zahlen sind
  facePoints = Array(pointsPerDetection)
  for (let i = 0; i < pointsPerDetection; i++) {
    const facePoint = BABYLON.MeshBuilder.CreateBox("box", {size: 0.02}, scene)
    facePoint.material = material
    facePoint.parent = faceMesh
    facePoints[i] = facePoint
  }
})

// Dies wird jedes Mal aufgerufen, wenn das Gesicht aktualisiert wird, was auf einer Per-Frame-Basis geschieht
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
