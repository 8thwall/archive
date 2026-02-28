# xrimagefound

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn ein Bildziel zum ersten Mal gefunden wird.

`imagefound.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Eigentum                 | Beschreibung                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| name                     | Der Name des Bildes.                                                                        |
| typ                      | Eine von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`                                          |
| position: `{x, y, z}`    | Die 3d-Position des georteten Bildes.                                                       |
| rotation: `{w, x, y, z}` | Die lokale 3d-Ausrichtung des georteten Bildes.                                             |
| scale                    | Ein Skalierungsfaktor, der auf das an dieses Bild angehängte Objekt angewendet werden soll. |

Wenn Typ = `FLAT`:

| Eigentum     | Beschreibung                                                                     |
| ------------ | -------------------------------------------------------------------------------- |
| scaledWidth  | Die Breite des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |
| scaledHeight | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird.   |

Wenn type= `CYLINDRICAL` oder `CONICAL`:

| Eigentum         | Beschreibung                                 |
| ---------------- | -------------------------------------------- |
| height           | Höhe des gebogenen Ziels.                    |
| radiusTop        | Radius des gebogenen Ziels oben.             |
| radiusBottom     | Radius des gekrümmten Ziels am unteren Rand. |
| arcStartRadians  | Startwinkel in Radiant.                      |
| arcLengthRadians | Zentraler Winkel in Radiant.                 |

## Beispiel {#example}

```javascript
AFRAME.registerComponent('mein-named-image-target', {
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
