# xrhandlost

## Beschreibung {#description}

Dieses Ereignis wird von [`xrhand`](/legacy/api/aframe/#hand-tracking) ausgelöst, wenn eine Hand nicht mehr verfolgt wird.

`xrhandlost.detail : {id}`

| Eigentum | Beschreibung                                                    |
| -------- | --------------------------------------------------------------- |
| id       | Eine numerische Kennung für die verlorene Hand. |

## Beispiel {#example}

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
