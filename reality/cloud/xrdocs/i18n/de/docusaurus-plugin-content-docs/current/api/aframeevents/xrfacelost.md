# xrfacelost

## Beschreibung {#description}

Dieses Ereignis wird von [`xrface`](/api/aframe/#face-effects) ausgelöst, wenn ein Gesicht nicht mehr verfolgt wird.

`xrfacelost.detail : {id}`

| Eigentum | Beschreibung                                |
| -------- | ------------------------------------------- |
| id       | Eine numerische ID des verlorenen Gesichts. |

## Beispiel {#example}

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
