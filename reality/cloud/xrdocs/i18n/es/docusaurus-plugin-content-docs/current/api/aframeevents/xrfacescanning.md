# xrfacescanning

## Descripción {#description}

Este evento lo emite [`xrface`](/api/aframe/#face-effects) cuando se han cargado todos los recursos de AR facial y ha comenzado el escaneado.

`xrfacescanning.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Propiedad            | Descripción                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections        | El número máximo de caras que se pueden procesar simultáneamente.                                                                         |
| pointsPerDetection   | Número de vértices que se extraerán por cara.                                                                                             |
| indices: [{a, b, c}] | Índices en la matriz de vértices que forman los triángulos de la malla solicitada, tal como se especifica con meshGeometry en configurar. |
| uvs: [{u, v}]        | posiciones uv en un mapa de textura correspondiente a los puntos de vértice devueltos.                                                    |

## Ejemplo {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection, uvs, indices} = detail
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection, uvs, indices}))
}
this.el.sceneEl.addEventListener('xrfacescanning', initMesh)
```
