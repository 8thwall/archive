# xrfaceactualizado

## Descripción {#description}

Este evento es emitido por [`xrface`](/legacy/api/aframe/#face-effects) cuando la cara es encontrada posteriormente.

\`xrfaceupdated.detail : {id, transform, vertices, normales, attachmentPoints}\`\`

| Propiedad                                                                                              | Descripción                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                                                                                     | Id numérico de la cara localizada.                                                                                                                                                                                |
| transformar: \`{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}\`\` | Información de transformación de la cara localizada.                                                                                                                                                              |
| vértices: [{x, y, z}]              | Posición de los puntos de la cara, relativa a la transformación.                                                                                                                                                  |
| normales: [{x, y, z}]              | Dirección normal de los vértices, relativa a la transformación.                                                                                                                                                   |
| attachmentPoints: { nombre, posición: {x,y,z} }                        | Consulte [`XR8.FaceController.AttachmentPoints`](/legacy/api/facecontroller/attachmentpoints) para ver la lista de puntos de fijación disponibles. La `posición` es relativa a la transformación. |
| uvsInCameraFrame `[{u, v}]`                                                                            | La lista de posiciones uv en el fotograma de la cámara correspondientes a los puntos de vértice devueltos.                                                                                                        |

`transform` es un objeto con las siguientes propiedades:

| Propiedad             | Descripción                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| posición {x, y, z}    | La posición 3d de la cara localizada.                                                |
| rotación {w, x, y, z} | La orientación local 3d de la cara localizada.                                       |
| escala                | Factor de escala que debe aplicarse a los objetos adjuntos a esta cara.              |
| scaledWidth           | Anchura aproximada de la cabeza en la escena cuando se multiplica por la escala.     |
| scaledHeight          | Altura aproximada de la cabeza en la escena multiplicada por la escala.              |
| scaledDepth           | Profundidad aproximada de la cabeza en la escena cuando se multiplica por la escala. |

## Ejemplo {#example}

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
