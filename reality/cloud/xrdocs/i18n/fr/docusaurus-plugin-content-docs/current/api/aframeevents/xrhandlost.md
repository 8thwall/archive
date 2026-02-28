# xrhandlost

## Description {#description}

Cet événement est émis par [`xrhand`](/api/aframe/#hand-tracking) lorsqu'une main n'est plus suivie.

`xrhandlost.detail : {id}`

| Propriété | Description                                |
| --------- | ------------------------------------------ |
| id        | Numéro d'identification de la main perdue. |

## Exemple {#example}

```javascript
const handRigidComponent = {
  init : function () {
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
  }
}
```
