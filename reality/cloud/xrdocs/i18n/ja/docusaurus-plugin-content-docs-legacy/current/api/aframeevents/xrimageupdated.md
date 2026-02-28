# xrimage更新

## 説明 {#description}

このイベントは[`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps)によって、画像ターゲットの位置、回転、スケールが変更されたときに発行されます。

`imageupdated.detail : { name、type、position、rotation、scale、scaledWidth、scaledHeight、height、radiusTop、radiusBottom、arcStartRadians、arcLengthRadians }` 。

| プロパティ                                               | 説明                                        |
| --------------------------------------------------- | ----------------------------------------- |
| 名称                                                  | 画像の名前。                                    |
| タイプ                                                 | FLAT'`、'CYLINDRICAL'`、'CONICAL'\\`のいずれか。 |
| position: `{x, y, z}`               | 配置された画像の3次元位置。                            |
| 回転: `{w, x, y, z}`. | 配置された画像の3次元の局所的な向き。                       |
| スケール                                                | この画像に添付されているオブジェクトに適用されるスケールファクター。        |

type = `FLAT` の場合：

| プロパティ    | 説明                      |
| -------- | ----------------------- |
| 拡大幅      | シーン内の画像の幅（scaleを掛けた場合）。 |
| スケールドハイト | Scaleを掛けたときのシーン内の画像の高さ。 |

type= `CYLINDRICAL` または `CONICAL` の場合：

| プロパティ     | 説明                |
| --------- | ----------------- |
| 高さ        | カーブしたターゲットの高さ。    |
| 半径トップ     | 上部のカーブしたターゲットの半径。 |
| 底半径       | 下部のカーブしたターゲットの半径。 |
| アーク開始ラジアン | ラジアン単位の開始角度。      |
| 弧長ラジアン    | ラジアン単位の中心角。       |

## 例 {#example}

```javascript
AFRAME.registerComponent('my-named-image-target', {
  schema：{
    name： { type: 'string' }
  },
  init: function () {
    const object3D = this.el.object3D
    const name = this.data.name
    object3D.visible = false

    const showImage = ({detail}) => {
      if (name != detail.name) {
        return
      }
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
      object3D.visible = true
    }

    const hideImage = ({detail}) => {
      if (name != detail.name) {
        return
      }
      object3D.visible = false
    }

    this.el.sceneEl.addEventListener('xrimagefound', showImage)
    this.el.sceneEl.addEventListener('xrimageupdated', showImage)
    this.el.sceneEl.addEventListener('xrimagelost', hideImage)
  }.
})
```
