# BabylonJSのオブザーバブル

## イメージターゲット観測値 {#image-target-observables}

**onXrImageLoadingObservable**：検出画像のロードが開始されたときに発生します。

onXrImageLoadingObservable : { imageTargets： {name, type, metadata} }\\`

**onXrImageScanningObservable**：すべての検出画像がロードされ、スキャンが開始されたときに発生します。

onXrImageScanningObservable : { imageTargets：{名前、タイプ、メタデータ、ジオメトリ}。}\\`

**onXrImageFoundObservable**：イメージターゲットが最初に見つかったときに発生します。

onXrImageFoundObservable : { name、type、position、rotation、scale、scaledWidth、scaledHeight、height、radiusTop、radiusBottom、arcStartRadians、arcLengthRadians }\\`。

**onXrImageUpdatedObservable**：イメージターゲットの位置、回転、スケールが変更されたときに発生します。

onXrImageUpdatedObservable : { name、type、position、rotation、scale、scaledWidth、scaledHeight、height、radiusTop、radiusBottom、arcStartRadians、arcLengthRadians }\\`。

**onXrImageLostObservable**：画像ターゲットが追跡されなくなったときに発生します。

onXrImageLostObservable : { name、type、position、rotation、scale、scaledWidth、scaledHeight、height、radiusTop、radiusBottom、arcStartRadians、arcLengthRadians }\\`。

## フェイス・エフェクト Observables {#face-effects-observables}

**onFaceLoadingObservable**：追加のフェースARリソースのロードが開始されたときに発生します。

onFaceLoadingObservable : {maxDetections、pointsPerDetection、indices、uvs}\\`。

**onFaceScanningObservable**：すべての顔ARリソースがロードされ、スキャンが開始されたときに発生します。

onFaceScanningObservable：{maxDetections、pointsPerDetection、indices、uvs}\\`。

**onFaceFoundObservable**：顔が最初に見つかったときに発生します。

onFaceFoundObservable : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}\\`.

**onFaceUpdatedObservable**：その後に顔が見つかったときに発生します。

onFaceUpdatedObservable : {id, transform, attachmentPoints, vertices, normals, uvsInCameraFrame}\\`.

**onFaceLostObservable**：顔が追跡されなくなったときに発生します。

onFaceLostObservable : {id}\\`.

**onMouthOpenedObservable**：  追跡された顔の口が開いたときに発生します。

onMouthOpenedObservable : {id}\\`.

**onMouthClosedObservable**：追跡された顔の口が閉じると発火する。

onMouthClosedObservable : {id}\\`.

**onLeftEyeOpenedObservable**：追跡されている顔の左目が開いたときに発生します。

onLeftEyeOpenedObservable : {id}\\`.

**onLeftEyeClosedObservable**：追跡されている顔の左目が閉じたときに発生します。

onLeftEyeClosedObservable : {id}\\`.

**onRightEyeOpenedObservable**：追跡している顔の右目が開いたときに発火します。

onRightEyeOpenedObservable : {id}\\`.

**onRightEyeClosedObservable**：追跡している顔の右目が閉じたときに発生します。

onRightEyeClosedObservable : {id}\\`.

**onLeftEyebrowRaisedObservable**：追跡された顔の左眉が、顔が見つかったときの最初の位置から上がったときに発生します。

onLeftEyebrowRaisedObservable : {id}\\`.

**onLeftEyebrowLoweredObservable**：追跡された顔の左眉が、その顔が見つかったときの初期位置まで下がったときに発生します。

onLeftEyebrowLoweredObservable : {id}\\`.

**onRightEyebrowRaisedObservable**：追跡された顔の右眉が、その顔が見つかったときの位置から上がったときに発生します。

onRightEyebrowRaisedObservable : {id}\\`.

**onRightEyebrowLoweredObservable**：追跡された顔の右眉が、その顔が見つかったときの初期位置まで下がったときに発生します。

onRightEyebrowLoweredObservable : {id}\\`.

**onLeftEyeWinkedObservable**：追跡された顔の左目が750ms以内に閉じたり開いたりし、右目が開いているときに発火する。

onLeftEyeWinkedObservable : {id}\\`.

**onRightEyeWinkedObservable**：追跡された顔の右目が750ms以内に閉じたり開いたりしたときに発生し、左目は開いたままです。

onRightEyeWinkedObservable : {id}\\`.

**onBlinkedObservable**：追跡している顔の目がまばたきしたときに発火する。

onBlinkedObservable : {id}\\`.

**onInterPupillaryDistanceObservable**：追跡された顔の各瞳孔の中心間の距離がミリメートル単位で最初に検出されたときに発生します。

OnInterPupillaryDistanceObservable : {id, interpupillaryDistance}\\`.

#### イメージターゲット例 {#image-target-example}

```javascript
scene.onXrImageUpdatedObservable.add(e => {
  target.position.copyFrom(e.position)
  target.rotationQuaternion.copyFrom(e.rotation)
  target.scaling.set(e.scale, e.scale, e.scale)
})
```

#### フェイス・エフェクトの例 {#face-effects-example}

```javascript
// これは、顔が最初に見つかったときに呼び出されます。  これは、UVやインデックスなどの
// 顔に関する静的情報を提供します
scene.onFaceLoadingObservable.add((event) => {
  const {indices, maxDetections, pointsPerDetection, uvs} = event

  // Babylonは、すべての頂点データがフラットな数値リストであることを期待します
  facePoints = Array(pointsPerDetection)
  for (let i = 0; i < pointsPerDetection; i++) {
    const facePoint = BABYLON.MeshBuilder.CreateBox("box", {size: 0.02}, scene)
    facePoint.material = material
    facePoint.parent = faceMesh
    facePoints[i] = facePoint
  }.
})

// これは、顔がフレーム単位で更新されるたびに呼び出される
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
