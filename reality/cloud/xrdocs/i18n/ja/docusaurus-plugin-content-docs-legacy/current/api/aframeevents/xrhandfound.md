# エクスルハンドファウンド

## 説明 {#description}

このイベントはハンドが最初に見つかったときに [`xrhand`](/legacy/api/aframe/#hand-tracking)によって発行される。

`xrhandfound.detail : {id、transform、頂点、法線、handKind、attachmentPoints}`。

| プロパティ                                                                                | 説明                                                                                                                                                       |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| アイドル                                                                                 | 位置する手の数値ID。                                                                                                                                              |
| を変換する：{position, rotation, scale}\\`                                                | 位置する手の情報を変換する。                                                                                                                                           |
| 頂点：[{x, y, z}]                   | ハンドポイントの位置、トランスフォームに対する相対位置。                                                                                                                             |
| 法線: [{x, y, z}]。 | トランスフォームに対する頂点の法線方向。                                                                                                                                     |
| ハンドカインド                                                                              | 手の位置を数値で表したもの。 有効な値は0（指定なし）、1（左）、2（右）。                                                                                                                   |
| attachmentPoints：名前、位置： {x,y,z} }\\`                                                | 利用可能なアタッチメントポイントのリストについては、[`XR8.HandController.AttachmentPoints`](/legacy/api/handcontroller/attachmentpoints) を参照してください。 position\`はトランスフォームからの相対位置である。 |

transform\\`は以下のプロパティを持つオブジェクトである：

| プロパティ                            | 説明                                |
| -------------------------------- | --------------------------------- |
| ポジション {x, y, z}                  | 位置する手の3Dポジション。                    |
| 回転 {w, x, y, z}. | 配置された手の3次元の局所的な向き。                |
| スケール                             | この手に取り付けられたオブジェクトに適用されるスケールファクター。 |

attachmentPoints\\`は以下のプロパティを持つオブジェクトである：

| プロパティ                            | 説明                                                                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 名称                               | アタッチメントポイントの名前。 アタッチメントポイントの名前。 利用可能なアタッチメントポイントのリストについては、[`XR8.HandController.AttachmentPoints`](/legacy/api/handcontroller/attachmentpoints) を参照してください。 |
| ポジション {x, y, z}                  | 位置する手の取り付け位置の3Dポジション。                                                                                                                                     |
| 回転 {w, x, y, z}. | 正Yベクトルを取り付け点の骨ベクトルに回転させる回転クォータニオン。                                                                                                                        |
| innerPoint {x, y, z}             | アタッチメントポイントの内側の点。 (例：手のひら側）                                                                                                            |
| outerPoint {x, y, z}             | アタッチメントポイントの外側の点。 (例：手の甲） (例：手の甲）                                                                                   |
| 半径                               | 指の取り付け点の半径。                                                                                                                                               |
| 小半径                              | 手の表面から手首の取り付け点までの最短半径。                                                                                                                                    |
| 主要半径                             | 手の表面から手首の取り付け点までの最長半径。                                                                                                                                    |

## 例 {#example}

```javascript
const handRigidComponent = {
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
    this.el.sceneEl.addEventListener('xrhandfound', show)
    this.el.sceneEl.addEventListener('xrhandupdated', show)
    this.el.sceneEl.addEventListener('xrhandlost', hide)
  }.
}
```
