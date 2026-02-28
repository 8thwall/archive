# エックスアールファセロスト

## 説明 {#description}

このイベントは[`xrface`](/legacy/api/aframe/#face-effects)によって、顔が追跡されなくなったときに発行される。

`xrfacelost.detail : {id}`.

| プロパティ | 説明          |
| ----- | ----------- |
| アイドル  | 失われた顔の数値ID。 |

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
