# xrfaceupdated

## Descripción {#description}

Este evento lo emite [`xrface`](/api/aframe/#face-effects) cuando posteriormente se encuentra la cara.

`xrfaceupdated.detail : {id, transform, vertices, normals, attachmentPoints}`

| Propiedad                                                                        | Descripción                                                                                                                                                                             |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                                                               | Un identificador numérico de la cara localizada.                                                                                                                                        |
| transform: `{position, rotation, scale, scaledWidth, scaledHeight, scaledDepth}` | Información de transformación de la cara localizada.                                                                                                                                    |
| vertices: [{x, y, z}]                                                            | Posición de los puntos de la cara, relativa a la transformación.                                                                                                                        |
| normals: [{x, y, z}]                                                             | Dirección normal de los vértices, relativa a la transformación.                                                                                                                         |
| attachmentPoints: { name, position: {x,y,z} }                                    | Consulta [`XR8.FaceController.AttachmentPoints`](/api/facecontroller/attachmentpoints) para ver la lista de puntos de fijación disponibles. `position` es relativa a la transformación. |
| uvsInCameraFrame `[{u, v}]`                                                      | La lista de posiciones uv en el fotograma de la cámara correspondientes a los puntos de vértice devueltos.                                                                              |

`transform` es un objeto con las siguientes propiedades:

| Propiedad             | Descripción                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| position {x, y, z}    | La posición 3d de la cara localizada.                                                |
| rotation {w, x, y, z} | La orientación local 3d de la cara localizada.                                       |
| scale                 | Factor de escala que debe aplicarse a los objetos unidos a esta cara.                |
| scaledWidth           | Anchura aproximada de la cabeza en la escena multiplicada por la escala.             |
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
