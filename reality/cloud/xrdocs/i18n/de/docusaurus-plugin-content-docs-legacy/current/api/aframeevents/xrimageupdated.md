# xrimageupdated

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn ein Bildziel seine Position, Drehung oder Skalierung ändert.

`imageupdated.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Eigentum                              | Beschreibung                                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Name                                  | Der Name des Bildes.                                                                        |
| Typ                                   | Eine von "FLAT", "CYLINDRICAL", "CONICAL".                                                  |
| Position: `{x, y, z}` | Die 3d-Position des georteten Bildes.                                                       |
| Drehung: "w, x, y, z  | Die lokale 3D-Ausrichtung des georteten Bildes.                                             |
| Skala                                 | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll. |

Wenn Typ = `FLAT`:

| Eigentum        | Beschreibung                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------- |
| skalierteBreite | Die Breite des Bildes in der Szene, multipliziert mit dem Maßstab.             |
| scaledHeight    | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |

Wenn type= `CYLINDRICAL` oder `CONICAL`:

| Eigentum         | Beschreibung                                                       |
| ---------------- | ------------------------------------------------------------------ |
| Höhe             | Höhe der gekrümmten Zielscheibe.                   |
| radiusTop        | Radius der gekrümmten Zielscheibe am oberen Rand.  |
| radiusBottom     | Radius der gekrümmten Zielscheibe am unteren Rand. |
| arcStartRadian   | Startwinkel in Radiant.                            |
| arcLengthRadians | Zentralwinkel in Radiant.                          |

## Beispiel {#example}

```javascript
AFRAME.registerComponent('my-named-image-target', {
  schema: {
    name: { type: 'string' }
  },
  init: function () {
    const object3D = this.el.object3D
    const name = this.data.name
    object3D.visible = false

    const showImage = ({detail}) => {
      if (name != detail.name) {
        return
      }
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
      object3D.visible = true
    }

    const hideImage = ({detail}) => {
      if (name != detail.name) {
        return
      }
      object3D.visible = false
    }

    this.el.sceneEl.addEventListener('xrimagefound', showImage)
    this.el.sceneEl.addEventListener('xrimageupdated', showImage)
    this.el.sceneEl.addEventListener('xrimagelost', hideImage)
  }
})
```
