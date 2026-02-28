# xrimageupdated

## Description {#description}

Cet événement est émis par [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsqu'une image cible change de position, de rotation ou d'échelle.

`imageupdated.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propriété                 | Description                                                          |
| ------------------------- | -------------------------------------------------------------------- |
| nom                       | Nom de l'image.                                                      |
| type                      | Un des éléments suivants : `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.` |
| position : `{x, y, z}`    | La position 3D de l'image localisée.                                 |
| rotation : `{w, x, y, z}` | L'orientation locale 3D de l'image localisée.                        |
| échelle                   | Facteur d'échelle à appliquer aux objets attachés à cette image.     |

Si le type = `FLAT` :

| Propriété                | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| largeur mise à l'échelle | La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | Hauteur de l'image dans la scène, multipliée par l'échelle.    |

Si type= `CYLINDRICAL` ou `CONICAL` :

| Propriété        | Description                         |
| ---------------- | ----------------------------------- |
| hauteur          | Hauteur de la cible incurvée.       |
| radiusTop        | Rayon de la cible incurvée en haut. |
| radiusBottom     | Rayon de la cible incurvée en bas.  |
| arcStartRadians  | Angle de départ en radians.         |
| arcLengthRadians | Angle central en radians.           |

## Exemple {#example}

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
