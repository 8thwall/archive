# xrfacescanning

## 説明 {#description}

このイベントは、すべての顔ARリソースがロードされ、スキャンが開始されると、[`xrface`](/legacy/api/aframe/#face-effects)によって発行される。

`xrfacescanning.detail : {maxDetections, pointsPerDetection, indices, uvs}`.

| プロパティ                                                                        | 説明                                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 最大検出数                                                                        | 同時に処理できる面の最大数。                                               |
| ポイント・パー・ディテクション                                                              | 面ごとに抽出される頂点の数。                                               |
| インデックスを作成した：[{a, b, c}]。 | configureのmeshGeometryで指定された、要求されたメッシュの三角形を形成する頂点配列へのインデックス。 |
| uvs：[{u, v}]             | 返された頂点ポイントに対応するテクスチャ・マップのuv位置。                               |

## 例 {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection, uvs, indices} = detail
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection, uvs, indices}))
}
this.el.sceneEl.addEventListener('xrfacescanning', initMesh)
```
