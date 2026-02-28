# エクスリマゲローディング

## 説明 {#description}

このイベントは、検出画像のロードが開始されると、[`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps)によって発行されます。

`imageloading.detail : { imageTargets： {name, type, metadata} }`

| プロパティ | 説明                                        |
| ----- | ----------------------------------------- |
| 名称    | 画像の名前。                                    |
| タイプ   | FLAT'`、'CYLINDRICAL'`、'CONICAL'\\`のいずれか。 |
| メタデータ | ユーザーのメタデータ。                               |

## 例 {#example}

```javascript
const componentMap = {}

const addComponents = ({detail}) => {
  detail.imageTargets.forEach(({name, type, metadata}) => {
    // ....
  })
}

this.el.sceneEl.addEventListener('xrimageloading', addComponents)
```
