# xrhandlost

## Descripción {#description}

Este evento es emitido por [`xrhand`](/legacy/api/aframe/#hand-tracking) cuando una mano deja de ser rastreada.

`xrhandlost.detail : {id}`

| Propiedad | Descripción                                                           |
| --------- | --------------------------------------------------------------------- |
| id        | Identificación numérica de la mano que se ha perdido. |

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
    }
    const hide = ({detail}) => { object3D.visible = false }
    this.el.sceneEl.addEventListener('xrhandfound', show)
    this.el.sceneEl.addEventListener('xrhandupdated', show)
    this.el.sceneEl.addEventListener('xrhandlost', hide)
  }
}
```
