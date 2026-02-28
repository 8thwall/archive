# 失われたxrhandlost

## 説明 {#description}

このイベントは[`xrhand`](/legacy/api/aframe/#hand-tracking)によって、ハンドがトラッキングされなくなったときに発行される。

`xrhandlost.detail : {id}`.

| プロパティ | 説明          |
| ----- | ----------- |
| アイドル  | 失われた手の数値ID。 |

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
