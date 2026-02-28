---
sidebar_position: 4
---

# PlayCanvas ハンドトラッキング イベント

ハンドトラッキングのイベントは、`this.app.on(event, handler, this)`としてリッスンすることができます。

**xr:ハンドローディング**：ハンドARリソースを追加するため、ロード開始時に発火します。

xr:handloading : {maxDetections, pointsPerDetection, rightIndices, leftIndices}\\`.

**xr:handscanning**：すべてのハンドARリソースがロードされ、スキャンが開始されたときに発生します。

xr:ハンドスキャン{maxDetections, pointsPerDetection, rightIndices, leftIndices}\\`.

**xr:handfound**：ハンドが最初に見つかったときに発生します。

xr:handfound : {id、transform、attachmentPoints、vertices、normals、handKind}\\`。

**xr:handupdated**：ハンドが見つかったときに発生します。

xr:handupdated : {id、transform、attachmentPoints、vertices、normals、handKind}\\`。

**xr:handlost**：ハンドが追跡されなくなったときに発生します。

`xr:handlost : {id}`.

## 例 {#example}

```javascript
  let mesh = null

  // 追加のフェースARリソースのローディング開始時に発火。
  this.app.on('xr:handloading', ({maxDetections, pointsPerDetection, indices, uvs}) => {
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

  // その後にハンドが見つかったときに発生します。
  this.app.on('xr:handupdated', ({id, transform, attachmentPoints, vertices, normals, handKind}) => {
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
