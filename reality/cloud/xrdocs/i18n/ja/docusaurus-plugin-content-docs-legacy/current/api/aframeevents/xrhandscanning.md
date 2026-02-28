# xrhandscanning

## 説明 {#description}

このイベントは、すべてのハンドARリソースがロードされ、スキャンが開始されると、[`xrhand`](/legacy/api/aframe/#hand-tracking)によって発行される。

`xrhandscanning.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`.

| プロパティ                                                                         | 説明                           |
| ----------------------------------------------------------------------------- | ---------------------------- |
| 最大検出数                                                                         | 同時に処理できるハンドの最大数。             |
| ポイント・パー・ディテクション                                                               | ハンドごとに抽出される頂点の数。             |
| rightIndices：[{a, b, c}]。 | 手のメッシュの三角形を形成する頂点配列へのインデックス。 |
| leftIndices：[{a, b, c}]。  | 手のメッシュの三角形を形成する頂点配列へのインデックス。 |

## 例 {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection} = detail
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection}))
}
this.el.sceneEl.addEventListener('xrhandscanning', initMesh)
```
