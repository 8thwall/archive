# xrhandlost

## Descripción {#description}

Este evento lo emite [`xrhand`](/api/aframe/#hand-tracking) cuando se deja de seguir una mano.

`xrhandlost.detail : {id}`

| Propiedad | Descripción                                           |
| --------- | ----------------------------------------------------- |
| id        | Una identificación numérica de la mano que se perdió. |

## Ejemplo {#example}

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
 }}
    const hide = ({detail}) => { object3D.visible = false }
    this.el.sceneEl.addEventListener('xrhandfound', show)
    this.el.sceneEl.addEventListener('xrhandupdated', mostrar)
    this.el.sceneEl.addEventListener('xrhandlost', ocultar)
 }
```
