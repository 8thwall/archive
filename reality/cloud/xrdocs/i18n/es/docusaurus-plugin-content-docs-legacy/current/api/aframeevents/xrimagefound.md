# xrimagefound

## Descripción {#description}

Este evento es emitido por [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando se encuentra por primera vez un objetivo de imagen.

`imagefound.detail : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

| Propiedad                                    | Descripción                                                                               |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| nombre                                       | El nombre de la imagen.                                                   |
| tipo                                         | Una de `'PLANA'`, `'CILÍNDRICA'`, `'CÓNICA'`.                             |
| posición: `{x, y, z}`        | La posición 3d de la imagen localizada.                                   |
| rotación: \`{w, x, y, z}\`\` | La orientación local 3d de la imagen localizada.                          |
| escala                                       | Factor de escala que debe aplicarse a los objetos adjuntos a esta imagen. |

Si tipo = `FLAT`:

| Propiedad    | Descripción                                                                       |
| ------------ | --------------------------------------------------------------------------------- |
| scaledWidth  | La anchura de la imagen en la escena, multiplicada por la escala. |
| scaledHeight | La altura de la imagen en la escena, multiplicada por la escala.  |

Si type= `CYLINDRICAL` o `CONICAL`:

| Propiedad        | Descripción                                                   |
| ---------------- | ------------------------------------------------------------- |
| altura           | Altura del blanco curvo.                      |
| radiusTop        | Radio de la diana curva en la parte superior. |
| radiusBottom     | Radio de la diana curva en la parte inferior. |
| arcStartRadians  | Ángulo inicial en radianes.                   |
| arcLengthRadians | Ángulo central en radianes.                   |

## Ejemplo {#example}

```javascript
AFRAME.registerComponent('mi-nombre-imagen-objetivo', {
  schema: {
    nombre: { type: 'string' }
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
