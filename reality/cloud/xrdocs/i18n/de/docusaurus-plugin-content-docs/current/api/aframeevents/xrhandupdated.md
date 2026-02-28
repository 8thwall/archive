# xrhandupdated

## Beschreibung {#description}

Dieses Ereignis wird von [`xrhand`](/api/aframe/#hand-tracking) ausgelöst, wenn die Hand anschließend gefunden wird.

`xrhandupdated.detail : {id, transform, vertices, normals, handKind, attachmentPoints}`

| Eigentum                                      | Beschreibung                                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                            | Eine numerische ID der gefundenen Hand.                                                                                                                                               |
| verwandeln: `{position, rotation, scale}`     | Transformieren Sie die Informationen der gefundenen Hand.                                                                                                                             |
| vertices: [{x, y, z}]                         | Position der Handpunkte, relativ zur Transformation.                                                                                                                                  |
| normals: [{x, y, z}]                          | Normale Richtung der Scheitelpunkte, relativ zur Transformation.                                                                                                                      |
| handKind                                      | Eine numerische Darstellung der Händigkeit der gefundenen Hand. Gültige Werte sind 0 (nicht spezifiziert), 1 (links) und 2 (rechts).                                                  |
| attachmentPoints: { name, position: {x,y,z} } | Siehe [`XR8.HandController.AttachmentPoints`](/api/handcontroller/attachmentpoints) für eine Liste der verfügbaren Befestigungspunkte. `die Position` ist relativ zur Transformation. |

`transform` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum              | Beschreibung                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| position {x, y, z}    | Die 3d-Position der liegenden Hand.                                                               |
| rotation {w, x, y, z} | Die lokale 3d-Ausrichtung der georteten Hand.                                                     |
| scale                 | Ein Skalierungsfaktor, der auf Objekte angewendet werden soll, die an dieser Hand befestigt sind. |

`attachmentPoints` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum              | Beschreibung                                                                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                  | Der Name des Anknüpfungspunkts. Siehe [`XR8.HandController.AttachmentPoints`](/api/handcontroller/attachmentpoints) für eine Liste der verfügbaren Befestigungspunkte. |
| position {x, y, z}    | Die 3d-Position des Befestigungspunktes an der gefundenen Hand.                                                                                                        |
| rotation {w, x, y, z} | Die Rotations-Quaternion, die den positiven Y-Vektor zum Bone-Vektor des Anheftungspunkts dreht.                                                                       |
| innerPoint {x, y, z}  | Der innere Punkt eines Befestigungspunktes. (z.B. Handflächenseite)                                                                                                    |
| outerPoint {x, y, z}  | Der äußere Punkt eines Befestigungspunktes. (z. B. Handrücken)                                                                                                         |
| radius                | Der Radius der Fingerbefestigungspunkte.                                                                                                                               |
| minorRadius           | Der kürzeste Radius von der Handoberfläche bis zum Befestigungspunkt am Handgelenk.                                                                                    |
| majorRadius           | Der längste Radius von der Handoberfläche bis zum Befestigungspunkt am Handgelenk.                                                                                     |

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
