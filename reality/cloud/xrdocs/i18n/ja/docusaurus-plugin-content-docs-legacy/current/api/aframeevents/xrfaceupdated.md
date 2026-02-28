# xrface更新

## 説明 {#description}

このイベントは[`xrface`](/legacy/api/aframe/#face-effects)によって、その後顔が見つかったときに発行される。

`xrfaceupdated.detail : {id、transform、頂点、法線、attachmentPoints}`。

| プロパティ                                                                                | 説明                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| アイドル                                                                                 | 位置する面の数値ID。                                                                                                                                                                             |
| を変換します：位置、回転、スケール、scaledWidth、scaledHeight、scaledDepth}\\`。                         | 位置する顔の変形情報。                                                                                                                                                                             |
| 頂点：[{x, y, z}]                   | トランスフォームに対する顔点の位置。                                                                                                                                                                      |
| 法線: [{x, y, z}]。 | トランスフォームに対する頂点の法線方向。                                                                                                                                                                    |
| attachmentPoints：{name, position： {x,y,z} }                                          | 使用可能なアタッチメントポイントのリストについては、[`XR8.FaceController.AttachmentPoints`](/legacy/api/facecontroller/attachmentpoints) を参照してください。 position\`はトランスフォームからの相対位置である。 position`はトランスフォームからの相対位置である。 |
| uvsInCameraFrame `[{u, v}]`。                                                         | 返された頂点点に対応するカメラフレーム内の uv 位置のリスト。                                                                                                                                                        |

transform\\`は以下のプロパティを持つオブジェクトである：

| プロパティ                            | 説明                                  |
| -------------------------------- | ----------------------------------- |
| ポジション {x, y, z}                  | 位置する面の3Dポジション。                      |
| 回転 {w, x, y, z}. | 配置された面の3次元の局所的な向き。                  |
| スケール                             | この面に取り付けられているオブジェクトに適用されるスケールファクター。 |
| 拡大幅                              | スケールを掛けたときのシーン内の頭部のおおよその幅。          |
| スケールドハイト                         | スケールを掛けたときのシーン内の頭部のおおよその高さ。         |
| 深さ                               | スケールを掛けたときの、シーン内の頭部のおおよその深さ。        |

## 例 {#example}

```javascript
const faceRigidComponent = {
  init: function () {
    const object3D = this.el.object3D
    object3D.visible = false
    const show = ({detail}) => {
      const {position, rotation, scale} = detail.transform
      object3D.position.copy(position)
      object3D.quaternion.copy(rotation)
      object3D.scale.set(scale, scale, scale)
      object3D.visible = true
    }
    const hide = ({detail}) => { object3D.visible = false }
    this.el.sceneEl.addEventListener('xrfacefound', show)
    this.el.sceneEl.addEventListener('xrfaceupdated', show)
    this.el.sceneEl.addEventListener('xrfacelost', hide)
  }.
}
```
