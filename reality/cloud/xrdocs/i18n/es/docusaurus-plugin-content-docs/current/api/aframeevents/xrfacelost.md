# xrfacelost

## Descripción {#description}

Este evento lo emite [`xrface`](/api/aframe/#face-effects) cuando se deja de seguir una cara.

`xrfacelost.detail : {id}`

| Propiedad | Descripción                                           |
| --------- | ----------------------------------------------------- |
| id        | Una identificación numérica de la cara que se perdió. |

## Ejemplo {#example}

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
  }
}
```
