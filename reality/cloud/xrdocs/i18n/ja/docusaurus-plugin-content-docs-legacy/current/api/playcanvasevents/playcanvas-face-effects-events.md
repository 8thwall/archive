---
sidebar_position: 3
---

# PlayCanvas フェイス・エフェクト・イベント

Face Effectsのイベントは、`this.app.on(event, handler, this)`としてリッスンできる。

**xr:faceloading**：追加の顔ARリソースのロードが開始されたときに発生します。

xr:faceloading : {maxDetections、pointsPerDetection、indices、uvs}\\`。

**xr:facescanning**：すべての顔ARリソースがロードされ、スキャンが開始されたときに発生します。

xr:facescanning：{maxDetections, pointsPerDetection, indices, uvs}\\`.

**xr:facefound**：顔が最初に見つかったときに発生します。

xr:facefound : {id、transform、attachmentPoints、vertices、normals、uvsInCameraFrame}\\`。

**xr:faceupdated**：その後、顔が見つかったときに発生します。

xr:faceupdated : {id、transform、attachmentPoints、vertices、normals、uvsInCameraFrame}\\`。

**xr:facelost**：顔が追跡されなくなったときに発生します。

`xr:facelost : {id}`.

**xr:mouthopened**：  追跡された顔の口が開いたときに発火する。

xr:mouthopened : {id}\\`.

**xr:mouthclosed**：追跡された顔の口が閉じると発火する。

xr:mouthclosed : {id}\\`.

**xr:lefteyeopened**：追跡されている顔の左目が開いたときに発火する。

xr:lefteyeopened : {id}\\`.

**xr:lefteyeclosed**：追跡された顔の左目が閉じたときに発火する。

xr:leftteyeclosed : {id}\\`.

**xr:righteyeopened**：追跡された顔の右目が開いたときに発火する

xr:righteyeopened : {id}\\`.

**xr:righteyeclosed**：追跡された顔の右目が閉じたときに発火する。

xr:righteyeclosed : {id}\\`.

**xr:lefteyebrowraised**：追跡された顔の左眉が、顔が見つかったときの最初の位置から上がったときに発生します。

xr:lefteyebrowraised : {id}\\`.

**xr:lefteyebrowlowered**：追跡された顔の左眉が、その顔が見つかったときの最初の位置まで下がったときに発生します。

xr:lefteyebrowlowered : {id}\\`.

**xr:righteyebrowraised**：追跡された顔の右眉が、その顔が見つかったときの位置から上がっているときに発生します。

xr:righteyebrowraised : {id}\\`.

**xr:righteyebrowlowered**：追跡された顔の右眉が、その顔が見つかったときの最初の位置まで下がったときに発生します。

xr:righteyebrowlowered : {id}\\`.

**xr:lefteyewinked**：追跡された顔の左目が750ms以内に閉じたり開いたりし、右目が開いたままのときに発火する。

xr:lefteyewinked : {id}\\`.

**xr:righteyewinked**：追跡された顔の右目が750ms以内に閉じたり開いたりしたときに発火し、左目は開いたままである。

xr:righteyewinked : {id}\\`.

**xr:blinked**：追跡中の顔の目がまばたきしたときに発火する。

xr:blinked : {id}\\`.

**xr:interpupillarydistance**：追跡された顔の各瞳孔の中心間の距離がミリメートル単位で最初に検出されたときに発火します。

xr:interpupillarydistance : {id, interpupillaryDistance}\\`.

## 例 {#example}

```javascript
  let mesh = null
  
  // 追加のフェースARリソースのローディング開始時に発生。
  this.app.on('xr:faceloading', ({maxDetections, pointsPerDetection, indices, uvs}) => {
    const node = new pc.GraphNode();
    const material = this.material.resource;
    mesh = pc.createMesh(
      this.app.graphicsDevice,
      new Array(pointsPerDetection * 3).fill(0.0), // フィラー頂点位置の設定
      {
        uvs: uvs.map((uv) => [uv.u, uv.v]).flat(),
        indices: indices.map((i) => [i.a, i.b, i.c]).flat()
      }.
    );

    const meshInstance = new pc.MeshInstance(node, mesh, material);
    const model = new pc.Model();
    model.graph = node;
    model.meshInstances.push(meshInstance);
    this.entity.model.model = model;
  }, {})
  
  // その後に顔が見つかったときに発生
  this.app.on('xr:faceupdated', ({id, transform, attachmentPoints, vertices, normals}) => {
    const {position, rotation, scale, scaledDepth, scaledHeight, scaledWidth} = transform
    
    this.entity.setPosition(position.x, position.y, position.z);
    this.entity.setLocalScale(scale, scale, scale)
    this.entity.setRotation(rotation.x, rotation.y, rotation.z, rotation.w)

    // ローカル空間にメッシュの頂点を設定
    mesh.setPositions(vertices.map((vertexPos) => [vertexPos.x, vertexPos.y, vertexPos.z]).flat())
    // 頂点の法線を設定
    mesh.setNormals(normals.map((normal) => [normal.x, normal.y, normal.z]).flat())
    mesh.update()
  }, {})
```
