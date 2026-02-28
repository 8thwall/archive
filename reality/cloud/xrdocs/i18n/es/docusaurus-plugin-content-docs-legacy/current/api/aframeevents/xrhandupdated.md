# xrhandupdated

## Descripción {#description}

Este evento es emitido por [`xrhand`](/legacy/api/aframe/#hand-tracking) cuando la mano es encontrada posteriormente.

\`xrhandupdated.detail : {id, transform, vertices, normales, handKind, attachmentPoints}\`\`

| Propiedad                                                                                 | Descripción                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id                                                                                        | Id numérico de la mano localizada.                                                                                                                                                                                   |
| transformar: `{position, rotation, scale}`                                | Transformar información de la mano localizada.                                                                                                                                                                       |
| vértices: [{x, y, z}] | Posición de los puntos de la mano, relativa a la transformación.                                                                                                                                                     |
| normales: [{x, y, z}] | Dirección normal de los vértices, relativa a la transformación.                                                                                                                                                      |
| handKind                                                                                  | Representación numérica de la lateralidad de la mano localizada. Los valores válidos son 0 (sin especificar), 1 (izquierda) y 2 (derecha).  |
| attachmentPoints: { nombre, posición: {x,y,z} }           | Véase [`XR8.HandController.AttachmentPoints`](/legacy/api/handcontroller/attachmentpoints) para consultar la lista de puntos de fijación disponibles. La `posición` es relativa a la transformación. |

`transform` es un objeto con las siguientes propiedades:

| Propiedad             | Descripción                                                                           |
| --------------------- | ------------------------------------------------------------------------------------- |
| posición {x, y, z}    | La posición 3d de la mano localizada.                                 |
| rotación {w, x, y, z} | La orientación local 3d de la mano localizada.                        |
| escala                | Factor de escala que debe aplicarse a los objetos unidos a esta mano. |

`attachmentPoints` es un objeto con las siguientes propiedades:

| Propiedad             | Descripción                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nombre                | Nombre del punto de fijación. Véase [`XR8.HandController.AttachmentPoints`](/legacy/api/handcontroller/attachmentpoints) para consultar la lista de puntos de fijación disponibles. |
| posición {x, y, z}    | La posición 3d del punto de enganche en la mano localizada.                                                                                                                                         |
| rotación {w, x, y, z} | El cuaternión de rotación que rota el vector Y positivo al vector óseo del punto de fijación.                                                                                                       |
| innerPoint {x, y, z}  | Punto interior de un punto de enganche. (ej. mano palma lado)                                                                                                    |
| outerPoint {x, y, z}  | Punto exterior de un punto de enganche. (ej. dorso de la mano)                                                                                                   |
| radio                 | El radio de los puntos de fijación de los dedos.                                                                                                                                                    |
| minorRadius           | El radio más corto desde la superficie de la mano hasta el punto de fijación de la muñeca.                                                                                                          |
| majorRadius           | El radio más largo desde la superficie de la mano hasta el punto de fijación de la muñeca.                                                                                                          |

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
    }
    const hide = ({detail}) => { object3D.visible = false }
    this.el.sceneEl.addEventListener('xrhandfound', show)
    this.el.sceneEl.addEventListener('xrhandupdated', show)
    this.el.sceneEl.addEventListener('xrhandlost', hide)
  }
}
```
