# xrfacefound

## Beschreibung {#description}

Dieses Ereignis wird von [`xrface`](/api/aframe/#face-effects) ausgelöst, wenn ein Gesicht zum ersten Mal gefunden wird.

`xrfacefound.detail : {id, transform, vertices, normals, attachmentPoints}`

| Eigentum                                                                         | Beschreibung                                                                                                                                                                          |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                                                               | Eine numerische ID der gefundenen Fläche.                                                                                                                                             |
| transform: `{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}` | Transformieren Sie die Informationen der gefundenen Fläche.                                                                                                                           |
| vertices: [{x, y, z}]                                                            | Position der Gesichtspunkte, relativ zur Transformation.                                                                                                                              |
| normals: [{x, y, z}]                                                             | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                      |
| attachmentPoints: `{ name, position: {x,y,z} }`                                  | Siehe [`XR8.FaceController.AttachmentPoints`](/api/facecontroller/attachmentpoints) für eine Liste der verfügbaren Befestigungspunkte. `die Position` ist relativ zur Transformation. |
| uvsInCameraFrame `[{u, v}]`                                                      | Die Liste der uv-Positionen im Kamerabild, die den zurückgegebenen Scheitelpunkten entsprechen.                                                                                       |

`transform` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum              | Beschreibung                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| position {x, y, z}    | Die 3d-Position der gefundenen Fläche.                                                               |
| rotation {w, x, y, z} | Die lokale 3d-Ausrichtung der georteten Fläche.                                                      |
| scale                 | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die mit dieser Fläche verbunden sind. |
| scaledWidth           | Ungefähre Breite des Kopfes in der Szene, multipliziert mit dem Maßstab.                             |
| scaledHeight          | Ungefähre Höhe des Kopfes in der Szene, multipliziert mit dem Maßstab.                               |
| scaledDepth           | Ungefähre Tiefe des Kopfes in der Szene, multipliziert mit dem Maßstab.                              |

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
