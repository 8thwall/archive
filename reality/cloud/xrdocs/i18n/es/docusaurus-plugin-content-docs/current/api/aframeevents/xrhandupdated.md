# xrhandactualizado

## Descripción {#description}

Este evento lo emite [`xrhand`](/api/aframe/#hand-tracking) cuando posteriormente se encuentra la mano.

`xrhandupdated.detail : {id, transform, vertices, normals, handKind, attachmentPoints}`

| Propiedad                                        | Descripción                                                                                                                                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                               | Un identificador numérico de la mano localizada.                                                                                                                                        |
| transformar: `{position, rotation, scale}`       | Transforma la información de la mano localizada.                                                                                                                                        |
| vértices: [{x, y, z}]                            | Posición de los puntos de la mano, relativa a la transformación.                                                                                                                        |
| normales: [{x, y, z}]                            | Dirección normal de los vértices, relativa a la transformación.                                                                                                                         |
| handKind                                         | Una representación numérica de la lateralidad de la mano localizada. Los valores válidos son 0 (sin especificar), 1 (izquierda) y 2 (derecha).                                          |
| puntos de fijación: { name, position: {x,y,z} } | Consulta [`XR8.HandController.AttachmentPoints`](/api/handcontroller/attachmentpoints) para ver la lista de puntos de fijación disponibles. `position` es relativa a la transformación. |

`transform` es un objeto con las siguientes propiedades:

| Propiedad             | Descripción                                                           |
| --------------------- | --------------------------------------------------------------------- |
| position {x, y, z}    | La posición 3d de la mano localizada.                                 |
| rotation {w, x, y, z} | La orientación local 3d de la mano localizada.                        |
| scale                 | Factor de escala que debe aplicarse a los objetos unidos a esta mano. |

`attachmentPoints` es un objeto con las siguientes propiedades:

| Propiedad             | Descripción                                                                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                  | El nombre del punto de fijación. Consulta [`XR8.HandController.AttachmentPoints`](/api/handcontroller/attachmentpoints) para ver la lista de puntos de fijación disponibles. |
| position {x, y, z}    | La posición 3d del punto de enganche en la mano localizada.                                                                                                                  |
| rotation {w, x, y, z} | El cuaternión de rotación que gira el vector Y positivo al vector hueso del punto de fijación.                                                                               |
| innerPoint {x, y, z}  | El punto interior de un punto de enganche. (ej. mano palma lado)                                                                                                             |
| outerPoint {x, y, z}  | El punto exterior de un punto de enganche. (ej. dorso de la mano)                                                                                                            |
| radio                 | El radio de los puntos de fijación de los dedos.                                                                                                                             |
| radio menor           | El radio más corto desde la superficie de la mano hasta el punto de fijación de la muñeca.                                                                                   |
| radioMayor            | El radio más largo desde la superficie de la mano hasta el punto de fijación de la muñeca.                                                                                   |

## Ejemplo {#example}

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
 }}
    const hide = ({detail}) => { object3D.visible = false }
    this.el.sceneEl.addEventListener('xrhandfound', show)
    this.el.sceneEl.addEventListener('xrhandupdated', mostrar)
    this.el.sceneEl.addEventListener('xrhandlost', ocultar)
 }
```
