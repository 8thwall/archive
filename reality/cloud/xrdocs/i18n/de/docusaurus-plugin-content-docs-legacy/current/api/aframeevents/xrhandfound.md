# xrhandfound

## Beschreibung {#description}

Dieses Ereignis wird von [`xrhand`](/legacy/api/aframe/#hand-tracking) ausgelöst, wenn eine Hand zum ersten Mal gefunden wird.

`xrhandfound.detail : {id, transform, vertices, normals, handKind, attachmentPoints}`

| Eigentum                                                                                        | Beschreibung                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                                                                              | Eine numerische ID der gefundenen Hand.                                                                                                                                                                       |
| transformieren: `{position, rotation, scale}`                                   | Transformieren Sie die Informationen der gefundenen Hand.                                                                                                                                                     |
| Scheitelpunkte: [{x, y, z}] | Position der Handpunkte, relativ zur Transformation.                                                                                                                                                          |
| Normalen: [{x, y, z}]       | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                                              |
| handKind                                                                                        | Eine numerische Darstellung der Händigkeit der gefundenen Hand. Gültige Werte sind 0 (nicht spezifiziert), 1 (links) und 2 (rechts). |
| attachmentPoints: `{ name, position: {x,y,z} }`                                 | Siehe [`XR8.HandController.AttachmentPoints`](/legacy/api/handcontroller/attachmentpoints) für die Liste der verfügbaren Befestigungspunkte. Der Name des Befestigungspunktes.                |

transform" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum             | Beschreibung                                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Position {x, y, z}   | Die 3d-Position der befindlichen Hand.                                                            |
| Drehung {w, x, y, z} | Die lokale 3D-Orientierung der lokalisierten Hand.                                                |
| Skala                | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die an dieser Hand befestigt sind. |

AttachmentPoints" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum             | Beschreibung                                                                                                                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                 | Der Name des Befestigungspunktes. Siehe [`XR8.HandController.AttachmentPoints`](/legacy/api/handcontroller/attachmentpoints) für die Liste der verfügbaren Befestigungspunkte. |
| Position {x, y, z}   | Die 3d-Position des Befestigungspunktes an der befindlichen Hand.                                                                                                                              |
| Drehung {w, x, y, z} | Die Rotationsquaternion, die den positiven Y-Vektor zum Bone-Vektor des Befestigungspunkts dreht.                                                                                              |
| innerPoint {x, y, z} | Der innere Punkt eines Befestigungspunktes. (z.B. Handflächenseite)                                                                         |
| outerPoint {x, y, z} | Der äußere Punkt eines Befestigungspunktes. (z. B. Handrücken)                                                                              |
| Radius               | Der Radius der Fingerbefestigungspunkte.                                                                                                                                                       |
| minorRadius          | Der kürzeste Radius von der Handoberfläche bis zum Befestigungspunkt am Handgelenk.                                                                                                            |
| majorRadius          | Der längste Radius von der Handoberfläche bis zum Befestigungspunkt am Handgelenk.                                                                                                             |

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
