# xrimagelost

## Descripción {#description}

Este evento lo emite [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando un objetivo de imagen deja de ser rastreado.

`imagelost.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propiedad                | Descripción                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| name                     | El nombre de la imagen.                                              |
| type                     | Una de `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.`                     |
| position: `{x, y, z}`    | La posición 3d de la imagen localizada.                              |
| rotation: `{w, x, y, z}` | La orientación local 3d de la imagen localizada.                     |
| scale                    | Factor de escala que debe aplicarse al objeto adjunto a esta imagen. |

Si tipo = `FLAT`:

| Propiedad    | Descripción                                                       |
| ------------ | ----------------------------------------------------------------- |
| scaledWidth  | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | La altura de la imagen en la escena, multiplicada por la escala.  |

Si tipo= `CILÍNDRICA` o `CÓNICA`:

| Propiedad        | Descripción                                    |
| ---------------- | ---------------------------------------------- |
| height           | Altura del objetivo curvo.                     |
| radiusTop        | Radio del objetivo curvo en la parte superior. |
| radiusBottom     | Radio del objetivo curvo en la parte inferior. |
| arcStartRadians  | Ángulo inicial en radianes.                    |
| arcLengthRadians | Ángulo central en radianes.                    |

## Ejemplo {#example}

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
