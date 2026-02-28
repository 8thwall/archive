# xrfaceupdated

## Beschreibung {#description}

Dieses Ereignis wird von [`xrface`](/legacy/api/aframe/#face-effects) ausgelöst, wenn das Gesicht anschließend gefunden wird.

`xrfaceupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

| Eigentum                                                                                                   | Beschreibung                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                                                                                         | Eine numerische Kennung für die gefundene Fläche.                                                                                                                                                           |
| transformieren: `{Position, Rotation, Skalierung, scaledWidth, scaledHeight, scaledDepth}` | Transformationsinformationen der gefundenen Fläche.                                                                                                                                                         |
| Scheitelpunkte: [{x, y, z}]            | Position der Gesichtspunkte, relativ zur Transformation.                                                                                                                                                    |
| Normalen: [{x, y, z}]                  | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                                            |
| attachmentPoints: { name, position: {x,y,z} }                              | Siehe [`XR8.FaceController.AttachmentPoints`](/legacy/api/facecontroller/attachmentpoints) für die Liste der verfügbaren Befestigungspunkte. Die "Position" ist relativ zur Transformation. |
| uvsInCameraFrame `[{u, v}]`                                                                                | Die Liste der uv-Positionen im Kamerabild, die den zurückgegebenen Scheitelpunkten entsprechen.                                                                                                             |

transform" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum             | Beschreibung                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Position {x, y, z}   | Die 3d-Position der gefundenen Fläche.                                                               |
| Drehung {w, x, y, z} | Die lokale 3D-Orientierung der gefundenen Fläche.                                                    |
| Skala                | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die mit dieser Fläche verbunden sind. |
| skalierteBreite      | Ungefähre Breite des Kopfes in der Szene, multipliziert mit dem Maßstab.                             |
| scaledHeight         | Ungefähre Höhe des Kopfes in der Szene, multipliziert mit dem Maßstab.                               |
| scaledDepth          | Ungefähre Tiefe des Kopfes in der Szene bei Multiplikation mit dem Maßstab.                          |

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
