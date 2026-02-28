# xrhandscanning

## Descripción {#description}

Este evento lo emite [`xrhand`](/api/aframe/#hand-tracking) cuando se han cargado todos los recursos AR de la mano y ha comenzado la exploración.

`xrhandscanning.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Propiedad                 | Descripción                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------- |
| maxDetections             | El número máximo de manos que se pueden procesar simultáneamente.                  |
| pointsPerDetection        | Número de vértices que se extraerán por mano.                                      |
| rightIndices: [{a, b, c}] | Índices de la matriz de vértices que forman los triángulos de la malla de la mano. |
| leftIndices: [{a, b, c}]  | Índices de la matriz de vértices que forman los triángulos de la malla de la mano. |

## Ejemplo {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection} = detalle
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection}))
}
this.el.sceneEl.addEventListener('xrhandscanning', initMesh)
```
